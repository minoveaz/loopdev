export type StateSize = 'sm' | 'md' | 'lg';

export interface StateGeometryContract {
  iconSize: number;
  spacing: number;
  minHeight: number;
  padding: number;
}

export const EMPTY_STATE_GEOMETRY: Record<StateSize, StateGeometryContract> = {
  sm: { iconSize: 32, spacing: 8, minHeight: 120, padding: 16 },
  md: { iconSize: 48, spacing: 12, minHeight: 200, padding: 24 },
  lg: { iconSize: 64, spacing: 16, minHeight: 280, padding: 32 },
};

export const LOADING_STATE_GEOMETRY = {
  skeletonLineHeight: 12,
  skeletonGap: 8,
  defaultLines: 3,
} as const;

export type EmptyStateType = 'empty' | 'filtered-empty' | 'search-empty';

export function getEmptyStateType(hasData: boolean, hasActiveFilters: boolean, hasSearchQuery: boolean): EmptyStateType {
  if (hasData) throw new Error('getEmptyStateType called with hasData=true');
  if (hasActiveFilters) return 'filtered-empty';
  if (hasSearchQuery) return 'search-empty';
  return 'empty';
}