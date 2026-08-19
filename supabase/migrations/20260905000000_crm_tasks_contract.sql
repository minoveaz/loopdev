-- CRM Tasks, Notes and Timeline contract (Issue #87).
-- The existing task/note tables are extended in place so seeded and legacy
-- rows remain readable while new commands use the canonical relation model.

alter table public.crm_tasks
  add column if not exists workspace_id uuid,
  add column if not exists brand_id uuid,
  add column if not exists relation_type text,
  add column if not exists relation_id uuid,
  add column if not exists type text,
  add column if not exists created_by_user_id uuid references auth.users(id) on delete set null,
  add column if not exists last_actor_user_id uuid references auth.users(id) on delete set null,
  add column if not exists version integer not null default 1,
  add column if not exists reopen_reason text,
  add column if not exists idempotency_key text,
  add column if not exists idempotency_fingerprint text,
  add column if not exists last_operation_key text,
  add column if not exists last_operation_fingerprint text;

alter table public.crm_notes
  add column if not exists brand_id uuid,
  add column if not exists relation_type text,
  add column if not exists relation_id uuid,
  add column if not exists version integer not null default 1,
  add column if not exists last_actor_user_id uuid references auth.users(id) on delete set null,
  add column if not exists idempotency_key text,
  add column if not exists idempotency_fingerprint text,
  add column if not exists last_operation_key text,
  add column if not exists last_operation_fingerprint text;

alter table public.crm_tasks
  alter column lead_id drop not null;

alter table public.crm_tasks
  add constraint crm_tasks_workspace_fkey
    foreign key (workspace_id, organization_id)
    references public.workspaces(id, organization_id) on delete restrict,
  add constraint crm_tasks_brand_fkey
    foreign key (brand_id, organization_id)
    references public.brands(id, organization_id) on delete restrict;

alter table public.crm_notes
  add constraint crm_notes_brand_fkey
    foreign key (brand_id, organization_id)
    references public.brands(id, organization_id) on delete restrict;

-- Normalize the legacy vocabulary before applying the public Tasks contract.
update public.crm_tasks
set status = 'open'
where status = 'pending';

update public.crm_tasks
set priority = 'normal'
where priority = 'medium';

update public.crm_tasks task
set relation_type = 'lead',
    relation_id = task.lead_id,
    workspace_id = coalesce(task.workspace_id, lead.workspace_id),
    brand_id = coalesce(task.brand_id, lead.brand_id),
    created_by_user_id = coalesce(task.created_by_user_id, task.assigned_to_user_id)
from public.crm_leads lead
where lead.id = task.lead_id
  and lead.organization_id = task.organization_id
  and (task.relation_type is null or task.relation_id is null);

update public.crm_notes note
set relation_type = case
      when note.opportunity_id is not null then 'opportunity'
      when note.lead_id is not null then 'lead'
      else 'contact'
    end,
    relation_id = coalesce(note.opportunity_id, note.lead_id, note.contact_id)
where note.relation_type is null or note.relation_id is null;

update public.crm_notes note
set workspace_id = coalesce(note.workspace_id, lead.workspace_id),
    brand_id = coalesce(note.brand_id, lead.brand_id)
from public.crm_leads lead
where note.relation_type = 'lead'
  and note.relation_id = lead.id
  and lead.organization_id = note.organization_id;

update public.crm_notes note
set workspace_id = coalesce(note.workspace_id, opportunity.workspace_id),
    brand_id = coalesce(note.brand_id, opportunity.brand_id)
from public.crm_opportunities opportunity
where note.relation_type = 'opportunity'
  and note.relation_id = opportunity.id
  and opportunity.organization_id = note.organization_id;

alter table public.crm_tasks
  alter column relation_type set not null,
  alter column relation_id set not null;

alter table public.crm_notes
  alter column relation_type set not null,
  alter column relation_id set not null;

alter table public.crm_tasks
  drop constraint if exists crm_tasks_status_check,
  drop constraint if exists crm_tasks_priority_check,
  drop constraint if exists crm_tasks_version_check,
  drop constraint if exists crm_tasks_idempotency_key_check;

alter table public.crm_tasks
  add constraint crm_tasks_status_check
    check (status in ('open', 'in_progress', 'completed', 'cancelled')),
  add constraint crm_tasks_priority_check
    check (priority in ('low', 'normal', 'high', 'urgent')),
  add constraint crm_tasks_version_check
    check (version > 0),
  add constraint crm_tasks_idempotency_key_check
    check (idempotency_key is null or length(trim(idempotency_key)) >= 8);

alter table public.crm_notes
  drop constraint if exists crm_notes_version_check,
  drop constraint if exists crm_notes_idempotency_key_check;

alter table public.crm_notes
  add constraint crm_notes_version_check
    check (version > 0),
  add constraint crm_notes_idempotency_key_check
    check (idempotency_key is null or length(trim(idempotency_key)) >= 8);

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.crm_tasks'::regclass
      and conname = 'crm_tasks_relation_type_check'
  ) then
    alter table public.crm_tasks
      add constraint crm_tasks_relation_type_check
      check (relation_type in ('contact', 'lead', 'opportunity'));
  end if;
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.crm_notes'::regclass
      and conname = 'crm_notes_relation_type_check'
  ) then
    alter table public.crm_notes
      add constraint crm_notes_relation_type_check
      check (relation_type in ('contact', 'lead', 'opportunity'));
  end if;
end $$;

create unique index if not exists crm_tasks_idempotency_key_unique
  on public.crm_tasks(organization_id, idempotency_key)
  where idempotency_key is not null;

create unique index if not exists crm_notes_idempotency_key_unique
  on public.crm_notes(organization_id, idempotency_key)
  where idempotency_key is not null;

create table if not exists public.crm_timeline_events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  workspace_id uuid,
  brand_id uuid,
  relation_type text not null,
  relation_id uuid not null,
  type text not null,
  actor_id uuid references auth.users(id) on delete set null,
  actor_type text not null,
  origin text not null,
  occurred_at timestamptz not null default now(),
  summary text not null,
  metadata jsonb not null default '{}'::jsonb,
  source_type text not null,
  source_id uuid not null,
  operation_key text,
  operation_fingerprint text,
  constraint crm_timeline_events_relation_type_check
    check (relation_type in ('contact', 'lead', 'opportunity')),
  constraint crm_timeline_events_type_check
    check (type in ('task', 'note', 'stage_change', 'assignment', 'conversion', 'reopen')),
  constraint crm_timeline_events_actor_type_check
    check (actor_type in ('user', 'system')),
  constraint crm_timeline_events_origin_check
    check (origin in ('task', 'note', 'entity', 'customer_360', 'system')),
  constraint crm_timeline_events_source_type_check
    check (source_type in ('task', 'note', 'event')),
  constraint crm_timeline_events_operation_key_check
    check (operation_key is null or length(trim(operation_key)) >= 8),
  constraint crm_timeline_events_scope_key
    unique (id, organization_id)
);

alter table public.crm_timeline_events
  add constraint crm_timeline_events_workspace_fkey
    foreign key (workspace_id, organization_id)
    references public.workspaces(id, organization_id) on delete restrict,
  add constraint crm_timeline_events_brand_fkey
    foreign key (brand_id, organization_id)
    references public.brands(id, organization_id) on delete restrict;

create unique index if not exists crm_timeline_events_operation_key_unique
  on public.crm_timeline_events(organization_id, operation_key)
  where operation_key is not null;

create index if not exists crm_tasks_scope_cursor_idx
  on public.crm_tasks(organization_id, workspace_id, due_at, id);

create index if not exists crm_notes_scope_cursor_idx
  on public.crm_notes(organization_id, workspace_id, created_at desc, id desc);

create index if not exists crm_timeline_events_relation_cursor_idx
  on public.crm_timeline_events(
    organization_id, workspace_id, relation_type, relation_id, occurred_at desc, id desc
  );

-- Validate the polymorphic relation and inherit its workspace/brand scope.
-- SECURITY DEFINER is intentional: the check must not be bypassed by a
-- caller whose read policy does not expose the target row.
create or replace function public.crm_validate_task_relation_scope()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  target_organization_id uuid;
  target_workspace_id uuid;
  target_brand_id uuid;
  relation_type text;
  relation_id uuid;
begin
  relation_type := new.relation_type;
  relation_id := new.relation_id;

  -- Legacy inserts still provide lead_id/contact_id/opportunity_id.
  if relation_type is null then
    if tg_table_name = 'crm_tasks' and new.lead_id is not null then
      relation_type := 'lead';
      relation_id := new.lead_id;
    elsif tg_table_name = 'crm_notes' then
      if new.opportunity_id is not null then
        relation_type := 'opportunity';
        relation_id := new.opportunity_id;
      elsif new.lead_id is not null then
        relation_type := 'lead';
        relation_id := new.lead_id;
      elsif new.contact_id is not null then
        relation_type := 'contact';
        relation_id := new.contact_id;
      end if;
    end if;
    new.relation_type := relation_type;
    new.relation_id := relation_id;
  end if;

  if relation_type = 'contact' then
    select contact.organization_id
      into target_organization_id
      from public.crm_contacts contact
     where contact.id = relation_id;
  elsif relation_type = 'lead' then
    select lead.organization_id, lead.workspace_id, lead.brand_id
      into target_organization_id, target_workspace_id, target_brand_id
      from public.crm_leads lead
     where lead.id = relation_id;
  elsif relation_type = 'opportunity' then
    select opportunity.organization_id, opportunity.workspace_id, opportunity.brand_id
      into target_organization_id, target_workspace_id, target_brand_id
      from public.crm_opportunities opportunity
     where opportunity.id = relation_id;
  end if;

  if target_organization_id is null or target_organization_id <> new.organization_id then
    raise exception 'CRM relation is outside the organization scope'
      using errcode = 'foreign_key_violation';
  end if;

  if target_workspace_id is not null then
    if new.workspace_id is not null and new.workspace_id <> target_workspace_id then
      raise exception 'CRM relation is outside the workspace scope'
        using errcode = 'foreign_key_violation';
    end if;
    new.workspace_id := target_workspace_id;
  end if;

  if target_brand_id is not null then
    if new.brand_id is not null and new.brand_id <> target_brand_id then
      raise exception 'CRM relation is outside the brand scope'
        using errcode = 'foreign_key_violation';
    end if;
    new.brand_id := target_brand_id;
  end if;

  if new.brand_id is not null and not exists (
    select 1 from public.brands brand
     where brand.id = new.brand_id
       and brand.organization_id = new.organization_id
  ) then
    raise exception 'CRM brand is outside the organization scope'
      using errcode = 'foreign_key_violation';
  end if;

  if new.workspace_id is not null and not exists (
    select 1 from public.workspaces workspace
     where workspace.id = new.workspace_id
       and workspace.organization_id = new.organization_id
  ) then
    raise exception 'CRM workspace is outside the organization scope'
      using errcode = 'foreign_key_violation';
  end if;

  if tg_table_name = 'crm_tasks' then
    new.lead_id := case when relation_type = 'lead' then relation_id else new.lead_id end;
  else
    new.contact_id := case when relation_type = 'contact' then relation_id else new.contact_id end;
    new.lead_id := case when relation_type = 'lead' then relation_id else new.lead_id end;
    new.opportunity_id := case
      when relation_type = 'opportunity' then relation_id else new.opportunity_id end;
  end if;

  return new;
end;
$$;

revoke all on function public.crm_validate_task_relation_scope() from public;

drop trigger if exists crm_tasks_validate_relation on public.crm_tasks;
create trigger crm_tasks_validate_relation
before insert or update on public.crm_tasks
for each row execute function public.crm_validate_task_relation_scope();

drop trigger if exists crm_notes_validate_relation on public.crm_notes;
create trigger crm_notes_validate_relation
before insert or update on public.crm_notes
for each row execute function public.crm_validate_task_relation_scope();

create or replace function public.crm_validate_task_transition()
returns trigger
language plpgsql
as $$
begin
  if tg_table_name = 'crm_tasks' and tg_op = 'UPDATE' then
    if new.relation_type is distinct from old.relation_type
       or new.relation_id is distinct from old.relation_id
       or new.organization_id is distinct from old.organization_id then
      raise exception 'CRM task relation cannot be changed'
        using errcode = 'restrict_violation';
    end if;

    if new.status is distinct from old.status then
      if old.status = 'open' and new.status not in ('in_progress', 'completed', 'cancelled') then
        raise exception 'CRM task status transition is not allowed'
          using errcode = 'check_violation';
      elsif old.status = 'in_progress' and new.status not in ('completed', 'cancelled') then
        raise exception 'CRM task status transition is not allowed'
          using errcode = 'check_violation';
      elsif old.status in ('completed', 'cancelled')
        and (new.status <> 'open' or nullif(trim(new.reopen_reason), '') is null) then
        raise exception 'CRM task status transition is not allowed'
          using errcode = 'check_violation';
      end if;
    end if;
  end if;

  if new.status = 'completed' then
    new.completed_at := coalesce(new.completed_at, now());
  elsif new.status <> 'completed' then
    new.completed_at := null;
  end if;

  return new;
end;
$$;

revoke all on function public.crm_validate_task_transition() from public;

drop trigger if exists crm_tasks_validate_transition on public.crm_tasks;
create trigger crm_tasks_validate_transition
before update on public.crm_tasks
for each row execute function public.crm_validate_task_transition();

create table if not exists public.crm_timeline_events_guard (
  id integer primary key default 1,
  constraint crm_timeline_events_guard_singleton check (id = 1)
);

create or replace function public.prevent_crm_timeline_event_mutation()
returns trigger
language plpgsql
as $$
begin
  raise exception 'crm_timeline_events is append-only'
    using errcode = 'restrict_violation';
end;
$$;

revoke all on function public.prevent_crm_timeline_event_mutation() from public;

drop trigger if exists crm_timeline_events_append_only on public.crm_timeline_events;
create trigger crm_timeline_events_append_only
before update or delete on public.crm_timeline_events
for each row execute function public.prevent_crm_timeline_event_mutation();

create or replace function public.crm_append_task_timeline_event()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  event_type text := 'task';
  event_summary text;
  event_actor_id uuid;
  event_operation_key text;
  event_fingerprint text;
  event_metadata jsonb := '{}'::jsonb;
  event_scope_workspace_id uuid;
  event_scope_brand_id uuid;
  event_relation_type text;
  event_relation_id uuid;
  event_source_type text;
  event_origin text;
begin
  event_actor_id := coalesce(new.last_actor_user_id, new.created_by_user_id);
  event_operation_key := coalesce(new.last_operation_key, new.idempotency_key);
  event_fingerprint := coalesce(new.last_operation_fingerprint, new.idempotency_fingerprint);
  event_scope_workspace_id := new.workspace_id;
  event_scope_brand_id := new.brand_id;
  event_relation_type := new.relation_type;
  event_relation_id := new.relation_id;
  event_source_type := 'task';
  event_origin := 'task';

  if tg_op = 'INSERT' then
    event_summary := 'Task created';
    event_metadata := jsonb_build_object('status', new.status, 'priority', new.priority);
  elsif new.assigned_to_user_id is distinct from old.assigned_to_user_id then
    event_type := 'assignment';
    event_summary := 'Task assignment changed';
    event_metadata := jsonb_build_object(
      'assignedUserId', coalesce(new.assigned_to_user_id::text, '')
    );
  elsif new.last_operation_key is distinct from old.last_operation_key
    and new.assigned_to_user_id is not distinct from old.assigned_to_user_id
    and new.title is not distinct from old.title
    and new.description is not distinct from old.description
    and new.priority is not distinct from old.priority
    and new.type is not distinct from old.type
    and new.due_at is not distinct from old.due_at
    and new.status is not distinct from old.status then
    event_type := 'assignment';
    event_summary := 'Task assignment confirmed';
    event_metadata := jsonb_build_object(
      'assignedUserId', coalesce(new.assigned_to_user_id::text, '')
    );
  elsif new.status is distinct from old.status
     and new.status = 'open'
     and old.status in ('completed', 'cancelled') then
    event_type := 'reopen';
    event_summary := 'Task reopened';
    event_metadata := jsonb_build_object('reason', coalesce(new.reopen_reason, ''));
  elsif new.status is distinct from old.status then
    event_summary := 'Task status changed';
    event_metadata := jsonb_build_object('status', new.status);
  elsif new.title is distinct from old.title
     or new.description is distinct from old.description
     or new.priority is distinct from old.priority
     or new.type is distinct from old.type
     or new.due_at is distinct from old.due_at then
    event_summary := 'Task updated';
  else
    return new;
  end if;

  insert into public.crm_timeline_events (
    organization_id, workspace_id, brand_id, relation_type, relation_id,
    type, actor_id, actor_type, origin, summary, metadata,
    source_type, source_id, operation_key, operation_fingerprint
  ) values (
    new.organization_id, event_scope_workspace_id, event_scope_brand_id,
    event_relation_type, event_relation_id, event_type, event_actor_id,
    case when event_actor_id is null then 'system' else 'user' end,
    event_origin, event_summary, event_metadata, event_source_type, new.id,
    event_operation_key, event_fingerprint
  );
  return new;
end;
$$;

revoke all on function public.crm_append_task_timeline_event() from public;

drop trigger if exists crm_tasks_append_timeline on public.crm_tasks;
create trigger crm_tasks_append_timeline
after insert or update on public.crm_tasks
for each row execute function public.crm_append_task_timeline_event();

create or replace function public.crm_append_note_timeline_event()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  event_summary text;
  event_actor_id uuid;
begin
  event_actor_id := coalesce(new.last_actor_user_id, new.author_user_id);
  if tg_op = 'INSERT' then
    event_summary := 'Note created';
  elsif new.body is distinct from old.body
     or new.visibility is distinct from old.visibility then
    event_summary := 'Note updated';
  else
    return new;
  end if;

  insert into public.crm_timeline_events (
    organization_id, workspace_id, brand_id, relation_type, relation_id,
    type, actor_id, actor_type, origin, summary, metadata,
    source_type, source_id, operation_key, operation_fingerprint
  ) values (
    new.organization_id, new.workspace_id, new.brand_id, new.relation_type,
    new.relation_id, 'note', event_actor_id,
    case when event_actor_id is null then 'system' else 'user' end,
    'note', event_summary, '{}'::jsonb, 'note', new.id,
    coalesce(new.last_operation_key, new.idempotency_key),
    coalesce(new.last_operation_fingerprint, new.idempotency_fingerprint)
  );
  return new;
end;
$$;

revoke all on function public.crm_append_note_timeline_event() from public;

drop trigger if exists crm_notes_append_timeline on public.crm_notes;
create trigger crm_notes_append_timeline
after insert or update on public.crm_notes
for each row execute function public.crm_append_note_timeline_event();

alter table public.crm_timeline_events enable row level security;

drop policy if exists crm_timeline_events_read on public.crm_timeline_events;
drop policy if exists crm_timeline_events_insert on public.crm_timeline_events;
drop policy if exists crm_timeline_events_update on public.crm_timeline_events;
drop policy if exists crm_timeline_events_delete on public.crm_timeline_events;

create policy crm_timeline_events_read on public.crm_timeline_events
  for select to authenticated
  using (
    public.has_organization_permission(organization_id, 'crm.read')
    and (workspace_id is null or public.can_access_workspace(workspace_id))
  );

revoke all on table public.crm_timeline_events from authenticated;
grant select on table public.crm_timeline_events to authenticated;

-- Re-assert verb-specific policies after the broad CRM hardening migration.
drop policy if exists crm_tasks_crm_read on public.crm_tasks;
drop policy if exists crm_tasks_crm_insert on public.crm_tasks;
drop policy if exists crm_tasks_crm_update on public.crm_tasks;
drop policy if exists crm_tasks_crm_delete on public.crm_tasks;
create policy crm_tasks_crm_read on public.crm_tasks
  for select to authenticated
  using (
    public.has_organization_permission(organization_id, 'crm.read')
    and (workspace_id is null or public.can_access_workspace(workspace_id))
  );
create policy crm_tasks_crm_insert on public.crm_tasks
  for insert to authenticated
  with check (
    public.has_organization_permission(organization_id, 'crm.manage')
    and (workspace_id is null or public.can_access_workspace(workspace_id))
  );
create policy crm_tasks_crm_update on public.crm_tasks
  for update to authenticated
  using (
    public.has_organization_permission(organization_id, 'crm.manage')
    and (workspace_id is null or public.can_access_workspace(workspace_id))
  )
  with check (
    public.has_organization_permission(organization_id, 'crm.manage')
    and (workspace_id is null or public.can_access_workspace(workspace_id))
  );
create policy crm_tasks_crm_delete on public.crm_tasks
  for delete to authenticated
  using (
    public.has_organization_permission(organization_id, 'crm.manage')
    and (workspace_id is null or public.can_access_workspace(workspace_id))
  );

drop policy if exists crm_notes_crm_read on public.crm_notes;
drop policy if exists crm_notes_crm_insert on public.crm_notes;
drop policy if exists crm_notes_crm_update on public.crm_notes;
drop policy if exists crm_notes_crm_delete on public.crm_notes;
create policy crm_notes_crm_read on public.crm_notes
  for select to authenticated
  using (
    public.has_organization_permission(organization_id, 'crm.read')
    and (workspace_id is null or public.can_access_workspace(workspace_id))
  );
create policy crm_notes_crm_insert on public.crm_notes
  for insert to authenticated
  with check (
    public.has_organization_permission(organization_id, 'crm.manage')
    and (workspace_id is null or public.can_access_workspace(workspace_id))
  );
create policy crm_notes_crm_update on public.crm_notes
  for update to authenticated
  using (
    public.has_organization_permission(organization_id, 'crm.manage')
    and (workspace_id is null or public.can_access_workspace(workspace_id))
  )
  with check (
    public.has_organization_permission(organization_id, 'crm.manage')
    and (workspace_id is null or public.can_access_workspace(workspace_id))
  );
create policy crm_notes_crm_delete on public.crm_notes
  for delete to authenticated
  using (
    public.has_organization_permission(organization_id, 'crm.manage')
    and (workspace_id is null or public.can_access_workspace(workspace_id))
  );

revoke all on table public.crm_tasks from authenticated;
grant select, insert, update, delete on table public.crm_tasks to authenticated;
revoke all on table public.crm_notes from authenticated;
grant select, insert, update, delete on table public.crm_notes to authenticated;
