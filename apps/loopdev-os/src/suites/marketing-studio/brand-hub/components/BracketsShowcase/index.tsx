'use client';

import React from 'react';
import { BracketsShowcaseProps } from './types';
import { LpdText } from '@loopdev/ui';

/**
 * @component BracketsShowcase
 * @description Educational component explaining the usage of Brackets { } in the design system.
 * Ported from Labdev blueprint.
 */
export const BracketsShowcase: React.FC<BracketsShowcaseProps> = () => {
  return (
    <div className="flex flex-col gap-6">
      
      {/* 1. HERO & CONTEXT */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Visual Hero */}
        <div className="group relative overflow-hidden rounded-3xl border border-border-technical bg-background-surface dark:bg-background-laboratory min-h-[320px] flex flex-col items-center justify-center">
          {/* Grid Background */}
          <div className="absolute inset-0 opacity-30 pointer-events-none bg-[linear-gradient(rgba(120,120,120,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(120,120,120,0.1)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
          
          <div className="relative z-10 flex items-center font-mono text-6xl md:text-8xl font-bold text-text-main tracking-tighter select-none">
            <span className="text-primary mr-4 transition-transform duration-700 group-hover:-translate-x-4">{`{`}</span>
            <span className="text-2xl md:text-4xl tracking-widest uppercase text-text-muted font-sans font-semibold">System</span>
            <span className="text-primary ml-4 transition-transform duration-700 group-hover:translate-x-4">{`}`}</span>
          </div>
          
          <div className="absolute bottom-6 w-full text-center">
            <LpdText size="nano" className="font-mono text-text-muted uppercase tracking-widest">
              Fig 2.1 — Modular Containment
            </LpdText>
          </div>
        </div>

        {/* Text Context */}
        <div className="flex flex-col gap-4">
          <div className="p-8 rounded-3xl bg-background-surface border border-border-technical flex-1">
            <LpdText size="lg" weight="bold" className="text-text-main mb-3">Concept & Role</LpdText>
            <LpdText size="sm" className="text-text-muted leading-relaxed mb-6">
              The curly brackets <span className="text-text-main font-mono bg-background-subtle px-1 rounded">{`{}`}</span> serve as a supporting brand element representing <strong>containment</strong> and <strong>modular systems</strong>. They visually frame content, signaling that the enclosed elements are part of a calculated, generative process.
            </LpdText>
            
            <div className="p-4 rounded-xl bg-background-subtle/50 border border-border-technical">
              <LpdText size="xs" weight="bold" className="text-text-muted uppercase mb-1">Relationship to Isotype</LpdText>
              <LpdText size="xs" className="text-text-muted">
                The brackets are a structural device, not a logo substitute. They do not compete with the isotype but support it.
              </LpdText>
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-background-surface border border-border-technical flex-1">
            <div className="flex justify-between items-center mb-4">
              <LpdText size="xs" weight="bold" className="text-text-muted uppercase tracking-wider">Usage Guidelines</LpdText>
            </div>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-text-muted">
                <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span>
                <LpdText size="sm"><strong>Editorial:</strong> Framing keywords like <span className="font-mono text-text-main">{`{ systems }`}</span>.</LpdText>
              </li>
              <li className="flex items-start gap-3 text-text-muted">
                <span className="material-symbols-outlined text-danger text-[18px]">cancel</span>
                <LpdText size="sm"><strong>Don't:</strong> Use as a standalone logo or purely for decoration.</LpdText>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 2. SEMANTIC VARIANTS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl border border-primary/20 bg-primary/5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-white font-mono text-xl font-bold">{`{`}</div>
          <div>
            <LpdText size="sm" weight="bold" className="text-text-main">Structure</LpdText>
            <LpdText size="xs" className="text-text-muted">Primary Blue</LpdText>
          </div>
        </div>
        <div className="p-4 rounded-2xl border border-yellow-500/20 bg-yellow-500/5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-yellow-500 flex items-center justify-center text-black font-mono text-xl font-bold">{`{`}</div>
          <div>
            <LpdText size="sm" weight="bold" className="text-text-main">Emphasis</LpdText>
            <LpdText size="xs" className="text-text-muted">Brand Yellow</LpdText>
          </div>
        </div>
        <div className="p-4 rounded-2xl border border-border-technical bg-background-surface flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-background-subtle border border-border-technical flex items-center justify-center text-text-muted font-mono text-xl font-bold">{`{`}</div>
          <div>
            <LpdText size="sm" weight="bold" className="text-text-main">Containment</LpdText>
            <LpdText size="xs" className="text-text-muted">Neutral Tones</LpdText>
          </div>
        </div>
      </div>

    </div>
  );
};
