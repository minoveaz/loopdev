import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Skeleton, TextSkeleton, MediaSkeleton, CardSkeleton, TableSkeleton, KanbanSkeleton, TimelineSkeleton, WidgetSkeleton, ChatFeedSkeleton, GenerativePreviewSkeleton } from './index';
import { CertificationStamp } from '../..';

const meta: Meta<typeof Skeleton> = {
  title: 'Atoms/Primitives/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div className="relative w-full min-h-[500px] flex flex-col items-center justify-center p-12 bg-slate-50 dark:bg-transparent">
        <div className="absolute top-8 left-8 z-50">
          <CertificationStamp 
            status="certified"
            version="v1.5.0" 
            phase={2} 
            date="2026-01-01" 
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
type Story = StoryObj<typeof Skeleton>;

export const AtomicShapes: Story = {
  render: () => (
    <div className="flex flex-col gap-12 items-center">
      <div className="flex items-end gap-12">
        <div className="flex flex-col items-center gap-4">
          <Skeleton variant="circle" width={64} height={64} />
          <span className="text-[10px] font-mono opacity-40">circle</span>
        </div>
        <div className="flex flex-col items-center gap-4">
          <Skeleton variant="rect" width={120} height={120} radius="lg" />
          <span className="text-[10px] font-mono opacity-40">rect (radius:lg)</span>
        </div>
        <div className="flex flex-col items-center gap-4">
          <Skeleton variant="button" width={140} height={40} />
          <span className="text-[10px] font-mono opacity-40">button</span>
        </div>
      </div>
    </div>
  ),
};

export const PresetsCollection: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full max-w-5xl mx-auto p-12">
      <div className="space-y-4">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-primary">Media Object</h4>
        <MediaSkeleton />
      </div>
      <div className="space-y-4">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-primary">Text Paragraph</h4>
        <TextSkeleton lines={4} />
      </div>
      <div className="space-y-4">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-primary">Metrics Widget</h4>
        <WidgetSkeleton />
      </div>
      <div className="space-y-4">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-primary">Chat Feed</h4>
        <ChatFeedSkeleton />
      </div>
    </div>
  ),
};

export const CardPreview: Story = {
  render: () => (
    <div className="w-80">
      <CardSkeleton />
    </div>
  ),
};

export const TablePreview: Story = {
  render: () => (
    <div className="w-full max-w-4xl">
      <TableSkeleton rows={6} />
    </div>
  ),
};

export const KanbanBoard: Story = {
  render: () => <KanbanSkeleton />,
};

export const GenerativeAIPulse: Story = {
  render: () => (
    <div className="w-full max-w-2xl">
      <GenerativePreviewSkeleton />
    </div>
  ),
};

export const TechnicalTimeline: Story = {
  render: () => (
    <div className="w-80">
      <TimelineSkeleton />
    </div>
  ),
};

/**
 * ESCENARIO DE ESTRÉS: Massive Rendering (Story 4)
 * Evalúa el impacto visual y de performance al renderizar múltiples nodos animados simultáneamente.
 */
export const StressMassiveGrid: Story = {
  render: () => (
    <div className="w-full max-w-5xl mx-auto space-y-2">
      <span className="text-[10px] font-mono text-slate-400 mb-4 block uppercase tracking-widest">Stress Case: 100+ Animated Nodes (Pulse Mode)</span>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {Array.from({ length: 48 }).map((_, i) => (
          <div key={i} className="p-4 border border-slate-100 dark:border-white/5 rounded-xl space-y-3">
            <Skeleton variant="circle" width={32} height={32} animation="pulse" />
            <Skeleton variant="rect" width="100%" height={8} animation="pulse" />
            <Skeleton variant="rect" width="60%" height={8} animation="pulse" />
          </div>
        ))}
      </div>
    </div>
  ),
};

/**
 * ESCENARIO DE ESTRÉS: Micro-Dimensions (Story 5)
 * Valida la integridad del renderizado en tamaños mínimos.
 */
export const StressMicroDimensions: Story = {
  render: () => (
    <div className="flex flex-col gap-8 items-center">
      <div className="space-y-4 w-64">
        <span className="text-[10px] font-mono text-slate-400 block text-center">Ultra-thin lines (4px)</span>
        <Skeleton variant="rect" width="100%" height={4} />
        <Skeleton variant="rect" width="80%" height={4} />
      </div>
      <div className="flex gap-4 items-center">
        <div className="flex flex-col items-center gap-2">
          <Skeleton variant="circle" width={8} height={8} />
          <span className="text-[8px] font-mono opacity-40">8px</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Skeleton variant="circle" width={4} height={4} />
          <span className="text-[8px] font-mono opacity-40">4px</span>
        </div>
      </div>
    </div>
  ),
};
