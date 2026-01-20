'use client';

import React from 'react';
import { LpdText } from '@loopdev/ui';
import { calculateTypeScale } from './utils';
import { clsx } from 'clsx';

interface ScaleLevel {
  label: string;
  tag: string;
  power: number; // The exponent for the scale ratio (e.g., 3 for H1, 2 for H2)
  weight: number;
  usage: string;
}

interface TypeScaleTableProps {
  baseSize: number;
  scaleRatio: number;
  primaryFont: string;
}

const SCALE_LEVELS: ScaleLevel[] = [
  { label: 'Display H1', tag: 'H1', power: 3, weight: 900, usage: 'Page titles, Hero sections.' },
  { label: 'Heading H2', tag: 'H2', power: 2, weight: 700, usage: 'Section titles, Major divisions.' },
  { label: 'Heading H3', tag: 'H3', power: 1, weight: 700, usage: 'Card titles, Subsection headers.' },
  { label: 'Body Text', tag: 'P', power: 0, weight: 400, usage: 'Standard content, Articles, Main UI.' },
  { label: 'Caption / Label', tag: 'Small', power: -1, weight: 500, usage: 'Form labels, Metadata, Tooltips.' },
];

/**
 * @component TypeScaleTable
 * @description A dynamic calculator and preview for the brand's typographic hierarchy.
 * Calculates px/rem values based on a mathematical scale ratio.
 */
export const TypeScaleTable: React.FC<TypeScaleTableProps> = ({
  baseSize,
  scaleRatio,
  primaryFont
}) => {
  
  return (
    <div className="w-full bg-background-surface dark:bg-background-laboratory border border-border-technical/50 rounded-3xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-background-subtle/30 dark:bg-surface-glass border-b border-border-technical/30 text-[10px] uppercase text-text-muted font-bold tracking-widest">
            <tr>
              <th className="px-8 py-5 w-1/3">Scale & Preview</th>
              <th className="px-8 py-5">Technical Specs</th>
              <th className="px-8 py-5">Operational Usage</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-technical/20">
            {SCALE_LEVELS.map((level) => {
              const sizes = calculateTypeScale(baseSize, scaleRatio, level.power);
              
              return (
                <tr key={level.tag} className="hover:bg-background-subtle/20 dark:hover:bg-white/5 transition-colors group">
                  {/* PREVIEW COLUMN */}
                  <td className="px-8 py-8">
                    <div 
                      className="text-text-main truncate max-w-sm"
                      style={{ 
                        fontFamily: primaryFont,
                        fontSize: `${sizes.px}px`,
                        fontWeight: level.weight,
                        lineHeight: 1.2
                      }}
                    >
                      {level.label}
                    </div>
                  </td>

                  {/* SPECS COLUMN */}
                  <td className="px-8 py-8">
                    <div className="flex flex-col gap-1.5 font-mono">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-text-muted/60 uppercase">Size:</span>
                        <span className="text-xs font-bold text-text-main">{sizes.px}px / {sizes.rem}rem</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-text-muted/60 uppercase">Weight:</span>
                        <span className="text-xs text-text-muted">{level.weight}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-text-muted/60 uppercase">Token:</span>
                        <span className="px-1.5 py-0.5 rounded bg-primary/5 text-primary text-[9px] font-bold border border-primary/10">
                          text-{level.tag.toLowerCase()}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* USAGE COLUMN */}
                  <td className="px-8 py-8">
                    <LpdText size="sm" className="text-text-muted max-w-xs leading-relaxed italic">
                      {level.usage}
                    </LpdText>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
