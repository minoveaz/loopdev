import React from 'react';
import { Stack, Inline, Box } from '../layout';
import { Button } from '../atoms';
import { FolderIcon } from 'lucide-react';

/**
 * @component OverviewHeader
 * @description Official high-fidelity header migrated via LoopDev Automator.
 */
export const OverviewHeader = () => {
  return (
    <Box as="header" className="border-b border-[var(--lpd-color-border-subtle)] pb-10 mb-12">
      <div className="flex flex-col gap-6 md:flex-row md:items-end justify-between max-w-6xl mx-auto px-8">
        
        {/* LEFT: Identity */}
        <Stack gap={4} className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--lpd-color-brand-primary)]/10 border border-[var(--lpd-color-brand-primary)]/20 w-fit">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--lpd-color-brand-primary)] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--lpd-color-brand-primary)]"></span>
            </span>
            <span className="text-[10px] font-bold text-[var(--lpd-color-brand-primary)] tracking-widest uppercase">
              SYSTEM UPDATED: 2025.12.29
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-[1.1] text-slate-900">
            Visual Identity System
          </h1>
          
          <p className="text-slate-500 text-lg leading-relaxed max-w-xl font-medium">
            A scalable, generative design system for loop.dev. Built for continuous improvement, technical precision, and automated workflows.
          </p>
        </Stack>

        {/* RIGHT: Actions */}
        <Box className="pb-2">
          <Button 
            variant="primary"
            leftIcon={<FolderIcon size={18} />}
            className="px-6 h-11 rounded-xl shadow-xl shadow-indigo-500/20 active:scale-95 transition-all"
          >
            Assets
          </Button>
        </Box>

      </div>
    </Box>
  );
};