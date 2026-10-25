import { z } from 'zod';

export const HEX_COLOR_REGEX = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

export function isValidHexColor(hex: string): boolean {
  return HEX_COLOR_REGEX.test(hex.trim());
}

export function isShortNameLong(shortName: string): boolean {
  return shortName.trim().length > 12;
}

export const faviconOptionsSchema = z.object({
  appName: z
    .string()
    .min(1, 'App name is required')
    .max(100, 'App name must be 100 characters or fewer'),
  shortName: z
    .string()
    .min(1, 'Short name is required')
    .max(50, 'Short name must be 50 characters or fewer'),
  themeColor: z
    .string()
    .regex(HEX_COLOR_REGEX, 'Theme color must be a valid hex code (e.g. #080A0F or #000)'),
  backgroundColor: z
    .string()
    .regex(HEX_COLOR_REGEX, 'Background color must be a valid hex code (e.g. #FFFFFF or #FFF)'),
  maskablePadding: z
    .number()
    .min(0, 'Padding must be at least 0%')
    .max(50, 'Padding cannot exceed 50%'),
  basePath: z.string().default('/'),
  nonSquareStrategy: z.enum(['fit', 'crop']).default('fit'),
  optimizePng: z.boolean().default(true),
  includeLegacy: z.boolean().default(false),
});

export type FaviconOptionsSchemaType = z.infer<typeof faviconOptionsSchema>;
