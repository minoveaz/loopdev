'use client';

import { TechnicalSurface } from '@loopdev/ui';

export function TechnicalSurfaceCertification() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {(['surface', 'glass', 'canvas'] as const).map((variant) => (
        <TechnicalSurface
          key={variant}
          variant={variant}
          depth={variant === 'glass' ? 'raised' : 'flat'}
          radius="md"
          border="technical"
          className="min-h-32 p-4"
        >
          <span className="font-mono text-xs uppercase tracking-[0.14em] text-text-main">
            {variant} surface
          </span>
        </TechnicalSurface>
      ))}
    </div>
  );
}
