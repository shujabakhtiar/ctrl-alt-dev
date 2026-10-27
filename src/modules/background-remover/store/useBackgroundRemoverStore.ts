import { create } from 'zustand';
import { createCommonState, clearErrors, type CommonState } from '../../../lib/commonState';
import { handleError, AppError } from '../../../lib/errorHandler';
import { decodeImage, encodeImageData, resizeImageData } from '../../../lib/imaging/codecs';
import { validateImageFile } from '../../../lib/imaging/validation';
import { workerBridge } from '../workers/pool';
import { rgbToHex, hexToRgb } from '../lib/colour';
import { formatOutputFilename } from '../lib/filenames';
import { createZipBundle } from '../lib/zip';
import { downloadBlob } from '../../../lib/download';
import type {
  RemovalMode,
  OutputFormat,
  BackdropMode,
  RgbaColor,
  BackgroundDetectionResult,
  BackgroundRemoverOptions,
  ProcessResult,
  BatchFileItem,
} from '../types';

export type BackgroundRemoverStore = CommonState & {
  // Source single image state
  file: File | null;
  filename: string;
  originalSize: number;
  originalUrl: string | null;
  fullImageData: ImageData | null;
  proxyImageData: ImageData | null;
  isProxy: boolean;

  // Processed preview state
  processedPreviewUrl: string | null;
  processedResult: ProcessResult | null;
  isProcessingPreview: boolean;

  // Options & Parameters
  mode: RemovalMode;
  targetColor: RgbaColor | null;
  customHex: string;
  detectedResult: BackgroundDetectionResult | null;
  useCustomColor: boolean;
  tolerance: number; // 0 - 100
  softness: number; // 0 - 50
  decontaminate: boolean;
  shrink: number; // 0 - 3
  smooth: number; // 0 - 3
  removeIslands: boolean;
  islandSize: number;

  // View & Inspection
  backdropMode: BackdropMode;
  customBackdropHex: string;
  viewMode: 'side-by-side' | 'split' | 'processed-only';
  splitPosition: number; // 0 - 100
  zoom: number; // 0.25 to 4
  pan: { x: number; y: number };
  isEyedropperActive: boolean;
  outputFormat: OutputFormat;

  // Batch queue
  batchItems: BatchFileItem[];
  isBatchMode: boolean;
  activeBatchIndex: number;
  isProcessingBatch: boolean;

  // Actions
  loadFile: (file: File) => Promise<void>;
  loadMultipleFiles: (files: File[]) => Promise<void>;
  loadSampleImage: () => Promise<void>;
  setMode: (mode: RemovalMode) => void;
  setTargetColor: (color: RgbaColor) => void;
  setTargetHex: (hex: string) => void;
  setTolerance: (tolerance: number) => void;
  setSoftness: (softness: number) => void;
  setDecontaminate: (decontaminate: boolean) => void;
  setShrink: (shrink: number) => void;
  setSmooth: (smooth: number) => void;
  setRemoveIslands: (removeIslands: boolean) => void;
  setIslandSize: (islandSize: number) => void;
  setBackdropMode: (backdropMode: BackdropMode) => void;
  setCustomBackdropHex: (hex: string) => void;
  setViewMode: (viewMode: 'side-by-side' | 'split' | 'processed-only') => void;
  setSplitPosition: (pos: number) => void;
  setZoom: (zoom: number) => void;
  setPan: (pan: { x: number; y: number }) => void;
  setIsEyedropperActive: (active: boolean) => void;
  setOutputFormat: (format: OutputFormat) => void;
  reprocessPreview: () => void;
  exportActiveImage: () => Promise<void>;
  processAllBatch: () => Promise<void>;
  downloadBatchZip: () => Promise<void>;
  selectBatchItem: (index: number) => void;
  resetAll: () => void;
};

let debounceTimer: ReturnType<typeof setTimeout> | null = null;

export const useBackgroundRemoverStore = create<BackgroundRemoverStore>((set, get) => ({
  ...createCommonState(),

  file: null,
  filename: '',
  originalSize: 0,
  originalUrl: null,
  fullImageData: null,
  proxyImageData: null,
  isProxy: false,

  processedPreviewUrl: null,
  processedResult: null,
  isProcessingPreview: false,

  mode: 'contiguous',
  targetColor: null,
  customHex: '#FFFFFF',
  detectedResult: null,
  useCustomColor: false,
  tolerance: 18,
  softness: 8,
  decontaminate: true,
  shrink: 0,
  smooth: 0,
  removeIslands: false,
  islandSize: 10,

  backdropMode: 'checker',
  customBackdropHex: '#080A0F',
  viewMode: 'split',
  splitPosition: 50,
  zoom: 1,
  pan: { x: 0, y: 0 },
  isEyedropperActive: false,
  outputFormat: 'png',

  batchItems: [],
  isBatchMode: false,
  activeBatchIndex: 0,
  isProcessingBatch: false,

  resetAll: () => {
    const s = get();
    if (s.originalUrl) URL.revokeObjectURL(s.originalUrl);
    if (s.processedPreviewUrl) URL.revokeObjectURL(s.processedPreviewUrl);
    for (const item of s.batchItems) {
      if (item.originalUrl) URL.revokeObjectURL(item.originalUrl);
      if (item.processedUrl) URL.revokeObjectURL(item.processedUrl);
    }

    set({
      ...createCommonState(),
      file: null,
      filename: '',
      originalSize: 0,
      originalUrl: null,
      fullImageData: null,
      proxyImageData: null,
      isProxy: false,
      processedPreviewUrl: null,
      processedResult: null,
      isProcessingPreview: false,
      detectedResult: null,
      targetColor: null,
      batchItems: [],
      isBatchMode: false,
      zoom: 1,
      pan: { x: 0, y: 0 },
    });
  },

  loadFile: async (file: File) => {
    set({ ...clearErrors(), loading: true });
    try {
      const buffer = await file.arrayBuffer();
      const { format } = validateImageFile(file, buffer);
      const fullImageData = await decodeImage(buffer, format);

      // Create downscaled proxy if image is large (> 1200 px long side)
      const maxDim = Math.max(fullImageData.width, fullImageData.height);
      let proxyImageData = fullImageData;
      let isProxy = false;

      if (maxDim > 1200) {
        const scale = 1200 / maxDim;
        const targetW = Math.max(1, Math.round(fullImageData.width * scale));
        const targetH = Math.max(1, Math.round(fullImageData.height * scale));
        proxyImageData = await resizeImageData(fullImageData, targetW, targetH);
        isProxy = true;
      }

      // Auto-detect background on proxy buffer
      const detection = await workerBridge.detect(
        proxyImageData.data,
        proxyImageData.width,
        proxyImageData.height
      );

      const oldOriginal = get().originalUrl;
      if (oldOriginal) URL.revokeObjectURL(oldOriginal);

      const originalUrl = URL.createObjectURL(file);

      set({
        loading: false,
        file,
        filename: file.name,
        originalSize: file.size,
        originalUrl,
        fullImageData,
        proxyImageData,
        isProxy,
        detectedResult: detection,
        targetColor: detection.color,
        customHex: detection.hex,
        useCustomColor: false,
        isBatchMode: false,
      });

      get().reprocessPreview();
    } catch (err) {
      const { message } = handleError(err, { context: 'loadFile' });
      set({ loading: false, error: message });
    }
  },

  loadMultipleFiles: async (files: File[]) => {
    if (files.length === 1) {
      return get().loadFile(files[0]);
    }

    set({ ...clearErrors(), loading: true, isBatchMode: true });
    try {
      const items: BatchFileItem[] = files.map((file, idx) => ({
        id: `batch-${Date.now()}-${idx}`,
        file,
        name: file.name,
        size: file.size,
        status: 'idle',
        progress: 0,
        originalUrl: URL.createObjectURL(file),
        outputFormat: get().outputFormat,
      }));

      set({
        loading: false,
        batchItems: items,
        activeBatchIndex: 0,
      });

      // Load first file into active editor
      await get().loadFile(files[0]);
    } catch (err) {
      const { message } = handleError(err, { context: 'loadMultipleFiles' });
      set({ loading: false, error: message });
    }
  },

  loadSampleImage: async () => {
    set({ ...clearErrors(), loading: true });
    try {
      // Create a crisp sample logo on flat pure white background
      const canvas = document.createElement('canvas');
      canvas.width = 600;
      canvas.height = 600;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new AppError('Could not initialize canvas context');

      // Flat white background
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, 600, 600);

      // Central modern geometric shield/badge
      ctx.fillStyle = '#795BFF';
      ctx.beginPath();
      ctx.roundRect(150, 150, 300, 300, 48);
      ctx.fill();

      // Sharp inner emblem in bright lime
      ctx.fillStyle = '#C8FF43';
      ctx.beginPath();
      ctx.arc(300, 300, 80, 0, Math.PI * 2);
      ctx.fill();

      // Interior white pocket / hole in center to demonstrate contiguous flood fill preservation
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(300, 300, 32, 0, Math.PI * 2);
      ctx.fill();

      const blob = await new Promise<Blob>((res, rej) =>
        canvas.toBlob((b) => (b ? res(b) : rej(new Error('Sample canvas toBlob failed'))), 'image/png')
      );

      const sampleFile = new File([blob], 'ai-generated-badge.png', { type: 'image/png' });
      await get().loadFile(sampleFile);
    } catch (err) {
      const { message } = handleError(err, { context: 'loadSampleImage' });
      set({ loading: false, error: message });
    }
  },

  setMode: (mode) => {
    set({ mode });
    get().reprocessPreview();
  },

  setTargetColor: (targetColor) => {
    set({
      targetColor,
      customHex: rgbToHex(targetColor.r, targetColor.g, targetColor.b),
      useCustomColor: true,
    });
    get().reprocessPreview();
  },

  setTargetHex: (hex) => {
    const color = hexToRgb(hex);
    set({ targetColor: color, customHex: hex, useCustomColor: true });
    get().reprocessPreview();
  },

  setTolerance: (tolerance) => {
    set({ tolerance });
    get().reprocessPreview();
  },

  setSoftness: (softness) => {
    set({ softness });
    get().reprocessPreview();
  },

  setDecontaminate: (decontaminate) => {
    set({ decontaminate });
    get().reprocessPreview();
  },

  setShrink: (shrink) => {
    set({ shrink });
    get().reprocessPreview();
  },

  setSmooth: (smooth) => {
    set({ smooth });
    get().reprocessPreview();
  },

  setRemoveIslands: (removeIslands) => {
    set({ removeIslands });
    get().reprocessPreview();
  },

  setIslandSize: (islandSize) => {
    set({ islandSize });
    get().reprocessPreview();
  },

  setBackdropMode: (backdropMode) => set({ backdropMode }),
  setCustomBackdropHex: (customBackdropHex) => set({ customBackdropHex }),
  setViewMode: (viewMode) => set({ viewMode }),
  setSplitPosition: (splitPosition) => set({ splitPosition }),
  setZoom: (zoom) => set({ zoom }),
  setPan: (pan) => set({ pan }),
  setIsEyedropperActive: (isEyedropperActive) => set({ isEyedropperActive }),
  setOutputFormat: (outputFormat) => set({ outputFormat }),

  reprocessPreview: () => {
    if (debounceTimer) clearTimeout(debounceTimer);

    debounceTimer = setTimeout(async () => {
      const s = get();
      const imageToProcess = s.proxyImageData || s.fullImageData;
      if (!imageToProcess) return;

      set({ isProcessingPreview: true });

      const options: BackgroundRemoverOptions = {
        mode: s.mode,
        targetColor: s.targetColor ?? undefined,
        tolerance: s.tolerance,
        softness: s.softness,
        cleanup: {
          decontaminate: s.decontaminate,
          shrink: s.shrink,
          smooth: s.smooth,
          removeIslands: s.removeIslands,
          islandSize: s.islandSize,
        },
      };

      try {
        const result = await workerBridge.process(
          imageToProcess.data,
          imageToProcess.width,
          imageToProcess.height,
          options
        );

        // Render result to in-memory canvas to generate preview URL
        const canvas = document.createElement('canvas');
        canvas.width = result.width;
        canvas.height = result.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const imgData = new ImageData(result.data, result.width, result.height);
          ctx.putImageData(imgData, 0, 0);

          canvas.toBlob((blob) => {
            if (blob) {
              const oldPreview = get().processedPreviewUrl;
              if (oldPreview) URL.revokeObjectURL(oldPreview);

              const newUrl = URL.createObjectURL(blob);
              set({
                processedPreviewUrl: newUrl,
                processedResult: result,
                isProcessingPreview: false,
              });
            }
          }, 'image/png');
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        handleError(err, { context: 'reprocessPreview', silent: true });
        set({ isProcessingPreview: false });
      }
    }, 110); // 110ms fluid debouncing for live 60fps sliders
  },

  exportActiveImage: async () => {
    const s = get();
    if (!s.fullImageData || !s.file) return;

    set({ submitting: true });
    try {
      const options: BackgroundRemoverOptions = {
        mode: s.mode,
        targetColor: s.targetColor ?? undefined,
        tolerance: s.tolerance,
        softness: s.softness,
        cleanup: {
          decontaminate: s.decontaminate,
          shrink: s.shrink,
          smooth: s.smooth,
          removeIslands: s.removeIslands,
          islandSize: s.islandSize,
        },
      };

      // Process at 100% full resolution
      const result = await workerBridge.process(
        s.fullImageData.data,
        s.fullImageData.width,
        s.fullImageData.height,
        options
      );

      const outImageData = new ImageData(result.data, result.width, result.height);
      const encodedBuffer = await encodeImageData(outImageData, s.outputFormat, {
        quality: 95,
        lossless: true,
      });

      const mimeType = s.outputFormat === 'webp' ? 'image/webp' : 'image/png';
      const blob = new Blob([encodedBuffer], { type: mimeType });
      const filename = formatOutputFilename(s.filename, s.outputFormat);

      downloadBlob(blob, filename);
      set({ submitting: false, success: true });
    } catch (err) {
      const { message } = handleError(err, { context: 'exportActiveImage' });
      set({ submitting: false, error: message });
    }
  },

  processAllBatch: async () => {
    const s = get();
    if (s.batchItems.length === 0) return;

    set({ isProcessingBatch: true });

    const items = [...s.batchItems];

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      try {
        items[i] = { ...item, status: 'processing', progress: 20 };
        set({ batchItems: [...items] });

        const buffer = await item.file.arrayBuffer();
        const { format } = validateImageFile(item.file, buffer);
        const imgData = await decodeImage(buffer, format);

        items[i].progress = 50;
        set({ batchItems: [...items] });

        // Auto-detect color per file if not locked
        const targetColor = s.useCustomColor && s.targetColor ? s.targetColor : undefined;

        const options: BackgroundRemoverOptions = {
          mode: s.mode,
          targetColor,
          tolerance: s.tolerance,
          softness: s.softness,
          cleanup: {
            decontaminate: s.decontaminate,
            shrink: s.shrink,
            smooth: s.smooth,
            removeIslands: s.removeIslands,
            islandSize: s.islandSize,
          },
        };

        const result = await workerBridge.process(
          imgData.data,
          imgData.width,
          imgData.height,
          options
        );

        items[i].progress = 80;
        set({ batchItems: [...items] });

        const outImageData = new ImageData(result.data, result.width, result.height);
        const encoded = await encodeImageData(outImageData, s.outputFormat, {
          quality: 95,
          lossless: true,
        });

        const mime = s.outputFormat === 'webp' ? 'image/webp' : 'image/png';
        const blob = new Blob([encoded], { type: mime });
        const url = URL.createObjectURL(blob);

        items[i] = {
          ...items[i],
          status: 'done',
          progress: 100,
          processedUrl: url,
          processedBlob: blob,
          outputSize: blob.size,
          stats: result.stats,
          warning: !result.stats.isSolid
            ? 'Border is not solid colour; results may have artifacts'
            : undefined,
        };
        set({ batchItems: [...items] });
      } catch (err) {
        items[i] = {
          ...items[i],
          status: 'error',
          error: err instanceof Error ? err.message : 'Processing failed',
        };
        set({ batchItems: [...items] });
      }
    }

    set({ isProcessingBatch: false });
  },

  downloadBatchZip: async () => {
    const s = get();
    const completed = s.batchItems.filter((item) => item.processedBlob && item.status === 'done');
    if (completed.length === 0) return;

    set({ submitting: true });
    try {
      const zipEntries = await Promise.all(
        completed.map(async (item) => {
          const buf = await item.processedBlob!.arrayBuffer();
          return {
            filename: formatOutputFilename(item.name, s.outputFormat),
            data: new Uint8Array(buf),
          };
        })
      );

      const zipBlob = await createZipBundle(zipEntries);
      downloadBlob(zipBlob, `ctrlaltdev-transparent-batch-${Date.now()}.zip`);
      set({ submitting: false });
    } catch (err) {
      const { message } = handleError(err, { context: 'downloadBatchZip' });
      set({ submitting: false, error: message });
    }
  },

  selectBatchItem: async (index: number) => {
    const s = get();
    const item = s.batchItems[index];
    if (!item) return;

    set({ activeBatchIndex: index });
    await get().loadFile(item.file);
  },
}));
