import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { AILoader } from './index';
import { CertificationStamp } from '../CertificationStamp';

const meta: Meta<typeof AILoader> = {
  title: 'Atoms/Primitives/AILoader',
  component: AILoader,
  tags: ['autodocs'],
  argTypes: {
    speed: {
      control: 'select',
      options: ['fast', 'normal', 'slow'],
    },
    showCursor: { control: 'boolean' },
  },
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div className="relative w-full min-h-[300px] flex flex-col items-center justify-center p-8">
        <div className="absolute top-8 left-8 z-50">
          <CertificationStamp 
            version="v1.0.0" 
            phase={2} 
            date="2026-01-01" 
            className="scale-90 origin-top-left opacity-90 hover:opacity-100 transition-opacity shadow-2xl"
          />
        </div>
        <div className="flex items-center justify-center w-full h-full pt-16">
          <Story />
        </div>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof AILoader>;

export const Default: Story = {
  args: {
    messages: ['AI Processing...'],
  },
};

/**
 * HISTORIA DE ESTRÉS: Contenido Extremo
 */
export const StressContent: Story = {
  args: {
    messages: [
      'Analyzing deep neural network structures and optimizing generative weights for production deployment...',
      'Synchronizing multi-tenant database clusters across 14 geographic regions in real-time...'
    ],
    speed: 'fast',
  },
  render: (args) => (
    <div className="w-72 border border-dashed border-slate-300 p-4 rounded-xl">
      <span className="text-[10px] text-slate-400 mb-2 block">Parent: w-72 (Scale Match)</span>
      <AILoader {...args} />
    </div>
  ),
};

export const SmartCycle: Story = {
  args: {
    messages: ['Analyzing Context...', 'Generating Architecture...', 'Optimizing...'],
    speed: 'fast',
  },
};