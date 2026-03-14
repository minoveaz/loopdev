import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { LogoSpinner } from './index';
import { CertificationStamp } from '../..';

const meta: Meta<typeof LogoSpinner> = {
  title: 'Atoms/Primitives/LogoSpinner',
  component: LogoSpinner,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', '2xl'],
    },
    speed: {
      control: 'select',
      options: ['fast', 'normal', 'slow'],
    },
    isStatic: { control: 'boolean' },
  },
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div className="relative w-full min-h-[400px] flex flex-col items-center justify-center p-8">
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
type Story = StoryObj<typeof LogoSpinner>;

export const Default: Story = {
  args: {
    size: 'lg',
    speed: 'normal',
  },
};

/**
 * HISTORIA DE ESTRÉS: Escalabilidad Extrema
 */
export const StressScaling: Story = {
  render: () => (
    <div className="flex flex-col gap-12">
      <div className="flex items-center gap-4">
        <LogoSpinner size={16} />
        <span className="text-[10px] font-mono text-slate-400">Micro (16px) - Grid Aligned</span>
      </div>
      <div className="flex items-center gap-4">
        <LogoSpinner size={256} />
        <span className="text-[10px] font-mono text-slate-400">Macro (256px) - Scale Match</span>
      </div>
    </div>
  ),
};

export const AIProcess: Story = {
  args: {
    size: 'xl',
    speed: 'fast',
  },
};
