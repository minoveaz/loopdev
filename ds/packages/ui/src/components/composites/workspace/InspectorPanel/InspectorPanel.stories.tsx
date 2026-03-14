import type { Meta, StoryObj } from '@storybook/react';
import { InspectorPanel } from './index';
import { INSPECTOR_PANEL_FIXTURES } from '../../ModuleSidebar/fixtures';
import { CertificationStamp } from '../../../../atoms/CertificationStamp';

const meta: Meta<typeof InspectorPanel> = {
  title: 'Composites/Layout/InspectorPanel',
  component: InspectorPanel,
  decorators: [
    (Story) => (
      <div className="relative bg-shell-canvas border border-border-technical rounded-xl overflow-hidden h-96 w-80">
        <CertificationStamp status="certified" version="v1.0.0" phase={2} className="absolute top-2 right-2" />
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof InspectorPanel>;

export const Default: Story = {
  args: {
    ...INSPECTOR_PANEL_FIXTURES.default,
  },
};

export const WithFooter: Story = {
  args: {
    ...INSPECTOR_PANEL_FIXTURES.default,
    footerSlot: (
      <div className="flex gap-2">
        <div className="h-8 flex-1 bg-primary rounded" />
        <div className="h-8 flex-1 bg-background-subtle rounded" />
      </div>
    )
  },
};
