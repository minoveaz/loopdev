'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import {
  Heading,
  LpdText,
  Icon,
  UIKitIllustration,
  SuiteCard,
  BlueprintBackground,
} from '@loopdev/ui';
import type { NavMode } from '@loopdev/contracts';
import { useOrganizationPermissions } from '@/hooks/useOrganizationPermissions';
import { useWorkspace } from '@/hooks/useWorkspace';
import { useOrganization } from '@/hooks/useOrganization';
import { resolveAccessState } from '@/core/access/accessState';
import { AccessStatePanel } from '@/components/layout/AccessStatePanel';
import { LaunchpadShell } from '@/components/layout/LaunchpadShell';
import {
  PLATFORM_TOOL_ENTRIES,
  resolvePlatformTools,
} from '@/core/platform/platformTools';

export default function LaunchpadPage() {
  const router = useRouter();
  const [platformNavMode, setPlatformNavMode] = useState<Exclude<NavMode, 'hidden'>>('rail');
  const {
    user,
    memberships,
    isPlatformAdministrator,
    isLoading: isAuthLoading,
    signOut,
  } = useAuth();
  const { organizations, activeOrganization, isLoading: isOrganizationLoading } = useOrganization();
  const { hasPermission, isLoading: isLoadingPermissions } = useOrganizationPermissions([
    'marketing.read',
    'crm.read',
    'health.read',
    'quant.read',
    'finance.read',
  ]);
  const { isSuiteEnabled, isLoading: isLoadingWorkspaces } = useWorkspace();
  const isPlatformScope = isPlatformAdministrator && activeOrganization?.slug === 'loopdev';
  const shouldShowSuite = (suite: 'marketing' | 'crm' | 'health' | 'quant') =>
    isPlatformScope || isSuiteEnabled(suite);
  const isLocked = (permission: string, suite: 'marketing' | 'crm' | 'health' | 'quant') =>
    !isPlatformScope &&
    (isLoadingPermissions ||
      isLoadingWorkspaces ||
      !hasPermission(permission) ||
      !isSuiteEnabled(suite));
  const platformTools = resolvePlatformTools(PLATFORM_TOOL_ENTRIES, {
    hasPermission,
    isLoading: isLoadingPermissions,
    isPlatformScope: Boolean(isPlatformScope),
  });
  const platformAccessMap = Object.fromEntries(
    PLATFORM_TOOL_ENTRIES.map((entry) => [
      entry.id,
      platformTools.some((visibleEntry) => visibleEntry.id === entry.id)
        ? entry.state ?? 'enabled'
        : 'hidden',
    ]),
  );
  const accessState = resolveAccessState({
    isAuthLoading,
    hasSession: Boolean(user),
    isPlatformAdministrator,
    membershipStatuses: memberships.map((membership) => membership.status),
  });

  if (accessState !== 'loading' && accessState !== 'authorized') {
    return <AccessStatePanel state={accessState} />;
  }

  if (
    accessState === 'authorized' &&
    !isPlatformAdministrator &&
    !isOrganizationLoading &&
    organizations.length === 0
  ) {
    return <AccessStatePanel state="no-organization-access" />;
  }

  return (
    <LaunchpadShell
      userEmail={user?.email}
      userId={user?.id}
      isPlatformAdministrator={isPlatformAdministrator}
      signOut={signOut}
      platformToolsAvailable={platformTools.length > 0}
      platformAccessMap={platformAccessMap}
      navMode={platformNavMode}
      onNavModeChange={setPlatformNavMode}
      onNavigate={(route) => router.push(route.routeId)}
    >
      <div className="relative h-full min-h-0 overflow-y-auto">
        <BlueprintBackground
          variant="monochrome"
          intensity="high"
          className="pointer-events-none fixed inset-0"
        />
        <div className="mx-auto flex min-h-full w-full max-w-6xl flex-col items-center justify-center p-8 lg:p-12">
          <div className="mb-16">
            <LpdText
              size="nano"
              weight="black"
              className="text-primary mb-4 uppercase tracking-[0.5em]"
            >
              Core_Suites_Available
            </LpdText>
            <Heading size="3xl" weight="bold" className="text-text-main max-w-2xl tracking-tight">
              Initialize your <span className="text-primary font-black">Work Context</span> to start
              building.
            </Heading>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {shouldShowSuite('marketing') && (
              <SuiteCard
                title="Marketing Studio"
                description="High-performance identity governance and generative content engine for modern teams."
                illustration={<UIKitIllustration />}
                href="#"
                version="1.0.4"
                isLocked
              />
            )}
            {shouldShowSuite('crm') && (
              <SuiteCard
                title="Sales & CRM"
                description="Pipeline intelligence and relationship management powered by predictive neural models."
                illustration={<Icon name="groups" size="md" />}
                href="/sales-crm"
                version="0.8.2"
              />
            )}
            {isPlatformScope && (
              <SuiteCard
                title="Financial Ops"
                description="Automated billing, payroll, and industrial-grade fiscal compliance orchestration."
                illustration={<Icon name="payments" size="md" />}
                href="#"
                version="0.5.0"
                isLocked
              />
            )}
            {shouldShowSuite('quant') && (
              <SuiteCard
                title="Quant Ops"
                description="Algorithmic trading engine and high-frequency execution command center."
                illustration={<Icon name="trending_up" size="md" />}
                href="/quant-ops"
                version="0.0.1"
                status="lab"
                isLocked={isLocked('quant.read', 'quant')}
              />
            )}
            {shouldShowSuite('health') && (
              <SuiteCard
                title="Health OS"
                description="Industrial-grade clinical care, electronic health records (HCE), and medical agenda for IPS providers."
                illustration={<Icon name="medical_services" size="md" />}
                href="#"
                version="0.1.0"
                isLocked
              />
            )}
          </div>
        </div>
      </div>
    </LaunchpadShell>
  );
}
