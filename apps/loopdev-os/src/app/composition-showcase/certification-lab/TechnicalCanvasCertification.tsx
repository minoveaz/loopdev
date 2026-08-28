'use client';

import { TechnicalCanvas, TechnicalSurface } from '@loopdev/ui';

export function TechnicalCanvasCertification() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {(['blueprint', 'neural', 'monochrome', 'clean'] as const).map((variant) => (
        <TechnicalSurface
          key={variant}
          variant="surface"
          radius="md"
          border="technical"
          className={`relative min-h-40 overflow-hidden p-5 ${variant === 'blueprint' ? 'text-primary' : variant === 'neural' ? 'text-accent' : variant === 'monochrome' ? 'text-text-main' : 'text-text-muted'}`}
        >
          <TechnicalCanvas
            variant={variant}
            intensity={variant === 'clean' ? 'low' : 'high'}
            size={variant === 'neural' ? 28 : variant === 'monochrome' ? 56 : 40}
            showSubgrid={variant === 'blueprint'}
          />
          <div className="relative z-10 flex h-full min-h-32 items-end">
            <span className="font-mono text-xs uppercase tracking-[0.14em] text-text-main">
              {variant}
            </span>
          </div>
        </TechnicalSurface>
      ))}
    </div>
  );
}
