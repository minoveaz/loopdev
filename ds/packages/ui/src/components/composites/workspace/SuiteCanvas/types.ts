import type { ReactNode } from 'react';
import type { ModuleContextPanelPresentation } from '../../shell/ModuleContextPanel';

export type SuiteCanvasMode = 'overview' | 'data' | 'workspace' | 'split' | 'board' | 'full-bleed';

export type SuiteCanvasGeometry = 'bounded' | 'split' | 'wide' | 'full-bleed';

export type SuiteCanvasGridColumns = 12 | 8 | 4;
export type SuiteCanvasPadding = 'none' | 'compact' | 'comfortable';
export type SuiteCanvasMaxWidth = 'bounded' | 'wide' | 'full';
export type SuiteCanvasOverflowX = 'hidden' | 'zone-only';

export interface SuiteCanvasGeometryPreset {
  mode: SuiteCanvasMode;
  geometry: SuiteCanvasGeometry;
  columns: SuiteCanvasGridColumns;
  mobileColumns: 4;
  maxWidth: SuiteCanvasMaxWidth;
  padding: SuiteCanvasPadding;
  gap: 'sm' | 'md' | 'lg';
  overflowX: SuiteCanvasOverflowX;
  overflowY: 'canvas';
}

export const SUITE_CANVAS_GEOMETRY: Record<SuiteCanvasMode, SuiteCanvasGeometry> = {
  overview: 'bounded',
  data: 'bounded',
  workspace: 'bounded',
  split: 'split',
  board: 'wide',
  'full-bleed': 'full-bleed',
};

export const SUITE_CANVAS_GEOMETRY_CLASSES: Record<SuiteCanvasGeometry, string> = {
  bounded: 'mx-auto w-full max-w-7xl px-4 py-4 sm:px-6',
  split: 'h-full min-h-0 w-full',
  wide: 'w-full px-4 py-4 sm:px-6',
  'full-bleed': 'h-full min-h-0 w-full',
};

export const SUITE_CANVAS_PADDING_CLASSES: Record<SuiteCanvasPadding, string> = {
  none: 'p-0',
  compact: 'p-2 sm:p-3',
  comfortable: 'p-4 sm:p-6',
};

export const SUITE_CANVAS_GAP_CLASSES: Record<SuiteCanvasGeometryPreset['gap'], string> = {
  sm: 'gap-2',
  md: 'gap-4',
  lg: 'gap-6',
};

export const SUITE_CANVAS_GRID_CLASSES: Record<SuiteCanvasGridColumns, string> = {
  12: 'grid-cols-12',
  8: 'grid-cols-8',
  4: 'grid-cols-4',
};

export const SUITE_CANVAS_MOBILE_GRID_CLASSES: Record<SuiteCanvasGridColumns, string> = {
  12: 'max-lg:grid-cols-4',
  8: 'max-lg:grid-cols-4',
  4: 'max-lg:grid-cols-4',
};

export const SUITE_CANVAS_MAX_WIDTH_CLASSES: Record<SuiteCanvasMaxWidth, string> = {
  bounded: 'max-w-7xl',
  wide: 'max-w-none',
  full: 'max-w-none',
};

export const SUITE_CANVAS_OVERFLOW_X_CLASSES: Record<SuiteCanvasOverflowX, string> = {
  hidden: 'overflow-x-hidden',
  'zone-only': 'overflow-x-auto',
};

export interface SuiteCanvasProps {
  mode?: SuiteCanvasMode;
  geometryPreset?: SuiteCanvasGeometryPreset;
  scrollResetKey?: string;
  header?: ReactNode;
  toolbar?: ReactNode;
  localNav?: ReactNode;
  tabs?: ReactNode;
  contextAside?: ReactNode;
  aside?: ReactNode;
  asidePresentation?: ModuleContextPanelPresentation;
  footer?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}
