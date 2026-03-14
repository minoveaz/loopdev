import type { Meta, StoryObj } from '@storybook/react';
import { ModuleToolbar } from './index';
import { MODULE_TOOLBAR_FIXTURES } from './fixtures';
import { CertificationStamp } from '../../../../atoms/CertificationStamp';

const meta: Meta<typeof ModuleToolbar> = {
  title: 'Composites/Layout/ModuleToolbar',
  component: ModuleToolbar,
  decorators: [
    (Story) => (
      <div className="relative bg-shell-canvas border border-border-technical rounded-xl overflow-hidden h-32 flex flex-col justify-center">
        <CertificationStamp status="certified" version="v1.0.0" phase={2} className="absolute top-2 right-2" />
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ModuleToolbar>;

export const Default: Story = {
  args: {
    ...MODULE_TOOLBAR_FIXTURES.default,
  },
};

export const SelectionMode: Story = {
  args: {
    ...MODULE_TOOLBAR_FIXTURES.withSelection,
  },
};

export const Compact: Story = {
  args: {
    ...MODULE_TOOLBAR_FIXTURES.default,
    density: 'compact',
  },
};
