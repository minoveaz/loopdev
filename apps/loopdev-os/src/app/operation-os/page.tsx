'use client';

import { useEffect, useState } from 'react';

import {
  AVAILABLE_SUITES_FIXTURES,
  BrandLogo,
  CommandBarTrigger,
  GlobalContextPanel,
  Heading,
  NOTIFICATION_CENTER_FIXTURES,
  OrganizationSwitcher,
  SuiteRuntime,
  SuiteSwitcher,
  UserMenu,
  type GlobalContextPanelMode,
} from '@loopdev/ui';
import { themes } from '@loopdev/tokens';
import { useRouter } from 'next/navigation';
import { OPERATION_OS_CONFIG } from '@/suites/operation-os/config';
import { PlatformHeaderControls } from '@/components/layout/PlatformHeaderControls';

type OperationNavMode = 'expanded' | 'rail' | 'hover';

const SHOWCASE_THEME_VARIABLES = [
  '--lpd-color-brand-primary',
  '--lpd-color-brand-primary-rgb',
  '--lpd-color-bg-primary-subtle',
  '--lpd-color-brand-secondary',
  '--lpd-color-brand-secondary-rgb',
  '--lpd-color-brand-energy',
  '--lpd-color-bg-base',
  '--lpd-color-text-base',
  '--background',
  '--foreground',
  '--primary',
  '--accent',
  '--ring',
];

const SHOWCASE_ORGANIZATIONS = [
  { id: 'showcase-workspace', name: 'Showcase Workspace', planLabel: 'PRO', theme: '' },
  {
    id: 'northstar-labs',
    name: 'Northstar Labs',
    planLabel: 'FREE',
    theme: themes.estarProtegidos,
  },
];

export default function OperationOsPage() {
  const [contextMode, setContextMode] = useState<GlobalContextPanelMode | null>(null);
  const [navMode, setNavMode] = useState<OperationNavMode>('hover');
  const [activeOrganizationId, setActiveOrganizationId] = useState(SHOWCASE_ORGANIZATIONS[0].id);
  const router = useRouter();
  const availableSuites = [...AVAILABLE_SUITES_FIXTURES, OPERATION_OS_CONFIG.identity];
  const activeOrganization = SHOWCASE_ORGANIZATIONS.find(({ id }) => id === activeOrganizationId);

  useEffect(() => {
    const themeClass = activeOrganization?.theme;
    if (!themeClass) return;

    const root = document.documentElement;
    const previousValues = new Map(
      SHOWCASE_THEME_VARIABLES.map((variable) => [variable, root.style.getPropertyValue(variable)]),
    );
    const probe = document.createElement('div');
    probe.className = themeClass;
    document.body.appendChild(probe);
    const themeStyles = getComputedStyle(probe);

    root.classList.add(themeClass);
    SHOWCASE_THEME_VARIABLES.forEach((variable) => {
      const value = themeStyles.getPropertyValue(variable).trim();
      if (value) root.style.setProperty(variable, value);
    });
    probe.remove();

    return () => {
      root.classList.remove(themeClass);
      previousValues.forEach((value, variable) => {
        if (value) root.style.setProperty(variable, value);
        else root.style.removeProperty(variable);
      });
    };
  }, [activeOrganization?.theme]);

  return (
    <div className={`${activeOrganization?.theme ?? ''} h-full`}>
      <SuiteRuntime
        config={{ ...OPERATION_OS_CONFIG, navMode }}
        onNavModeChange={setNavMode}
        onNavigate={(route) => router.push(route.routeId)}
        leftSlot={
          <div className="flex min-w-0 items-center gap-3">
            <BrandLogo variant="isotype" size="sm" className="shrink-0" />
          </div>
        }
        centerSlot={<CommandBarTrigger className="w-full" onOpen={() => undefined} />}
        platformHeaderProps={{
          contextSlot: (
            <div className="flex min-w-0 items-center gap-2">
              <OrganizationSwitcher
                organizations={SHOWCASE_ORGANIZATIONS}
                activeOrganizationId={activeOrganization?.id}
                onOrganizationNavigate={() => router.push('/launchpad')}
                onOrganizationChange={setActiveOrganizationId}
                onAllOrganizations={() => undefined}
                onCreateOrganization={() => undefined}
              />
              <span className="text-primary px-1 text-xs font-normal" aria-hidden="true">
                |
              </span>
              <SuiteSwitcher
                currentSuite={OPERATION_OS_CONFIG.identity}
                availableSuites={availableSuites}
                showIcon={false}
                onSuiteChange={(suiteId) => {
                  const suite = availableSuites.find((item) => item.suiteId === suiteId);
                  router.push(suite?.route?.routeId ?? '/launchpad');
                }}
              />
            </div>
          ),
        }}
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
        profileSlot={
          <UserMenu
            userName="Alex Morgan"
            userEmail="operations@loopdev.local"
            userRole="Tenant_Admin"
            tenantName="Operation Workspace"
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
        appShellProps={{
          config: { activeOverlay: contextMode ? 'context' : null },
        }}
      >
        <main className="bg-shell-canvas min-h-full">
          <section className="flex-1 p-8">
            <p className="text-text-muted text-xs uppercase tracking-[0.18em]">Operation OS</p>
            <Heading as="h1" size="2xl" weight="semibold" className="text-text-main mt-2">
              Operational overview
            </Heading>
            <p className="text-text-muted mt-3 max-w-2xl text-sm">
              This suite is mounted from its own SuiteConfig using the canonical Showcase shell.
            </p>
          </section>
        </main>
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
      </SuiteRuntime>
    </div>
  );
}
