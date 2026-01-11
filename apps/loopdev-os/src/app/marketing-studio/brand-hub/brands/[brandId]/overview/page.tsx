'use client';

import React, { useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useBrandHub } from '@/suites/marketing-studio/brand-hub/context';
import { 
  MOCK_PUBLISHED_BRAND, 
  MOCK_DRAFT_BRAND, 
  MOCK_BRAND_HEALTH, 
  MOCK_RECENT_EVENTS 
} from '@/suites/marketing-studio/brand-hub/fixtures/overview-data';
import { GovernanceDomain } from '@/suites/marketing-studio/brand-hub/types';

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

  // MOCK DATA SELECTION (Simulating API fetch based on ID)
  // In real app, use useBrandOverview(brandId) hook
  const activeBrand = brandId === '2' ? MOCK_DRAFT_BRAND : MOCK_PUBLISHED_BRAND;
  const healthData = MOCK_BRAND_HEALTH;
  const eventsData = MOCK_RECENT_EVENTS;
  
  const governanceDomains: GovernanceDomain[] = [
    { id: 'identity', label: 'Identity', access: 'allowed' },
    { id: 'tokens', label: 'Visual Tokens', access: 'approval-required' },
    { id: 'rules', label: 'Governance Rules', access: 'restricted' },
  ];

  // --- INTERACTION HANDLERS (The Brain Wiring) ---

  const handleMetricClick = (metricId: string) => {
    // Map metric ID to Inspector Tab
    const tabMap: Record<string, string> = {
      compliance: 'validation',
      approvals: 'governance',
      overrides: 'impact',
      dependencies: 'impact'
    };

    setSelectedEntity({
      type: 'brand.metric',
      id: metricId,
      name: `${metricId.charAt(0).toUpperCase() + metricId.slice(1)} Report`
    });
    setInspectorOpen(true);
    // TODO: In a real implementation, we would pass the 'activeTab' preference to the context
    // For now, UnifiedInspector defaults to context or uses internal state.
    // We might need to expose setActiveTab via context in the next iteration.
  };

  const handleDomainClick = (domainId: string) => {
    setSelectedEntity({
      type: 'brand.domain',
      id: domainId,
      name: `${domainId.toUpperCase()} Policy`
    });
    setInspectorOpen(true);
  };

  const handleEventClick = (event: any) => {
    setSelectedEntity({
      type: 'audit.event',
      id: event.id,
      name: event.label
    });
    setInspectorOpen(true);
  };

  const handleAction = (actionId: string) => {
    console.log('Action triggered:', actionId);
    
    switch (actionId) {
      case 'compare':
        router.push(`/marketing-studio/brand-hub/brands/${brandId}/versions/compare`);
        break;
      case 'dependencies':
        // Open Inspector instead of navigating for quick check
        handleMetricClick('dependencies'); 
        break;
      default:
        // Future: Implement modal or transactional flows
        break;
    }
  };

  return (
    <div className="flex flex-col gap-8 p-8 max-w-[1600px] mx-auto animate-in fade-in duration-500">
      
      {/* ROW 1: Status Anchor */}
      <section>
        <BrandStatusSnapshot brand={activeBrand} />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ROW 2: Health & Governance */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          <BrandHealthPanel 
            health={healthData} 
            onMetricClick={handleMetricClick}
          />
          
          <RecentActivityFeed 
            events={eventsData} 
            onEventClick={handleEventClick}
          />
        </div>

        {/* RIGHT COLUMN: Sidebar-like widgets */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          <GovernanceSummary 
            domains={governanceDomains}
            onDomainClick={handleDomainClick}
          />
          
          <ActionLauncher 
            brandStatus={activeBrand.status}
            mode={activeBrand.mode}
            onAction={handleAction}
          />
        </div>

      </div>
    </div>
  );
}
