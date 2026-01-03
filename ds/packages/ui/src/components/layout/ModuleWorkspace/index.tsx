import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { ModuleWorkspaceProps } from './types';
import { useModuleWorkspace } from './useModuleWorkspace';

/**
 * @component ModuleWorkspace (Industrial v1.4.0 - CERTIFIED)
 * @description Chasis de Nivel 2 con Focus Trap industrial (Radix).
 */
export const ModuleWorkspace: React.FC<ModuleWorkspaceProps> = (props) => {
  const {
    moduleId, headerSlot, sidebarSlot, toolbarSlot, inspectorSlot, children,
    a11y = {}, overlay
  } = props;

  const {
    isSidebarOpen, isInspectorOpen, isOverlayMode, styleTokens,
    scrollbarClass, hasSidebar, hasInspector, hasToolbar, hasHeader,
    requestClosePanel, setInternalSidebarOpen, setInternalInspectorOpen
  } = useModuleWorkspace(props);

  const { moduleLabel = `Module ${moduleId}` } = a11y;

  const sidebarTrigger = <div />;
  const inspectorTrigger = <div />;
  
  const renderPushPanels = () => (
    <>
      {hasSidebar && (
        <nav aria-label={a11y.sidebarLabel} className={`flex-shrink-0 border-r border-border-subtle bg-surface-light dark:bg-surface-dark transition-all duration-300 h-full overflow-y-auto ${scrollbarClass} relative z-[1] ${!isSidebarOpen ? 'w-0 invisible' : 'w-[var(--lpd-workspace-sidebar-w)]'}`}>
          {sidebarSlot}
        </nav>
      )}
      <div className="flex-1 flex flex-col min-w-0 relative z-0">
        {hasToolbar && <div role="toolbar" style={{ height: 'var(--lpd-workspace-toolbar-h)' }} className="flex-shrink-0 border-b border-border-subtle px-4 flex items-center bg-surface-light/50 dark:bg-surface-dark/20">{toolbarSlot}</div>}
        <main role="main" className={`flex-1 overflow-y-auto ${scrollbarClass} relative`}>
          <div style={{ padding: 'var(--lpd-workspace-main-padding)' }}>{children}</div>
        </main>
      </div>
      {hasInspector && (
        <aside aria-label={a11y.inspectorLabel} className={`flex-shrink-0 border-l border-border-subtle bg-surface-light dark:bg-surface-dark transition-all duration-300 h-full overflow-y-auto ${scrollbarClass} relative z-[1] ${!isInspectorOpen ? 'w-0 invisible' : 'w-[var(--lpd-workspace-inspector-w)]'}`}>
          {inspectorSlot}
        </aside>
      )}
    </>
  );

  return (
    <section 
      data-module-id={moduleId}
      style={styleTokens as React.CSSProperties}
      className="flex flex-col h-full w-full bg-transparent relative animate-in fade-in duration-500 overflow-hidden"
      aria-label={moduleLabel}
    >
      {hasHeader && (
        <header className="flex-shrink-0 border-b border-border-subtle z-[2] bg-surface-light/80 dark:bg-surface-dark/80 backdrop-blur-md" style={{ height: 'var(--lpd-workspace-header-h)' }}>
          {headerSlot}
        </header>
      )}

      <div className="flex flex-1 h-full min-h-0 relative">
        {isOverlayMode ? (
          <>
            {/* Sidebar as Dialog */}
            <Dialog.Root open={isSidebarOpen} onOpenChange={(open) => !open && requestClosePanel('sidebar', 'programmatic')}>
              <Dialog.Portal>
                <Dialog.Overlay 
                  data-testid="workspace-backdrop"
                  className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[var(--lpd-workspace-z-backdrop)] animate-in fade-in" 
                />
                <Dialog.Content 
                  data-testid="sidebar-dialog"
                  className="fixed left-0 inset-y-0 bg-surface-light dark:bg-surface-dark z-[var(--lpd-workspace-z-panel)] w-[var(--lpd-workspace-sidebar-overlay-w)] animate-in slide-in-from-left-full duration-300"
                  onEscapeKeyDown={() => requestClosePanel('sidebar', 'escape')}
                  onPointerDownOutside={(e) => {
                    if (overlay?.closeOnBackdrop === false) e.preventDefault();
                    else requestClosePanel('sidebar', 'backdrop');
                  }}
                >
                  <div className={`h-full overflow-y-auto ${scrollbarClass}`}>{sidebarSlot}</div>
                  <Dialog.Title className="sr-only">{a11y.sidebarDialogLabel || 'Main Menu'}</Dialog.Title>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>

            {/* Main Content (inert when overlays are open) */}
            <div className="flex-1 flex flex-col min-w-0">
              {hasToolbar && <div role="toolbar" style={{ height: 'var(--lpd-workspace-toolbar-h)' }} className="flex-shrink-0 border-b border-border-subtle px-4 flex items-center bg-surface-light/50 dark:bg-surface-dark/20">{toolbarSlot}</div>}
              <main role="main" className={`flex-1 overflow-y-auto ${scrollbarClass}`}>
                <div style={{ padding: 'var(--lpd-workspace-main-padding)' }}>{children}</div>
              </main>
            </div>
            
            {/* Inspector as Dialog */}
            <Dialog.Root open={isInspectorOpen} onOpenChange={(open) => !open && requestClosePanel('inspector', 'programmatic')}>
              <Dialog.Portal>
                <Dialog.Overlay 
                  data-testid="workspace-backdrop"
                  className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[var(--lpd-workspace-z-backdrop)] animate-in fade-in" 
                />
                <Dialog.Content 
                  data-testid="inspector-dialog"
                  className="fixed right-0 inset-y-0 bg-surface-light dark:bg-surface-dark z-[var(--lpd-workspace-z-panel-top)] w-[var(--lpd-workspace-inspector-overlay-w)] animate-in slide-in-from-right-full duration-300"
                  onEscapeKeyDown={() => requestClosePanel('inspector', 'escape')}
                  onPointerDownOutside={(e) => {
                    if (overlay?.closeOnBackdrop === false) e.preventDefault();
                    else requestClosePanel('inspector', 'backdrop');
                  }}
                >

                  <div className={`h-full overflow-y-auto ${scrollbarClass}`}>{inspectorSlot}</div>
                  <Dialog.Title className="sr-only">{a11y.inspectorDialogLabel || 'Details Panel'}</Dialog.Title>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          </>
        ) : renderPushPanels()}
      </div>
    </section>
  );
};