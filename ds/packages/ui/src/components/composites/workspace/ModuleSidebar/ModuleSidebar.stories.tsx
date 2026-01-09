import type { Meta, StoryObj } from '@storybook/react';
import { ModuleSidebar } from './index';
import { MODULE_SIDEBAR_FIXTURES } from './fixtures';
import { CertificationStamp } from '../../../atoms/indicators/CertificationStamp';

const meta: Meta<typeof ModuleSidebar> = {
  title: 'Composites/Workspace/ModuleSidebar',
  component: ModuleSidebar,
  decorators: [
    (Story) => (
      <div className="relative h-[600px] w-[280px] border-r border-border-technical bg-shell-canvas overflow-hidden flex flex-col">
        <CertificationStamp status="certified" version="v1.6.0" phase={2} className="fixed top-4 right-4 z-50 scale-75 origin-top-right" />
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ModuleSidebar>;

export const DirectoryMode: Story = {
  args: MODULE_SIDEBAR_FIXTURES.moduleMode,
};

export const OntologyMode: Story = {
  args: MODULE_SIDEBAR_FIXTURES.brandMode,
};