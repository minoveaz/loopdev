'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import {
  Badge,
  Button,
  Heading,
  ModuleHeader,
  ResponsiveTable,
  SuiteCanvas,
  TechnicalSurface,
  type ResponsiveTableColumn,
} from '@loopdev/ui';
import { Clock, Plus } from 'lucide-react';
import type { Task, TaskPage, TaskPriority, TaskRelationType, TaskStatus } from '@loopdev/contracts';

import { useOrganization } from '@/hooks/useOrganization';
import { useOrganizationPermissions } from '@/hooks/useOrganizationPermissions';
import { TaskPreview } from '@/suites/sales-crm/crm';

const PAGE_SIZE = 100;

type SlaFilter = 'all' | 'today' | 'overdue' | 'completed';

function formatDate(value: string | null) {
  if (!value) return 'Sin fecha';
  return new Intl.DateTimeFormat('es-ES', { dateStyle: 'medium' }).format(new Date(value));
}

function isToday(dateStr: string | null) {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

function isOverdue(task: Task) {
  if (!task.dueAt || task.status === 'completed' || task.status === 'cancelled') return false;
  return new Date(task.dueAt).getTime() < Date.now();
}

function getRelationLabel(type: TaskRelationType) {
  switch (type) {
    case 'contact':
      return 'Contacto';
    case 'lead':
      return 'Lead';
    case 'opportunity':
      return 'Trato';
    default:
      return type;
  }
}

function getRelationHref(task: Task) {
  switch (task.relationType) {
    case 'contact':
      return `/sales-crm/contacts/${task.relationId}`;
    case 'lead':
      return `/sales-crm/leads/${task.relationId}`;
    case 'opportunity':
      return `/sales-crm/opportunities/${task.relationId}`;
    default:
      return '#';
  }
}

function getPriorityBadge(priority: TaskPriority) {
  switch (priority) {
    case 'urgent':
      return (
        <Badge status="error" variant="outline" showDot={false}>
          Urgente
        </Badge>
      );
    case 'high':
      return (
        <Badge status="energy" variant="outline" showDot={false}>
          Alta
        </Badge>
      );
    case 'normal':
      return (
        <Badge status="neutral" variant="outline" showDot={false}>
          Normal
        </Badge>
      );
    case 'low':
      return (
        <Badge status="neutral" variant="outline" showDot={false}>
          Baja
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" showDot={false}>
          {priority}
        </Badge>
      );
  }
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
  const [slaFilter, setSlaFilter] = useState<SlaFilter>('all');
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

  const slaCounts = useMemo(() => {
    let today = 0;
    let overdue = 0;
    let completed = 0;
    for (const t of tasks) {
      if (t.status === 'completed') {
        completed++;
      } else {
        if (isOverdue(t)) overdue++;
        if (isToday(t.dueAt)) today++;
      }
    }
    return {
      all: tasks.length,
      today,
      overdue,
      completed,
    };
  }, [tasks]);

  const visibleTasks = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase();
    return tasks.filter((task) => {
      // SLA filter
      if (slaFilter === 'today') {
        if (task.status === 'completed' || !isToday(task.dueAt)) return false;
      } else if (slaFilter === 'overdue') {
        if (!isOverdue(task)) return false;
      } else if (slaFilter === 'completed') {
        if (task.status !== 'completed') return false;
      }

      // Status dropdown filter
      if (status !== 'all' && task.status !== status) {
        return false;
      }

      // Query filter
      if (!normalized) return true;
      const searchable = `${task.title} ${task.type ?? ''} ${task.relationType} ${getRelationLabel(task.relationType)}`.toLocaleLowerCase();
      return searchable.includes(normalized);
    });
  }, [query, slaFilter, status, tasks]);

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
        header: 'Tarea',
        sortable: true,
        render: (task) => (
          <div className="min-w-0">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-text-main hover:text-primary truncate p-0 text-left font-medium hover:underline justify-start h-auto"
              onClick={() => setSelectedId(task.id)}
            >
              <span className={task.status === 'completed' ? 'line-through text-text-muted' : ''}>
                {task.title}
              </span>
            </Button>
            <div className="mt-1 flex items-center gap-1.5">
              <Link
                href={getRelationHref(task)}
                className="inline-flex items-center gap-1 rounded bg-secondary/70 px-1.5 py-0.5 text-xs font-medium text-text-main hover:text-primary transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                {getRelationLabel(task.relationType)}
              </Link>
              {task.type ? (
                <span className="text-text-muted text-xs">· {task.type}</span>
              ) : null}
            </div>
          </div>
        ),
        sortAccessor: (task) => task.title,
      },
      {
        key: 'status',
        header: 'Estado',
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
      {
        key: 'priority',
        header: 'Prioridad',
        render: (task) => getPriorityBadge(task.priority),
      },
      {
        key: 'dueAt',
        header: 'Vencimiento',
        sortable: true,
        render: (task) => {
          const overdue = isOverdue(task);
          return (
            <span
              className={`inline-flex items-center gap-1 text-xs ${
                overdue ? 'font-semibold text-status-error' : 'text-text-muted'
              }`}
            >
              {overdue ? <Clock className="size-3 text-status-error" /> : null}
              {formatDate(task.dueAt)}
            </span>
          );
        },
        sortAccessor: (task) => task.dueAt ?? '',
      },
    ],
    [],
  );

  if (isLoadingPermissions || !activeOrganizationId) {
    return <div className="text-text-muted p-6 text-sm">Preparando espacio de Tareas...</div>;
  }
  if (!canRead) {
    return (
      <div className="flex min-h-full items-center justify-center p-6">
        <p className="text-text-muted text-sm">No tienes permisos para ver las Tareas.</p>
      </div>
    );
  }

  const slaTabs: { id: SlaFilter; label: string; count: number; alert?: boolean }[] = [
    { id: 'all', label: 'Todas', count: slaCounts.all },
    { id: 'today', label: 'Para hoy', count: slaCounts.today },
    { id: 'overdue', label: 'Vencidas', count: slaCounts.overdue, alert: slaCounts.overdue > 0 },
    { id: 'completed', label: 'Completadas', count: slaCounts.completed },
  ];

  return (
    <SuiteCanvas
      mode="data"
      header={
        <ModuleHeader
          segments={[{ id: 'tasks', label: 'Tareas', href: '/sales-crm/tasks' }]}
          leftSlot={
            <Heading as="h1" size="lg" weight="semibold">
              Tareas
            </Heading>
          }
          rightSlot={
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="/sales-crm/tasks/today"
                className="text-text-muted hover:text-text-main text-sm font-medium px-3 py-1.5 rounded-md hover:bg-secondary/60 transition-colors"
              >
                Mi Día
              </Link>
              {canManage ? (
                <Link
                  href="/sales-crm/tasks/new"
                  className="bg-primary text-primary-foreground inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  <Plus className="size-4" />
                  Nueva tarea
                </Link>
              ) : null}
            </div>
          }
          ariaLabel="Cabecera de Tareas"
        />
      }
    >
      <div className="space-y-4">
        {/* SLA Filters Bar */}
        <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-1">
          {slaTabs.map((tab) => {
            const isActive = slaFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSlaFilter(tab.id)}
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium border transition-colors min-h-[36px] sm:min-h-[32px] ${
                  isActive
                    ? 'border-primary bg-primary text-primary-foreground font-semibold shadow-xs'
                    : 'border-border-subtle bg-surface text-text-muted hover:text-text-main hover:bg-surface/80'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] font-semibold ${
                    isActive
                      ? 'bg-primary-foreground/20 text-primary-foreground'
                      : tab.alert
                        ? 'bg-status-error/15 text-status-error'
                        : 'bg-secondary text-text-muted'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Filter controls */}
        <TechnicalSurface variant="surface" radius="md" border="technical" className="p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <label className="min-w-0 flex-1 text-xs font-medium text-text-muted">
              Buscar tareas
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar por título, tipo o entidad relacionada..."
                className="border-border-subtle bg-background text-text-main mt-1 min-h-9 w-full rounded-md border px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary"
              />
            </label>
            <label className="text-xs font-medium text-text-muted">
              Estado
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value as 'all' | TaskStatus)}
                className="border-border-subtle bg-background text-text-main mt-1 min-h-9 min-w-40 rounded-md border px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <option value="all">Todos los estados</option>
                <option value="open">Abierta</option>
                <option value="in_progress">En progreso</option>
                <option value="completed">Completada</option>
                <option value="cancelled">Cancelada</option>
              </select>
            </label>
          </div>
        </TechnicalSurface>

        {error ? (
          <div
            role="alert"
            className="border-status-error/40 bg-status-error/10 text-status-error flex flex-wrap items-center justify-between gap-3 rounded-md border p-3 text-sm"
          >
            <span>{error}</span>
            <Button type="button" size="sm" variant="secondary" onClick={() => void loadTasks()}>
              Retry
            </Button>
          </div>
        ) : null}

        <div className={selectedId ? 'grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_22rem]' : ''}>
          <TechnicalSurface variant="surface" radius="md" border="technical" className="p-4">
            <ResponsiveTable
              caption="Tareas CRM"
              columns={columns}
              rows={visibleTasks}
              getRowKey={(task) => task.id}
              loading={isLoading}
              loadingState="Cargando tareas..."
              emptyState={
                query || slaFilter !== 'all' || status !== 'all'
                  ? 'No hay tareas con estos filtros.'
                  : 'No hay tareas creadas todavía.'
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
                      variant="primary"
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
              renderMobileRow={(task) => {
                const overdue = isOverdue(task);
                const isDone = task.status === 'completed';
                return (
                  <div className="border-border-subtle bg-background rounded-lg border p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-text-main min-w-0 flex-1 truncate text-left font-medium hover:underline p-0 h-auto justify-start"
                        onClick={() => setSelectedId(task.id)}
                      >
                        <span
                          className={`text-base font-semibold ${
                            isDone ? 'line-through text-text-muted' : ''
                          }`}
                        >
                          {task.title}
                        </span>
                      </Button>
                      <Badge
                        status={isDone ? 'success' : overdue ? 'error' : 'neutral'}
                        variant="outline"
                        showDot={false}
                      >
                        {task.status.replace('_', ' ')}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <Link
                        href={getRelationHref(task)}
                        className="inline-flex items-center gap-1 rounded bg-secondary px-2 py-0.5 font-medium text-text-main hover:text-primary transition-colors"
                      >
                        <span>{getRelationLabel(task.relationType)}</span>
                      </Link>
                      {task.type ? (
                        <span className="text-text-muted">· {task.type}</span>
                      ) : null}
                      <span
                        className={`inline-flex items-center gap-1 ${
                          overdue ? 'text-status-error font-medium' : 'text-text-muted'
                        }`}
                      >
                        <Clock className="size-3" />
                        {formatDate(task.dueAt)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-border-subtle/50">
                      <div>{getPriorityBadge(task.priority)}</div>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          size="sm"
                          variant="secondary"
                          className="min-h-[44px] px-3"
                          onClick={() => setSelectedId(task.id)}
                        >
                          Preview
                        </Button>
                        {canManage && !isDone && task.status !== 'cancelled' ? (
                          <Button
                            type="button"
                            size="sm"
                            variant="primary"
                            className="min-h-[44px] px-3"
                            disabled={pendingId === task.id}
                            onClick={() => void completeTask(task)}
                          >
                            Complete
                          </Button>
                        ) : null}
                      </div>
                    </div>
                  </div>
                );
              }}
            />
          </TechnicalSurface>
          {selectedId
            ? (() => {
                const selected = visibleTasks.find((task) => task.id === selectedId);
                return selected ? (
                  <TaskPreview task={selected} onClose={() => setSelectedId(null)} />
                ) : null;
              })()
            : null}
        </div>
      </div>
    </SuiteCanvas>
  );
}
