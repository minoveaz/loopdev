'use client';

import React from 'react';
import { LpdText } from '@loopdev/ui';
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
  onFieldClick,
}) => {
  return (
    <div className="border-border-technical bg-background-surface flex flex-col gap-10 rounded-2xl border p-8">
      <div className="border-border-technical/30 flex items-center justify-between border-b pb-4">
        <LpdText size="sm" weight="bold" className="text-text-main uppercase tracking-tight">
          Brand Narrative Foundation
        </LpdText>
        {isEditable && (
          <LpdText size="nano" className="animate-pulse font-bold uppercase text-yellow-500">
            {'// DRAFT_MODE_ACTIVE'}
          </LpdText>
        )}
      </div>

      <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
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
            <LpdText
              size="nano"
              weight="bold"
              className="text-text-muted uppercase tracking-widest opacity-60"
            >
              Operating Principles
            </LpdText>
            <div className="grid grid-cols-1 gap-3">
              {data.values.map((val, i) => (
                <div
                  key={i}
                  className="border-border-technical/50 bg-background-subtle/30 rounded-xl border p-3"
                >
                  <LpdText size="xs" weight="bold" className="text-text-main">
                    {val.title}
                  </LpdText>
                  <LpdText size="xs" className="text-text-muted opacity-60">
                    {val.description}
                  </LpdText>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
