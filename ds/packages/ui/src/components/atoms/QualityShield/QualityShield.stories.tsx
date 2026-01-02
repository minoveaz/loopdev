import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { QualityShield } from './index';

const meta: Meta<typeof QualityShield> = {
  title: 'Atoms/Governance/QualityShield',
  component: QualityShield,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof QualityShield>;

export const Default: Story = {
  args: {
    metrics: {
      unit: { label: 'Unit', status: 'pass', value: '100% COV' },
      a11y: { label: 'A11y', status: 'pass', value: 'WCAG AA' },
      visual: { label: 'Visual', status: 'pass', value: 'CHROMATIC OK' },
      flow: { label: 'Flow', status: 'warning', value: 'E2E PENDING' },
      security: { label: 'Security', status: 'pass', value: 'SNYK OK' },
    },
  },
  render: (args) => (
    <div className="w-full h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-slate-700 font-mono text-xs uppercase tracking-widest">Component Area Simulation</div>
      <QualityShield {...args} />
    </div>
  ),
};

export const CriticalFail: Story = {
  args: {
    metrics: {
      unit: { label: 'Unit', status: 'fail', value: 'ERR: 2 TESTS' },
      a11y: { label: 'A11y', status: 'pass', value: 'PASS' },
      visual: { label: 'Visual', status: 'pending', value: 'IN REVIEW' },
    },
  },
  render: (args) => (
    <div className="w-full h-screen bg-slate-950 flex items-center justify-center">
      <QualityShield {...args} />
    </div>
  ),
};
