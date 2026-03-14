'use client';

import React from 'react';
import { LpdText, cn } from '@loopdev/ui';
import { ColorToken } from '../../types';
import { InspectionDoDont } from './shared/InspectionDoDont';
import { getContrastRatio, getWCAGStatus } from '@/utils/color';

interface ColorTokenInspectorProps {
  token: ColorToken;
  theme: 'light' | 'dark';
  activeTab: string;
}

export const ColorTokenInspector: React.FC<ColorTokenInspectorProps> = ({ 
  token, 
  theme, 
  activeTab 
}) => {
  const resolvedHex = theme === 'light' ? token.resolvesTo.light : token.resolvesTo.dark;
  
  // Tab: EXPLAIN (The Oracle)
  if (activeTab === 'explain') {
    const guidances: any = {
      'brand.primary': [
        { type: 'do', label: 'Actions', description: 'Use for primary buttons, active links and structural brand markers.' },
        { type: 'dont', label: 'Passive Text', description: 'Avoid using for long paragraphs on dark backgrounds.' }
      ],
      'brand.secondary': [
        { type: 'do', label: 'Highlights', description: 'Perfect for small accents, AI status indicators and highlighting keywords.' },
        { type: 'dont', label: 'Small Text', description: 'Never use Energy Yellow for body text on white backgrounds.' }
      ],
      'default': [
        { type: 'do', label: 'Semantic Role', description: `This color is categorized as ${token.group}. Use it according to its defined intent.` },
        { type: 'dont', label: 'Out-of-context', description: 'Do not bypass token mappings by using hardcoded hex values.' }
      ]
    };

    const items = guidances[token.name] || guidances.default;

    return (
      <div className="flex flex-col gap-6 animate-in slide-in-from-right-4 duration-300">
        <LpdText size="xs" className="text-text-muted leading-relaxed">
          The <span className="text-primary font-bold">{token.name}</span> token is a controlled asset. Below are the governing rules for its application in the LoopDev ecosystem.
        </LpdText>
        <InspectionDoDont items={items} />
      </div>
    );
  }

  // Tab: VALIDATION (Technical Audit)
  if (activeTab === 'validation') {
    const baseline = theme === 'light' ? '#ffffff' : '#0d121b';
    const ratio = getContrastRatio(resolvedHex, baseline);
    const status = getWCAGStatus(ratio);

    return (
      <div className="flex flex-col gap-8 animate-in slide-in-from-right-4 duration-300">
        <div className="p-6 rounded-2xl border border-border-technical bg-background-subtle flex flex-col items-center gap-4">
          <LpdText size="nano" className="text-text-muted uppercase tracking-widest">Calculated Contrast Ratio</LpdText>
          <div className="text-5xl font-black text-text-main tracking-tighter">
            {ratio.toFixed(2)}:1
          </div>
          <div className={cn(
            "px-4 py-1 rounded-full text-xs font-bold uppercase border",
            status === 'FAIL' ? "bg-red-500/10 text-red-600 border-red-500/20" : "bg-green-500/10 text-green-600 border-green-500/20"
          )}>
            WCAG 2.1 {status}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <LpdText size="xs" weight="bold" className="text-text-main uppercase">Simulated Usage</LpdText>
          <div className="p-4 rounded-xl border border-border-technical flex flex-col gap-4" style={{ backgroundColor: baseline }}>
             <div style={{ color: resolvedHex }}>
                <LpdText size="lg" weight="bold">Headline Preview</LpdText>
                <LpdText size="xs">This is how a small paragraph looks using this token as text color over the current surface.</LpdText>
             </div>
          </div>
        </div>
      </div>
    );
  }

  // Default: CONTEXT
  return (
    <div className="flex flex-col gap-6 animate-in slide-in-from-right-4 duration-300">
      <div className="flex flex-col gap-1">
        <LpdText size="nano" className="text-text-muted uppercase tracking-widest">Token ID</LpdText>
        <LpdText size="sm" weight="bold" className="font-mono text-primary">{token.id}</LpdText>
      </div>
      <div className="flex flex-col gap-1">
        <LpdText size="nano" className="text-text-muted uppercase tracking-widest">Description</LpdText>
        <LpdText size="xs" className="text-text-main leading-relaxed">{token.description || 'No technical description provided.'}</LpdText>
      </div>
      <div className="grid grid-cols-2 gap-4 pt-4">
        <div className="p-3 rounded-xl border border-border-technical bg-background-subtle">
          <LpdText size="nano" className="text-text-muted uppercase mb-1">Light Val</LpdText>
          <LpdText size="xs" weight="bold" className="font-mono">{token.resolvesTo.light}</LpdText>
        </div>
        <div className="p-3 rounded-xl border border-border-technical bg-background-subtle">
          <LpdText size="nano" className="text-text-muted uppercase mb-1">Dark Val</LpdText>
          <LpdText size="xs" weight="bold" className="font-mono">{token.resolvesTo.dark}</LpdText>
        </div>
      </div>
    </div>
  );
};
