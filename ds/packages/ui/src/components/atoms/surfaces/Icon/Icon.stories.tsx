import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Icon } from './index';
import { ICON_REGISTRY } from '../..';
import { CertificationStamp } from '../..';

const meta: Meta<typeof Icon> = {
  title: 'Atoms/Foundations/Icon',
  component: Icon,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
    },
    variant: {
      control: 'radio',
      options: ['standard', 'boxed'],
    },
    color: { control: 'color' },
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
            version="v1.0.0" 
            phase={0} 
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
type Story = StoryObj<typeof Icon>;

export const Standard: Story = {
  args: {
    name: 'bolt',
    size: 'lg',
    variant: 'standard',
  },
};

export const Boxed: Story = {
  args: {
    name: 'science',
    size: 'md',
    variant: 'boxed',
  },
};

export const AllIcons: Story = {
  render: () => (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 w-full max-w-4xl mx-auto">
      {Object.entries(ICON_REGISTRY.actions).map(([key, name]) => (
        <div key={key} className="flex flex-col items-center gap-3 p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
          <Icon name={name} variant="boxed" size="md" />
          <span className="text-[10px] font-bold font-mono text-slate-500 uppercase tracking-tighter">{key}</span>
        </div>
      ))}
    </div>
  ),
};