import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Icon } from './index';
import { ICON_REGISTRY } from '../IconRegistry';

const meta: Meta<typeof Icon> = {
  title: 'Atoms/Foundations/Icon',
  component: Icon,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
    },
    variant: {
      control: 'radio',
      options: ['standard', 'boxed'],
    },
    color: { control: 'color' },
  },
};

export default meta;
type Story = StoryObj<typeof Icon>;

export const Standard: Story = {
  args: {
    name: 'bolt',
    size: 'lg',
    variant: 'standard',
  },
};

export const Boxed: Story = {
  args: {
    name: 'science',
    size: 'md',
    variant: 'boxed',
  },
};

export const AllIcons: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '20px' }}>
      {Object.entries(ICON_REGISTRY.actions).map(([key, name]) => (
        <div key={key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
          <Icon name={name} variant="boxed" size="md" />
          <span style={{ fontSize: '10px', fontWeight: 'bold', fontFamily: 'monospace' }}>{key}</span>
        </div>
      ))}
    </div>
  ),
};
