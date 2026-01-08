import type { Meta, StoryObj } from '@storybook/react';
import { TechnicalStatusBadge } from './index';
import { CertificationStamp } from '../CertificationStamp';

const meta: Meta<typeof TechnicalStatusBadge> = {
  title: 'Atoms/Indicators/TechnicalStatusBadge',
  component: TechnicalStatusBadge,
  decorators: [
    (Story) => (
      <div className="relative min-h-[150px] bg-shell-canvas flex items-center justify-center p-8 overflow-hidden">
        <CertificationStamp status="certified" version="v1.0.0" phase={2} className="fixed top-4 right-4 z-50" />
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
type Story = StoryObj<typeof TechnicalStatusBadge>;

export const Active: Story = {
  args: {
    label: 'Suite_Active',
    severity: 'success',
    withPulse: true,
  },
};

export const Warning: Story = {
  args: {
    label: 'Degraded_Performance',
    severity: 'warning',
    withPulse: true,
  },
};

export const Critical: Story = {
  args: {
    label: 'System_Critical',
    severity: 'danger',
    withPulse: true,
  },
};

export const Innovation: Story = {
  args: {
    label: 'Generative_Model',
    severity: 'innovation',
    withPulse: true,
  },
};

export const Outline: Story = {
  args: {
    label: 'Awaiting_Signal',
    severity: 'neutral',
    variant: 'outline',
  },
};
