'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Button,
  Heading,
  IconButton,
  ModuleHeader,
  ResponsiveTable,
  Select,
  SuiteCanvas,
  TechnicalSurface,
  type ResponsiveTableColumn,
} from '@loopdev/ui';
import {
  AlertCircle,
  Calendar,
  Check,
  CheckCircle2,
  CheckSquare,
  Clock,
  Eye,
  FileText,
  Mail,
  Phone,
  Plus,
  Search,
  SignalHigh,
  SignalLow,
  SignalMedium,
  Sparkles,
  Sun,
  TrendingUp,
  User,
  X,
} from 'lucide-react';
import type { Task, TaskPriority, TaskRelationType, TaskStatus } from '@loopdev/contracts';

import { useOrganization } from '@/hooks/useOrganization';
import { useOrganizationPermissions } from '@/hooks/useOrganizationPermissions';
import { TaskPreview } from '@/suites/sales-crm/crm';
import { usePlatformRuntime } from '@/providers/PlatformRuntimeProvider';
import { completeCrmTask, crmTasks } from '@/suites/sales-crm/runtimeAdapter';

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

function getRelationBadge(task: Task) {
  let icon = <User className="text-text-muted size-3 shrink-0" />;
  let label = 'Contacto';
  if (task.relationType === 'lead') {
    icon = <Sparkles className="size-3 shrink-0 text-status-warning" />;
    label = 'Lead';
  } else if (task.relationType === 'opportunity') {
    icon = <TrendingUp className="size-3 shrink-0 text-status-success" />;
    label = 'Trato';
  }

  return (
    <Link
      href={getRelationHref(task)}
      className="bg-secondary/80 hover:bg-secondary text-text-main hover:text-primary border-border-subtle/60 inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-medium transition-colors"
      onClick={(e) => e.stopPropagation()}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}

function getTypeBadge(type: string | null | undefined) {
  if (!type) return null;
  const normalized = type.toLowerCase();
  let icon = <CheckSquare className="text-text-muted size-3 shrink-0" />;
  let label = type;

  if (normalized.includes('call') || normalized.includes('llamada')) {
    icon = <Phone className="size-3 shrink-0 text-status-info" />;
    label = 'Llamada';
  } else if (normalized.includes('email') || normalized.includes('correo')) {
    icon = <Mail className="size-3 shrink-0 text-accent" />;
    label = 'Correo';
  } else if (normalized.includes('meeting') || normalized.includes('reunion')) {
    icon = <Calendar className="size-3 shrink-0 text-status-warning" />;
    label = 'Reunión';
  } else if (normalized.includes('contract') || normalized.includes('contrato')) {
    icon = <FileText className="size-3 shrink-0 text-status-success" />;
    label = 'Contrato';
  } else if (normalized.includes('verification') || normalized.includes('revision')) {
    icon = <CheckCircle2 className="size-3 shrink-0 text-primary" />;
    label = 'Revisión';
  }

  return (
    <span className="bg-secondary/60 text-text-main border-border-subtle/50 inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-medium">
      {icon}
      <span>{label}</span>
    </span>
  );
}

function getLinearPriorityBadge(priority: TaskPriority) {
  switch (priority) {
    case 'urgent':
      return (
        <span className="border-status-error/25 bg-status-error/10 text-status-error inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[11px] font-semibold">
          <AlertCircle className="text-status-error size-3 shrink-0" />
          <span>Urgente</span>
        </span>
      );
    case 'high':
      return (
        <span className="border-status-warning/25 bg-status-warning/10 text-status-warning inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[11px] font-medium">
          <SignalHigh className="text-status-warning size-3 shrink-0" />
          <span>Alta</span>
        </span>
      );
    case 'normal':
      return (
        <span className="border-border-subtle bg-secondary/60 text-text-muted inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[11px] font-medium">
          <SignalMedium className="size-3 shrink-0 opacity-70" />
          <span>Media</span>
        </span>
      );
    case 'low':
      return (
        <span className="border-border-subtle/50 bg-secondary/30 text-text-muted/80 inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[11px] font-medium">
          <SignalLow className="size-3 shrink-0 opacity-50" />
          <span>Baja</span>
        </span>
      );
    default:
      return (
        <span className="border-border-subtle text-text-muted inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px]">
          {priority}
        </span>
      );
  }
}

function getStatusBadge(status: TaskStatus, overdue: boolean) {
  switch (status) {
    case 'completed':
      return (
        <span className="border-status-success/20 bg-status-success/10 text-status-success inline-flex items-center gap-1.5 rounded-md border px-2.5 py-0.5 text-[11px] font-medium">
          <CheckCircle2 className="size-3 shrink-0" />
          <span>Completada</span>
        </span>
      );
    case 'in_progress':
      return (
        <span className="border-status-info/20 bg-status-info/10 text-status-info inline-flex items-center gap-1.5 rounded-md border px-2.5 py-0.5 text-[11px] font-medium">
          <Clock className="size-3 shrink-0" />
          <span>En progreso</span>
        </span>
      );
    case 'cancelled':
      return (
        <span className="border-border-subtle bg-secondary text-text-muted inline-flex items-center gap-1.5 rounded-md border px-2.5 py-0.5 text-[11px] font-medium">
          <X className="size-3 shrink-0" />
          <span>Cancelada</span>
        </span>
      );
    default:
      if (overdue) {
        return (
          <span className="border-status-error/25 bg-status-error/10 text-status-error inline-flex items-center gap-1.5 rounded-md border px-2.5 py-0.5 text-[11px] font-semibold">
            <AlertCircle className="text-status-error size-3 shrink-0" />
            <span>Pendiente</span>
          </span>
        );
      }
      return (
        <span className="border-border-subtle bg-surface text-text-muted inline-flex items-center gap-1.5 rounded-md border px-2.5 py-0.5 text-[11px] font-medium">
          <span className="bg-primary/70 size-1.5 shrink-0 rounded-full" />
          <span>Abierta</span>
        </span>
      );
  }
}

function formatDueBadge(dueAt: string | null, isDone: boolean) {
  if (!dueAt) {
    return <span className="text-text-muted/60 text-xs">Sin fecha</span>;
  }
  const d = new Date(dueAt);
  const now = new Date();
  const overdue = !isDone && d.getTime() < now.getTime();
  const today = isToday(dueAt);

  if (overdue) {
    return (
      <span className="border-status-error/20 bg-status-error/10 text-status-error inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[11px] font-semibold">
        <Clock className="text-status-error size-3 shrink-0" />
        <span>{formatDate(dueAt)} (Vencida)</span>
      </span>
    );
  }

  if (today) {
    return (
      <span className="border-status-warning/20 bg-status-warning/10 text-status-warning inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[11px] font-semibold">
        <Calendar className="text-status-warning size-3 shrink-0" />
        <span>Hoy</span>
      </span>
    );
  }

  return (
    <span className="text-text-muted inline-flex items-center gap-1.5 text-xs">
      <Calendar className="size-3 shrink-0 opacity-60" />
      <span>{formatDate(dueAt)}</span>
    </span>
  );
}

function TaskStatusButton({
  task,
  pending,
  onComplete,
  canManage,
}: {
  task: Task;
  pending: boolean;
  onComplete: (task: Task) => void;
  canManage: boolean;
}) {
  const isCompleted = task.status === 'completed';
  const isCancelled = task.status === 'cancelled';
  const isInProgress = task.status === 'in_progress';

  if (isCompleted) {
    return (
      <div
        className="bg-status-success text-primary-foreground shadow-xs mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
        title="Tarea completada"
      >
        <Check className="size-3 stroke-[3]" />
      </div>
    );
  }

  return (
    <IconButton
      type="button"
      ariaLabel="Marcar como completada"
      variant="ghost"
      size="sm"
      disabled={pending || !canManage || isCancelled}
      onClick={(e) => {
        e.stopPropagation();
        onComplete(task);
      }}
      className={`group/chk mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-all duration-150 ${
        isInProgress
          ? 'border-primary/80 bg-primary/10 text-primary'
          : 'border-border-subtle text-transparent hover:border-emerald-500 hover:bg-emerald-500/10 hover:text-emerald-600'
      } disabled:cursor-not-allowed disabled:opacity-50`}
      title={canManage ? 'Marcar como completada' : 'Tarea pendiente'}
    >
      <Check
        className={`size-3 stroke-[2.5] transition-transform group-hover/chk:scale-100 ${isInProgress ? 'scale-0' : 'scale-75'}`}
      />
    </IconButton>
  );
}

export default function TasksPage() {
  const { activeOrganizationId } = useOrganization();
  const { mode } = usePlatformRuntime();
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

  const loadTasks = useCallback(
    async (signal?: AbortSignal) => {
      if (!activeOrganizationId) return;
      setIsLoading(true);
      setError(null);
      try {
        const page = await crmTasks(
          mode,
          { organizationId: activeOrganizationId, limit: PAGE_SIZE },
          signal,
        );
        setTasks(page.items);
      } catch (requestError: unknown) {
        if (requestError instanceof DOMException && requestError.name === 'AbortError') return;
        setError(
          requestError instanceof Error ? requestError.message : 'Tasks could not be loaded.',
        );
      } finally {
        if (!signal?.aborted) setIsLoading(false);
      }
    },
    [activeOrganizationId, mode],
  );

  useEffect(() => {
    if (!activeOrganizationId || isLoadingPermissions || !canRead) {
      setIsLoading(false);
      return;
    }
    const controller = new AbortController();
    void loadTasks(controller.signal);
    return () => controller.abort();
  }, [activeOrganizationId, canRead, isLoadingPermissions, loadTasks]);

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
      const searchable =
        `${task.title} ${task.type ?? ''} ${task.relationType} ${getRelationLabel(task.relationType)}`.toLocaleLowerCase();
      return searchable.includes(normalized);
    });
  }, [query, slaFilter, status, tasks]);

  const completeTask = useCallback(
    async (task: Task) => {
      if (!activeOrganizationId || !canManage) return;
      setPendingId(task.id);
      setError(null);
      try {
        const updated = await completeCrmTask(mode, {
          organizationId: activeOrganizationId,
          taskId: task.id,
          expectedVersion: task.version,
          idempotencyKey: `crm-ui-complete-${task.id}-${task.version}`,
        });
        setTasks((current) => current.map((item) => (item.id === updated.id ? updated : item)));
      } catch (requestError: unknown) {
        setError(
          requestError instanceof Error ? requestError.message : 'Task could not be completed.',
        );
      } finally {
        setPendingId(null);
      }
    },
    [activeOrganizationId, canManage, mode],
  );

  const columns = useMemo<ResponsiveTableColumn<Task>[]>(
    () => [
      {
        key: 'title',
        header: 'Tarea',
        sortable: true,
        render: (task) => {
          const isDone = task.status === 'completed';
          return (
            <div className="flex min-w-0 items-start gap-3 py-0.5">
              <TaskStatusButton
                task={task}
                pending={pendingId === task.id}
                onComplete={completeTask}
                canManage={canManage}
              />
              <div className="min-w-0 flex-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedId(task.id)}
                  className="group/title text-text-main hover:text-primary flex cursor-pointer items-center gap-1.5 text-left text-sm font-medium transition-colors"
                >
                  <span className={isDone ? 'text-text-muted/60 line-through' : ''}>
                    {task.title}
                  </span>
                </Button>
                <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs">
                  {getRelationBadge(task)}
                  {getTypeBadge(task.type)}
                </div>
              </div>
            </div>
          );
        },
        sortAccessor: (task) => task.title,
      },
      {
        key: 'status',
        header: 'Estado',
        sortable: true,
        render: (task) => getStatusBadge(task.status, isOverdue(task)),
      },
      {
        key: 'priority',
        header: 'Prioridad',
        render: (task) => getLinearPriorityBadge(task.priority),
      },
      {
        key: 'dueAt',
        header: 'Vencimiento',
        sortable: true,
        render: (task) => formatDueBadge(task.dueAt, task.status === 'completed'),
        sortAccessor: (task) => task.dueAt ?? '',
      },
    ],
    [canManage, completeTask, pendingId],
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
            <div className="flex items-center gap-3">
              <Heading as="h1" size="lg" weight="semibold">
                Tareas
              </Heading>
              <span className="bg-primary/10 text-primary hidden items-center rounded-full px-2.5 py-0.5 text-xs font-semibold sm:inline-flex">
                {slaCounts.all - slaCounts.completed} pendientes
              </span>
            </div>
          }
          rightSlot={
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="/sales-crm/tasks/today"
                className="text-text-muted hover:text-text-main border-border-subtle bg-surface hover:bg-surface-hover inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors"
              >
                <Sun className="size-3.5 text-amber-500" />
                <span>Mi Día</span>
              </Link>
              {canManage ? (
                <Link
                  href="/sales-crm/tasks/new"
                  className="bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all"
                >
                  <Plus className="size-3.5" />
                  <span>Nueva tarea</span>
                </Link>
              ) : null}
            </div>
          }
          ariaLabel="Cabecera de Tareas"
        />
      }
    >
      <div className="space-y-4">
        {/* Modern Linear-style Toolbar: SLA Tabs + Unified Search & Filters */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          {/* SLA Filter Segmented Pills */}
          <div className="border-border-subtle bg-surface dark:bg-surface-dark shadow-xs inline-flex flex-wrap items-center gap-1.5 rounded-xl border p-1">
            {slaTabs.map((tab) => {
              const isActive = slaFilter === tab.id;
              return (
                <Button
                  key={tab.id}
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setSlaFilter(tab.id)}
                  className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-background text-text-main shadow-xs border-border-subtle border font-semibold'
                      : 'text-text-muted hover:text-text-main hover:bg-surface-hover/60'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`py-0.2 rounded-full px-1.5 font-mono text-[10px] font-semibold ${
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : tab.alert
                          ? 'bg-status-error/15 text-status-error'
                          : 'bg-secondary text-text-muted'
                    }`}
                  >
                    {tab.count}
                  </span>
                </Button>
              );
            })}
          </div>

          {/* Search and Status Select */}
          <div className="flex flex-1 items-center gap-2 lg:max-w-md">
            <div className="relative flex-1">
              <Search className="text-text-muted pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar tareas..."
                className="border-border-subtle bg-background text-text-main placeholder:text-text-muted focus:border-primary focus:ring-primary shadow-xs w-full rounded-lg border py-1.5 pl-8 pr-7 text-xs outline-none transition-all focus:ring-1"
              />
              {query ? (
                <IconButton
                  type="button"
                  variant="ghost"
                  size="sm"
                  ariaLabel="Limpiar búsqueda"
                  onClick={() => setQuery('')}
                  className="text-text-muted hover:text-text-main absolute right-2 top-1/2 -translate-y-1/2 p-0.5"
                  title="Limpiar búsqueda"
                >
                  <X className="size-3" />
                </IconButton>
              ) : null}
            </div>

            <Select
              size="sm"
              fullWidth={false}
              className="w-44 shrink-0"
              value={status}
              onValueChange={(val) => setStatus(val as 'all' | TaskStatus)}
              options={[
                { value: 'all', label: 'Todos los estados' },
                { value: 'open', label: 'Abierta' },
                { value: 'in_progress', label: 'En progreso' },
                { value: 'completed', label: 'Completada' },
                { value: 'cancelled', label: 'Cancelada' },
              ]}
            />
          </div>
        </div>

        {error ? (
          <div
            role="alert"
            className="border-status-error/40 bg-status-error/10 text-status-error flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3 text-sm"
          >
            <span>{error}</span>
            <Button type="button" size="sm" variant="secondary" onClick={() => void loadTasks()}>
              Retry
            </Button>
          </div>
        ) : null}

        {/* Task Table Container */}
        <div className={selectedId ? 'grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_22rem]' : ''}>
          <TechnicalSurface
            variant="surface"
            radius="lg"
            border="subtle"
            className="shadow-xs overflow-hidden p-0"
          >
            <ResponsiveTable
              caption="Tareas CRM"
              columns={columns}
              rows={visibleTasks}
              getRowKey={(task) => task.id}
              loading={isLoading}
              density="dense"
              loadingState="Cargando tareas..."
              emptyState={
                query || slaFilter !== 'all' || status !== 'all'
                  ? 'No hay tareas con estos filtros.'
                  : 'No hay tareas creadas todavía.'
              }
              errorState={undefined}
              paginationVariant="compact"
              hidePageSizeSelector
              rowActions={(task) => {
                const isDone = task.status === 'completed' || task.status === 'cancelled';
                return (
                  <div className="flex items-center justify-end gap-1.5">
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      className="hover:bg-surface-hover inline-flex h-7 items-center gap-1 rounded-md px-2.5 text-xs transition-colors"
                      onClick={() => setSelectedId(task.id)}
                    >
                      <Eye className="size-3" />
                      <span>Preview</span>
                    </Button>
                    {canManage && !isDone ? (
                      <Button
                        type="button"
                        size="sm"
                        variant="primary"
                        className="shadow-xs inline-flex h-7 items-center gap-1 rounded-md px-2.5 text-xs font-medium"
                        disabled={pendingId === task.id}
                        onClick={() => void completeTask(task)}
                      >
                        <Check className="size-3" />
                        <span>Complete</span>
                      </Button>
                    ) : null}
                  </div>
                );
              }}
              renderMobileRow={(task) => {
                const isDone = task.status === 'completed';
                return (
                  <div
                    key={task.id}
                    onClick={() => setSelectedId(task.id)}
                    className="border-border-subtle bg-surface hover:bg-surface-hover/50 shadow-xs group relative flex cursor-pointer flex-col gap-2.5 rounded-xl border p-3.5 transition-all"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 flex-1 items-start gap-2.5">
                        <TaskStatusButton
                          task={task}
                          pending={pendingId === task.id}
                          onComplete={completeTask}
                          canManage={canManage}
                        />
                        <div className="min-w-0 flex-1">
                          <p
                            className={`text-text-main text-sm font-semibold leading-snug ${isDone ? 'text-text-muted/60 line-through' : ''}`}
                          >
                            {task.title}
                          </p>
                        </div>
                      </div>
                      <div>{getLinearPriorityBadge(task.priority)}</div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      {getRelationBadge(task)}
                      {getTypeBadge(task.type)}
                      {formatDueBadge(task.dueAt, isDone)}
                    </div>

                    <div className="border-border-subtle/50 flex items-center justify-end gap-2 border-t pt-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        className="h-8 px-3 text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedId(task.id);
                        }}
                      >
                        Preview
                      </Button>
                      {canManage && !isDone && task.status !== 'cancelled' ? (
                        <Button
                          type="button"
                          size="sm"
                          variant="primary"
                          className="h-8 px-3 text-xs"
                          disabled={pendingId === task.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            void completeTask(task);
                          }}
                        >
                          Complete
                        </Button>
                      ) : null}
                    </div>
                  </div>
                );
              }}
            />
          </TechnicalSurface>

          {/* Split Detail Preview */}
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
