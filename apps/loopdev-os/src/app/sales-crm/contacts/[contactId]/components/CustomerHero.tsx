'use client';

import Link from 'next/link';
import {
  Building2,
  Mail,
  Phone,
  Plus,
  Clock,
  TrendingUp,
  UserCheck,
  ListTodo,
  Edit3,
} from 'lucide-react';
import { Heading, Select, TechnicalSurface } from '@loopdev/ui';
import type { Customer360RecordView } from '@loopdev/contracts';
import { formatCurrency, getInitials } from './types';
import { SimulatedBadge } from './sharedComponents';

interface CustomerHeroProps {
  view: Customer360RecordView;
  name: string;
  contactId: string;
  lifecycleStage: string;
  setLifecycleStage: (stage: string) => void;
  totalPipelineValue: number;
  openTasksCount: number;
  leadsCount: number;
  timelineCount: number;
  isOpportunitiesSimulated?: boolean;
  isTasksSimulated?: boolean;
  isLeadsSimulated?: boolean;
  isTimelineSimulated?: boolean;
  isMobileOnlyTab?: boolean;
  onEditContact?: () => void;
}

export function CustomerHero({
  view,
  name,
  contactId,
  lifecycleStage,
  setLifecycleStage,
  totalPipelineValue,
  openTasksCount,
  leadsCount,
  timelineCount,
  isOpportunitiesSimulated,
  isTasksSimulated,
  isLeadsSimulated,
  isTimelineSimulated,
  isMobileOnlyTab,
  onEditContact,
}: CustomerHeroProps) {
  const initials = getInitials(name);

  return (
    <TechnicalSurface
      variant="surface"
      border="subtle"
      radius="xl"
      className={`shrink-0 p-4 sm:p-6 ${isMobileOnlyTab ? 'block' : 'hidden lg:block'}`}
    >
      <div className="flex flex-col gap-4 lg:gap-6 lg:flex-row lg:items-center lg:justify-between">
        {/* Profile Identity */}
        <div className="flex items-center sm:items-start justify-between sm:justify-start gap-3 sm:gap-4">
          <div className="flex items-center sm:items-start gap-3 sm:gap-4 min-w-0">
            <div className="relative shrink-0">
              <div className="h-12 w-12 sm:h-20 sm:w-20 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-primary/20 via-primary/10 to-primary/30 border border-primary/20 flex items-center justify-center text-primary font-bold text-base sm:text-2xl shadow-xs">
                {initials}
              </div>
              <span
                className="absolute -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1 h-3.5 w-3.5 sm:h-5 sm:w-5 rounded-full bg-emerald-500 border-2 border-surface-light dark:border-surface-dark shadow-xs flex items-center justify-center"
                title="Active contact record"
              >
                <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-white animate-pulse" />
              </span>
            </div>

            <div className="space-y-0.5 sm:space-y-1 min-w-0">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2.5">
                <Heading
                  as="h1"
                  size="xl"
                  weight="bold"
                  className="text-text-main truncate text-lg sm:text-3xl"
                >
                  {name}
                </Heading>
                <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Authorized Contact
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-y-0.5 gap-x-2 sm:gap-x-4 text-xs sm:text-sm text-text-muted">
                {view.contact.companyName ? (
                  <div className="flex items-center gap-1 font-medium text-text-main">
                    <Building2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-text-muted shrink-0" />
                    <span className="truncate">{view.contact.companyName}</span>
                  </div>
                ) : (
                  <span className="text-text-muted italic">Individual Contact</span>
                )}
                <span className="hidden sm:inline text-border-subtle">•</span>
                <span className="hidden sm:inline-flex items-center gap-1 text-xs text-text-muted">
                  <Clock className="h-3.5 w-3.5" /> ID: {contactId.slice(0, 8)}
                </span>
              </div>
            </div>
          </div>

          {/* Mobile Direct Action Buttons (Thumb zone) */}
          <div className="flex items-center gap-2 lg:hidden shrink-0">
            {view.contact.phone ? (
              <a
                href={`tel:${view.contact.phone}`}
                aria-label="Llamar al contacto"
                className="flex h-10 w-10 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs shadow-xs active:scale-95 transition-transform"
                title="Llamar"
              >
                <Phone className="h-4 w-4" />
              </a>
            ) : null}
            {view.contact.email ? (
              <a
                href={`mailto:${view.contact.email}`}
                aria-label="Enviar correo"
                className="flex h-10 w-10 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-600 dark:text-blue-400 text-xs shadow-xs active:scale-95 transition-transform"
                title="Email"
              >
                <Mail className="h-4 w-4" />
              </a>
            ) : null}
            {onEditContact && (
              <button
                type="button"
                onClick={onEditContact}
                aria-label="Editar contacto"
                className="flex h-10 w-10 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary text-xs shadow-xs active:scale-95 transition-transform"
                title="Editar contacto"
              >
                <Edit3 className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Action Toolbar (Desktop >= 1024px) */}
        <div className="hidden lg:flex flex-wrap items-center gap-3">
          <div className="w-44">
            <Select
              size="sm"
              value={lifecycleStage}
              onChange={(e) => setLifecycleStage(e.target.value)}
              aria-label="Lifecycle stage"
            >
              <option value="customer">Active Customer</option>
              <option value="qualified">Qualified Lead</option>
              <option value="opportunity">In Negotiation</option>
              <option value="churned">Inactive</option>
            </Select>
          </div>

          {view.contact.email ? (
            <a
              href={`mailto:${view.contact.email}`}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border-subtle bg-surface-light dark:bg-surface-dark px-3 py-2 text-xs font-medium text-text-main shadow-xs hover:bg-surface-muted/60 transition-all"
            >
              <Mail className="h-3.5 w-3.5 text-text-muted" />
              Email
            </a>
          ) : null}

          {view.contact.phone ? (
            <a
              href={`tel:${view.contact.phone}`}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border-subtle bg-surface-light dark:bg-surface-dark px-3 py-2 text-xs font-medium text-text-main shadow-xs hover:bg-surface-muted/60 transition-all"
            >
              <Phone className="h-3.5 w-3.5 text-text-muted" />
              Call
            </a>
          ) : null}

          {onEditContact && (
            <button
              type="button"
              onClick={onEditContact}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border-subtle bg-surface-light dark:bg-surface-dark px-3 py-2 text-xs font-medium text-text-main shadow-xs hover:bg-surface-muted/60 transition-all"
              title="Editar ficha completa"
            >
              <Edit3 className="h-3.5 w-3.5 text-text-muted" />
              <span>Editar contacto</span>
            </button>
          )}

          <Link
            href={`/sales-crm/tasks/new?relationType=contact&relationId=${contactId}`}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-xs font-medium text-white shadow-xs hover:bg-primary/90 transition-all"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Task
          </Link>
        </div>
      </div>

      {/* Integrated Metric Strip */}
      <div className="mt-3 sm:mt-6 pt-3 sm:pt-6 border-t border-border-subtle flex lg:grid items-center gap-2 sm:gap-6 overflow-x-auto pb-1 lg:pb-0 lg:grid-cols-4 no-scrollbar">
        <div className="shrink-0 px-3 py-1.5 rounded-xl bg-surface-muted/30 lg:bg-transparent lg:p-0 border border-border-subtle/50 lg:border-none">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-1">
              <span className="text-[11px] sm:text-xs font-medium text-text-muted">Pipeline</span>
              {isOpportunitiesSimulated && <SimulatedBadge />}
            </div>
            <TrendingUp className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary shrink-0" />
          </div>
          <p className="mt-0.5 sm:mt-1 text-sm sm:text-2xl font-bold text-text-main tracking-tight whitespace-nowrap">
            {formatCurrency(totalPipelineValue)}
          </p>
        </div>

        <div className="shrink-0 px-3 py-1.5 rounded-xl bg-surface-muted/30 lg:bg-transparent lg:p-0 border border-border-subtle/50 lg:border-none">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-1">
              <span className="text-[11px] sm:text-xs font-medium text-text-muted">Tareas</span>
              {isTasksSimulated && <SimulatedBadge />}
            </div>
            <ListTodo className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-500 shrink-0" />
          </div>
          <p className="mt-0.5 sm:mt-1 text-sm sm:text-2xl font-bold text-amber-500 tracking-tight whitespace-nowrap">
            {openTasksCount} pend.
          </p>
        </div>

        <div className="shrink-0 px-3 py-1.5 rounded-xl bg-surface-muted/30 lg:bg-transparent lg:p-0 border border-border-subtle/50 lg:border-none">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-1">
              <span className="text-[11px] sm:text-xs font-medium text-text-muted">Leads</span>
              {isLeadsSimulated && <SimulatedBadge />}
            </div>
            <UserCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-500 shrink-0" />
          </div>
          <p className="mt-0.5 sm:mt-1 text-sm sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400 tracking-tight whitespace-nowrap">
            {leadsCount} cualif.
          </p>
        </div>

        <div className="shrink-0 px-3 py-1.5 rounded-xl bg-surface-muted/30 lg:bg-transparent lg:p-0 border border-border-subtle/50 lg:border-none">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-1">
              <span className="text-[11px] sm:text-xs font-medium text-text-muted">Eventos</span>
              {isTimelineSimulated && <SimulatedBadge />}
            </div>
            <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-purple-500 shrink-0" />
          </div>
          <p className="mt-0.5 sm:mt-1 text-sm sm:text-2xl font-bold text-text-main tracking-tight whitespace-nowrap">
            {timelineCount} hist.
          </p>
        </div>
      </div>
    </TechnicalSurface>
  );
}
