'use client';

import {
  Badge,
  Button,
  FilterDropdown,
  IconButton,
  KanbanBoard,
  ResponsiveTable,
  SearchInput,
  StatusBadge,
  TechnicalSurface,
  type KanbanColumn,
  type ResponsiveTableColumn,
} from '@loopdev/ui';
import { useMemo, useState } from 'react';

interface WorkflowItem {
  id: string;
  title: string;
  description: string;
  group: string;
  owner: string;
  priority: 'low' | 'medium' | 'high';
  status: 'active' | 'blocked' | 'complete';
}

const COLUMNS: KanbanColumn[] = [
  { id: 'queued', title: 'Queued', tone: 'neutral' },
  { id: 'in-review', title: 'In review', tone: 'primary' },
  { id: 'active', title: 'Active', tone: 'warning' },
  { id: 'blocked', title: 'Blocked', tone: 'danger' },
  { id: 'complete', title: 'Complete', tone: 'success' },
];

const ITEMS: WorkflowItem[] = [
  {
    id: 'work-1',
    title: 'Workspace review',
    description: 'Review the current operating configuration before the next handoff.',
    group: 'Operations',
    owner: 'MC',
    priority: 'high',
    status: 'active',
  },
  {
    id: 'work-2',
    title: 'Content batch preparation',
    description: 'Prepare a reusable content batch for the next publishing window.',
    group: 'Production',
    owner: 'AS',
    priority: 'medium',
    status: 'active',
  },
  {
    id: 'work-3',
    title: 'Integration check',
    description: 'Validate the integration contract and capture any follow-up work.',
    group: 'Platform',
    owner: 'JR',
    priority: 'high',
    status: 'blocked',
  },
  {
    id: 'work-4',
    title: 'Launch checklist',
    description: 'Confirm the final checklist and record the completion evidence.',
    group: 'Operations',
    owner: 'LK',
    priority: 'low',
    status: 'complete',
  },
];

const PRIORITY_TONE = {
  low: 'neutral',
  medium: 'warning',
  high: 'danger',
} as const;

const PRIORITY_BADGE_STATUS = {
  low: 'neutral',
  medium: 'energy',
  high: 'error',
} as const;

const getColumnId = (item: WorkflowItem) =>
  item.status === 'complete'
    ? 'complete'
    : item.group === 'Platform'
      ? 'blocked'
      : item.id === 'work-1'
        ? 'active'
        : item.id === 'work-2'
          ? 'in-review'
          : 'queued';

const getColumnTitle = (item: WorkflowItem) =>
  COLUMNS.find((column) => column.id === getColumnId(item))?.title ?? 'Queued';

export function KanbanBoardCertification() {
  const [query, setQuery] = useState('');
  const [view, setView] = useState('board');
  const [sort, setSort] = useState('title');
  const [filterValues, setFilterValues] = useState<Record<string, string[]>>({});

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const groups = filterValues.group ?? [];
    const priorities = filterValues.priority ?? [];

    return ITEMS.filter((item) => {
      const matchesQuery =
        !normalizedQuery ||
        [item.title, item.description, item.group]
          .join(' ')
          .toLowerCase()
          .includes(normalizedQuery);
      const matchesGroup = groups.length === 0 || groups.includes(item.group);
      const matchesPriority = priorities.length === 0 || priorities.includes(item.priority);
      return matchesQuery && matchesGroup && matchesPriority;
    }).sort((left, right) =>
      sort === 'priority'
        ? right.priority.localeCompare(left.priority)
        : left.title.localeCompare(right.title),
    );
  }, [filterValues, query, sort]);

  const updateFilter = (id: string, values: string[]) => {
    setFilterValues((current) => ({ ...current, [id]: values }));
  };

  const listColumns: ResponsiveTableColumn<WorkflowItem>[] = [
    {
      key: 'title',
      header: 'Title',
      className: 'min-w-[18rem]',
      render: (item) => (
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold leading-5 text-text-main">{item.title}</p>
          <p className="mt-0.5 truncate text-xs leading-4 text-text-muted">{item.description}</p>
        </div>
      ),
    },
    {
      key: 'stage',
      header: 'Stage',
      render: (item) => <Badge variant="outline">{getColumnTitle(item)}</Badge>,
    },
    {
      key: 'priority',
      header: 'Priority',
      render: (item) => (
        <Badge status={PRIORITY_BADGE_STATUS[item.priority]} variant="solid" showDot={false}>
          {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
        </Badge>
      ),
    },
    {
      key: 'owner',
      header: 'Assignee',
      render: (item) => <Badge variant="outline">{item.owner}</Badge>,
    },
    {
      key: 'group',
      header: 'Category',
      render: (item) => <span className="text-xs text-text-muted">{item.group}</span>,
    },
  ];

  const renderMobileRow = (item: WorkflowItem) => (
    <article className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 rounded-sm border border-border-subtle bg-surface-elevated px-3 py-3 shadow-sm">
      <div className="min-w-0">
        <p className="break-words text-sm font-semibold leading-5 text-text-main">{item.title}</p>
        <p className="mt-1 break-words text-xs leading-4 text-text-muted">{item.description}</p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Badge variant="outline">{getColumnTitle(item)}</Badge>
          <Badge status={PRIORITY_BADGE_STATUS[item.priority]} variant="solid" showDot={false}>
            {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
          </Badge>
          <span className="text-xs text-text-muted">{item.group}</span>
        </div>
      </div>
      <div className="flex shrink-0 flex-col items-end justify-between gap-2">
        <Badge variant="outline">{item.owner}</Badge>
        <IconButton
          icon="more_vert"
          size="md"
          variant="ghost"
          className="min-h-11 min-w-11"
          ariaLabel={`Actions for ${item.title}`}
        />
      </div>
    </article>
  );

  const renderCard = (item: WorkflowItem) => (
    <TechnicalSurface variant="surface" radius="sm" border="subtle" className="space-y-3 p-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="break-words text-sm font-semibold text-text-main">{item.title}</p>
          <p className="mt-1 break-words text-xs text-text-muted">{item.description}</p>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <Badge variant="outline">{item.owner}</Badge>
          <IconButton
            icon="more_vert"
            size="md"
            variant="ghost"
            className="min-h-11 min-w-11"
            ariaLabel={`Actions for ${item.title}`}
          />
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <StatusBadge
          severity={PRIORITY_TONE[item.priority]}
          label={item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
        />
        <span className="text-xs text-text-muted">{item.group}</span>
      </div>
    </TechnicalSurface>
  );

  return (
    <section className="space-y-4" aria-labelledby="kanban-board-heading">
      <div>
        <h2
          id="kanban-board-heading"
          className="font-mono text-sm uppercase tracking-[0.14em] text-text-main"
        >
          C11 · Generic Kanban board
        </h2>
        <p className="mt-1 text-xs text-text-muted">
          Domain-neutral stages, semantic column tones, optional metrics and custom cards.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-2 border-b border-border-subtle pb-3">
        <div
          className="flex items-center gap-0.5 rounded-lg border border-border-subtle bg-surface-elevated/60 p-1"
          role="group"
          aria-label="View"
        >
          {(['board', 'list'] as const).map((option) => (
            <Button
              key={option}
              size="sm"
              variant="ghost"
              className={
                view === option
                  ? 'bg-surface-light text-text-main shadow-sm dark:bg-surface-dark'
                  : 'text-text-muted'
              }
              aria-pressed={view === option}
              onClick={() => setView(option)}
            >
              {option === 'board' ? 'Board' : 'List'}
            </Button>
          ))}
        </div>
        <Button size="md" variant="primary" className="min-h-11 px-5 font-semibold shadow-md">
          Add item
        </Button>
      </div>

      <div
        className="flex min-w-0 flex-wrap items-center gap-2 lg:flex-nowrap"
        role="toolbar"
        aria-label="Kanban filters"
      >
        <span
          className="order-first w-full text-xs text-text-muted lg:order-none lg:ml-auto lg:w-auto"
          aria-live="polite"
        >
          {filteredItems.length} items
        </span>
        <div className="order-1 w-full min-w-0 sm:w-64 sm:flex-none lg:order-none lg:w-auto lg:flex-1">
          <SearchInput
            value={query}
            onValueChange={setQuery}
            placeholder="Search items"
            aria-label="Search Kanban items"
          />
        </div>
        <FilterDropdown
          icon="filter_alt"
          label="Group"
          className="order-2 w-auto shrink-0 sm:min-w-32 lg:order-none"
          options={['Operations', 'Production', 'Platform']}
          selected={filterValues.group ?? []}
          multiple
          onToggle={(value) => {
            const selected = filterValues.group ?? [];
            updateFilter(
              'group',
              selected.includes(value)
                ? selected.filter((item) => item !== value)
                : [...selected, value],
            );
          }}
          onClear={() => updateFilter('group', [])}
        />
        <FilterDropdown
          icon="filter_alt"
          label="Priority"
          className="order-2 w-auto shrink-0 sm:min-w-32 lg:order-none"
          options={['low', 'medium', 'high']}
          selected={filterValues.priority ?? []}
          multiple
          onToggle={(value) => {
            const selected = filterValues.priority ?? [];
            updateFilter(
              'priority',
              selected.includes(value)
                ? selected.filter((item) => item !== value)
                : [...selected, value],
            );
          }}
          onClear={() => updateFilter('priority', [])}
        />
        <FilterDropdown
          icon="sort"
          label={`Sort · ${sort === 'priority' ? 'Priority' : 'Title'}`}
          className="order-2 w-auto shrink-0 sm:min-w-36 lg:order-none"
          options={['Title', 'Priority']}
          selected={[sort === 'priority' ? 'Priority' : 'Title']}
          multiple={false}
          showSelectionCount={false}
          onToggle={(value) => setSort(value === 'Priority' ? 'priority' : 'title')}
        />
      </div>

      {view === 'list' ? (
        <ResponsiveTable
          caption="Kanban list view"
          columns={listColumns}
          rows={filteredItems}
          getRowKey={(item) => item.id}
          density="compact"
          renderMobileRow={renderMobileRow}
          showMobileHeader={false}
          emptyState="No items match the current filters"
          rowActions={(item) => (
            <IconButton
              icon="more_vert"
              size="md"
              variant="ghost"
              className="min-h-11 min-w-11"
              ariaLabel={`Actions for ${item.title}`}
            />
          )}
        />
      ) : (
        <div className="overflow-hidden rounded-md border border-border-technical bg-shell-canvas p-3">
          <KanbanBoard
            columns={COLUMNS.map((column) => ({
              ...column,
              bgClass: undefined,
            }))}
            items={filteredItems}
            getColumnId={getColumnId}
            getItemId={(item) => item.id}
            renderCard={renderCard}
            getColumnMetrics={(columnId, items) => ({
              count: items.filter((item) => {
                if (item.status === 'complete') return columnId === 'complete';
                if (item.group === 'Platform') return columnId === 'blocked';
                if (item.id === 'work-1') return columnId === 'active';
                if (item.id === 'work-2') return columnId === 'in-review';
                return columnId === 'queued';
              }).length,
              valueLabel: columnId === 'active' ? '2 due' : undefined,
            })}
            emptyStateSlot={
              <Button variant="ghost" size="sm" startIcon="add">
                Add card
              </Button>
            }
          />
        </div>
      )}
    </section>
  );
}
