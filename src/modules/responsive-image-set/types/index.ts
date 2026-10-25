export type OutputImageFormat = 'avif' | 'webp' | 'jpeg' | 'png';

export type ResponsiveMode = 'fluid' | 'fixed';

export type VariantStatus = 'queued' | 'resizing' | 'encoding' | 'done' | 'failed';

export type SourceImage = {
  file: File;
  name: string;
  baseName: string;
  url: string;
  width: number;
  height: number;
  size: number;
  mimeType: string;
  orientation?: number;
};

export type VariantTask = {
  id: string;
  width: number;
  height: number;
  density?: number; // e.g. 1, 2, 3 in fixed mode
  format: OutputImageFormat;
  filename: string;
  quality: number;
  lossless?: boolean;
  speed?: number; // AVIF speed / effort
};

export type VariantItem = VariantTask & {
  status: VariantStatus;
  progress?: number;
  blob?: Blob;
  url?: string;
  size?: number;
  savingsPercent?: number;
  error?: string;
};

export type GeneratorOptions = {
  mode: ResponsiveMode;
  fluidWidths: number[];
  fixedWidth: number;
  includeOriginal: boolean;
  formats: {
    avif: boolean;
    webp: boolean;
    fallback: OutputImageFormat;
  };
  quality: {
    webp: number;
    avif: number;
    jpeg: number;
    webpLossless: boolean;
    avifSpeed: number; // 0-8, default 6
  };
  sizesAttr: string;
  snippet: {
    alt: string;
    prefix: string;
    loading: 'lazy' | 'eager';
    fetchPriority: boolean;
    filenamePattern: string; // e.g. '{name}-{width}.{ext}'
    outputLanguage: 'html' | 'jsx';
  };
};
