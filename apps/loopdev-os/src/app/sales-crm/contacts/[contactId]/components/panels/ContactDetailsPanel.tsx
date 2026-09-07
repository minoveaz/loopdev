'use client';

import Link from 'next/link';
import {
  Building2,
  Copy,
  Check,
  UserCheck,
  ChevronRight,
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
  return (
    <div className="space-y-6 flex-1 flex flex-col min-w-0 w-full">
      {/* Section A: Contact Details */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-text-main">Contact Details</h3>
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

        <div className="space-y-3 text-sm">
          {/* Email */}
          <div>
            <span className="text-xs font-medium text-text-muted block mb-1">Email Address</span>
            <div className="flex items-center justify-between rounded-lg border border-border-subtle bg-surface-muted/30 px-3 py-2 text-text-main">
              <span className="truncate text-xs font-mono select-all">
                {view.contact.email ?? 'No email available'}
              </span>
              {view.contact.email ? (
                <button
                  type="button"
                  onClick={() => copyToClipboard(view.contact.email!, 'email')}
                  className="ml-2 text-text-muted hover:text-text-main transition-colors p-1"
                  title="Copy email"
                >
                  {copiedEmail ? (
                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
              ) : null}
            </div>
          </div>

          {/* Phone */}
          <div>
            <span className="text-xs font-medium text-text-muted block mb-1">Phone Number</span>
            <div className="flex items-center justify-between rounded-lg border border-border-subtle bg-surface-muted/30 px-3 py-2 text-text-main">
              <span className="truncate text-xs font-mono select-all">
                {view.contact.phone ?? 'No phone available'}
              </span>
              {view.contact.phone ? (
                <button
                  type="button"
                  onClick={() => copyToClipboard(view.contact.phone!, 'phone')}
                  className="ml-2 text-text-muted hover:text-text-main transition-colors p-1"
                  title="Copy phone"
                >
                  {copiedPhone ? (
                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
              ) : null}
            </div>
          </div>

          {/* Company */}
          <div>
            <span className="text-xs font-medium text-text-muted block mb-1">Company</span>
            <div className="flex items-center gap-2 rounded-lg border border-border-subtle bg-surface-muted/30 px-3 py-2 text-text-main">
              <Building2 className="h-4 w-4 text-text-muted shrink-0" />
              <span className="text-xs font-medium truncate">
                {view.contact.companyName ?? 'Independent'}
              </span>
            </div>
          </div>

          {/* Account Status */}
          <div>
            <span className="text-xs font-medium text-text-muted block mb-1">Account Status</span>
            <div className="flex items-center gap-2 rounded-lg border border-border-subtle bg-surface-muted/30 px-3 py-2 text-text-main text-xs">
              <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
              <span className="font-medium">Active Record</span>
            </div>
          </div>

          {/* Account Segment / Tags */}
          {isSimulationActive && (
            <div className="pt-2 border-t border-border-subtle/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-text-muted">Account Segmentation</span>
                <SimulatedBadge />
              </div>
              <div className="flex flex-wrap gap-1.5">
                <span className="inline-flex items-center rounded-md border border-dashed border-amber-500/40 bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-300">
                  Tier 1 Enterprise ✦
                </span>
                <span className="inline-flex items-center rounded-md border border-dashed border-amber-500/40 bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-300">
                  Key Decision Maker ✦
                </span>
                <span className="inline-flex items-center rounded-md border border-dashed border-amber-500/40 bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-300">
                  Fintech SaaS EMEA ✦
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Section B: Associated Leads */}
      <div className="pt-4 border-t border-border-subtle space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserCheck className="h-4 w-4 text-text-muted" />
            <h3 className="text-sm font-semibold text-text-main">Associated Leads</h3>
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
                        {lead.interest ?? 'Inbound Lead'}
                      </span>
                      {isSimulated && <SimulatedBadge />}
                    </div>
                    <span
                      className={`rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                        isSimulated
                          ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30'
                          : 'bg-primary/10 text-primary'
                      }`}
                    >
                      {lead.status}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-[11px] text-text-muted">
                      {lead.source?.kind ?? 'direct'}
                    </span>
                    <Link
                      href={`/sales-crm/leads/${lead.id}`}
                      className="text-xs text-primary hover:underline font-medium inline-flex items-center gap-1"
                    >
                      Open <ChevronRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center py-6 text-center">
            <p className="text-xs text-text-muted">No related leads.</p>
            <Link
              href="/sales-crm/leads"
              className="mt-2 inline-flex text-xs text-primary hover:underline font-medium"
            >
              Browse Leads
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
