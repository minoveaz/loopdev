import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { LandingPageView } from '../../LandingPageView';

const meta: Meta<typeof LandingPageView> = {
  title: '🧩 Molecules/Forms/LandingPageView',
  component: LandingPageView,
};

export default meta;
type Story = StoryObj<typeof LandingPageView>;

export const Default: Story = {};
