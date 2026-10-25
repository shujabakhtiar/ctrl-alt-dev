export type SourceImageType = 'svg' | 'png' | 'jpeg' | 'webp';

export interface SourceImage {
  file: File;
  name: string;
  size: number;
  width: number;
  height: number;
  type: SourceImageType;
  svgText?: string;
  buffer: ArrayBuffer;
  previewUrl: string;
  isSquare: boolean;
  hasTransparency: boolean;
  isFullyTransparent: boolean;
  isAnimated: boolean;
  warnings: string[];
}

export type NonSquareStrategy = 'fit' | 'crop';

export interface FaviconOptions {
  appName: string;
  shortName: string;
  themeColor: string;
  backgroundColor: string;
  maskablePadding: number; // percentage (e.g. 20 means logo is ~80% of canvas)
  basePath: string; // e.g. "/"
  nonSquareStrategy: NonSquareStrategy;
  optimizePng: boolean;
  includeLegacy: boolean;
}

export interface GeneratedFile {
  id: string;
  name: string; // e.g. "favicon.ico", "icon-192.png"
  type: string; // MIME type
  dimensions?: { width: number; height: number };
  size: number; // bytes
  blob: Blob;
  url: string;
  category: 'icon' | 'manifest' | 'snippet' | 'legacy';
  description: string;
  purpose?: 'any' | 'maskable';
}

export interface SafeZoneDimensions {
  canvasSize: number;
  logoSize: number;
  x: number;
  y: number;
  safeRadius: number;
  safeDiameter: number;
}
