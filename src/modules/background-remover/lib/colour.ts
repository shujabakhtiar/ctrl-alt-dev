import type { RgbaColor, LabColor } from '../types';

/**
 * Converts sRGB channel (0-255) to linear sRGB (0-1).
 */
function srgbToLinear(c: number): number {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

/**
 * CIE XYZ transfer function.
 */
function fXyz(t: number): number {
  const delta = 6 / 29;
  return t > Math.pow(delta, 3) ? Math.cbrt(t) : t / (3 * Math.pow(delta, 2)) + 4 / 29;
}

/**
 * Converts sRGB (0-255) to CIE L*a*b* using standard D65 illuminant reference white.
 * Ref: https://en.wikipedia.org/wiki/CIELAB_color_space
 */
export function rgbToLab(r: number, g: number, b: number): LabColor {
  const lr = srgbToLinear(r);
  const lg = srgbToLinear(g);
  const lb = srgbToLinear(b);

  // D65 reference white XYZ matrix for sRGB
  const x = lr * 0.4124564 + lg * 0.3575761 + lb * 0.1804375;
  const y = lr * 0.2126729 + lg * 0.7151522 + lb * 0.072175;
  const z = lr * 0.0193339 + lg * 0.119192 + lb * 0.9503041;

  // D65 standard illuminant white point normalization
  const xn = 0.95047;
  const yn = 1.0;
  const zn = 1.08883;

  const fx = fXyz(x / xn);
  const fy = fXyz(y / yn);
  const fz = fXyz(z / zn);

  const l = Math.max(0, 116 * fy - 16);
  const a = 500 * (fx - fy);
  const bVal = 200 * (fy - fz);

  return { l, a, b: bVal };
}

/**
 * Computes the Euclidean CIE Delta E (CIE76) between two Lab colors.
 * This provides perceptual uniformity far superior to raw RGB distance.
 */
export function labDeltaE(c1: LabColor, c2: LabColor): number {
  const dl = c1.l - c2.l;
  const da = c1.a - c2.a;
  const db = c1.b - c2.b;
  return Math.sqrt(dl * dl + da * da + db * db);
}

/**
 * Parses a hex string (#RGB, #RRGGBB, #RRGGBBAA) to RgbaColor.
 */
export function hexToRgb(hex: string): RgbaColor {
  const clean = hex.replace(/^#/, '').trim();
  if (clean.length === 3) {
    const r = parseInt(clean[0] + clean[0], 16);
    const g = parseInt(clean[1] + clean[1], 16);
    const b = parseInt(clean[2] + clean[2], 16);
    return { r, g, b, a: 255 };
  }
  if (clean.length === 6 || clean.length === 8) {
    const r = parseInt(clean.slice(0, 2), 16);
    const g = parseInt(clean.slice(2, 4), 16);
    const b = parseInt(clean.slice(4, 6), 16);
    const a = clean.length === 8 ? parseInt(clean.slice(6, 8), 16) : 255;
    return { r, g, b, a };
  }
  return { r: 255, g: 255, b: 255, a: 255 };
}

/**
 * Formats RGB to hex uppercase string (#RRGGBB).
 */
export function rgbToHex(r: number, g: number, b: number): string {
  const clampR = Math.max(0, Math.min(255, Math.round(r)));
  const clampG = Math.max(0, Math.min(255, Math.round(g)));
  const clampB = Math.max(0, Math.min(255, Math.round(b)));
  return `#${clampR.toString(16).padStart(2, '0')}${clampG.toString(16).padStart(2, '0')}${clampB.toString(16).padStart(2, '0')}`.toUpperCase();
}
