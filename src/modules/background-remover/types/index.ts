export type RgbaColor = {
  r: number;
  g: number;
  b: number;
  a?: number;
};

export type LabColor = {
  l: number;
  a: number;
  b: number;
};

export type RemovalMode = 'contiguous' | 'global';

export type OutputFormat = 'png' | 'webp';

export type BackdropMode = 'checker' | 'dark' | 'light' | 'custom';

export type BackgroundDetectionResult = {
  color: RgbaColor;
  hex: string;
  confidence: number; // 0 to 1
  isSolid: boolean; // confidence >= 0.60
};

export type CleanupOptions = {
  decontaminate: boolean; // Default true: un-mixes background halo
  shrink: number; // 0 to 3 px edge choke/erosion
  smooth: number; // 0 to 3 px alpha smoothing
  removeIslands: boolean; // Drop isolated opaque specks
  islandSize: number; // Max pixel size of island to remove (e.g. 10px)
};

export type BackgroundRemoverOptions = {
  mode: RemovalMode;
  targetColor?: RgbaColor; // If undefined, auto-detected
  tolerance: number; // Inner threshold (0-100), default ~15-20
  softness: number; // Ramp width (0-50), default ~5-10
  cleanup: CleanupOptions;
};

export type PipelineStats = {
  detectedColor: RgbaColor;
  detectedHex: string;
  confidence: number;
  isSolid: boolean;
  isAllBackground: boolean;
  totalPixels: number;
  removedPixels: number;
  partiallyTransparentPixels: number;
  processingTimeMs: number;
};

export type ProcessResult = {
  data: Uint8ClampedArray;
  width: number;
  height: number;
  stats: PipelineStats;
};

export type BatchFileItem = {
  id: string;
  file: File;
  name: string;
  size: number;
  status: 'idle' | 'processing' | 'done' | 'error';
  progress: number;
  warning?: string;
  error?: string;
  originalUrl?: string;
  processedUrl?: string;
  processedBlob?: Blob;
  outputFormat: OutputFormat;
  outputSize?: number;
  stats?: PipelineStats;
};
