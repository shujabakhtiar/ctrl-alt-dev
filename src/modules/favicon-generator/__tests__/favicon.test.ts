import { describe, it, expect } from 'vitest';
import { createIco, parseIco } from '../lib/ico';
import { generateManifest, normalizeBasePath } from '../lib/manifest';
import { generateHeadTags, escapeHtml } from '../lib/headTags';
import { calculateSafeZone, isValidPadding } from '../lib/safeZone';
import { isValidHexColor, isShortNameLong, faviconOptionsSchema } from '../lib/validation';
import type { FaviconOptions } from '../types';

describe('ICO Encoder and Parser (ico.ts)', () => {
  it('encodes and parses back an ICO file containing 16, 32, and 48px images', () => {
    // Generate mock PNG byte sequences (with standard PNG header 89 50 4E 47 0D 0A 1A 0A)
    const makeMockPng = (size: number) => {
      const data = new Uint8Array(size);
      data.set([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a], 0);
      for (let i = 8; i < size; i++) {
        data[i] = (i * 7) % 256;
      }
      return data;
    };

    const img16 = { width: 16, height: 16, pngBuffer: makeMockPng(120) };
    const img32 = { width: 32, height: 32, pngBuffer: makeMockPng(350) };
    const img48 = { width: 48, height: 48, pngBuffer: makeMockPng(640) };

    const icoBytes = createIco([img16, img32, img48]);
    expect(icoBytes).toBeInstanceOf(Uint8Array);
    expect(icoBytes.byteLength).toBe(6 + 3 * 16 + 120 + 350 + 640);

    // Parse back
    const parsed = parseIco(icoBytes);
    expect(parsed.reserved).toBe(0);
    expect(parsed.type).toBe(1);
    expect(parsed.count).toBe(3);
    expect(parsed.entries).toHaveLength(3);

    // Verify Entry 1 (16px)
    expect(parsed.entries[0].width).toBe(16);
    expect(parsed.entries[0].height).toBe(16);
    expect(parsed.entries[0].planes).toBe(1);
    expect(parsed.entries[0].bitCount).toBe(32);
    expect(parsed.entries[0].bytesInRes).toBe(120);
    expect(parsed.entries[0].imageOffset).toBe(6 + 3 * 16); // 54
    expect(parsed.entries[0].isPng).toBe(true);

    // Verify Entry 2 (32px)
    expect(parsed.entries[1].width).toBe(32);
    expect(parsed.entries[1].height).toBe(32);
    expect(parsed.entries[1].bytesInRes).toBe(350);
    expect(parsed.entries[1].imageOffset).toBe(54 + 120);
    expect(parsed.entries[1].isPng).toBe(true);

    // Verify Entry 3 (48px)
    expect(parsed.entries[2].width).toBe(48);
    expect(parsed.entries[2].height).toBe(48);
    expect(parsed.entries[2].bytesInRes).toBe(640);
    expect(parsed.entries[2].imageOffset).toBe(54 + 120 + 350);
    expect(parsed.entries[2].isPng).toBe(true);

    // Verify sliced data exact match
    expect(parsed.entries[0].data).toEqual(img16.pngBuffer);
    expect(parsed.entries[1].data).toEqual(img32.pngBuffer);
    expect(parsed.entries[2].data).toEqual(img48.pngBuffer);
  });

  it('throws error when no images are provided to createIco', () => {
    expect(() => createIco([])).toThrow();
  });
});

describe('Web Manifest Generator (manifest.ts)', () => {
  const defaultOptions: FaviconOptions = {
    appName: 'Test Application',
    shortName: 'TestApp',
    themeColor: '#080A0F',
    backgroundColor: '#ffffff',
    maskablePadding: 20,
    basePath: '/',
    nonSquareStrategy: 'fit',
    optimizePng: true,
    includeLegacy: false,
  };

  it('generates valid JSON with correct properties and standalone display', () => {
    const { manifest, json } = generateManifest(defaultOptions, false);
    expect(typeof json).toBe('string');

    const parsed = JSON.parse(json);
    expect(parsed.name).toBe('Test Application');
    expect(parsed.short_name).toBe('TestApp');
    expect(parsed.display).toBe('standalone');
    expect(parsed.start_url).toBe('/');
    expect(parsed.theme_color).toBe('#080A0F');
    expect(parsed.background_color).toBe('#ffffff');
  });

  it('ensures maskable icon is its OWN entry and NEVER combined as "any maskable"', () => {
    const { manifest } = generateManifest(defaultOptions, false);
    const maskableIcons = manifest.icons.filter((icon) => icon.purpose === 'maskable');
    const combinedIcons = manifest.icons.filter((icon) =>
      icon.purpose && icon.purpose.includes('any') && icon.purpose.includes('maskable')
    );

    expect(maskableIcons).toHaveLength(1);
    expect(maskableIcons[0].src).toBe('/icon-512-maskable.png');
    expect(maskableIcons[0].sizes).toBe('512x512');
    expect(maskableIcons[0].purpose).toBe('maskable');
    expect(combinedIcons).toHaveLength(0);
  });

  it('handles custom base path prefixes cleanly without double slashes', () => {
    const optionsWithBasePath: FaviconOptions = {
      ...defaultOptions,
      basePath: '/sub-app',
    };
    const { manifest } = generateManifest(optionsWithBasePath, true);
    expect(manifest.start_url).toBe('/sub-app/');
    expect(manifest.icons.some((i) => i.src === '/sub-app/icon-192.png')).toBe(true);
    expect(manifest.icons.some((i) => i.src === '/sub-app/icon.svg')).toBe(true);
    expect(manifest.icons.some((i) => i.src === '/sub-app/icon-512-maskable.png')).toBe(true);
  });
});

describe('HTML Head Tags Generator (headTags.ts)', () => {
  const defaultOptions: FaviconOptions = {
    appName: 'Ship Fast <&>',
    shortName: 'ShipFast',
    themeColor: '#C8FF43',
    backgroundColor: '#080A0F',
    maskablePadding: 20,
    basePath: '/',
    nonSquareStrategy: 'fit',
    optimizePng: true,
    includeLegacy: false,
  };

  it('includes icon.svg tag ONLY when source is SVG', () => {
    const htmlWithSvg = generateHeadTags(defaultOptions, true);
    expect(htmlWithSvg).toContain('<link rel="icon" href="/icon.svg" type="image/svg+xml">');

    const htmlWithoutSvg = generateHeadTags(defaultOptions, false);
    expect(htmlWithoutSvg).not.toContain('<link rel="icon" href="/icon.svg" type="image/svg+xml">');
    expect(htmlWithoutSvg).toContain('<link rel="icon" href="/favicon.ico" sizes="32x32">');
    expect(htmlWithoutSvg).toContain('<link rel="apple-touch-icon" href="/apple-touch-icon.png">');
    expect(htmlWithoutSvg).toContain('<link rel="manifest" href="/manifest.webmanifest">');
  });

  it('handles base path correctly and escapes HTML hostile values', () => {
    const optionsWithBase: FaviconOptions = {
      ...defaultOptions,
      basePath: '/custom/path',
      themeColor: '#080A0F">alert(1)<"',
    };
    const html = generateHeadTags(optionsWithBase, false);
    expect(html).toContain('href="/custom/path/favicon.ico"');
    expect(html).toContain('href="/custom/path/apple-touch-icon.png"');
    expect(html).not.toContain('alert(1)<"');
    expect(html).toContain('&quot;&gt;alert(1)&lt;&quot;');
  });

  it('escapeHtml escapes all HTML entities properly', () => {
    expect(escapeHtml('<div id="a" key=\'b\'>&</div>')).toBe(
      '&lt;div id=&quot;a&quot; key=&#39;b&#39;&gt;&amp;&lt;/div&gt;'
    );
  });
});

describe('Safe Zone Dimensions Math (safeZone.ts)', () => {
  it('calculates exact dimensions for default 20% padding on 512px canvas', () => {
    const safe = calculateSafeZone(512, 20);
    expect(safe.canvasSize).toBe(512);
    // 80% logo size = 410px
    expect(safe.logoSize).toBe(Math.round(512 * 0.8)); // 410
    expect(safe.x).toBe(Math.round((512 - 410) / 2)); // 51
    expect(safe.y).toBe(Math.round((512 - 410) / 2)); // 51
    expect(safe.safeDiameter).toBe(Math.round(512 * 0.8)); // 410
    expect(safe.safeRadius).toBe(205);
  });

  it('calculates exact dimensions for various padding percentages', () => {
    const safe10 = calculateSafeZone(512, 10);
    expect(safe10.logoSize).toBe(Math.round(512 * 0.9)); // 461
    expect(safe10.x).toBe(Math.round((512 - 461) / 2)); // 26

    const safe0 = calculateSafeZone(512, 0);
    expect(safe0.logoSize).toBe(512);
    expect(safe0.x).toBe(0);

    const safe40 = calculateSafeZone(512, 40);
    expect(safe40.logoSize).toBe(Math.round(512 * 0.6)); // 307
    expect(safe40.x).toBe(Math.round((512 - 307) / 2)); // 103
  });

  it('validates padding correctly', () => {
    expect(isValidPadding(20)).toBe(true);
    expect(isValidPadding(0)).toBe(true);
    expect(isValidPadding(50)).toBe(true);
    expect(isValidPadding(-5)).toBe(false);
    expect(isValidPadding(55)).toBe(false);
  });
});

describe('Form Validation (validation.ts)', () => {
  it('validates valid hex color codes and rejects invalid ones', () => {
    expect(isValidHexColor('#fff')).toBe(true);
    expect(isValidHexColor('#FFFFFF')).toBe(true);
    expect(isValidHexColor('#080A0F')).toBe(true);
    expect(isValidHexColor('#c8ff43')).toBe(true);

    expect(isValidHexColor('red')).toBe(false);
    expect(isValidHexColor('#12345')).toBe(false);
    expect(isValidHexColor('#1234567')).toBe(false);
    expect(isValidHexColor('123456')).toBe(false);
  });

  it('identifies short names longer than 12 characters for warning', () => {
    expect(isShortNameLong('App')).toBe(false);
    expect(isShortNameLong('CtrlAltDev')).toBe(false);
    expect(isShortNameLong('123456789012')).toBe(false);
    expect(isShortNameLong('1234567890123')).toBe(true);
    expect(isShortNameLong('MySuperLongAppName')).toBe(true);
  });

  it('validates options object with Zod schema', () => {
    const valid = {
      appName: 'Awesome App',
      shortName: 'Awesome',
      themeColor: '#080A0F',
      backgroundColor: '#ffffff',
      maskablePadding: 20,
      basePath: '/',
      nonSquareStrategy: 'fit' as const,
      optimizePng: true,
      includeLegacy: false,
    };

    expect(() => faviconOptionsSchema.parse(valid)).not.toThrow();

    const invalid = {
      ...valid,
      themeColor: 'invalid-hex',
    };
    expect(() => faviconOptionsSchema.parse(invalid)).toThrow();
  });
});
