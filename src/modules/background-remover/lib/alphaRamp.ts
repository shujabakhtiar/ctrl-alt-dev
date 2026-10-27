/**
 * Calculates the anti-aliased output alpha for a pixel given its perceptual distance.
 *
 * Rules:
 * - If distance < 0: not background, preserve original alpha.
 * - If distance <= tolerance: fully transparent (alpha 0).
 * - If distance between tolerance and tolerance + softness: linear ramp from 0 to original alpha.
 * - Original transparency is always preserved (never increases alpha).
 */
export function calculateRampAlpha(
  distance: number,
  originalAlpha: number,
  tolerance: number,
  softness: number
): number {
  if (distance < 0) {
    return originalAlpha;
  }

  if (originalAlpha === 0) {
    return 0;
  }

  if (distance <= tolerance) {
    return 0;
  }

  if (softness <= 0) {
    return distance <= tolerance ? 0 : originalAlpha;
  }

  const factor = (distance - tolerance) / softness;
  const clampedFactor = Math.max(0, Math.min(1, factor));
  const newAlpha = Math.round(originalAlpha * clampedFactor);

  return Math.min(originalAlpha, newAlpha);
}

/**
 * Applies the alpha ramp over the entire output buffer.
 */
export function applyAlphaRamp(
  output: Uint8ClampedArray,
  distances: Float32Array,
  tolerance: number,
  softness: number
): void {
  const totalPixels = distances.length;
  for (let i = 0; i < totalPixels; i++) {
    const d = distances[i];
    if (d >= 0) {
      const idx = i * 4 + 3;
      const originalAlpha = output[idx];
      output[idx] = calculateRampAlpha(d, originalAlpha, tolerance, softness);
    }
  }
}
