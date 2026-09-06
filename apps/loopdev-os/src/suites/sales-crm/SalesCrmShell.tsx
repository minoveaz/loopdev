'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  BrandLogo,
  CommandBarTrigger,
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
import { SALES_CRM_SUITE_CONFIG } from './config';
import { LeadContextPanel, LeadsRuntimeProvider, useLeadsRuntime } from './leads';
import {
  resolveSalesCrmActiveModuleId,
  resolveSalesCrmCanvasMode,
  shouldShowLeadContextPanel,
} from './shellRouting';
import {
  CommunicationsInboxContext,
  CommunicationsInboxFooter,
  CommunicationsInboxList,
  CommunicationsInboxModuleHeader,
  CommunicationsInboxProvider,
  CommunicationsInboxWidget,
  useInbox,
} from './communications/CommunicationsInboxWidget';
import type { InboxMobileSurface } from './communications/types';
import {
  COMMUNICATIONS_INBOX_ACTOR_LABEL,
  COMMUNICATIONS_INBOX_COPY,
  COMMUNICATIONS_INBOX_FORMATTERS,
} from './communications/copy';
import {
  communicationsInboxApiDataSource,
  createFixtureInboxDataSource,
} from './communications/inbox-data-source';
import { COMMUNICATIONS_INBOX_MODEL } from './communications/inbox.fixture';

const COMMUNICATIONS_INBOX_DATA_SOURCE =
  process.env.NEXT_PUBLIC_E2E_AUTH_BYPASS === 'true'
    ? createFixtureInboxDataSource(COMMUNICATIONS_INBOX_ACTOR_LABEL)
    : communicationsInboxApiDataSource;
const USE_COMMUNICATIONS_INBOX_FIXTURE = process.env.NEXT_PUBLIC_E2E_AUTH_BYPASS === 'true';

function CommunicationsInboxRuntime({
  children,
}: {
  children: (surface: InboxMobileSurface) => ReactNode;
}) {
  const { mobileSurface } = useInbox();
  return children(mobileSurface);
}

export function SalesCrmShell({ children }: { children: ReactNode }) {
  return (
    <LeadsRuntimeProvider>
      <SalesCrmRuntime>{children}</SalesCrmRuntime>
    </LeadsRuntimeProvider>
  );
}

function SalesCrmRuntime({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { selectedLead, clearSelectedLead } = useLeadsRuntime();
  const [contextMode, setContextMode] = useState<PlatformContextPanelMode | null>(null);
  const [navMode, setNavMode] = useState<Exclude<NavMode, 'hidden'>>('expanded');
  const {
    organizations,
    activeOrganization,
    activeOrganizationId,
    setActiveOrganizationId,
    isLoading: isLoadingOrganizations,
  } = useOrganization();
  const activeModuleId = resolveSalesCrmActiveModuleId(SALES_CRM_SUITE_CONFIG.modules, pathname);
  const canvasMode = resolveSalesCrmCanvasMode(pathname);

  return (
    <CommunicationsInboxProvider
      organizationId={activeOrganizationId}
      initialModel={USE_COMMUNICATIONS_INBOX_FIXTURE ? COMMUNICATIONS_INBOX_MODEL : undefined}
      dataSource={COMMUNICATIONS_INBOX_DATA_SOURCE}
      copy={COMMUNICATIONS_INBOX_COPY}
      formatters={COMMUNICATIONS_INBOX_FORMATTERS}
      actorLabel={COMMUNICATIONS_INBOX_ACTOR_LABEL}
    >
      <CommunicationsInboxRuntime>
        {(mobileSurface) => (
          <SuiteRuntime
            config={{ ...SALES_CRM_SUITE_CONFIG, navMode }}
            activeModuleId={activeModuleId}
            moduleRenderers={{
              communications: () => <CommunicationsInboxWidget />,
            }}
            moduleHeaderRenderers={{
              communications: () => <CommunicationsInboxModuleHeader />,
            }}
            moduleContextRenderers={{
              communications: () => <CommunicationsInboxList />,
            }}
            moduleContextFooterRenderers={{
              communications: () => <CommunicationsInboxFooter />,
            }}
            moduleContextShowFooter={{ communications: true }}
            moduleContextPanelRenderers={{
              communications: () => <CommunicationsInboxContext />,
              leads: () =>
                shouldShowLeadContextPanel(pathname) && selectedLead ? <LeadContextPanel /> : null,
            }}
            moduleContextPanelLabels={{
              communications: 'CRM context',
              leads: 'Detalle del Lead',
            }}
            moduleContextPanelOnClose={clearSelectedLead}
            moduleContextSidebarMobileVisibility={mobileSurface === 'list' ? 'visible' : 'hidden'}
            moduleContextPanelVisibility={{ communications: mobileSurface === 'context' }}
            leftSlot={<BrandLogo variant="isotype" size="sm" className="shrink-0" />}
            centerSlot={
              <CommandBarTrigger
                className="w-full"
                placeholder="Search CRM"
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
                    organizations={organizations.map(({ id, name }) => ({
                      id,
                      name,
                      planLabel: 'PRO',
                    }))}
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
                    currentSuite={SALES_CRM_SUITE_CONFIG.identity}
                    availableSuites={[SALES_CRM_SUITE_CONFIG.identity]}
                    showIcon={false}
                    onSuiteChange={() => router.push('/sales-crm')}
                  />
                </div>
              ),
            }}
            profileSlot={
              <UserMenu
                userName="CRM User"
                userEmail="crm@loopdev.local"
                userRole="CRM Member"
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
            canvasProps={{ mode: canvasMode }}
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
                  unreadCount={
                    NOTIFICATION_CENTER_FIXTURES.recent.filter(({ read }) => !read).length
                  }
                  onClose={() => setContextMode(null)}
                />
              ) : undefined,
            }}
            onNavigate={(route: NavRouteRef) => router.push(route.routeId)}
          >
            {children}
          </SuiteRuntime>
        )}
      </CommunicationsInboxRuntime>
    </CommunicationsInboxProvider>
  );
}
