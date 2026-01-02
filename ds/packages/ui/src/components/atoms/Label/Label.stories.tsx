import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Label } from './index';
import { CertificationStamp } from '../CertificationStamp';

const meta: Meta<typeof Label> = {
  title: 'Atoms/Primitives/Label',
  component: Label,
  tags: ['autodocs'],
  argTypes: {
    required: { control: 'boolean' },
  },
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div className="relative w-full min-h-[200px] flex flex-col items-center justify-center p-8">
        <div className="absolute top-8 left-8 z-50">
          <CertificationStamp 
            status="beta"
            version="v1.0.0" 
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
type Story = StoryObj<typeof Label>;

export const Default: Story = {
  args: {
    children: 'Project Name',
  },
};

export const Required: Story = {
  args: {
    children: 'Email Address',
    required: true,
  },
};