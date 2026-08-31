'use client';

import React from 'react';
import { clsx } from 'clsx';
import { CheckCircle2, Lock, ShieldCheck, Sparkles } from 'lucide-react';
import type { TrustBadgeBarProps } from './types';

const defaultIconMap: Record<string, React.FC<{ className?: string }>> = {
  shield: ShieldCheck,
  lock: Lock,
  check: CheckCircle2,
  sparkles: Sparkles,
};

export const TrustBadgeBar: React.FC<TrustBadgeBarProps> = ({ badges, className }) => {
  return (
    <div
      className={clsx(
        'w-full py-4 px-6 bg-slate-50 border border-slate-200/80 rounded-2xl',
        'grid grid-cols-2 md:grid-cols-4 gap-4 items-center justify-items-center',
        className,
      )}
    >
      {badges.map((badge) => {
        const Icon = defaultIconMap[badge.iconName ?? 'check'] ?? CheckCircle2;
        return (
          <div key={badge.id} className="flex items-center gap-2.5 text-slate-700">
            <Icon className="w-5 h-5 text-[var(--lpd-brand-primary)] flex-shrink-0" />
            <span className="text-xs font-semibold tracking-tight">{badge.label}</span>
          </div>
        );
      })}
    </div>
  );
};
