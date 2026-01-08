'use client';

import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { ModuleWorkspaceProps } from './types';
import { useModuleWorkspace } from './useModuleWorkspace';
import { ScrollArea } from '../../../atoms';

/**
 * @component ModuleWorkspace
 * @description Chasis de Nivel 2 para la ejecución de módulos industriales.
 * Implementa el patrón de 3 paneles (Push/Overlay) y jerarquía de foco.
 * @category Layouts
 * @phase 2
 */
export const ModuleWorkspace: React.FC<ModuleWorkspaceProps> = (props) => {
  const {
    moduleId,
    headerSlot,
    sidebarSlot,
    toolbarSlot,
    inspectorSlot,
    children,
    a11y = {},
    mode = 'normal',
    className = ''
  } = props;

  const {
    isSidebarOpen,
    isInspectorOpen,
    isOverlayMode,
    activeOverlayPanel,
    styleTokens,
    scrollbarClass,
    hasSidebar,
    hasInspector,
    hasToolbar,
    hasHeader,
    requestClosePanel,
    requestOpenPanel,
    closeOnBackdrop,
    closeOnEscape
  } = useModuleWorkspace(props);

  const { 
    moduleLabel = `Module ${moduleId}`,
    sidebarLabel = 'Module Navigation',
    inspectorLabel = 'Item Properties',
    sidebarDialogLabel = 'Module Navigation',
    inspectorDialogLabel = 'Item Properties'
  } = a11y;

  const isImmersive = mode === 'immersive';

  // --- RENDERING: Paneles en modo PUSH (Desktop) ---
  const renderPushPanels = () => (
    <>
      {hasSidebar && (
        <nav 
          aria-label={sidebarLabel} 
          className={`flex-shrink-0 border-r border-border-technical bg-shell-canvas transition-all duration-300 h-full overflow-hidden relative z-[1] ${!isSidebarOpen ? 'w-0' : 'w-[var(--lpd-workspace-sidebar-w)]'}`}
        >
          <ScrollArea visibility="auto" className="h-full">
            {sidebarSlot}
          </ScrollArea>
        </nav>
      )}

      <div className="flex-1 flex flex-col min-w-0 relative z-0">
        {hasToolbar && !isImmersive && (
          <div 
            role="toolbar" 
            style={{ height: 'var(--lpd-workspace-toolbar-h)' }} 
            className="flex-shrink-0 border-b border-border-technical px-4 flex items-center bg-shell-canvas/50 backdrop-blur-sm"
          >
            {toolbarSlot}
          </div>
        )}
        
        <main id="workspace-canvas" role="main" className="flex-1 relative overflow-hidden bg-shell-canvas">
          <ScrollArea visibility="auto" className="h-full">
            <div style={{ padding: 'var(--lpd-workspace-main-padding)' }}>
              {children}
            </div>
          </ScrollArea>
        </main>
      </div>

      {hasInspector && (
        <aside 
          aria-label={inspectorLabel} 
          className={`flex-shrink-0 border-l border-border-technical bg-shell-canvas transition-all duration-300 h-full overflow-hidden relative z-[1] ${!isInspectorOpen ? 'w-0' : 'w-[var(--lpd-workspace-inspector-w)]'}`}
        >
          <ScrollArea visibility="auto" className="h-full">
            {inspectorSlot}
          </ScrollArea>
        </aside>
      )}
    </>
  );

  return (
    <section 
      data-module-id={moduleId}
      style={styleTokens as React.CSSProperties}
      className={`flex flex-col h-full w-full bg-shell-canvas relative animate-in fade-in duration-500 overflow-hidden ${isImmersive ? 'fixed inset-0 z-[100]' : ''} ${className}`}
      aria-label={moduleLabel}
    >
      {/* 1. Header del Módulo */}
      {hasHeader && !isImmersive && (
        <header 
          className="flex-shrink-0 border-b border-border-technical z-[2] bg-shell-canvas/80 backdrop-blur-md" 
          style={{ height: 'var(--lpd-workspace-header-h)' }}
        >
          {headerSlot}
        </header>
      )}

      {/* 2. Área de Contenido Principal */}
      <div className="flex flex-1 h-full min-h-0 relative">
        {isOverlayMode ? (
          <>
            {/* Sidebar as Dialog (Mobile) */}
            <Dialog.Root 
              open={activeOverlayPanel === 'sidebar'} 
              onOpenChange={(open) => {
                if (open) requestOpenPanel('sidebar');
                else requestClosePanel('sidebar', 'backdrop');
              }}
            >
              <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[var(--lpd-workspace-z-backdrop)] animate-in fade-in" />
                <Dialog.Content 
                  className="fixed left-0 inset-y-0 bg-shell-canvas z-[var(--lpd-workspace-z-panel)] w-[var(--lpd-workspace-sidebar-overlay-w)] animate-in slide-in-from-left-full duration-300 border-r border-border-technical shadow-2xl outline-none"
                  onEscapeKeyDown={(e) => {
                    if (!closeOnEscape) e.preventDefault();
                    else requestClosePanel('sidebar', 'escape');
                  }}
                  onPointerDownOutside={(e) => {
                    if (!closeOnBackdrop) e.preventDefault();
                    else requestClosePanel('sidebar', 'backdrop');
                  }}
                >
                  <ScrollArea visibility="auto" className="h-full">
                    {sidebarSlot}
                  </ScrollArea>
                  <Dialog.Title className="sr-only">{sidebarDialogLabel}</Dialog.Title>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
              {hasToolbar && !isImmersive && (
                <div 
                  role="toolbar" 
                  style={{ height: 'var(--lpd-workspace-toolbar-h)' }} 
                  className="flex-shrink-0 border-b border-border-technical px-4 flex items-center bg-shell-canvas/50 backdrop-blur-sm"
                >
                  {toolbarSlot}
                </div>
              )}
              <main role="main" className="flex-1 relative overflow-hidden bg-shell-canvas">
                <ScrollArea visibility="auto" className="h-full">
                  <div style={{ padding: 'var(--lpd-workspace-main-padding)' }}>
                    {children}
                  </div>
                </ScrollArea>
              </main>
            </div>
            
            {/* Inspector as Dialog (Mobile) */}
            <Dialog.Root 
              open={activeOverlayPanel === 'inspector'} 
              onOpenChange={(open) => {
                if (open) requestOpenPanel('inspector');
                else requestClosePanel('inspector', 'backdrop');
              }}
            >
              <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[var(--lpd-workspace-z-backdrop)] animate-in fade-in" />
                <Dialog.Content 
                  className="fixed right-0 inset-y-0 bg-shell-canvas z-[var(--lpd-workspace-z-panel-top)] w-[var(--lpd-workspace-inspector-overlay-w)] animate-in slide-in-from-right-full duration-300 border-l border-border-technical shadow-2xl outline-none"
                  onEscapeKeyDown={(e) => {
                    if (!closeOnEscape) e.preventDefault();
                    else requestClosePanel('inspector', 'escape');
                  }}
                  onPointerDownOutside={(e) => {
                    if (!closeOnBackdrop) e.preventDefault();
                    else requestClosePanel('inspector', 'backdrop');
                  }}
                >
                  <ScrollArea visibility="auto" className="h-full">
                    {inspectorSlot}
                  </ScrollArea>
                  <Dialog.Title className="sr-only">{inspectorDialogLabel}</Dialog.Title>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          </>
        ) : renderPushPanels()}
      </div>
    </section>
  );
};