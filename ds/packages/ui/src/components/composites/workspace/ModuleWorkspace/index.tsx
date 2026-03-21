'use client';

import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { ModuleWorkspaceProps } from './types';
import { useModuleWorkspace } from './useModuleWorkspace';
import { ScrollArea } from '../../../atoms';
import { cn } from '../../../../helpers/cn';

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
    zIndices,
    hasSidebar,
    hasFlyout,
    hasInspector,
    hasToolbar,
    hasHeader,
    requestClosePanel,
    closeOnBackdrop,
    closeOnEscape
  } = useModuleWorkspace(props);

  const { 
    moduleLabel = `Module ${moduleId}`,
    sidebarLabel = 'Module Navigation',
    flyoutLabel = 'Section Context',
    inspectorLabel = 'Item Properties',
  } = a11y;

  const isImmersive = mode === 'immersive';

  // --- RENDERING: Paneles en modo PUSH (Desktop) ---
  const renderPushPanels = () => (
    <>
      {/* 1. SIDEBAR */}
      {hasSidebar && (
        <nav 
          aria-label={sidebarLabel} 
          className={cn("flex-shrink-0 border-r border-border-technical bg-shell-canvas transition-all duration-300 h-full overflow-hidden relative z-[2]", !isSidebarOpen ? 'w-0' : 'w-[var(--lpd-workspace-sidebar-w)]')}
        >
          <ScrollArea visibility="auto" className="h-full">
            {sidebarSlot}
          </ScrollArea>
        </nav>
      )}

      {/* 2. FLYOUT */}
      {hasFlyout && (
        <aside 
          aria-label={flyoutLabel} 
          className={cn("flex-shrink-0 border-r border-border-technical bg-shell-canvas transition-all duration-300 h-full overflow-hidden relative z-[1]", !isFlyoutOpen ? 'w-0 opacity-0' : 'w-[var(--lpd-workspace-flyout-w)] opacity-100')}
        >
          <ScrollArea visibility="auto" className="h-full">
            {flyoutSlot}
          </ScrollArea>
        </aside>
      )}

      {/* 3. CANVAS */}
      <div className="flex-1 flex flex-col min-w-0 relative z-0">
        {hasToolbar && !isImmersive && (
          <div role="toolbar" style={{ height: 'var(--lpd-workspace-toolbar-h)' }} className="flex-shrink-0 border-b border-border-technical px-4 flex items-center bg-shell-canvas/50 backdrop-blur-sm">
            {toolbarSlot}
          </div>
        )}
        
        <main id="workspace-canvas" role="main" className="flex-1 relative overflow-hidden bg-shell-canvas flex flex-col">
          <ScrollArea visibility="auto" className="h-full">
            <div style={{ padding: 'var(--lpd-workspace-main-padding)' }}>
              {children}
            </div>
          </ScrollArea>
        </main>
      </div>

      {/* 4. INSPECTOR */}
      {hasInspector && (
        <aside 
          aria-label={inspectorLabel} 
          className={cn("flex-shrink-0 border-l border-border-technical bg-shell-canvas transition-all duration-300 h-full overflow-hidden relative z-[1]", !isInspectorOpen ? 'w-0' : 'w-[var(--lpd-workspace-inspector-w)]')}
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
      className={cn("flex flex-col h-full w-full bg-shell-canvas relative animate-in fade-in duration-500 overflow-hidden", isImmersive && "fixed inset-0 z-[100]", className)}
      aria-label={moduleLabel}
    >
      {/* Header del Módulo */}
      {hasHeader && !isImmersive && (
        <header className="flex-shrink-0 border-b border-border-technical z-[10] bg-shell-canvas/80 backdrop-blur-md" style={{ height: 'var(--lpd-workspace-header-h)' }}>
          {headerSlot}
        </header>
      )}

      <div className="flex flex-1 h-full min-h-0 relative overflow-hidden">
        {isOverlayMode ? (
          <>
            {/* Solo renderizamos el Dialog si hay un panel activo real */}
            {activeOverlayPanel !== null && (
              <Dialog.Root 
                open={true} 
                onOpenChange={(open) => {
                  if (!open) requestClosePanel(activeOverlayPanel, 'backdrop');
                }}
              >
                <Dialog.Portal>
                  <Dialog.Overlay 
                    style={{ zIndex: zIndices.backdrop }}
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in" 
                  />
                  <Dialog.Content 
                    style={{ zIndex: zIndices.panelTop }}
                    className={cn(
                      "fixed inset-y-0 bg-shell-canvas outline-none shadow-2xl border-l border-border-technical animate-in duration-300",
                      activeOverlayPanel === 'inspector' ? 'right-0 w-[var(--lpd-workspace-inspector-overlay-w)] slide-in-from-right-full' : 'left-0 w-[var(--lpd-workspace-sidebar-overlay-w)] slide-in-from-left-full'
                    )}
                    onEscapeKeyDown={(e) => !closeOnEscape && e.preventDefault()}
                    onPointerDownOutside={(e) => !closeOnBackdrop && e.preventDefault()}
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
            )}

            <div className="flex-1 flex flex-col min-w-0">
              {hasToolbar && !isImmersive && (
                <div role="toolbar" style={{ height: 'var(--lpd-workspace-toolbar-h)' }} className="flex-shrink-0 border-b border-border-technical px-4 flex items-center bg-shell-canvas/50 backdrop-blur-sm">
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
