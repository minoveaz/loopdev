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
    <aside aria-label="Contacto por WhatsApp" className="fixed bottom-20 sm:bottom-6 right-6 z-40 flex items-center gap-3">
      {tooltipText && (
        <div className="hidden md:block bg-white text-slate-800 text-xs font-semibold px-3 py-1.5 rounded-xl shadow-lg border border-slate-100 animate-in fade-in slide-in-from-right-3">
          {tooltipText}
        </div>
      )}
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Abrir chat de WhatsApp"
        className="w-14 h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-2xl flex items-center justify-center transition-transform hover:scale-110 active:scale-95 focus:outline-none focus:ring-4 focus:ring-emerald-500/30"
      >
        <MessageCircle className="w-7 h-7 fill-current" />
      </a>
    </aside>
  );
};
