'use client';

import {
  ActivityStream,
  Button,
  Icon,
  MetricCard,
  QuickActionMenu,
  TechnicalSurface,
} from '@loopdev/ui';

const ACTIVITY = [
  {
    id: '1',
    time: '09:42',
    type: 'SYNC' as const,
    pair: 'Contacts',
    status: 'success' as const,
    message: 'Import completed',
  },
  {
    id: '2',
    time: '09:18',
    type: 'SYSTEM' as const,
    pair: 'Workspace',
    status: 'success' as const,
    message: 'Workspace settings updated',
  },
  {
    id: '3',
    time: '08:55',
    type: 'SYSTEM' as const,
    pair: 'Pipeline',
    status: 'warning' as const,
    message: 'Three records need attention',
  },
];

const NEXT_STEPS = [
  ['Review flagged records', '3 records', 'warning'],
  ['Complete workspace setup', '2 of 4 steps', 'primary'],
  ['Invite a teammate', 'Optional', 'muted'],
] as const;

export function DashboardSummaryCertification() {
  return (
    <section className="space-y-4" aria-labelledby="dashboard-summary-heading">
      <div>
        <h2
          id="dashboard-summary-heading"
          className="font-mono text-sm uppercase tracking-[0.14em] text-text-main"
        >
          C10 · Dashboard and summary
        </h2>
        <p className="mt-1 text-xs text-text-muted">
          Reusable metrics, activity, quick actions, progress and next steps in one suite-neutral
          composition.
        </p>
      </div>

      <div className="space-y-6">
        <div className="flex flex-col gap-3 border-b border-border-subtle pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-text-muted">
              Workspace pulse
            </p>
            <p className="mt-1 text-sm text-text-main">
              A compact operational pulse for the current suite
            </p>
          </div>
          <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:justify-end">
            <Button size="sm" variant="primary" className="min-w-0 flex-1 sm:flex-none">
              Open workspace
            </Button>
            <QuickActionMenu
              triggerLabel="Summary actions"
              triggerIcon="more_vert"
              groups={[
                {
                  label: 'Summary actions',
                  actions: [
                    { id: 'export', label: 'Export summary', icon: 'download' },
                    { id: 'refresh', label: 'Refresh data', icon: 'refresh' },
                  ],
                },
              ]}
            />
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            label="Active records"
            value="248"
            delta="+12 this week"
            trend="up"
            icon="database"
          />
          <MetricCard
            label="Open tasks"
            value="18"
            delta="-4 from yesterday"
            trend="up"
            icon="task_alt"
          />
          <MetricCard label="Completion" value="76%" delta="+8.2%" trend="up" icon="trending_up" />
          <MetricCard
            label="Attention needed"
            value="3"
            delta="Review today"
            trend="down"
            icon="priority_high"
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.35fr_1fr]">
          <ActivityStream title="Recent activity" events={ACTIVITY} isLive />

          <div className="space-y-4">
            <TechnicalSurface
              variant="surface"
              depth="flat"
              radius="md"
              border="technical"
              className="p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-text-muted">
                  Next steps
                </p>
                <span className="text-xs text-text-muted">2 of 4 complete</span>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-background-subtle">
                <div className="h-full w-1/2 rounded-full bg-primary" />
              </div>
              <div className="mt-4 space-y-3">
                {NEXT_STEPS.map(([label, detail, tone]) => (
                  <div
                    key={label}
                    className="flex items-center justify-between gap-3 border-b border-border-subtle pb-3 last:border-0 last:pb-0"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm text-text-main">{label}</p>
                      <p className="mt-0.5 text-xs text-text-muted">{detail}</p>
                    </div>
                    <span
                      className="flex shrink-0 items-center gap-1.5 text-xs font-medium text-text-muted"
                      aria-label={`${tone === 'warning' ? 'Needs review' : tone === 'primary' ? 'In progress' : 'Optional'} status`}
                    >
                      <span
                        aria-hidden="true"
                        className={`flex size-5 items-center justify-center rounded-full border text-[11px] ${tone === 'warning' ? 'border-warning text-warning' : tone === 'primary' ? 'border-primary text-primary' : 'border-border-technical text-text-muted'}`}
                      >
                        <Icon
                          name={
                            tone === 'warning'
                              ? 'priority_high'
                              : tone === 'primary'
                                ? 'play_arrow'
                                : 'circle'
                          }
                          size="sm"
                        />
                      </span>
                      <span className="sr-only">
                        {tone === 'warning'
                          ? 'Needs review'
                          : tone === 'primary'
                            ? 'In progress'
                            : 'Optional'}
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </TechnicalSurface>

            <TechnicalSurface
              variant="surface"
              depth="flat"
              radius="md"
              border="technical"
              className="p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-text-muted">
                  Calendar
                </p>
                <Button size="sm" variant="ghost">
                  View all
                </Button>
              </div>
              <Button
                variant="ghost"
                className="mt-3 flex h-auto w-full flex-wrap items-start justify-start gap-3 p-2 text-left"
                aria-label="Open weekly operations review"
              >
                <div className="rounded-md border border-primary/30 bg-primary/10 px-3 py-2 text-center">
                  <p className="text-[10px] uppercase text-primary">Aug</p>
                  <p className="text-xl font-bold text-primary">19</p>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="break-words text-sm font-medium text-text-main">
                    Weekly operations review
                  </p>
                  <p className="mt-1 text-xs text-text-muted">Today · 14:00 · 5 attendees</p>
                </div>
              </Button>
            </TechnicalSurface>
          </div>
        </div>
      </div>
    </section>
  );
}
