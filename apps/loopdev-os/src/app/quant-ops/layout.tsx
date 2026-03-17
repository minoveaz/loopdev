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
  LayoutProvider,
  TenantProvider,
  BlueprintBackground,
  ToastViewport
} from '@loopdev/ui';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/hooks/useNotifications';
import { NavMode, LayoutContext } from '@loopdev/contracts';

export default function QuantOpsLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    removeNotification,
    clearAll 
  } = useNotifications([]);
  
  const [navMode, setNavMode] = useState<NavMode>('expanded');
  const [context, setContext] = useState<LayoutContext>('normal');
  const [activeOverlay, setActiveOverlay] = useState<'nav' | 'context' | null>(null);

  // Focus Enforcement: Quant Ops is a high-density suite, usually compact or rail mode
  useEffect(() => {
    // Automically collapse if we are in a deep module
    if (pathname.split('/').length > 2) {
      setNavMode('rail');
    }
  }, [pathname]);

  const currentSuite = QUANT_OPS_SCHEMA.suite;

  const getActiveModule = () => {
    const parts = pathname.split('/');
    if (parts.length <= 2) return 'overview';
    return parts[2];
  };

  const activeModuleId = getActiveModule();

  // Initial access map for MVP
  const accessMap: Record<string, 'enabled' | 'disabled' | 'coming-soon'> = {
    'overview': 'enabled',
    'bot-fleet': 'enabled',
    'strategies': 'enabled',
    'terminal': 'enabled',
    'history': 'coming-soon',
    'risk-control': 'enabled',
    'exchanges': 'enabled'
  };

  return (
    <AppShell
      config={{
        isLeftSidebarOpen: navMode === 'expanded',
        navBehavior: 'auto',
        context: context,
        activeOverlay: activeOverlay,
      }}
      onToggleLeftSidebar={() => setNavMode(prev => prev === 'expanded' ? 'rail' : 'expanded')}
      navSlot={
        <SuiteSidebar 
          schema={QUANT_OPS_SCHEMA}
          navMode={navMode}
          context={context}
          activeModuleId={activeModuleId}
          accessMap={accessMap}
          onExitToOS={() => router.push('/launchpad')}
          onNavigate={(route) => router.push(route.routeId)}
          onToggleNavMode={() => setNavMode(prev => prev === 'expanded' ? 'rail' : 'expanded')}
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
                currentSuite={currentSuite as any}
                availableSuites={AVAILABLE_SUITES_FIXTURES}
                onOpenChange={(open) => setActiveOverlay(open ? 'nav' : null)}
                onSuiteChange={(id) => id === 'os.home' ? router.push('/launchpad') : router.push(`/${id}`)}
              />
              <Divider orientation="vertical" thickness="technical" className="h-4" />
              <ContextPath 
                segments={[
                  { id: 'suite', label: 'Quant Ops', href: '/quant-ops', isActive: true }
                ]} 
              />
            </div>
          }
          centerSlot={<CommandBarTrigger onOpen={() => {}} />}
          rightSlot={
            <div className="flex items-center gap-4">
              <SystemStatus state="operational" id={user?.id} label="TID" />
              <Divider orientation="vertical" thickness="technical" className="h-4" />
              
              <NotificationCenter 
                notifications={notifications}
                unreadCount={unreadCount}
                onOpenChange={(open) => setActiveOverlay(open ? 'context' : null)}
                onMarkAsRead={markAsRead}
                onMarkAllRead={markAllAsRead}
                onRemove={removeNotification}
                onClear={clearAll}
                onViewAll={() => console.log('Open Notifications')}
              />

              <ThemeToggle variant="technical" size="md" />
              <UserMenu 
                userName={user?.email || 'Quant User'}
                userEmail={user?.email}
                userRole="Quant_Architect"
                onOpenChange={(open) => setActiveOverlay(open ? 'context' : null)}
                onLogout={() => signOut()}
              />
            </div>
          }
        />
      }
    >
      <BlueprintBackground variant="monochrome" intensity="low" className="fixed inset-0 pointer-events-none opacity-40" />
      <TenantProvider tenant="loopdev">
        <LayoutProvider>
          <ToastViewport activeTenantId="loopdev" />
          {children}
        </LayoutProvider>
      </TenantProvider>
    </AppShell>
  );
}