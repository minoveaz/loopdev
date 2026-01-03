import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { AppShell } from './index';
import { QualityShield } from '../../atoms/QualityShield';
import { CertificationStamp } from '../../atoms/CertificationStamp';
import { Icon } from '../../atoms/Icon';

const meta: Meta<typeof AppShell> = {
  title: 'Layouts/AppShell',
  component: AppShell,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div className="w-full h-screen relative">
        <CertificationStamp 
          status="certified" 
          version="v1.0.0" 
          phase="1" 
          className="fixed top-4 left-4 z-[100]" 
        />
        <Story />
        <QualityShield metrics={{
          unit: { label: 'Unit', status: 'pass', value: '100% US' },
          a11y: { label: 'A11y', status: 'pass', value: 'WCAG AA' },
          visual: { label: 'Visual', status: 'pass', value: 'HYBRID' },
        }} />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof AppShell>;

// MOCKS DE SLOTS INDUSTRIALES
const MockNav = () => (
  <div className="p-4 space-y-4">
    <div className="flex items-center gap-2 px-2 text-[var(--lpd-color-brand-primary)] font-bold mb-8">
      <div className="w-8 h-8 bg-[var(--lpd-color-brand-primary)] rounded flex items-center justify-center text-white">L</div>
      <span>loop.dev</span>
    </div>
    {[1, 2, 3, 4, 5].map(i => (
      <div key={i} className="flex items-center gap-3 p-2 text-slate-400 hover:text-white cursor-pointer transition-colors">
        <div className="w-5 h-5 bg-slate-800 rounded"></div>
        <span className="text-sm font-medium uppercase tracking-widest text-[10px]">Module_0{i}</span>
      </div>
    ))}
  </div>
);

const MockHeader = () => (
  <div className="flex items-center justify-between w-full px-2">
    <div className="flex items-center gap-4">
      <Icon name="menu" size="sm" className="text-slate-400" />
      <span className="text-xs font-bold uppercase tracking-widest text-slate-500">System / <span className="text-white">Brand_Hub</span></span>
    </div>
    <div className="flex items-center gap-4">
      <Icon name="search" size="sm" className="text-slate-400" />
      <div className="w-8 h-8 bg-slate-800 rounded-full border border-white/10"></div>
    </div>
  </div>
);

export const IndustrialOS: Story = {
  args: {
    navSlot: <MockNav />,
    headerSlot: <MockHeader />,
    contextSlot: <div className="p-6 text-slate-500 font-mono text-[10px] uppercase">Context Panel Active</div>,
    children: (
      <div className="space-y-8">
        <h1 className="text-3xl font-bold tracking-tight">System Dashboard</h1>
        <div className="grid grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-40 bg-white/5 border border-white/5 rounded-2xl p-6">
              <div className="w-10 h-10 bg-slate-800 rounded-lg mb-4"></div>
              <div className="h-4 w-3/4 bg-white/10 rounded mb-2"></div>
              <div className="h-3 w-1/2 bg-white/5 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    ),
    config: {
      context: 'normal',
      isLeftSidebarOpen: true,
      isRightSidebarOpen: true,
    },
  },
};

/**
 * ESCENARIOS DE ESTRÉS
 */
export const NarrativeOverload: Story = {
  args: {
    ...IndustrialOS.args,
    children: (
      <div className="space-y-8">
        <h1 className="text-3xl font-bold tracking-tight">Scroll Resilience Test</h1>
        {Array.from({ length: 20 }).map((_, i) => (
          <p key={i} className="text-slate-400 leading-relaxed max-w-2xl">
            In an industrial SaaS environment, the layout must withstand high-density data. The scroll isolation ensures that the user never loses the navigation context, regardless of how long this descriptive text becomes. This paragraph is here to test the vertical scroll resilience of the main canvas.
          </p>
        ))}
      </div>
    ),
  },
};

export const InspectorSaturation: Story = {
  args: {
    ...IndustrialOS.args,
    contextSlot: (
      <div className="p-6 space-y-6">
        <h3 className="text-xs font-black uppercase tracking-tighter text-white opacity-40">AI_Inspector_Log</h3>
        {Array.from({ length: 30 }).map((_, i) => (
          <div key={i} className="p-3 bg-white/5 border border-white/5 rounded-lg space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[8px] font-mono text-emerald-500">EVENT_0{i}</span>
              <span className="text-[8px] font-mono text-white/20">12:45:0{i}</span>
            </div>
            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 w-[70%]" />
            </div>
          </div>
        ))}
      </div>
    ),
  },
};

export const GlobalBanner: Story = {
  args: {
    ...IndustrialOS.args,
    bannerSlot: (
      <div className="w-full bg-[var(--lpd-color-status-warning)] py-2 px-6 flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-900">
          <Icon name="warning" size="xs" />
          <span className="text-[10px] font-black uppercase tracking-widest">System_Maintenance: Scheduled for 03:00 UTC</span>
        </div>
        <button className="text-[8px] font-bold underline uppercase tracking-tighter text-slate-900">Dismiss</button>
      </div>
    ),
  },
};

export const MobileReality: Story = {
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
  args: {
    ...IndustrialOS.args,
    config: {
      isLeftSidebarOpen: false,
      isRightSidebarOpen: false,
    },
  },
};
