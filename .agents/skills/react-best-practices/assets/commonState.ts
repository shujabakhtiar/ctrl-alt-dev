export type CommonState = {
  loading: boolean;
  submitting: boolean;
  success: boolean;
  error: string | null;
  errors: Record<string, string | string[]>;
  show: boolean;
};

export const COMMON_STATE: Readonly<CommonState> = Object.freeze({
  loading: false,
  submitting: false,
  success: false,
  error: null,
  errors: {},
  show: false,
});

/**
 * Creates a fresh common state object for component or store initialization.
 */
export function createCommonState(overrides: Partial<CommonState> = {}): CommonState {
  return {
    ...COMMON_STATE,
    ...overrides,
  };
}

/**
 * Returns error-reset fields to merge into state when starting a new attempt.
 */
export function clearErrors(): Pick<CommonState, 'error' | 'errors'> {
  return {
    error: null,
    errors: {},
  };
}
