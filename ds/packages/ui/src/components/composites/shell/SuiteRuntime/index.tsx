'use client';

import React from 'react';
import { Menu, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import type { SuiteRuntimeProps } from './types';
import { SuiteShell } from '../SuiteShell';
import { SuiteCanvas } from '../../workspace/SuiteCanvas';
import { ContextPanel } from '../ModuleContextSidebar';
import { ModuleContextPanel } from '../ModuleContextPanel';

const shellZoneIcons = {
  menu: Menu,
  'panel-left-close': PanelLeftClose,
  'panel-left-open': PanelLeftOpen,
} as const;

const resolveShellZoneIcon = (name?: keyof typeof shellZoneIcons) => {
  const Icon = name ? shellZoneIcons[name] : undefined;
  return Icon ? <Icon aria-hidden="true" size={16} /> : undefined;
};

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
  moduleContextSidebarCollapsed,
  moduleContextSidebarShowCollapsedTrigger,
  moduleContextSidebarOnCollapsedChange,
  children,
  leftSlot,
  centerSlot,
  rightSlot,
  profileSlot,
  platformHeaderProps,
  onNavigate,
  contextualSidebarAction,
  onNavModeChange,
  appShellProps,
  canvasProps,
}) => {
  const activeModule = config.modules.find((module) => module.moduleId === activeModuleId);
  const shellUsage = activeModule?.shell;
  const canvasMode = shellUsage?.canvasMode ?? canvasProps?.mode;
  const moduleContextLabel = activeModule
    ? (moduleContextLabels?.[activeModule.moduleId] ?? shellUsage?.moduleContextSidebar?.label ?? activeModule.label)
    : 'Module context';
  const moduleContextWidth = activeModule
    ? (moduleContextWidths?.[activeModule.moduleId] ?? shellUsage?.moduleContextSidebar?.width)
    : undefined;
  const moduleContextCollapsible = activeModule?.shell?.moduleContextSidebar?.collapsible ?? false;
  const moduleContextDefaultCollapsed = activeModule?.shell?.moduleContextSidebar?.defaultCollapsed ?? false;
  const moduleContextCollapsedPresentation = activeModule?.shell?.moduleContextSidebar?.collapsedPresentation ?? 'rail';
  const moduleContextCollapseIcon = resolveShellZoneIcon(activeModule?.shell?.moduleContextSidebar?.collapseIcon);
  const moduleContextExpandIcon = resolveShellZoneIcon(activeModule?.shell?.moduleContextSidebar?.expandIcon);
  const moduleContextPanelLabel = activeModule
    ? (moduleContextPanelLabels?.[activeModule.moduleId] ?? shellUsage?.moduleContextPanel?.label ?? activeModule.label)
    : 'Module context';
  const moduleContextPanelWidth = activeModule
    ? (moduleContextPanelWidths?.[activeModule.moduleId] ?? shellUsage?.moduleContextPanel?.width)
    : undefined;
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
      platformHeaderProps={platformHeaderProps}
      onNavigate={onNavigate}
      contextualSidebarAction={contextualSidebarAction}
      onNavModeChange={onNavModeChange}
      appShellProps={appShellProps}
    >
      <SuiteCanvas
        {...canvasProps}
        mode={canvasMode}
        contextAside={
          moduleContextContent ? (
            <ContextPanel
              label={moduleContextLabel}
              width={moduleContextWidth}
              collapsible={moduleContextCollapsible}
              collapsed={moduleContextSidebarCollapsed}
              showCollapsedTrigger={moduleContextSidebarShowCollapsedTrigger}
              collapsedPresentation={moduleContextCollapsedPresentation}
              onCollapsedChange={moduleContextSidebarOnCollapsedChange}
              defaultCollapsed={moduleContextDefaultCollapsed}
              collapseIcon={moduleContextCollapseIcon}
              expandIcon={moduleContextExpandIcon}
              footer={moduleContextFooterContent}
            >
              {moduleContextContent}
            </ContextPanel>
          ) : undefined
        }
        aside={
          moduleContextPanelContent ? (
            <ModuleContextPanel
              label={moduleContextPanelLabel}
              width={moduleContextPanelWidth}
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
