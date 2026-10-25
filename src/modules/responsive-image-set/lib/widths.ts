export type WidthDeviceHint = {
  width: number;
  label: string;
  device: string;
  description: string;
};

export const COMMON_WIDTHS = [320, 640, 960, 1280, 1920] as const;
export const MOBILE_FIRST_WIDTHS = [480, 768, 1024, 1440] as const;

export const WIDTH_DEVICE_HINTS: Record<number, { device: string; description: string }> = {
  320: { device: 'Compact Mobile', description: 'iPhone SE, compact phones portrait' },
  480: { device: 'Mobile Landscape', description: 'Standard smartphones landscape & phablets' },
  640: { device: 'Mobile Retina (2x)', description: 'High-DPI smartphone displays & feed cards' },
  768: { device: 'iPad / Tablet', description: 'Standard iPad & tablet portrait screens' },
  800: { device: 'Tablet / Medium Viewport', description: 'Android tablets & medium split screens' },
  960: { device: 'Content Columns', description: 'Centered blog / layout columns & small laptops' },
  1024: { device: 'iPad Landscape / Laptop', description: 'iPad landscape, Chromebooks, compact laptops' },
  1280: { device: 'MacBook / Desktop', description: 'Standard 13"-15" laptops & desktop viewports' },
  1440: { device: 'Large Desktop', description: 'Widescreen monitors & 1440p displays' },
  1920: { device: 'Full HD / 1080p', description: 'Full-bleed desktop hero banners & 1080p screens' },
};

/**
 * Returns a human-friendly context string for any pixel width.
 */
export function getDeviceContextForWidth(width: number): { device: string; description: string } {
  if (WIDTH_DEVICE_HINTS[width]) {
    return WIDTH_DEVICE_HINTS[width];
  }

  if (width <= 420) {
    return { device: 'Mobile Portrait', description: `Compact phone screens (~${width}px)` };
  } else if (width <= 600) {
    return { device: 'Large Mobile', description: `Large phones & phablets (~${width}px)` };
  } else if (width <= 900) {
    return { device: 'iPad / Tablet', description: `Tablets & small screen viewports (~${width}px)` };
  } else if (width <= 1200) {
    return { device: 'Laptop / Small Desktop', description: `Laptops & desktop viewports (~${width}px)` };
  } else if (width <= 1600) {
    return { device: 'Standard Desktop', description: `Desktop monitors (~${width}px)` };
  } else {
    return { device: 'Ultra-wide / 4K Banner', description: `High-resolution desktop displays (~${width}px)` };
  }
}

/**
 * Calculates target height preserving aspect ratio, rounded to an integer.
 */
export function calculateTargetHeight(
  sourceWidth: number,
  sourceHeight: number,
  targetWidth: number
): number {
  if (sourceWidth <= 0) return targetWidth;
  const ratio = sourceHeight / sourceWidth;
  return Math.max(1, Math.round(targetWidth * ratio));
}

export type WidthResolutionOptions = {
  requestedWidths: number[];
  sourceWidth: number;
  sourceHeight: number;
  includeOriginal?: boolean;
  maxVariants?: number;
};

/**
 * Processes, dedupes, sorts, caps, and drops upscaled widths.
 * NEVER upscales past source width.
 */
export function resolveTargetWidths(options: WidthResolutionOptions): Array<{
  width: number;
  height: number;
  isOriginal: boolean;
}> {
  const {
    requestedWidths,
    sourceWidth,
    sourceHeight,
    includeOriginal = true,
    maxVariants = 8,
  } = options;

  if (sourceWidth <= 0 || sourceHeight <= 0) {
    return [];
  }

  // 1. Sanitize & positive integers only
  const validInts = requestedWidths
    .map((w) => Math.floor(Number(w)))
    .filter((w) => Number.isFinite(w) && w > 0);

  // 2. Drop widths larger than source (NEVER upscale)
  const nonUpscaled = validInts.filter((w) => w < sourceWidth);

  // 3. Add source width if requested or if all requested widths were >= source
  const candidateWidths = new Set<number>(nonUpscaled);
  if (includeOriginal || candidateWidths.size === 0) {
    candidateWidths.add(sourceWidth);
  }

  // 4. Sort ascending and dedupe
  const sorted = Array.from(candidateWidths).sort((a, b) => a - b);

  // 5. Cap at max variants (if more, keep smallest, largest, and evenly distributed)
  let capped = sorted;
  if (sorted.length > maxVariants) {
    const min = sorted[0];
    const max = sorted[sorted.length - 1];
    const middle = sorted.slice(1, -1);
    const step = middle.length / (maxVariants - 2);
    const sampledMiddle: number[] = [];
    for (let i = 0; i < maxVariants - 2; i++) {
      sampledMiddle.push(middle[Math.floor(i * step)]);
    }
    capped = Array.from(new Set([min, ...sampledMiddle, max])).sort((a, b) => a - b);
  }

  // 6. Map to dimensions
  return capped.map((width) => ({
    width,
    height: calculateTargetHeight(sourceWidth, sourceHeight, width),
    isOriginal: width === sourceWidth,
  }));
}
