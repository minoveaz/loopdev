'use client';

import {
  BrandLogo,
  CommandBarTrigger,
  NOTIFICATION_CENTER_FIXTURES,
  OrganizationSwitcher,
  PlatformHeader,
  SuiteSwitcher,
  UserMenu,
  AVAILABLE_SUITES_FIXTURES,
} from '@loopdev/ui';
import { useOrganization } from '@/hooks/useOrganization';
import { PlatformHeaderControls } from '@/components/layout/PlatformHeaderControls';
import { useRouter } from 'next/navigation';

export default function ShellShowcasePage() {
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
          controlsSlot={<PlatformHeaderControls
            notifications={NOTIFICATION_CENTER_FIXTURES.recent}
            unreadCount={NOTIFICATION_CENTER_FIXTURES.recent.filter(({ read }) => !read).length}
          />}
          profileSlot={
            <UserMenu
              userName="Alex Morgan"
              userEmail="showcase@loopdev.local"
              userRole="Tenant_Admin"
              tenantName="Showcase Workspace"
              userSrc="https://i.pravatar.cc/64?img=12"
              onOpenChange={() => undefined}
              onLogout={() => undefined}
            />
          }
        />
      </div>
    </main>
  );
}
