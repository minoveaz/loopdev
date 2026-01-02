import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './index';
import { Search, Lock, Shield } from 'lucide-react';
import { CertificationStamp } from '../CertificationStamp';
import { InfraStamp } from '../InfraStamp';
import { QualityShield } from '../QualityShield';

const meta: Meta<typeof Input> = {
  title: 'Atoms/Primitives/Input',
  component: Input,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="relative w-full min-h-[400px] flex flex-col items-center justify-center p-12 bg-slate-50 dark:bg-transparent">
        <div className="absolute top-8 left-8 flex flex-col gap-4 z-50">
          <CertificationStamp 
            status="certified"
            version="v1.0.0" 
            phase={3} 
            date="2026-01-02" 
            className="scale-90 origin-top-left opacity-90 shadow-2xl rotate-[-2deg]"
          />
          <InfraStamp 
            status="certified"
            version="v1.0.0" 
            security="RLS_OK"
            date="2026-01-02" 
            className="scale-90 origin-top-left opacity-90 shadow-2xl rotate-[2deg]"
          />
        </div>
        <div className="w-full max-w-md mx-auto pt-12">
          <Story />
        </div>
        <QualityShield metrics={{
          unit: { label: 'Unit', status: 'pass', value: '100% US' },
          a11y: { label: 'A11y', status: 'pass', value: 'WCAG AA' },
          visual: { label: 'Visual', status: 'pass', value: 'CHROMATIC' },
        }} />
      </div>
    ),
  ],
  argTypes: {
    variant: {
      control: 'select',
      options: ['outline', 'filled', 'ghost'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    label: 'Standard Field',
    placeholder: 'Type something...',
    helperText: 'Standard helper information.',
  },
};

export const SearchField: Story = {
  args: {
    variant: 'filled',
    placeholder: 'Search in neural grid...',
    startIcon: <Search size={18} />,
  },
};

export const PasswordField: Story = {
  args: {
    label: 'Secure Access',
    type: 'password',
    startIcon: <Lock size={18} />,
    defaultValue: 'industrial_password_123',
  },
};

/**
 * ESCENARIOS DE ESTRÉS INDUSTRIAL
 */
export const NarrativeOverload: Story = {
  args: {
    label: 'Label con texto extremadamente largo para probar el truncado y el layout del componente en situaciones de desbordamiento',
    helperText: 'Este texto de ayuda es demasiado largo para un input normal pero debemos ver cómo se comporta el contenedor cuando el usuario introduce una narrativa extensa en la descripción del campo.',
    defaultValue: 'Valor de prueba muy largo'.repeat(10),
    error: 'Error crítico detectado en el sistema de validación de datos del sensor industrial de la planta 4',
  },
};

export const NarrowContainer: Story = {
  render: (args) => (
    <div className="w-48 p-4 border border-dashed border-slate-300 rounded bg-white dark:bg-slate-900">
      <Input {...args} />
    </div>
  ),
  args: {
    label: 'Narrow Field',
    startIcon: <Shield size={16} />,
    placeholder: 'Too small?',
    isLoading: true,
  },
};

