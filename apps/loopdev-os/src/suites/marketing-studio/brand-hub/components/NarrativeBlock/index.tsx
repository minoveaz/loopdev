'use client';

import React from 'react';
import { LpdText, cn } from '@loopdev/ui';
import { StructuredTextField } from '../StructuredTextField';
import { NarrativeBlockProps } from './types';

/**
 * @component NarrativeBlock
 * @description Composite for Mission, Vision, Values and Promise.
 */
export const NarrativeBlock: React.FC<NarrativeBlockProps> = ({
  data,
  isEditable,
  onUpdate,
  onFieldClick
}) => {
  return (
    <div className="flex flex-col gap-10 p-8 rounded-2xl border border-border-technical bg-background-surface">
      <div className="flex items-center justify-between border-b border-border-technical/30 pb-4">
        <LpdText size="sm" weight="bold" className="text-text-main uppercase tracking-tight">
          Brand Narrative Foundation
        </LpdText>
        {isEditable && (
          <LpdText size="nano" className="text-yellow-500 font-bold uppercase animate-pulse">
            // DRAFT_MODE_ACTIVE
          </LpdText>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="flex flex-col gap-8">
          <StructuredTextField
            label="Mission"
            description="Our primary reason for existence."
            value={data.mission}
            isEditable={isEditable}
            onValueChange={(val) => onUpdate?.('mission', val)}
            onClick={() => onFieldClick?.('mission')}
          />
          <StructuredTextField
            label="Vision"
            description="Our ultimate goal for the future."
            value={data.vision}
            isEditable={isEditable}
            onValueChange={(val) => onUpdate?.('vision', val)}
            onClick={() => onFieldClick?.('vision')}
          />
        </div>

        <div className="flex flex-col gap-8">
          <StructuredTextField
            label="Brand Promise"
            description="The single contract we make with every customer."
            value={data.promise || ''}
            isEditable={isEditable}
            onValueChange={(val) => onUpdate?.('promise', val)}
            onClick={() => onFieldClick?.('promise')}
          />
          
          <div className="flex flex-col gap-3">
            <LpdText size="nano" weight="bold" className="text-text-muted uppercase tracking-widest opacity-60">
              Operating Principles
            </LpdText>
            <div className="grid grid-cols-1 gap-3">
              {data.values.map((val, i) => (
                <div key={i} className="p-3 rounded-xl border border-border-technical/50 bg-background-subtle/30">
                  <LpdText size="xs" weight="bold" className="text-text-main">{val.title}</LpdText>
                  <LpdText size="xs" className="text-text-muted opacity-60">{val.description}</LpdText>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
