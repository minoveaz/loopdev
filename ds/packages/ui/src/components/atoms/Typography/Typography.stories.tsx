import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Text, Heading, Code } from './index';

const meta: Meta<typeof Text> = {
  title: 'Atoms/Foundations/Typography',
  component: Text,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl'],
    },
    weight: {
      control: 'select',
      options: ['normal', 'medium', 'semibold', 'bold', 'black'],
    },
    variant: {
      control: 'radio',
      options: ['sans', 'mono'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Text>;

export const StandardText: Story = {
  args: {
    children: 'The quick brown fox jumps over the lazy dog',
    size: 'base',
  },
};

export const MainHeading: Story = {
  render: () => <Heading>Digital Product Operating System</Heading>,
};

export const TechnicalCode: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <Text size="sm" weight="bold">System Output:</Text>
      <Code>const architect = new LoopDev();</Code>
    </div>
  ),
};
