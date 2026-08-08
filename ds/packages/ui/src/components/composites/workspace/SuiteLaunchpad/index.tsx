'use client';

import React, { useState } from 'react';
import * as LucideIcons from 'lucide-react';
import { Button, Icon, Input } from '../../../atoms';
import type { SuiteLaunchpadProps } from './types';

export type { SuiteLaunchpadProps } from './types';

export const SuiteLaunchpad: React.FC<SuiteLaunchpadProps> = ({
  title,
  description,
  primaryAction,
  quickActions,
  searchPlaceholder = 'Search in this suite... ',
  onSearch,
  children,
  className = '',
}) => {
  const [searchValue, setSearchValue] = useState('');

  return (
    <div className={`relative flex min-h-0 flex-1 flex-col overflow-hidden bg-shell-canvas ${className}`}>
      <section className="relative shrink-0 overflow-hidden border-b border-primary/15 bg-shell-surface">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/[0.2] via-blue-500/[0.13] to-indigo-500/[0.18] dark:from-primary/[0.28] dark:via-blue-500/[0.18] dark:to-indigo-500/[0.26] pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.045] dark:opacity-[0.07] pointer-events-none" style={{ backgroundImage: 'linear-gradient(to right, rgba(19,91,236,0.28) 1px, transparent 1px), linear-gradient(to bottom, rgba(19,91,236,0.28) 1px, transparent 1px)', backgroundSize: '40px 40px', maskImage: 'linear-gradient(to right, transparent, black 12%, black 88%, transparent)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 12%, black 88%, transparent)' }} />

      <div className="relative z-10 mx-auto flex max-w-[1200px] flex-col items-center px-6 py-8 text-center sm:px-10">
        <h1 className="mt-2 text-2xl font-medium tracking-tight text-text-main sm:text-3xl">{title}</h1>
        <p className="mt-2 max-w-2xl text-sm text-text-muted">{description}</p>

        <div className="mt-6 flex w-full max-w-2xl flex-col gap-3 sm:flex-row">
          <div className="min-w-0 flex-1 text-left">
            <Input
              id="suite-launchpad-search"
              value={searchValue}
              onChange={(event) => { setSearchValue(event.target.value); onSearch?.(event.target.value); }}
              placeholder={searchPlaceholder}
              startIcon={<Icon name="search" size="sm" />}
              fullWidth
              size="sm"
            />
          </div>
          {primaryAction && <Button variant="primary" size="sm" endIcon="arrow_forward" onClick={primaryAction.onClick} className="shrink-0 whitespace-nowrap">{primaryAction.label}</Button>}
        </div>

        <div className="mt-7 flex w-full flex-wrap justify-center gap-2" aria-label="Quick actions">
          {quickActions.map((action) => (
            <Button key={action.id} variant="ghost" size="sm" onClick={action.onClick} className="inline-flex items-center gap-2 border border-primary/15 bg-shell-surface/70 px-3 shadow-sm">
              {React.createElement((LucideIcons as any)[action.icon] || LucideIcons.HelpCircle, { size: 16, strokeWidth: 1.8, className: 'text-primary shrink-0' })}
              <span>{action.label}</span>
            </Button>
          ))}
        </div>
      </div>
      </section>
      {children}
    </div>
  );
};
