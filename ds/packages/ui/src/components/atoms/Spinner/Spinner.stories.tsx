import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Spinner } from './index';

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
    <div className="flex items-end gap-6">
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
      <Spinner size="xl" />
    </div>
  ),
};
