'use client';

import React from 'react';
import { getContactInitials, getAvatarColorStyles } from '../types';

interface ContactAvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  showStatusDot?: boolean;
  statusDotColor?: 'emerald' | 'amber' | 'slate';
  className?: string;
}

export function ContactAvatar({
  name,
  size = 'md',
  showStatusDot = false,
  statusDotColor = 'emerald',
  className = '',
}: ContactAvatarProps) {
  const initials = getContactInitials(name);
  const colorStyles = getAvatarColorStyles(name);

  const sizeClasses = {
    sm: 'w-7 h-7 text-[11px]',
    md: 'w-9 h-9 text-xs',
    lg: 'w-11 h-11 text-sm',
  }[size];

  const dotSizeClasses = {
    sm: 'w-2 h-2 ring-1',
    md: 'w-2.5 h-2.5 ring-2',
    lg: 'w-3 h-3 ring-2',
  }[size];

  const dotColorClasses = {
    emerald: 'bg-emerald-500 ring-white dark:ring-slate-900',
    amber: 'bg-amber-500 ring-white dark:ring-slate-900',
    slate: 'bg-slate-400 ring-white dark:ring-slate-900',
  }[statusDotColor];

  return (
    <div
      className={`relative inline-flex shrink-0 items-center justify-center rounded-full border font-medium select-none transition-transform duration-200 ${colorStyles.bg} ${colorStyles.text} ${colorStyles.border} ${sizeClasses} ${className}`}
      title={name}
      aria-label={name}
    >
      <span>{initials}</span>
      {showStatusDot && (
        <span
          className={`absolute bottom-0 right-0 rounded-full ${dotSizeClasses} ${dotColorClasses}`}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
