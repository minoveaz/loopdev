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
  Phone,
  Mail,
  ShieldAlert,
} from 'lucide-react';
import type { Customer360RecordView } from '@loopdev/contracts';
import { SimulatedBadge } from '../sharedComponents';

interface ContactDetailsPanelProps {
  view: Customer360RecordView;
  displayedLeads: Array<Record<string, unknown> & { id: string; status: string; interest?: string; source?: { kind: string } }>;
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
  isSimulationActive,
  copiedEmail,
  copiedPhone,
  copyToClipboard,
  onEditContact,
}: ContactDetailsPanelProps) {
  const contact = view.contact;

  return (
    <div className="space-y-6 flex-1 flex flex-col min-w-0 w-full">
      {/* Header with edit trigger */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-text-main">Ficha del Cliente</h3>
        {onEditContact ? (
          <button
            type="button"
            onClick={onEditContact}
            className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline px-2.5 py-1 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors active:scale-95"
          >
            <span>Editar datos</span>
            <span aria-hidden="true">✎</span>
          </button>
        ) : (
          <span className="text-xs text-text-muted">Verified</span>
        )}
      </div>

      {/* 1. Datos de Identidad */}
      <div className="space-y-3 text-sm">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-text-muted uppercase tracking-wider">
          <User size={13} className="text-primary" />
          <span>Identidad</span>
        </div>
        <div className="rounded-xl border border-border-subtle bg-surface-muted/20 p-3 space-y-2 text-xs">
          <div className="flex justify-between items-center py-0.5">
            <span className="text-text-muted">Nombre legal:</span>
            <span className="font-medium text-text-main">
              {[contact.firstName, contact.lastName, contact.secondLastName].filter(Boolean).join(' ') || 'Sin especificar'}
            </span>
          </div>
          {contact.documentNumber && (
            <div className="flex justify-between items-center py-0.5 border-t border-border-subtle/50">
              <span className="text-text-muted">{contact.documentType || 'Documento'}:</span>
              <span className="font-mono font-medium text-text-main">{contact.documentNumber}</span>
            </div>
          )}
          {contact.birthDate && (
            <div className="flex justify-between items-center py-0.5 border-t border-border-subtle/50">
              <span className="text-text-muted">Nacimiento:</span>
              <span className="font-medium text-text-main">{contact.birthDate}</span>
            </div>
          )}
        </div>
      </div>

      {/* 2. Canales de Contacto */}
      <div className="space-y-3 text-sm">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-text-muted uppercase tracking-wider">
          <Mail size={13} className="text-primary" />
          <span>Canales de Contacto</span>
        </div>

        <div className="space-y-2 text-xs">
          {/* Email */}
          <div className="flex items-center justify-between rounded-lg border border-border-subtle bg-surface-muted/30 px-3 py-2 text-text-main">
            <div className="min-w-0 flex-1">
              <span className="text-[10px] text-text-muted block">Email principal</span>
              <span className="truncate text-xs font-mono select-all block">
                {contact.email ?? 'No disponible'}
              </span>
            </div>
            {contact.email ? (
              <button
                type="button"
                onClick={() => copyToClipboard(contact.email!, 'email')}
                className="ml-2 text-text-muted hover:text-text-main transition-colors p-1"
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
          <div className="flex items-center justify-between rounded-lg border border-border-subtle bg-surface-muted/30 px-3 py-2 text-text-main">
            <div className="min-w-0 flex-1">
              <span className="text-[10px] text-text-muted block">Teléfono directo</span>
              <span className="truncate text-xs font-mono select-all block">
                {contact.phone ?? 'No disponible'}
              </span>
            </div>
            {contact.phone ? (
              <button
                type="button"
                onClick={() => copyToClipboard(contact.phone!, 'phone')}
                className="ml-2 text-text-muted hover:text-text-main transition-colors p-1"
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
            <div className="flex items-center justify-between px-1 text-text-muted">
              <span>Canal preferido:</span>
              <span className="font-semibold text-text-main uppercase text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                {contact.preferredChannel}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 3. Profesional & Empresa */}
      {(contact.companyName || contact.jobTitle || contact.department) && (
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-text-muted uppercase tracking-wider">
            <Briefcase size={13} className="text-primary" />
            <span>Profesional & Empresa</span>
          </div>
          <div className="rounded-xl border border-border-subtle bg-surface-muted/20 p-3 space-y-2 text-xs">
            {contact.companyName && (
              <div className="flex items-center gap-2">
                <Building2 className="h-3.5 w-3.5 text-text-muted shrink-0" />
                <span className="font-semibold text-text-main truncate">{contact.companyName}</span>
              </div>
            )}
            {contact.jobTitle && (
              <div className="flex justify-between items-center text-text-muted pt-1 border-t border-border-subtle/50">
                <span>Cargo:</span>
                <span className="font-medium text-text-main">{contact.jobTitle}</span>
              </div>
            )}
            {contact.department && (
              <div className="flex justify-between items-center text-text-muted pt-1 border-t border-border-subtle/50">
                <span>Departamento:</span>
                <span className="font-medium text-text-main">{contact.department}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. Ubicación */}
      {(contact.city || contact.addressLine1 || contact.country) && (
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-text-muted uppercase tracking-wider">
            <MapPin size={13} className="text-primary" />
            <span>Ubicación</span>
          </div>
          <div className="rounded-xl border border-border-subtle bg-surface-muted/20 p-3 text-xs text-text-main space-y-1">
            {contact.addressLine1 && <p className="font-medium">{contact.addressLine1}</p>}
            {contact.addressLine2 && <p className="text-text-muted">{contact.addressLine2}</p>}
            <p className="text-text-muted">
              {[contact.postalCode, contact.city, contact.stateProvince, contact.country].filter(Boolean).join(', ')}
            </p>
          </div>
        </div>
      )}

      {/* 5. Leads Asociados */}
      <div className="pt-4 border-t border-border-subtle space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserCheck className="h-4 w-4 text-text-muted" />
            <h3 className="text-sm font-semibold text-text-main">Leads Asociados</h3>
          </div>
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-medium ${
              isLeadsSimulated
                ? 'bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-300'
                : 'bg-surface-muted text-text-muted'
            }`}
          >
            {displayedLeads.length}
          </span>
        </div>

        {displayedLeads.length ? (
          <div className="space-y-2 pt-1">
            {displayedLeads.map((lead) => {
              const isSimulated = 'isSimulated' in lead && Boolean((lead as Record<string, unknown>).isSimulated);
              return (
                <div
                  key={lead.id}
                  className={`rounded-xl p-3 transition-all ${
                    isSimulated
                      ? 'border border-dashed border-amber-500/40 bg-amber-500/[0.03]'
                      : 'border border-border-subtle p-3 hover:border-primary/40 hover:bg-surface-muted/20'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="text-xs font-semibold text-text-main truncate">
                        {lead.interest || 'Lead sin asunto'}
                      </span>
                      {isSimulated && <SimulatedBadge />}
                    </div>
                    <span className="shrink-0 font-mono text-[10px] text-text-muted uppercase">
                      {lead.status}
                    </span>
                  </div>

                  <div className="mt-2 flex items-center justify-between text-[11px] text-text-muted">
                    <span>Origen: {lead.source?.kind ?? 'direct'}</span>
                    <Link
                      href={`/sales-crm/leads`}
                      className="font-medium text-primary hover:underline inline-flex items-center gap-0.5"
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
          <p className="text-xs text-text-muted italic py-1">No related leads.</p>
        )}
      </div>
    </div>
  );
}
