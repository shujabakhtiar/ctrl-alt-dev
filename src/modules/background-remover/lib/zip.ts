import { zip, type AsyncZippable } from 'fflate';

export type ZipEntry = {
  filename: string;
  data: Uint8Array;
};

/**
 * Creates a zip archive blob containing the provided files using fflate.
 */
export function createZipBundle(files: ZipEntry[]): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const zipData: AsyncZippable = {};

    for (const file of files) {
      zipData[file.filename] = file.data;
    }

    zip(zipData, { level: 6 }, (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(new Blob([data], { type: 'application/zip' }));
    });
  });
}
