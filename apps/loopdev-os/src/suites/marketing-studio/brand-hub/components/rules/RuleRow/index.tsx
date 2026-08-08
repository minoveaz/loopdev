'use client';

import React from 'react';
import { RuleRowProps } from './types';
import { Heading, LpdText } from '@loopdev/ui';
import { DomainBadge } from '../DomainBadge';
import { SeverityBadge } from '../SeverityBadge';
import { clsx } from 'clsx';

/**
 * @molecule RuleRow
 * @description Operational row for the rules list.
 * Displays declarative logic and enforcement status.
 */
export const RuleRow: React.FC<RuleRowProps> = ({ rule, isSelected, onClick }) => {
  const isDisabled = rule.status === 'disabled';

  return (
    <div 
      onClick={onClick}
      className={clsx(
        "group flex items-center justify-between p-4 rounded-xl border transition-all duration-200 cursor-pointer",
        isSelected 
          ? "bg-primary/5 border-primary shadow-sm" 
          : "bg-background-surface border-border-technical hover:border-primary/30",
        isDisabled && "opacity-50 grayscale"
      )}
    >
      <div className="flex items-center gap-4 flex-1">
        {/* Status indicator */}
        <div className={clsx(
          "w-1 h-10 rounded-full",
          isSelected ? "bg-primary" : "bg-transparent group-hover:bg-primary/20"
        )} />

        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Heading as="h3" size="sm" weight="bold" className="text-text-main">
              {rule.name}
            </Heading>
            <DomainBadge domain={rule.domain} />
          </div>
          
          <div className="flex items-center gap-2 font-mono text-[10px] text-text-muted">
            <span className="uppercase tracking-widest">{rule.scope.target}</span>
            <span className="opacity-30">|</span>
            <span className="text-primary font-bold">{rule.logic.metric}</span>
            <span className="text-text-main">{rule.logic.operator}</span>
            <span className="bg-background-subtle px-1 rounded border border-border-technical">
              {String(rule.logic.threshold)}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex flex-col items-end gap-1">
          <SeverityBadge severity={rule.enforcement.severity} />
          <LpdText size="nano" className="text-text-muted/50 font-mono italic">
            Updated {new Date(rule.updatedAt).toLocaleDateString()}
          </LpdText>
        </div>
        
        <span className={clsx(
          "material-symbols-outlined text-sm transition-transform group-hover:translate-x-1",
          isSelected ? "text-primary" : "text-text-muted/30"
        )}>
          chevron_right
        </span>
      </div>
    </div>
  );
};
