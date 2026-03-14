'use client';

import React from 'react';
import { RuleDomain } from '@loopdev/contracts';
import { clsx } from 'clsx';

interface DomainBadgeProps {
  domain: RuleDomain;
  size?: 'xs' | 'sm';
}

const DOMAIN_CONFIG: Record<RuleDomain, { label: string; classes: string }> = {
  identity: { label: 'Identity', classes: 'bg-blue-500/10 text-blue-600 border-blue-500/20' },
  visual: { label: 'Visual', classes: 'bg-purple-500/10 text-purple-600 border-purple-500/20' },
  typography: { label: 'Typography', classes: 'bg-amber-500/10 text-amber-600 border-amber-500/20' },
  content: { label: 'Content', classes: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' },
};

/**
 * @atom DomainBadge
 * @description Small indicator for the rule's governance domain.
 */
export const DomainBadge: React.FC<DomainBadgeProps> = ({ domain, size = 'xs' }) => {
  const config = DOMAIN_CONFIG[domain];
  
  return (
    <span className={clsx(
      "inline-flex items-center rounded-md border font-bold uppercase tracking-wider",
      config.classes,
      size === 'xs' ? "px-1.5 py-0.5 text-[9px]" : "px-2 py-1 text-[10px]"
    )}>
      {config.label}
    </span>
  );
};
