'use client';

import React, { useEffect, useState } from 'react';
import { AppShell } from '../AppShell';
import { MobileSuiteNav } from '../../navigation/MobileSuiteNav';
import { PlatformHeader } from '../PlatformHeader';
import { SuiteSidebar } from '../SuiteSidebar';
import type { SuiteShellProps } from './types';

export const SuiteShell: React.FC<SuiteShellProps> = ({
  schema,
  navMode,
  activeModuleId,
  accessMap,
  telemetry,
  context = 'normal',
  leftSlot,
  centerSlot,
  rightSlot,
  profileSlot,
  platformHeaderProps,
  mobileNavigation,
  onExitToOS,
  onNavigate,
  onToggleNavMode,
  onAction,
  isHeaderInert = false,
  appShellProps,
  children,
}) => {
  const [isMobileViewport, setIsMobileViewport] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 1023px)');
    const updateViewport = () => setIsMobileViewport(mediaQuery.matches);
    updateViewport();
    mediaQuery.addEventListener('change', updateViewport);
    return () => mediaQuery.removeEventListener('change', updateViewport);
  }, []);

  return (
    <AppShell
      {...appShellProps}
      config={{
        ...appShellProps?.config,
        isLeftSidebarOpen: navMode === 'expanded',
        navBehavior: navMode === 'hidden' ? 'hidden' : 'auto',
        context: context,
      }}
      navSlot={
        <SuiteSidebar
          schema={schema}
          navMode={navMode}
          mobileMode={isMobileViewport}
          context={context}
          activeModuleId={activeModuleId}
          accessMap={accessMap}
          telemetry={telemetry}
          profileSlot={profileSlot}
          onExitToOS={onExitToOS}
          onNavigate={onNavigate}
          onToggleNavMode={onToggleNavMode}
          onAction={onAction}
        />
      }
      headerSlot={
        <PlatformHeader
          {...platformHeaderProps}
          identitySlot={leftSlot}
          searchSlot={platformHeaderProps?.searchSlot ?? centerSlot}
          controlsSlot={platformHeaderProps?.controlsSlot ?? rightSlot}
          profileSlot={platformHeaderProps?.profileSlot ?? profileSlot}
          context={context}
          isInert={isHeaderInert}
        />
      }
      mobileBottomSlot={
        mobileNavigation
          ? (openMobileNav) => (
              <MobileSuiteNav
                items={mobileNavigation.items}
                onNavigate={(item) => {
                  if (!item.path) {
                    mobileNavigation.onOpenNavigation?.();
                    openMobileNav();
                    return;
                  }
                  mobileNavigation.onNavigate(item);
                }}
              />
            )
          : undefined
      }
    >
      {children}
    </AppShell>
  );
};

export * from './types';
