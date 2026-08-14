import { z } from 'zod';

export const CompositionRecipeSchema = z.enum([
  'SuiteOverview',
  'DataWorkspace',
  'SplitWorkspace',
  'RecordWorkspace',
  'BoardWorkspace',
  'ImmersiveWorkflow',
  'CreativeEditor',
]);

export type CompositionRecipe = z.infer<typeof CompositionRecipeSchema>;

export const CompositionGridSchema = z.object({
  columns: z.union([z.literal(12), z.literal(8), z.literal(4)]),
  rows: z.number().int().min(1).max(64).optional(),
  gap: z.enum(['sm', 'md', 'lg']),
});

export const CompositionPlacementSchema = z.enum([
  'flow',
  'overlay-top',
  'overlay-bottom',
  'fixed-bottom',
]);

export const CompositionSizingSchema = z.enum(['content', 'fill', 'fixed']);

export const CompositionOverflowSchema = z.enum(['hidden', 'auto-x', 'auto-y', 'auto-both']);

export const ResponsivePlacementSchema = z.object({
  tablet: z.enum(['stack', 'full', 'preserve']).optional(),
  mobile: z.enum(['stack', 'full', 'hidden']).optional(),
});

export const CompositionRegionSchema = z.object({
  id: z.string().min(1),
  slot: z.string().min(1),
  component: z.string().min(1),
  colSpan: z.number().int().min(1).max(12),
  rowSpan: z.number().int().min(1).max(64).optional(),
  placement: CompositionPlacementSchema.optional(),
  sizing: CompositionSizingSchema.optional(),
  overflow: CompositionOverflowSchema.optional(),
  order: z.number().int().min(0).optional(),
  responsive: ResponsivePlacementSchema.optional(),
});

export const ViewCompositionSchema = z
  .object({
    recipe: CompositionRecipeSchema,
    grid: CompositionGridSchema,
    regions: z.array(CompositionRegionSchema).min(1),
  })
  .superRefine((composition, context) => {
    const ids = composition.regions.map((region) => region.id);
    if (new Set(ids).size !== ids.length) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['regions'],
        message: 'Composition region IDs must be unique',
      });
    }

    composition.regions.forEach((region, index) => {
      if (region.colSpan > composition.grid.columns) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['regions', index, 'colSpan'],
          message: `Region colSpan cannot exceed the ${composition.grid.columns}-column grid`,
        });
      }
    });
  });

export type ViewComposition = z.infer<typeof ViewCompositionSchema>;
