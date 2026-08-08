'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useBrandHub } from '@/suites/marketing-studio/brand-hub/context';
import { Heading, LpdText } from '@loopdev/ui';
import {
  MOCK_BRAND_HEALTH,
} from '@/suites/marketing-studio/brand-hub/fixtures/overview-data';
import { useBrandContextSnapshot } from '@/hooks/marketing/useBrandContextSnapshot';
import type { GovernanceDomain, BrandEvent } from '@/suites/marketing-studio/brand-hub/types';

// Components
import { BrandStatusSnapshot } from '@/suites/marketing-studio/brand-hub/components/BrandStatusSnapshot';
import { BrandHealthPanel } from '@/suites/marketing-studio/brand-hub/components/BrandHealthPanel';
import { GovernanceSummary } from '@/suites/marketing-studio/brand-hub/components/GovernanceSummary';
import { RecentActivityFeed } from '@/suites/marketing-studio/brand-hub/components/RecentActivityFeed';
import { ActionLauncher } from '@/suites/marketing-studio/brand-hub/components/ActionLauncher';

/**
 * @page BrandOverviewPage
 * @description Operational dashboard for a specific brand.
 * Implementation of Brand Hub Overview Spec v1.1.
 */
export default function BrandOverviewPage() {
  const params = useParams();
  const router = useRouter();
  const brandId = params.brandId as string;
  const { setInspectorOpen, setSelectedEntity } = useBrandHub();
  const { data: brandContext, isLoading } = useBrandContextSnapshot(brandId);

  const activeBrand = brandContext
    ? {
        id: brandContext.brand.id,
        name: brandContext.brand.name,
        status: brandContext.brand.status,
        mode: brandContext.version.status === 'published' ? ('read-only' as const) : ('draft-mode' as const),
        activeVersion: brandContext.version.number ? `v${brandContext.version.number}` : 'UNPUBLISHED',
        lastUpdated: brandContext.brand.updatedAt,
        lastActor: brandContext.brand.createdBy ?? 'System',
        overridesCount: 0,
      }
    : null;
  const healthData = MOCK_BRAND_HEALTH;
  const eventsData: BrandEvent[] = [];

  const governanceDomains: GovernanceDomain[] = [
    { id: 'identity', label: 'Identity', access: 'allowed' },
    { id: 'tokens', label: 'Visual Tokens', access: 'approval-required' },
    { id: 'rules', label: 'Governance Rules', access: 'restricted' },
  ];

  // --- INTERACTION HANDLERS (The Brain Wiring) ---

  const handleMetricClick = (metricId: string) => {
    setSelectedEntity({
      type: 'brand.metric',
      id: metricId,
      name: `${metricId.charAt(0).toUpperCase() + metricId.slice(1)} Report`,
    });

    setInspectorOpen(true);
  };

  const handleDomainClick = (domainId: string) => {
    setSelectedEntity({
      type: 'brand.domain',
      id: domainId,
      name: `${domainId.toUpperCase()} Policy`,
    });
    setInspectorOpen(true);
  };

  const handleEventClick = (event: BrandEvent) => {
    setSelectedEntity({
      type: 'audit.event',
      id: event.id,
      name: event.label,
    });
    setInspectorOpen(true);
  };

  const handleAction = (actionId: string) => {
    switch (actionId) {
      case 'compare':
        router.push(`/marketing-studio/brand-hub/brands/${brandId}/versions/compare`);
        break;
      case 'dependencies':
        handleMetricClick('dependencies');
        break;
      default:
        console.log('Action triggered:', actionId);
        break;
    }
  };

  if (isLoading || !activeBrand) {
    return <BrandStatusSnapshot brand={activeBrand ?? { id: brandId, name: 'Loading brand', status: 'draft', mode: 'draft-mode', activeVersion: 'LOADING', lastUpdated: '', lastActor: '', overridesCount: 0 }} isLoading />;
  }

  return (
    <div className="flex flex-col gap-8 p-8 max-w-[1600px] mx-auto animate-in fade-in duration-500">
      {/* HEADER SECTION */}
      <header className="flex flex-col gap-2">
        <Heading as="h1" size="2xl" weight="bold" className="text-text-main tracking-tight uppercase">
          Brand Overview _OPS
        </Heading>
        <LpdText size="sm" className="text-text-muted max-w-2xl leading-relaxed">
          Operational command center for monitoring brand health, governance status, and recent
          activity.
        </LpdText>
      </header>

      {/* ROW 1: Status Anchor */}
      <section>
        <BrandStatusSnapshot brand={activeBrand} />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* ROW 2: Health & Governance */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          <BrandHealthPanel health={healthData} onMetricClick={handleMetricClick} />

          <RecentActivityFeed events={eventsData} onEventClick={handleEventClick} />
        </div>

        {/* RIGHT COLUMN: Sidebar-like widgets */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          <GovernanceSummary domains={governanceDomains} onDomainClick={handleDomainClick} />

          <ActionLauncher
            brandStatus={activeBrand.status}
            mode={activeBrand.mode}
            onAction={handleAction}
          />
        </div>
      </div>

      {/* SYNC LOCAL STATE TO LAYOUT INSPECTOR (Via Context override or local component) */}
      {/* Note: In a real implementation, activeTab should be in useBrandHub context */}
    </div>
  );
}
