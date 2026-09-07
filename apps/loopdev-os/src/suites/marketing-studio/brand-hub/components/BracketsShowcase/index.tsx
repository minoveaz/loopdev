'use client';

import React from 'react';
import { BracketsShowcaseProps } from './types';
import { Heading, LpdText } from '@loopdev/ui';

/**
 * @component BracketsShowcase
 * @description Educational component explaining the usage of Brackets { } in the design system.
 * Ported from Labdev blueprint.
 */
export const BracketsShowcase: React.FC<BracketsShowcaseProps> = () => {
  return (
    <div className="flex flex-col gap-6">
      
      {/* 1. HERO & CONTEXT */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        
        {/* Visual Hero */}
        <div className="border-border-technical bg-background-surface dark:bg-background-laboratory group relative flex min-h-[320px] flex-col items-center justify-center overflow-hidden rounded-3xl border">
          {/* Grid Background */}
          <div className="bg-background-subtle/30 pointer-events-none absolute inset-0 bg-[size:40px_40px] opacity-30"></div>
          
          <div className="text-text-main relative z-10 flex select-none items-center font-mono text-6xl font-bold tracking-tighter md:text-8xl">
            <span className="text-primary mr-4 transition-transform duration-700 group-hover:-translate-x-4">{`{`}</span>
            <span className="text-text-muted font-sans text-2xl font-semibold uppercase tracking-widest md:text-4xl">System</span>
            <span className="text-primary ml-4 transition-transform duration-700 group-hover:translate-x-4">{`}`}</span>
          </div>
          
          <div className="absolute bottom-6 w-full text-center">
            <LpdText size="nano" className="text-text-muted font-mono uppercase tracking-widest">
              Fig 2.1 — Modular Containment
            </LpdText>
          </div>
        </div>

        {/* Text Context */}
        <div className="flex flex-col gap-4">
          <div className="bg-background-surface border-border-technical flex-1 rounded-3xl border p-8">
            <Heading as="h2" size="lg" weight="bold" className="text-text-main mb-3">Concept & Role</Heading>
            <LpdText size="sm" className="text-text-muted mb-6 leading-relaxed">
              The curly brackets <span className="text-text-main bg-background-subtle rounded px-1 font-mono">{`{}`}</span> serve as a supporting brand element representing <strong>containment</strong> and <strong>modular systems</strong>. They visually frame content, signaling that the enclosed elements are part of a calculated, generative process.
            </LpdText>
            
            <div className="bg-background-subtle/50 border-border-technical rounded-xl border p-4">
              <LpdText size="xs" weight="bold" className="text-text-muted mb-1 uppercase">Relationship to Isotype</LpdText>
              <LpdText size="xs" className="text-text-muted">
                The brackets are a structural device, not a logo substitute. They do not compete with the isotype but support it.
              </LpdText>
            </div>
          </div>

          <div className="bg-background-surface border-border-technical flex-1 rounded-3xl border p-8">
            <div className="mb-4 flex items-center justify-between">
              <LpdText size="xs" weight="bold" className="text-text-muted uppercase tracking-wider">Usage Guidelines</LpdText>
            </div>
            <ul className="space-y-3">
              <li className="text-text-muted flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span>
                <LpdText size="sm"><strong>Editorial:</strong> Framing keywords like <span className="text-text-main font-mono">{`{ systems }`}</span>.</LpdText>
              </li>
              <li className="text-text-muted flex items-start gap-3">
                <span className="material-symbols-outlined text-danger text-[18px]">cancel</span>
                <LpdText size="sm"><strong>Don&apos;t:</strong> Use as a standalone logo or purely for decoration.</LpdText>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 2. SEMANTIC VARIANTS */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="border-primary/20 bg-primary/5 flex items-center gap-4 rounded-2xl border p-4">
          <div className="bg-primary flex h-12 w-12 items-center justify-center rounded-xl font-mono text-xl font-bold text-white">{`{`}</div>
          <div>
            <LpdText size="sm" weight="bold" className="text-text-main">Structure</LpdText>
            <LpdText size="xs" className="text-text-muted">Primary Blue</LpdText>
          </div>
        </div>
        <div className="border-energy-yellow/20 bg-energy-yellow/5 flex items-center gap-4 rounded-2xl border p-4">
          <div className="bg-energy-yellow text-text-main flex h-12 w-12 items-center justify-center rounded-xl font-mono text-xl font-bold">{`{`}</div>
          <div>
            <LpdText size="sm" weight="bold" className="text-text-main">Emphasis</LpdText>
            <LpdText size="xs" className="text-text-muted">Brand Yellow</LpdText>
          </div>
        </div>
        <div className="border-border-technical bg-background-surface flex items-center gap-4 rounded-2xl border p-4">
          <div className="bg-background-subtle border-border-technical text-text-muted flex h-12 w-12 items-center justify-center rounded-xl border font-mono text-xl font-bold">{`{`}</div>
          <div>
            <LpdText size="sm" weight="bold" className="text-text-main">Containment</LpdText>
            <LpdText size="xs" className="text-text-muted">Neutral Tones</LpdText>
          </div>
        </div>
      </div>

    </div>
  );
};
