import type { Meta, StoryObj } from '@storybook/react';
import { BrandIdentityView } from './brand-identity-view';

const meta: Meta<typeof BrandIdentityView> = {
  title: '🚀 Getting Started/Identity',
  component: BrandIdentityView,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof BrandIdentityView>;

export const Default: Story = {};
