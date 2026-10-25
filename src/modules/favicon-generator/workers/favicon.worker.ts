import { encode as encodePng } from '@jsquash/png';
import resize from '@jsquash/resize';
import { optimise as oxipngOptimise } from '@jsquash/oxipng';
import { createIco } from '../lib/ico';

export type WorkerTaskIn =
  | {
      type: 'RESIZE_AND_ENCODE_PNG';
      id: string;
      imageData: ImageData;
      targetWidth: number;
      targetHeight: number;
      optimize: boolean;
    }
  | {
      type: 'BUILD_ICO';
      id: string;
      images: Array<{
        width: number;
        height: number;
        imageData: ImageData;
      }>;
      optimize: boolean;
    };

export type WorkerTaskOut =
  | {
      type: 'RESIZE_SUCCESS';
      id: string;
      buffer: ArrayBuffer;
      size: number;
    }
  | {
      type: 'ICO_SUCCESS';
      id: string;
      buffer: ArrayBuffer;
      size: number;
    }
  | {
      type: 'TASK_ERROR';
      id: string;
      error: string;
    };

self.onmessage = async (event: MessageEvent<WorkerTaskIn>) => {
  const task = event.data;

  if (task.type === 'RESIZE_AND_ENCODE_PNG') {
    try {
      let finalImg = task.imageData;
      if (
        task.imageData.width !== task.targetWidth ||
        task.imageData.height !== task.targetHeight
      ) {
        finalImg = await resize(task.imageData, {
          width: task.targetWidth,
          height: task.targetHeight,
          method: 'lanczos3',
          premultiply: true,
          linearRGB: true,
        });
      }

      let pngBuffer = await encodePng(finalImg);
      if (task.optimize) {
        try {
          pngBuffer = await oxipngOptimise(pngBuffer, { level: 2 });
        } catch {
          // fallback to unoptimized
        }
      }

      const response: WorkerTaskOut = {
        type: 'RESIZE_SUCCESS',
        id: task.id,
        buffer: pngBuffer,
        size: pngBuffer.byteLength,
      };

      (self as unknown as { postMessage: (msg: unknown, transfer?: Transferable[]) => void }).postMessage(
        response,
        [pngBuffer]
      );
    } catch (err: unknown) {
      self.postMessage({
        type: 'TASK_ERROR',
        id: task.id,
        error: err instanceof Error ? err.message : String(err),
      } as WorkerTaskOut);
    }
    return;
  }

  if (task.type === 'BUILD_ICO') {
    try {
      const icoEntries: Array<{ width: number; height: number; pngBuffer: Uint8Array }> = [];

      for (const item of task.images) {
        let currentImg = item.imageData;
        if (currentImg.width !== item.width || currentImg.height !== item.height) {
          currentImg = await resize(currentImg, {
            width: item.width,
            height: item.height,
            method: 'lanczos3',
            premultiply: true,
            linearRGB: true,
          });
        }

        let png = await encodePng(currentImg);
        if (task.optimize) {
          try {
            png = await oxipngOptimise(png, { level: 2 });
          } catch {
            // ignore
          }
        }

        icoEntries.push({
          width: item.width,
          height: item.height,
          pngBuffer: new Uint8Array(png),
        });
      }

      const icoBytes = createIco(icoEntries);
      const icoBuffer = icoBytes.buffer.slice(
        icoBytes.byteOffset,
        icoBytes.byteOffset + icoBytes.byteLength
      );

      const response: WorkerTaskOut = {
        type: 'ICO_SUCCESS',
        id: task.id,
        buffer: icoBuffer,
        size: icoBuffer.byteLength,
      };

      (self as unknown as { postMessage: (msg: unknown, transfer?: Transferable[]) => void }).postMessage(
        response,
        [icoBuffer]
      );
    } catch (err: unknown) {
      self.postMessage({
        type: 'TASK_ERROR',
        id: task.id,
        error: err instanceof Error ? err.message : String(err),
      } as WorkerTaskOut);
    }
    return;
  }
};
