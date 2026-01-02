import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Text, Heading, Code } from './index';
import { CertificationStamp } from '../CertificationStamp';

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
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div className="relative w-full min-h-[300px] flex flex-col items-center justify-center p-8">
        <div className="absolute top-8 left-8 z-50">
          <CertificationStamp 
            status="beta"
            version="v1.0.0" 
            phase={0} 
            date="2026-01-01" 
            className="scale-90 origin-top-left opacity-90 hover:opacity-100 transition-opacity shadow-2xl"
          />
        </div>
        <div className="flex items-center justify-center w-full h-full pt-16">
          <Story />
        </div>
      </div>
    ),
  ],
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
    <div className="flex flex-col gap-4 items-center">
      <Text size="sm" weight="bold">System Output:</Text>
      <Code>const architect = new LoopDev();</Code>
    </div>
  ),
};