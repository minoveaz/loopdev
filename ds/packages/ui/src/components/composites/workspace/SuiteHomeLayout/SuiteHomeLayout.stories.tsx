import type { Meta, StoryObj } from '@storybook/react';
import { SuiteHomeLayout } from './index';
import { SUITE_HOME_MOCK_PROPS } from './fixtures';
import { CertificationStamp } from '../../../atoms/indicators/CertificationStamp';

const meta: Meta<typeof SuiteHomeLayout> = {
  title: 'Composites/Workspace/SuiteHomeLayout',
  component: SuiteHomeLayout,
  decorators: [
    (Story) => (
      <div className="relative min-h-screen bg-shell-canvas overflow-hidden">
        <CertificationStamp status="certified" version="v2.1.0" phase={2} className="fixed top-4 right-4 z-50" />
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SuiteHomeLayout>;

export const Default: Story = {
  args: {
    ...SUITE_HOME_MOCK_PROPS,
  },
};

export const NewUser: Story = {
  args: {
    ...SUITE_HOME_MOCK_PROPS,
    userState: 'new',
    contextLine: 'Welcome to Marketing Studio! Start by creating your first brand.',
    metrics: SUITE_HOME_MOCK_PROPS.metrics.map(m => ({ ...m, value: 0 })),
    activity: [],
  },
};

export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'iphone14pro',
    },
  },
  args: {
    ...SUITE_HOME_MOCK_PROPS,
  },
};
