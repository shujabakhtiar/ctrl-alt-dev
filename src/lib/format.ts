/**
 * Formats a byte number into human-readable string (e.g. 1.2 MB, 450 KB).
 */
export function formatBytes(bytes: number, decimals = 1): string {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const val = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));
  return `${val} ${sizes[i]}`;
}

/**
 * Calculates percentage savings between original and optimized sizes.
 */
export function calculateSavingsPercent(originalSize: number, optimizedSize: number): number {
  if (originalSize <= 0) return 0;
  const saved = originalSize - optimizedSize;
  return parseFloat(Math.max(0, (saved / originalSize) * 100).toFixed(1));
}
