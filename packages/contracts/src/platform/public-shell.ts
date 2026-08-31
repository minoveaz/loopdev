import { z } from 'zod';

// --- 1. Estados Estructurales del Shell Público ---
export const PublicShellStructuralStateSchema = z.enum([
  'ready',
  'loading',
  'error',
  'offline',
  'unauthenticated',
  'maintenance',
]);

export type PublicShellStructuralState = z.infer<typeof PublicShellStructuralStateSchema>;

// --- 2. Modos de Viewport / Breakpoint ---
export const PublicViewportModeSchema = z.enum(['mobile', 'tablet', 'desktop']);
export type PublicViewportMode = z.infer<typeof PublicViewportModeSchema>;

// --- 3. Recetas Canónicas de Composición Pública ---
export const PublicCompositionRecipeSchema = z.enum([
  'PublicContextualTriptych', // Estándar de 3 Bloques Contextuales con Altura Igualada (3-6-3 / Left Support | Work Area | Right Support)
  'PublicB2BLanding',         // LoopDev Web: Hero B2B (12) + Suites Showcase (6-6) + Pricing/Testimonials (4-4-4) + CTA (12)
  'PublicSocialFeed',         // CIMO App: 3-Col: Filtros (3) | Feed (6) | Inspector de Crew/Plan (3)
  'PublicDiscoverySplit',     // 2-Col Split: Listado/Cards (5) | Mapa / Calendario interactivo (7)
  'PublicDetailWorkspace',    // Hero (12) + Detalle/Itinerario (8) | Acción de Unión / Capitán (4)
  'PublicPortalOverview',     // VitaBlue: Hero (12) + Grid de Productos (4-4-4) + Asesor & FAQ (12)
  'PublicWorkflowCanvas',     // Stepper centrado (12, max-w-xl) para Auth / Onboarding / Feedback
]);

export type PublicCompositionRecipe = z.infer<typeof PublicCompositionRecipeSchema>;

// --- 4. Composición de Regiones y Grid de 12 Columnas ---
export const PublicCompositionPlacementSchema = z.enum([
  'flow',
  'fixed-bottom',
  'sticky-top',
  'floating',
]);

export type PublicCompositionPlacement = z.infer<typeof PublicCompositionPlacementSchema>;

export const PublicCompositionSizingSchema = z.enum(['content', 'fill', 'fixed']);
export type PublicCompositionSizing = z.infer<typeof PublicCompositionSizingSchema>;

export const PublicCompositionOverflowSchema = z.enum(['hidden', 'auto-y', 'auto-x', 'visible']);
export type PublicCompositionOverflow = z.infer<typeof PublicCompositionOverflowSchema>;

export const PublicResponsivePlacementSchema = z.object({
  tablet: z.enum(['preserve', 'stack', 'drawer', 'full']).default('preserve'),
  mobile: z.enum(['stack', 'sheet', 'modal', 'bottom-nav', 'hidden']).default('stack'),
});

export type PublicResponsivePlacement = z.infer<typeof PublicResponsivePlacementSchema>;

export const PublicCompositionSlotSchema = z.enum([
  'top-bar',
  'sidebar-filters',
  'main-feed',
  'context-inspector',
  'bottom-nav',
  'drawer',
  'floating-actions',
  'modal-overlay',
]);

export type PublicCompositionSlot = z.infer<typeof PublicCompositionSlotSchema>;

export const PublicCompositionRegionSchema = z.object({
  id: z.string().min(1),
  slot: PublicCompositionSlotSchema,
  component: z.string().min(1),
  colSpan: z.number().int().min(1).max(12),
  rowSpan: z.number().int().min(1).max(64).optional(),
  placement: PublicCompositionPlacementSchema.optional(),
  sizing: PublicCompositionSizingSchema.optional(),
  overflow: PublicCompositionOverflowSchema.optional(),
  order: z.number().int().min(0).optional(),
  responsive: PublicResponsivePlacementSchema.optional(),
});

export type PublicCompositionRegion = z.infer<typeof PublicCompositionRegionSchema>;

export const PublicGridSchema = z.object({
  columns: z.literal(12),
  gap: z.enum(['none', 'sm', 'md', 'lg']).default('md'),
  maxWidth: z.enum(['sm', 'md', 'lg', 'xl', '2xl', '7xl', 'full']).default('7xl'),
  alignment: z.enum(['start', 'stretch', 'center']).default('stretch'),
});

export type PublicGrid = z.infer<typeof PublicGridSchema>;

export const PublicViewCompositionSchema = z
  .object({
    recipe: PublicCompositionRecipeSchema,
    grid: PublicGridSchema,
    regions: z.array(PublicCompositionRegionSchema).min(1),
  })
  .superRefine((composition, context) => {
    const ids = composition.regions.map((region) => region.id);
    if (new Set(ids).size !== ids.length) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['regions'],
        message: 'Public composition region IDs must be unique',
      });
    }

    composition.regions.forEach((region, index) => {
      if (region.colSpan > composition.grid.columns) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['regions', index, 'colSpan'],
          message: `Region colSpan (${region.colSpan}) cannot exceed the ${composition.grid.columns}-column grid`,
        });
      }
    });
  });

export type PublicViewComposition = z.infer<typeof PublicViewCompositionSchema>;

// --- 5. Navegación Pública Tipada ---
export const PublicNavRouteSchema = z.object({
  id: z.string().min(1),
  path: z.string().min(1),
  label: z.string().min(1),
  icon: z.string().min(1),
  badgeCount: z.number().int().nonnegative().optional(),
  requiresAuth: z.boolean().default(false),
  visibility: z.array(PublicViewportModeSchema).default(['mobile', 'tablet', 'desktop']),
  presentation: z.enum(['tab', 'link', 'button', 'dropdown', 'action']).default('link'),
});

export type PublicNavRoute = z.infer<typeof PublicNavRouteSchema>;

export const PublicNavigationSchema = z.object({
  brandId: z.string().min(1),
  routes: z.array(PublicNavRouteSchema).min(1),
  defaultRouteId: z.string().min(1),
  mobilePrimaryRouteIds: z.array(z.string().min(1)).min(1).max(5), // Máximo 5 tabs para BottomNav
});

export type PublicNavigation = z.infer<typeof PublicNavigationSchema>;

// --- 6. Theming de Marca Multi-Tenant (White-Label) ---
export const PublicBrandThemeSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  colors: z.object({
    primary: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Must be a valid hex color'),
    primaryHover: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Must be a valid hex color'),
    secondary: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Must be a valid hex color'),
    accent: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Must be a valid hex color'),
    background: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Must be a valid hex color'),
    surface: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Must be a valid hex color'),
    textMain: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Must be a valid hex color'),
    textSecondary: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Must be a valid hex color'),
  }),
  logos: z.object({
    markSvg: z.string().min(1),
    fullSvg: z.string().min(1),
    favicon: z.string().optional(),
  }),
  typography: z.object({
    fontFamily: z.string().default('Inter, system-ui, sans-serif'),
  }),
});

export type PublicBrandTheme = z.infer<typeof PublicBrandThemeSchema>;

// --- 7. Especificación de Pantalla Pública (PublicPageSpec) ---
export const PublicPageSpecSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  composition: PublicViewCompositionSchema,
  navigation: PublicNavigationSchema,
  theme: PublicBrandThemeSchema,
  initialState: PublicShellStructuralStateSchema.default('ready'),
});

export type PublicPageSpec = z.infer<typeof PublicPageSpecSchema>;

/**
 * Generador Canónico de Composición de 3 Bloques Contextuales con Altura Igualada.
 * Utilizado para crear interfaces tipo Tríptico (Left Support | Primary Work Area | Right Support).
 */
export function createPublicContextualTriptychComposition(options?: {
  idPrefix?: string;
  leftColSpan?: number;
  mainColSpan?: number;
  rightColSpan?: number;
  gap?: 'none' | 'sm' | 'md' | 'lg';
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '7xl' | 'full';
  alignment?: 'start' | 'stretch' | 'center';
}): PublicViewComposition {
  const left = options?.leftColSpan ?? 3;
  const main = options?.mainColSpan ?? 6;
  const right = options?.rightColSpan ?? 3;
  const prefix = options?.idPrefix ?? 'triptych';

  return {
    recipe: 'PublicContextualTriptych',
    grid: {
      columns: 12,
      gap: options?.gap ?? 'md',
      maxWidth: options?.maxWidth ?? 'full',
      alignment: options?.alignment ?? 'stretch',
    },
    regions: [
      {
        id: `${prefix}-left-support`,
        slot: 'sidebar-filters',
        component: 'LeftSupportZone',
        colSpan: left,
        responsive: { tablet: 'drawer', mobile: 'sheet' },
      },
      {
        id: `${prefix}-primary-work-area`,
        slot: 'main-feed',
        component: 'PrimaryWorkArea',
        colSpan: main,
        responsive: { tablet: 'preserve', mobile: 'stack' },
      },
      {
        id: `${prefix}-right-support`,
        slot: 'context-inspector',
        component: 'RightSupportZone',
        colSpan: right,
        responsive: { tablet: 'drawer', mobile: 'hidden' },
      },
    ],
  };
}
