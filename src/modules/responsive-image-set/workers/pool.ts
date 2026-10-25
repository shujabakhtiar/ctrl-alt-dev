import type { WorkerMessageIn, WorkerMessageOut } from './image.worker';
import type { OutputImageFormat } from '../types';

export type TaskProgressCallback = (stage: 'resizing' | 'encoding' | 'verifying') => void;

export class ImageWorkerPool {
  private workers: Worker[] = [];
  private activeWorkers = 0;
  private maxConcurrency: number;
  private queue: Array<() => Promise<void>> = [];
  private isCancelled = false;

  constructor(maxConcurrency = 2) {
    // Keep max concurrency between 1 and 2 to avoid memory spikes with AVIF
    this.maxConcurrency = Math.max(1, Math.min(2, maxConcurrency));
  }

  private createWorker(): Worker {
    const worker = new Worker(
      new URL('./image.worker.ts', import.meta.url),
      { type: 'module' }
    );
    return worker;
  }

  /**
   * Decodes a source image ArrayBuffer using a worker.
   */
  public async decodeSource(
    buffer: ArrayBuffer,
    format: 'png' | 'jpeg' | 'webp' | 'avif'
  ): Promise<{ width: number; height: number; imageData: ImageData }> {
    const worker = this.createWorker();

    return new Promise((resolve, reject) => {
      worker.onmessage = (event: MessageEvent<WorkerMessageOut>) => {
        const data = event.data;
        if (data.type === 'DECODE_SUCCESS') {
          worker.terminate();
          resolve({
            width: data.width,
            height: data.height,
            imageData: data.imageData,
          });
        } else if (data.type === 'DECODE_ERROR') {
          worker.terminate();
          reject(new Error(data.error));
        }
      };

      worker.onerror = (err) => {
        worker.terminate();
        reject(new Error(`Worker decode error: ${err.message}`));
      };

      const msg: WorkerMessageIn = {
        type: 'DECODE_SOURCE',
        buffer,
        format,
      };

      worker.postMessage(msg, [buffer]);
    });
  }

  /**
   * Processes a single variant task in a managed worker.
   */
  public async processVariant(
    taskId: string,
    imageData: ImageData,
    targetWidth: number,
    targetHeight: number,
    outputFormat: OutputImageFormat,
    options: {
      quality: number;
      lossless?: boolean;
      speed?: number;
    },
    onProgress?: TaskProgressCallback
  ): Promise<{ buffer: ArrayBuffer; width: number; height: number; format: OutputImageFormat; size: number }> {
    if (this.isCancelled) {
      throw new Error('Task was cancelled');
    }

    return new Promise((resolve, reject) => {
      const taskFn = async () => {
        if (this.isCancelled) {
          reject(new Error('Task was cancelled'));
          return;
        }

        const worker = this.createWorker();
        this.workers.push(worker);

        worker.onmessage = (event: MessageEvent<WorkerMessageOut>) => {
          const data = event.data;

          if (data.type === 'STAGE_CHANGE' && data.taskId === taskId) {
            onProgress?.(data.stage);
          } else if (data.type === 'VARIANT_SUCCESS' && data.taskId === taskId) {
            this.removeWorker(worker);
            resolve({
              buffer: data.buffer,
              width: data.width,
              height: data.height,
              format: data.format,
              size: data.size,
            });
            this.processNext();
          } else if (data.type === 'VARIANT_ERROR' && data.taskId === taskId) {
            this.removeWorker(worker);
            reject(new Error(data.error));
            this.processNext();
          }
        };

        worker.onerror = (err) => {
          this.removeWorker(worker);
          reject(new Error(`Worker error: ${err.message}`));
          this.processNext();
        };

        // Clone ImageData buffer so original can be used by other variant widths
        const clonedBytes = new Uint8ClampedArray(imageData.data);
        const clonedImageData = {
          data: clonedBytes,
          width: imageData.width,
          height: imageData.height,
          colorSpace: imageData.colorSpace || 'srgb',
        } as ImageData;

        const msg: WorkerMessageIn = {
          type: 'PROCESS_VARIANT',
          taskId,
          imageData: clonedImageData,
          targetWidth,
          targetHeight,
          outputFormat,
          options,
        };

        worker.postMessage(msg);
      };

      if (this.activeWorkers < this.maxConcurrency) {
        this.activeWorkers++;
        taskFn();
      } else {
        this.queue.push(async () => {
          this.activeWorkers++;
          await taskFn();
        });
      }
    });
  }

  private processNext() {
    this.activeWorkers = Math.max(0, this.activeWorkers - 1);
    if (!this.isCancelled && this.queue.length > 0 && this.activeWorkers < this.maxConcurrency) {
      const next = this.queue.shift();
      next?.();
    }
  }

  private removeWorker(worker: Worker) {
    worker.terminate();
    const idx = this.workers.indexOf(worker);
    if (idx !== -1) {
      this.workers.splice(idx, 1);
    }
  }

  /**
   * Immediately terminates all active workers and empties the queue.
   */
  public cancelAll() {
    this.isCancelled = true;
    this.queue = [];
    for (const worker of this.workers) {
      try {
        worker.terminate();
      } catch {
        // ignore already terminated
      }
    }
    this.workers = [];
    this.activeWorkers = 0;
  }
}
