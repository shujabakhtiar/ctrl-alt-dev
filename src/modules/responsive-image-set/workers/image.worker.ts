import {
  decodeImage,
  resizeImageData,
  encodeImageData,
  verifyOutput,
} from '../codecs';
import type { OutputImageFormat } from '../types';

export type WorkerMessageIn =
  | {
      type: 'DECODE_SOURCE';
      buffer: ArrayBuffer;
      format: 'png' | 'jpeg' | 'webp' | 'avif';
    }
  | {
      type: 'PROCESS_VARIANT';
      taskId: string;
      imageData: ImageData;
      targetWidth: number;
      targetHeight: number;
      outputFormat: OutputImageFormat;
      options: {
        quality: number;
        lossless?: boolean;
        speed?: number;
      };
    };

export type WorkerMessageOut =
  | {
      type: 'DECODE_SUCCESS';
      width: number;
      height: number;
      imageData: ImageData;
    }
  | {
      type: 'DECODE_ERROR';
      error: string;
    }
  | {
      type: 'STAGE_CHANGE';
      taskId: string;
      stage: 'resizing' | 'encoding' | 'verifying';
    }
  | {
      type: 'VARIANT_SUCCESS';
      taskId: string;
      buffer: ArrayBuffer;
      width: number;
      height: number;
      format: OutputImageFormat;
      size: number;
    }
  | {
      type: 'VARIANT_ERROR';
      taskId: string;
      error: string;
    };

self.onmessage = async (event: MessageEvent<WorkerMessageIn>) => {
  const msg = event.data;

  if (msg.type === 'DECODE_SOURCE') {
    try {
      const imageData = await decodeImage(msg.buffer, msg.format);
      const response: WorkerMessageOut = {
        type: 'DECODE_SUCCESS',
        width: imageData.width,
        height: imageData.height,
        imageData,
      };
      // Transfer underlying buffer if possible
      (self as unknown as { postMessage: (msg: unknown, transfer?: Transferable[]) => void }).postMessage(response, [imageData.data.buffer]);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      self.postMessage({
        type: 'DECODE_ERROR',
        error: errorMsg,
      } as WorkerMessageOut);
    }
    return;
  }

  if (msg.type === 'PROCESS_VARIANT') {
    const { taskId, imageData, targetWidth, targetHeight, outputFormat, options } = msg;

    try {
      // 1. Resize Stage
      self.postMessage({
        type: 'STAGE_CHANGE',
        taskId,
        stage: 'resizing',
      } as WorkerMessageOut);

      const resized = await resizeImageData(imageData, targetWidth, targetHeight);

      // 2. Encode Stage
      self.postMessage({
        type: 'STAGE_CHANGE',
        taskId,
        stage: 'encoding',
      } as WorkerMessageOut);

      const encodedBuffer = await encodeImageData(resized, outputFormat, {
        quality: options.quality,
        lossless: options.lossless,
        speed: options.speed,
      });

      // 3. Verify Stage: decode and confirm dimension match
      self.postMessage({
        type: 'STAGE_CHANGE',
        taskId,
        stage: 'verifying',
      } as WorkerMessageOut);

      const verification = await verifyOutput(
        encodedBuffer,
        outputFormat,
        targetWidth,
        targetHeight
      );

      if (!verification.valid) {
        throw new Error(
          `Verification dimension mismatch: expected ${targetWidth}x${targetHeight}, got ${verification.actualWidth}x${verification.actualHeight}`
        );
      }

      // 4. Success
      const successMsg: WorkerMessageOut = {
        type: 'VARIANT_SUCCESS',
        taskId,
        buffer: encodedBuffer,
        width: targetWidth,
        height: targetHeight,
        format: outputFormat,
        size: encodedBuffer.byteLength,
      };

      (self as unknown as { postMessage: (msg: unknown, transfer?: Transferable[]) => void }).postMessage(successMsg, [encodedBuffer]);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      self.postMessage({
        type: 'VARIANT_ERROR',
        taskId,
        error: errorMsg,
      } as WorkerMessageOut);
    }
  }
};
