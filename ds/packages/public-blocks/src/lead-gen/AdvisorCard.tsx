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
        'bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm flex flex-col gap-4',
        className,
      )}
    >
      <div className="flex items-center gap-3.5">
        <div className="relative">
          <img
            src={advisor.avatarUrl}
            alt={advisor.name}
            className="w-14 h-14 rounded-full object-cover ring-2 ring-slate-100 shadow-inner"
          />
          <span
            className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-white"
            title="Disponible ahora"
          />
        </div>
        <div>
          <span className="inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--lpd-brand-primary)] bg-[var(--lpd-brand-primary)]/10 rounded-full mb-1">
            {advisor.statusBadge ?? 'Asesor Especialista'}
          </span>
          <h3 className="text-sm font-bold text-slate-900 leading-tight">{advisor.name}</h3>
          <p className="text-xs text-slate-500 mt-0.5">{advisor.role}</p>
        </div>
      </div>

      <p className="text-xs text-slate-600 leading-relaxed">
        ¿Dudas sobre tu visado, requisitos o coberturas? Te ayudo de forma personalizada y sin compromiso.
      </p>

      <div className="grid grid-cols-2 gap-2 pt-1">
        {advisor.whatsappNumber && (
          <button
            type="button"
            onClick={() => onContact?.('whatsapp')}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-sm min-h-[40px]"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp</span>
          </button>
        )}
        {advisor.phone && (
          <button
            type="button"
            onClick={() => onContact?.('call')}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors min-h-[40px]"
          >
            <Phone className="w-4 h-4" />
            <span>Llamar</span>
          </button>
        )}
      </div>
    </aside>
  );
};
