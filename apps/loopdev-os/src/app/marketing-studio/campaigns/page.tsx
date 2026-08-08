'use client';

import { Heading, LpdText } from '@loopdev/ui';
import { useMarketingCampaigns } from '@/hooks/marketing/useMarketingCampaigns';

export default function MarketingCampaignsPage() {
  const { data: campaigns = [], isLoading, isError } = useMarketingCampaigns();

  return (
    <main className="mx-auto flex h-full max-w-7xl flex-col p-8 lg:p-10">
      <div className="mb-10">
        <div className="mb-2 flex items-center gap-2">
          <span className="text-xs font-mono uppercase tracking-widest text-primary/60">Module 04</span>
          <span className="h-px w-8 bg-primary/20" />
        </div>
        <Heading size="2xl" weight="bold">Campaign Orchestrator</Heading>
        <LpdText className="text-text-muted">Plan, govern and measure campaigns for the active work context.</LpdText>
      </div>

      {isLoading && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3" aria-label="Loading campaigns">
          {[1, 2, 3].map((item) => <div key={item} className="h-40 animate-pulse rounded-xl bg-surface-elevated" />)}
        </div>
      )}

      {isError && (
        <section className="rounded-xl border border-red-500/20 bg-red-500/5 p-6">
          <Heading size="sm">Campaigns unavailable</Heading>
          <LpdText className="text-text-muted">We could not load campaigns for this work context.</LpdText>
        </section>
      )}

      {!isLoading && !isError && campaigns.length === 0 && (
        <section className="rounded-xl border border-border-subtle bg-surface-elevated p-8">
          <Heading size="sm">No campaigns yet</Heading>
          <LpdText className="text-text-muted">Create the first campaign for this organization and workspace.</LpdText>
        </section>
      )}

      {!isLoading && !isError && campaigns.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {campaigns.map((campaign) => (
            <article key={campaign.id} className="rounded-xl border border-border-subtle bg-surface-elevated p-6">
              <div className="mb-6 flex items-start justify-between gap-4">
                <Heading size="sm">{campaign.name}</Heading>
                <span className="rounded-full bg-primary/10 px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-primary">
                  {campaign.status}
                </span>
              </div>
              <LpdText className="text-text-muted">{campaign.objective}</LpdText>
              <div className="mt-6 border-t border-border-subtle pt-4 text-xs text-text-muted">
                Updated {new Date(campaign.updatedAt).toLocaleDateString()}
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
