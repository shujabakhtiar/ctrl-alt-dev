import type { LabColor, RemovalMode } from '../types';
import { rgbToLab, labDeltaE } from './colour';

/**
 * Computes background mask and Delta E distances using iterative flood fill.
 * Returns a Float32Array where:
 * - value >= 0: pixel is considered background with given Delta E distance
 * - value < 0: pixel belongs to the subject and is untouched
 */
export function computeBackgroundDistances(
  data: Uint8ClampedArray | Uint8Array,
  width: number,
  height: number,
  targetLab: LabColor,
  tolerance: number,
  softness: number,
  mode: RemovalMode
): Float32Array {
  const totalPixels = width * height;
  const distances = new Float32Array(totalPixels);
  distances.fill(-1);

  const maxThreshold = tolerance + softness;

  if (mode === 'global') {
    // In global mode, test every pixel independently
    for (let i = 0; i < totalPixels; i++) {
      const idx = i * 4;
      const a = data[idx + 3];

      // Existing transparent pixels are treated as background (distance 0)
      if (a < 10) {
        distances[i] = 0;
        continue;
      }

      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      const lab = rgbToLab(r, g, b);
      const d = labDeltaE(lab, targetLab);

      if (d <= maxThreshold) {
        distances[i] = d;
      }
    }
    return distances;
  }

  // Contiguous mode: Iterative Breadth-First Flood Fill seeded from borders
  const visited = new Uint8Array(totalPixels);
  const queue = new Int32Array(totalPixels);
  let head = 0;
  let tail = 0;

  function tryEnqueue(x: number, y: number) {
    const i = y * width + x;
    if (visited[i] === 1) return;
    visited[i] = 1;

    const idx = i * 4;
    const a = data[idx + 3];

    // Already transparent is immediately enqueued as background with distance 0
    if (a < 10) {
      distances[i] = 0;
      queue[tail++] = i;
      return;
    }

    const r = data[idx];
    const g = data[idx + 1];
    const b = data[idx + 2];
    const lab = rgbToLab(r, g, b);
    const d = labDeltaE(lab, targetLab);

    if (d <= maxThreshold) {
      distances[i] = d;
      queue[tail++] = i;
    }
  }

  // Seed queue with all perimeter pixels
  for (let x = 0; x < width; x++) {
    tryEnqueue(x, 0);
    if (height > 1) {
      tryEnqueue(x, height - 1);
    }
  }
  for (let y = 1; y < height - 1; y++) {
    tryEnqueue(0, y);
    if (width > 1) {
      tryEnqueue(width - 1, y);
    }
  }

  // Iterative BFS queue loop (zero heap allocations inside loop)
  while (head < tail) {
    const current = queue[head++];
    const cx = current % width;
    const cy = Math.floor(current / width);

    // 4-way neighbors
    if (cx > 0) tryEnqueue(cx - 1, cy);
    if (cx + 1 < width) tryEnqueue(cx + 1, cy);
    if (cy > 0) tryEnqueue(cx, cy - 1);
    if (cy + 1 < height) tryEnqueue(cx, cy + 1);
  }

  return distances;
}
