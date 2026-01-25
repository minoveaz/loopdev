'use client';

import React from 'react';
import { RuleSeverity } from '@loopdev/contracts';
import { clsx } from 'clsx';

interface SeverityBadgeProps {
  severity: RuleSeverity;
}

/**
 * @atom SeverityBadge
 * @description Operational indicator for rule enforcement (Warning vs Blocking).
 */
export const SeverityBadge: React.FC<SeverityBadgeProps> = ({ severity }) => {
  const isBlock = severity === 'BLOCK';
  
  return (
    <span className={clsx(
      "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-black tracking-tighter uppercase border",
      isBlock 
        ? "bg-red-500/10 text-red-600 border-red-500/20" 
        : "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
    )}>
      <span className={clsx("w-1.5 h-1.5 rounded-full", isBlock ? "bg-red-500" : "bg-yellow-500")}></span>
      {severity}
    </span>
  );
};
