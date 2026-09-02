import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it } from 'vitest';
import type { PublicViewComposition } from '@loopdev/contracts';
import { PublicCanvas } from '../canvas/PublicCanvas';
import { PublicCanvasRegion } from '../canvas/PublicCanvasRegion';

const testComposition: PublicViewComposition = {
  recipe: 'PublicSocialFeed',
  grid: { columns: 12, gap: 'md', maxWidth: '7xl' },
  regions: [
    {
      id: 'filters-region',
      slot: 'sidebar-filters',
      component: 'Filters',
      colSpan: 3,
      responsive: { tablet: 'drawer', mobile: 'sheet' },
    },
    {
      id: 'feed-region',
      slot: 'main-feed',
      component: 'Feed',
      colSpan: 6,
      responsive: { tablet: 'preserve', mobile: 'stack' },
    },
    {
      id: 'inspector-region',
      slot: 'context-inspector',
      component: 'Inspector',
      colSpan: 3,
      responsive: { tablet: 'stack', mobile: 'modal' },
    },
  ],
};

describe('PublicCanvas and PublicCanvasRegion', () => {
  it('applies the 12-column layout and responsive classes to public canvas regions', () => {
    const { container } = render(
      <PublicCanvas composition={testComposition}>
        <PublicCanvasRegion id="filters-region">
          <div>Filters</div>
        </PublicCanvasRegion>
        <PublicCanvasRegion id="feed-region">
          <div>Feed</div>
        </PublicCanvasRegion>
        <PublicCanvasRegion id="inspector-region">
          <div>Inspector</div>
        </PublicCanvasRegion>
      </PublicCanvas>,
    );

    const main = container.querySelector('main');
    expect(main?.className).toContain('grid-cols-12');
    expect(main?.className).toContain('gap-6');

    const filtersSection = container.querySelector('#filters-region');
    expect(filtersSection?.className).toContain('lg:col-span-3');

    const feedSection = container.querySelector('#feed-region');
    expect(feedSection?.className).toContain('lg:col-span-6');

    const inspectorSection = container.querySelector('#inspector-region');
    expect(inspectorSection?.className).toContain('lg:col-span-3');
  });
});
