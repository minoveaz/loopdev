-- CRM shared foundation persistence.
-- Additive: existing rows remain readable; legacy details are not exposed by
-- the shared read model until they have an explicit projection.

alter table public.crm_activities
  add column if not exists workspace_id uuid,
  add column if not exists source_type text,
  add column if not exists source_id uuid,
  add column if not exists source_key text;

alter table public.crm_notes
  add column if not exists workspace_id uuid;

alter table public.crm_activities
  add constraint crm_activities_workspace_fkey
  foreign key (workspace_id, organization_id)
  references public.workspaces(id, organization_id) on delete restrict;

alter table public.crm_notes
  add constraint crm_notes_workspace_fkey
  foreign key (workspace_id, organization_id)
  references public.workspaces(id, organization_id) on delete restrict;

alter table public.crm_activities
  add constraint crm_activities_source_type_check
  check (source_type is null or source_type in ('contact', 'lead', 'opportunity', 'task', 'note', 'assignment', 'stage')),
  add constraint crm_activities_source_key_check
  check (source_key is null or source_key = source_type || ':' || source_id::text);

create unique index if not exists crm_activities_source_key_unique
  on public.crm_activities(organization_id, source_key)
  where source_key is not null;

create index if not exists crm_activities_shared_cursor_idx
  on public.crm_activities(organization_id, workspace_id, occurred_at desc, id desc);

create index if not exists crm_notes_shared_cursor_idx
  on public.crm_notes(organization_id, workspace_id, created_at desc, id desc);

drop policy if exists crm_activities_organization_access on public.crm_activities;
create policy crm_activities_shared_read on public.crm_activities
  for select to authenticated
  using (public.has_organization_permission(organization_id, 'crm.read'));
create policy crm_activities_shared_append on public.crm_activities
  for insert to authenticated
  with check (public.has_organization_permission(organization_id, 'crm.manage'));

drop policy if exists crm_notes_organization_access on public.crm_notes;
create policy crm_notes_shared_read on public.crm_notes
  for select to authenticated
  using (public.has_organization_permission(organization_id, 'crm.read'));
create policy crm_notes_shared_append on public.crm_notes
  for insert to authenticated
  with check (public.has_organization_permission(organization_id, 'crm.manage'));
