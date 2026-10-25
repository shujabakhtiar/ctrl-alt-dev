import { toast } from 'sonner';

/**
 * AppError is used for operational errors whose messages are safe to show users.
 */
export class AppError extends Error {
  public code?: string;
  public status?: number;
  public fieldErrors?: Record<string, string | string[]>;

  constructor(
    message: string,
    options?: {
      code?: string;
      status?: number;
      fieldErrors?: Record<string, string | string[]>;
      cause?: unknown;
    }
  ) {
    super(message);
    this.name = 'AppError';
    this.code = options?.code;
    this.status = options?.status;
    this.fieldErrors = options?.fieldErrors;
    if (options?.cause) {
      this.cause = options?.cause;
    }
  }
}

export type HandleErrorOptions = {
  context?: string;
  silent?: boolean;
};

export type HandledErrorResult = {
  message: string;
  fieldErrors: Record<string, string | string[]>;
  status?: number;
  code?: string;
  isAborted: boolean;
};

/**
 * Change toast library here only.
 */
export function showErrorToast(message: string): void {
  toast.error(message);
}

/**
 * Repo-wide error handler. The only place errors are logged and toasted.
 */
export function handleError(
  error: unknown,
  options: HandleErrorOptions = {}
): HandledErrorResult {
  const { context = 'Operation', silent = false } = options;

  // Check for aborted requests (Fetch AbortController)
  if (
    (error instanceof DOMException && error.name === 'AbortError') ||
    (error instanceof Error && error.name === 'AbortError')
  ) {
    return {
      message: 'Request was cancelled',
      fieldErrors: {},
      isAborted: true,
    };
  }

  let userMessage = 'An unexpected error occurred. Please try again.';
  let fieldErrors: Record<string, string | string[]> = {};
  let status: number | undefined;
  let code: string | undefined;

  if (error instanceof AppError) {
    userMessage = error.message;
    fieldErrors = error.fieldErrors ?? {};
    status = error.status;
    code = error.code;
  } else if (error instanceof Error) {
    console.error(`[${context}]`, error);
  } else {
    console.error(`[${context}] Unknown error value:`, error);
  }

  if (!silent) {
    showErrorToast(userMessage);
  }

  return {
    message: userMessage,
    fieldErrors,
    status,
    code,
    isAborted: false,
  };
}
