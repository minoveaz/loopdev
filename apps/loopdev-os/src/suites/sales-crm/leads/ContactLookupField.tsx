'use client';

import { useEffect, useState } from 'react';
import { Button, Input } from '@loopdev/ui';
import type { CrmContact } from '@loopdev/contracts';
import { LeadApiError, searchLeadContacts } from './api';

export type ContactLookupValue = { id: string; label: string } | null;

type ContactLookupFieldProps = {
  organizationId: string;
  value: ContactLookupValue;
  onChange: (contact: CrmContact | null) => void;
  error?: string;
  describedBy?: string;
};

function contactLabel(contact: CrmContact) {
  return [contact.firstName, contact.lastName].filter(Boolean).join(' ');
}

/**
 * Reuses the certified Contacts read model (`GET /api/crm/contacts`) to let
 * a Lead capture reference an existing Contact instead of creating a
 * duplicate (CRM_LEAD_CONTRACT.md, CRM_LEADS_UI_CONTRACT.md).
 */
export function ContactLookupField({
  organizationId,
  value,
  onChange,
  error,
  describedBy,
}: ContactLookupFieldProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<CrmContact[]>([]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'forbidden'>('idle');

  useEffect(() => {
    if (value) return;
    const trimmed = query.trim();
    if (!trimmed) {
      return;
    }
    const controller = new AbortController();
    const timeout = window.setTimeout(() => {
      setStatus('loading');
      searchLeadContacts({ organizationId, query: trimmed, limit: 10 }, controller.signal)
        .then((page) => {
          setResults(page.items);
          setStatus('idle');
        })
        .catch((requestError: unknown) => {
          if (requestError instanceof DOMException && requestError.name === 'AbortError') return;
          setStatus(
            requestError instanceof LeadApiError && requestError.code === 'FORBIDDEN'
              ? 'forbidden'
              : 'error',
          );
        });
    }, 300);
    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [organizationId, query, value]);

  if (value) {
    return (
      <div className="border-border-subtle flex items-center justify-between gap-2 rounded-md border p-3">
        <span className="text-text-main truncate text-sm font-medium">{value.label}</span>
        <Button type="button" size="sm" variant="ghost" onClick={() => onChange(null)}>
          Cambiar
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Input
        aria-label="Buscar contacto existente"
        aria-describedby={describedBy}
        aria-invalid={Boolean(error)}
        placeholder="Buscar por nombre o email"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      {query.trim() && status === 'loading' && (
        <p className="text-text-muted text-xs">Buscando contactos…</p>
      )}
      {query.trim() && status === 'forbidden' && (
        <p role="alert" className="text-danger text-xs font-medium">
          No tienes permiso para buscar contactos.
        </p>
      )}
      {query.trim() && status === 'error' && (
        <p role="alert" className="text-danger text-xs font-medium">
          No se pudieron buscar contactos. Inténtalo de nuevo.
        </p>
      )}
      {query.trim() && results.length > 0 && (
        <ul className="border-border-subtle max-h-48 overflow-auto rounded-md border">
          {results.map((contact) => (
            <li key={contact.id}>
              <Button
                type="button"
                variant="ghost"
                className="hover:bg-background-subtle w-full justify-start px-3 py-2 text-left text-sm"
                onClick={() => onChange(contact)}
              >
                <span className="text-text-main block font-medium">{contactLabel(contact)}</span>
                <span className="text-text-muted block text-xs">
                  {contact.email ?? contact.phone ?? 'Sin canal de contacto'}
                </span>
              </Button>
            </li>
          ))}
        </ul>
      )}
      {query.trim() && status === 'idle' && results.length === 0 && (
        <p className="text-text-muted text-xs">
          Ningún contacto coincide con “{query.trim()}”. Puedes crear uno nuevo.
        </p>
      )}
      {error && (
        <p role="alert" className="text-danger text-xs font-medium">
          {error}
        </p>
      )}
    </div>
  );
}
