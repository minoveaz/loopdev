import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './index';
import { CertificationStamp } from '../..';

const meta: Meta<typeof Badge> = {
  title: 'Atoms/Primitives/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    status: {
      control: 'select',
      options: ['neutral', 'primary', 'energy', 'innovation', 'success', 'error'],
    },
    variant: {
      control: 'select',
      options: ['ghost', 'solid', 'outline', 'glass'],
    },
    isLive: { control: 'boolean' },
    isTechnical: { control: 'boolean' },
    showDot: { control: 'boolean' },
  },
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div className="relative w-full min-h-[300px] flex flex-col items-center justify-center p-8">
        <div className="absolute top-8 left-8 z-50">
          <CertificationStamp 
            status="beta"
            version="v1.1.0" 
            phase={1} 
            date="2026-01-01" 
            className="scale-90 origin-top-left opacity-90 hover:opacity-100 transition-opacity shadow-2xl"
          />
        </div>
        <div className="flex items-center justify-center w-full h-full pt-12">
          <Story />
        </div>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  args: {
    children: 'Stable',
    status: 'neutral',
    variant: 'ghost',
  },
};

export const DatabasePrimary: Story = {
  args: {
    children: 'Brand Status',
    status: 'primary',
    variant: 'solid',
  },
};

export const DatabaseDanger: Story = {
  args: {
    children: 'System Error',
    status: 'error',
    variant: 'solid',
  },
};

export const EnergyLive: Story = {
  args: {
    children: 'AI Optimizing',
    status: 'energy',
    variant: 'glass',
    isLive: true,
    isTechnical: true,
  },
};

export const Innovation: Story = {
  args: {
    children: 'Generative',
    status: 'innovation',
    variant: 'solid',
  },
};