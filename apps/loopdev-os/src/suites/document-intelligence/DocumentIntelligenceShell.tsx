'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  BrandLogo,
  CommandBarTrigger,
  ModuleHeader,
  NOTIFICATION_CENTER_FIXTURES,
  OrganizationSwitcher,
  SuiteRuntime,
  SuiteSwitcher,
  ThemeToggle,
  UserMenu,
  type PlatformContextPanelMode,
} from '@loopdev/ui';
import type { NavMode, NavRouteRef } from '@loopdev/contracts';
import { CircleHelp } from 'lucide-react';

import { ContextPanelHost } from '@/components/layout/ContextPanelHost';
import { useOrganization } from '@/hooks/useOrganization';
import {
  PlatformHeaderActionButton,
  PlatformHeaderControls,
} from '@/components/layout/PlatformHeaderControls';
import { DOCUMENT_INTELLIGENCE_SUITE_CONFIG } from './config';
import { WorkbenchInspector } from './workbench/WorkbenchInspector';
import { useWorkbenchPrototype } from './workbench/workbench-context';

const FLOW_STATUS: Record<
  string,
  { label: string; severity: 'info' | 'success' | 'warning' | 'danger' }
> = {
  preparation: { label: 'PREPARACIÓN', severity: 'info' },
  processing: { label: 'PROCESANDO', severity: 'info' },
  review: { label: 'REVISIÓN', severity: 'success' },
  error: { label: 'ERROR RECUPERABLE', severity: 'danger' },
};

function WorkbenchModuleHeader() {
  const { flowState } = useWorkbenchPrototype();
  const status = FLOW_STATUS[flowState] ?? FLOW_STATUS.preparation;

  return (
    <ModuleHeader
      segments={[
        { id: 'suite', label: 'Document Intelligence', href: '/document-intelligence' },
        { id: 'module', label: 'Document extraction', isActive: true },
      ]}
      statusLabel={status.label}
      statusSeverity={status.severity}
    />
  );
}

export function DocumentIntelligenceShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [contextMode, setContextMode] = useState<PlatformContextPanelMode | null>(null);
  const [navMode, setNavMode] = useState<Exclude<NavMode, 'hidden'>>('expanded');
  const {
    organizations,
    activeOrganization,
    activeOrganizationId,
    setActiveOrganizationId,
    isLoading: isLoadingOrganizations,
  } = useOrganization();
  const activeModuleId =
    DOCUMENT_INTELLIGENCE_SUITE_CONFIG.modules.find((module) => module.route === pathname)
      ?.moduleId ?? (pathname.startsWith('/document-intelligence/') ? 'workbench' : undefined);

  return (
    <SuiteRuntime
      config={{ ...DOCUMENT_INTELLIGENCE_SUITE_CONFIG, navMode }}
      activeModuleId={activeModuleId}
      moduleHeaderRenderers={{ workbench: () => <WorkbenchModuleHeader /> }}
      moduleContextPanelRenderers={{ workbench: () => <WorkbenchInspector /> }}
      leftSlot={<BrandLogo variant="isotype" size="sm" className="shrink-0" />}
      centerSlot={
        <CommandBarTrigger
          className="w-full"
          placeholder="Search Document Intelligence"
          onOpen={() => undefined}
        />
      }
      rightSlot={
        <PlatformHeaderControls
          notifications={NOTIFICATION_CENTER_FIXTURES.recent}
          unreadCount={NOTIFICATION_CENTER_FIXTURES.recent.filter(({ read }) => !read).length}
          activeContext={contextMode}
          onOpenNotifications={() => setContextMode('notifications')}
          onOpenHelp={() => setContextMode('help')}
          onOpenAI={() => setContextMode('assistant')}
        />
      }
      platformHeaderProps={{
        contextSlot: (
          <div className="flex min-w-0 items-center gap-2">
            <OrganizationSwitcher
              organizations={organizations.map(({ id, name }) => ({ id, name, planLabel: 'PRO' }))}
              activeOrganizationId={activeOrganizationId}
              isLoading={isLoadingOrganizations}
              onOrganizationNavigate={() => router.push('/launchpad')}
              onOrganizationChange={setActiveOrganizationId}
              onAllOrganizations={() => router.push('/launchpad')}
              onCreateOrganization={() => undefined}
            />
            <span className="text-primary px-1 text-xs" aria-hidden="true">
              |
            </span>
            <SuiteSwitcher
              currentSuite={DOCUMENT_INTELLIGENCE_SUITE_CONFIG.identity}
              availableSuites={[DOCUMENT_INTELLIGENCE_SUITE_CONFIG.identity]}
              showIcon={false}
              onSuiteChange={() => router.push('/document-intelligence')}
            />
          </div>
        ),
      }}
      profileSlot={
        <UserMenu
          userName="Document Intelligence User"
          userEmail="di@loopdev.local"
          userRole="Organization Member"
          tenantName={activeOrganization?.name}
          onOpenChange={(open) => {
            if (open) setContextMode(null);
          }}
          onAvatarClick={() => setContextMode('profile')}
          onProfileClick={() => setContextMode('profile')}
          onLogout={() => undefined}
        />
      }
      mobileSidebarActions={
        <div className="flex min-w-0 items-center gap-1">
          <ThemeToggle variant="technical" size="md" />
          <PlatformHeaderActionButton
            label="Open help center"
            title="Help center"
            active={contextMode === 'help'}
            onClick={() => setContextMode('help')}
          >
            <CircleHelp size={16} aria-hidden="true" />
          </PlatformHeaderActionButton>
        </div>
      }
      onNavModeChange={setNavMode}
      appShellProps={{
        onToggleLeftSidebar: () =>
          setNavMode((current) => (current === 'expanded' ? 'rail' : 'expanded')),
        onRequestCloseContext: () => setContextMode(null),
        config: { activeOverlay: contextMode ? 'context' : null },
        contextSlot: contextMode ? (
          <ContextPanelHost
            mode={contextMode}
            notifications={NOTIFICATION_CENTER_FIXTURES.recent}
            unreadCount={NOTIFICATION_CENTER_FIXTURES.recent.filter(({ read }) => !read).length}
            onClose={() => setContextMode(null)}
          />
        ) : undefined,
      }}
      onNavigate={(route: NavRouteRef) => router.push(route.routeId)}
    >
      {children}
    </SuiteRuntime>
  );
}
