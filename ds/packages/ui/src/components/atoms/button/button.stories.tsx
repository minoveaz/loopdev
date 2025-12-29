import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './button';
import { Mail, ArrowRight, Plus, Settings, Trash2, Zap } from 'lucide-react';
import { Stack, Inline, Container, Box } from '../../../components/layout';

const meta: Meta<typeof Button> = {
  title: '⚛️ Atoms/Action/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'energy', 'outline', 'ghost', 'destructive'],
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
    },
    isLoading: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Gallery: Story = {
  render: () => (
    <Container className="py-12">
      <Stack gap={12}>
        {/* Core Variations */}
        <section className="space-y-6">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] opacity-40 border-b pb-2">Variations</h3>
          <Inline gap={4} align="center">
            <Button variant="primary">Primary Action</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="tertiary">Tertiary</Button>
            <Button variant="energy" leftIcon={<Zap size={16} />}>Energy CTA</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive" leftIcon={<Trash2 size={16} />}>Delete</Button>
          </Inline>
        </section>

        {/* Sizes */}
        <section className="space-y-6">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] opacity-40 border-b pb-2">Sizes</h3>
          <Inline gap={4} align="center">
            <Button size="sm">Small (36px)</Button>
            <Button size="default">Default (40px)</Button>
            <Button size="lg">Large (48px)</Button>
          </Inline>
        </section>

        {/* Icon Buttons */}
        <section className="space-y-6">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] opacity-40 border-b pb-2">Icon Support</h3>
          <Inline gap={4} align="center">
            <Button size="icon"><Plus size={20} /></Button>
            <Button size="icon"><Settings size={20} /></Button>
            <Button variant="primary" leftIcon={<Mail size={18} />}>Send Message</Button>
            <Button variant="secondary" rightIcon={<ArrowRight size={18} />}>Learn More</Button>
          </Inline>
        </section>

        {/* States */}
        <section className="space-y-6">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] opacity-40 border-b pb-2">States</h3>
          <Inline gap={4} align="center">
            <Button variant="primary" isLoading>Processing</Button>
            <Button variant="secondary" disabled>Disabled Action</Button>
            <Box padding={2} className="ring-4 ring-[var(--lpd-color-brand-primary)]/20 rounded-xl">
              <Button variant="primary">Focused Look</Button>
            </Box>
          </Inline>
        </section>
      </Stack>
    </Container>
  ),
};

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary Action',
  },
};

export const Energy: Story = {
  args: {
    variant: 'energy',
    children: 'Launch System',
    leftIcon: <Zap size={18} />,
  },
};