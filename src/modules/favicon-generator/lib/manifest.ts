import type { FaviconOptions } from '../types';

export interface ManifestIcon {
  src: string;
  sizes: string;
  type: string;
  purpose?: 'any' | 'maskable';
}

export interface WebManifest {
  name: string;
  short_name: string;
  start_url: string;
  display: 'standalone';
  background_color: string;
  theme_color: string;
  icons: ManifestIcon[];
}

/**
 * Normalizes a base path prefix to ensure correct path joining without double slashes.
 */
export function normalizeBasePath(basePath: string): string {
  if (!basePath || basePath.trim() === '') {
    return '/';
  }
  let path = basePath.trim();
  if (!path.startsWith('/')) {
    path = '/' + path;
  }
  if (!path.endsWith('/')) {
    path = path + '/';
  }
  return path;
}

/**
 * Builds the web manifest object and formatted JSON string.
 * Strictly adheres to PWA specs:
 * - "maskable" icon MUST be its own entry, NEVER combined with "any".
 * - "any" icons have purpose: "any".
 */
export function generateManifest(
  options: FaviconOptions,
  hasSvg: boolean = false
): { manifest: WebManifest; json: string } {
  const base = normalizeBasePath(options.basePath);

  const icons: ManifestIcon[] = [];

  // If SVG source, include icon.svg as first modern vector option
  if (hasSvg) {
    icons.push({
      src: `${base}icon.svg`,
      sizes: 'any',
      type: 'image/svg+xml',
      purpose: 'any',
    });
  }

  // Standard PWA icons (purpose: "any")
  icons.push(
    {
      src: `${base}icon-192.png`,
      sizes: '192x192',
      type: 'image/png',
      purpose: 'any',
    },
    {
      src: `${base}icon-512.png`,
      sizes: '512x512',
      type: 'image/png',
      purpose: 'any',
    }
  );

  // Dedicated Maskable icon (MUST be its own distinct entry with purpose: "maskable")
  icons.push({
    src: `${base}icon-512-maskable.png`,
    sizes: '512x512',
    type: 'image/png',
    purpose: 'maskable',
  });

  // Optional legacy sizes
  if (options.includeLegacy) {
    icons.push(
      {
        src: `${base}favicon-16x16.png`,
        sizes: '16x16',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: `${base}favicon-32x32.png`,
        sizes: '32x32',
        type: 'image/png',
        purpose: 'any',
      }
    );
  }

  const manifest: WebManifest = {
    name: options.appName.trim() || 'App',
    short_name: options.shortName.trim() || options.appName.trim() || 'App',
    start_url: base,
    display: 'standalone',
    background_color: options.backgroundColor,
    theme_color: options.themeColor,
    icons,
  };

  const json = JSON.stringify(manifest, null, 2);

  return {
    manifest,
    json,
  };
}
