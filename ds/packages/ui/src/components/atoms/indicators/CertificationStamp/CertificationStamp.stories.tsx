import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { CertificationStamp } from './index';

const meta: Meta<typeof CertificationStamp> = {
  title: 'Atoms/Internal/CertificationStamp',
  component: CertificationStamp,
  tags: ['autodocs'],
  argTypes: {
    status: {
      control: 'select',
      options: ['certified', 'beta', 'experimental'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof CertificationStamp>;

export const Certified: Story = {
  args: {
    status: 'certified',
    version: 'v1.2.0',
    phase: 1,
  },
};

export const InAudit: Story = {
  args: {
    status: 'beta',
    version: 'v0.9.0',
    phase: 1,
  },
};

export const LabDraft: Story = {
  args: {
    status: 'experimental',
    version: 'v0.1.0',
    phase: 2,
  },
};