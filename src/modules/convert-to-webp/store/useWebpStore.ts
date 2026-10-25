import { create } from 'zustand';
import { createCommonState, clearErrors, type CommonState } from '../../../lib/commonState';
import { handleError, AppError } from '../../../lib/errorHandler';
import { downloadBlob } from '../../../lib/download';
import heroImgSample from '../../../assets/hero.png';
import { convertImageToWebp, loadImageElement } from '../lib/converter';
import type { SourceImage, ConvertedData, ResizeMode, ViewMode, WebpConversionOptions } from '../types';

export type WebpConverterState = CommonState & {
  fileData: SourceImage | null;
  convertedData: ConvertedData | null;
  quality: number;
  scalePercent: number;
  resizeMode: ResizeMode;
  viewMode: ViewMode;
  sliderPosition: number;
  isDraggingSlider: boolean;
  copyFeedback: boolean;
  isDragOver: boolean;

  // Actions
  loadFile: (file: File) => Promise<void>;
  loadDemo: () => Promise<void>;
  clearFile: () => void;
  setQuality: (quality: number) => void;
  setResizeMode: (mode: ResizeMode) => void;
  setScalePercent: (scale: number) => void;
  setViewMode: (mode: ViewMode) => void;
  setSliderPosition: (position: number) => void;
  setIsDraggingSlider: (dragging: boolean) => void;
  setIsDragOver: (dragOver: boolean) => void;
  triggerConversion: () => Promise<void>;
  downloadWebp: () => void;
  copyBase64: () => Promise<void>;
};

let debounceTimer: ReturnType<typeof setTimeout> | null = null;

function scheduleStoreConversion(get: () => WebpConverterState) {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }
  debounceTimer = setTimeout(() => {
    get().triggerConversion();
  }, 120);
}

export const useWebpStore = create<WebpConverterState>((set, get) => ({
  ...createCommonState(),
  fileData: null,
  convertedData: null,
  quality: 80,
  scalePercent: 100,
  resizeMode: 'original',
  viewMode: 'split',
  sliderPosition: 50,
  isDraggingSlider: false,
  copyFeedback: false,
  isDragOver: false,

  loadFile: async (file: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      const err = new AppError('Please upload a valid image file (PNG, JPG, SVG, WebP, GIF).', {
        code: 'INVALID_FILE_TYPE',
      });
      handleError(err, { context: 'loadFile' });
      return;
    }

    set((state) => ({
      ...state,
      ...clearErrors(),
      loading: true,
      submitting: true,
      success: false,
    }));

    try {
      const url = URL.createObjectURL(file);
      const source = await loadImageElement(url, file.name, file.size);

      // Clean up previous converted URL if any
      const prevConverted = get().convertedData;
      if (prevConverted?.url) {
        URL.revokeObjectURL(prevConverted.url);
      }

      set({
        fileData: source,
        loading: false,
      });

      await get().triggerConversion();
    } catch (e) {
      const { message, fieldErrors } = handleError(e, { context: 'loadFile' });
      set((s) => ({ ...s, error: message, errors: fieldErrors, loading: false, submitting: false }));
    }
  },

  loadDemo: async () => {
    set((state) => ({
      ...state,
      ...clearErrors(),
      loading: true,
      submitting: true,
      success: false,
    }));

    try {
      const source = await loadImageElement(heroImgSample, 'sample-hero-asset.png', 13057);

      const prevConverted = get().convertedData;
      if (prevConverted?.url) {
        URL.revokeObjectURL(prevConverted.url);
      }

      set({
        fileData: source,
        loading: false,
      });

      await get().triggerConversion();
    } catch (e) {
      const { message, fieldErrors } = handleError(e, { context: 'loadDemo' });
      set((s) => ({ ...s, error: message, errors: fieldErrors, loading: false, submitting: false }));
    }
  },

  clearFile: () => {
    const prevConverted = get().convertedData;
    if (prevConverted?.url) {
      URL.revokeObjectURL(prevConverted.url);
    }
    const prevFile = get().fileData;
    if (prevFile?.originalUrl && prevFile.originalUrl.startsWith('blob:')) {
      URL.revokeObjectURL(prevFile.originalUrl);
    }

    set({
      fileData: null,
      convertedData: null,
      ...clearErrors(),
      submitting: false,
    });
  },

  setQuality: (quality: number) => {
    set({ quality });
    scheduleStoreConversion(get);
  },

  setResizeMode: (mode: ResizeMode) => {
    const scalePercent = mode === 'original' ? 100 : get().scalePercent;
    set({ resizeMode: mode, scalePercent });
    scheduleStoreConversion(get);
  },

  setScalePercent: (scalePercent: number) => {
    set({ scalePercent });
    scheduleStoreConversion(get);
  },

  setViewMode: (viewMode: ViewMode) => {
    set({ viewMode });
  },

  setSliderPosition: (sliderPosition: number) => {
    set({ sliderPosition: Math.max(0, Math.min(100, sliderPosition)) });
  },

  setIsDraggingSlider: (isDraggingSlider: boolean) => {
    set({ isDraggingSlider });
  },

  setIsDragOver: (isDragOver: boolean) => {
    set({ isDragOver });
  },

  triggerConversion: async () => {
    const { fileData, quality, scalePercent, resizeMode } = get();
    if (!fileData || !fileData.imgObj) return;

    set({ submitting: true });

    try {
      const options: WebpConversionOptions = {
        quality,
        scalePercent,
        resizeMode,
      };

      const result = await convertImageToWebp(fileData.imgObj, options);

      const prevConverted = get().convertedData;
      if (prevConverted?.url && prevConverted.url !== result.url) {
        URL.revokeObjectURL(prevConverted.url);
      }

      set({
        convertedData: result,
        submitting: false,
        success: true,
      });
    } catch (e) {
      const { message, fieldErrors } = handleError(e, { context: 'triggerConversion' });
      set((s) => ({ ...s, error: message, errors: fieldErrors, submitting: false }));
    }
  },

  downloadWebp: () => {
    const { fileData, convertedData } = get();
    if (!convertedData || !fileData) return;
    const baseName = fileData.name.replace(/\.[^/.]+$/, '').trim() || 'image';
    downloadBlob(convertedData.blob, `${baseName}-optipress.webp`);
  },

  copyBase64: async () => {
    const { convertedData, quality } = get();
    if (!convertedData?.canvasRef) return;
    try {
      const dataUrl = convertedData.canvasRef.toDataURL('image/webp', quality / 100);
      await navigator.clipboard.writeText(dataUrl);
      set({ copyFeedback: true });
      setTimeout(() => {
        set({ copyFeedback: false });
      }, 2000);
    } catch (e) {
      handleError(
        new AppError('Unable to copy base64 representation to clipboard.', {
          code: 'CLIPBOARD_ERROR',
        }),
        { context: 'copyBase64' }
      );
    }
  },
}));
