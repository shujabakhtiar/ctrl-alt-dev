import { decode as decodePng, encode as encodePng } from '@jsquash/png';
import { decode as decodeJpeg, encode as encodeJpeg } from '@jsquash/jpeg';
import { decode as decodeWebp, encode as encodeWebp } from '@jsquash/webp';
import { decode as decodeAvif, encode as encodeAvif } from '@jsquash/avif';
import resize from '@jsquash/resize';
import { getExifOrientation, applyExifOrientation } from '../../../lib/imaging/exif';
import type { OutputImageFormat } from '../types';

export type EncodeOptions = {
  quality: number;
  lossless?: boolean;
  speed?: number; // AVIF speed / effort
};

/**
 * Decodes an image ArrayBuffer into an ImageData object, applying EXIF orientation for JPEGs.
 */
export async function decodeImage(
  buffer: ArrayBuffer,
  format: 'png' | 'jpeg' | 'webp' | 'avif'
): Promise<ImageData> {
  let imageData: ImageData;

  switch (format) {
    case 'png':
      imageData = await decodePng(buffer);
      break;
    case 'jpeg': {
      imageData = await decodeJpeg(buffer);
      const orientation = getExifOrientation(buffer);
      if (orientation > 1) {
        imageData = applyExifOrientation(imageData, orientation);
      }
      break;
    }
    case 'webp':
      imageData = await decodeWebp(buffer);
      break;
    case 'avif': {
      const decoded = await decodeAvif(buffer);
      if (!decoded) throw new Error('Failed to decode AVIF image');
      imageData = decoded;
      break;
    }
    default:
      throw new Error(`Unsupported decoder format: ${format}`);
  }

  return imageData;
}

/**
 * Resizes an ImageData object to target dimensions using Lanczos3 with premultiplied alpha.
 */
export async function resizeImageData(
  imageData: ImageData,
  targetWidth: number,
  targetHeight: number
): Promise<ImageData> {
  // If target width and height match exactly, return copy or original
  if (imageData.width === targetWidth && imageData.height === targetHeight) {
    return imageData;
  }

  const resized = await resize(imageData, {
    width: targetWidth,
    height: targetHeight,
    method: 'lanczos3',
    premultiply: true,
    linearRGB: true,
  });

  return resized;
}

/**
 * Encodes an ImageData object into the target format ArrayBuffer.
 */
export async function encodeImageData(
  imageData: ImageData,
  format: OutputImageFormat,
  options: EncodeOptions
): Promise<ArrayBuffer> {
  switch (format) {
    case 'webp':
      return await encodeWebp(imageData, {
        quality: options.quality,
        lossless: options.lossless ? 1 : 0,
        method: 4,
      });

    case 'avif':
      return await encodeAvif(imageData, {
        quality: options.quality,
        speed: options.speed ?? 6,
      });

    case 'jpeg':
      return await encodeJpeg(imageData, {
        quality: options.quality,
      });

    case 'png':
      return await encodePng(imageData);

    default:
      throw new Error(`Unsupported encoder format: ${format}`);
  }
}

/**
 * Verifies that the encoded output buffer decodes back with exact expected dimensions.
 */
export async function verifyOutput(
  buffer: ArrayBuffer,
  format: OutputImageFormat,
  expectedWidth: number,
  expectedHeight: number
): Promise<{ valid: boolean; actualWidth: number; actualHeight: number }> {
  let decoded: ImageData;
  switch (format) {
    case 'webp':
      decoded = await decodeWebp(buffer);
      break;
    case 'avif': {
      const result = await decodeAvif(buffer);
      if (!result) throw new Error('Verification failed: could not decode AVIF output');
      decoded = result;
      break;
    }
    case 'jpeg':
      decoded = await decodeJpeg(buffer);
      break;
    case 'png':
      decoded = await decodePng(buffer);
      break;
    default:
      throw new Error(`Cannot verify format: ${format}`);
  }

  const valid = decoded.width === expectedWidth && decoded.height === expectedHeight;
  return {
    valid,
    actualWidth: decoded.width,
    actualHeight: decoded.height,
  };
}
