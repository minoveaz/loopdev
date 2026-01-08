import type { Meta, StoryObj } from '@storybook/react';
import { LpdText } from './index';
import { CertificationStamp } from '../../atoms';

const meta: Meta<typeof LpdText> = {
  title: 'Atoms/Foundations/Typography',
  component: LpdText,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['nano', 'xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl', '7xl'],
    },
    weight: {
      control: 'select',
      options: ['normal', 'medium', 'semibold', 'bold', 'black'],
    },
    variant: {
      control: 'select',
      options: ['sans', 'mono'],
    },
  },
  decorators: [
    (Story) => (
      <div className="relative w-full p-8 flex items-center justify-center min-h-[200px]">
        <CertificationStamp 
          status="certified"
          version="v1.0.0" 
          phase={1} 
          date="2026-01-01" 
          className="absolute top-4 left-4"
        />
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof LpdText>;

export const Showcase: Story = {
  args: {
    children: 'The quick brown fox jumps over the lazy dog',
    size: 'base',
    weight: 'normal',
    variant: 'sans',
  },
};
