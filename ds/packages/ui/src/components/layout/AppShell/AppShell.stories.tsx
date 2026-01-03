import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { AppShell } from './index';
import { LayoutContext, LayoutDensity } from './types';
import { QualityShield } from '../../atoms/QualityShield';
import { CertificationStamp } from '../../atoms/CertificationStamp';
import { Icon } from '../../atoms/Icon';

/**
 * MOCKS DE CONTENIDO INDUSTRIAL
 */
const MockNav = ({ collapsed }: { collapsed?: boolean }) => (
  <div className="p-4 space-y-8 overflow-x-hidden">
    <div className={`flex items-center gap-3 px-2 shrink-0 ${collapsed && 'justify-center px-0'}`}>
      <div className="w-8 h-8 shrink-0 bg-[var(--lpd-color-brand-primary)] rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">L</div>
      {!collapsed && <span className="font-bold tracking-tight text-[var(--lpd-color-text-base)]">loop.dev</span>}
    </div>
    <nav className="space-y-1">
      {[
        { icon: 'grid_view', label: 'Brand Hub' }, 
        { icon: 'search', label: 'Search' }, 
        { icon: 'favorite', label: 'Favorites' },
        { icon: 'settings', label: 'Settings' }
      ].map((item, i) => (
        <div key={i} className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-white/5 text-slate-500 dark:text-slate-400 ${collapsed && 'justify-center px-0'}`}>
          <Icon name={item.icon} size="md" className={i === 0 ? 'text-[var(--lpd-color-brand-primary)]' : ''} />
          {!collapsed && <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>}
        </div>
      ))}
    </nav>
  </div>
);

const MockHeader = ({ 
  leftOpen, 
  rightOpen, 
  onToggleLeft, 
  onToggleRight,
  mode = 'NORMAL' 
}: any) => (
  <div className="flex items-center justify-between w-full h-full relative z-[60]">
    <div className="flex items-center gap-2">
      <button 
        onClick={onToggleLeft} 
        className={`p-2 hover:bg-white/5 rounded-lg transition-all ${leftOpen ? 'text-[var(--lpd-color-brand-primary)] bg-blue-500/10' : 'text-slate-500'}`}
      >
        <Icon name={leftOpen ? 'menu_open' : 'menu'} size="md" />
      </button>
      <div className="h-4 w-px bg-[var(--lpd-color-brand-outline)] mx-2 hidden sm:block"></div>
      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest hidden sm:block">
        {mode} MODE / <span className="text-[var(--lpd-color-text-base)]">Industrial OS</span>
      </div>
    </div>

    <div className="flex items-center gap-2">
      <button className="p-2 hover:bg-white/5 rounded-lg text-slate-500">
        <Icon name="notifications" size="md" />
      </button>
      <div className="h-4 w-px bg-[var(--lpd-color-brand-outline)] mx-2"></div>
      <button 
        onClick={onToggleRight} 
        className={`p-2 hover:bg-white/5 rounded-lg transition-all ${rightOpen ? 'text-[var(--lpd-color-brand-primary)] bg-blue-500/10' : 'text-slate-500'}`}
      >
        <Icon name={rightOpen ? 'dock_to_left' : 'dock_to_right'} size="md" />
      </button>
      <div className="w-8 h-8 bg-slate-200 dark:bg-slate-800 rounded-full ml-2 border border-[var(--lpd-color-brand-outline)]"></div>
    </div>
  </div>
);

const IndustrialContent = () => (
  <div className="space-y-8 pb-32">
    <header className="space-y-2">
      <div className="text-[var(--lpd-color-brand-primary)] font-mono text-[10px] font-bold uppercase tracking-[0.2em]">System / Brand_Hub / Assets</div>
      <h1 className="text-3xl font-bold tracking-tight text-[var(--lpd-color-text-base)]">Industrial Assets</h1>
    </header>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-48 bg-[var(--lpd-color-bg-surface)] dark:bg-white/5 rounded-2xl border border-[var(--lpd-color-brand-outline)] p-6 hover:border-blue-500/40 transition-all group cursor-pointer shadow-sm">
          <div className="w-10 h-10 bg-[var(--lpd-color-bg-subtle)] dark:bg-slate-800 rounded-lg mb-4 flex items-center justify-center">
            <Icon name="grid_view" size="md" className="text-[var(--lpd-color-brand-primary)]" />
          </div>
          <div className="h-4 w-3/4 bg-slate-200 dark:bg-white/10 rounded mb-2"></div>
          <div className="h-3 w-1/2 bg-slate-100 dark:bg-white/5 rounded"></div>
        </div>
      ))}
    </div>
  </div>
);

/**
 * COMPONENTE INTERACTIVO PARA STORYBOOK
 */
const InteractiveShell = (args: any) => {
  const [leftOpen, setLeftOpen] = useState(args.config?.isLeftSidebarOpen ?? true);
  const [rightOpen, setRightOpen] = useState(args.config?.isRightSidebarOpen ?? true);
  
  return (
    <AppShell 
      {...args}
      navSlot={args.navSlot || <MockNav collapsed={!leftOpen} />}
      headerSlot={
        args.headerSlot || (
          <MockHeader 
            leftOpen={leftOpen} 
            rightOpen={rightOpen} 
            onToggleLeft={() => setLeftOpen(!leftOpen)}
            onToggleRight={() => setRightOpen(!rightOpen)}
            mode={args.config?.context?.toUpperCase() || 'NORMAL'}
          />
        )
      }
      config={{ ...args.config, isLeftSidebarOpen: leftOpen, isRightSidebarOpen: rightOpen }}
      onToggleLeftSidebar={() => setLeftOpen(!leftOpen)}
      onToggleRightSidebar={() => setRightOpen(!rightOpen)}
      onRequestCloseNav={() => setLeftOpen(false)}
      onRequestCloseContext={() => setRightOpen(false)}
    >
      {args.children || <IndustrialContent />}
    </AppShell>
  );
};

const meta: Meta<typeof AppShell> = {
  title: 'Layouts/AppShell',
  component: AppShell,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    config: {
      control: 'object',
    },
  },
  render: (args) => <InteractiveShell {...args} />,
  decorators: [
    (Story) => (
      <div className="w-full h-screen relative">
        <CertificationStamp 
          status="certified" 
          version="v1.1.0" 
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

const BASE_ARGS = {
  contextSlot: <div className="p-6 space-y-4 font-mono"><div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Context Panel</div><div className="h-32 bg-slate-100 dark:bg-slate-900 rounded-xl border border-[var(--lpd-color-brand-outline)] flex items-center justify-center text-slate-400 text-[10px]">PREVIEW_LAYER</div></div>,
  footerSlot: <div className="text-[10px] text-slate-400 dark:text-slate-600 uppercase tracking-widest font-mono flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>v1.2.0-beta // System Operational</div>,
  config: {
    context: 'normal' as LayoutContext,
    density: 'comfortable' as LayoutDensity,
    showScrollbars: true,
  },
};

export const IndustrialOS: Story = {
  args: {
    ...BASE_ARGS
  }
};

/**
 * ESCENARIOS DE ESTRÉS INDUSTRIAL (v1.1)
 */

export const NarrativeOverload: Story = {
  args: {
    ...BASE_ARGS,
    children: (
      <div className="space-y-8">
        <h1 className="text-3xl font-bold tracking-tight text-[var(--lpd-color-text-base)]">Scroll Resilience Test</h1>
        {Array.from({ length: 20 }).map((_, i) => (
          <p key={i} className="text-slate-400 leading-relaxed max-w-2xl text-[var(--lpd-color-text-muted)]">
            In an industrial SaaS environment, the layout must withstand high-density data. The scroll isolation ensures that the user never loses the navigation context, regardless of how long this descriptive text becomes. This paragraph is here to test the vertical scroll resilience of the main canvas.
          </p>
        ))}
      </div>
    ),
  },
};

export const InspectorSaturation: Story = {
  args: {
    ...BASE_ARGS,
    contextSlot: (
      <div className="p-6 space-y-6">
        <h3 className="text-xs font-black uppercase tracking-tighter text-[var(--lpd-color-text-base)] opacity-40">AI_Inspector_Log</h3>
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

export const SidebarSaturation: Story = {
  args: {
    ...BASE_ARGS,
    navSlot: (
      <div className="p-4 space-y-4">
        <div className="font-black text-[10px] text-slate-400 uppercase tracking-widest border-b border-white/5 pb-2">Technical_Inventory</div>
        {Array.from({ length: 30 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-2 text-slate-500 hover:text-white cursor-pointer transition-colors group">
            <div className="w-4 h-4 bg-slate-800 rounded group-hover:bg-[var(--lpd-color-brand-primary)] transition-colors" />
            <span className="text-[10px] font-mono uppercase tracking-tighter">Module_Asset_Node_0x0{i}</span>
          </div>
        ))}
      </div>
    )
  }
};

export const DeepNavigation: Story = {
  args: {
    ...BASE_ARGS,
    headerSlot: (
      <div className="flex items-center px-2 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2 text-[10px] font-mono whitespace-nowrap">
          <span className="text-[var(--lpd-color-brand-primary)]">root</span>
          <span className="text-slate-600">/</span>
          <span className="text-[var(--lpd-color-brand-primary)]">marketing_studio</span>
          <span className="text-slate-600">/</span>
          <span className="text-[var(--lpd-color-brand-primary)]">campaign_manager</span>
          <span className="text-slate-600">/</span>
          <span className="text-[var(--lpd-color-brand-primary)]">q4_seasonal_promos</span>
          <span className="text-slate-600">/</span>
          <span className="text-[var(--lpd-color-brand-primary)]">assets</span>
          <span className="text-slate-600">/</span>
          <span className="text-[var(--lpd-color-text-base)] font-black uppercase">banner_hero_v2_final.png</span>
        </div>
      </div>
    )
  }
};

export const ToastSpam: Story = {
  args: {
    ...BASE_ARGS,
    overlaySlot: (
      <div className="absolute bottom-8 right-8 flex flex-col gap-2 max-w-xs w-full pointer-events-auto">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="p-4 bg-slate-900 border border-white/10 rounded-lg shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <div className="flex-1">
                <p className="text-[10px] font-bold text-white uppercase">System_Sync_0{i}</p>
                <p className="text-[10px] text-slate-400">Data cluster successfully verified.</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }
};

export const EmptyWorkspace: Story = {
  args: {
    ...BASE_ARGS,
    children: (
      <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40">
        <Icon name="deployed_code" size="xl" />
        <div className="space-y-1">
          <p className="text-xs font-black uppercase tracking-widest text-[var(--lpd-color-text-base)]">No_Active_Module</p>
          <p className="text-[10px] font-mono text-[var(--lpd-color-text-muted)]">Select a node from the global navigation to begin architecture.</p>
        </div>
      </div>
    )
  }
};

export const GlobalBanner: Story = {
  args: {
    ...BASE_ARGS,
    bannerSlot: (
      <div className="w-full bg-[var(--lpd-color-status-warning)] py-2 px-6 flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-900">
          <Icon name="warning" size="sm" />
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
    ...BASE_ARGS,
    config: {
      ...BASE_ARGS.config,
      isLeftSidebarOpen: false,
      isRightSidebarOpen: false,
    },
  },
};