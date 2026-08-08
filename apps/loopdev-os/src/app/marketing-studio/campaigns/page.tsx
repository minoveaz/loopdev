'use client';

import { Button, Heading, LpdText } from '@loopdev/ui';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useMarketingCampaigns } from '@/hooks/marketing/useMarketingCampaigns';
import { useOrganization } from '@/hooks/useOrganization';
import { useBrand } from '@/hooks/useBrand';
import { useWorkspace } from '@/hooks/useWorkspace';
import { usePermissions } from '@/hooks/usePermissions';

export default function MarketingCampaignsPage() {
  const { data: campaigns = [], isLoading, isError } = useMarketingCampaigns();
  const { activeOrganizationId } = useOrganization();
  const { brands, activeBrandId } = useBrand();
  const { workspaces } = useWorkspace();
  const { hasPermission, isLoading: isLoadingPermissions } = usePermissions();
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState('');
  const [objective, setObjective] = useState('');
  const [brandId, setBrandId] = useState(activeBrandId ?? brands[0]?.id ?? '');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const marketingWorkspace = workspaces.find((workspace) => workspace.suiteKey === 'marketing');
  const canManage = !isLoadingPermissions && hasPermission('marketing.manage');

  async function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!activeOrganizationId || !marketingWorkspace || !brandId) return;
    setSubmitError(null);
    const response = await fetch('/api/marketing/campaigns', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        organizationId: activeOrganizationId,
        brandId,
        workspaceId: marketingWorkspace.id,
        name,
        objective,
      }),
    });
    if (!response.ok) {
      setSubmitError('Unable to create campaign. Check your permissions and try again.');
      return;
    }
    setName('');
    setObjective('');
    setIsCreating(false);
    await queryClient.invalidateQueries({
      queryKey: ['marketing-campaigns', activeOrganizationId, marketingWorkspace.id],
    });
  }

  return (
    <main className="mx-auto flex h-full max-w-7xl flex-col p-8 lg:p-10">
      <div className="mb-10">
        <div className="mb-2 flex items-center gap-2">
          <span className="text-xs font-mono uppercase tracking-widest text-primary/60">
            Module 04
          </span>
          <span className="h-px w-8 bg-primary/20" />
        </div>
        <Heading size="2xl" weight="bold">
          Campaign Orchestrator
        </Heading>
        <LpdText className="text-text-muted">
          Plan, govern and measure campaigns for the active work context.
        </LpdText>
      </div>

      {canManage && (
        <div className="mb-8">
          {!isCreating ? (
            <Button type="button" variant="primary" onClick={() => setIsCreating(true)}>
              New Campaign
            </Button>
          ) : (
            <form
              onSubmit={handleCreate}
              className="max-w-2xl rounded-xl border border-border-subtle bg-surface-elevated p-6"
            >
              <Heading size="sm">Create campaign</Heading>
              <div className="mt-5 grid gap-4">
                <label className="grid gap-2 text-sm">
                  <span className="text-text-muted">Brand</span>
                  <select
                    value={brandId}
                    onChange={(event) => setBrandId(event.target.value)}
                    className="rounded-lg border border-border-subtle bg-surface px-3 py-2"
                  >
                    {brands.map((brand) => (
                      <option key={brand.id} value={brand.id}>
                        {brand.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="grid gap-2 text-sm">
                  <span className="text-text-muted">Name</span>
                  <input
                    required
                    minLength={1}
                    maxLength={160}
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="rounded-lg border border-border-subtle bg-surface px-3 py-2"
                  />
                </label>
                <label className="grid gap-2 text-sm">
                  <span className="text-text-muted">Objective</span>
                  <textarea
                    required
                    minLength={1}
                    maxLength={240}
                    value={objective}
                    onChange={(event) => setObjective(event.target.value)}
                    className="min-h-24 rounded-lg border border-border-subtle bg-surface px-3 py-2"
                  />
                </label>
                {submitError && <p className="text-sm text-danger">{submitError}</p>}
                <div className="flex gap-3">
                  <Button type="submit" variant="primary">
                    Create
                  </Button>
                  <Button type="button" variant="ghost" onClick={() => setIsCreating(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </form>
          )}
        </div>
      )}

      {isLoading && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3" aria-label="Loading campaigns">
          {[1, 2, 3].map((item) => (
            <div key={item} className="h-40 animate-pulse rounded-xl bg-surface-elevated" />
          ))}
        </div>
      )}

      {isError && (
        <section className="rounded-xl border border-danger/20 bg-danger/5 p-6">
          <Heading size="sm">Campaigns unavailable</Heading>
          <LpdText className="text-text-muted">
            We could not load campaigns for this work context.
          </LpdText>
        </section>
      )}

      {!isLoading && !isError && campaigns.length === 0 && (
        <section className="rounded-xl border border-border-subtle bg-surface-elevated p-8">
          <Heading size="sm">No campaigns yet</Heading>
          <LpdText className="text-text-muted">
            Create the first campaign for this organization and workspace.
          </LpdText>
        </section>
      )}

      {!isLoading && !isError && campaigns.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {campaigns.map((campaign) => (
            <article
              key={campaign.id}
              className="rounded-xl border border-border-subtle bg-surface-elevated p-6"
            >
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
