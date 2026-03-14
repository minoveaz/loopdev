import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { InfraStamp } from './index';
import { CertificationStamp } from '../..';

const meta: Meta<typeof InfraStamp> = {
  title: 'Atoms/Internal/InfraStamp',
  component: InfraStamp,
  tags: ['autodocs'],
  argTypes: {
    status: {
      control: 'select',
      options: ['certified', 'audit', 'lab'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof InfraStamp>;

export const Certified: Story = {
  args: {
    status: 'certified',
    version: 'v1.0.0',
    security: 'RLS_SECURED',
  },
};

export const InAudit: Story = {
  args: {
    status: 'audit',
    version: 'v0.9.5',
    security: 'REVIEW_PENDING',
  },
};

/**
 * HISTORIA DE DOBLE CERTIFICACIÓN
 */
export const FullCertification: Story = {
  render: () => (
    <div className="p-24 relative bg-slate-50 dark:bg-[#0b0f17] rounded-[3rem] border border-dashed border-slate-300 dark:border-white/10 overflow-hidden flex flex-col items-center gap-12">
       {/* El Sistema siendo auditado */}
       <div className="flex flex-col items-center gap-4 relative z-10">
          <div className="w-32 h-32 bg-primary/5 rounded-full border-2 border-primary border-dashed flex items-center justify-center animate-pulse">
             <span className="material-symbols-outlined text-primary text-5xl">settings_input_component</span>
          </div>
          <span className="text-primary font-mono text-xs uppercase tracking-widest font-black">System Module Audit</span>
       </div>

       {/* Los dos sellos aplicados en diferentes ángulos */}
       <div className="absolute top-8 left-8 flex flex-col gap-4">
          <CertificationStamp status="certified" version="v1.2.0" phase={2} className="rotate-[-2deg] shadow-blue-500/10" />
          <InfraStamp status="certified" version="v1.0.0" className="rotate-[3deg] shadow-yellow-500/10" />
       </div>

       <p className="text-[10px] text-slate-400 font-mono italic">
         Dual-layer verification protocol: FRONT + INFRA
       </p>
    </div>
  ),
};