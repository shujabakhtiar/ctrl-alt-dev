import type {
  BackgroundRemoverOptions,
  BackgroundDetectionResult,
  ProcessResult,
} from '../types';
import type { WorkerInMessage, WorkerOutMessage } from './backgroundRemover.worker';

class BackgroundRemoverWorkerBridge {
  private worker: Worker | null = null;
  private pendingJobId: string | null = null;
  private activeReject: ((reason?: unknown) => void) | null = null;
  private activeResolve: ((value: unknown) => void) | null = null;

  private initWorker(): Worker {
    if (!this.worker) {
      this.worker = new Worker(
        new URL('./backgroundRemover.worker.ts', import.meta.url),
        { type: 'module' }
      );

      this.worker.onmessage = (event: MessageEvent<WorkerOutMessage>) => {
        const msg = event.data;
        if (msg.jobId !== this.pendingJobId) {
          // Stale job response; ignore
          return;
        }

        if (msg.type === 'DETECT_RESULT') {
          this.activeResolve?.(msg.result);
          this.cleanupJob();
        } else if (msg.type === 'PROCESS_RESULT') {
          this.activeResolve?.(msg.result);
          this.cleanupJob();
        } else if (msg.type === 'ERROR') {
          this.activeReject?.(new Error(msg.error));
          this.cleanupJob();
        }
      };

      this.worker.onerror = (err) => {
        this.activeReject?.(err);
        this.cleanupJob();
      };
    }
    return this.worker;
  }

  private cleanupJob() {
    this.pendingJobId = null;
    this.activeResolve = null;
    this.activeReject = null;
  }

  public detect(
    data: Uint8ClampedArray,
    width: number,
    height: number
  ): Promise<BackgroundDetectionResult> {
    const worker = this.initWorker();
    const jobId = `detect-${Date.now()}-${Math.random()}`;

    // Cancel prior pending job if any
    if (this.activeReject) {
      this.activeReject(new DOMException('Job superseded by new request', 'AbortError'));
      this.cleanupJob();
    }

    this.pendingJobId = jobId;

    return new Promise((resolve, reject) => {
      this.activeResolve = resolve as (value: unknown) => void;
      this.activeReject = reject;

      // Copy buffer to prevent detachment of caller's buffer during postMessage transfer
      const copy = new Uint8ClampedArray(data);
      const msg: WorkerInMessage = {
        type: 'DETECT',
        jobId,
        data: copy,
        width,
        height,
      };

      worker.postMessage(msg, [copy.buffer]);
    });
  }

  public process(
    data: Uint8ClampedArray,
    width: number,
    height: number,
    options: BackgroundRemoverOptions
  ): Promise<ProcessResult> {
    const worker = this.initWorker();
    const jobId = `proc-${Date.now()}-${Math.random()}`;

    if (this.activeReject) {
      this.activeReject(new DOMException('Job superseded by new request', 'AbortError'));
      this.cleanupJob();
    }

    this.pendingJobId = jobId;

    return new Promise((resolve, reject) => {
      this.activeResolve = resolve as (value: unknown) => void;
      this.activeReject = reject;

      const copy = new Uint8ClampedArray(data);
      const msg: WorkerInMessage = {
        type: 'PROCESS',
        jobId,
        data: copy,
        width,
        height,
        options,
      };

      worker.postMessage(msg, [copy.buffer]);
    });
  }

  public terminate() {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
      this.cleanupJob();
    }
  }
}

export const workerBridge = new BackgroundRemoverWorkerBridge();
