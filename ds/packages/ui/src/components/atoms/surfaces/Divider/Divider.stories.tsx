import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Divider } from './index';
import { CertificationStamp } from '../..';

const meta: Meta<typeof Divider> = {
  title: 'Atoms/Primitives/Divider',
  component: Divider,
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'radio',
      options: ['horizontal', 'vertical'],
    },
    label: { control: 'text' },
  },
  parameters: {
    layout: 'fullscreen',
  },
  // Decorator to provide a fixed width container for horizontal dividers
  decorators: [
    (Story) => (
      <div className="relative w-full min-h-[300px] flex flex-col items-center justify-center p-8">
        <div className="absolute top-8 left-8 z-50">
          <CertificationStamp 
            status="experimental"
            version="v0.2.0" 
            phase={1} 
            date="2026-01-01" 
            className="scale-90 origin-top-left opacity-90 hover:opacity-100 transition-opacity shadow-2xl"
          />
        </div>
        <div className="flex items-center justify-center w-[400px] border border-dashed border-slate-200 dark:border-white/10 p-12 mt-16">
          <Story />
        </div>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Divider>;

export const Horizontal: Story = {
  args: {
    orientation: 'horizontal',
  },
};

export const WithLabel: Story = {
  args: {
    orientation: 'horizontal',
    label: 'OR',
  },
};

export const Vertical: Story = {
  render: () => (
    <div style={{ display: 'flex', height: '50px', alignItems: 'center', gap: '20px' }}>
      <span>Section A</span>
      <Divider orientation="vertical" />
      <span>Section B</span>
    </div>
  ),
};