import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ActivityFeed } from './index';

const MOCK_ITEMS = [
  {
    id: '1',
    icon: 'cloud_upload',
    action: 'New assets uploaded',
    module: 'Marketing Assets',
    timestamp: '10m ago',
    description: 'John Doe added 4 new files to',
    tone: 'primary' as const
  },
  {
    id: '2',
    icon: 'bolt',
    action: 'System Alert',
    module: 'module-core',
    timestamp: '2h ago',
    description: 'Automated build process completed with warnings in',
    tone: 'warning' as const
  }
];

const meta: Meta<typeof ActivityFeed> = {
  title: '🔍 Verification/ActivityFeed',
  component: ActivityFeed,
  decorators: [
    (Story) => (
      <div className="flex flex-col gap-12 p-8 bg-shell-canvas min-h-screen">
        <header className="flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full w-fit">
          <span className="text-[10px] font-bold text-primary uppercase">Status: Verification Mode</span>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="flex flex-col gap-2">
            <h4 className="text-micro font-mono opacity-40 uppercase tracking-widest">// BLUEPRINT (LAB)</h4>
            <div className="p-6 bg-white dark:bg-[#0f1115] border border-border-technical rounded-2xl grayscale opacity-50">
               {/* Réplica visual manual simplificada para comparación */}
               <div className="flex flex-col gap-4">
                 <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded" />
                 <div className="h-20 w-full border-l-2 border-slate-100 dark:border-slate-800 ml-4" />
               </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <h4 className="text-micro font-mono text-primary uppercase tracking-widest">// INDUSTRIAL (DS)</h4>
            <div className="p-6 bg-shell-canvas border border-border-technical rounded-2xl">
              <Story />
            </div>
          </div>
        </div>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ActivityFeed>;

export const Comparison: Story = {
  args: {
    title: 'Project History',
    items: MOCK_ITEMS,
    onViewAll: () => console.log('View All')
  }
};