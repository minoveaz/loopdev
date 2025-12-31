import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './index';

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
