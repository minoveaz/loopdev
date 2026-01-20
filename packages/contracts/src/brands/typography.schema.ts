import { z } from 'zod';

// --- ATOMS ---

export const FontSourceSchema = z.enum(['google', 'system', 'custom', 'adobe']);
export type FontSource = z.infer<typeof FontSourceSchema>;

export const FontTypeSchema = z.enum(['sans', 'serif', 'mono', 'display', 'handwriting']);
export type FontType = z.infer<typeof FontTypeSchema>;

export const FontVariantSchema = z.object({
  weight: z.number().min(100).max(900), // e.g. 400, 700
  style: z.enum(['normal', 'italic']).default('normal'),
  usage: z.string().optional() // e.g. "Body text only", "Headings"
});
export type FontVariant = z.infer<typeof FontVariantSchema>;

// --- COMPOSITES ---

export const FontDefinitionSchema = z.object({
  family: z.string().min(1),
  type: FontTypeSchema,
  source: FontSourceSchema,
  sourceUrl: z.string().url().optional(), // CSS import URL or file path
  license: z.string().optional(), // e.g., "OFL", "Proprietary"
  variants: z.array(FontVariantSchema).default([]),
  fallbacks: z.array(z.string()).default(['sans-serif']),
  // Metadata for AI/UI
  description: z.string().optional(),
});
export type FontDefinition = z.infer<typeof FontDefinitionSchema>;

// --- SYSTEM ROOT ---

export const TypographySystemSchema = z.object({
  primary: FontDefinitionSchema,
  secondary: FontDefinitionSchema.optional(), // Mono/Secondary is optional
  
  // Hierarchy & Scale Settings
  baseSize: z.number().min(12).default(16), // Accessibility floor (px)
  scaleRatio: z.number().min(1.0).max(2.0).default(1.25), // e.g., Major Third (1.25)
  lineHeightBase: z.number().min(1.0).max(2.5).default(1.5),
  
  // Flags
  aiOptimized: z.boolean().default(true) // Whether AI can adjust specs for readability
});

export type TypographySystem = z.infer<typeof TypographySystemSchema>;
