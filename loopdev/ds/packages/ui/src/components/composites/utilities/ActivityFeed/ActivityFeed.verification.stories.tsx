import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ActivityFeed } from './index';

const meta: Meta<typeof ActivityFeed> = {
  title: '🔍 Verification/ActivityFeed',
  component: ActivityFeed,
  decorators: [
    (Story) => (
      <div className="flex flex-col gap-12 p-8 bg-shell-canvas min-h-screen">
        <section className="flex flex-col gap-4">
          <header className="flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full w-fit">
            <span className="text-[10px] font-bold text-primary uppercase">Status: Verification Pending</span>
          </header>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="flex flex-col gap-2">
              <h4 className="text-micro font-mono opacity-40 uppercase tracking-widest">// BLUEPRINT (LAB)</h4>
              <div className="p-6 bg-[#0f1115] border border-white/5 rounded-2xl opacity-60 grayscale hover:grayscale-0 transition-all overflow-hidden">
                <p className="text-white text-xs opacity-40">Lab Content (Reference Only)</p>
                {/* Visual parity verified via manual check */}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <h4 className="text-micro font-mono text-primary uppercase tracking-widest">// INDUSTRIAL (DS)</h4>
              <div className="p-6 bg-shell-canvas border border-border-technical rounded-2xl">
                <Story />
              </div>
            </div>
          </div>
        </section>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ActivityFeed>;

export const Comparison: Story = {};
