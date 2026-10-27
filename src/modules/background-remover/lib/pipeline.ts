import type {
  BackgroundRemoverOptions,
  ProcessResult,
  PipelineStats,
} from '../types';
import { rgbToLab, rgbToHex } from './colour';
import { detectBackground } from './detectBackground';
import { computeBackgroundDistances } from './floodFill';
import { applyAlphaRamp } from './alphaRamp';
import { decontaminateEdges } from './decontaminate';
import { shrinkEdges, smoothEdges, removeSmallIslands } from './cleanup';

/**
 * Pure, self-contained background removal pipeline.
 * Runs synchronously over raw RGBA buffers and never mutates the input buffer.
 */
export function removeBackground(
  inputData: Uint8ClampedArray | Uint8Array,
  width: number,
  height: number,
  options: BackgroundRemoverOptions
): ProcessResult {
  const startTime = performance.now();
  const totalPixels = width * height;

  // 1. Create independent output buffer (never mutate input)
  const output = new Uint8ClampedArray(inputData.length);
  output.set(inputData);

  // 2. Detect or resolve target background color
  const detection = detectBackground(inputData, width, height);
  const targetColor = options.targetColor ?? detection.color;
  const targetLab = rgbToLab(targetColor.r, targetColor.g, targetColor.b);

  // 3. Compute background distances (flood-fill or global)
  const distances = computeBackgroundDistances(
    output,
    width,
    height,
    targetLab,
    options.tolerance,
    options.softness,
    options.mode
  );

  // 4. Apply anti-aliased linear alpha ramp
  applyAlphaRamp(output, distances, options.tolerance, options.softness);

  // 5. Cleanup passes
  if (options.cleanup.decontaminate) {
    decontaminateEdges(output, targetColor);
  }

  if (options.cleanup.shrink > 0) {
    shrinkEdges(output, width, height, options.cleanup.shrink);
  }

  if (options.cleanup.smooth > 0) {
    smoothEdges(output, width, height, options.cleanup.smooth);
  }

  if (options.cleanup.removeIslands && options.cleanup.islandSize > 0) {
    removeSmallIslands(output, width, height, options.cleanup.islandSize);
  }

  // 6. Compute metrics and stats
  let removedPixels = 0;
  let partiallyTransparentPixels = 0;
  let remainingOpaque = 0;

  for (let i = 0; i < totalPixels; i++) {
    const alpha = output[i * 4 + 3];
    if (alpha === 0) {
      removedPixels++;
    } else if (alpha < 255) {
      partiallyTransparentPixels++;
    } else {
      remainingOpaque++;
    }
  }

  const isAllBackground = remainingOpaque === 0 && partiallyTransparentPixels === 0;
  const processingTimeMs = Math.round(performance.now() - startTime);

  const stats: PipelineStats = {
    detectedColor: targetColor,
    detectedHex: rgbToHex(targetColor.r, targetColor.g, targetColor.b),
    confidence: detection.confidence,
    isSolid: detection.isSolid,
    isAllBackground,
    totalPixels,
    removedPixels,
    partiallyTransparentPixels,
    processingTimeMs,
  };

  return {
    data: output,
    width,
    height,
    stats,
  };
}
