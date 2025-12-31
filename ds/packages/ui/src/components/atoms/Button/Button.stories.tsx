import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './index';
import { CertificationStamp } from '../CertificationStamp';

const meta: Meta<typeof Button> = {
  title: 'Atoms/Primitives/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost', 'energy', 'danger'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    isLoading: { control: 'boolean' },
    disabled: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
  },
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div className="relative w-full min-h-[400px] flex flex-col items-center justify-center p-8">
        <div className="absolute top-8 left-8 z-50">
          <CertificationStamp 
            version="v1.2.1" 
            phase={1} 
            date="2026-01-01" 
            className="scale-90 origin-top-left opacity-90 hover:opacity-100 transition-opacity shadow-2xl"
          />
        </div>
        <div className="flex items-center justify-center w-full h-full pt-12">
          <Story />
        </div>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    children: 'Action Button',
    variant: 'primary',
  },
};

export const WithIcon: Story = {
  args: {
    children: 'AI Action',
    variant: 'energy',
    startIcon: 'auto_awesome',
  },
};

export const Danger: Story = {
  args: {
    children: 'Delete Workspace',
    variant: 'danger',
    startIcon: 'delete_forever',
  },
};

/**
 * ESCENARIO DE ESTRÉS: Contenido Extremo
 */
export const StressExtremeContent: Story = {
  args: {
    children: 'This is an extremely long button label to test how the component handles text wrapping and overflow in complex layouts',
    startIcon: 'warning',
    endIcon: 'arrow_forward',
    variant: 'outline',
  },
  render: (args) => (
    <div className="w-72 border border-dashed border-slate-300 p-4 rounded-xl">
       <span className="text-[10px] text-slate-400 mb-2 block">Parent: w-72 (Scale Match)</span>
       <Button {...args} />
    </div>
  ),
};

/**
 * ESCENARIO DE ESTRÉS: Carga y Acción
 */
export const StressLoadingShift: Story = {
  args: {
    children: 'Click to process',
    startIcon: 'cloud_upload',
    isLoading: true,
    variant: 'primary',
  },
};

/**
 * ESCENARIO DE ESTRÉS: Zero Label
 */
export const StressZeroLabel: Story = {
  args: {
    children: '',
    startIcon: 'settings',
    variant: 'primary',
  },
};

/**
 * ESCENARIO DE ESTRÉS: Presión de Layout
 */
export const StressLayoutPressure: Story = {
  render: (args) => (
    <div className="w-40 flex gap-2 border border-dashed border-slate-300 p-2 overflow-hidden">
       <div className="w-12 h-10 bg-slate-200 shrink-0 flex items-center justify-center text-[8px]">Obstacle</div>
       <Button {...args} variant="primary" startIcon="bolt">Very Long Action Name</Button>
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="energy">Energy IA</Button>
      <Button variant="danger">Danger</Button>
    </div>
  ),
};