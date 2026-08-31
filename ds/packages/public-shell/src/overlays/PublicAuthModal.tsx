'use client';

import React, { useEffect } from 'react';
import { clsx } from 'clsx';
import { X } from 'lucide-react';
import { useBrandTheme } from '../theme/useBrandTheme';
import type { PublicAuthModalProps } from './types';

export const PublicAuthModal: React.FC<PublicAuthModalProps> = ({
  isOpen,
  onClose,
  title = 'Inicia sesión o regístrate',
  subtitle = 'Conéctate para unirte a planes deportivos y chatear con tu Crew.',
  children,
}) => {
  const { theme } = useBrandTheme();

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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div
        className={clsx(
          'relative z-10 w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl',
          'border border-slate-100 flex flex-col',
          'animate-in fade-in zoom-in-95 duration-200',
        )}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar modal"
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Logo / Mark */}
        {theme.logos.markSvg && (
          <div
            className="w-12 h-12 mb-4 text-[var(--lpd-brand-primary)]"
            dangerouslySetInnerHTML={{ __html: theme.logos.markSvg }}
          />
        )}

        <h2 id="auth-modal-title" className="text-2xl font-bold tracking-tight text-slate-900">
          {title}
        </h2>
        {subtitle && <p className="text-sm text-slate-500 mt-1.5 mb-6">{subtitle}</p>}

        <div className="flex flex-col gap-4">{children}</div>
      </div>
    </div>
  );
};
