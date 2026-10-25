export interface IcoImageInput {
  width: number;
  height: number;
  pngBuffer: Uint8Array;
}

export interface ParsedIcoEntry {
  width: number;
  height: number;
  colorCount: number;
  reserved: number;
  planes: number;
  bitCount: number;
  bytesInRes: number;
  imageOffset: number;
  data: Uint8Array;
  isPng: boolean;
}

export interface ParsedIco {
  reserved: number;
  type: number;
  count: number;
  entries: ParsedIcoEntry[];
}

const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];

/**
 * Creates an ICO file containing PNG-encoded images.
 * Pure function with zero external dependencies.
 */
export function createIco(images: IcoImageInput[]): Uint8Array {
  if (!images || images.length === 0) {
    throw new Error('At least one image is required to create an ICO file');
  }

  const count = images.length;
  const headerSize = 6;
  const dirEntrySize = 16;
  const dirSize = headerSize + count * dirEntrySize;

  // Calculate total file size
  let totalDataSize = 0;
  for (const img of images) {
    totalDataSize += img.pngBuffer.byteLength;
  }

  const totalFileSize = dirSize + totalDataSize;
  const buffer = new Uint8Array(totalFileSize);
  const view = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength);

  // 1. Write ICONDIR header (6 bytes)
  view.setUint16(0, 0, true); // Reserved (must be 0)
  view.setUint16(2, 1, true); // Type (1 for ICO)
  view.setUint16(4, count, true); // Number of images

  // 2. Write ICONDIRENTRY array (16 bytes each) & image data
  let currentOffset = dirSize;

  for (let i = 0; i < count; i++) {
    const img = images[i];
    const entryOffset = headerSize + i * dirEntrySize;

    // Width & Height (0 represents 256px according to ICO spec)
    const w = img.width >= 256 ? 0 : img.width;
    const h = img.height >= 256 ? 0 : img.height;

    buffer[entryOffset + 0] = w; // bWidth
    buffer[entryOffset + 1] = h; // bHeight
    buffer[entryOffset + 2] = 0; // bColorCount (0 for >=256 colors/PNG)
    buffer[entryOffset + 3] = 0; // bReserved (must be 0)
    view.setUint16(entryOffset + 4, 1, true); // wPlanes (1)
    view.setUint16(entryOffset + 6, 32, true); // wBitCount (32 for RGBA)
    view.setUint32(entryOffset + 8, img.pngBuffer.byteLength, true); // dwBytesInRes
    view.setUint32(entryOffset + 12, currentOffset, true); // dwImageOffset

    // Copy PNG data to designated offset
    buffer.set(img.pngBuffer, currentOffset);
    currentOffset += img.pngBuffer.byteLength;
  }

  return buffer;
}

/**
 * Parses an ICO file back into its header, directory entries, and image byte arrays.
 * Used for verifying ICO integrity and unit testing.
 */
export function parseIco(buffer: Uint8Array): ParsedIco {
  if (buffer.byteLength < 6) {
    throw new Error('Invalid ICO buffer: too short to contain header');
  }

  const view = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength);

  const reserved = view.getUint16(0, true);
  const type = view.getUint16(2, true);
  const count = view.getUint16(4, true);

  if (reserved !== 0) {
    throw new Error(`Invalid ICO: reserved field is ${reserved}, expected 0`);
  }
  if (type !== 1) {
    throw new Error(`Invalid ICO: resource type is ${type}, expected 1`);
  }

  const headerSize = 6;
  const dirEntrySize = 16;
  const minRequiredSize = headerSize + count * dirEntrySize;

  if (buffer.byteLength < minRequiredSize) {
    throw new Error(`Invalid ICO: buffer length is ${buffer.byteLength}, expected at least ${minRequiredSize}`);
  }

  const entries: ParsedIcoEntry[] = [];

  for (let i = 0; i < count; i++) {
    const entryOffset = headerSize + i * dirEntrySize;

    const rawWidth = buffer[entryOffset + 0];
    const rawHeight = buffer[entryOffset + 1];
    const colorCount = buffer[entryOffset + 2];
    const entryReserved = buffer[entryOffset + 3];
    const planes = view.getUint16(entryOffset + 4, true);
    const bitCount = view.getUint16(entryOffset + 6, true);
    const bytesInRes = view.getUint32(entryOffset + 8, true);
    const imageOffset = view.getUint32(entryOffset + 12, true);

    const width = rawWidth === 0 ? 256 : rawWidth;
    const height = rawHeight === 0 ? 256 : rawHeight;

    if (imageOffset + bytesInRes > buffer.byteLength) {
      throw new Error(
        `Invalid ICO: entry ${i} offset ${imageOffset} + length ${bytesInRes} exceeds file size ${buffer.byteLength}`
      );
    }

    const data = buffer.slice(imageOffset, imageOffset + bytesInRes);

    // Check PNG signature
    let isPng = false;
    if (data.byteLength >= 8) {
      isPng = PNG_SIGNATURE.every((b, idx) => data[idx] === b);
    }

    entries.push({
      width,
      height,
      colorCount,
      reserved: entryReserved,
      planes,
      bitCount,
      bytesInRes,
      imageOffset,
      data,
      isPng,
    });
  }

  return {
    reserved,
    type,
    count,
    entries,
  };
}
