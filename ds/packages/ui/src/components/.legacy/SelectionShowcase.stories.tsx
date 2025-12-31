
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { SelectionShowcase } from './SelectionShowcase';

const meta: Meta<typeof SelectionShowcase> = {
  title: '🧩 Molecules/Forms/Selection Showcase',
  component: SelectionShowcase,
};

export default meta;
type Story = StoryObj<typeof SelectionShowcase>;

export const Default: Story = {};
