import type { SafeZoneDimensions } from '../types';

/**
 * Calculates dimensions and coordinates for placing a logo inside an Android maskable icon canvas.
 *
 * In the W3C / Android Maskable icon specification:
 * - The safe zone is a centered circle with diameter = 80% of the canvas.
 * - Any content within this safe circle is guaranteed not to be clipped by Android device masks
 *   (squircle, circle, rounded rectangle, teardrop, etc.).
 *
 * @param canvasSize The width & height of the maskable canvas (typically 512)
 * @param paddingPercent Percentage of canvas dedicated to padding/safe margin (default 20, meaning logo occupies 80%)
 */
export function calculateSafeZone(canvasSize: number, paddingPercent: number = 20): SafeZoneDimensions {
  const clampedPadding = Math.max(0, Math.min(50, paddingPercent));
  const scale = (100 - clampedPadding) / 100;
  const logoSize = Math.round(canvasSize * scale);
  const x = Math.round((canvasSize - logoSize) / 2);
  const y = Math.round((canvasSize - logoSize) / 2);

  const safeDiameter = Math.round(canvasSize * 0.8);
  const safeRadius = Math.round(safeDiameter / 2);

  return {
    canvasSize,
    logoSize,
    x,
    y,
    safeDiameter,
    safeRadius,
  };
}

/**
 * Validates a padding percentage value.
 */
export function isValidPadding(padding: number): boolean {
  return typeof padding === 'number' && !isNaN(padding) && padding >= 0 && padding <= 50;
}
