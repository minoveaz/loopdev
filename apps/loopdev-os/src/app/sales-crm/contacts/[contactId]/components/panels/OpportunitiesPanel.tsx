'use client';

import Link from 'next/link';
import { Briefcase, ChevronRight, Plus } from 'lucide-react';
import { formatCurrency } from '../types';
import { SimulatedBadge, EmptyState } from '../sharedComponents';
import type { OpportunityDisplayItem } from '../customer360DisplayTypes';

interface OpportunitiesPanelProps {
  name: string;
  displayedOpportunities: OpportunityDisplayItem[];
  isOpportunitiesSimulated?: boolean;
}

export function OpportunitiesPanel({ name, displayedOpportunities }: OpportunitiesPanelProps) {
  return (
    <div className="flex w-full min-w-0 flex-1 flex-col space-y-4 overflow-x-hidden">
      <div className="border-border-subtle flex items-center justify-between gap-2 border-b pb-3">
        <div className="min-w-0">
          <h3 className="text-text-main truncate text-sm font-semibold">Commercial Deals</h3>
          <p className="text-text-muted mt-0.5 line-clamp-1 text-xs sm:line-clamp-none">
            Active negotiations, pipeline stages, and expected value.
          </p>
        </div>
        <Link
          href="/sales-crm/pipeline"
          className="bg-primary shadow-xs hover:bg-primary/90 inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-white transition-all"
        >
          <Plus className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">New Deal</span>
          <span className="sm:hidden">Nuevo</span>
        </Link>
      </div>

      {displayedOpportunities.length ? (
        <div className="grid w-full min-w-0 gap-3 sm:grid-cols-2">
          {displayedOpportunities.map((opp) => {
            const isSimulated = Boolean(opp.isSimulated);
            return (
              <div
                key={opp.id}
                className={`w-full min-w-0 space-y-3 rounded-xl p-4 transition-all ${
                  isSimulated
                    ? 'shadow-xs border border-dashed border-amber-500/40 bg-amber-500/[0.03]'
                    : 'border-border-subtle hover:border-primary/40 hover:shadow-xs bg-surface-muted/20 border p-4'
                }`}
              >
                <div className="flex min-w-0 items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex min-w-0 items-center gap-1.5">
                      <h4 className="text-text-main truncate text-sm font-semibold">{opp.name}</h4>
                      {isSimulated && <SimulatedBadge />}
                    </div>
                    <span className="text-text-muted mt-0.5 block text-xs">
                      Stage: {opp.stageKey}
                    </span>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                      isSimulated
                        ? 'border border-amber-500/30 bg-amber-500/20 text-amber-700 dark:text-amber-300'
                        : opp.stageKey === 'won'
                          ? 'border border-emerald-200 bg-emerald-50 text-emerald-700'
                          : opp.stageKey === 'lost'
                            ? 'border border-rose-200 bg-rose-50 text-rose-700'
                            : 'bg-primary/10 text-primary border-primary/20 border'
                    }`}
                  >
                    {opp.stageKey.toUpperCase()}
                  </span>
                </div>

                <div className="border-border-subtle flex items-center justify-between border-t pt-2">
                  <span className="text-text-main truncate text-base font-bold sm:text-lg">
                    {formatCurrency(opp.amount, opp.currency)}
                  </span>
                  <Link
                    href={`/sales-crm/opportunities/${opp.id}`}
                    className="text-primary inline-flex shrink-0 items-center gap-1 text-xs font-medium hover:underline"
                  >
                    View Deal <ChevronRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={<Briefcase className="text-text-muted h-8 w-8" />}
          title="No active opportunities"
          description={`Create a new deal to track pipeline progress, estimated amount, and target close date for ${name}.`}
          action={
            <Link
              href="/sales-crm/pipeline"
              className="bg-primary shadow-xs hover:bg-primary/90 inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-medium text-white transition-all"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Opportunity
            </Link>
          }
        />
      )}
    </div>
  );
}
