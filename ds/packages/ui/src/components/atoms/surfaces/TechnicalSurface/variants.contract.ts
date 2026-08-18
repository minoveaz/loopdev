import type { SurfaceBorder, SurfaceDepth, SurfaceInteraction, SurfaceVariant } from './types';

export interface SurfaceVariantSemantics {
  usage: string;
  contexts: readonly string[];
  forbidden: readonly string[];
}

export const SURFACE_VARIANT_SEMANTICS: Record<SurfaceVariant, SurfaceVariantSemantics> = {
  surface: { usage: 'operational content boundary', contexts: ['data', 'forms', 'panels'], forbidden: ['page-background', 'marketing-hero'] },
  glass: { usage: 'translucent overlay boundary', contexts: ['dialog', 'popover', 'command-palette'], forbidden: ['data-table-root', 'nested-overlay'] },
  canvas: { usage: 'composition background boundary', contexts: ['workspace-root', 'shell-canvas'], forbidden: ['card-replacement', 'nested-canvas'] },
};

export const FORBIDDEN_SURFACE_COMBINATIONS = [
  { variant: 'canvas' as SurfaceVariant, depth: 'overlay' as SurfaceDepth },
  { border: 'none' as SurfaceBorder, interaction: 'interactive' as SurfaceInteraction },
] as const;