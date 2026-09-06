-- Retention cleanup orchestration state. The worker remains server-side;
-- authenticated users can inspect their organization's jobs but cannot delete
-- or bypass idempotent state transitions.

create table if not exists public.document_intelligence_cleanup_jobs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  document_id uuid not null,
  retention_class text not null check (
    retention_class in ('temporary_source', 'persisted_document', 'extraction_result')
  ),
  due_at timestamptz not null,
  status text not null default 'scheduled' check (
    status in ('scheduled', 'running', 'retrying', 'completed', 'failed', 'skipped_legal_hold')
  ),
  attempt integer not null default 0 check (attempt >= 0),
  max_attempts integer not null default 3 check (max_attempts > 0),
  idempotency_key text not null check (char_length(trim(idempotency_key)) between 8 and 160),
  last_error_code text check (
    last_error_code is null
    or last_error_code in ('STORAGE_DELETE_FAILED', 'DATABASE_DELETE_FAILED', 'LOCK_NOT_ACQUIRED', 'LEGAL_HOLD', 'RETRY_EXHAUSTED')
  ),
  next_retry_at timestamptz,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, idempotency_key),
  foreign key (document_id, organization_id)
    references public.document_intelligence_documents(id, organization_id)
    on delete restrict
);

create index if not exists document_intelligence_cleanup_due_idx
  on public.document_intelligence_cleanup_jobs (status, due_at, organization_id);

grant select, insert, update on public.document_intelligence_cleanup_jobs to authenticated;

alter table public.document_intelligence_cleanup_jobs enable row level security;

create policy "document intelligence members can view cleanup jobs"
on public.document_intelligence_cleanup_jobs
for select
to authenticated
using (public.is_organization_member(organization_id));

create policy "document intelligence operators can schedule cleanup jobs"
on public.document_intelligence_cleanup_jobs
for insert
to authenticated
with check (
  public.has_organization_role(organization_id, array['owner', 'admin', 'agent'])
);

create policy "document intelligence operators can update cleanup jobs"
on public.document_intelligence_cleanup_jobs
for update
to authenticated
using (public.has_organization_role(organization_id, array['owner', 'admin', 'agent']))
with check (public.has_organization_role(organization_id, array['owner', 'admin', 'agent']));

create trigger document_intelligence_cleanup_jobs_updated_at
before update on public.document_intelligence_cleanup_jobs
for each row execute procedure public.handle_updated_at();
