import { create } from 'zustand';
import { createCommonState, clearErrors, type CommonState } from '../../../lib/commonState';
import { handleError, AppError } from '../../../lib/errorHandler';
import { validateImageFile } from '../../../lib/imaging/validation';
import { formatVariantFilename } from '../lib/filenames';
import { ImageWorkerPool } from '../workers/pool';
import type {
  SourceImage,
  VariantItem,
  GeneratorOptions,
  OutputImageFormat,
} from '../types';

export const DEFAULT_OPTIONS: GeneratorOptions = {
  mode: 'fluid',
  fluidWidths: [320, 640, 960, 1280, 1920],
  fixedWidth: 800,
  includeOriginal: true,
  formats: {
    avif: true,
    webp: true,
    fallback: 'webp',
  },
  quality: {
    webp: 80,
    avif: 60,
    jpeg: 80,
    webpLossless: false,
    avifSpeed: 6,
  },
  sizesAttr: '100vw',
  snippet: {
    alt: '',
    prefix: '/images/',
    loading: 'lazy',
    fetchPriority: false,
    filenamePattern: '{name}-{device}.{ext}',
    outputLanguage: 'html',
  },
};

export type ResponsiveImageStore = CommonState & {
  source: SourceImage | null;
  sourceImageData: ImageData | null;
  options: GeneratorOptions;
  variants: VariantItem[];
  workerPool: ImageWorkerPool | null;
  activeTaskId: string | null;

  // Actions
  setOptions: (updater: (prev: GeneratorOptions) => GeneratorOptions) => void;
  loadSourceFile: (file: File) => Promise<void>;
  clearSource: () => void;
  cancelProcessing: () => void;
  runSingleVariantTest: (targetWidth: number, format: OutputImageFormat) => Promise<void>;
};

export const useResponsiveImageStore = create<ResponsiveImageStore>((set, get) => ({
  ...createCommonState(),
  source: null,
  sourceImageData: null,
  options: DEFAULT_OPTIONS,
  variants: [],
  workerPool: null,
  activeTaskId: null,

  setOptions: (updater) => {
    set((state) => ({ options: updater(state.options) }));
  },

  loadSourceFile: async (file: File) => {
    // Cancel any previous worker jobs
    get().cancelProcessing();

    set((state) => ({
      ...state,
      ...clearErrors(),
      loading: true,
      success: false,
      variants: [],
    }));

    try {
      const buffer = await file.arrayBuffer();
      const { format } = validateImageFile(file, buffer);

      const pool = new ImageWorkerPool(2);
      set({ workerPool: pool });

      const decoded = await pool.decodeSource(buffer, format);

      // Create preview object URL
      const previewUrl = URL.createObjectURL(file);
      const baseName = file.name.replace(/\.[^/.]+$/, '').trim() || 'image';

      const sourceInfo: SourceImage = {
        file,
        name: file.name,
        baseName,
        url: previewUrl,
        width: decoded.width,
        height: decoded.height,
        size: file.size,
        mimeType: file.type || `image/${format}`,
      };

      set({
        source: sourceInfo,
        sourceImageData: decoded.imageData,
        loading: false,
        success: true,
      });
    } catch (err: unknown) {
      const { message, fieldErrors } = handleError(err, {
        context: 'loadSourceFile',
      });
      set({
        loading: false,
        error: message,
        errors: fieldErrors,
      });
    }
  },

  clearSource: () => {
    const { source, variants, workerPool } = get();
    if (workerPool) {
      workerPool.cancelAll();
    }
    if (source?.url) {
      URL.revokeObjectURL(source.url);
    }
    variants.forEach((v) => {
      if (v.url) URL.revokeObjectURL(v.url);
    });

    set({
      ...createCommonState(),
      source: null,
      sourceImageData: null,
      variants: [],
      workerPool: null,
      activeTaskId: null,
    });
  },

  cancelProcessing: () => {
    const { workerPool } = get();
    if (workerPool) {
      workerPool.cancelAll();
    }
    set({
      workerPool: null,
      submitting: false,
      activeTaskId: null,
    });
  },

  runSingleVariantTest: async (targetWidth: number, format: OutputImageFormat) => {
    const { source, sourceImageData } = get();
    if (!source || !sourceImageData) {
      throw new AppError('No source image loaded');
    }

    set((state) => ({ ...state, submitting: true, activeTaskId: 'test-variant' }));

    const pool = new ImageWorkerPool(1);
    const aspectRatio = source.height / source.width;
    const targetHeight = Math.max(1, Math.round(targetWidth * aspectRatio));
    const taskId = `test-${format}-${targetWidth}`;

    const filename = formatVariantFilename(get().options.snippet.filenamePattern || '{name}-{device}.{ext}', {
      name: source.baseName,
      width: targetWidth,
      height: targetHeight,
      ext: format === 'jpeg' ? 'jpg' : format,
    });

    const testItem: VariantItem = {
      id: taskId,
      width: targetWidth,
      height: targetHeight,
      format,
      filename,
      quality: format === 'avif' ? 60 : 80,
      status: 'resizing',
    };

    set({ variants: [testItem] });

    try {
      const result = await pool.processVariant(
        taskId,
        sourceImageData,
        targetWidth,
        targetHeight,
        format,
        {
          quality: format === 'avif' ? 60 : 80,
          speed: 6,
        },
        (stage) => {
          set((state) => ({
            variants: state.variants.map((v) =>
              v.id === taskId ? { ...v, status: stage === 'verifying' ? 'encoding' : stage } : v
            ),
          }));
        }
      );

      const mime = format === 'jpeg' ? 'image/jpeg' : `image/${format}`;
      const blob = new Blob([result.buffer], { type: mime });
      const url = URL.createObjectURL(blob);
      const savings = Math.max(0, ((source.size - result.size) / source.size) * 100);

      set((state) => ({
        submitting: false,
        activeTaskId: null,
        variants: state.variants.map((v) =>
          v.id === taskId
            ? {
                ...v,
                status: 'done',
                blob,
                url,
                size: result.size,
                savingsPercent: parseFloat(savings.toFixed(1)),
              }
            : v
        ),
      }));
    } catch (err: unknown) {
      const { message } = handleError(err, { context: 'runSingleVariantTest' });
      set((state) => ({
        submitting: false,
        activeTaskId: null,
        variants: state.variants.map((v) =>
          v.id === taskId ? { ...v, status: 'failed', error: message } : v
        ),
      }));
    }
  },
}));
