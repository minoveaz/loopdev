'use client';

import React from 'react';
import { clsx } from 'clsx';
import type { PublicSidebarProps } from './types';

export const PublicSidebar: React.FC<PublicSidebarProps> = ({ title, children, className }) => {
  return (
    <aside
      aria-label={title ?? 'Panel lateral'}
      className={clsx(
        'bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm',
        'sticky top-20 flex flex-col gap-4',
        className,
      )}
    >
      {title && <h2 className="text-base font-semibold text-slate-900 px-1">{title}</h2>}
      <div className="flex flex-col gap-3">{children}</div>
    </aside>
  );
};
