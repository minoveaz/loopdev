import { describe, expect, it } from 'vitest';
import { ViewCompositionSchema } from '../composition';
import { validateCompositionAgainstRegistry } from '../composition-registry';
import { resolveCompositionLayout } from '../composition-layout';

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

  it('rejects slots and components outside the recipe registry', () => {
    const composition = ViewCompositionSchema.parse({
      recipe: 'DataWorkspace',
      grid: { columns: 12, gap: 'md' },
      regions: [{ id: 'map', slot: 'visual-canvas', component: 'TechnicalCanvas', colSpan: 12 }],
    });

    expect(validateCompositionAgainstRegistry(composition)).toEqual([
      { regionId: 'map', message: 'Slot "visual-canvas" is not allowed' },
      { regionId: 'map', message: 'Component "TechnicalCanvas" is not allowed' },
    ]);
  });

  it('resolves responsive layout defaults without pixel coordinates', () => {
    const composition = ViewCompositionSchema.parse({
      recipe: 'SuiteOverview',
      grid: { columns: 12, gap: 'md' },
      regions: [
        {
          id: 'summary',
          slot: 'summary',
          component: 'StatusCardGroup',
          colSpan: 7,
          rowSpan: 2,
          responsive: { mobile: 'full' },
        },
      ],
    });

    expect(resolveCompositionLayout(composition)).toEqual([
      {
        id: 'summary',
        columnSpan: 7,
        rowSpan: 2,
        tabletClass: 'preserve',
        mobileClass: 'full',
      },
    ]);
  });

  it('accepts the CreativeEditor recipe with stage and timeline regions', () => {
    expect(
      ViewCompositionSchema.safeParse({
        recipe: 'CreativeEditor',
        grid: { columns: 12, gap: 'md' },
        regions: [
          { id: 'toolbar', slot: 'header', component: 'ModuleHeader', colSpan: 12 },
          {
            id: 'assets',
            slot: 'asset-sidebar',
            component: 'ModuleContextSidebar',
            colSpan: 2,
            rowSpan: 3,
          },
          { id: 'stage', slot: 'stage', component: 'VideoStage', colSpan: 10, rowSpan: 2 },
          { id: 'timeline', slot: 'timeline', component: 'Timeline', colSpan: 10 },
        ],
      }).success,
    ).toBe(true);
  });
});
