import type { Meta, StoryObj } from '@storybook/react';
import { ModuleSidebar } from './index';
import { MODULE_SIDEBAR_FIXTURES } from './fixtures';
import { CertificationStamp } from '../../atoms/CertificationStamp';

const meta: Meta<typeof ModuleSidebar> = {
  title: 'Composites/Layout/ModuleSidebar',
  component: ModuleSidebar,
  decorators: [
    (Story) => (
      <div className="relative bg-shell-canvas border border-border-technical rounded-xl overflow-hidden h-96 w-64">
        <CertificationStamp status="certified" version="v1.0.0" phase={2} className="absolute top-2 right-2" />
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ModuleSidebar>;

export const Default: Story = {
  args: {
    ...MODULE_SIDEBAR_FIXTURES.default,
  },
};

export const WithFooter: Story = {
  args: {
    ...MODULE_SIDEBAR_FIXTURES.default,
    bottomSlot: (
      <div className="h-8 bg-background-subtle rounded animate-pulse" />
    )
  },
};
