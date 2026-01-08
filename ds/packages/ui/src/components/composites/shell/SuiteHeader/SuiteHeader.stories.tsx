import type { Meta, StoryObj } from '@storybook/react';
import { SuiteHeader } from './index';
import { CommandBarTrigger } from '../../../../atoms/CommandBarTrigger';
import { SystemStatus } from '../../../../atoms/SystemStatus';
import { ThemeToggle } from '../../../../atoms/ThemeToggle';
import React from 'react';

const meta: Meta<typeof SuiteHeader> = {
  title: 'Composites/Layout/SuiteHeader',
  component: SuiteHeader,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof SuiteHeader>;

export const Default: Story = {
  args: {
    leftSlot: (
      <div className="flex items-center gap-4">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold">M</div>
        <span className="font-bold text-sm">Marketing Studio</span>
      </div>
    ),
    centerSlot: (
      <CommandBarTrigger placeholder="Search or type a command..." onOpen={() => alert('Command Palette')} />
    ),
    rightSlot: (
      <div className="flex items-center gap-4">
        <SystemStatus state="operational" id="T-123" />
        <ThemeToggle />
      </div>
    ),
  },
};

export const Inert: Story = {
  args: {
    ...Default.args,
    isInert: true,
  },
};

export const FocusMode: Story = {
  args: {
    ...Default.args,
    context: 'focus',
    leftSlot: <span className="font-bold text-sm">Focus Mode</span>,
  },
};
