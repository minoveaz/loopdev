import { z } from 'zod';

// --- ATOMS ---

export const LogoFormatSchema = z.enum(['svg', 'png', 'jpg', 'webp']);
export type LogoFormat = z.infer<typeof LogoFormatSchema>;

export const LogoVariantTypeSchema = z.enum(['full', 'isotype', 'logotype']);
export type LogoVariantType = z.infer<typeof LogoVariantTypeSchema>;

export const LogoContextSchema = z.enum(['primary', 'dark', 'light', 'monochrome']);
export type LogoContext = z.infer<typeof LogoContextSchema>;

// --- ASSET DEFINITION ---

export const LogoAssetSchema = z.object({
  id: z.string().uuid().optional(), // For future referencing
  url: z.string().url().optional(), // Public URL from Storage
  rawSvg: z.string().optional(), // Inline SVG code for immediate rendering
  format: LogoFormatSchema.default('svg'),
  width: z.number().optional(),
  height: z.number().optional(),
  alt: z.string().optional(), // A11y requirement
});
export type LogoAsset = z.infer<typeof LogoAssetSchema>;

// --- SYSTEM COMPOSITES ---

export const LogoLockupSchema = z.object({
  horizontal: LogoAssetSchema.optional(),
  vertical: LogoAssetSchema.optional(),
  isotype: LogoAssetSchema, // The core symbol is mandatory
});
export type LogoLockup = z.infer<typeof LogoLockupSchema>;

export const LogoSpecsSchema = z.object({
  aspectRatio: z.string().default('Variable'), // e.g. "1:1"
  gridType: z.string().default('Pixel Perfect'), // e.g. "8px Grid"
  strokeWeight: z.string().optional(),
  clearSpace: z.string().default('1x Height'), // e.g. "50%"
  minSize: z.number().default(16), // in px
});
export type LogoSpecs = z.infer<typeof LogoSpecsSchema>;

// --- ROOT SCHEMA ---

export const LogoSystemSchema = z.object({
  // The main full-color version
  primary: LogoLockupSchema,
  
  // Contextual variants
  monochrome: z.object({
    positive: LogoLockupSchema.optional(), // Dark on Light
    negative: LogoLockupSchema.optional()  // Light on Dark
  }).optional(),

  // Technical specifications
  specs: LogoSpecsSchema.default({}),
});

export type LogoSystem = z.infer<typeof LogoSystemSchema>;
