import type { RgbaColor, BackgroundDetectionResult, LabColor } from '../types';
import { rgbToLab, labDeltaE, rgbToHex } from './colour';

type ColorCluster = {
  rSum: number;
  gSum: number;
  bSum: number;
  count: number;
  lab: LabColor;
};

/**
 * Samples all perimeter pixels (top, bottom, left, and right borders) to determine
 * the dominant solid background color and a confidence metric.
 */
export function detectBackground(
  data: Uint8ClampedArray | Uint8Array,
  width: number,
  height: number
): BackgroundDetectionResult {
  if (width <= 0 || height <= 0 || data.length < width * height * 4) {
    return {
      color: { r: 255, g: 255, b: 255, a: 255 },
      hex: '#FFFFFF',
      confidence: 0,
      isSolid: false,
    };
  }

  const clusters: ColorCluster[] = [];
  const CLUSTER_DELTA_E = 8.0; // Distance within which colors belong to same cluster
  let totalBorderPixels = 0;
  let transparentBorderPixels = 0;

  function samplePixel(x: number, y: number) {
    const idx = (y * width + x) * 4;
    const a = data[idx + 3];

    // If border pixel is already transparent, note it
    if (a < 10) {
      transparentBorderPixels++;
      totalBorderPixels++;
      return;
    }

    const r = data[idx];
    const g = data[idx + 1];
    const b = data[idx + 2];
    const lab = rgbToLab(r, g, b);

    totalBorderPixels++;

    // Find if it belongs to an existing cluster
    let matched = false;
    for (const cluster of clusters) {
      if (labDeltaE(lab, cluster.lab) <= CLUSTER_DELTA_E) {
        cluster.rSum += r;
        cluster.gSum += g;
        cluster.bSum += b;
        cluster.count++;
        // Update centroid Lab
        cluster.lab = rgbToLab(
          cluster.rSum / cluster.count,
          cluster.gSum / cluster.count,
          cluster.bSum / cluster.count
        );
        matched = true;
        break;
      }
    }

    if (!matched) {
      clusters.push({
        rSum: r,
        gSum: g,
        bSum: b,
        count: 1,
        lab,
      });
    }
  }

  // Sample top and bottom rows
  for (let x = 0; x < width; x++) {
    samplePixel(x, 0);
    if (height > 1) {
      samplePixel(x, height - 1);
    }
  }

  // Sample left and right columns (excluding corners already sampled)
  for (let y = 1; y < height - 1; y++) {
    samplePixel(0, y);
    if (width > 1) {
      samplePixel(width - 1, y);
    }
  }

  // If most of border is already transparent, default to transparent white
  if (transparentBorderPixels / totalBorderPixels > 0.8) {
    return {
      color: { r: 255, g: 255, b: 255, a: 0 },
      hex: '#FFFFFF',
      confidence: 1.0,
      isSolid: true,
    };
  }

  if (clusters.length === 0) {
    return {
      color: { r: 255, g: 255, b: 255, a: 255 },
      hex: '#FFFFFF',
      confidence: 0,
      isSolid: false,
    };
  }

  // Find dominant cluster
  clusters.sort((a, b) => b.count - a.count);
  const dominant = clusters[0];

  const avgR = Math.round(dominant.rSum / dominant.count);
  const avgG = Math.round(dominant.gSum / dominant.count);
  const avgB = Math.round(dominant.bSum / dominant.count);

  const confidence = dominant.count / totalBorderPixels;
  const isSolid = confidence >= 0.6;

  return {
    color: { r: avgR, g: avgG, b: avgB, a: 255 },
    hex: rgbToHex(avgR, avgG, avgB),
    confidence: Math.round(confidence * 100) / 100,
    isSolid,
  };
}
