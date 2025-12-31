import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './index';

const meta: Meta<typeof Button> = {
  title: 'Atoms/Primitives/Button',
  component: Button,
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
    fullWidth: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary Action',
  },
};

export const Energy: Story = {
  args: {
    variant: 'energy',
    children: 'AI Action',
    startIcon: 'auto_awesome',
  },
};

export const Loading: Story = {
  args: {
    variant: 'primary',
    children: 'Saving...',
    isLoading: true,
  },
};
