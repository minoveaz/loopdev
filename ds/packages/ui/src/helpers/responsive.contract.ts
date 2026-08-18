import type { BreakpointKey } from '@loopdev/tokens';

export interface ResponsiveTransformContract {
  component: string;
  breakpoint: BreakpointKey;
  transformation: string;
  forbidden: readonly string[];
}

export const PLATFORM_RESPONSIVE_CONTRACTS = [
  { component: 'PlatformHeader', breakpoint: 'lg', transformation: 'desktop header to mobile navigation', forbidden: ['custom-header-height'] },
  { component: 'SuiteSidebar', breakpoint: 'lg', transformation: 'expanded rail to drawer', forbidden: ['custom-collapse-logic'] },
  { component: 'ModuleContextPanel', breakpoint: 'lg', transformation: 'inline panel to full-canvas drawer', forbidden: ['page-level-modal'] },
  { component: 'ResponsiveTable', breakpoint: 'lg', transformation: 'semantic table to identity-first mobile rows', forbidden: ['unbounded-horizontal-scroll'] },
  { component: 'ModuleToolbar', breakpoint: 'lg', transformation: 'single row to wrapped controls', forbidden: ['overlap-slots'] },
] as const satisfies readonly ResponsiveTransformContract[];

export const FORBIDDEN_PAGE_RESPONSIVE_CLASSES = [
  'max-lg:h-screen',
  'max-lg:fixed',
  'max-lg:z-50',
  'max-lg:overflow-hidden',
] as const;