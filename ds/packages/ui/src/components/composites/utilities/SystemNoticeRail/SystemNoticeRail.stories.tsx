import type { Meta, StoryObj } from '@storybook/react';
import { SystemNoticeRail } from './index';
import { CertificationStamp } from '../../../atoms/indicators/CertificationStamp';

const meta: Meta<typeof SystemNoticeRail> = {
  title: 'Utilities/Governance/SystemNoticeRail',
  component: SystemNoticeRail,
  decorators: [
    (Story) => (
      <div className="relative min-h-[200px] bg-shell-canvas p-8 overflow-hidden">
        {/* Background Grid for context */}
        <div className="absolute inset-0 bg-grid-40 opacity-[0.03] pointer-events-none" />
        <CertificationStamp status="certified" version="v1.0.0" phase={2} className="fixed top-4 right-4 z-50" />
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
type Story = StoryObj<typeof SystemNoticeRail>;

export const SingleAlert: Story = {
  args: {
    notices: [
      {
        id: '1',
        severity: 'danger',
        title: 'API Connection Failed',
        description: 'The Instagram integration is currently down.',
        primaryAction: { label: 'Reconnect', onClick: () => console.log('Reconnect') },
        dismissible: false
      }
    ]
  },
};

export const MultiplePrioritized: Story = {
  args: {
    notices: [
      {
        id: '1',
        severity: 'info',
        title: 'New Feature Available',
        description: 'Content Engine now supports video generation.',
        primaryAction: { label: 'Explore', onClick: () => console.log('Explore') },
        dismissible: true
      },
      {
        id: '2',
        severity: 'warning',
        title: 'Credits Low',
        description: 'You have 10% of AI credits left.',
        primaryAction: { label: 'Top Up', onClick: () => console.log('Top up') },
        dismissible: false
      }
    ]
  },
};

export const Success: Story = {
  args: {
    notices: [
      {
        id: '1',
        severity: 'success',
        title: 'System Sychronized',
        description: 'All brands are now up to date with global assets.',
        primaryAction: { label: 'View Details', onClick: () => console.log('Details') },
        dismissible: true
      }
    ]
  },
};
