'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  MARKETING_STUDIO_SCHEMA,
  ThemeToggle,
  UserAvatar,
  CommandBarTrigger,
  UserMenu,
  NotificationCenter,
  NOTIFICATION_CENTER_FIXTURES,
  LayoutProvider,
  SuiteShell,
  SuiteSwitcher,
  TenantProvider,
  AVAILABLE_SUITES_FIXTURES,
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

  const [navMode, setNavMode] = useState<NavMode>('hover');
  const [context] = useState<LayoutContext>('normal');
  const [activeOverlay, setActiveOverlay] = useState<'nav' | 'context' | null>(null);
  useEffect(() => {
    queueMicrotask(() =>
      setNavMode(
        getSuiteNavMode(pathname, {
          railPrefixes: [
            '/marketing-studio/brand-hub',
            '/marketing-studio/campaigns',
            '/marketing-studio/dam',
          ],
        }),
      ),
    );
  }, [pathname]);

  const currentSuite = MARKETING_STUDIO_SCHEMA.suite;

  const getActiveModule = () => {
    if (pathname.includes('/brand-hub')) return 'brand-hub';
    if (pathname.startsWith('/marketing-studio/campaigns')) return 'campaign-orchestrator';
    if (pathname.startsWith('/marketing-studio/content')) return 'content-engine';
    if (pathname.startsWith('/marketing-studio/dam')) return 'asset-manager';
    return 'overview';
  };

  const activeModuleId = getActiveModule();

  const accessMap: Record<string, ModuleAccessState> = {
    overview: 'enabled',
    'brand-hub': 'enabled',
    'campaign-orchestrator': 'enabled',
    'content-engine': 'disabled',
    'asset-manager': 'enabled',
  };

  const handleToggleLeftSidebar = () =>
    setNavMode((prev) => (prev === 'expanded' ? 'rail' : 'expanded'));

  return (
    <SuitePermissionGuard permission="marketing.read">
      <SuiteShell
        schema={MARKETING_STUDIO_SCHEMA}
        navMode={navMode}
        onNavModeChange={setNavMode}
        activeModuleId={activeModuleId}
        accessMap={accessMap}
        context={context}
        onNavigate={(route) => router.push(route.routeId)}
        leftSlot={
          <SuiteSwitcher
            currentSuite={currentSuite}
            availableSuites={AVAILABLE_SUITES_FIXTURES}
            onOpenChange={(open) => setActiveOverlay(open ? 'nav' : null)}
            onSuiteChange={(suiteId) => {
              if (suiteId === 'os.home') {
                router.push('/launchpad');
                return;
              }

              const suite = AVAILABLE_SUITES_FIXTURES.find((item) => item.suiteId === suiteId);
              router.push(suite?.route.routeId ?? '/launchpad');
            }}
          />
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
        profileSlot={
          <UserAvatar
            name={user?.email || 'User'}
            size={navMode === 'rail' ? 'md' : 'sm'}
            withStatus
            status="online"
          />
        }
        mobileNavigation={{
          items: [
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
          ],
          onNavigate: (item) => {
            if (item.path) router.push(item.path);
          },
        }}
        isHeaderInert={activeOverlay !== null}
        appShellProps={{
          config: {
            isLeftSidebarOpen: navMode === 'expanded',
            activeOverlay,
          },
          onToggleLeftSidebar: handleToggleLeftSidebar,
        }}
      >
        <TenantProvider tenant="loopdev">
          <LayoutProvider>{children}</LayoutProvider>
        </TenantProvider>
      </SuiteShell>
    </SuitePermissionGuard>
  );
}
