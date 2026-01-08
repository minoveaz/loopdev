import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Z_INDEX } from './index';
import { CertificationStamp } from '../..';

const ZIndexShowcase = () => {
  const layers = Object.entries(Z_INDEX).sort((a, b) => a[1] - b[1]);

  return (
    <div className="w-full max-w-2xl bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-3xl p-12 flex flex-col items-center justify-center relative overflow-hidden min-h-[500px] shadow-sm shadow-blue-900/5">
      <div className="absolute inset-0 bg-grid-40 opacity-[0.08] dark:opacity-[0.1] pointer-events-none" />
      
      <div className="relative w-full max-w-md flex flex-col-reverse items-center z-10">
        {layers.map(([name, value], index) => (
          <div 
            key={name}
            className="relative w-full transition-all duration-500 hover:-translate-y-2 cursor-help group"
            style={{ 
              height: '40px',
              marginTop: index === 0 ? '0' : '-20px',
              zIndex: value
            }}
          >
            <div className={`
              absolute inset-0 rounded-xl border border-slate-200 dark:border-white/10 backdrop-blur-md flex items-center justify-between px-6 shadow-xl
              ${name === 'base' ? 'bg-white dark:bg-slate-800' : 'bg-primary/5 dark:bg-primary/10'}
              ${name === 'priority' ? 'bg-accent text-text-main border-accent/50' : 'text-text-main dark:text-white'}
              group-hover:border-primary/50 group-hover:bg-white dark:group-hover:bg-primary/20 transition-colors
            `}>
              <div className="flex items-center gap-3">
                 <code className="bg-black/5 dark:bg-white/10 px-1.5 py-0.5 rounded text-[10px] font-mono">{value}</code>
                 <span className="text-[10px] font-black uppercase tracking-widest">{name}</span>
              </div>
              <span className="text-[9px] opacity-40 font-mono">layer_{index.toString().padStart(2, '0')}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 text-center relative z-10">
         <p className="text-xs text-text-muted italic">
           Vertical Stacking Protocol v3.8
         </p>
      </div>
    </div>
  );
};

const meta: Meta = {
  title: 'Atoms/Foundations/ZIndex',
  component: ZIndexShowcase,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div className="relative w-full min-h-[700px] flex flex-col items-center justify-center p-8">
        <div className="absolute top-8 left-8 z-50">
          <CertificationStamp 
            status="experimental"
            version="v1.0.0" 
            phase={0} 
            date="2026-01-01" 
            className="scale-90 origin-top-left opacity-90 hover:opacity-100 transition-opacity shadow-2xl"
          />
        </div>
        <div className="flex items-center justify-center w-full h-full pt-32">
          <Story />
        </div>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ZIndexShowcase>;

export const Showcase: Story = {};
