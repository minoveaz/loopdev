'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  AppShell,
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
} from '@loopdev/ui';
import { SuiteContentFrame } from '@/components/layout/SuiteContentFrame';
import { SuiteHeaderRight } from '@/components/layout/SuiteHeaderRight';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/hooks/useNotifications';
import { NavMode, LayoutContext } from '@loopdev/contracts';
import { QuantOpsProvider, useQuantOps } from './context';
import { BotInspectorIndustrial } from './components/BotInspector';

function QuantOpsLayoutInner({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const { isInspectorOpen, closeInspector } = useQuantOps();

  const { notifications, unreadCount, markAsRead, markAllAsRead, removeNotification, clearAll } =
    useNotifications([]);

  const [navMode, setNavMode] = useState<NavMode>('expanded');
  const [context] = useState<LayoutContext>('normal');
  const [activeOverlay, setActiveOverlay] = useState<'nav' | 'context' | null>(null);

  useEffect(() => {
    if (pathname.split('/').length > 2) {
      queueMicrotask(() => setNavMode('rail'));
    }
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
                segments={[{ id: 'suite', label: 'Quant Ops', href: '/quant-ops', isActive: true }]}
              />
            </div>
          }
          centerSlot={<CommandBarTrigger onOpen={() => {}} />}
          rightSlot={
            <SuiteHeaderRight
              userName={user?.email || 'Quant User'}
              userEmail={user?.email}
              userRole="Quant_Architect"
              systemLabel="TID"
              userId={user?.id}
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
      <SuiteContentFrame
        moduleId="quant-ops"
        tenant="loopdev"
        activeTenantId="loopdev"
        inspectorOpen={isInspectorOpen}
        onInspectorChange={(open) => !open && closeInspector()}
        inspectorSlot={<BotInspectorIndustrial />}
      >
        {children}
      </SuiteContentFrame>
    </AppShell>
  );
}

export default function QuantOpsLayout({ children }: { children: React.ReactNode }) {
  return (
    <QuantOpsProvider>
      <QuantOpsLayoutInner>{children}</QuantOpsLayoutInner>
    </QuantOpsProvider>
  );
}
