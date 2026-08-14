import { describe, expect, it } from 'vitest';
import { ViewCompositionSchema } from '../composition';

describe('Configurable composition contract', () => {
  it('accepts a bounded overview composition', () => {
    expect(
      ViewCompositionSchema.safeParse({
        recipe: 'SuiteOverview',
        grid: { columns: 12, gap: 'md' },
        regions: [
          { id: 'summary', slot: 'summary', component: 'StatusCardGroup', colSpan: 7 },
          {
            id: 'visual-canvas',
            slot: 'visual-canvas',
            component: 'TechnicalCanvas',
            colSpan: 5,
            rowSpan: 2,
            responsive: { mobile: 'full' },
          },
        ],
      }).success,
    ).toBe(true);
  });

  it('rejects duplicate IDs and spans larger than the grid', () => {
    const result = ViewCompositionSchema.safeParse({
      recipe: 'DataWorkspace',
      grid: { columns: 8, gap: 'sm' },
      regions: [
        { id: 'table', slot: 'content', component: 'DataTable', colSpan: 9 },
        { id: 'table', slot: 'footer', component: 'Pagination', colSpan: 8 },
      ],
    });

    expect(result.success).toBe(false);
  });
});
