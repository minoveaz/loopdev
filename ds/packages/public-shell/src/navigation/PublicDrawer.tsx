'use client';

import React, { useEffect } from 'react';
import { clsx } from 'clsx';
import { X } from 'lucide-react';
import type { PublicDrawerProps } from './types';

export const PublicDrawer: React.FC<PublicDrawerProps> = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Body */}
      <div className="relative z-10 w-full max-w-xs bg-white h-full shadow-2xl flex flex-col p-5 overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <h2 className="text-lg font-bold text-slate-900">{title ?? 'Menú'}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar menú"
            className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
};
