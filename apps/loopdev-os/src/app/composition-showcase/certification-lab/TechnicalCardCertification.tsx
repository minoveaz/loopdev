'use client';

import { TechnicalCard } from '@loopdev/ui';

export function TechnicalCardCertification() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <TechnicalCard className="min-h-32 max-lg:min-h-24 p-4 max-lg:p-3">
        <span className="font-mono text-xs uppercase tracking-[0.14em] text-text-main">flat card</span>
      </TechnicalCard>
      <TechnicalCard variant="interactive" className="min-h-32 max-lg:min-h-24 p-4 max-lg:p-3">
        <span className="font-mono text-xs uppercase tracking-[0.14em] text-text-main">interactive card</span>
      </TechnicalCard>
      <TechnicalCard variant="warning" className="min-h-32 max-lg:min-h-24 p-4 max-lg:p-3">
        <div className="flex h-full flex-col justify-between gap-2">
          <span className="font-mono text-xs uppercase tracking-[0.14em] text-text-main">warning card</span>
          <span className="text-xs text-warning">Warning semantics belong to the consuming state.</span>
        </div>
      </TechnicalCard>
      <TechnicalCard variant="disabled" className="min-h-32 max-lg:min-h-24 p-4 max-lg:p-3">
        <div className="flex h-full flex-col justify-between gap-2">
          <span className="font-mono text-xs uppercase tracking-[0.14em] text-text-main">disabled card</span>
          <span className="text-xs text-text-muted">Unavailable for interaction.</span>
        </div>
      </TechnicalCard>
      <TechnicalCard data-read-only="true" className="min-h-32 max-lg:min-h-24 p-4 max-lg:p-3">
        <div className="flex h-full flex-col justify-between gap-2">
          <span className="font-mono text-xs uppercase tracking-[0.14em] text-text-main">read-only card</span>
          <span className="text-xs text-text-muted">Readable; mutations are disabled.</span>
        </div>
      </TechnicalCard>
    </div>
  );
}
