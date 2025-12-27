import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './button';
import { Mail, ArrowRight, Loader2 } from 'lucide-react';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'destructive', 'outline', 'ghost', 'link'],
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
    },
    isLoading: { control: 'boolean' },
    asChild: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary Action',
  },
};

export const WithIcons: Story = {
  args: {
    variant: 'primary',
    children: 'Send Email',
    leftIcon: <Mail size={16} />,
    rightIcon: <ArrowRight size={16} />,
  },
};

export const Loading: Story = {
  args: {
    variant: 'primary',
    children: 'Processing',
    isLoading: true,
  },
};

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Delete Account',
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline Button',
  },
};

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Ghost Button',
  },
};

export const AllVariants: Story = {
  render: (args) => (
    <div className="flex flex-wrap gap-4 items-center p-4">
      <Button {...args} variant="primary">Primary</Button>
      <Button {...args} variant="secondary">Secondary</Button>
      <Button {...args} variant="destructive">Destructive</Button>
      <Button {...args} variant="outline">Outline</Button>
      <Button {...args} variant="ghost">Ghost</Button>
      <Button {...args} variant="link">Link</Button>
    </div>
  ),
};

export const ButtonStates: Story = {
  render: (args) => (
    <div className="flex flex-col gap-6 p-4">
      <div className="flex flex-wrap gap-4 items-center">
        <Button {...args}>Normal Button</Button>
        <Button {...args} leftIcon={<Mail size={16} />}>Left Icon</Button>
        <Button {...args} rightIcon={<ArrowRight size={16} />}>Right Icon</Button>
        <Button {...args} leftIcon={<Mail size={16} />} rightIcon={<ArrowRight size={16} />}>Both Icons</Button>
      </div>
      <div className="flex flex-wrap gap-4 items-center">
        <Button {...args} isLoading>Loading State</Button>
        <Button {...args} disabled>Disabled State</Button>
        <Button {...args} variant="outline" isLoading>Outline Loading</Button>
      </div>
    </div>
  ),
};
