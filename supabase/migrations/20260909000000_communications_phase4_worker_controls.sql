-- Communications Core phase 4: durable queue, kill switches, and retention controls.

create extension if not exists pgmq;
select pgmq.create('communications_core');

create table if not exists public.communication_organization_controls (
  organization_id uuid primary key references public.organizations(id) on delete restrict,
  outbound_enabled boolean not null default true,
  updated_by_user_id uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now()
);

alter table public.communication_organization_controls enable row level security;
revoke all on table public.communication_organization_controls from authenticated;
grant select, insert, update on table public.communication_organization_controls to authenticated;
create policy communication_organization_controls_read on public.communication_organization_controls
  for select to authenticated
  using (public.has_organization_permission(organization_id, 'communications.read'));
create policy communication_organization_controls_insert on public.communication_organization_controls
  for insert to authenticated
  with check (public.has_organization_permission(organization_id, 'communications.manage-accounts'));
create policy communication_organization_controls_update on public.communication_organization_controls
  for update to authenticated
  using (public.has_organization_permission(organization_id, 'communications.manage-accounts'))
  with check (public.has_organization_permission(organization_id, 'communications.manage-accounts'));

alter table public.communication_conversations
  add column if not exists legal_hold boolean not null default false,
  add column if not exists purged_at timestamptz;

alter table public.communication_messages
  add column if not exists purged_at timestamptz;

create table if not exists public.communication_retention_runs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  dry_run boolean not null,
  cutoff_at timestamptz not null,
  eligible_count integer not null default 0 check (eligible_count >= 0),
  purged_count integer not null default 0 check (purged_count >= 0),
  trace_id text not null,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  created_by_user_id uuid references auth.users(id) on delete set null
);

alter table public.communication_retention_runs enable row level security;
revoke all on table public.communication_retention_runs from authenticated;
grant select on table public.communication_retention_runs to authenticated;
create policy communication_retention_runs_read on public.communication_retention_runs
  for select to authenticated
  using (public.has_organization_permission(organization_id, 'communications.manage-accounts'));

create index if not exists communication_conversations_retention_idx
  on public.communication_conversations(organization_id, legal_hold, last_activity_at)
  where purged_at is null;
create index if not exists communication_messages_retention_idx
  on public.communication_messages(organization_id, created_at)
  where purged_at is null;