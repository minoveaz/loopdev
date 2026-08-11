'use client';

import React from 'react';
import type { SuiteRuntimeProps } from './types';
import { SuiteShell } from '../SuiteShell';

export const SuiteRuntime: React.FC<SuiteRuntimeProps> = ({
  config,
  activeModuleId,
  moduleRenderers,
  children,
  leftSlot,
  centerSlot,
  rightSlot,
  profileSlot,
  platformHeaderProps,
  onNavigate,
  onNavModeChange,
  appShellProps,
}) => {
  const activeModule =
    config.modules.find((module) => module.moduleId === activeModuleId) ?? config.modules[0];
  const moduleContent = activeModule
    ? (moduleRenderers?.[activeModule.moduleId]?.(activeModule) ?? children)
    : children;

  return (
    <SuiteShell
      schema={config.navigation}
      navMode={config.navMode ?? 'expanded'}
      activeModuleId={activeModuleId}
      accessMap={config.accessMap}
      leftSlot={leftSlot}
      centerSlot={centerSlot}
      rightSlot={rightSlot}
      profileSlot={profileSlot}
      platformHeaderProps={platformHeaderProps}
      onNavigate={onNavigate}
      onNavModeChange={onNavModeChange}
      appShellProps={appShellProps}
    >
      {moduleContent}
    </SuiteShell>
  );
};

export * from './types';
