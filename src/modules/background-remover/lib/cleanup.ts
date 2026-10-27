/**
 * Edge morphological operations (erosion/choke, alpha smoothing, and island speckle removal).
 */

/**
 * Erodes the edge alpha by 1-3 pixels to remove fringing.
 */
export function shrinkEdges(
  output: Uint8ClampedArray,
  width: number,
  height: number,
  pixels: number
): void {
  if (pixels <= 0 || width <= 1 || height <= 1) return;

  const totalPixels = width * height;
  const currentAlpha = new Uint8Array(totalPixels);
  for (let i = 0; i < totalPixels; i++) {
    currentAlpha[i] = output[i * 4 + 3];
  }

  const nextAlpha = new Uint8Array(totalPixels);

  for (let p = 0; p < pixels; p++) {
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const i = y * width + x;
        const a = currentAlpha[i];
        if (a === 0) {
          nextAlpha[i] = 0;
          continue;
        }

        let minNeighbor = a;
        if (x > 0) minNeighbor = Math.min(minNeighbor, currentAlpha[i - 1]);
        if (x + 1 < width) minNeighbor = Math.min(minNeighbor, currentAlpha[i + 1]);
        if (y > 0) minNeighbor = Math.min(minNeighbor, currentAlpha[i - width]);
        if (y + 1 < height) minNeighbor = Math.min(minNeighbor, currentAlpha[i + width]);

        nextAlpha[i] = minNeighbor;
      }
    }
    currentAlpha.set(nextAlpha);
  }

  for (let i = 0; i < totalPixels; i++) {
    output[i * 4 + 3] = currentAlpha[i];
  }
}

/**
 * Applies subtle box smoothing to edge alpha to soften transitions.
 */
export function smoothEdges(
  output: Uint8ClampedArray,
  width: number,
  height: number,
  radius: number
): void {
  if (radius <= 0 || width <= 2 || height <= 2) return;

  const totalPixels = width * height;
  const originalAlpha = new Uint8Array(totalPixels);
  for (let i = 0; i < totalPixels; i++) {
    originalAlpha[i] = output[i * 4 + 3];
  }

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const i = y * width + x;
      const current = originalAlpha[i];

      // Only smooth transition / edge pixels (skip interior fully opaque or fully transparent)
      if (current === 0 || current === 255) {
        let hasBoundary = false;
        if (x > 0 && originalAlpha[i - 1] !== current) hasBoundary = true;
        if (x + 1 < width && originalAlpha[i + 1] !== current) hasBoundary = true;
        if (y > 0 && originalAlpha[i - width] !== current) hasBoundary = true;
        if (y + 1 < height && originalAlpha[i + width] !== current) hasBoundary = true;
        if (!hasBoundary) continue;
      }

      let sum = 0;
      let count = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          sum += originalAlpha[(y + dy) * width + (x + dx)];
          count++;
        }
      }

      output[i * 4 + 3] = Math.round(sum / count);
    }
  }
}

/**
 * Removes small isolated opaque islands/speckles smaller than maxIslandSize pixels.
 */
export function removeSmallIslands(
  output: Uint8ClampedArray,
  width: number,
  height: number,
  maxIslandSize: number
): void {
  if (maxIslandSize <= 0 || width <= 0 || height <= 0) return;

  const totalPixels = width * height;
  const visited = new Uint8Array(totalPixels);
  const queue = new Int32Array(maxIslandSize + 2);
  const component = new Int32Array(maxIslandSize + 2);

  for (let i = 0; i < totalPixels; i++) {
    if (visited[i] === 1) continue;
    visited[i] = 1;

    // We only care about non-transparent clusters
    if (output[i * 4 + 3] === 0) continue;

    let head = 0;
    let tail = 0;
    let compCount = 0;

    queue[tail++] = i;
    component[compCount++] = i;

    let exceeded = false;

    while (head < tail) {
      const curr = queue[head++];
      const cx = curr % width;
      const cy = Math.floor(curr / width);

      // Check 4-way neighbors
      const neighbors = [
        cx > 0 ? curr - 1 : -1,
        cx + 1 < width ? curr + 1 : -1,
        cy > 0 ? curr - width : -1,
        cy + 1 < height ? curr + width : -1,
      ];

      for (const n of neighbors) {
        if (n >= 0 && visited[n] === 0 && output[n * 4 + 3] > 0) {
          visited[n] = 1;
          if (compCount < maxIslandSize) {
            component[compCount++] = n;
            queue[tail++] = n;
          } else {
            exceeded = true;
            break;
          }
        }
      }

      if (exceeded) break;
    }

    // If island is smaller than threshold, set all its pixels to transparent
    if (!exceeded && compCount <= maxIslandSize) {
      for (let c = 0; c < compCount; c++) {
        output[component[c] * 4 + 3] = 0;
      }
    }
  }
}
