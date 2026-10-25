export const DEVICE_SLUGS: Record<number, string> = {
  320: 'compact-mobile',
  480: 'mobile-landscape',
  640: 'mobile-retina',
  768: 'ipad-tablet',
  800: 'tablet-medium',
  960: 'content-columns',
  1024: 'ipad-landscape-laptop',
  1280: 'macbook-desktop',
  1440: 'large-desktop',
  1920: 'full-hd',
};

/**
 * Returns a URL-friendly, lowercase device slug for a given pixel width.
 */
export function getDeviceSlug(width: number): string {
  if (DEVICE_SLUGS[width]) {
    return DEVICE_SLUGS[width];
  }

  if (width <= 420) return 'compact-mobile';
  if (width <= 600) return 'large-mobile';
  if (width <= 900) return 'ipad-tablet';
  if (width <= 1200) return 'compact-laptop';
  if (width <= 1600) return 'standard-desktop';
  return 'ultrawide-desktop';
}

/**
 * Sanitizes a base filename: removes illegal filesystem chars, path traversals,
 * and normalizes spaces/special chars to clean hyphens.
 */
export function sanitizeFilename(name: string): string {
  if (!name) return 'image';

  return name
    .trim()
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, '') // Remove invalid chars
    .replace(/\.\.+/g, '') // Prevent directory traversal
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Dedupe consecutive hyphens
    .replace(/^-|-$/g, '') // Trim leading/trailing hyphens
    .toLowerCase() || 'image';
}

export type FilenameTemplateParams = {
  name: string;
  width: number;
  height?: number;
  ext: string; // 'webp' | 'avif' | 'jpg' | 'png'
  density?: number; // 1, 2, 3
  device?: string; // e.g. 'compact-mobile'
};

/**
 * Pattern presets available in UI.
 */
export const FILENAME_PATTERN_PRESETS = [
  {
    id: 'device-slug',
    label: 'Meaningful Device Name',
    pattern: '{name}-{device}.{ext}',
    example: 'hero-compact-mobile.webp',
  },
  {
    id: 'device-and-width',
    label: 'Device + Width',
    pattern: '{name}-{device}-{width}.{ext}',
    example: 'hero-ipad-tablet-768.webp',
  },
  {
    id: 'width-descriptor',
    label: 'Width Descriptors',
    pattern: '{name}-{width}w.{ext}',
    example: 'hero-768w.webp',
  },
  {
    id: 'plain-width',
    label: 'Numeric Width',
    pattern: '{name}-{width}.{ext}',
    example: 'hero-768.webp',
  },
] as const;

/**
 * Generates an output filename by replacing placeholders in a template pattern.
 * Supported tokens: {name}, {device}, {width}, {height}, {ext}, {density}
 */
export function formatVariantFilename(
  pattern: string,
  params: FilenameTemplateParams
): string {
  const cleanName = sanitizeFilename(params.name);
  const cleanExt = params.ext.replace(/^\./, '').toLowerCase();
  const deviceSlug = params.device || getDeviceSlug(params.width);
  const densitySlug = params.density ? `${params.density}x` : '';

  let result = pattern || '{name}-{device}.{ext}';

  result = result.replace(/\{name\}/g, cleanName);
  result = result.replace(/\{device\}/g, deviceSlug);
  result = result.replace(/\{width\}/g, String(params.width));
  result = result.replace(/\{height\}/g, String(params.height ?? ''));
  result = result.replace(/\{density\}/g, densitySlug);
  result = result.replace(/\{ext\}/g, cleanExt);

  // Clean any empty trailing hyphens caused by empty tokens
  result = result.replace(/--+/g, '-').replace(/-+\./g, '.');

  return result;
}
