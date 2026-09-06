'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Badge, Button, ContextBar, Heading, ModuleHeader, TechnicalSurface } from '@loopdev/ui';
import type { Task, TaskPage, TaskPriority, TaskRelationType, TaskStatus, TimelinePage } from '@loopdev/contracts';

import { useOrganization } from '@/hooks/useOrganization';
import { useOrganizationPermissions } from '@/hooks/useOrganizationPermissions';

const relationTypes: TaskRelationType[] = ['contact', 'lead', 'opportunity'];
const priorities: TaskPriority[] = ['low', 'normal', 'high', 'urgent'];

function formatDate(value: string | null) {
  return value ? new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value)) : 'No due date';
}
function taskStatus(status: TaskStatus) {
  return status.replace('_', ' ');
}
function relationHref(task: Task) {
  return task.relationType === 'contact' ? `/sales-crm/contacts/${task.relationId}` : task.relationType === 'lead' ? `/sales-crm/leads/${task.relationId}` : `/sales-crm/opportunities/${task.relationId}`;
}

export function TaskPreview({ task, onClose }: { task: Task; onClose?: () => void }) {
  return (
    <TechnicalSurface variant="surface" radius="md" border="technical" className="h-fit p-4">
      <div className="flex items-start justify-between gap-2"><Heading as="h2" size="lg" weight="semibold">Task preview</Heading>{onClose ? <Button type="button" size="sm" variant="ghost" onClick={onClose}>Close</Button> : null}</div>
      <p className="text-text-main mt-4 font-medium">{task.title}</p>
      <div className="mt-2 flex flex-wrap gap-2"><Badge status={task.status === 'completed' ? 'success' : task.priority === 'urgent' ? 'error' : 'neutral'} variant="outline" showDot={false}>{taskStatus(task.status)}</Badge><Badge variant="outline" showDot={false}>{task.priority}</Badge></div>
      <ContextBar label="Due" value={formatDate(task.dueAt)} className="mt-4" />
      <ContextBar label="Related" value={task.relationType} trailing={<Link className="text-primary text-xs underline-offset-2 hover:underline" href={relationHref(task)}>Open context</Link>} />
      <Link href={`/sales-crm/tasks/${task.id}`} className="text-primary mt-4 inline-block text-sm underline-offset-2 hover:underline">Open task workspace</Link>
    </TechnicalSurface>
  );
}

export function TaskRecordView({ taskId }: { taskId: string }) {
  const { activeOrganizationId } = useOrganization();
  const { isLoading: isLoadingPermissions, hasPermission } = useOrganizationPermissions(['crm.read', 'crm.manage']);
  const canManage = hasPermission('crm.manage');
  const [task, setTask] = useState<Task | null>(null);
  const [timeline, setTimeline] = useState<TimelinePage['items']>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, setIsPending] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState('');
  const [draftDescription, setDraftDescription] = useState('');
  const [draftPriority, setDraftPriority] = useState<TaskPriority>('normal');
  const [draftDueAt, setDraftDueAt] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function load(signal?: AbortSignal) {
    if (!activeOrganizationId) return;
    setIsLoading(true);
    setError(null);
    try {
      const scope = `organizationId=${encodeURIComponent(activeOrganizationId)}`;
      const taskResponse = await fetch(`/api/crm/tasks/${encodeURIComponent(taskId)}?${scope}`, { signal });
      if (!taskResponse.ok) {
        if (taskResponse.status === 403) throw new Error('You do not have permission to view this task.');
        if (taskResponse.status === 404) throw new Error('This task could not be found.');
        throw new Error('Task could not be loaded.');
      }
      const nextTask = (await taskResponse.json()) as Task;
      setTask(nextTask);
      setDraftTitle(nextTask.title);
      setDraftDescription(nextTask.description ?? '');
      setDraftPriority(nextTask.priority);
      setDraftDueAt(nextTask.dueAt ? nextTask.dueAt.slice(0, 16) : '');
      const timelineResponse = await fetch(`/api/crm/timeline?${scope}&relationType=${nextTask.relationType}&relationId=${encodeURIComponent(nextTask.relationId)}&limit=25`, { signal });
      if (timelineResponse.ok) setTimeline(((await timelineResponse.json()) as TimelinePage).items);
    } catch (requestError: unknown) {
      if (requestError instanceof DOMException && requestError.name === 'AbortError') return;
      setError(requestError instanceof Error ? requestError.message : 'Task could not be loaded.');
    } finally {
      if (!signal?.aborted) setIsLoading(false);
    }
  }
  useEffect(() => {
    const controller = new AbortController();
    void load(controller.signal);
    return () => controller.abort();
  }, [activeOrganizationId, taskId]);

  async function changeStatus(action: 'complete' | 'reopen') {
    if (!activeOrganizationId || !task || !canManage) return;
    setIsPending(true);
    setError(null);
    try {
      const response = await fetch(`/api/crm/tasks/${task.id}/${action}`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ organizationId: activeOrganizationId, expectedVersion: task.version, reason: action === 'reopen' ? 'Reopened from task workspace' : undefined, idempotencyKey: `crm-ui-${action}-${task.id}-${task.version}` }),
      });
      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error ?? `Task could not be ${action}d.`);
      }

      setTask((await response.json()) as Task);
    } catch (requestError: unknown) {
      setError(requestError instanceof Error ? requestError.message : 'Task action failed.');
    } finally {
      setIsPending(false);
    }

  }

  async function saveEdit() {
    if (!activeOrganizationId || !task || !canManage) return;
    setIsPending(true);
    setError(null);
    try {
      const response = await fetch(`/api/crm/tasks/${task.id}`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json', 'idempotency-key': `crm-ui-task-update-${task.id}-${task.version}` },
        body: JSON.stringify({
          organizationId: activeOrganizationId,
          title: draftTitle,
          description: draftDescription || null,
          priority: draftPriority,
          dueAt: draftDueAt ? new Date(draftDueAt).toISOString() : null,
          expectedVersion: task.version,
        }),
      });
      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error ?? 'Task could not be updated.');
      }
      setTask((await response.json()) as Task);
      setIsEditing(false);
    } catch (requestError: unknown) {
      setError(requestError instanceof Error ? requestError.message : 'Task could not be updated.');
    } finally {
      setIsPending(false);
    }
  }

  if (isLoadingPermissions || !activeOrganizationId) return <div className="text-text-muted p-6 text-sm">Preparing task workspace...</div>;
  if (!hasPermission('crm.read')) return <div className="flex min-h-full items-center justify-center p-6 text-sm text-text-muted">You do not have permission to view Tasks.</div>;
  return (
    <div className="bg-shell-canvas flex min-h-full min-w-0 flex-1 flex-col">
      <ModuleHeader segments={[{ id: 'tasks', label: 'Tasks', href: '/sales-crm/tasks' }, { id: 'task', label: task?.title ?? 'Task' }]} leftSlot={<Heading as="h1" size="lg" weight="semibold" className="truncate">{task?.title ?? 'Task workspace'}</Heading>} ariaLabel="Task workspace header" />
      <main className="min-h-0 flex-1 overflow-auto p-4 lg:p-6">
        {isLoading ? <div role="status" className="text-text-muted p-8 text-center text-sm">Loading task…</div> : null}
        {error ? <div role="alert" className="border-status-error/40 bg-status-error/10 text-status-error mb-4 flex flex-wrap items-center justify-between gap-3 rounded-md border p-3 text-sm"><span>{error}</span><Button type="button" size="sm" variant="secondary" onClick={() => void load()}>Retry</Button></div> : null}
        {task && !isLoading ? <div className="mx-auto grid max-w-5xl gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(20rem,0.7fr)]"><TechnicalSurface variant="surface" radius="md" border="technical" className="p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div className="min-w-0 flex-1">{isEditing ? <input aria-label="Task title" value={draftTitle} onChange={(event) => setDraftTitle(event.target.value)} className="border-border-subtle bg-background text-text-main min-h-10 w-full rounded-md border px-3 text-lg font-semibold" /> : <Heading as="h2" size="lg" weight="semibold">{task.title}</Heading>}<p className="text-text-muted mt-1 text-sm">{task.type ?? 'General task'}</p></div><Badge status={task.status === 'completed' ? 'success' : task.priority === 'urgent' ? 'error' : 'neutral'} variant="outline" showDot={false}>{taskStatus(task.status)}</Badge></div><ContextBar label="Related record" value={task.relationType} trailing={<Link href={relationHref(task)} className="text-primary text-xs underline-offset-2 hover:underline">Open record</Link>} className="mt-5" />{isEditing ? <div className="mt-5 grid gap-4 sm:grid-cols-2"><label className="text-text-muted text-xs font-medium">Priority<select value={draftPriority} onChange={(event) => setDraftPriority(event.target.value as TaskPriority)} className="border-border-subtle bg-background text-text-main mt-1 min-h-10 w-full rounded-md border px-3 text-sm">{priorities.map((item) => <option key={item}>{item}</option>)}</select></label><label className="text-text-muted text-xs font-medium">Due date<input type="datetime-local" value={draftDueAt} onChange={(event) => setDraftDueAt(event.target.value)} className="border-border-subtle bg-background text-text-main mt-1 min-h-10 w-full rounded-md border px-3 text-sm" /></label><label className="text-text-muted text-xs font-medium sm:col-span-2">Description<textarea value={draftDescription} onChange={(event) => setDraftDescription(event.target.value)} className="border-border-subtle bg-background text-text-main mt-1 min-h-28 w-full rounded-md border px-3 py-2 text-sm" /></label></div> : <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2"><div><dt className="text-text-muted">Priority</dt><dd className="text-text-main mt-1 font-medium">{task.priority}</dd></div><div><dt className="text-text-muted">Due</dt><dd className="text-text-main mt-1 font-medium">{formatDate(task.dueAt)}</dd></div><div className="sm:col-span-2"><dt className="text-text-muted">Description</dt><dd className="text-text-main mt-1 whitespace-pre-wrap">{task.description ?? 'No description.'}</dd></div></dl>}<div className="mt-6 flex flex-wrap gap-2">{canManage && !isEditing ? <Button type="button" variant="secondary" disabled={isPending} onClick={() => setIsEditing(true)}>Edit task</Button> : null}{canManage && isEditing ? <><Button type="button" disabled={isPending || !draftTitle.trim()} onClick={() => void saveEdit()}>Save changes</Button><Button type="button" variant="secondary" disabled={isPending} onClick={() => setIsEditing(false)}>Cancel</Button></> : null}{canManage && task.status !== 'completed' && task.status !== 'cancelled' && !isEditing ? <Button type="button" disabled={isPending} onClick={() => void changeStatus('complete')}>Complete task</Button> : null}{canManage && task.status === 'completed' && !isEditing ? <Button type="button" variant="secondary" disabled={isPending} onClick={() => void changeStatus('reopen')}>Reopen task</Button> : null}<Link href={`/sales-crm/tasks/new?relationType=${task.relationType}&relationId=${task.relationId}`} className="border-border-subtle text-text-main rounded-md border px-3 py-2 text-sm">Create related task</Link></div></TechnicalSurface><TechnicalSurface variant="surface" radius="md" border="technical" className="p-5"><Heading as="h2" size="lg" weight="semibold">Task activity</Heading>{timeline.length ? <ol className="mt-4 space-y-3">{timeline.map((event) => <li key={event.id} className="border-border-subtle border-l-2 pl-3"><p className="text-text-main text-sm">{event.summary}</p><p className="text-text-muted mt-1 text-xs">{formatDate(event.occurredAt)}</p></li>)}</ol> : <p className="text-text-muted mt-4 text-sm">No activity recorded yet.</p>}</TechnicalSurface></div> : null}
      </main>
    </div>
  );
}

export function TaskForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { activeOrganizationId } = useOrganization();
  const { isLoading: isLoadingPermissions, hasPermission } = useOrganizationPermissions(['crm.manage']);
  const canManage = hasPermission('crm.manage');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('normal');
  const [type, setType] = useState('');
  const [assignedUserId, setAssignedUserId] = useState('');
  const [dueAt, setDueAt] = useState('');
  const [relationType, setRelationType] = useState<TaskRelationType>((searchParams.get('relationType') as TaskRelationType) || 'contact');
  const [relationId, setRelationId] = useState(searchParams.get('relationId') ?? '');
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!activeOrganizationId || !canManage || isSaving) return;
    setIsSaving(true);
    setError(null);
    try {
      const response = await fetch('/api/crm/tasks', { method: 'POST', headers: { 'content-type': 'application/json', 'idempotency-key': `crm-ui-task-${crypto.randomUUID()}` }, body: JSON.stringify({ organizationId: activeOrganizationId, title, description: description || null, priority, type: type || null, assignedUserId: assignedUserId || null, dueAt: dueAt ? new Date(dueAt).toISOString() : null, relationType, relationId }) });
      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error ?? 'Task could not be created.');
      }
      const task = (await response.json()) as Task;
      router.push(`/sales-crm/tasks/${task.id}`);
    } catch (requestError: unknown) {
      setError(requestError instanceof Error ? requestError.message : 'Task could not be created.');
    } finally {
      setIsSaving(false);
    }
  }
  if (isLoadingPermissions || !activeOrganizationId) return <div className="text-text-muted p-6 text-sm">Preparing task form...</div>;
  if (!canManage) return <div className="flex min-h-full items-center justify-center p-6 text-sm text-text-muted">You do not have permission to create tasks.</div>;
  return <div className="bg-shell-canvas flex min-h-full min-w-0 flex-1 flex-col"><ModuleHeader segments={[{ id: 'tasks', label: 'Tasks', href: '/sales-crm/tasks' }, { id: 'new-task', label: 'New task' }]} leftSlot={<Heading as="h1" size="lg" weight="semibold">Create task</Heading>} ariaLabel="Create task header" /><main className="min-h-0 flex-1 overflow-auto p-4 lg:p-8"><form onSubmit={submit} className="mx-auto max-w-3xl"><TechnicalSurface variant="surface" radius="md" border="technical" className="space-y-4 p-5">{error ? <div role="alert" className="border-status-error/40 bg-status-error/10 text-status-error rounded-md border p-3 text-sm">{error}</div> : null}<div className="grid gap-4 sm:grid-cols-2"><Field label="Title" required value={title} onChange={setTitle} /><Field label="Task type" value={type} onChange={setType} placeholder="call" /><label className="text-text-muted text-xs font-medium">Priority<select value={priority} onChange={(event) => setPriority(event.target.value as TaskPriority)} className="border-border-subtle bg-background text-text-main mt-1 min-h-10 w-full rounded-md border px-3 text-sm">{priorities.map((item) => <option key={item}>{item}</option>)}</select></label><Field label="Due date" required value={dueAt} onChange={setDueAt} type="datetime-local" /><label className="text-text-muted text-xs font-medium">Related entity<select disabled={Boolean(searchParams.get('relationType'))} value={relationType} onChange={(event) => setRelationType(event.target.value as TaskRelationType)} className="border-border-subtle bg-background text-text-main mt-1 min-h-10 w-full rounded-md border px-3 text-sm">{relationTypes.map((item) => <option key={item}>{item}</option>)}</select></label><Field label="Related record ID" required value={relationId} onChange={setRelationId} placeholder="UUID" /><Field label="Assignee ID" value={assignedUserId} onChange={setAssignedUserId} placeholder="Optional UUID" /><label className="text-text-muted text-xs font-medium sm:col-span-2">Description<textarea value={description} onChange={(event) => setDescription(event.target.value)} className="border-border-subtle bg-background text-text-main mt-1 min-h-28 w-full rounded-md border px-3 py-2 text-sm" /></label></div><div className="flex justify-end gap-2"><Button type="button" variant="secondary" onClick={() => router.push('/sales-crm/tasks')}>Cancel</Button><Button type="submit" disabled={isSaving || !title || !relationId || !dueAt}>{isSaving ? 'Creating…' : 'Create task'}</Button></div></TechnicalSurface></form></main></div>;
}

export function MyDayPage() {
  const { activeOrganizationId } = useOrganization();
  const { isLoading: isLoadingPermissions, hasPermission } = useOrganizationPermissions(['crm.read', 'crm.manage']);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (!activeOrganizationId || isLoadingPermissions || !hasPermission('crm.read')) return;
    const controller = new AbortController();
    fetch(`/api/crm/tasks?organizationId=${encodeURIComponent(activeOrganizationId)}&limit=100`, { signal: controller.signal })
      .then(async (response) => { if (!response.ok) throw new Error('My Day could not be loaded.'); return (await response.json()) as TaskPage; })
      .then((page) => setTasks(page.items))
      .catch((requestError: unknown) => { if (requestError instanceof DOMException && requestError.name === 'AbortError') return; setError(requestError instanceof Error ? requestError.message : 'My Day could not be loaded.'); })
      .finally(() => { if (!controller.signal.aborted) setIsLoading(false); });
    return () => controller.abort();
  }, [activeOrganizationId, isLoadingPermissions]);
  const groups = useMemo(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const end = start + 86_400_000;
    return {
      overdue: tasks.filter((task) => task.status !== 'completed' && task.dueAt && new Date(task.dueAt).getTime() < start),
      today: tasks.filter((task) => task.status !== 'completed' && task.dueAt && new Date(task.dueAt).getTime() >= start && new Date(task.dueAt).getTime() < end),
      upcoming: tasks.filter((task) => task.status !== 'completed' && task.dueAt && new Date(task.dueAt).getTime() >= end),
      withoutDueDate: tasks.filter((task) => task.status !== 'completed' && !task.dueAt),
    };
  }, [tasks]);
  if (isLoadingPermissions || !activeOrganizationId) return <div className="text-text-muted p-6 text-sm">Preparing My Day...</div>;
  if (!hasPermission('crm.read')) return <div className="flex min-h-full items-center justify-center p-6 text-sm text-text-muted">You do not have permission to view My Day.</div>;
  return <div className="bg-shell-canvas flex min-h-full min-w-0 flex-1 flex-col"><ModuleHeader segments={[{ id: 'tasks', label: 'Tasks', href: '/sales-crm/tasks' }, { id: 'today', label: 'My Day' }]} leftSlot={<Heading as="h1" size="lg" weight="semibold">My Day</Heading>} rightSlot={<Link href="/sales-crm/tasks/new" className="bg-primary text-primary-foreground rounded-md px-3 py-2 text-sm font-medium">New task</Link>} ariaLabel="My Day header" /><main className="min-h-0 flex-1 overflow-auto p-4 lg:p-6">{error ? <div role="alert" className="border-status-error/40 bg-status-error/10 text-status-error mb-4 rounded-md border p-3 text-sm">{error}</div> : null}{isLoading ? <div role="status" className="text-text-muted p-8 text-center text-sm">Loading My Day…</div> : <div className="grid gap-4 lg:grid-cols-2">{(['overdue', 'today', 'upcoming', 'withoutDueDate'] as const).map((key) => <TechnicalSurface key={key} variant="surface" radius="md" border={key === 'overdue' ? 'technical' : 'subtle'} className="p-4"><div className="flex items-center justify-between"><Heading as="h2" size="lg" weight="semibold">{key === 'withoutDueDate' ? 'Without due date' : key[0].toUpperCase() + key.slice(1)}</Heading><Badge status={key === 'overdue' ? 'error' : 'neutral'} variant="outline" showDot={false}>{groups[key].length}</Badge></div>{groups[key].length ? <ul className="mt-3 space-y-2">{groups[key].map((task) => <li key={task.id} className="border-border-subtle border-b pb-2 last:border-0"><Link href={`/sales-crm/tasks/${task.id}`} className="text-text-main text-sm font-medium underline-offset-2 hover:underline">{task.title}</Link><p className="text-text-muted mt-1 text-xs">{task.priority} · {formatDate(task.dueAt)}</p></li>)}</ul> : <p className="text-text-muted mt-3 text-sm">Nothing here.</p>}</TechnicalSurface>)}</div>}</main></div>;
}

function Field({ label, value, onChange, required, ...props }: { label: string; value: string; onChange: (value: string) => void; required?: boolean; type?: string; placeholder?: string }) {
  return <label className="text-text-muted text-xs font-medium">{label} {required ? <span aria-hidden="true">*</span> : null}<input {...props} required={required} value={value} onChange={(event) => onChange(event.target.value)} className="border-border-subtle bg-background text-text-main mt-1 min-h-10 w-full rounded-md border px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary" /></label>;
}
