'use client';

import React, { useState } from 'react';
import { Mail, Phone, Copy, Check } from 'lucide-react';

interface ContactDirectChannelsProps {
  email?: string | null;
  phone?: string | null;
  variant?: 'inline' | 'compact' | 'buttons';
  className?: string;
}

export function ContactDirectChannels({
  email,
  phone,
  variant = 'inline',
  className = '',
}: ContactDirectChannelsProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  if (!email && !phone) {
    return <span className="text-text-muted text-xs italic">Sin canales</span>;
  }

  if (variant === 'buttons') {
    return (
      <div className={`flex items-center gap-1.5 ${className}`}>
        {phone && (
          <a
            href={`tel:${phone}`}
            onClick={(e) => e.stopPropagation()}
            className="border-border-subtle bg-surface text-text-muted hover:border-border-strong hover:bg-surface-hover hover:text-text-main focus-visible:ring-primary inline-flex h-8 w-8 items-center justify-center rounded-md border transition-colors focus-visible:outline-none focus-visible:ring-2"
            title={`Llamar a ${phone}`}
            aria-label={`Llamar a ${phone}`}
          >
            <Phone size={14} strokeWidth={1.75} />
          </a>
        )}
        {email && (
          <a
            href={`mailto:${email}`}
            onClick={(e) => e.stopPropagation()}
            className="border-border-subtle bg-surface text-text-muted hover:border-border-strong hover:bg-surface-hover hover:text-text-main focus-visible:ring-primary inline-flex h-8 w-8 items-center justify-center rounded-md border transition-colors focus-visible:outline-none focus-visible:ring-2"
            title={`Enviar email a ${email}`}
            aria-label={`Enviar email a ${email}`}
          >
            <Mail size={14} strokeWidth={1.75} />
          </a>
        )}
        {email && (
          <button
            type="button"
            onClick={(e) => handleCopy(email, 'email', e)}
            className="border-border-subtle bg-surface text-text-muted hover:border-border-strong hover:bg-surface-hover hover:text-text-main focus-visible:ring-primary inline-flex h-8 w-8 items-center justify-center rounded-md border transition-colors focus-visible:outline-none focus-visible:ring-2"
            title="Copiar email"
            aria-label="Copiar email al portapapeles"
          >
            {copiedKey === 'email' ? (
              <Check size={14} strokeWidth={2} className="text-emerald-600" />
            ) : (
              <Copy size={14} strokeWidth={1.75} />
            )}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-1 text-xs ${className}`}>
      {email && (
        <div className="group/item text-text-muted hover:text-text-main flex items-center gap-1.5">
          <Mail size={13} strokeWidth={1.75} className="text-text-muted shrink-0" />
          <a
            href={`mailto:${email}`}
            onClick={(e) => e.stopPropagation()}
            className="truncate hover:underline"
            title={email}
          >
            {email}
          </a>
          <button
            type="button"
            onClick={(e) => handleCopy(email, 'email', e)}
            className="text-text-muted hover:text-text-main rounded p-0.5 opacity-0 transition-opacity group-hover/item:opacity-100"
            title="Copiar email"
          >
            {copiedKey === 'email' ? (
              <Check size={12} className="text-emerald-600" />
            ) : (
              <Copy size={12} strokeWidth={1.75} />
            )}
          </button>
        </div>
      )}
      {phone && (
        <div className="group/item text-text-muted hover:text-text-main flex items-center gap-1.5">
          <Phone size={13} strokeWidth={1.75} className="text-text-muted shrink-0" />
          <a
            href={`tel:${phone}`}
            onClick={(e) => e.stopPropagation()}
            className="truncate font-mono text-[11px] hover:underline"
            title={phone}
          >
            {phone}
          </a>
          <button
            type="button"
            onClick={(e) => handleCopy(phone, 'phone', e)}
            className="text-text-muted hover:text-text-main rounded p-0.5 opacity-0 transition-opacity group-hover/item:opacity-100"
            title="Copiar teléfono"
          >
            {copiedKey === 'phone' ? (
              <Check size={12} className="text-emerald-600" />
            ) : (
              <Copy size={12} strokeWidth={1.75} />
            )}
          </button>
        </div>
      )}
    </div>
  );
}
