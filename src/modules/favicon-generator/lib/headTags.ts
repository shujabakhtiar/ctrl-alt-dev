import type { FaviconOptions } from '../types';
import { normalizeBasePath } from './manifest';

/**
 * Escapes characters for safe inclusion in HTML attributes.
 */
export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * Generates the clean modern <head> HTML snippet.
 * Only includes icon.svg tag if source image was SVG.
 */
export function generateHeadTags(options: FaviconOptions, hasSvg: boolean = false): string {
  const base = normalizeBasePath(options.basePath);
  const themeColor = escapeHtml(options.themeColor.trim() || '#080A0F');

  const lines: string[] = [
    `<link rel="icon" href="${base}favicon.ico" sizes="32x32">`,
  ];

  if (hasSvg) {
    lines.push(`<link rel="icon" href="${base}icon.svg" type="image/svg+xml">`);
  }

  lines.push(`<link rel="apple-touch-icon" href="${base}apple-touch-icon.png">`);
  lines.push(`<link rel="manifest" href="${base}manifest.webmanifest">`);
  lines.push(`<meta name="theme-color" content="${themeColor}">`);

  if (options.includeLegacy) {
    lines.push(`<!-- Optional Legacy Fallbacks -->`);
    lines.push(`<link rel="icon" type="image/png" sizes="16x16" href="${base}favicon-16x16.png">`);
    lines.push(`<link rel="icon" type="image/png" sizes="32x32" href="${base}favicon-32x32.png">`);
  }

  return lines.join('\n');
}
