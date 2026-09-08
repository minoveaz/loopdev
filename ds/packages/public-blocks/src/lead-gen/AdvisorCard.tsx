'use client';

import React from 'react';
import { clsx } from 'clsx';
import { MessageCircle, Phone } from 'lucide-react';
import type { AdvisorCardProps } from './types';

export const AdvisorCard: React.FC<AdvisorCardProps> = ({ advisor, onContact, className }) => {
  return (
    <aside
      aria-label="Contacto con asesor"
      className={clsx(
        'flex flex-col gap-4 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm',
        className,
      )}
    >
      <div className="flex items-center gap-3.5">
        <div className="relative">
          <img
            src={advisor.avatarUrl}
            alt={advisor.name}
            className="h-14 w-14 rounded-full object-cover shadow-inner ring-2 ring-slate-100"
          />
          <span
            className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-emerald-500 ring-2 ring-white"
            title="Disponible ahora"
          />
        </div>
        <div>
          <span className="bg-[var(--lpd-brand-primary)]/10 mb-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--lpd-brand-primary)]">
            {advisor.statusBadge ?? 'Asesor Especialista'}
          </span>
          <h3 className="text-sm font-bold leading-tight text-slate-900">{advisor.name}</h3>
          <p className="mt-0.5 text-xs text-slate-500">{advisor.role}</p>
        </div>
      </div>

      <p className="text-xs leading-relaxed text-slate-600">
        ¿Dudas sobre tu visado, requisitos o coberturas? Te ayudo de forma personalizada y sin
        compromiso.
      </p>

      <div className="grid grid-cols-2 gap-2 pt-1">
        {advisor.whatsappNumber && (
          <button
            type="button"
            onClick={() => onContact?.('whatsapp')}
            className="flex min-h-[40px] items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-2.5 text-xs font-bold text-white shadow-sm transition-colors hover:bg-emerald-700"
          >
            <MessageCircle className="h-4 w-4" />
            <span>WhatsApp</span>
          </button>
        )}
        {advisor.phone && (
          <button
            type="button"
            onClick={() => onContact?.('call')}
            className="flex min-h-[40px] items-center justify-center gap-1.5 rounded-xl bg-slate-100 px-3 py-2.5 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-200"
          >
            <Phone className="h-4 w-4" />
            <span>Llamar</span>
          </button>
        )}
      </div>
    </aside>
  );
};
