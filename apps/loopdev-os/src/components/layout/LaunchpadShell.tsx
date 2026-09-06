'use client';

import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import {
  AppShell,
  BrandLogo,
  PlatformHeader,
  SuiteSidebar,
  SystemStatus,
  ThemeToggle,
  UserMenu,
} from '@loopdev/ui';
import type { AccessMap, NavMode, NavRouteRef } from '@loopdev/contracts';

import { ContextSwitcher } from './ContextSwitcher';
import { ContextPanelHost } from './ContextPanelHost';
import { PLATFORM_TOOL_NAVIGATION_SCHEMA } from '@/core/platform/platformTools';

interface LaunchpadShellProps {
  children: ReactNode;
  userEmail?: string;
  userId?: string;
  isPlatformAdministrator: boolean;
  signOut: () => void;
  platformToolsAvailable: boolean;
  platformAccessMap: AccessMap;
  navMode: Exclude<NavMode, 'hidden'>;
  onNavModeChange: (mode: Exclude<NavMode, 'hidden'>) => void;
  onNavigate: (route: NavRouteRef) => void;
}

export function LaunchpadShell({
  children,
  userEmail,
  userId,
  isPlatformAdministrator,
  signOut,
  platformToolsAvailable,
  platformAccessMap,
  navMode,
  onNavModeChange,
  onNavigate,
}: LaunchpadShellProps) {
  const displayName = userEmail?.split('@')[0] ?? 'User';
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 1024px)');
    const updateViewport = () => setIsMobileViewport(mediaQuery.matches);
    updateViewport();
    mediaQuery.addEventListener('change', updateViewport);
    return () => mediaQuery.removeEventListener('change', updateViewport);
  }, []);

  return (
    <AppShell
      config={{
        headerPlacement: 'top',
        navBehavior: 'auto',
        navigationMode: navMode,
        isLeftSidebarOpen: navMode === 'expanded',
        isRightSidebarOpen: isProfileOpen,
        activeOverlay: isProfileOpen ? 'context' : null,
      }}
      onToggleLeftSidebar={() => onNavModeChange(navMode === 'expanded' ? 'rail' : 'expanded')}
      onRequestCloseContext={() => setIsProfileOpen(false)}
      contextSlot={
        isProfileOpen ? (
          <ContextPanelHost
            mode="profile"
            notifications={[]}
            unreadCount={0}
            onClose={() => setIsProfileOpen(false)}
          />
        ) : undefined
      }
      navSlot={
        platformToolsAvailable ? (
          <SuiteSidebar
            schema={PLATFORM_TOOL_NAVIGATION_SCHEMA}
            navMode={navMode}
            mobileMode={isMobileViewport}
            showSuiteHome={false}
            headerSlot={
              <span className="text-text-muted text-xs font-semibold uppercase tracking-[0.18em]">
                Platform tools
              </span>
            }
            activeModuleId={undefined}
            accessMap={platformAccessMap}
            onNavigate={onNavigate}
            onNavModeChange={onNavModeChange}
          />
        ) : undefined
      }
      headerSlot={
        <PlatformHeader
          hasMobileNavigation={platformToolsAvailable}
          identitySlot={<BrandLogo variant="full" size="md" />}
          contextSlot={<ContextSwitcher />}
          environmentSlot={<SystemStatus state="operational" id={userId} label="ID" />}
          controlsSlot={<ThemeToggle variant="technical" size="md" />}
          profileSlot={
            <UserMenu
              userName={displayName}
              userEmail={userEmail}
              userRole={isPlatformAdministrator ? 'Platform Owner' : 'Member'}
              onAvatarClick={() => setIsProfileOpen((prev) => !prev)}
              onProfileClick={() => setIsProfileOpen(true)}
              onLogout={signOut}
            />
          }
        />
      }
    >
      {children}
    </AppShell>
  );
}
