'use client';

import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { ModuleWorkspaceProps } from './types';
import { useModuleWorkspace } from './useModuleWorkspace';
import { ScrollArea } from '../../../atoms';

/**
 * @component ModuleWorkspace
 * @description Chasis de Nivel 2 para la ejecución de módulos industriales.
 * Implementa el patrón de 3+1 paneles (Sidebar, Flyout, Canvas, Inspector).
 * @category Layouts
 * @phase 3.9
 */
export const ModuleWorkspace: React.FC<ModuleWorkspaceProps> = (props) => {
  const {
    moduleId,
    headerSlot,
    sidebarSlot,
    flyoutSlot,
    toolbarSlot,
    inspectorSlot,
    children,
    a11y = {},
    mode = 'normal',
    className = ''
  } = props;

  const {
    isSidebarOpen,
    isFlyoutOpen,
    isInspectorOpen,
    isOverlayMode,
    activeOverlayPanel,
    styleTokens,
    scrollbarClass,
    hasSidebar,
    hasFlyout,
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
    flyoutLabel = 'Section Context',
    inspectorLabel = 'Item Properties',
    sidebarDialogLabel = 'Module Navigation',
    inspectorDialogLabel = 'Item Properties'
  } = a11y;

  const isImmersive = mode === 'immersive';

  // --- RENDERING: Paneles en modo PUSH (Desktop) ---
  const renderPushPanels = () => (
    <>
      {/* 1. SIDEBAR (Estructura) */}
      {hasSidebar && (
        <nav 
          aria-label={sidebarLabel} 
          className={`flex-shrink-0 border-r border-border-technical bg-shell-canvas transition-all duration-300 h-full overflow-hidden relative z-[2] ${!isSidebarOpen ? 'w-0' : 'w-[var(--lpd-workspace-sidebar-w)]'}`}
        >
          <ScrollArea visibility="auto" className="h-full">
            {sidebarSlot}
          </ScrollArea>
        </nav>
      )}

      {/* 2. FLYOUT (Significado) */}
      {hasFlyout && (
        <aside 
          aria-label={flyoutLabel} 
          className={`flex-shrink-0 border-r border-border-technical bg-shell-canvas transition-all duration-300 h-full overflow-hidden relative z-[1] ${!isFlyoutOpen ? 'w-0 opacity-0' : 'w-[var(--lpd-workspace-flyout-w)] opacity-100'}`}
        >
          <ScrollArea visibility="auto" className="h-full">
            {flyoutSlot}
          </ScrollArea>
        </aside>
      )}

      {/* 3. CANVAS (Definición) */}
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
        
        <main 
          id="workspace-canvas" 
          role="main" 
          className="flex-1 relative overflow-hidden bg-shell-canvas flex flex-col"
          onClick={() => isFlyoutOpen && requestClosePanel('flyout', 'programmatic')}
        >
          <ScrollArea visibility="auto" className="h-full">
            <div style={{ padding: 'var(--lpd-workspace-main-padding)' }}>
              {children}
            </div>
          </ScrollArea>
        </main>
      </div>

      {/* 4. INSPECTOR (Consecuencia) */}
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
      {/* Header del Módulo */}
      {hasHeader && !isImmersive && (
        <header 
          className="flex-shrink-0 border-b border-border-technical z-[10] bg-shell-canvas/80 backdrop-blur-md" 
          style={{ height: 'var(--lpd-workspace-header-h)' }}
        >
          {headerSlot}
        </header>
      )}

      {/* Área de Contenido Principal */}
      <div className="flex flex-1 h-full min-h-0 relative overflow-hidden">
        {isOverlayMode ? (
          <>
            {/* Overlay Panels (Sidebar / Flyout / Inspector) */}
            <Dialog.Root 
              open={activeOverlayPanel !== null} 
              onOpenChange={(open) => {
                if (!open && activeOverlayPanel) requestClosePanel(activeOverlayPanel, 'backdrop');
              }}
            >
              <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[var(--lpd-workspace-z-backdrop)] animate-in fade-in" />
                <Dialog.Content 
                  className={`fixed inset-y-0 bg-shell-canvas z-[var(--lpd-workspace-z-panel-top)] animate-in duration-300 outline-none shadow-2xl ${
                    activeOverlayPanel === 'inspector' 
                      ? 'right-0 border-l border-border-technical slide-in-from-right-full w-[var(--lpd-workspace-inspector-overlay-w)]' 
                      : 'left-0 border-r border-border-technical slide-in-from-left-full w-[var(--lpd-workspace-sidebar-overlay-w)]'
                  }`}
                  onEscapeKeyDown={(e) => {
                    if (!closeOnEscape) e.preventDefault();
                    else if (activeOverlayPanel) requestClosePanel(activeOverlayPanel, 'escape');
                  }}
                  onPointerDownOutside={(e) => {
                    if (!closeOnBackdrop) e.preventDefault();
                    else if (activeOverlayPanel) requestClosePanel(activeOverlayPanel, 'backdrop');
                  }}
                >
                  <ScrollArea visibility="auto" className="h-full">
                    {activeOverlayPanel === 'sidebar' ? sidebarSlot : 
                     activeOverlayPanel === 'flyout' ? flyoutSlot : 
                     inspectorSlot}
                  </ScrollArea>
                  <Dialog.Title className="sr-only">Panel Context</Dialog.Title>
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
          </>
        ) : renderPushPanels()}
      </div>
    </section>
  );
};
