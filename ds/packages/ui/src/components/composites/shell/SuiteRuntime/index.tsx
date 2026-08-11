'use client';

import React from 'react';
import type { SuiteRuntimeProps } from './types';
import { SuiteShell } from '../SuiteShell';
import { SuiteCanvas } from '../../workspace/SuiteCanvas';
import { ModuleContextPanel } from '../ModuleContextPanel';

export const SuiteRuntime: React.FC<SuiteRuntimeProps> = ({
  config,
  activeModuleId,
  moduleRenderers,
  moduleContextRenderers,
  moduleContextFooterRenderers,
  moduleContextLabels,
  moduleContextWidths,
  moduleContextPanelRenderers,
  moduleContextPanelFooterRenderers,
  moduleContextPanelLabels,
  moduleContextPanelWidths,
  moduleContextPanelOnClose,
  children,
  leftSlot,
  centerSlot,
  rightSlot,
  profileSlot,
  platformHeaderProps,
  onNavigate,
  onNavModeChange,
  appShellProps,
  canvasProps,
}) => {
  const activeModule =
    config.modules.find((module) => module.moduleId === activeModuleId) ?? config.modules[0];
  const moduleContent = activeModule
    ? (moduleRenderers?.[activeModule.moduleId]?.(activeModule) ?? children)
    : children;
  const moduleContextContent = activeModule
    ? moduleContextRenderers?.[activeModule.moduleId]?.(activeModule)
    : undefined;
  const moduleContextFooterContent = activeModule
    ? moduleContextFooterRenderers?.[activeModule.moduleId]?.(activeModule)
    : undefined;
  const moduleContextPanelContent = activeModule
    ? moduleContextPanelRenderers?.[activeModule.moduleId]?.(activeModule)
    : undefined;
  const moduleContextPanelFooterContent = activeModule
    ? moduleContextPanelFooterRenderers?.[activeModule.moduleId]?.(activeModule)
    : undefined;

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
      moduleContextSlot={moduleContextContent}
      moduleContextFooterSlot={moduleContextFooterContent}
      moduleContextLabel={
        activeModule
          ? (moduleContextLabels?.[activeModule.moduleId] ?? activeModule.label)
          : undefined
      }
      moduleContextWidth={activeModule ? moduleContextWidths?.[activeModule.moduleId] : undefined}
      platformHeaderProps={platformHeaderProps}
      onNavigate={onNavigate}
      onNavModeChange={onNavModeChange}
      appShellProps={appShellProps}
    >
      <SuiteCanvas
        {...canvasProps}
        aside={
          moduleContextPanelContent ? (
            <ModuleContextPanel
              label={
                activeModule
                  ? (moduleContextPanelLabels?.[activeModule.moduleId] ?? activeModule.label)
                  : 'Module context'
              }
              width={activeModule ? moduleContextPanelWidths?.[activeModule.moduleId] : undefined}
              onClose={moduleContextPanelOnClose}
              footer={moduleContextPanelFooterContent}
            >
              {moduleContextPanelContent}
            </ModuleContextPanel>
          ) : (
            canvasProps?.aside
          )
        }
      >
        {moduleContent}
      </SuiteCanvas>
    </SuiteShell>
  );
};

export * from './types';
