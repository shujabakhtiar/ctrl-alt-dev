import type { ResizeMode, WebpConversionOptions, ConvertedData, SourceImage } from '../types';

/**
 * Calculates output dimensions based on resize mode and scale percentage.
 */
export function calculateTargetDimensions(
  originalWidth: number,
  originalHeight: number,
  resizeMode: ResizeMode,
  scalePercent: number
): { width: number; height: number } {
  let targetWidth = originalWidth;
  let targetHeight = originalHeight;

  if (resizeMode === '75') {
    targetWidth = Math.round(targetWidth * 0.75);
    targetHeight = Math.round(targetHeight * 0.75);
  } else if (resizeMode === '50') {
    targetWidth = Math.round(targetWidth * 0.5);
    targetHeight = Math.round(targetHeight * 0.5);
  } else if (resizeMode === '1280' && targetWidth > 1280) {
    const ratio = 1280 / targetWidth;
    targetWidth = 1280;
    targetHeight = Math.round(targetHeight * ratio);
  } else if (resizeMode === '800' && targetWidth > 800) {
    const ratio = 800 / targetWidth;
    targetWidth = 800;
    targetHeight = Math.round(targetHeight * ratio);
  } else if (scalePercent !== 100) {
    targetWidth = Math.round(targetWidth * (scalePercent / 100));
    targetHeight = Math.round(targetHeight * (scalePercent / 100));
  }

  return {
    width: Math.max(1, targetWidth),
    height: Math.max(1, targetHeight),
  };
}

/**
 * Loads an image from a URL or object URL into an HTMLImageElement.
 */
export function loadImageElement(src: string, fileName: string, fileSize: number): Promise<SourceImage> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      resolve({
        name: fileName,
        originalSize: fileSize,
        originalUrl: src,
        imgObj: img,
        originalWidth: img.naturalWidth,
        originalHeight: img.naturalHeight,
      });
    };
    img.onerror = () => {
      reject(new Error('Unable to decode image. Please try another image file.'));
    };
    img.src = src;
  });
}

/**
 * Converts an image element to WebP using an in-memory Canvas with the specified options.
 */
export function convertImageToWebp(
  img: HTMLImageElement,
  options: WebpConversionOptions
): Promise<ConvertedData> {
  return new Promise((resolve, reject) => {
    const startTime = performance.now();
    const { width: targetWidth, height: targetHeight } = calculateTargetDimensions(
      img.naturalWidth,
      img.naturalHeight,
      options.resizeMode,
      options.scalePercent
    );

    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext('2d', { alpha: true });

    if (!ctx) {
      reject(new Error('Canvas 2D context is not supported in this browser.'));
      return;
    }

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

    const q = Math.max(0.01, Math.min(1, options.quality / 100));

    canvas.toBlob(
      (blob) => {
        const endTime = performance.now();
        if (!blob) {
          reject(new Error('WebP encoding returned an empty blob.'));
          return;
        }

        const webpUrl = URL.createObjectURL(blob);
        resolve({
          blob,
          url: webpUrl,
          size: blob.size,
          width: targetWidth,
          height: targetHeight,
          timeMs: Math.round(endTime - startTime),
          canvasRef: canvas,
        });
      },
      'image/webp',
      q
    );
  });
}
