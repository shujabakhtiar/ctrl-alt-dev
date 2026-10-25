import { zipSync } from 'fflate';
import type { GeneratedFile } from '../types';

/**
 * Creates a single flat ZIP package containing all generated favicon assets,
 * ready to be extracted directly into a project's `public/` directory.
 */
export async function createFaviconZip(files: GeneratedFile[]): Promise<Blob> {
  const zipEntries: Record<string, Uint8Array> = {};

  for (const file of files) {
    const arrayBuffer = await file.blob.arrayBuffer();
    zipEntries[file.name] = new Uint8Array(arrayBuffer);
  }

  const zipped = zipSync(zipEntries, { level: 6 });
  return new Blob([zipped.buffer as ArrayBuffer], { type: 'application/zip' });
}
