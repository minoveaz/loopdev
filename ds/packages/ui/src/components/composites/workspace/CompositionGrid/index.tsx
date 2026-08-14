'use client';

import React from 'react';
import type { ViewComposition } from '@loopdev/contracts';
import { resolveCompositionLayout } from '@loopdev/contracts';

export interface CompositionGridProps {
  composition: ViewComposition;
  regions: Record<string, React.ReactNode>;
  className?: string;
}

export const CompositionGrid: React.FC<CompositionGridProps> = ({
  composition,
  regions,
  className = '',
}) => {
  const layouts = resolveCompositionLayout(composition);

  return (
    <div
      data-composition-recipe={composition.recipe}
      data-composition-grid={composition.grid.columns}
      className={`grid min-h-0 min-w-0 ${className}`}
      style={{
        gridTemplateColumns: `repeat(${composition.grid.columns}, minmax(0, 1fr))`,
        gap: composition.grid.gap === 'sm' ? '0.75rem' : composition.grid.gap === 'lg' ? '1.5rem' : '1rem',
      }}
    >
      {layouts.map((layout) => (
        <div
          key={layout.id}
          data-composition-region={layout.id}
          className="min-w-0"
          style={{
            gridColumn: `span ${layout.columnSpan} / span ${layout.columnSpan}`,
            gridRow: `span ${layout.rowSpan} / span ${layout.rowSpan}`,
            order: layout.order,
          }}
        >
          {regions[layout.id]}
        </div>
      ))}
    </div>
  );
};
