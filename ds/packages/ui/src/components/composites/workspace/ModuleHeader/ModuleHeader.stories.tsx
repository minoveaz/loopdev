import type { Meta, StoryObj } from '@storybook/react';
import { ModuleHeader } from './index';
import { MODULE_HEADER_FIXTURES } from './fixtures';
import { CertificationStamp } from '../../../../atoms/CertificationStamp';

const meta: Meta<typeof ModuleHeader> = {
  title: 'Composites/Layout/ModuleHeader',
  component: ModuleHeader,
  decorators: [
    (Story) => (
      <div className="relative bg-shell-canvas border border-border-technical rounded-xl overflow-hidden h-32">
        <CertificationStamp status="certified" version="v1.0.0" phase={2} className="absolute top-2 right-2" />
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ModuleHeader>;

export const Default: Story = {
  args: {
    ...MODULE_HEADER_FIXTURES.default,
  },
};

export const DraftWithBack: Story = {
  args: {
    ...MODULE_HEADER_FIXTURES.draft,
  },
};

export const ComplexPath: Story = {
  args: {
    title: 'Summer Collection 2026',
    breadcrumbs: [
      { label: 'Marketing' },
      { label: 'Identidad Visual' },
      { label: 'Campaigns' },
      { label: 'Summer' }
    ],
    status: { label: 'REVIEW', tone: 'danger' },
  },
};
