'use client';

import Link from 'next/link';
import {
  Building2,
  Copy,
  Check,
  UserCheck,
  ChevronRight,
  User,
  MapPin,
  Briefcase,
  Mail,
} from 'lucide-react';
import type { Customer360RecordView } from '@loopdev/contracts';
import { SimulatedBadge } from '../sharedComponents';
import type { ContactLeadSummary } from '../customer360DisplayTypes';

interface ContactDetailsPanelProps {
  view: Customer360RecordView;
  displayedLeads: ContactLeadSummary[];
  isLeadsSimulated?: boolean;
  isSimulationActive?: boolean;
  copiedEmail: boolean;
  copiedPhone: boolean;
  copyToClipboard: (text: string, type: 'email' | 'phone') => void;
  onEditContact?: () => void;
}

export function ContactDetailsPanel({
  view,
  displayedLeads,
  isLeadsSimulated,
  copiedEmail,
  copiedPhone,
  copyToClipboard,
  onEditContact,
}: ContactDetailsPanelProps) {
  const contact = view.contact;

  return (
    <div className="flex w-full min-w-0 flex-1 flex-col space-y-6">
      {/* Header with edit trigger */}
      <div className="flex items-center justify-between">
        <h3 className="text-text-main text-sm font-semibold">Ficha del Cliente</h3>
        {onEditContact ? (
          <button
            type="button"
            onClick={onEditContact}
            className="text-primary bg-primary/10 hover:bg-primary/20 inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors hover:underline active:scale-95"
          >
            <span>Editar datos</span>
            <span aria-hidden="true">✎</span>
          </button>
        ) : (
          <span className="text-text-muted text-xs">Verified</span>
        )}
      </div>

      {/* 1. Datos de Identidad */}
      <div className="space-y-3 text-sm">
        <div className="text-text-muted flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider">
          <User size={13} className="text-primary" />
          <span>Identidad</span>
        </div>
        <div className="border-border-subtle bg-surface-muted/20 space-y-2 rounded-xl border p-3 text-xs">
          <div className="flex items-center justify-between py-0.5">
            <span className="text-text-muted">Nombre legal:</span>
            <span className="text-text-main font-medium">
              {[contact.firstName, contact.lastName, contact.secondLastName]
                .filter(Boolean)
                .join(' ') || 'Sin especificar'}
            </span>
          </div>
          {contact.documentNumber && (
            <div className="border-border-subtle/50 flex items-center justify-between border-t py-0.5">
              <span className="text-text-muted">{contact.documentType || 'Documento'}:</span>
              <span className="text-text-main font-mono font-medium">{contact.documentNumber}</span>
            </div>
          )}
          {contact.birthDate && (
            <div className="border-border-subtle/50 flex items-center justify-between border-t py-0.5">
              <span className="text-text-muted">Nacimiento:</span>
              <span className="text-text-main font-medium">{contact.birthDate}</span>
            </div>
          )}
        </div>
      </div>

      {/* 2. Canales de Contacto */}
      <div className="space-y-3 text-sm">
        <div className="text-text-muted flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider">
          <Mail size={13} className="text-primary" />
          <span>Canales de Contacto</span>
        </div>

        <div className="space-y-2 text-xs">
          {/* Email */}
          <div className="border-border-subtle bg-surface-muted/30 text-text-main flex items-center justify-between rounded-lg border px-3 py-2">
            <div className="min-w-0 flex-1">
              <span className="text-text-muted block text-[10px]">Email principal</span>
              <span className="block select-all truncate font-mono text-xs">
                {contact.email ?? 'No disponible'}
              </span>
            </div>
            {contact.email ? (
              <button
                type="button"
                onClick={() => copyToClipboard(contact.email!, 'email')}
                className="text-text-muted hover:text-text-main ml-2 p-1 transition-colors"
                title="Copiar email"
              >
                {copiedEmail ? (
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </button>
            ) : null}
          </div>

          {/* Phone */}
          <div className="border-border-subtle bg-surface-muted/30 text-text-main flex items-center justify-between rounded-lg border px-3 py-2">
            <div className="min-w-0 flex-1">
              <span className="text-text-muted block text-[10px]">Teléfono directo</span>
              <span className="block select-all truncate font-mono text-xs">
                {contact.phone ?? 'No disponible'}
              </span>
            </div>
            {contact.phone ? (
              <button
                type="button"
                onClick={() => copyToClipboard(contact.phone!, 'phone')}
                className="text-text-muted hover:text-text-main ml-2 p-1 transition-colors"
                title="Copiar teléfono"
              >
                {copiedPhone ? (
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </button>
            ) : null}
          </div>

          {contact.preferredChannel && (
            <div className="text-text-muted flex items-center justify-between px-1">
              <span>Canal preferido:</span>
              <span className="text-text-main bg-primary/10 text-primary rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase">
                {contact.preferredChannel}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 3. Profesional & Empresa */}
      {(contact.companyName || contact.jobTitle || contact.department) && (
        <div className="space-y-3 text-sm">
          <div className="text-text-muted flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider">
            <Briefcase size={13} className="text-primary" />
            <span>Profesional & Empresa</span>
          </div>
          <div className="border-border-subtle bg-surface-muted/20 space-y-2 rounded-xl border p-3 text-xs">
            {contact.companyName && (
              <div className="flex items-center gap-2">
                <Building2 className="text-text-muted h-3.5 w-3.5 shrink-0" />
                <span className="text-text-main truncate font-semibold">{contact.companyName}</span>
              </div>
            )}
            {contact.jobTitle && (
              <div className="text-text-muted border-border-subtle/50 flex items-center justify-between border-t pt-1">
                <span>Cargo:</span>
                <span className="text-text-main font-medium">{contact.jobTitle}</span>
              </div>
            )}
            {contact.department && (
              <div className="text-text-muted border-border-subtle/50 flex items-center justify-between border-t pt-1">
                <span>Departamento:</span>
                <span className="text-text-main font-medium">{contact.department}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. Ubicación */}
      {(contact.city || contact.addressLine1 || contact.country) && (
        <div className="space-y-3 text-sm">
          <div className="text-text-muted flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider">
            <MapPin size={13} className="text-primary" />
            <span>Ubicación</span>
          </div>
          <div className="border-border-subtle bg-surface-muted/20 text-text-main space-y-1 rounded-xl border p-3 text-xs">
            {contact.addressLine1 && <p className="font-medium">{contact.addressLine1}</p>}
            {contact.addressLine2 && <p className="text-text-muted">{contact.addressLine2}</p>}
            <p className="text-text-muted">
              {[contact.postalCode, contact.city, contact.stateProvince, contact.country]
                .filter(Boolean)
                .join(', ')}
            </p>
          </div>
        </div>
      )}

      {/* 5. Leads Asociados */}
      <div className="border-border-subtle space-y-3 border-t pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserCheck className="text-text-muted h-4 w-4" />
            <h3 className="text-text-main text-sm font-semibold">Leads Asociados</h3>
          </div>
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-medium ${
              isLeadsSimulated
                ? 'border border-amber-500/30 bg-amber-500/15 text-amber-700 dark:text-amber-300'
                : 'bg-surface-muted text-text-muted'
            }`}
          >
            {displayedLeads.length}
          </span>
        </div>

        {displayedLeads.length ? (
          <div className="space-y-2 pt-1">
            {displayedLeads.map((lead) => {
              const isSimulated = Boolean(lead.isSimulated);
              return (
                <div
                  key={lead.id}
                  className={`rounded-xl p-3 transition-all ${
                    isSimulated
                      ? 'border border-dashed border-amber-500/40 bg-amber-500/[0.03]'
                      : 'border-border-subtle hover:border-primary/40 hover:bg-surface-muted/20 border p-3'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-1.5">
                      <span className="text-text-main truncate text-xs font-semibold">
                        {lead.interest || 'Lead sin asunto'}
                      </span>
                      {isSimulated && <SimulatedBadge />}
                    </div>
                    <span className="text-text-muted shrink-0 font-mono text-[10px] uppercase">
                      {lead.status}
                    </span>
                  </div>

                  <div className="text-text-muted mt-2 flex items-center justify-between text-[11px]">
                    <span>Origen: {lead.source?.kind ?? 'direct'}</span>
                    <Link
                      href={`/sales-crm/leads`}
                      className="text-primary inline-flex items-center gap-0.5 font-medium hover:underline"
                    >
                      Ver en Leads
                      <ChevronRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-text-muted py-1 text-xs italic">No related leads.</p>
        )}
      </div>
    </div>
  );
}
