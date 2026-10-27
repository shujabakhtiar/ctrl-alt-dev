import { describe, it, expect } from 'vitest';
import { rgbToLab, labDeltaE, hexToRgb, rgbToHex } from '../lib/colour';
import { detectBackground } from '../lib/detectBackground';
import { calculateRampAlpha } from '../lib/alphaRamp';
import { decontaminateEdges } from '../lib/decontaminate';
import { removeBackground } from '../lib/pipeline';
import type { BackgroundRemoverOptions } from '../types';

describe('Colour & CIE Lab calculations', () => {
  it('converts pure white and pure black accurately to Lab', () => {
    const whiteLab = rgbToLab(255, 255, 255);
    expect(whiteLab.l).toBeCloseTo(100, 0);

    const blackLab = rgbToLab(0, 0, 0);
    expect(blackLab.l).toBeCloseTo(0, 0);
  });

  it('calculates Delta E perceptual distance correctly', () => {
    const white = rgbToLab(255, 255, 255);
    const nearWhite = rgbToLab(250, 250, 250);
    const red = rgbToLab(255, 0, 0);

    const dNear = labDeltaE(white, nearWhite);
    const dFar = labDeltaE(white, red);

    expect(dNear).toBeLessThan(5);
    expect(dFar).toBeGreaterThan(50);
  });

  it('converts hex to RGB and back', () => {
    expect(hexToRgb('#FF00AA')).toEqual({ r: 255, g: 0, b: 170, a: 255 });
    expect(rgbToHex(255, 0, 170)).toBe('#FF00AA');
  });
});

describe('Alpha ramp calculations', () => {
  it('assigns alpha 0 when distance <= tolerance', () => {
    const alpha = calculateRampAlpha(10, 255, 15, 10);
    expect(alpha).toBe(0);
  });

  it('assigns mid alpha linearly between tolerance and tolerance + softness', () => {
    // tolerance = 10, softness = 10 -> mid is 15 -> factor 0.5 -> 255 * 0.5 = ~128
    const alpha = calculateRampAlpha(15, 255, 10, 10);
    expect(alpha).toBe(128);
  });

  it('preserves existing transparency', () => {
    const alpha = calculateRampAlpha(20, 100, 10, 10);
    expect(alpha).toBe(100);
  });
});

describe('Edge Decontamination', () => {
  it('recovers subject colour from a 50% blend with white within +-1', () => {
    // Subject is pure blue (0, 0, 255)
    // Background is pure white (255, 255, 255)
    // 50% blend produces:
    // R: 0.5 * 0 + 0.5 * 255 = 127.5 -> 128
    // G: 0.5 * 0 + 0.5 * 255 = 127.5 -> 128
    // B: 0.5 * 255 + 0.5 * 255 = 255
    // Alpha: 128 (0.502 * 255)
    const buffer = new Uint8ClampedArray([128, 128, 255, 128]);
    decontaminateEdges(buffer, { r: 255, g: 255, b: 255, a: 255 });

    // After unmixing:
    // R should be near 0
    // G should be near 0
    // B should be 255
    expect(buffer[0]).toBeLessThanOrEqual(2);
    expect(buffer[1]).toBeLessThanOrEqual(2);
    expect(buffer[2]).toBe(255);
  });
});

describe('Background Detection', () => {
  it('identifies dominant border colour and high confidence on a flat border', () => {
    const width = 10;
    const height = 10;
    const data = new Uint8ClampedArray(width * height * 4);

    // Fill all with pure white
    for (let i = 0; i < data.length; i += 4) {
      data[i] = 255;
      data[i + 1] = 255;
      data[i + 2] = 255;
      data[i + 3] = 255;
    }

    const result = detectBackground(data, width, height);
    expect(result.hex).toBe('#FFFFFF');
    expect(result.confidence).toBe(1.0);
    expect(result.isSolid).toBe(true);
  });

  it('flags low confidence on noisy/gradient borders', () => {
    const width = 10;
    const height = 10;
    const data = new Uint8ClampedArray(width * height * 4);

    // Fill border with random distinct colours
    for (let i = 0; i < data.length; i += 4) {
      data[i] = (i * 17) % 256;
      data[i + 1] = (i * 37) % 256;
      data[i + 2] = (i * 53) % 256;
      data[i + 3] = 255;
    }

    const result = detectBackground(data, width, height);
    expect(result.confidence).toBeLessThan(0.6);
    expect(result.isSolid).toBe(false);
  });
});

describe('Full Pipeline on Synthetic Buffers', () => {
  const defaultOptions: BackgroundRemoverOptions = {
    mode: 'contiguous',
    tolerance: 15,
    softness: 5,
    cleanup: {
      decontaminate: true,
      shrink: 0,
      smooth: 0,
      removeIslands: false,
      islandSize: 0,
    },
  };

  it('removes flat white background while keeping black subject opaque', () => {
    const width = 6;
    const height = 6;
    const data = new Uint8ClampedArray(width * height * 4);

    // Initialize all to white background
    for (let i = 0; i < data.length; i += 4) {
      data[i] = 255;
      data[i + 1] = 255;
      data[i + 2] = 255;
      data[i + 3] = 255;
    }

    // Place a 2x2 black square in center (rows 2-3, cols 2-3)
    for (let y = 2; y <= 3; y++) {
      for (let x = 2; x <= 3; x++) {
        const idx = (y * width + x) * 4;
        data[idx] = 0;
        data[idx + 1] = 0;
        data[idx + 2] = 0;
        data[idx + 3] = 255;
      }
    }

    const originalDataCopy = new Uint8ClampedArray(data);
    const result = removeBackground(data, width, height, defaultOptions);

    // 1. Input buffer should not be mutated
    expect(data).toEqual(originalDataCopy);

    // 2. Output dimensions match
    expect(result.width).toBe(width);
    expect(result.height).toBe(height);

    // 3. Border pixel (0, 0) must be transparent
    expect(result.data[3]).toBe(0);

    // 4. Center black pixel (2, 2) must remain fully opaque black
    const centerIdx = (2 * width + 2) * 4;
    expect(result.data[centerIdx]).toBe(0);
    expect(result.data[centerIdx + 1]).toBe(0);
    expect(result.data[centerIdx + 2]).toBe(0);
    expect(result.data[centerIdx + 3]).toBe(255);
  });

  it('preserves an enclosed white pocket in contiguous mode, but removes it in global mode', () => {
    // 5x5 image:
    // Row 0: All white
    // Row 1: White, Black, Black, Black, White
    // Row 2: White, Black, White, Black, White  <- (2,2) is an enclosed white pocket!
    // Row 3: White, Black, Black, Black, White
    // Row 4: All white
    const width = 5;
    const height = 5;
    const data = new Uint8ClampedArray(width * height * 4);

    // Initialize all to white
    for (let i = 0; i < data.length; i += 4) {
      data[i] = 255;
      data[i + 1] = 255;
      data[i + 2] = 255;
      data[i + 3] = 255;
    }

    // Create black ring
    const ringCoords = [
      [1, 1], [2, 1], [3, 1],
      [1, 2],         [3, 2],
      [1, 3], [2, 3], [3, 3],
    ];
    for (const [x, y] of ringCoords) {
      const idx = (y * width + x) * 4;
      data[idx] = 0;
      data[idx + 1] = 0;
      data[idx + 2] = 0;
      data[idx + 3] = 255;
    }

    // 1. Contiguous Mode: Enclosed pocket at (2,2) MUST stay opaque
    const contiguousResult = removeBackground(data, width, height, {
      ...defaultOptions,
      mode: 'contiguous',
    });
    const pocketIdx = (2 * width + 2) * 4;
    expect(contiguousResult.data[pocketIdx + 3]).toBe(255);
    // Outer border (0,0) must be transparent
    expect(contiguousResult.data[3]).toBe(0);

    // 2. Global Mode: Enclosed pocket at (2,2) MUST become transparent
    const globalResult = removeBackground(data, width, height, {
      ...defaultOptions,
      mode: 'global',
    });
    expect(globalResult.data[pocketIdx + 3]).toBe(0);
  });

  it('flags isAllBackground when image contains no subject', () => {
    const width = 4;
    const height = 4;
    const data = new Uint8ClampedArray(width * height * 4);
    data.fill(255); // Entirely solid white

    const result = removeBackground(data, width, height, defaultOptions);
    expect(result.stats.isAllBackground).toBe(true);
    expect(result.stats.removedPixels).toBe(16);
  });

  it('preserves existing transparency', () => {
    const width = 2;
    const height = 2;
    const data = new Uint8ClampedArray([
      255, 255, 255, 255, // white
      0, 0, 0, 0,         // already transparent
      0, 0, 0, 255,       // black
      255, 255, 255, 255, // white
    ]);

    const result = removeBackground(data, width, height, defaultOptions);
    // Pixel (1, 0) was alpha 0, must still be alpha 0
    expect(result.data[1 * 4 + 3]).toBe(0);
    // Pixel (0, 1) was black, must remain alpha 255
    expect(result.data[2 * 4 + 3]).toBe(255);
  });
});
