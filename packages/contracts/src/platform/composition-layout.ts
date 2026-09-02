import type { ViewComposition } from './composition';

export interface CompositionRegionLayout {
  id: string;
  order?: number;
  columnSpan: number;
  rowSpan: number;
  tabletClass: 'stack' | 'full' | 'preserve';
  mobileClass: 'stack' | 'full' | 'hidden';
}

export const resolveCompositionLayout = (composition: ViewComposition): CompositionRegionLayout[] =>
  composition.regions.map((region) => ({
    id: region.id,
    order: region.order,
    columnSpan: region.colSpan,
    rowSpan: region.rowSpan ?? 1,
    tabletClass: region.responsive?.tablet ?? 'preserve',
    mobileClass: region.responsive?.mobile ?? 'stack',
  }));
