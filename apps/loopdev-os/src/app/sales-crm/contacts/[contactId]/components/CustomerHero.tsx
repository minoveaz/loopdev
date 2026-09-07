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
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
        {/* Profile Identity */}
        <div className="flex items-center justify-between gap-3 sm:items-start sm:justify-start sm:gap-4">
          <div className="flex min-w-0 items-center gap-3 sm:items-start sm:gap-4">
            <div className="relative shrink-0">
              <div className="from-primary/20 via-primary/10 to-primary/30 border-primary/20 text-primary shadow-xs flex h-12 w-12 items-center justify-center rounded-xl border bg-gradient-to-tr text-base font-bold sm:h-20 sm:w-20 sm:rounded-2xl sm:text-2xl">
                {initials}
              </div>
              <span
                className="border-surface-light dark:border-surface-dark shadow-xs absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full border-2 bg-emerald-500 sm:-bottom-1 sm:-right-1 sm:h-5 sm:w-5"
                title="Active contact record"
              >
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white sm:h-2 sm:w-2" />
              </span>
            </div>

            <div className="min-w-0 space-y-0.5 sm:space-y-1">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2.5">
                <Heading
                  as="h1"
                  size="xl"
                  weight="bold"
                  className="text-text-main truncate text-lg sm:text-3xl"
                >
                  {name}
                </Heading>
                <span className="hidden items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 sm:inline-flex dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Authorized Contact
                </span>
              </div>

              <div className="text-text-muted flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs sm:gap-x-4 sm:text-sm">
                {view.contact.companyName ? (
                  <div className="text-text-main flex items-center gap-1 font-medium">
                    <Building2 className="text-text-muted h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
                    <span className="truncate">{view.contact.companyName}</span>
                  </div>
                ) : (
                  <span className="text-text-muted italic">Individual Contact</span>
                )}
                <span className="text-border-subtle hidden sm:inline">•</span>
                <span className="text-text-muted hidden items-center gap-1 text-xs sm:inline-flex">
                  <Clock className="h-3.5 w-3.5" /> ID: {contactId.slice(0, 8)}
                </span>
              </div>
            </div>
          </div>

          {/* Mobile Direct Action Buttons (Thumb zone) */}
          <div className="flex shrink-0 items-center gap-2 lg:hidden">
            {view.contact.phone ? (
              <a
                href={`tel:${view.contact.phone}`}
                aria-label="Llamar al contacto"
                className="shadow-xs flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-xs text-emerald-600 transition-transform active:scale-95 sm:h-9 sm:w-9 dark:text-emerald-400"
                title="Llamar"
              >
                <Phone className="h-4 w-4" />
              </a>
            ) : null}
            {view.contact.email ? (
              <a
                href={`mailto:${view.contact.email}`}
                aria-label="Enviar correo"
                className="shadow-xs flex h-10 w-10 items-center justify-center rounded-xl border border-blue-500/30 bg-blue-500/10 text-xs text-blue-600 transition-transform active:scale-95 sm:h-9 sm:w-9 dark:text-blue-400"
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
                className="bg-primary/10 border-primary/20 text-primary shadow-xs flex h-10 w-10 items-center justify-center rounded-xl border text-xs transition-transform active:scale-95 sm:h-9 sm:w-9"
                title="Editar contacto"
              >
                <Edit3 className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Action Toolbar (Desktop >= 1024px) */}
        <div className="hidden flex-wrap items-center gap-3 lg:flex">
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
              className="border-border-subtle bg-surface-light dark:bg-surface-dark text-text-main shadow-xs hover:bg-surface-muted/60 inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-all"
            >
              <Mail className="text-text-muted h-3.5 w-3.5" />
              Email
            </a>
          ) : null}

          {view.contact.phone ? (
            <a
              href={`tel:${view.contact.phone}`}
              className="border-border-subtle bg-surface-light dark:bg-surface-dark text-text-main shadow-xs hover:bg-surface-muted/60 inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-all"
            >
              <Phone className="text-text-muted h-3.5 w-3.5" />
              Call
            </a>
          ) : null}

          {onEditContact && (
            <button
              type="button"
              onClick={onEditContact}
              className="border-border-subtle bg-surface-light dark:bg-surface-dark text-text-main shadow-xs hover:bg-surface-muted/60 inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-all"
              title="Editar ficha completa"
            >
              <Edit3 className="text-text-muted h-3.5 w-3.5" />
              <span>Editar contacto</span>
            </button>
          )}

          <Link
            href={`/sales-crm/tasks/new?relationType=contact&relationId=${contactId}`}
            className="bg-primary shadow-xs hover:bg-primary/90 inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-medium text-white transition-all"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Task
          </Link>
        </div>
      </div>

      {/* Integrated Metric Strip */}
      <div className="border-border-subtle no-scrollbar mt-3 flex items-center gap-2 overflow-x-auto border-t pb-1 pt-3 sm:mt-6 sm:gap-6 sm:pt-6 lg:grid lg:grid-cols-4 lg:pb-0">
        <div className="bg-surface-muted/30 border-border-subtle/50 shrink-0 rounded-xl border px-3 py-1.5 lg:border-none lg:bg-transparent lg:p-0">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-1">
              <span className="text-text-muted text-[11px] font-medium sm:text-xs">Pipeline</span>
              {isOpportunitiesSimulated && <SimulatedBadge />}
            </div>
            <TrendingUp className="text-primary h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
          </div>
          <p className="text-text-main mt-0.5 whitespace-nowrap text-sm font-bold tracking-tight sm:mt-1 sm:text-2xl">
            {formatCurrency(totalPipelineValue)}
          </p>
        </div>

        <div className="bg-surface-muted/30 border-border-subtle/50 shrink-0 rounded-xl border px-3 py-1.5 lg:border-none lg:bg-transparent lg:p-0">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-1">
              <span className="text-text-muted text-[11px] font-medium sm:text-xs">Tareas</span>
              {isTasksSimulated && <SimulatedBadge />}
            </div>
            <ListTodo className="h-3.5 w-3.5 shrink-0 text-amber-500 sm:h-4 sm:w-4" />
          </div>
          <p className="mt-0.5 whitespace-nowrap text-sm font-bold tracking-tight text-amber-500 sm:mt-1 sm:text-2xl">
            {openTasksCount} pend.
          </p>
        </div>

        <div className="bg-surface-muted/30 border-border-subtle/50 shrink-0 rounded-xl border px-3 py-1.5 lg:border-none lg:bg-transparent lg:p-0">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-1">
              <span className="text-text-muted text-[11px] font-medium sm:text-xs">Leads</span>
              {isLeadsSimulated && <SimulatedBadge />}
            </div>
            <UserCheck className="h-3.5 w-3.5 shrink-0 text-emerald-500 sm:h-4 sm:w-4" />
          </div>
          <p className="mt-0.5 whitespace-nowrap text-sm font-bold tracking-tight text-emerald-600 sm:mt-1 sm:text-2xl dark:text-emerald-400">
            {leadsCount} cualif.
          </p>
        </div>

        <div className="bg-surface-muted/30 border-border-subtle/50 shrink-0 rounded-xl border px-3 py-1.5 lg:border-none lg:bg-transparent lg:p-0">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-1">
              <span className="text-text-muted text-[11px] font-medium sm:text-xs">Eventos</span>
              {isTimelineSimulated && <SimulatedBadge />}
            </div>
            <Clock className="h-3.5 w-3.5 shrink-0 text-purple-500 sm:h-4 sm:w-4" />
          </div>
          <p className="text-text-main mt-0.5 whitespace-nowrap text-sm font-bold tracking-tight sm:mt-1 sm:text-2xl">
            {timelineCount} hist.
          </p>
        </div>
      </div>
    </TechnicalSurface>
  );
}
