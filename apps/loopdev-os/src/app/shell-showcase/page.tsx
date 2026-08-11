'use client';

import { useState } from 'react';

import {
  BrandLogo,
  CommandBarTrigger,
  NOTIFICATION_CENTER_FIXTURES,
  OrganizationSwitcher,
  PlatformHeader,
  SuiteSwitcher,
  UserMenu,
  AVAILABLE_SUITES_FIXTURES,
  GlobalContextPanel,
  type GlobalContextPanelMode,
} from '@loopdev/ui';
import { useOrganization } from '@/hooks/useOrganization';
import { PlatformHeaderControls } from '@/components/layout/PlatformHeaderControls';
import { useRouter } from 'next/navigation';

export default function ShellShowcasePage() {
  const [contextMode, setContextMode] = useState<GlobalContextPanelMode | null>(null);
  const router = useRouter();
  const currentSuite = AVAILABLE_SUITES_FIXTURES.find(
    (suite) => suite.suiteId === 'salesCRM',
  ) ?? AVAILABLE_SUITES_FIXTURES[0];
  const {
    organizations,
    activeOrganization,
    setActiveOrganizationId,
    isLoading: isOrganizationLoading,
  } = useOrganization();

  return (
    <main className="bg-shell-canvas min-h-screen">
      <div className="h-[var(--lpd-space-14)]">
        <PlatformHeader
          identitySlot={
            <div className="flex min-w-0 items-center gap-3">
              <BrandLogo variant="isotype" size="sm" className="shrink-0" />
            </div>
          }
          contextSlot={
            <div className="flex min-w-0 items-center gap-2">
              <OrganizationSwitcher
                organizations={organizations.map(({ id, name }) => ({
                  id,
                  name,
                  planLabel: 'FREE',
                }))}
                activeOrganizationId={activeOrganization?.id}
                isLoading={isOrganizationLoading}
                onOrganizationNavigate={() => router.push('/launchpad')}
                onOrganizationChange={setActiveOrganizationId}
                onAllOrganizations={() => undefined}
                onCreateOrganization={() => undefined}
              />
              <span className="text-primary px-1 text-xs font-normal" aria-hidden="true">
                |
              </span>
              <SuiteSwitcher
                currentSuite={currentSuite}
                availableSuites={AVAILABLE_SUITES_FIXTURES}
                showIcon={false}
                onSuiteChange={(suiteId) => {
                  if (suiteId === 'os.home') {
                    router.push('/launchpad');
                    return;
                  }

                  const suite = AVAILABLE_SUITES_FIXTURES.find((item) => item.suiteId === suiteId);
                  router.push(suite?.route.routeId ?? '/launchpad');
                }}
              />
            </div>
          }
          searchSlot={<CommandBarTrigger className="w-full" onOpen={() => undefined} />}
          controlsSlot={
            <PlatformHeaderControls
              notifications={NOTIFICATION_CENTER_FIXTURES.recent}
              unreadCount={NOTIFICATION_CENTER_FIXTURES.recent.filter(({ read }) => !read).length}
              activeContext={contextMode}
              onOpenNotifications={() => setContextMode('notifications')}
              onOpenHelp={() => setContextMode('help')}
              onOpenAI={() => setContextMode('assistant')}
            />
          }
          profileSlot={
            <UserMenu
              userName="Alex Morgan"
              userEmail="showcase@loopdev.local"
              userRole="Tenant_Admin"
              tenantName="Showcase Workspace"
              userSrc="https://i.pravatar.cc/64?img=12"
              timezoneOptions={[
                { label: 'Auto detect', isActive: true },
                { label: '(UTC) Coordinated Universal Time' },
                { label: '(UTC-05:00) Eastern Time' },
              ]}
              onOpenChange={() => undefined}
              onLogout={() => undefined}
            />
          }
        />
      </div>
      {contextMode && (
        <div className="fixed bottom-0 right-0 top-[var(--lpd-space-14)] z-50 w-[min(400px,100vw)] shadow-2xl">
          <GlobalContextPanel
            mode={contextMode}
            notifications={NOTIFICATION_CENTER_FIXTURES.recent}
            unreadCount={NOTIFICATION_CENTER_FIXTURES.recent.filter(({ read }) => !read).length}
            onClose={() => setContextMode(null)}
          />
        </div>
      )}
    </main>
  );
}
