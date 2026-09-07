'use client';

import React from 'react';
import type { CrmContact } from '@loopdev/contracts';
import { ShieldCheck, Clock } from 'lucide-react';

interface ContactIdentityBadgeProps {
  status: CrmContact['identityStatus'] | string;
  size?: 'sm' | 'md';
  className?: string;
}

export function ContactIdentityBadge({
  status,
  size = 'sm',
  className = '',
}: ContactIdentityBadgeProps) {
  const isVerified = status === 'verified';

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[11px] gap-1' : 'px-2.5 py-1 text-xs gap-1.5';
  const iconSize = size === 'sm' ? 12 : 14;

  if (isVerified) {
    return (
      <span
        className={`inline-flex items-center rounded-full font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/40 ${sizeClasses} ${className}`}
        title="Identidad verificada"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
        <ShieldCheck size={iconSize} strokeWidth={2} className="text-emerald-600 dark:text-emerald-400" />
        <span>Verificado</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium bg-amber-50 text-amber-700 border border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/40 ${sizeClasses} ${className}`}
      title="Identidad pendiente de validación"
    >
      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" aria-hidden="true" />
      <Clock size={iconSize} strokeWidth={2} className="text-amber-600 dark:text-amber-400" />
      <span>Pendiente</span>
    </span>
  );
}
