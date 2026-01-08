import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { IconButton } from './index';
import { CertificationStamp } from '../..';

const meta: Meta<typeof IconButton> = {
  title: 'Atoms/Primitives/IconButton',
  component: IconButton,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost', 'energy'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    isLoading: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div className="relative w-full min-h-[250px] flex flex-col items-center justify-center p-8">
        <div className="absolute top-8 left-8 z-50">
          <CertificationStamp 
            status="experimental"
            version="v0.5.0" 
            phase={1} 
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
type Story = StoryObj<typeof IconButton>;

export const Default: Story = {
  args: {
    icon: 'settings',
    variant: 'ghost',
    tooltip: 'Settings',
  },
};

export const Primary: Story = {
  args: {
    icon: 'add',
    variant: 'primary',
    tooltip: 'Add New Item',
  },
};

export const Energy: Story = {
  args: {
    icon: 'auto_awesome',
    variant: 'energy',
    tooltip: 'AI Optimization',
  },
};
