export type ResizeMode = 'original' | '75' | '50' | '1280' | '800';

export type ViewMode = 'split' | 'side-by-side';

export type SourceImage = {
  name: string;
  originalSize: number;
  originalUrl: string;
  imgObj: HTMLImageElement;
  originalWidth: number;
  originalHeight: number;
};

export type ConvertedData = {
  blob: Blob;
  url: string;
  size: number;
  width: number;
  height: number;
  timeMs: number;
  canvasRef: HTMLCanvasElement;
};

export type WebpConversionOptions = {
  quality: number;
  scalePercent: number;
  resizeMode: ResizeMode;
};
