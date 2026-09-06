-- Append-only Document Intelligence audit evidence.
-- Metadata remains deliberately small and is redacted at the contract boundary.

create table if not exists public.document_intelligence_audit_events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  actor_type text not null check (actor_type in ('user', 'service', 'system')),
  actor_user_id uuid references auth.users(id) on delete set null,
  event_type text not null check (
    event_type in ('uploaded', 'processing_started', 'processing_completed', 'manual_edit', 'approved', 'rejected', 'retry_requested', 'failure_recovered')
  ),
  document_id uuid not null,
  document_version_id uuid,
  extraction_id uuid,
  correlation_id text not null check (char_length(trim(correlation_id)) between 1 and 160),
  metadata jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  foreign key (document_id, organization_id)
    references public.document_intelligence_documents(id, organization_id)
    on delete restrict,
  foreign key (document_version_id, organization_id)
    references public.document_intelligence_versions(id, organization_id)
    on delete restrict,
  foreign key (extraction_id, organization_id)
    references public.document_intelligence_extractions(id, organization_id)
    on delete restrict,
  check ((actor_type = 'user' and actor_user_id is not null) or (actor_type in ('service', 'system') and actor_user_id is null))
);

create index if not exists document_intelligence_audit_history_idx
  on public.document_intelligence_audit_events (organization_id, occurred_at desc, id desc);

grant select, insert on public.document_intelligence_audit_events to authenticated;
revoke update, delete on public.document_intelligence_audit_events from authenticated;

alter table public.document_intelligence_audit_events enable row level security;

create policy "document intelligence members can view audit events"
on public.document_intelligence_audit_events
for select
to authenticated
using (public.is_organization_member(organization_id));

create policy "document intelligence operators can append audit events"
on public.document_intelligence_audit_events
for insert
to authenticated
with check (
  public.has_organization_role(organization_id, array['owner', 'admin', 'agent'])
  and actor_type = 'user'
  and actor_user_id = auth.uid()
);

create or replace function public.prevent_document_intelligence_audit_mutation()
returns trigger
language plpgsql
as $$
begin
  raise exception 'document_intelligence_audit_events is append-only';
end;
$$;

create trigger document_intelligence_audit_events_append_only
before update or delete on public.document_intelligence_audit_events
for each row execute procedure public.prevent_document_intelligence_audit_mutation();
