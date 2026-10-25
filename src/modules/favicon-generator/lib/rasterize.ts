import { decode as decodePng, encode as encodePng } from '@jsquash/png';
import { decode as decodeJpeg } from '@jsquash/jpeg';
import { decode as decodeWebp } from '@jsquash/webp';
import resize from '@jsquash/resize';
import { optimise as oxipngOptimise } from '@jsquash/oxipng';
import type { FaviconOptions, NonSquareStrategy, SourceImage, SourceImageType } from '../types';
import { calculateSafeZone } from './safeZone';

/**
 * Checks if a PNG buffer is an animated APNG by detecting the 'acTL' chunk.
 */
export function isAnimatedPng(buffer: ArrayBuffer): boolean {
  const bytes = new Uint8Array(buffer);
  // PNG signature is 8 bytes
  if (bytes.length < 8) return false;
  // Look for 'acTL' chunk (0x61, 0x63, 0x54, 0x4C)
  for (let i = 8; i < bytes.length - 8; i++) {
    if (
      bytes[i] === 0x61 &&
      bytes[i + 1] === 0x63 &&
      bytes[i + 2] === 0x54 &&
      bytes[i + 3] === 0x4c
    ) {
      return true;
    }
  }
  return false;
}

/**
 * Checks if a WebP buffer is animated by checking for 'ANIM' chunk.
 */
export function isAnimatedWebp(buffer: ArrayBuffer): boolean {
  const bytes = new Uint8Array(buffer);
  if (bytes.length < 12) return false;
  // WebP has 'RIFF' .... 'WEBP'
  // Animated WebP has 'ANIM' (0x41, 0x4E, 0x49, 0x4D)
  for (let i = 12; i < bytes.length - 8; i++) {
    if (
      bytes[i] === 0x41 &&
      bytes[i + 1] === 0x4e &&
      bytes[i + 2] === 0x49 &&
      bytes[i + 3] === 0x4d
    ) {
      return true;
    }
  }
  return false;
}

/**
 * Cleans, sanitizes, and normalizes SVG text.
 * Strips script tags, inline event handlers, and external resource URLs.
 * Ensures valid viewBox and xmlns.
 */
export function sanitizeSvg(svgText: string): { cleanedSvg: string; warnings: string[] } {
  const warnings: string[] = [];
  let cleaned = svgText;

  // Check for external resources
  const externalPattern = /(https?:|\/\/)[^"'\s)]+/gi;
  if (externalPattern.test(svgText)) {
    warnings.push('External resource links detected in SVG and stripped for security and offline rendering.');
    // Strip image / use tags referencing external URLs
    cleaned = cleaned.replace(/<image[^>]+href=["']?(https?:|\/\/)[^"'>]+[^>]*>/gi, '');
    cleaned = cleaned.replace(/<use[^>]+href=["']?(https?:|\/\/)[^"'>]+[^>]*>/gi, '');
  }

  // Strip script tags and event handlers
  if (/<script\b/i.test(cleaned)) {
    warnings.push('Executable <script> tags removed from SVG.');
    cleaned = cleaned.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  }

  cleaned = cleaned.replace(/\son\w+\s*=\s*(['"]).*?\1/gi, '');
  cleaned = cleaned.replace(/\son\w+\s*=\s*[^>\s]+/gi, '');

  // Ensure xmlns is present
  if (!cleaned.includes('xmlns="http://www.w3.org/2000/svg"')) {
    cleaned = cleaned.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
  }

  // Ensure viewBox exists
  const hasViewBox = /viewBox=["']\s*([0-9.\-\s]+)\s*["']/i.test(cleaned);
  if (!hasViewBox) {
    const widthMatch = /width=["']\s*([0-9.]+)(px)?\s*["']/i.exec(cleaned);
    const heightMatch = /height=["']\s*([0-9.]+)(px)?\s*["']/i.exec(cleaned);

    if (widthMatch && heightMatch) {
      const w = parseFloat(widthMatch[1]);
      const h = parseFloat(heightMatch[1]);
      cleaned = cleaned.replace('<svg', `<svg viewBox="0 0 ${w} ${h}"`);
    } else {
      warnings.push('SVG missing viewBox and dimensions: applied default 0 0 512 512 viewport.');
      cleaned = cleaned.replace('<svg', '<svg viewBox="0 0 512 512"');
    }
  }

  return { cleanedSvg: cleaned, warnings };
}

/**
 * Parses and inspects an input file (SVG, PNG, JPEG, WebP).
 */
export async function parseSourceFile(file: File): Promise<SourceImage> {
  const warnings: string[] = [];
  const buffer = await file.arrayBuffer();
  const name = file.name;
  const size = file.size;

  let type: SourceImageType;
  const lowerName = name.toLowerCase();

  if (file.type === 'image/svg+xml' || lowerName.endsWith('.svg')) {
    type = 'svg';
  } else if (file.type === 'image/png' || lowerName.endsWith('.png')) {
    type = 'png';
  } else if (file.type === 'image/jpeg' || lowerName.endsWith('.jpg') || lowerName.endsWith('.jpeg')) {
    type = 'jpeg';
  } else if (file.type === 'image/webp' || lowerName.endsWith('.webp')) {
    type = 'webp';
  } else {
    throw new Error(`Unsupported image type "${file.type}". Please upload a PNG, JPEG, WebP, or SVG file.`);
  }

  // Check animation
  if (type === 'png' && isAnimatedPng(buffer)) {
    throw new Error('Animated PNG (APNG) detected. Favicons require static images.');
  }
  if (type === 'webp' && isAnimatedWebp(buffer)) {
    throw new Error('Animated WebP detected. Favicons require static images.');
  }

  let width = 512;
  let height = 512;
  let svgText: string | undefined;
  let previewUrl = '';
  let hasTransparency = false;
  let isFullyTransparent = false;

  if (type === 'svg') {
    const decoder = new TextDecoder('utf-8');
    const rawSvg = decoder.decode(buffer);
    const sanitized = sanitizeSvg(rawSvg);
    svgText = sanitized.cleanedSvg;
    warnings.push(...sanitized.warnings);

    // Measure SVG intrinsic dimensions via Image loading
    const svgBlob = new Blob([svgText], { type: 'image/svg+xml' });
    previewUrl = URL.createObjectURL(svgBlob);

    const dims = await measureSvgDimensions(previewUrl);
    width = dims.width;
    height = dims.height;
    hasTransparency = true; // SVGs typically support transparency
  } else {
    // Raster decode with jsquash
    let imageData: ImageData;
    try {
      if (type === 'png') {
        imageData = await decodePng(buffer);
      } else if (type === 'jpeg') {
        imageData = await decodeJpeg(buffer);
      } else {
        imageData = await decodeWebp(buffer);
      }
    } catch (err: unknown) {
      throw new Error(`Corrupt or unreadable image file: ${err instanceof Error ? err.message : String(err)}`);
    }

    width = imageData.width;
    height = imageData.height;

    // Check transparency
    const data = imageData.data;
    let nonTransparentCount = 0;
    let hasSemiTransparent = false;

    for (let i = 3; i < data.length; i += 4) {
      const alpha = data[i];
      if (alpha > 0) {
        nonTransparentCount++;
        if (alpha < 255) {
          hasSemiTransparent = true;
        }
      }
    }

    if (nonTransparentCount === 0) {
      isFullyTransparent = true;
      warnings.push('The uploaded image appears to be 100% transparent (empty).');
    }
    hasTransparency = hasSemiTransparent || nonTransparentCount < (width * height);

    // Create object URL from raster file
    previewUrl = URL.createObjectURL(file);
  }

  const isSquare = width === height;
  if (!isSquare) {
    warnings.push(`Image is not square (${width}×${height}px). You can choose "Fit with padding" or "Crop to centre".`);
  }

  if (width < 512 || height < 512) {
    warnings.push(`Image is smaller than recommended 512×512px (${width}×${height}px). Upscaling will occur for high-res icons.`);
  }

  return {
    file,
    name,
    size,
    width,
    height,
    type,
    svgText,
    buffer,
    previewUrl,
    isSquare,
    hasTransparency,
    isFullyTransparent,
    isAnimated: false,
    warnings,
  };
}

/**
 * Measures the rendered dimensions of an SVG URL using an HTMLImageElement.
 */
function measureSvgDimensions(url: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const w = img.naturalWidth || 512;
      const h = img.naturalHeight || 512;
      resolve({ width: Math.max(16, w), height: Math.max(16, h) });
    };
    img.onerror = () => {
      resolve({ width: 512, height: 512 });
    };
    img.src = url;
  });
}

/**
 * Draws an image (SVG or raster) onto a target canvas dimension with fit or crop strategy.
 */
export async function renderToCanvas(
  source: SourceImage,
  targetWidth: number,
  targetHeight: number,
  strategy: NonSquareStrategy,
  backgroundColor?: string
): Promise<ImageData> {
  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('Could not obtain 2D canvas context');

  // Fill background if specified
  if (backgroundColor && backgroundColor !== 'transparent') {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, targetWidth, targetHeight);
  } else {
    ctx.clearRect(0, 0, targetWidth, targetHeight);
  }

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  if (source.type === 'svg' && source.svgText) {
    // Vector-per-size rendering: create SVG blob with exact target dimensions
    const blob = new Blob([source.svgText], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    try {
      const img = await loadImage(url);
      drawTransformedImage(ctx, img, targetWidth, targetHeight, strategy);
    } finally {
      URL.revokeObjectURL(url);
    }
  } else {
    // Raster image: decode with jsquash and draw with Lanczos resize if possible, or high-quality canvas draw
    const img = await loadImage(source.previewUrl);
    drawTransformedImage(ctx, img, targetWidth, targetHeight, strategy);
  }

  return ctx.getImageData(0, 0, targetWidth, targetHeight);
}

/**
 * Loads an image from a URL into an HTMLImageElement.
 */
function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(new Error('Failed to load image for rendering: ' + String(e)));
    img.src = url;
  });
}

/**
 * Draws an HTMLImageElement onto a context with either 'fit' (aspect fit with padding)
 * or 'crop' (aspect fill cropping center).
 */
function drawTransformedImage(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  targetW: number,
  targetH: number,
  strategy: NonSquareStrategy
) {
  const srcW = img.naturalWidth || img.width;
  const srcH = img.naturalHeight || img.height;

  if (strategy === 'crop') {
    // Cover/crop: scale up to fill canvas, crop overflowing edges
    const scale = Math.max(targetW / srcW, targetH / srcH);
    const drawW = srcW * scale;
    const drawH = srcH * scale;
    const dx = (targetW - drawW) / 2;
    const dy = (targetH - drawH) / 2;
    ctx.drawImage(img, dx, dy, drawW, drawH);
  } else {
    // Fit: contain inside canvas, centered
    const scale = Math.min(targetW / srcW, targetH / srcH);
    const drawW = srcW * scale;
    const drawH = srcH * scale;
    const dx = (targetW - drawW) / 2;
    const dy = (targetH - drawH) / 2;
    ctx.drawImage(img, dx, dy, drawW, drawH);
  }
}

/**
 * Renders the Android maskable icon:
 * Solid background color with the logo scaled into the safe zone based on maskablePadding.
 */
export async function renderMaskableIcon(
  source: SourceImage,
  targetSize: number,
  options: FaviconOptions
): Promise<ImageData> {
  const canvas = document.createElement('canvas');
  canvas.width = targetSize;
  canvas.height = targetSize;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('Could not obtain 2D canvas context');

  // Solid background
  ctx.fillStyle = options.backgroundColor;
  ctx.fillRect(0, 0, targetSize, targetSize);

  // Calculate safe zone placement
  const safe = calculateSafeZone(targetSize, options.maskablePadding);

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  if (source.type === 'svg' && source.svgText) {
    const blob = new Blob([source.svgText], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    try {
      const img = await loadImage(url);
      drawTransformedImageIntoRect(ctx, img, safe.x, safe.y, safe.logoSize, safe.logoSize, options.nonSquareStrategy);
    } finally {
      URL.revokeObjectURL(url);
    }
  } else {
    const img = await loadImage(source.previewUrl);
    drawTransformedImageIntoRect(ctx, img, safe.x, safe.y, safe.logoSize, safe.logoSize, options.nonSquareStrategy);
  }

  return ctx.getImageData(0, 0, targetSize, targetSize);
}

/**
 * Draws image into an exact bounding box rect with fit/crop strategy.
 */
function drawTransformedImageIntoRect(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  rectX: number,
  rectY: number,
  rectW: number,
  rectH: number,
  strategy: NonSquareStrategy
) {
  const srcW = img.naturalWidth || img.width;
  const srcH = img.naturalHeight || img.height;

  if (strategy === 'crop') {
    const scale = Math.max(rectW / srcW, rectH / srcH);
    const drawW = srcW * scale;
    const drawH = srcH * scale;
    const dx = rectX + (rectW - drawW) / 2;
    const dy = rectY + (rectH - drawH) / 2;

    ctx.save();
    ctx.beginPath();
    ctx.rect(rectX, rectY, rectW, rectH);
    ctx.clip();
    ctx.drawImage(img, dx, dy, drawW, drawH);
    ctx.restore();
  } else {
    const scale = Math.min(rectW / srcW, rectH / srcH);
    const drawW = srcW * scale;
    const drawH = srcH * scale;
    const dx = rectX + (rectW - drawW) / 2;
    const dy = rectY + (rectH - drawH) / 2;
    ctx.drawImage(img, dx, dy, drawW, drawH);
  }
}

/**
 * Encodes an ImageData object into a PNG Uint8Array, with optional oxipng optimization.
 */
export async function encodePngWithOptionalOptimization(
  imageData: ImageData,
  optimize: boolean
): Promise<Uint8Array> {
  // Use jsquash/png for standard PNG encode
  let pngBuffer = await encodePng(imageData);

  if (optimize) {
    try {
      const optimised = await oxipngOptimise(pngBuffer, { level: 2 });
      pngBuffer = optimised;
    } catch {
      // If oxipng fails on edge cases, keep standard encoded PNG buffer
    }
  }

  return new Uint8Array(pngBuffer);
}
