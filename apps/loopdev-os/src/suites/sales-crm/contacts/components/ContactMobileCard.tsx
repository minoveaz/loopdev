'use client';

import React from 'react';
import { IconButton } from '@loopdev/ui';
import Link from 'next/link';
import type { CrmContact } from '@loopdev/contracts';
import { Building2, ArrowUpRight, TrendingUp, CheckSquare, Square } from 'lucide-react';
import { ContactAvatar } from './ContactAvatar';
import { ContactIdentityBadge } from './ContactIdentityBadge';
import { ContactDirectChannels } from './ContactDirectChannels';
import {
  contactFullName,
  formatRelativeActivity,
  formatCurrencyAmount,
  type EnrichedContactMeta,
} from '../types';

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
        <div className="flex min-w-0 items-center gap-3">
          <ContactAvatar
            name={fullName}
            size="md"
            showStatusDot
            statusDotColor={contact.identityStatus === 'verified' ? 'emerald' : 'amber'}
          />
          <div className="min-w-0">
            <div className="flex min-w-0 items-center gap-2 truncate">
              <Link
                href={`/sales-crm/contacts/${contact.id}`}
                className="text-text-main hover:text-primary text-sm font-medium hover:underline"
              >
                {fullName}
              </Link>
            </div>
            {contact.companyName ? (
              <p className="text-text-muted mt-0.5 flex items-center gap-1 truncate text-xs">
                <Building2 size={12} strokeWidth={1.75} className="text-text-muted shrink-0" />
                <span className="truncate">{contact.companyName}</span>
              </p>
            ) : (
              <p className="text-text-muted/70 mt-0.5 text-xs italic">Sin empresa</p>
            )}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          <ContactIdentityBadge status={contact.identityStatus} size="sm" />
          {onToggleSelect && (
            <IconButton
              type="button"
              variant="ghost"
              size="sm"
              ariaLabel="Seleccionar fila"
              onClick={(e) => {
                e.stopPropagation();
                onToggleSelect();
              }}
              className="text-text-muted hover:text-text-main p-1 transition-colors"
              title={isSelected ? 'Deseleccionar' : 'Seleccionar'}
            >
              {isSelected ? (
                <CheckSquare size={18} className="text-primary" />
              ) : (
                <Square size={18} />
              )}
            </IconButton>
          )}
        </div>
      </div>

      {/* Middle row: Pipeline metrics pill */}
      <div className="border-border-subtle/80 bg-surface/50 flex items-center justify-between rounded-lg border px-3 py-2 text-xs">
        <div className="text-text-muted flex items-center gap-1.5">
          <TrendingUp size={13} strokeWidth={1.75} className="text-primary" />
          <span>
            Tratos: <strong className="text-text-main font-semibold">{meta.dealCount}</strong>
          </span>
        </div>
        <div className="text-text-muted">
          Valor:{' '}
          <strong className="text-text-main font-semibold">
            {formatCurrencyAmount(meta.totalPipelineValue)}
          </strong>
        </div>
        <div className="text-text-muted text-[11px]">
          {formatRelativeActivity(contact.updatedAt)}
        </div>
      </div>

      {/* Bottom row: Direct communication channels + 360 Link */}
      <div className="border-border-subtle/60 flex items-center justify-between gap-2 border-t pt-1">
        <ContactDirectChannels email={contact.email} phone={contact.phone} variant="buttons" />
        <Link
          href={`/sales-crm/contacts/${contact.id}`}
          className="text-primary hover:bg-primary/10 inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors"
        >
          <span>Ver 360</span>
          <ArrowUpRight size={13} strokeWidth={2} />
        </Link>
      </div>
    </article>
  );
}
