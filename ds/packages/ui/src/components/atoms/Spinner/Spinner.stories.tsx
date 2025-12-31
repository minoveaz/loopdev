import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Spinner } from './index';
import { CertificationStamp } from '../CertificationStamp';

const meta: Meta<typeof Spinner> = {
  title: 'Atoms/Primitives/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
    },
    color: {
      control: 'select',
      options: ['primary', 'current', 'energy', 'white'],
    },
  },
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div className="relative w-full min-h-[250px] flex flex-col items-center justify-center p-8">
        <div className="absolute top-8 left-8 z-50">
          <CertificationStamp 
            status="beta"
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
type Story = StoryObj<typeof Spinner>;

export const Default: Story = {
  args: {
    size: 'md',
    color: 'primary',
  },
};

export const Energy: Story = {
  args: {
    size: 'lg',
    color: 'energy',
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-12">
      <div className="flex flex-col items-center gap-2">
        <Spinner size="sm" />
        <span className="text-[10px] font-mono opacity-40 uppercase">sm</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Spinner size="md" />
        <span className="text-[10px] font-mono opacity-40 uppercase">md</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Spinner size="lg" />
        <span className="text-[10px] font-mono opacity-40 uppercase">lg</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Spinner size="xl" />
        <span className="text-[10px] font-mono opacity-40 uppercase">xl</span>
      </div>
    </div>
  ),
};