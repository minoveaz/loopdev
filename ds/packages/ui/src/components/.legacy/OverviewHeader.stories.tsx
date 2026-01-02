import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { OverviewHeader } from '../../../molecules/OverviewHeader';

const meta: Meta<typeof OverviewHeader> = {
  title: '🧩 Molecules/Forms/OverviewHeader',
  component: OverviewHeader,
};

export default meta;
type Story = StoryObj<typeof OverviewHeader>;

export const Default: Story = {};
