-- Document Intelligence Core persistence boundary.
-- This migration is intentionally limited to documents, versions, and
-- extraction attempts. organization_id is canonical at every ownership edge.

create table if not exists public.document_intelligence_documents (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  workspace_id uuid,
  status text not null default 'temporary' check (
    status in ('temporary', 'uploaded', 'processing', 'review', 'approved', 'rejected', 'failed', 'expired', 'deleted')
  ),
  current_version_id uuid,
  retention_class text not null check (char_length(trim(retention_class)) between 1 and 80),
  expires_at timestamptz,
  version integer not null default 1 check (version > 0),
  concurrency_token text not null check (char_length(trim(concurrency_token)) >= 8),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, organization_id),
  foreign key (workspace_id, organization_id)
    references public.workspaces(id, organization_id)
    on delete restrict
);

create table if not exists public.document_intelligence_versions (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null,
  organization_id uuid not null references public.organizations(id) on delete restrict,
  version_number integer not null check (version_number > 0),
  source_reference text,
  checksum text,
  extraction_id uuid,
  created_by uuid references auth.users(id) on delete set null,
  version integer not null default 1 check (version > 0),
  concurrency_token text not null check (char_length(trim(concurrency_token)) >= 8),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, organization_id),
  unique (id, document_id, organization_id),
  unique (document_id, organization_id, version_number),
  foreign key (document_id, organization_id)
    references public.document_intelligence_documents(id, organization_id)
    on delete restrict
);

create table if not exists public.document_intelligence_extractions (
  id uuid primary key default gen_random_uuid(),
  document_version_id uuid not null,
  organization_id uuid not null references public.organizations(id) on delete restrict,
  status text not null default 'queued' check (
    status in ('queued', 'processing', 'review', 'approved', 'rejected', 'failed')
  ),
  attempt integer not null check (attempt > 0),
  previous_attempt_id uuid,
  provider text not null check (char_length(trim(provider)) between 1 and 120),
  provider_version text not null check (char_length(trim(provider_version)) between 1 and 80),
  schema_version text not null check (char_length(trim(schema_version)) between 1 and 80),
  fields jsonb not null default '{}'::jsonb,
  validation_summary jsonb not null default '{"results":[]}'::jsonb,
  usage jsonb,
  completed_at timestamptz,
  version integer not null default 1 check (version > 0),
  concurrency_token text not null check (char_length(trim(concurrency_token)) >= 8),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, organization_id),
  foreign key (document_version_id, organization_id)
    references public.document_intelligence_versions(id, organization_id)
    on delete restrict,
  foreign key (previous_attempt_id, organization_id)
    references public.document_intelligence_extractions(id, organization_id)
    on delete restrict,
  check ((attempt = 1 and previous_attempt_id is null) or (attempt > 1 and previous_attempt_id is not null)),
  check (previous_attempt_id is null or previous_attempt_id <> id)
);

alter table public.document_intelligence_documents
  add constraint document_intelligence_documents_current_version_fkey
  foreign key (current_version_id, id, organization_id)
  references public.document_intelligence_versions(id, document_id, organization_id)
  on delete set null;

alter table public.document_intelligence_versions
  add constraint document_intelligence_versions_extraction_fkey
  foreign key (extraction_id, organization_id)
  references public.document_intelligence_extractions(id, organization_id)
  on delete set null;

create or replace function public.prevent_document_intelligence_organization_change()
returns trigger
language plpgsql
as $$
begin
  if new.organization_id is distinct from old.organization_id then
    raise exception 'document_intelligence organization_id is immutable';
  end if;

  return new;
end;
$$;

create index if not exists document_intelligence_documents_history_idx
  on public.document_intelligence_documents (organization_id, created_at desc, id desc);
create index if not exists document_intelligence_documents_workspace_idx
  on public.document_intelligence_documents (organization_id, workspace_id, created_at desc, id desc);
create index if not exists document_intelligence_versions_document_idx
  on public.document_intelligence_versions (organization_id, document_id, version_number desc);
create index if not exists document_intelligence_extractions_version_idx
  on public.document_intelligence_extractions (organization_id, document_version_id, attempt desc);

grant select, insert, update, delete
on public.document_intelligence_documents,
   public.document_intelligence_versions,
   public.document_intelligence_extractions
to authenticated;

alter table public.document_intelligence_documents enable row level security;
alter table public.document_intelligence_versions enable row level security;
alter table public.document_intelligence_extractions enable row level security;

create trigger document_intelligence_documents_organization_immutable
before update on public.document_intelligence_documents
for each row execute procedure public.prevent_document_intelligence_organization_change();

create trigger document_intelligence_versions_organization_immutable
before update on public.document_intelligence_versions
for each row execute procedure public.prevent_document_intelligence_organization_change();

create trigger document_intelligence_extractions_organization_immutable
before update on public.document_intelligence_extractions
for each row execute procedure public.prevent_document_intelligence_organization_change();

create policy "document intelligence members can view documents"
on public.document_intelligence_documents
for select
to authenticated
using (
  public.is_organization_member(organization_id)
  and (
    workspace_id is null
    or exists (
      select 1
      from public.workspaces workspace
      where workspace.id = public.document_intelligence_documents.workspace_id
        and workspace.organization_id = public.document_intelligence_documents.organization_id
    )
  )
);

create policy "document intelligence operators can create documents"
on public.document_intelligence_documents
for insert
to authenticated
with check (
  public.has_organization_role(organization_id, array['owner', 'admin', 'agent'])
  and (
    workspace_id is null
    or exists (
      select 1
      from public.workspaces workspace
      where workspace.id = public.document_intelligence_documents.workspace_id
        and workspace.organization_id = public.document_intelligence_documents.organization_id
    )
  )
);

create policy "document intelligence operators can update documents"
on public.document_intelligence_documents
for update
to authenticated
using (
  public.has_organization_role(organization_id, array['owner', 'admin', 'agent'])
)
with check (
  public.has_organization_role(organization_id, array['owner', 'admin', 'agent'])
  and (
    workspace_id is null
    or exists (
      select 1
      from public.workspaces workspace
      where workspace.id = public.document_intelligence_documents.workspace_id
        and workspace.organization_id = public.document_intelligence_documents.organization_id
    )
  )
);

create policy "document intelligence operators can delete documents"
on public.document_intelligence_documents
for delete
to authenticated
using (
  public.has_organization_role(organization_id, array['owner', 'admin', 'agent'])
);

create policy "document intelligence members can view versions"
on public.document_intelligence_versions
for select
to authenticated
using (
  public.is_organization_member(organization_id)
  and exists (
    select 1
    from public.document_intelligence_documents document
    where document.id = public.document_intelligence_versions.document_id
      and document.organization_id = public.document_intelligence_versions.organization_id
  )
);

create policy "document intelligence operators can create versions"
on public.document_intelligence_versions
for insert
to authenticated
with check (
  public.has_organization_role(organization_id, array['owner', 'admin', 'agent'])
  and exists (
    select 1
    from public.document_intelligence_documents document
    where document.id = public.document_intelligence_versions.document_id
      and document.organization_id = public.document_intelligence_versions.organization_id
  )
);

create policy "document intelligence operators can update versions"
on public.document_intelligence_versions
for update
to authenticated
using (public.has_organization_role(organization_id, array['owner', 'admin', 'agent']))
with check (public.has_organization_role(organization_id, array['owner', 'admin', 'agent']));

create policy "document intelligence operators can delete versions"
on public.document_intelligence_versions
for delete
to authenticated
using (public.has_organization_role(organization_id, array['owner', 'admin', 'agent']));

create policy "document intelligence members can view extractions"
on public.document_intelligence_extractions
for select
to authenticated
using (
  public.is_organization_member(organization_id)
  and exists (
    select 1
    from public.document_intelligence_versions version_row
    where version_row.id = public.document_intelligence_extractions.document_version_id
      and version_row.organization_id = public.document_intelligence_extractions.organization_id
  )
);

create policy "document intelligence operators can create extractions"
on public.document_intelligence_extractions
for insert
to authenticated
with check (
  public.has_organization_role(organization_id, array['owner', 'admin', 'agent'])
  and exists (
    select 1
    from public.document_intelligence_versions version_row
    where version_row.id = public.document_intelligence_extractions.document_version_id
      and version_row.organization_id = public.document_intelligence_extractions.organization_id
  )
);

create policy "document intelligence operators can update extractions"
on public.document_intelligence_extractions
for update
to authenticated
using (public.has_organization_role(organization_id, array['owner', 'admin', 'agent']))
with check (public.has_organization_role(organization_id, array['owner', 'admin', 'agent']));

create policy "document intelligence operators can delete extractions"
on public.document_intelligence_extractions
for delete
to authenticated
using (public.has_organization_role(organization_id, array['owner', 'admin', 'agent']));

create trigger document_intelligence_documents_updated_at
before update on public.document_intelligence_documents
for each row execute procedure public.handle_updated_at();

create trigger document_intelligence_versions_updated_at
before update on public.document_intelligence_versions
for each row execute procedure public.handle_updated_at();

create trigger document_intelligence_extractions_updated_at
before update on public.document_intelligence_extractions
for each row execute procedure public.handle_updated_at();
