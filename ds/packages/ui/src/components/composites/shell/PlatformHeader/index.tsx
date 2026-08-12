'use client';

import React from 'react';
import type { PlatformHeaderProps } from './types';

export const PlatformHeader: React.FC<PlatformHeaderProps> = ({
  identitySlot,
  contextSlot,
  environmentSlot,
  primaryActionSlot,
  searchSlot,
  controlsSlot,
  profileSlot,
  isInert = false,
  className = '',
}) => {
  return (
    <div
      className={`border-border-technical bg-shell-canvas relative flex h-full min-w-0 items-center gap-2 border-b px-3 text-slate-900 shadow-sm transition-colors md:gap-3 md:px-5 dark:text-white ${isInert ? 'pointer-events-none' : ''} ${className}`}
      role="banner"
      aria-hidden={isInert}
    >
      <div className="flex min-w-0 shrink items-center gap-2">{identitySlot}</div>

      {contextSlot && <div className="hidden min-w-0 shrink items-center md:flex">{contextSlot}</div>}

      {environmentSlot && (
        <div className="hidden min-w-0 shrink items-center lg:flex">{environmentSlot}</div>
      )}

      {searchSlot && (
        <div className="absolute left-1/2 hidden w-[min(32rem,36vw)] -translate-x-1/2 items-center lg:flex">
          {searchSlot}
        </div>
      )}

      <div className="ml-auto flex min-w-0 items-center justify-end gap-1 md:gap-2">
        {primaryActionSlot && <div className="hidden md:flex">{primaryActionSlot}</div>}
        {controlsSlot && <div className="flex items-center gap-1">{controlsSlot}</div>}
        {profileSlot && <div className="shrink-0">{profileSlot}</div>}
      </div>
    </div>
  );
};

export * from './types';
