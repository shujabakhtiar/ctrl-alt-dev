import type { RgbaColor } from '../types';

/**
 * Removes halo artifacts around edges by mathematically un-mixing the background color
 * from semi-transparent border pixels.
 *
 * Formula:
 * Observed = a * Foreground + (1 - a) * Background
 * Foreground = (Observed - (1 - a) * Background) / a
 */
export function decontaminateEdges(
  output: Uint8ClampedArray,
  backgroundColor: RgbaColor
): void {
  const totalPixels = output.length / 4;
  const bgR = backgroundColor.r;
  const bgG = backgroundColor.g;
  const bgB = backgroundColor.b;

  const EPSILON_ALPHA = 0.04 * 255; // ~10.2

  for (let i = 0; i < totalPixels; i++) {
    const idx = i * 4;
    const alpha = output[idx + 3];

    // Fully opaque or fully transparent pixels need no decontamination
    if (alpha === 0 || alpha === 255) {
      continue;
    }

    // Snap tiny alphas to 0 to prevent division noise amplification
    if (alpha < EPSILON_ALPHA) {
      output[idx + 3] = 0;
      continue;
    }

    const a = alpha / 255;
    const invA = 1 - a;

    const obsR = output[idx];
    const obsG = output[idx + 1];
    const obsB = output[idx + 2];

    const cleanR = Math.round((obsR - invA * bgR) / a);
    const cleanG = Math.round((obsG - invA * bgG) / a);
    const cleanB = Math.round((obsB - invA * bgB) / a);

    output[idx] = Math.max(0, Math.min(255, cleanR));
    output[idx + 1] = Math.max(0, Math.min(255, cleanG));
    output[idx + 2] = Math.max(0, Math.min(255, cleanB));
  }
}
