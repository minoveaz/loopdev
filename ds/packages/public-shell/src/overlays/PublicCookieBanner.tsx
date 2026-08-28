'use client';

import React, { useState } from 'react';
import { clsx } from 'clsx';
import { Cookie } from 'lucide-react';
import { usePublicAnalytics } from '../analytics/usePublicAnalytics';
import type { PublicCookieBannerProps } from './types';

export const PublicCookieBanner: React.FC<PublicCookieBannerProps> = ({
  title = 'Respetamos tu privacidad',
  description = 'Utilizamos cookies propias y de terceros para analizar el tráfico y mejorar tu experiencia según nuestras preferencias de privacidad.',
  privacyPolicyUrl = '/politica-privacidad',
  onAcceptAll,
  onRejectNonEssential,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const { updateConsent } = usePublicAnalytics();

  if (!isVisible) return null;

  const handleAcceptAll = () => {
    updateConsent({
      ad_storage: 'granted',
      analytics_storage: 'granted',
      ad_user_data: 'granted',
      ad_personalization: 'granted',
    });
    setIsVisible(false);
    onAcceptAll?.();
  };

  const handleRejectNonEssential = () => {
    updateConsent({
      ad_storage: 'denied',
      analytics_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    });
    setIsVisible(false);
    onRejectNonEssential?.();
  };

  return (
    <aside
      aria-label="Consentimiento de cookies"
      className={clsx(
        'fixed bottom-20 sm:bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50',
        'bg-white border border-slate-200 rounded-3xl p-5 shadow-2xl',
        'flex flex-col gap-4 animate-in slide-in-from-bottom-5 duration-300',
      )}
    >
      <div className="flex items-start gap-3.5">
        <div className="p-2.5 rounded-2xl bg-slate-100 text-[var(--lpd-brand-primary)] flex-shrink-0">
          <Cookie className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900">{title}</h3>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">{description}</p>
          {privacyPolicyUrl && (
            <a
              href={privacyPolicyUrl}
              className="text-xs font-semibold text-[var(--lpd-brand-primary)] hover:underline mt-1.5 inline-block"
            >
              Más información sobre cookies
            </a>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 pt-1">
        <button
          type="button"
          onClick={handleRejectNonEssential}
          className="flex-1 py-2.5 px-3 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors min-h-[40px]"
        >
          Solo esenciales
        </button>
        <button
          type="button"
          onClick={handleAcceptAll}
          className="flex-1 py-2.5 px-3 text-xs font-semibold text-white bg-[var(--lpd-brand-primary)] hover:bg-[var(--lpd-brand-primary-hover)] rounded-xl transition-colors shadow-sm min-h-[40px]"
        >
          Aceptar todas
        </button>
      </div>
    </aside>
  );
};
