'use client';

import React from 'react';
import { Menu, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import type { NavRouteRef } from '@loopdev/contracts';
import type { SuiteRuntimeProps } from './types';
import { SuiteShell } from '../SuiteShell';
import { SuiteCanvas } from '../../workspace/SuiteCanvas';
import { ContextPanel } from '../ModuleContextSidebar';
import { ModuleContextPanel } from '../ModuleContextPanel';
import { SUITE_SHELL_MODE_PRESETS } from './presets';

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
  moduleHeaderRenderers,
  moduleToolbarRenderers,
  moduleHeaderVisibility,
  moduleToolbarVisibility,
  moduleContextRenderers,
  moduleContextFooterRenderers,
  moduleContextLabels,
  moduleContextVisibility,
  moduleContextShowFooter,
  moduleContextPanelRenderers,
  moduleContextPanelFooterRenderers,
  moduleContextPanelLabels,
  moduleContextPanelVisibility,
  moduleContextPanelShowFooter,
  moduleContextPanelOnClose,
  moduleContextSidebarCollapsed,
  moduleContextSidebarShowCollapsedTrigger,
  moduleContextSidebarMobileVisibility = 'visible',
  moduleContextSidebarOnCollapsedChange,
  children,
  leftSlot,
  centerSlot,
  rightSlot,
  profileSlot,
  mobileSidebarActions,
  platformHeaderProps,
  onNavigate,
  contextualSidebarAction,
  onNavModeChange,
  appShellProps,
  scrollResetKey,
  canvasProps,
}) => {
  const handleNavigate = (route: NavRouteRef) => {
    appShellProps?.onRequestCloseNav?.('route-change');
    appShellProps?.onRequestCloseContext?.('route-change');
    onNavigate(route);
  };
  const activeModule = config.modules.find((module) => module.moduleId === activeModuleId);
  const shellUsage = activeModule?.shell;
  const canvasMode = shellUsage?.canvasMode ?? canvasProps?.mode;
  const modePreset = SUITE_SHELL_MODE_PRESETS[canvasMode ?? 'overview'];
  const moduleContextLabel = activeModule
    ? (moduleContextLabels?.[activeModule.moduleId] ?? shellUsage?.moduleContextSidebar?.label ?? activeModule.label)
    : 'Module context';
  const moduleContextWidth = activeModule
    ? modePreset.contextSidebarWidth
    : undefined;
  const moduleContextCollapsible = modePreset.contextSidebarHasCollapseControl;
  const moduleContextDefaultCollapsed = activeModule?.shell?.moduleContextSidebar?.defaultCollapsed ?? false;
  const moduleContextCollapsedPresentation = activeModule?.shell?.moduleContextSidebar?.collapsedPresentation ?? 'rail';
  const moduleContextCollapseIcon = resolveShellZoneIcon(activeModule?.shell?.moduleContextSidebar?.collapseIcon);
  const moduleContextExpandIcon = resolveShellZoneIcon(activeModule?.shell?.moduleContextSidebar?.expandIcon);
  const moduleContextPanelLabel = activeModule
    ? (moduleContextPanelLabels?.[activeModule.moduleId] ?? shellUsage?.moduleContextPanel?.label ?? activeModule.label)
    : 'Module context';
  const moduleContextPanelWidth = activeModule
    ? modePreset.contextPanelWidth
    : undefined;
  const moduleContextPanelPresentation = activeModule
    ? modePreset.contextPanelPresentation
    : 'inline';
  const moduleContent = activeModule
    ? (moduleRenderers?.[activeModule.moduleId]?.(activeModule) ?? children)
    : children;
  const moduleHeader = activeModule
    ? moduleHeaderRenderers?.[activeModule.moduleId]?.(activeModule)
    : undefined;
  const moduleToolbar = activeModule
    ? moduleToolbarRenderers?.[activeModule.moduleId]?.(activeModule)
    : undefined;
  const shouldRenderModuleHeader = activeModule
    ? moduleHeader !== undefined && (moduleHeaderVisibility?.[activeModule.moduleId] ?? true)
    : false;
  const shouldRenderModuleToolbar = activeModule
    ? moduleToolbar !== undefined && (moduleToolbarVisibility?.[activeModule.moduleId] ?? true)
    : false;
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
      mobileSidebarActions={mobileSidebarActions}
      platformHeaderProps={platformHeaderProps}
      onNavigate={handleNavigate}
      contextualSidebarAction={contextualSidebarAction}
      onNavModeChange={onNavModeChange}
      appShellProps={appShellProps}
    >
      <SuiteCanvas
        {...canvasProps}
        scrollResetKey={scrollResetKey}
        mode={canvasMode}
        geometryPreset={modePreset.canvasGeometry}
        header={shouldRenderModuleHeader ? moduleHeader : canvasProps?.header}
        toolbar={shouldRenderModuleToolbar ? moduleToolbar : canvasProps?.toolbar}
        asidePresentation={moduleContextPanelPresentation}
        contextAside={
          moduleContextContent ? (
            <ContextPanel
              label={moduleContextLabel}
              visible={moduleContextVisibility?.[activeModule?.moduleId ?? ''] ?? true}
              headerRows={modePreset.contextHeaderRows}
              showFooter={moduleContextShowFooter?.[activeModule?.moduleId ?? '']}
              footerRows={modePreset.contextFooterRows}
              contentScrollable={modePreset.contextContentScrollable}
              width={moduleContextWidth}
              collapsible={moduleContextCollapsible}
              collapsed={moduleContextSidebarCollapsed}
              showCollapsedTrigger={moduleContextSidebarShowCollapsedTrigger}
              collapsedPresentation={moduleContextCollapsedPresentation}
              className={moduleContextSidebarMobileVisibility === 'hidden' ? 'max-lg:hidden' : undefined}
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
              visible={moduleContextPanelVisibility?.[activeModule?.moduleId ?? ''] ?? true}
              headerRows={modePreset.contextHeaderRows}
              showFooter={moduleContextPanelShowFooter?.[activeModule?.moduleId ?? '']}
              footerRows={modePreset.contextFooterRows}
              contentScrollable={modePreset.contextContentScrollable}
              width={moduleContextPanelWidth}
              presentation={moduleContextPanelPresentation}
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
export * from './presets';
