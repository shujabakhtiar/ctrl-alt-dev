import { removeBackground } from '../lib/pipeline';
import { detectBackground } from '../lib/detectBackground';
import type { BackgroundRemoverOptions, BackgroundDetectionResult, ProcessResult } from '../types';

export type WorkerInMessage =
  | {
      type: 'DETECT';
      jobId: string;
      data: Uint8ClampedArray;
      width: number;
      height: number;
    }
  | {
      type: 'PROCESS';
      jobId: string;
      data: Uint8ClampedArray;
      width: number;
      height: number;
      options: BackgroundRemoverOptions;
    };

export type WorkerOutMessage =
  | {
      type: 'DETECT_RESULT';
      jobId: string;
      result: BackgroundDetectionResult;
    }
  | {
      type: 'PROCESS_RESULT';
      jobId: string;
      result: ProcessResult;
    }
  | {
      type: 'ERROR';
      jobId: string;
      error: string;
    };

let latestJobId: string | null = null;

self.onmessage = (event: MessageEvent<WorkerInMessage>) => {
  const msg = event.data;
  latestJobId = msg.jobId;

  if (msg.type === 'DETECT') {
    try {
      const result = detectBackground(msg.data, msg.width, msg.height);
      if (latestJobId === msg.jobId) {
        self.postMessage({
          type: 'DETECT_RESULT',
          jobId: msg.jobId,
          result,
        } as WorkerOutMessage);
      }
    } catch (err) {
      self.postMessage({
        type: 'ERROR',
        jobId: msg.jobId,
        error: err instanceof Error ? err.message : String(err),
      } as WorkerOutMessage);
    }
    return;
  }

  if (msg.type === 'PROCESS') {
    try {
      const result = removeBackground(msg.data, msg.width, msg.height, msg.options);
      if (latestJobId === msg.jobId) {
        // Transfer the resulting Uint8ClampedArray buffer for zero-copy high performance
        const response: WorkerOutMessage = {
          type: 'PROCESS_RESULT',
          jobId: msg.jobId,
          result,
        };
        (self as unknown as { postMessage: (msg: unknown, transfer?: Transferable[]) => void }).postMessage(
          response,
          [result.data.buffer]
        );
      }
    } catch (err) {
      self.postMessage({
        type: 'ERROR',
        jobId: msg.jobId,
        error: err instanceof Error ? err.message : String(err),
      } as WorkerOutMessage);
    }
  }
};
