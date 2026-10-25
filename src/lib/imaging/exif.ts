/**
 * Parses the EXIF orientation tag from a JPEG ArrayBuffer.
 * Returns 1 (normal) if not found or not a JPEG.
 */
export function getExifOrientation(buffer: ArrayBuffer): number {
  const view = new DataView(buffer);
  if (view.byteLength < 4) return 1;

  // Check JPEG SOI marker (0xFFD8)
  if (view.getUint16(0, false) !== 0xffd8) {
    return 1;
  }

  let offset = 2;
  const length = view.byteLength;

  while (offset + 4 < length) {
    const marker = view.getUint16(offset, false);
    offset += 2;

    // Marker 0xFFE1 is APP1 (contains EXIF)
    if (marker === 0xffe1) {
      const app1Length = view.getUint16(offset, false);
      offset += 2;

      // Check 'Exif\0\0' (0x45786966 0x0000)
      if (
        offset + 6 <= length &&
        view.getUint32(offset, false) === 0x45786966 &&
        view.getUint16(offset + 4, false) === 0x0000
      ) {
        const tiffOffset = offset + 6;
        const littleEndian = view.getUint16(tiffOffset, false) === 0x4949; // 'II'

        // First IFD offset
        const firstIfdOffset = view.getUint32(tiffOffset + 4, littleEndian);
        let ifdStart = tiffOffset + firstIfdOffset;
        if (ifdStart + 2 > length) return 1;

        const entries = view.getUint16(ifdStart, littleEndian);
        ifdStart += 2;

        for (let i = 0; i < entries; i++) {
          const entryOffset = ifdStart + i * 12;
          if (entryOffset + 12 > length) break;
          const tag = view.getUint16(entryOffset, littleEndian);
          if (tag === 0x0112) {
            // Orientation tag
            return view.getUint16(entryOffset + 8, littleEndian);
          }
        }
      }
      offset += app1Length - 2;
    } else if ((marker & 0xff00) !== 0xff00 || marker === 0xffda || marker === 0xffd9) {
      // SOS (Start of Scan) or EOI
      break;
    } else {
      // Skip variable length marker
      if (offset + 2 > length) break;
      const markerLength = view.getUint16(offset, false);
      offset += markerLength;
    }
  }

  return 1;
}

/**
 * Applies EXIF orientation to an ImageData object, rotating and flipping pixels as needed.
 */
export function applyExifOrientation(
  imageData: ImageData,
  orientation: number
): ImageData {
  if (orientation <= 1 || orientation > 8) {
    return imageData;
  }

  const { width, height, data } = imageData;
  const is90Degree = orientation >= 5 && orientation <= 8;
  const newWidth = is90Degree ? height : width;
  const newHeight = is90Degree ? width : height;
  const newBytes = new Uint8ClampedArray(newWidth * newHeight * 4);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const srcIdx = (y * width + x) * 4;
      let dstX = x;
      let dstY = y;

      switch (orientation) {
        case 2: // Horizontal flip
          dstX = width - 1 - x;
          dstY = y;
          break;
        case 3: // 180 rotation
          dstX = width - 1 - x;
          dstY = height - 1 - y;
          break;
        case 4: // Vertical flip
          dstX = x;
          dstY = height - 1 - y;
          break;
        case 5: // Transpose (flip horizontal & rotate 270)
          dstX = y;
          dstY = x;
          break;
        case 6: // 90 CW
          dstX = height - 1 - y;
          dstY = x;
          break;
        case 7: // Transverse (flip horizontal & rotate 90)
          dstX = height - 1 - y;
          dstY = width - 1 - x;
          break;
        case 8: // 270 CW (90 CCW)
          dstX = y;
          dstY = width - 1 - x;
          break;
      }

      const dstIdx = (dstY * newWidth + dstX) * 4;
      newBytes[dstIdx] = data[srcIdx];
      newBytes[dstIdx + 1] = data[srcIdx + 1];
      newBytes[dstIdx + 2] = data[srcIdx + 2];
      newBytes[dstIdx + 3] = data[srcIdx + 3];
    }
  }

  return {
    data: newBytes,
    width: newWidth,
    height: newHeight,
    colorSpace: imageData.colorSpace || 'srgb',
  } as ImageData;
}
