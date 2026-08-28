'use client';

import { Badge, ResponsiveTable, TechnicalSurface } from '@loopdev/ui';
import type React from 'react';

type QuantitativeTrend = 'positive' | 'negative' | 'neutral';
type QuantitativeGoalDirection = 'higher' | 'lower';

export interface QuantitativeRow {
  id: string;
  metric: string;
  current: string;
  change: string;
  trend: QuantitativeTrend;
  direction: 'up' | 'down' | 'flat';
  target: string;
  currentValue: number;
  targetValue: number;
  goalDirection: QuantitativeGoalDirection;
}

const rows: QuantitativeRow[] = [
  {
    id: 'pipeline',
    metric: 'Pipeline value',
    current: '$248,000',
    change: '+18%',
    trend: 'positive',
    direction: 'up',
    target: '$300,000',
    currentValue: 248000,
    targetValue: 300000,
    goalDirection: 'higher',
  },
  {
    id: 'win-rate',
    metric: 'Win rate',
    current: '42%',
    change: '+6%',
    trend: 'positive',
    direction: 'up',
    target: '45%',
    currentValue: 42,
    targetValue: 45,
    goalDirection: 'higher',
  },
  {
    id: 'cycle',
    metric: 'Average sales cycle',
    current: '23 days',
    change: '-4 days',
    trend: 'positive',
    direction: 'down',
    target: '20 days',
    currentValue: 23,
    targetValue: 20,
    goalDirection: 'lower',
  },
];

const trendStatus = {
  positive: 'success',
  negative: 'error',
  neutral: 'neutral',
} as const;

function getGoalProgress(row: QuantitativeRow) {
  const progress =
    row.goalDirection === 'higher'
      ? (row.currentValue / row.targetValue) * 100
      : (row.targetValue / row.currentValue) * 100;

  return Math.max(0, Math.min(100, progress));
}

function formatProgress(progress: number) {
  return `${progress.toFixed(1)}%`;
}

export type QuantitativeTableProps = {
  contextPanelEnabled?: boolean;
  onRowClick?: (row: QuantitativeRow, index: number) => void;
  activeRowKey?: React.Key;
};

export function QuantitativeTable({
  contextPanelEnabled = false,
  onRowClick,
  activeRowKey,
}: QuantitativeTableProps = {}) {
  return (
    <TechnicalSurface variant="surface" radius="md" border="subtle" className="w-full min-w-0 p-4">
      <ResponsiveTable
        surface={false}
        caption="Quantitative metrics"
        rows={rows}
        pageSize={0}
        getRowKey={(row) => row.id}
        onRowClick={contextPanelEnabled ? onRowClick : undefined}
        activeRowKey={contextPanelEnabled ? activeRowKey : undefined}
        className="[&_thead_tr]:bg-background-subtle [&_thead_tr]:border-b [&_thead_tr]:border-border-subtle [&_tbody_tr:hover]:bg-background-subtle [&_tbody_td]:py-3"
        renderMobileRow={(row) => {
          const progress = getGoalProgress(row);
          return (
            <div className="border-b border-border-subtle px-3 py-3">
              <div className="flex items-start justify-between gap-3">
                <span className="min-w-0 font-medium text-text-main">{row.metric}</span>
                <span className="shrink-0 font-semibold tabular-nums text-text-main">
                  {row.current}
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between gap-3">
                <Badge
                  variant="ghost"
                  status={trendStatus[row.trend]}
                  showDot={false}
                  icon={
                    row.direction === 'up'
                      ? 'arrow_upward'
                      : row.direction === 'down'
                        ? 'arrow_downward'
                        : undefined
                  }
                  className="px-2 py-1"
                >
                  {row.change}
                </Badge>
                <span className="text-right text-xs tabular-nums text-text-muted">
                  Target {row.target} ({formatProgress(progress)})
                </span>
              </div>
              <div
                className="mt-2 h-1 w-full overflow-hidden rounded-full bg-border-subtle"
                role="progressbar"
                aria-label={`${row.metric} target progress`}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={progress}
              >
                <div className="h-full rounded-full bg-primary" style={{ width: `${progress}%` }} />
              </div>
            </div>
          );
        }}
        columns={[
          { key: 'metric', header: 'Metric', className: 'font-medium text-text-main' },
          {
            key: 'current',
            header: <span className="block w-full text-right">Current</span>,
            className: 'w-36 text-right tabular-nums font-semibold',
          },
          {
            key: 'change',
            header: (
              <span className="flex w-full flex-col items-end text-right">
                <span>Change</span>
                <span className="font-sans text-[10px] normal-case tracking-normal text-text-muted">
                  vs last month
                </span>
              </span>
            ),
            className: 'w-40 text-right tabular-nums',
            render: (row) => (
              <Badge
                variant="ghost"
                status={trendStatus[row.trend]}
                showDot={false}
                icon={
                  row.direction === 'up'
                    ? 'arrow_upward'
                    : row.direction === 'down'
                      ? 'arrow_downward'
                      : undefined
                }
                className="justify-end px-2 py-1"
              >
                {row.change}
              </Badge>
            ),
          },
          {
            key: 'target',
            header: <span className="block w-full text-right">Target vs goal</span>,
            className: 'w-56 text-right tabular-nums',
            render: (row) => {
              const progress = getGoalProgress(row);
              return (
                <div className="ml-auto flex w-full max-w-[180px] flex-col items-end gap-1">
                  <div className="flex w-full items-baseline justify-end gap-2">
                    <span className="text-text-main">{row.target}</span>
                    <span className="text-xs text-text-muted">({formatProgress(progress)})</span>
                  </div>
                  <div
                    role="progressbar"
                    aria-label={`${row.metric} target progress`}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={progress}
                    className="mt-1 h-1 w-full overflow-hidden rounded-full bg-border-subtle"
                  >
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              );
            },
          },
        ]}
      />
      <footer className="flex items-center justify-between gap-3 border-t border-border-technical bg-background-subtle px-3 py-2 text-xs text-text-muted">
        <span>Last calculated: Today at 08:00 AM</span>
        <a href="#detailed-analytics" className="text-text-main underline-offset-2 hover:underline">
          View detailed analytics ↗
        </a>
      </footer>
    </TechnicalSurface>
  );
}
