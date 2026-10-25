import { AppError } from '../errorHandler';

/**
 * Checks if a WebP buffer contains animation (VP8X chunk with animation bit set).
 */
export function isAnimatedWebP(buffer: ArrayBuffer): boolean {
  if (buffer.byteLength < 32) return false;
  const view = new DataView(buffer);
  // 'RIFF' = 0x52494646, 'WEBP' = 0x57454250
  if (view.getUint32(0, false) !== 0x52494646 || view.getUint32(8, false) !== 0x57454250) {
    return false;
  }
  // Check for 'VP8X' chunk (0x56503858)
  if (view.getUint32(12, false) === 0x56503858) {
    const flags = view.getUint8(20);
    // Bit 1 is animation flag (mask 0x02)
    return (flags & 0x02) !== 0;
  }
  return false;
}

/**
 * Checks if a buffer is a GIF file.
 */
export function isGif(buffer: ArrayBuffer): boolean {
  if (buffer.byteLength < 6) return false;
  const bytes = new Uint8Array(buffer, 0, 6);
  const header = String.fromCharCode(...bytes);
  return header === 'GIF87a' || header === 'GIF89a';
}

/**
 * Validates an input image file buffer before processing.
 * Throws user-safe AppError if animated or corrupt.
 */
export function validateImageFile(file: File, buffer: ArrayBuffer): {
  format: 'png' | 'jpeg' | 'webp' | 'avif';
} {
  if (file.type === 'image/gif' || file.name.toLowerCase().endsWith('.gif') || isGif(buffer)) {
    throw new AppError(
      'Animated GIFs are not supported. Please upload a static PNG, JPEG, or WebP image.',
      { code: 'ANIMATED_GIF_NOT_SUPPORTED' }
    );
  }

  if (isAnimatedWebP(buffer)) {
    throw new AppError(
      'Animated WebP images are not supported. Please provide a static WebP image.',
      { code: 'ANIMATED_WEBP_NOT_SUPPORTED' }
    );
  }

  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();

  if (type === 'image/png' || name.endsWith('.png')) {
    return { format: 'png' };
  }
  if (type === 'image/jpeg' || type === 'image/jpg' || name.endsWith('.jpg') || name.endsWith('.jpeg')) {
    return { format: 'jpeg' };
  }
  if (type === 'image/webp' || name.endsWith('.webp')) {
    return { format: 'webp' };
  }
  if (type === 'image/avif' || name.endsWith('.avif')) {
    return { format: 'avif' };
  }

  // Fallback check by magic numbers
  const view = new DataView(buffer);
  if (view.byteLength >= 8) {
    // PNG: 0x89504E47
    if (view.getUint32(0, false) === 0x89504e47) return { format: 'png' };
    // JPEG: 0xFFD8FF
    if (view.getUint16(0, false) === 0xffd8) return { format: 'jpeg' };
    // WebP: RIFF...WEBP
    if (view.getUint32(0, false) === 0x52494646 && view.getUint32(8, false) === 0x57454250) {
      return { format: 'webp' };
    }
  }

  throw new AppError(
    `Unsupported image format: "${file.name}". Please provide a PNG, JPEG, WebP, or AVIF image.`,
    { code: 'UNSUPPORTED_FORMAT' }
  );
}
