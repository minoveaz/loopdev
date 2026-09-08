'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';
import type { FloatingWhatsAppProps } from './types';

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({
  phoneNumber,
  defaultMessage = 'Hola, me gustaría recibir más información.',
  tooltipText = '¿Tienes dudas? Chatea con nosotros',
}) => {
  const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
  const encodedMessage = encodeURIComponent(defaultMessage);
  const href = `https://wa.me/${cleanNumber}?text=${encodedMessage}`;

  return (
    <aside
      aria-label="Contacto por WhatsApp"
      className="fixed bottom-20 right-6 z-40 flex items-center gap-3 sm:bottom-6"
    >
      {tooltipText && (
        <div className="animate-in fade-in slide-in-from-right-3 hidden rounded-xl border border-slate-100 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 shadow-lg md:block">
          {tooltipText}
        </div>
      )}
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Abrir chat de WhatsApp"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-2xl transition-transform hover:scale-110 hover:bg-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-500/30 active:scale-95"
      >
        <MessageCircle className="h-7 w-7 fill-current" />
      </a>
    </aside>
  );
};
