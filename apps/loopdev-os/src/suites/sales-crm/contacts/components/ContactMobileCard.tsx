'use client';

import React from 'react';
import Link from 'next/link';
import type { CrmContact } from '@loopdev/contracts';
import { Building2, ArrowUpRight, TrendingUp, CheckSquare, Square } from 'lucide-react';
import { ContactAvatar } from './ContactAvatar';
import { ContactIdentityBadge } from './ContactIdentityBadge';
import { ContactDirectChannels } from './ContactDirectChannels';
import { contactFullName, formatRelativeActivity, formatCurrencyAmount, type EnrichedContactMeta } from '../types';

interface ContactMobileCardProps {
  contact: CrmContact;
  meta: EnrichedContactMeta;
  isSelected?: boolean;
  onToggleSelect?: () => void;
}

export function ContactMobileCard({
  contact,
  meta,
  isSelected = false,
  onToggleSelect,
}: ContactMobileCardProps) {
  const fullName = contactFullName(contact);

  return (
    <article
      className={`group relative flex flex-col gap-3 rounded-xl border p-4 transition-all ${
        isSelected
          ? 'border-primary/50 bg-primary/5 shadow-xs'
          : 'border-border-subtle bg-background shadow-xs hover:border-border-strong hover:bg-surface/50'
      }`}
    >
      {/* Top row: Avatar + Identity + Selection */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <ContactAvatar
            name={fullName}
            size="md"
            showStatusDot
            statusDotColor={contact.identityStatus === 'verified' ? 'emerald' : 'amber'}
          />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <Link
                href={`/sales-crm/contacts/${contact.id}`}
                className="font-medium text-text-main truncate text-sm hover:underline hover:text-primary"
              >
                {fullName}
              </Link>
            </div>
            {contact.companyName ? (
              <p className="flex items-center gap-1 text-xs text-text-muted truncate mt-0.5">
                <Building2 size={12} strokeWidth={1.75} className="shrink-0 text-text-muted" />
                <span className="truncate">{contact.companyName}</span>
              </p>
            ) : (
              <p className="text-xs text-text-muted/70 italic mt-0.5">Sin empresa</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <ContactIdentityBadge status={contact.identityStatus} size="sm" />
          {onToggleSelect && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleSelect();
              }}
              className="p-1 text-text-muted hover:text-text-main transition-colors"
              title={isSelected ? 'Deseleccionar' : 'Seleccionar'}
              aria-label="Seleccionar fila"
            >
              {isSelected ? (
                <CheckSquare size={18} className="text-primary" />
              ) : (
                <Square size={18} />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Middle row: Pipeline metrics pill */}
      <div className="flex items-center justify-between rounded-lg border border-border-subtle/80 bg-surface/50 px-3 py-2 text-xs">
        <div className="flex items-center gap-1.5 text-text-muted">
          <TrendingUp size={13} strokeWidth={1.75} className="text-primary" />
          <span>Tratos: <strong className="text-text-main font-semibold">{meta.dealCount}</strong></span>
        </div>
        <div className="text-text-muted">
          Valor: <strong className="text-text-main font-semibold">{formatCurrencyAmount(meta.totalPipelineValue)}</strong>
        </div>
        <div className="text-[11px] text-text-muted">
          {formatRelativeActivity(contact.updatedAt)}
        </div>
      </div>

      {/* Bottom row: Direct communication channels + 360 Link */}
      <div className="flex items-center justify-between gap-2 pt-1 border-t border-border-subtle/60">
        <ContactDirectChannels
          email={contact.email}
          phone={contact.phone}
          variant="buttons"
        />
        <Link
          href={`/sales-crm/contacts/${contact.id}`}
          className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-primary hover:bg-primary/10 transition-colors"
        >
          <span>Ver 360</span>
          <ArrowUpRight size={13} strokeWidth={2} />
        </Link>
      </div>
    </article>
  );
}
