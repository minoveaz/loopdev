'use client';

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { 
  AppShell, 
  SuiteSidebar, 
  MARKETING_STUDIO_SCHEMA,
  ThemeToggle,
  SystemStatus,
  Text as LpdText,
  Icon,
  UserAvatar,
  SuiteHeader,
  CommandBarTrigger
} from '@loopdev/ui';
import { useAuth } from '@/hooks/useAuth';
import { NavMode, LayoutContext } from '@loopdev/contracts';

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  
  const [navMode, setNavMode] = useState<NavMode>('expanded');
  const [context, setContext] = useState<LayoutContext>('normal');

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
          leftSlot={<div>{/* Placeholder para SuiteSwitcher y ContextPath */}</div>}
          centerSlot={<CommandBarTrigger onOpen={() => {}} />}
          rightSlot={
            <div className="flex items-center gap-4">
              <SystemStatus state="operational" id={user?.id} label="TID" />
              <ThemeToggle variant="technical" size="md" />
              <button 
                onClick={() => signOut()}
                className="p-2 text-slate-400 dark:text-text-muted hover:text-danger dark:hover:text-danger transition-colors rounded-lg hover:bg-danger/5 dark:hover:bg-danger/10"
                title="Sign Out"
              >
                <Icon name="logout" size="sm" />
              </button>
            </div>
          }
        />
      }
    >
      {children}
    </AppShell>
  );
}