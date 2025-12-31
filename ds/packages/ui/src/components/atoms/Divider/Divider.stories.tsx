import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Divider } from './index';

const meta: Meta<typeof Divider> = {
  title: 'Atoms/Primitives/Divider',
  component: Divider,
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'radio',
      options: ['horizontal', 'vertical'],
    },
    label: { control: 'text' },
  },
  // Decorator to provide a fixed width container for horizontal dividers
  decorators: [
    (Story) => (
      <div style={{ width: '400px', padding: '20px', border: '1px dashed #ccc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Divider>;

export const Horizontal: Story = {
  args: {
    orientation: 'horizontal',
  },
};

export const WithLabel: Story = {
  args: {
    orientation: 'horizontal',
    label: 'OR',
  },
};

export const Vertical: Story = {
  render: () => (
    <div style={{ display: 'flex', height: '50px', alignItems: 'center', gap: '20px' }}>
      <span>Section A</span>
      <Divider orientation="vertical" />
      <span>Section B</span>
    </div>
  ),
};