import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { IconButton } from './index';

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
