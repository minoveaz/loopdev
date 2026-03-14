import React, { useEffect } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ToastItem } from './index';
import { ToastViewport } from './components';
import { toast, toastStore } from './toastStore';
import { Button } from '../..';
import { CertificationStamp } from '../..';
import { InfraStamp } from '../..';

const meta: Meta<typeof ToastItem> = {
  title: 'Atoms/Primitives/Toast',
  component: ToastItem,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div className="relative w-full min-h-[600px] flex flex-col items-center justify-center p-12 bg-slate-50 dark:bg-transparent">
        {/* Doble Sello de Certificación */}
        <div className="absolute top-8 left-8 flex flex-col gap-4 z-50">
          <CertificationStamp 
            status="certified"
            version="v2.4.1" 
            phase={2} 
            date="2026-01-02" 
            className="scale-90 origin-top-left opacity-90 shadow-2xl rotate-[-2deg]"
          />
          <InfraStamp 
            status="certified"
            version="v1.0.0" 
            security="RLS_OK"
            date="2026-01-02" 
            className="scale-90 origin-top-left opacity-90 shadow-2xl rotate-[2deg]"
          />
        </div>
        <div className="w-full flex items-center justify-center pt-24">
          <Story />
        </div>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ToastItem>;

/**
 * PLAYGROUND INTERACTIVO
 */
export const InteractiveDemo: Story = {
  render: () => {
    const ACTIVE_TENANT = 'loopdev';
    return (
      <div className="flex flex-col items-center gap-8">
        <ToastViewport activeTenantId={ACTIVE_TENANT} position="bottom-right" />
        <div className="flex flex-wrap gap-4 bg-white dark:bg-white/5 p-8 rounded-[2rem] border border-slate-200 dark:border-white/10 shadow-xl">
          <Button onClick={() => toast.show({ tenantId: ACTIVE_TENANT, variant: 'success', title: 'Project Compiled', metadata: 'SYNC_OK' })}>
            Success
          </Button>
          <Button variant="danger" onClick={() => toast.show({ tenantId: ACTIVE_TENANT, variant: 'error', title: 'Gateway Timeout', metadata: 'ERR_504', action: { label: 'Retry', onClick: () => {} } })}>
            Error
          </Button>
          <Button variant="energy" onClick={() => toast.show({ tenantId: ACTIVE_TENANT, variant: 'loading', title: 'Optimizing Layout', metadata: 'IA_PROC' })}>
            AI Process
          </Button>
        </div>
        <p className="text-xs text-slate-400 font-mono italic text-center">Use the buttons to fire real notifications in the bottom-right corner.</p>
      </div>
    );
  }
};

/**
 * ESCENARIO: Información con Acción (Lab Sync)
 */
export const InformationWithAction: Story = {
  args: {
    id: 'info-1',
    variant: 'info',
    title: 'System Update Available',
    description: 'A new version of LoopDev Architect is ready to be installed.',
    metadata: 'v1.2.5',
    action: { label: 'Update Now', onClick: () => {} },
  },
};

/**
 * ESCENARIO: Éxito Estructural
 */
export const SuccessNotification: Story = {
  args: {
    id: 'success-1',
    variant: 'success',
    title: 'Deployment Complete',
    description: 'All services are now running the latest firmware.',
    metadata: 'SYNC_OK',
  },
};

/**
 * ESCENARIO: Advertencia de Alta Visibilidad
 */
export const HighVisWarning: Story = {
  args: {
    id: 'warn-1',
    variant: 'warning',
    title: 'High Latency Detected',
    description: 'AI processing times are higher than usual in your current region.',
    metadata: '900ms',
    action: { label: 'Switch Region', onClick: () => {} },
  },
};

/**
 * ESCENARIO: Error de Recuperación Crítica
 */
export const CriticalRecovery: Story = {
  args: {
    id: 'error-1',
    variant: 'error',
    title: 'Connection Failed',
    description: 'Unable to establish a secure tunnel with the generative gateway.',
    metadata: 'AUTH_FAIL',
    action: { label: 'Retry Authentication', onClick: () => {} },
  },
};

/**
 * ESCENARIO DE ESTRÉS: Massive Events (Story 5)
 */
export const StressMassiveEvents: Story = {
  render: () => {
    const ACTIVE_TENANT = 'loopdev';
    const fireMany = () => {
      for(let i=0; i<10; i++) {
        toast.show({ tenantId: ACTIVE_TENANT, title: `Burst Message ${i}`, variant: 'info' });
      }
    };
    return (
      <>
        <ToastViewport activeTenantId={ACTIVE_TENANT} maxVisible={3} />
        <Button onClick={fireMany} startIcon="dynamic_feed">Fire 10 Toasts Burst</Button>
      </>
    );
  }
};