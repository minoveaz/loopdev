import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { useTenant } from '../../providers/tenant-provider';

const TenantInspector = () => {
  const { tenant, subbrand } = useTenant();
  
  return (
    <div className="p-8 bg-[var(--lpd-color-bg-surface)] border border-[var(--lpd-color-brand-outline)] rounded-2xl shadow-xl max-w-md w-full space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">Context_Inspector</h3>
        <div className="flex gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/40" />
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-[var(--lpd-color-brand-primary)] uppercase">Active Tenant:</span>
          <div className="p-3 bg-slate-100 dark:bg-white/5 rounded-lg border border-[var(--lpd-color-brand-outline)] font-mono text-lg font-black tracking-tight">
            {tenant}
          </div>
        </div>

        <div className="space-y-1">
          <span className="text-[10px] font-bold text-[var(--lpd-color-brand-energy)] uppercase">Active Sub-brand:</span>
          <div className="p-3 bg-slate-100 dark:bg-white/5 rounded-lg border border-[var(--lpd-color-brand-outline)] font-mono text-lg font-black tracking-tight">
            {subbrand}
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-[var(--lpd-color-brand-outline)] flex justify-between items-center">
        <span className="text-[9px] font-mono text-slate-400">SYSTEM_DNA_VALIDATED</span>
        <span className="text-[9px] font-mono text-slate-400">{"{ ok }"}</span>
      </div>
    </div>
  );
};

const meta: Meta = {
  title: 'Architecture/Providers/TenantProvider',
  component: TenantInspector,
};

export default meta;
type Story = StoryObj;

export const ActiveContext: Story = {
  render: () => <TenantInspector />,
};
