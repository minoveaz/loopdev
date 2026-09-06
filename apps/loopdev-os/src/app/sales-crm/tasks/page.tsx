'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import {
  Badge,
  Button,
  Heading,
  ModuleHeader,
  ResponsiveTable,
  TechnicalSurface,
  type ResponsiveTableColumn,
} from '@loopdev/ui';
import type { Task, TaskPage, TaskStatus } from '@loopdev/contracts';

import { useOrganization } from '@/hooks/useOrganization';
import { useOrganizationPermissions } from '@/hooks/useOrganizationPermissions';
import { TaskPreview } from '@/suites/sales-crm/crm';

const PAGE_SIZE = 100;

function formatDate(value: string | null) {
  return value
    ? new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(new Date(value))
    : 'No due date';
}

function isOverdue(task: Task) {
  return Boolean(
    task.dueAt && new Date(task.dueAt).getTime() < Date.now() && task.status !== 'completed',
  );
}

export default function TasksPage() {
  const { activeOrganizationId } = useOrganization();
  const { isLoading: isLoadingPermissions, hasPermission } = useOrganizationPermissions([
    'crm.read',
    'crm.manage',
  ]);
  const canRead = hasPermission('crm.read');
  const canManage = hasPermission('crm.manage');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<'all' | TaskStatus>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const loadTasks = async (signal?: AbortSignal) => {
    if (!activeOrganizationId) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/crm/tasks?organizationId=${encodeURIComponent(activeOrganizationId)}&limit=${PAGE_SIZE}`,
        { signal },
      );
      if (!response.ok) throw new Error('Tasks could not be loaded.');
      const page = (await response.json()) as TaskPage;
      setTasks(page.items);
    } catch (requestError: unknown) {
      if (requestError instanceof DOMException && requestError.name === 'AbortError') return;
      setError(requestError instanceof Error ? requestError.message : 'Tasks could not be loaded.');
    } finally {
      if (!signal?.aborted) setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!activeOrganizationId || isLoadingPermissions || !canRead) {
      setIsLoading(false);
      return;
    }
    const controller = new AbortController();
    void loadTasks(controller.signal);
    return () => controller.abort();
  }, [activeOrganizationId, canRead, isLoadingPermissions]);

  const visibleTasks = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase();
    return tasks.filter((task) => {
      const matchesStatus = status === 'all' || task.status === status;
      return (
        matchesStatus &&
        (!normalized ||
          `${task.title} ${task.type ?? ''} ${task.relationType}`
            .toLocaleLowerCase()
            .includes(normalized))
      );
    });
  }, [query, status, tasks]);

  const completeTask = async (task: Task) => {
    if (!activeOrganizationId || !canManage) return;
    setPendingId(task.id);
    setError(null);
    try {
      const response = await fetch(`/api/crm/tasks/${task.id}/complete`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          organizationId: activeOrganizationId,
          expectedVersion: task.version,
          idempotencyKey: `crm-ui-complete-${task.id}-${task.version}`,
        }),
      });
      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error ?? 'Task could not be completed.');
      }
      const updated = (await response.json()) as Task;
      setTasks((current) => current.map((item) => (item.id === updated.id ? updated : item)));
    } catch (requestError: unknown) {
      setError(
        requestError instanceof Error ? requestError.message : 'Task could not be completed.',
      );
    } finally {
      setPendingId(null);
    }
  };

  const columns = useMemo<ResponsiveTableColumn<Task>[]>(
    () => [
      {
        key: 'title',
        header: 'Task',
        sortable: true,
        render: (task) => (
          <div className="min-w-0">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-text-main truncate text-left font-medium hover:underline"
              onClick={() => setSelectedId(task.id)}
            >
              {task.title}
            </Button>
            <p className="text-text-muted truncate text-xs">{task.type ?? task.relationType}</p>
          </div>
        ),
        sortAccessor: (task) => task.title,
      },
      {
        key: 'status',
        header: 'Status',
        sortable: true,
        render: (task) => (
          <Badge
            status={task.status === 'completed' ? 'success' : isOverdue(task) ? 'error' : 'neutral'}
            variant="outline"
            showDot={false}
          >
            {task.status.replace('_', ' ')}
          </Badge>
        ),
      },
      { key: 'priority', header: 'Priority', render: (task) => task.priority },
      {
        key: 'assignedUserId',
        header: 'Assignee',
        render: (task) => task.assignedUserId ?? 'Unassigned',
      },
      {
        key: 'dueAt',
        header: 'Due',
        sortable: true,
        render: (task) => formatDate(task.dueAt),
        sortAccessor: (task) => task.dueAt ?? '',
      },
    ],
    [],
  );

  if (isLoadingPermissions || !activeOrganizationId) {
    return <div className="text-text-muted p-6 text-sm">Preparing Tasks workspace...</div>;
  }
  if (!canRead) {
    return (
      <div className="flex min-h-full items-center justify-center p-6">
        <p className="text-text-muted text-sm">You do not have permission to view Tasks.</p>
      </div>
    );
  }

  return (
    <div className="bg-shell-canvas flex min-h-full min-w-0 flex-1 flex-col">
      <ModuleHeader
        segments={[{ id: 'tasks', label: 'Tasks', href: '/sales-crm/tasks' }]}
        leftSlot={
          <Heading as="h1" size="lg" weight="semibold">
            Tasks
          </Heading>
        }
        rightSlot={
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/sales-crm/tasks/today"
              className="text-primary text-sm font-medium underline-offset-2 hover:underline"
            >
              My day
            </Link>
            {canManage ? (
              <Link
                href="/sales-crm/tasks/new"
                className="bg-primary text-primary-foreground rounded-md px-3 py-2 text-sm font-medium"
              >
                New task
              </Link>
            ) : null}
          </div>
        }
        ariaLabel="Tasks header"
      />
      <main className="min-h-0 flex-1 overflow-auto p-4 lg:p-6">
        <TechnicalSurface variant="surface" radius="md" border="technical" className="mb-4 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <label className="min-w-0 flex-1 text-xs font-medium text-text-muted">
              Search tasks
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Title, type or relation"
                className="border-border-subtle bg-background text-text-main mt-1 min-h-9 w-full rounded-md border px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary"
              />
            </label>
            <label className="text-xs font-medium text-text-muted">
              Status
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value as 'all' | TaskStatus)}
                className="border-border-subtle bg-background text-text-main mt-1 min-h-9 min-w-40 rounded-md border px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <option value="all">All statuses</option>
                <option value="open">Open</option>
                <option value="in_progress">In progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </label>
          </div>
        </TechnicalSurface>
        {error ? (
          <div
            role="alert"
            className="border-status-error/40 bg-status-error/10 text-status-error mb-4 flex flex-wrap items-center justify-between gap-3 rounded-md border p-3 text-sm"
          >
            <span>{error}</span>
            <Button type="button" size="sm" variant="secondary" onClick={() => void loadTasks()}>
              Retry
            </Button>
          </div>
        ) : null}
        <div className={selectedId ? 'grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_20rem]' : ''}>
          <ResponsiveTable
            caption="CRM tasks"
            columns={columns}
            rows={visibleTasks}
            getRowKey={(task) => task.id}
            loading={isLoading}
            loadingState="Loading tasks"
            emptyState={
              query || status !== 'all' ? 'No tasks match these filters.' : 'No tasks yet.'
            }
            errorState={undefined}
            paginationVariant="compact"
            hidePageSizeSelector
            rowActions={(task) =>
              canManage && task.status !== 'completed' && task.status !== 'cancelled' ? (
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={() => setSelectedId(task.id)}
                  >
                    Preview
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    disabled={pendingId === task.id}
                    onClick={() => void completeTask(task)}
                  >
                    Complete
                  </Button>
                </div>
              ) : (
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  onClick={() => setSelectedId(task.id)}
                >
                  Preview
                </Button>
              )
            }
            renderMobileRow={(task) => (
              <div className="border-border-subtle bg-background rounded-lg border p-3">
                <div className="flex items-start justify-between gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-text-main min-w-0 truncate text-left font-medium hover:underline"
                    onClick={() => setSelectedId(task.id)}
                  >
                    {task.title}
                  </Button>
                  <Badge
                    status={
                      task.status === 'completed'
                        ? 'success'
                        : isOverdue(task)
                          ? 'error'
                          : 'neutral'
                    }
                    variant="outline"
                    showDot={false}
                  >
                    {task.status.replace('_', ' ')}
                  </Badge>
                </div>
                <p className="text-text-muted mt-1 text-xs">
                  {task.relationType} · {formatDate(task.dueAt)}
                </p>
                {canManage && task.status !== 'completed' && task.status !== 'cancelled' ? (
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    className="mt-3"
                    disabled={pendingId === task.id}
                    onClick={() => void completeTask(task)}
                  >
                    Complete
                  </Button>
                ) : null}
              </div>
            )}
          />
          {selectedId
            ? (() => {
                const selected = visibleTasks.find((task) => task.id === selectedId);
                return selected ? (
                  <TaskPreview task={selected} onClose={() => setSelectedId(null)} />
                ) : null;
              })()
            : null}
        </div>
      </main>
    </div>
  );
}
