-- Communications Core foundation.
-- This is the new CRM-aligned model. The communications_* POC tables remain legacy.

create table if not exists public.communication_accounts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  brand_id uuid,
  channel text not null,
  provider text not null,
  external_account_id text not null,
  status text not null default 'pending',
  credentials_ref text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, provider, external_account_id),
  check (channel in ('email', 'whatsapp', 'instagram', 'facebook_messenger', 'sms', 'phone')),
  check (status in ('pending', 'connected', 'disconnected', 'error'))
);

alter table public.communication_accounts
  add constraint communication_accounts_brand_fkey foreign key (brand_id, organization_id)
  references public.brands(id, organization_id) on delete restrict;

create table if not exists public.communication_channels (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  account_id uuid not null references public.communication_accounts(id) on delete cascade,
  contact_id uuid not null references public.crm_contacts(id) on delete cascade,
  channel text not null,
  address text not null,
  display_name text,
  is_primary boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, account_id, channel, address),
  check (channel in ('email', 'whatsapp', 'instagram', 'facebook_messenger', 'sms', 'phone'))
);

create table if not exists public.communication_templates (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  brand_id uuid,
  channel text not null,
  external_template_id text not null,
  language text not null,
  status text not null default 'draft',
  body text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, channel, external_template_id),
  check (channel in ('email', 'whatsapp', 'instagram', 'facebook_messenger', 'sms', 'phone')),
  check (status in ('draft', 'approved', 'rejected', 'archived'))
);

alter table public.communication_templates
  add constraint communication_templates_brand_fkey foreign key (brand_id, organization_id)
  references public.brands(id, organization_id) on delete restrict;

create table if not exists public.communication_conversations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  brand_id uuid,
  workspace_id uuid,
  contact_id uuid not null references public.crm_contacts(id) on delete cascade,
  channel_id uuid not null references public.communication_channels(id) on delete restrict,
  channel text not null,
  status text not null default 'open',
  assigned_to_user_id uuid references auth.users(id) on delete set null,
  last_inbound_at timestamptz,
  window_expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (channel in ('email', 'whatsapp', 'instagram', 'facebook_messenger', 'sms', 'phone')),
  check (status in ('open', 'pending', 'snoozed', 'closed'))
);

alter table public.communication_conversations
  add constraint communication_conversations_brand_fkey foreign key (brand_id, organization_id)
  references public.brands(id, organization_id) on delete restrict,
  add constraint communication_conversations_workspace_fkey foreign key (workspace_id, organization_id)
  references public.workspaces(id, organization_id) on delete restrict;

create table if not exists public.communication_messages (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  conversation_id uuid not null references public.communication_conversations(id) on delete cascade,
  external_id text,
  direction text not null,
  status text not null default 'queued',
  body text,
  template_id uuid references public.communication_templates(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, external_id),
  check (direction in ('inbound', 'outbound')),
  check (status in ('queued', 'sent', 'delivered', 'read', 'failed')),
  check (body is not null or template_id is not null)
);

create table if not exists public.communication_message_statuses (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  message_id uuid not null references public.communication_messages(id) on delete cascade,
  status text not null,
  provider_timestamp timestamptz,
  created_at timestamptz not null default now(),
  check (status in ('queued', 'sent', 'delivered', 'read', 'failed'))
);

create table if not exists public.communication_internal_notes (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  conversation_id uuid not null references public.communication_conversations(id) on delete cascade,
  author_id uuid references auth.users(id) on delete set null,
  body text not null,
  created_at timestamptz not null default now(),
  check (length(trim(body)) > 0)
);

create table if not exists public.communication_webhook_events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  account_id uuid not null references public.communication_accounts(id) on delete cascade,
  external_event_id text not null,
  external_message_id text,
  payload_version text not null,
  received_at timestamptz not null default now(),
  processed_at timestamptz,
  processing_status text not null default 'received',
  retry_count integer not null default 0,
  unique (organization_id, account_id, external_event_id),
  check (processing_status in ('received', 'processed', 'failed')),
  check (retry_count >= 0)
);

create index if not exists communication_conversations_inbox_idx
  on public.communication_conversations(organization_id, status, updated_at desc);
create index if not exists communication_messages_conversation_idx
  on public.communication_messages(organization_id, conversation_id, created_at desc);
create index if not exists communication_webhook_events_account_idx
  on public.communication_webhook_events(organization_id, account_id, received_at desc);

do $$
declare table_name text;
begin
  foreach table_name in array array[
    'communication_accounts', 'communication_channels', 'communication_templates',
    'communication_conversations', 'communication_messages', 'communication_message_statuses',
    'communication_internal_notes', 'communication_webhook_events'
  ] loop
    execute format('alter table public.%I enable row level security', table_name);
    execute format('grant select, insert, update, delete on table public.%I to authenticated', table_name);
    execute format('create policy %I on public.%I for select to authenticated using (public.has_organization_permission(organization_id, ''communications.read''))', table_name || '_read', table_name);
    execute format('create policy %I on public.%I for all to authenticated using (public.has_organization_permission(organization_id, ''communications.send'')) with check (public.has_organization_permission(organization_id, ''communications.send''))', table_name || '_manage', table_name);
  end loop;
end $$;
