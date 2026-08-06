import type { ReactNode } from 'react';
import {
  BlueprintBackground,
  LayoutProvider,
  ModuleWorkspace,
  TenantProvider,
  ToastViewport,
} from '@loopdev/ui';

interface SuiteContentFrameProps {
  children: ReactNode;
  moduleId: string;
  tenant: string;
  activeTenantId: string;
  inspectorOpen?: boolean;
  onInspectorChange?: (open: boolean) => void;
  inspectorWidth?: string;
  forceOverlay?: boolean;
  inspectorSlot?: ReactNode;
  backgroundClassName?: string;
}

export function SuiteContentFrame({
  children,
  moduleId,
  tenant,
  activeTenantId,
  inspectorOpen = false,
  onInspectorChange = () => {},
  inspectorWidth = '360px',
  forceOverlay = true,
  inspectorSlot = null,
  backgroundClassName = 'fixed inset-0 pointer-events-none opacity-40',
}: SuiteContentFrameProps) {
  return (
    <>
      <BlueprintBackground variant="monochrome" intensity="low" className={backgroundClassName} />
      <TenantProvider tenant={tenant}>
        <LayoutProvider>
          <ToastViewport activeTenantId={activeTenantId} />
          <ModuleWorkspace
            moduleId={moduleId}
            inspectorOpen={inspectorOpen}
            onInspectorChange={onInspectorChange}
            config={{ inspectorWidth }}
            overlay={{ force: forceOverlay, closeOnBackdrop: forceOverlay }}
            inspectorSlot={inspectorSlot}
          >
            {children}
          </ModuleWorkspace>
        </LayoutProvider>
      </TenantProvider>
    </>
  );
}
