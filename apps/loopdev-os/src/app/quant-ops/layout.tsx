'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  AppShell,
  BlueprintBackground,
  LayoutProvider,
  ModuleHeader,
  ModuleWorkspace,
  SuiteSidebar,
  QUANT_OPS_SCHEMA,
  ThemeToggle,
  SystemStatus,
  UserAvatar,
  SuiteHeader,
  CommandBarTrigger,
  SuiteSwitcher,
  ContextPath,
  AVAILABLE_SUITES_FIXTURES,
  UserMenu,
  NotificationCenter,
  Divider,
  TenantProvider,
  ToastViewport,
} from '@loopdev/ui';
import { SuiteHeaderRight } from '@/components/layout/SuiteHeaderRight';
import { useAuth } from '@/hooks/useAuth';
import { useOrganization } from '@/hooks/useOrganization';
import { SuitePermissionGuard } from '@/components/layout/SuitePermissionGuard';
import { useNotifications } from '@/hooks/useNotifications';
import { NavMode, LayoutContext } from '@loopdev/contracts';
import { QuantOpsProvider, useQuantOps } from './context';
import { BotInspectorIndustrial } from './components/BotInspector';
import { getSuiteNavMode } from '@/components/layout/suiteNavMode';

function QuantOpsLayoutInner({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const { activeOrganization } = useOrganization();
  const { isInspectorOpen, closeInspector } = useQuantOps();

  const { notifications, unreadCount, markAsRead, markAllAsRead, removeNotification, clearAll } =
    useNotifications([]);

  const [navMode, setNavMode] = useState<NavMode>('expanded');
  const [context] = useState<LayoutContext>('normal');
  const [activeOverlay, setActiveOverlay] = useState<'nav' | 'context' | null>(null);

  useEffect(() => {
    queueMicrotask(() => setNavMode(getSuiteNavMode(pathname, { railPrefixes: ['/quant-ops/bot-fleet', '/quant-ops/strategies', '/quant-ops/terminal', '/quant-ops/history', '/quant-ops/risk-control', '/quant-ops/exchanges'] })));
  }, [pathname]);

  const currentSuite = QUANT_OPS_SCHEMA.suite;

  const getActiveModule = () => {
    const parts = pathname.split('/');
    if (parts.length <= 2) return 'overview';
    return parts[2];
  };

  const activeModuleId = getActiveModule();

  const accessMap: Record<string, 'enabled' | 'disabled' | 'coming-soon'> = {
    overview: 'enabled',
    'bot-fleet': 'enabled',
    strategies: 'enabled',
    terminal: 'enabled',
    history: 'enabled',
    'risk-control': 'enabled',
    exchanges: 'enabled',
  };

  return (
    <SuitePermissionGuard permission="quant.read">
    <AppShell
      config={{
        isLeftSidebarOpen: navMode === 'expanded',
        isRightSidebarOpen: false,
        navBehavior: 'auto',
        context: context,
        activeOverlay: activeOverlay,
      }}
      onToggleLeftSidebar={() => setNavMode((prev) => (prev === 'expanded' ? 'rail' : 'expanded'))}
      navSlot={
        <SuiteSidebar
          schema={QUANT_OPS_SCHEMA}
          navMode={navMode}
          context={context}
          activeModuleId={activeModuleId}
          accessMap={accessMap}
          onExitToOS={() => router.push('/launchpad')}
          onNavigate={(route) => router.push(route.routeId)}
          onToggleNavMode={() => setNavMode((prev) => (prev === 'expanded' ? 'rail' : 'expanded'))}
          profileSlot={
            <UserAvatar
              name={user?.email || 'Quant User'}
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
            <div className="flex items-center gap-4">
              <SuiteSwitcher
                currentSuite={currentSuite}
                availableSuites={AVAILABLE_SUITES_FIXTURES}
                onOpenChange={(open) => setActiveOverlay(open ? 'nav' : null)}
                onSuiteChange={(id) =>
                  id === 'os.home' ? router.push('/launchpad') : router.push(`/${id}`)
                }
              />
              <Divider orientation="vertical" thickness="technical" className="h-4" />
              <ContextPath
                segments={[
                  { id: 'workspace', label: activeOrganization?.name ?? 'Workspace', isActive: true },
                ]}
              />
            </div>
          }
          centerSlot={<CommandBarTrigger onOpen={() => {}} />}
          rightSlot={
            <SuiteHeaderRight
              userName={user?.email || 'Quant User'}
              userEmail={user?.email}
              userRole="Quant_Architect"
              notifications={notifications}
              unreadCount={unreadCount}
              onOpenChange={(open) => setActiveOverlay(open ? 'context' : null)}
              onMarkAsRead={markAsRead}
              onMarkAllAsRead={markAllAsRead}
              onRemove={removeNotification}
              onClear={clearAll}
              onLogout={() => signOut()}
              onViewAll={() => console.log('Open Notifications')}
            />
          }
        />
      }
    >
      <BlueprintBackground variant="monochrome" intensity="low" className="fixed inset-0 pointer-events-none opacity-40" />
      <TenantProvider tenant="loopdev">
        <LayoutProvider>
          <ToastViewport activeTenantId="loopdev" />
          <ModuleWorkspace
            moduleId="quant-ops"
            inspectorOpen={isInspectorOpen}
            onInspectorChange={(open) => !open && closeInspector()}
            inspectorSlot={<BotInspectorIndustrial />}
            headerSlot={
              <ModuleHeader
                segments={[{ id: 'suite', label: 'Quant Ops', href: '/quant-ops', isActive: true }]}
              />
            }
          >
            {children}
          </ModuleWorkspace>
        </LayoutProvider>
      </TenantProvider>
    </AppShell>
    </SuitePermissionGuard>
  );
}

export default function QuantOpsLayout({ children }: { children: React.ReactNode }) {
  return (
    <QuantOpsProvider>
      <QuantOpsLayoutInner>{children}</QuantOpsLayoutInner>
    </QuantOpsProvider>
  );
}
