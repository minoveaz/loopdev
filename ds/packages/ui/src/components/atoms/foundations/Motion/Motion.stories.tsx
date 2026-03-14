import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { MOTION } from './index';
import { CertificationStamp } from '../..';

const MotionShowcase = () => {
  const [selectedDuration, setSelectedDuration] = useState<keyof typeof MOTION.duration>('standard');
  const [selectedEasing, setSelectedEasing] = useState<keyof typeof MOTION.easing>('standard');
  const [playCount, setPlayCount] = useState(0);

  const triggerAnimation = () => setPlayCount(prev => prev + 1);

  return (
    <div className="space-y-8 w-full max-w-4xl relative z-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Panel de Controles */}
        <div className="space-y-6">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-3 block">Durations</span>
            <div className="grid grid-cols-2 gap-2">
              {Object.keys(MOTION.duration).map((d) => (
                <button
                  key={d}
                  onClick={() => setSelectedDuration(d as any)}
                  className={`px-3 py-2 rounded-lg text-[10px] font-mono border transition-all ${
                    selectedDuration === d 
                    ? 'bg-primary border-primary text-white shadow-lg' 
                    : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/5 text-text-muted hover:border-primary/30'
                  }`}
                >
                  {d} ({MOTION.duration[d as keyof typeof MOTION.duration]})
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-3 block">Easing Curves</span>
            <div className="space-y-2">
              {Object.keys(MOTION.easing).map((e) => (
                <button
                  key={e}
                  onClick={() => setSelectedEasing(e as any)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-[10px] font-mono border transition-all ${
                    selectedEasing === e 
                    ? 'bg-primary/10 border-primary/30 text-primary' 
                    : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/5 text-text-muted hover:border-primary/30'
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={triggerAnimation}
            className="w-full py-3 bg-accent text-text-main font-black rounded-xl shadow-lg hover:scale-[1.02] active:scale-95 transition-all uppercase text-xs tracking-widest"
          >
            Play Momentum
          </button>
        </div>

        {/* Sandbox de Animación */}
        <div className="lg:col-span-2 bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-3xl p-12 flex flex-col items-center justify-center relative overflow-hidden min-h-[350px] shadow-sm shadow-blue-900/5">
          <div className="absolute inset-0 bg-grid-40 opacity-[0.08] dark:opacity-[0.1] pointer-events-none" />
          <div className="relative w-full h-1 bg-slate-100 dark:bg-white/5 rounded-full mb-20 max-w-md">
            <div 
              key={playCount}
              className="absolute top-1/2 -translate-y-1/2 left-0 w-16 h-16 bg-primary rounded-2xl shadow-2xl shadow-primary/40 flex items-center justify-center text-white transition-all ring-4 ring-white dark:ring-surface-dark"
              style={{
                left: playCount % 2 === 0 ? '0%' : '100%',
                transform: `translate(${playCount % 2 === 0 ? '0%' : '-100%'}, -50%)`,
                transitionDuration: MOTION.duration[selectedDuration],
                transitionTimingFunction: MOTION.easing[selectedEasing]
              }}
            >
              <span className="material-symbols-outlined text-3xl">all_inclusive</span>
            </div>
          </div>

          <div className="text-center space-y-2 relative z-10">
             <div className="inline-block px-3 py-1 rounded bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 font-mono text-[10px] text-primary">
               all {MOTION.duration[selectedDuration]} {selectedEasing}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const meta: Meta = {
  title: 'Atoms/Foundations/Motion',
  component: MotionShowcase,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div className="relative w-full min-h-[600px] flex flex-col items-center justify-center p-8">
        <div className="absolute top-8 left-8 z-50">
          <CertificationStamp 
            status="experimental"
            version="v1.0.0" 
            phase={0} 
            date="2026-01-01" 
            className="scale-90 origin-top-left opacity-90 hover:opacity-100 transition-opacity shadow-2xl"
          />
        </div>
        <div className="flex items-center justify-center w-full h-full pt-24">
          <Story />
        </div>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof MotionShowcase>;

export const Showcase: Story = {};
