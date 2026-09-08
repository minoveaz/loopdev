'use client';

import { TechnicalCard } from '@loopdev/ui';

export function TechnicalCardCertification() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <TechnicalCard className="min-h-32 p-4 max-lg:min-h-24 max-lg:p-3">
        <span className="text-text-main font-mono text-xs uppercase tracking-[0.14em]">
          flat card
        </span>
      </TechnicalCard>
      <TechnicalCard variant="interactive" className="min-h-32 p-4 max-lg:min-h-24 max-lg:p-3">
        <span className="text-text-main font-mono text-xs uppercase tracking-[0.14em]">
          interactive card
        </span>
      </TechnicalCard>
      <TechnicalCard variant="warning" className="min-h-32 p-4 max-lg:min-h-24 max-lg:p-3">
        <div className="flex h-full flex-col justify-between gap-2">
          <span className="text-text-main font-mono text-xs uppercase tracking-[0.14em]">
            warning card
          </span>
          <span className="text-warning text-xs">
            Warning semantics belong to the consuming state.
          </span>
        </div>
      </TechnicalCard>
      <TechnicalCard variant="disabled" className="min-h-32 p-4 max-lg:min-h-24 max-lg:p-3">
        <div className="flex h-full flex-col justify-between gap-2">
          <span className="text-text-main font-mono text-xs uppercase tracking-[0.14em]">
            disabled card
          </span>
          <span className="text-text-muted text-xs">Unavailable for interaction.</span>
        </div>
      </TechnicalCard>
      <TechnicalCard data-read-only="true" className="min-h-32 p-4 max-lg:min-h-24 max-lg:p-3">
        <div className="flex h-full flex-col justify-between gap-2">
          <span className="text-text-main font-mono text-xs uppercase tracking-[0.14em]">
            read-only card
          </span>
          <span className="text-text-muted text-xs">Readable; mutations are disabled.</span>
        </div>
      </TechnicalCard>
    </div>
  );
}
