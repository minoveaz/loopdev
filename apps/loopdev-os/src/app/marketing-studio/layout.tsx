'use client';

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { 
  AppShell, 
  SuiteSidebar, 
  MARKETING_STUDIO_SCHEMA,
  ThemeToggle,
  SystemStatus,
  LpdText,
  Icon,
  UserAvatar,
  SuiteHeader,
  CommandBarTrigger,
  SuiteSwitcher,
  ContextPath,
  AVAILABLE_SUITES_FIXTURES,
  UserMenu,
  NotificationCenter,
  NOTIFICATION_CENTER_FIXTURES,
  Divider,
  QuickActionMenu,
  QUICK_ACTION_FIXTURES
} from '@loopdev/ui';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/hooks/useNotifications';
import { NavMode, LayoutContext } from '@loopdev/contracts';

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
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
  } = useNotifications(NOTIFICATION_CENTER_FIXTURES.recent);
  
  const [navMode, setNavMode] = useState<NavMode>('expanded');
  const [context, setContext] = useState<LayoutContext>('normal');
  const [activeOverlay, setActiveOverlay] = useState<'nav' | 'context' | null>(null);

  const currentSuite = MARKETING_STUDIO_SCHEMA.suite;

  const getActiveModule = () => {
    if (pathname.startsWith('/marketing-studio/brands')) return 'brand-hub';
    if (pathname.startsWith('/marketing-studio/content')) return 'content-engine';
    if (pathname.startsWith('/marketing-studio/dam')) return 'dam';
    return 'overview';
  };

  const activeModuleId = getActiveModule();

  const accessMap = {
    'overview': 'enabled',
    'brand-hub': 'enabled',
    'content-engine': 'disabled',
    'dam': 'coming-soon'
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
          schema={MARKETING_STUDIO_SCHEMA}
          navMode={navMode}
          context={context}
          activeModuleId={activeModuleId}
          accessMap={accessMap}
          onExitToOS={() => router.push('/launchpad')}
          onNavigate={(route) => router.push(route.routeId)}
          onToggleNavMode={() => setNavMode(prev => prev === 'expanded' ? 'rail' : 'expanded')}
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
                  { id: 'suite', label: 'Marketing', href: '/marketing-studio' },
                  { 
                    id: 'module', 
                    label: activeModuleId === 'brand-hub' ? 'Brand Hub' : 
                           activeModuleId === 'content-engine' ? 'Content Engine' :
                           activeModuleId === 'dam' ? 'Digital Assets' : 'Dashboard',
                    isActive: true 
                  }
                ]} 
              />
            </div>
          }
          centerSlot={<CommandBarTrigger onOpen={() => {}} />}
          rightSlot={
            <div className="flex items-center gap-4">
              <QuickActionMenu 
                groups={QUICK_ACTION_FIXTURES.marketing} 
                onOpenChange={(open) => setActiveOverlay(open ? 'context' : null)}
              />
              <Divider orientation="vertical" thickness="technical" className="h-4" />

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
                onViewAll={() => console.log('Open SuiteContextPanel')}
              />

              <ThemeToggle variant="technical" size="md" />
              <UserMenu 
                userName={user?.email || 'User'}
                userEmail={user?.email}
                userRole="Tenant_Admin"
                onOpenChange={(open) => setActiveOverlay(open ? 'context' : null)}
                onLogout={() => signOut()}
              />
            </div>
          }
        />
      }
    >
      {children}
    </AppShell>
  );
}