import type { FaviconOptions, GeneratedFile, SourceImage } from '../types';
import { createIco } from './ico';
import { generateManifest } from './manifest';
import { generateHeadTags } from './headTags';
import { renderToCanvas, renderMaskableIcon, encodePngWithOptionalOptimization } from './rasterize';
import type { WorkerTaskIn, WorkerTaskOut } from '../workers/favicon.worker';

export type ProgressCallback = (current: number, total: number, message: string) => void;

/**
 * Executes a worker task or falls back to main thread.
 */
class WorkerDispatcher {
  private worker: Worker | null = null;

  constructor() {
    try {
      if (typeof window !== 'undefined' && typeof Worker !== 'undefined') {
        this.worker = new Worker(
          new URL('../workers/favicon.worker.ts', import.meta.url),
          { type: 'module' }
        );
      }
    } catch {
      this.worker = null;
    }
  }

  public async runTask(task: WorkerTaskIn): Promise<ArrayBuffer> {
    if (!this.worker) {
      throw new Error('Worker unavailable');
    }

    return new Promise((resolve, reject) => {
      const handler = (e: MessageEvent<WorkerTaskOut>) => {
        const msg = e.data;
        if (msg.id === task.id) {
          this.worker?.removeEventListener('message', handler);
          if (msg.type === 'RESIZE_SUCCESS' || msg.type === 'ICO_SUCCESS') {
            resolve(msg.buffer);
          } else if (msg.type === 'TASK_ERROR') {
            reject(new Error(msg.error));
          }
        }
      };

      this.worker.addEventListener('message', handler);
      this.worker.postMessage(task);
    });
  }

  public terminate() {
    if (this.worker) {
      try {
        this.worker.terminate();
      } catch {
        // ignore
      }
      this.worker = null;
    }
  }
}

/**
 * Generates all favicon and app icon assets based on the source image and configured options.
 * Tolerant to individual output failures (e.g. failure of one output does not kill the rest).
 */
export async function generateFaviconPackage(
  source: SourceImage,
  options: FaviconOptions,
  onProgress?: ProgressCallback
): Promise<GeneratedFile[]> {
  const generatedFiles: GeneratedFile[] = [];
  const dispatcher = new WorkerDispatcher();

  const isSvg = source.type === 'svg';
  const totalSteps = options.includeLegacy ? 12 : 8;
  let currentStep = 0;

  const tick = (msg: string) => {
    currentStep++;
    onProgress?.(currentStep, totalSteps, msg);
  };

  try {
    // -------------------------------------------------------------
    // 1. icon.svg (ONLY if source is SVG, direct copy, not rasterized)
    // -------------------------------------------------------------
    if (isSvg && source.svgText) {
      tick('Copying vector icon.svg...');
      try {
        const svgBlob = new Blob([source.svgText], { type: 'image/svg+xml;charset=utf-8' });
        const svgUrl = URL.createObjectURL(svgBlob);
        generatedFiles.push({
          id: 'icon-svg',
          name: 'icon.svg',
          type: 'image/svg+xml',
          size: svgBlob.size,
          blob: svgBlob,
          url: svgUrl,
          category: 'icon',
          description: 'Scalable vector icon for modern desktop & mobile browsers',
          purpose: 'any',
        });
      } catch (err) {
        console.warn('Failed to produce icon.svg:', err);
      }
    }

    // -------------------------------------------------------------
    // 2. favicon.ico containing 16, 32, and 48 px images
    // -------------------------------------------------------------
    tick('Generating multi-resolution favicon.ico (16, 32, 48px)...');
    try {
      const icoSizes = [16, 32, 48];
      const icoImages: Array<{ width: number; height: number; imageData: ImageData }> = [];

      for (const size of icoSizes) {
        const imgData = await renderToCanvas(
          source,
          size,
          size,
          options.nonSquareStrategy
        );
        icoImages.push({ width: size, height: size, imageData: imgData });
      }

      let icoBuffer: ArrayBuffer;
      try {
        icoBuffer = await dispatcher.runTask({
          type: 'BUILD_ICO',
          id: 'build-ico',
          images: icoImages,
          optimize: options.optimizePng,
        });
      } catch {
        // Fallback to main thread
        const entries: Array<{ width: number; height: number; pngBuffer: Uint8Array }> = [];
        for (const item of icoImages) {
          const pngBytes = await encodePngWithOptionalOptimization(item.imageData, options.optimizePng);
          entries.push({ width: item.width, height: item.height, pngBuffer: pngBytes });
        }
        const icoBytes = createIco(entries);
        icoBuffer = icoBytes.buffer.slice(icoBytes.byteOffset, icoBytes.byteOffset + icoBytes.byteLength);
      }

      const icoBlob = new Blob([icoBuffer], { type: 'image/x-icon' });
      generatedFiles.push({
        id: 'favicon-ico',
        name: 'favicon.ico',
        type: 'image/x-icon',
        size: icoBlob.size,
        blob: icoBlob,
        url: URL.createObjectURL(icoBlob),
        category: 'icon',
        description: 'Multi-resolution ICO containing 16×16, 32×32, and 48×48px',
      });
    } catch (err) {
      console.warn('Failed to produce favicon.ico:', err);
    }

    // -------------------------------------------------------------
    // 3. apple-touch-icon.png (180x180, FLATTENED onto background colour)
    // -------------------------------------------------------------
    tick('Generating Apple Touch Icon (180x180 flattened)...');
    try {
      const appleImgData = await renderToCanvas(
        source,
        180,
        180,
        options.nonSquareStrategy,
        options.backgroundColor
      );

      const applePng = await encodePngWithOptionalOptimization(appleImgData, options.optimizePng);
      const appleBlob = new Blob([applePng.buffer as ArrayBuffer], { type: 'image/png' });

      generatedFiles.push({
        id: 'apple-touch-icon',
        name: 'apple-touch-icon.png',
        type: 'image/png',
        dimensions: { width: 180, height: 180 },
        size: appleBlob.size,
        blob: appleBlob,
        url: URL.createObjectURL(appleBlob),
        category: 'icon',
        description: 'iOS home-screen icon flattened onto background (iOS auto-masks corners)',
      });
    } catch (err) {
      console.warn('Failed to produce apple-touch-icon.png:', err);
    }

    // -------------------------------------------------------------
    // 4. icon-192.png (purpose "any")
    // -------------------------------------------------------------
    tick('Generating standard PWA icon-192.png...');
    try {
      const imgData192 = await renderToCanvas(
        source,
        192,
        192,
        options.nonSquareStrategy
      );
      const png192 = await encodePngWithOptionalOptimization(imgData192, options.optimizePng);
      const blob192 = new Blob([png192.buffer as ArrayBuffer], { type: 'image/png' });

      generatedFiles.push({
        id: 'icon-192',
        name: 'icon-192.png',
        type: 'image/png',
        dimensions: { width: 192, height: 192 },
        size: blob192.size,
        blob: blob192,
        url: URL.createObjectURL(blob192),
        category: 'icon',
        description: 'Standard 192×192 PWA app icon (purpose: any)',
        purpose: 'any',
      });
    } catch (err) {
      console.warn('Failed to produce icon-192.png:', err);
    }

    // -------------------------------------------------------------
    // 5. icon-512.png (purpose "any")
    // -------------------------------------------------------------
    tick('Generating high-res PWA icon-512.png...');
    try {
      const imgData512 = await renderToCanvas(
        source,
        512,
        512,
        options.nonSquareStrategy
      );
      const png512 = await encodePngWithOptionalOptimization(imgData512, options.optimizePng);
      const blob512 = new Blob([png512.buffer as ArrayBuffer], { type: 'image/png' });

      generatedFiles.push({
        id: 'icon-512',
        name: 'icon-512.png',
        type: 'image/png',
        dimensions: { width: 512, height: 512 },
        size: blob512.size,
        blob: blob512,
        url: URL.createObjectURL(blob512),
        category: 'icon',
        description: 'High-res 512×512 PWA splash & store icon (purpose: any)',
        purpose: 'any',
      });
    } catch (err) {
      console.warn('Failed to produce icon-512.png:', err);
    }

    // -------------------------------------------------------------
    // 6. icon-512-maskable.png (Safe zone padding on solid background)
    // -------------------------------------------------------------
    tick('Generating Android safe-zone maskable icon-512-maskable.png...');
    try {
      const maskableImgData = await renderMaskableIcon(
        source,
        512,
        options
      );
      const pngMaskable = await encodePngWithOptionalOptimization(maskableImgData, options.optimizePng);
      const blobMaskable = new Blob([pngMaskable.buffer as ArrayBuffer], { type: 'image/png' });

      generatedFiles.push({
        id: 'icon-512-maskable',
        name: 'icon-512-maskable.png',
        type: 'image/png',
        dimensions: { width: 512, height: 512 },
        size: blobMaskable.size,
        blob: blobMaskable,
        url: URL.createObjectURL(blobMaskable),
        category: 'icon',
        description: `Android adaptive maskable icon with ${100 - options.maskablePadding}% safe zone on solid background`,
        purpose: 'maskable',
      });
    } catch (err) {
      console.warn('Failed to produce icon-512-maskable.png:', err);
    }

    // -------------------------------------------------------------
    // 7. Optional Legacy Sizes
    // -------------------------------------------------------------
    if (options.includeLegacy) {
      tick('Generating optional legacy sizes...');
      const legacySpecs = [
        { name: 'favicon-16x16.png', w: 16, h: 16, desc: 'Legacy 16×16 PNG icon' },
        { name: 'favicon-32x32.png', w: 32, h: 32, desc: 'Legacy 32×32 PNG icon' },
        {
          name: 'apple-touch-icon-152x152.png',
          w: 152,
          h: 152,
          desc: 'Legacy iPad Retina touch icon (flattened)',
          flatten: true,
        },
        {
          name: 'apple-touch-icon-167x167.png',
          w: 167,
          h: 167,
          desc: 'Legacy iPad Pro touch icon (flattened)',
          flatten: true,
        },
      ];

      for (const spec of legacySpecs) {
        try {
          const img = await renderToCanvas(
            source,
            spec.w,
            spec.h,
            options.nonSquareStrategy,
            spec.flatten ? options.backgroundColor : undefined
          );
          const png = await encodePngWithOptionalOptimization(img, options.optimizePng);
          const blob = new Blob([png.buffer as ArrayBuffer], { type: 'image/png' });
          generatedFiles.push({
            id: spec.name,
            name: spec.name,
            type: 'image/png',
            dimensions: { width: spec.w, height: spec.h },
            size: blob.size,
            blob,
            url: URL.createObjectURL(blob),
            category: 'legacy',
            description: spec.desc,
          });
        } catch {
          // ignore legacy failure
        }
      }
    }

    // -------------------------------------------------------------
    // 8. manifest.webmanifest
    // -------------------------------------------------------------
    tick('Creating manifest.webmanifest...');
    try {
      const { json } = generateManifest(options, isSvg);
      const manifestBlob = new Blob([json], { type: 'application/manifest+json;charset=utf-8' });
      generatedFiles.push({
        id: 'manifest-webmanifest',
        name: 'manifest.webmanifest',
        type: 'application/manifest+json',
        size: manifestBlob.size,
        blob: manifestBlob,
        url: URL.createObjectURL(manifestBlob),
        category: 'manifest',
        description: 'W3C PWA Web Manifest with distinct maskable icon entry',
      });
    } catch (err) {
      console.warn('Failed to generate manifest:', err);
    }

    // -------------------------------------------------------------
    // 9. head-snippet.html
    // -------------------------------------------------------------
    tick('Composing ready-to-paste <head> tags snippet...');
    try {
      const snippetHtml = generateHeadTags(options, isSvg);
      const snippetBlob = new Blob([snippetHtml], { type: 'text/html;charset=utf-8' });
      generatedFiles.push({
        id: 'head-snippet-html',
        name: 'head-snippet.html',
        type: 'text/html',
        size: snippetBlob.size,
        blob: snippetBlob,
        url: URL.createObjectURL(snippetBlob),
        category: 'snippet',
        description: 'Clean HTML tags ready to paste into your index.html or root layout',
      });
    } catch (err) {
      console.warn('Failed to generate head tags:', err);
    }

    tick('Packaging complete!');
  } finally {
    dispatcher.terminate();
  }

  return generatedFiles;
}
