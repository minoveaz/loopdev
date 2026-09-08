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

  const sizeClasses =
    size === 'sm' ? 'px-2 py-0.5 text-[11px] gap-1' : 'px-2.5 py-1 text-xs gap-1.5';
  const iconSize = size === 'sm' ? 12 : 14;

  if (isVerified) {
    return (
      <span
        className={`border-status-success/30 bg-status-success/10 text-status-success inline-flex items-center rounded-full border font-medium ${sizeClasses} ${className}`}
        title="Identidad verificada"
      >
        <span
          className="bg-status-success h-1.5 w-1.5 animate-pulse rounded-full"
          aria-hidden="true"
        />
        <ShieldCheck size={iconSize} strokeWidth={2} className="text-status-success" />
        <span>Verificado</span>
      </span>
    );
  }

  return (
    <span
      className={`border-status-warning/30 bg-status-warning/10 text-status-warning inline-flex items-center rounded-full border font-medium ${sizeClasses} ${className}`}
      title="Identidad pendiente de validación"
    >
      <span className="bg-status-warning h-1.5 w-1.5 rounded-full" aria-hidden="true" />
      <Clock size={iconSize} strokeWidth={2} className="text-status-warning" />
      <span>Pendiente</span>
    </span>
  );
}
