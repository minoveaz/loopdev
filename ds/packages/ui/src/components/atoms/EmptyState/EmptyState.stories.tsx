import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { EmptyState } from './index';
import { Button } from '../Button';
import { CertificationStamp } from '../CertificationStamp';

// Datos de certificación (Hardcoded for stability in Storybook environment)
const CERTIFICATION_DATA = {
  status: 'certified',
  version: 'v1.1.0',
  phase: 2,
  date: '2026-01-01'
};

const meta: Meta<typeof EmptyState> = {
  title: 'Atoms/Primitives/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    variant: {
      control: 'select',
      options: ['card', 'ghost', 'ai'],
    },
    isLoading: { control: 'boolean' },
  },
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div className="relative w-full min-h-[500px] flex flex-col items-center justify-center p-8 bg-slate-50 dark:bg-transparent">
        <div className="absolute top-8 left-8 z-50">
          <CertificationStamp 
            status={CERTIFICATION_DATA.status as any}
            version={CERTIFICATION_DATA.version} 
            phase={CERTIFICATION_DATA.phase} 
            date={CERTIFICATION_DATA.date} 
            className="scale-90 origin-top-left opacity-90 shadow-2xl"
          />
        </div>
        <div className="w-full flex items-center justify-center pt-16">
          <Story />
        </div>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof EmptyState>;

export const NoResults: Story = {
  args: {
    icon: 'manage_search',
    title: 'Zero matches in current context',
    description: "We've analyzed the technical stack but couldn't find a matching node. Try refining your filters.",
    action: <Button variant="secondary" size="sm" startIcon="filter_list">Clear Filters</Button>,
  },
};

export const AIProcessing: Story = {
  args: {
    isLoading: true,
    title: 'Generating Optimal Layout',
    loadingMessages: [
      'Analyzing component tree...',
      'Optimizing for high-density...',
      'Rendering Blueprint...'
    ],
  },
};

export const SystemOnboarding: Story = {
  args: {
    size: 'sm',
    icon: 'rocket_launch',
    iconBadge: '1',
    title: 'Initialize Workspace',
    description: 'Welcome to LoopDev. Start by creating your first technical module.',
    action: <Button variant="primary" size="sm" startIcon="add">Create Module</Button>,
  },
};

export const ErrorState: Story = {
  args: {
    variant: 'ghost',
    icon: 'cloud_off',
    title: 'Gateway Connection Lost',
    description: 'The secure tunnel to the backend engine has been interrupted.',
    action: <Button variant="outline" size="sm" startIcon="refresh">Reconnect</Button>,
  },
};

/**
 * ESCENARIO DE ESTRÉS: Narrative Overload (Story 3)
 */
export const StressNarrative: Story = {
  args: {
    icon: 'history_edu',
    title: 'Extensive System Log Output Detected',
    description: 'This is an extremely long technical description designed to test the limits of our content rendering engine. In a real-world scenario, this might happen when the system fails to parse a massive JSON payload or when an AI model returns a verbose error message that exceeds the standard layout expectations. We need to ensure that the text wraps correctly and the card maintains its architectural integrity without overflowing or breaking the centered alignment of the functional elements.',
    action: <Button variant="outline" size="sm">Export Full Log</Button>,
  },
};

/**
 * ESCENARIO DE ESTRÉS: Narrow Container (Story 4)
 */
export const StressNarrowContainer: Story = {
  args: {
    size: 'sm',
    icon: 'data_info_alert',
    title: 'Low Space Alert',
    description: 'Compact view mode.',
  },
  render: (args) => (
    <div className="w-64 border border-dashed border-slate-300 dark:border-white/10 p-4 rounded-3xl">
       <span className="text-[10px] text-slate-400 mb-4 block font-mono uppercase tracking-widest">Container: w-64</span>
       <EmptyState {...args} />
    </div>
  ),
};