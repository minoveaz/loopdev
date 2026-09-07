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

export function OpportunitiesPanel({
  name,
  displayedOpportunities,
}: OpportunitiesPanelProps) {
  return (
    <div className="space-y-4 flex-1 flex flex-col min-w-0 w-full overflow-x-hidden">
      <div className="flex items-center justify-between gap-2 pb-3 border-b border-border-subtle">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-text-main truncate">Commercial Deals</h3>
          <p className="text-xs text-text-muted mt-0.5 line-clamp-1 sm:line-clamp-none">
            Active negotiations, pipeline stages, and expected value.
          </p>
        </div>
        <Link
          href="/sales-crm/pipeline"
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white shadow-xs hover:bg-primary/90 transition-all shrink-0"
        >
          <Plus className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">New Deal</span>
          <span className="sm:hidden">Nuevo</span>
        </Link>
      </div>

      {displayedOpportunities.length ? (
        <div className="grid gap-3 sm:grid-cols-2 min-w-0 w-full">
          {displayedOpportunities.map((opp) => {
            const isSimulated = Boolean(opp.isSimulated);
            return (
              <div
                key={opp.id}
                className={`rounded-xl p-4 transition-all space-y-3 min-w-0 w-full ${
                  isSimulated
                    ? 'border border-dashed border-amber-500/40 bg-amber-500/[0.03] shadow-xs'
                    : 'border border-border-subtle p-4 hover:border-primary/40 hover:shadow-xs bg-surface-muted/20'
                }`}
              >
                <div className="flex items-start justify-between gap-2 min-w-0">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <h4 className="font-semibold text-sm text-text-main truncate">
                        {opp.name}
                      </h4>
                      {isSimulated && <SimulatedBadge />}
                    </div>
                    <span className="text-xs text-text-muted block mt-0.5">Stage: {opp.stageKey}</span>
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-semibold shrink-0 ${
                      isSimulated
                        ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30'
                        : opp.stageKey === 'won'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : opp.stageKey === 'lost'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-primary/10 text-primary border border-primary/20'
                    }`}
                  >
                    {opp.stageKey.toUpperCase()}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border-subtle">
                  <span className="text-base sm:text-lg font-bold text-text-main truncate">
                    {formatCurrency(opp.amount, opp.currency)}
                  </span>
                  <Link
                    href={`/sales-crm/opportunities/${opp.id}`}
                    className="text-xs font-medium text-primary hover:underline inline-flex items-center gap-1 shrink-0"
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
          icon={<Briefcase className="h-8 w-8 text-text-muted" />}
          title="No active opportunities"
          description={`Create a new deal to track pipeline progress, estimated amount, and target close date for ${name}.`}
          action={
            <Link
              href="/sales-crm/pipeline"
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-xs font-medium text-white shadow-xs hover:bg-primary/90 transition-all"
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
