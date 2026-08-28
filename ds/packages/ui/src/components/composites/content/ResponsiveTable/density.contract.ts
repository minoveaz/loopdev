export type TableDensityPreset = 'comfortable' | 'dense' | 'compact';

export interface TableDensityContract {
  headerHeight: number;
  rowHeight: number;
  cellPaddingX: number;
  cellPaddingY: number;
  minColumnWidth: number;
}

export const TABLE_DENSITY_PRESETS: Record<TableDensityPreset, TableDensityContract> = {
  comfortable: { headerHeight: 44, rowHeight: 52, cellPaddingX: 16, cellPaddingY: 12, minColumnWidth: 120 },
  dense: { headerHeight: 36, rowHeight: 40, cellPaddingX: 12, cellPaddingY: 8, minColumnWidth: 100 },
  compact: { headerHeight: 32, rowHeight: 36, cellPaddingX: 8, cellPaddingY: 6, minColumnWidth: 80 },
};

export const TABLE_RESPONSIVE_CONTRACT = {
  breakpoint: 1024,
  mobileMode: 'identity-first-rows',
  horizontalOverflow: 'table-zone-only',
  stickyHeader: 'consumer-owned',
} as const;