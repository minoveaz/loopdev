'use client';

import React from 'react';
import { clsx } from 'clsx';
import { X } from 'lucide-react';
import type { PublicContextPanelProps } from './types';

export const PublicContextPanel: React.FC<PublicContextPanelProps> = ({
  title,
  children,
  onClose,
  className,
}) => {
  return (
    <div
      className={clsx(
        'bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm',
        'sticky top-20 flex flex-col gap-4',
        className,
      )}
    >
      {title && (
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-base font-semibold text-slate-900">{title}</h2>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar panel"
              className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 min-h-[32px] min-w-[32px] flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  );
};
