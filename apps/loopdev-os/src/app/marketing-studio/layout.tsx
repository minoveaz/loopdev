'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  AppShell,
  Button,
  BrandLogo,
  SuiteSidebar,
  MARKETING_STUDIO_SCHEMA,
  ThemeToggle,
  SystemStatus,
  UserAvatar,
  SuiteHeader,
  CommandBarTrigger,
  UserMenu,
  MobileSuiteNav,
  NotificationCenter,
  NOTIFICATION_CENTER_FIXTURES,
  LayoutProvider,
  TenantProvider,
} from '@loopdev/ui';
import { useAuth } from '@/hooks/useAuth';
import { useOrganization } from '@/hooks/useOrganization';
import { useNotifications } from '@/hooks/useNotifications';
import { NavMode, LayoutContext, ModuleAccessState } from '@loopdev/contracts';
import { SuitePermissionGuard } from '@/components/layout/SuitePermissionGuard';
import { getSuiteNavMode } from '@/components/layout/suiteNavMode';

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const { activeOrganization } = useOrganization();
  const { notifications, unreadCount, markAsRead, markAllAsRead, removeNotification, clearAll } =
    useNotifications(NOTIFICATION_CENTER_FIXTURES.recent);

  const [navMode, setNavMode] = useState<NavMode>('expanded');
  const [context] = useState<LayoutContext>('normal');
  const [activeOverlay, setActiveOverlay] = useState<'nav' | 'context' | null>(null);
  const [isMobileViewport, setIsMobileViewport] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 1023px)');
    const updateViewport = () => setIsMobileViewport(mediaQuery.matches);
    updateViewport();
    mediaQuery.addEventListener('change', updateViewport);
    return () => mediaQuery.removeEventListener('change', updateViewport);
  }, []);

  useEffect(() => {
    queueMicrotask(() =>
      setNavMode(
        getSuiteNavMode(pathname, {
          railPrefixes: ['/marketing-studio/brand-hub', '/marketing-studio/campaigns'],
        }),
      ),
    );
  }, [pathname]);

  const currentSuite = MARKETING_STUDIO_SCHEMA.suite;

  const getActiveModule = () => {
    if (pathname.includes('/brand-hub')) return 'brand-hub';
    if (pathname.startsWith('/marketing-studio/campaigns')) return 'campaign-orchestrator';
    if (pathname.startsWith('/marketing-studio/content')) return 'content-engine';
    if (pathname.startsWith('/marketing-studio/dam')) return 'dam';
    return 'overview';
  };

  const activeModuleId = getActiveModule();

  const accessMap: Record<string, ModuleAccessState> = {
    overview: 'enabled',
    'brand-hub': 'enabled',
    'campaign-orchestrator': 'enabled',
    'content-engine': 'disabled',
    dam: 'coming-soon',
  };

  const handleToggleLeftSidebar = () =>
    setNavMode((prev) => (prev === 'expanded' ? 'rail' : 'expanded'));

  return (
    <SuitePermissionGuard permission="marketing.read">
      <AppShell
        config={{
          isLeftSidebarOpen: navMode === 'expanded',
          navBehavior: 'auto',
          context: context,
          activeOverlay: activeOverlay,
        }}
        onToggleLeftSidebar={handleToggleLeftSidebar}
        navSlot={
          <SuiteSidebar
            schema={MARKETING_STUDIO_SCHEMA}
            navMode={navMode}
            mobileMode={isMobileViewport}
            context={context}
            activeModuleId={activeModuleId}
            accessMap={accessMap}
            onExitToOS={() => router.push('/launchpad')}
            onNavigate={(route) => router.push(route.routeId)}
            onToggleNavMode={() =>
              setNavMode((prev) => (prev === 'expanded' ? 'rail' : 'expanded'))
            }
            profileSlot={
              <UserAvatar
                name={user?.email || 'User'}
                size={navMode === 'rail' ? 'md' : 'sm'}
                withStatus
                status="online"
              />
            }
          />
        }
        headerSlot={
          <SuiteHeader
            isInert={activeOverlay !== null}
            leftSlot={
              <div className="flex min-w-0 items-center gap-3">
                <BrandLogo variant="isotype" size="sm" className="shrink-0 md:hidden" />
                <span className="truncate text-sm font-semibold text-text-main dark:text-white">
                  {currentSuite.suiteName}
                </span>
              </div>
            }
            centerSlot={<CommandBarTrigger onOpen={() => {}} />}
            rightSlot={
              <div className="flex items-center gap-4">
                <NotificationCenter
                  notifications={notifications}
                  unreadCount={unreadCount}
                  onOpenChange={(open) => setActiveOverlay(open ? 'context' : null)}
                  onMarkAsRead={markAsRead}
                  onMarkAllRead={markAllAsRead}
                  onRemove={removeNotification}
                  onClear={clearAll}
                  onViewAll={() => console.log('Open SuiteContextPanel')}
                />

                <ThemeToggle variant="technical" size="md" />
                <UserMenu
                  userName={user?.email || 'User'}
                  userEmail={user?.email}
                  userRole="Tenant_Admin"
                  tenantName={activeOrganization?.name ?? 'Workspace'}
                  onOpenChange={(open) => setActiveOverlay(open ? 'context' : null)}
                  onLogout={() => signOut()}
                />
              </div>
            }
          />
        }
        mobileBottomSlot={(openMobileNav) => (
          <MobileSuiteNav
            items={[
              {
                label: 'Marketing',
                icon: 'campaign',
                path: '/marketing-studio',
                active: pathname === '/marketing-studio',
              },
              {
                label: 'Marcas',
                icon: 'verified',
                path: '/marketing-studio/brand-hub',
                active: pathname.startsWith('/marketing-studio/brand-hub'),
              },
              {
                label: 'Campañas',
                icon: 'calendar_month',
                path: '/marketing-studio/campaigns',
                active: pathname.startsWith('/marketing-studio/campaigns'),
              },
              { label: 'Más', icon: 'more_horiz' },
            ]}
            onNavigate={(item) => (item.path ? router.push(item.path) : openMobileNav())}
          />
        )}
      >
        <TenantProvider tenant="loopdev">
          <LayoutProvider>{children}</LayoutProvider>
        </TenantProvider>
      </AppShell>
    </SuitePermissionGuard>
  );
}
