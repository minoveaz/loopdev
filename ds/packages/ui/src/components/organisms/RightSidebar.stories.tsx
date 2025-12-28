import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { RightSidebar } from './RightSidebar';
import { Stack, Inline, Box } from '@/components/layout';
import { Button } from '@/components/atoms/button';
import { Activity, Sparkles, MessageSquare, Star, Search } from 'lucide-react';

const meta: Meta<typeof RightSidebar> = {
  title: '🏗️ Organisms/Navigation/RightSidebar',
  component: RightSidebar,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof RightSidebar>;

export const DesignerEdition: Story = {
  render: () => {
    const [activeTab, setActiveTab] = React.useState('activity');

    return (
      <div className="flex h-screen bg-slate-200 items-center justify-center p-0 overflow-hidden font-sans">
        {/* Background Placeholder */}
        <div className="flex-1 flex flex-col items-center justify-center opacity-5 select-none pointer-events-none">
          <h2 className="text-9xl font-black rotate-[-10deg]">APP</h2>
        </div>

        <RightSidebar
          isOpen={true}
          width="lg"
          variant="floating"
          activeTabId={activeTab}
          onTabChange={setActiveTab}
          tabs={[
            { id: 'activity', icon: Activity, label: 'Activity' },
            { id: 'ai', icon: Sparkles, label: 'AI' },
            { id: 'help', icon: MessageSquare, label: 'Help' },
          ]}
        >
          <RightSidebar.Header 
            title="Activity Feed" 
            status="online"
            onClose={() => console.log('close')}
          />
          
          <RightSidebar.Body>
            {/* Cards using Designer Specs */}
            {[1, 2].map(i => (
              <div key={i} className="p-4 rounded-lg bg-slate-50 border border-slate-100 hover:border-[#FFD700]/50 transition-all cursor-pointer group shadow-sm">
                <Stack gap={2}>
                  <Inline justify="between" align="center">
                    <Inline gap={2} align="center">
                      <div className="w-6 h-6 rounded bg-blue-100 text-[#135bec] flex items-center justify-center text-[10px] font-bold">JD</div>
                      <span className="text-xs font-bold text-[#0d121b]">John Doe</span>
                      <span className="text-[10px] text-slate-400">2m ago</span>
                    </Inline>
                    <Star size={14} className="text-slate-200 group-hover:text-[#FFD700] transition-colors" />
                  </Inline>
                  <p className="text-sm text-slate-600 leading-snug">
                    Updated the main color tokens for the dashboard project.
                  </p>
                </Stack>
              </div>
            ))}

            {/* AI Assistant Card - Designer Style */}
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-100 hover:border-[#FFD700]/50 transition-all cursor-pointer group shadow-sm">
              <Stack gap={2}>
                <Inline justify="between" align="center">
                  <Inline gap={2} align="center">
                    <div className="w-6 h-6 rounded bg-purple-100 text-purple-600 flex items-center justify-center">
                      <Sparkles size={14} />
                    </div>
                    <span className="text-xs font-bold text-[#0d121b]">Loop AI</span>
                    <span className="text-[10px] text-slate-400">15m ago</span>
                  </Inline>
                  <Star size={14} className="text-slate-200 group-hover:text-[#FFD700] transition-colors" />
                </Inline>
                <p className="text-sm text-slate-600 leading-snug">
                  I've analyzed your component usage. You might want to consolidate <span className="font-mono text-[11px] bg-slate-200 px-1 rounded">button-primary</span>.
                </p>
                <Inline gap={2} className="mt-1">
                  <button className="px-3 py-1.5 bg-[#0d121b] text-white text-[10px] font-bold rounded shadow-sm hover:opacity-90">Review</button>
                  <button className="px-3 py-1.5 bg-transparent border border-slate-300 text-slate-500 text-[10px] font-bold rounded hover:bg-slate-100">Dismiss</button>
                </Inline>
              </Stack>
            </div>

            {/* Loading Skeleton Simulation */}
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
              <Stack gap={2}>
                <div className="h-2 w-1/3 bg-slate-200 rounded animate-pulse" />
                <div className="h-2 w-3/4 bg-slate-200 rounded animate-pulse" />
                <div className="h-2 w-1/2 bg-slate-200 rounded animate-pulse" />
              </Stack>
            </div>
          </RightSidebar.Body>

          <RightSidebar.Footer>
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-[#135bec]/10 transition-all">
              <Search size={18} className="text-slate-400" />
              <input 
                className="bg-transparent border-none p-0 text-sm w-full focus:ring-0 placeholder:text-slate-400" 
                placeholder="Filter activity..."
              />
            </div>
          </RightSidebar.Footer>
        </RightSidebar>
      </div>
    );
  }
};
