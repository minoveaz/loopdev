'use client';

import React, { useEffect, useState } from 'react';
import { AppShell } from '../AppShell';
import { MobileSuiteNav } from '../../navigation/MobileSuiteNav';
import { PlatformHeader } from '../PlatformHeader';
import { SuiteSidebar } from '../SuiteSidebar';
import { ContextPanel } from '../ModuleContextSidebar';
import { ModuleContextPanel } from '../ModuleContextPanel';
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
  mobileSidebarActions,
  moduleContextSlot,
  moduleContextFooterSlot,
  moduleContextLabel = 'Module context',
  moduleContextWidth = 'standard',
  moduleContextPanelSlot,
  moduleContextPanelFooterSlot,
  moduleContextPanelLabel = 'ModuleContextPanel',
  moduleContextPanelWidth = 'standard',
  platformHeaderProps,
  mobileNavigation,
  onNavigate,
  contextualSidebarAction,
  onNavModeChange,
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
        headerPlacement: 'top',
        isLeftSidebarOpen: navMode === 'expanded',
        navigationMode: navMode === 'hover' ? 'hover' : navMode === 'rail' ? 'rail' : 'expanded',
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
          onNavigate={onNavigate}
          contextualAction={contextualSidebarAction}
          onNavModeChange={onNavModeChange}
          mobileActions={
            mobileSidebarActions || profileSlot ? (
              <div className="flex min-w-0 flex-col items-start gap-2">
                {mobileSidebarActions ? <div className="flex min-w-0 items-center justify-start gap-2">{mobileSidebarActions}</div> : null}
                {profileSlot ? (
                  <div className="border-border-technical flex w-full items-center justify-start border-t pt-2">
                    {profileSlot}
                  </div>
                ) : null}
              </div>
            ) : null
          }
        />
      }
      headerSlot={
        <PlatformHeader
          {...platformHeaderProps}
          hasMobileNavigation={Boolean(appShellProps?.onToggleLeftSidebar || schema)}
          hideProfileOnMobile={Boolean(mobileSidebarActions)}
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
      <div className="flex h-full min-h-0 min-w-0 w-full max-w-full flex-1 overflow-hidden max-lg:flex-col max-lg:overflow-x-hidden max-lg:overflow-y-hidden lg:h-full">
        {moduleContextSlot ? (
          <ContextPanel
            label={moduleContextLabel}
            width={moduleContextWidth}
            footer={moduleContextFooterSlot}
          >
            {moduleContextSlot}
          </ContextPanel>
        ) : null}
        <div className="min-h-0 min-w-0 flex-1">{children}</div>
        {moduleContextPanelSlot ? (
          <ModuleContextPanel
            label={moduleContextPanelLabel}
            width={moduleContextPanelWidth}
            footer={moduleContextPanelFooterSlot}
          >
            {moduleContextPanelSlot}
          </ModuleContextPanel>
        ) : null}
      </div>
    </AppShell>
  );
};

export * from './types';
