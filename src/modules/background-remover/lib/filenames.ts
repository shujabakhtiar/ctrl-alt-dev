import type { OutputFormat } from '../types';

/**
 * Generates an output filename by stripping the extension and adding `-transparent.<ext>`.
 */
export function formatOutputFilename(
  originalFilename: string,
  format: OutputFormat
): string {
  const lastDot = originalFilename.lastIndexOf('.');
  const base = lastDot > 0 ? originalFilename.slice(0, lastDot) : originalFilename;
  const ext = format === 'webp' ? 'webp' : 'png';
  return `${base}-transparent.${ext}`;
}
