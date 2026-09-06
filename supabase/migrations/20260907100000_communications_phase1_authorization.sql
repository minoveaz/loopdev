-- Communications Core phase 1: granular permissions and CRM-owned inbound contact resolution.

alter table public.crm_contacts
  add column if not exists identity_status text not null default 'verified'
  check (identity_status in ('verified', 'pending_identity_review'));

alter table public.communication_accounts
  add column if not exists outbound_enabled boolean not null default true;

alter table public.communication_conversations
  add column if not exists last_activity_at timestamptz not null default now();

insert into public.permissions (key, description, scope)
values
  ('communications.reply', 'Reply to customer communications', 'record'),
  ('communications.note', 'Add internal communication notes', 'record'),
  ('communications.assign', 'Assign customer communications', 'record'),
  ('communications.lifecycle', 'Change communication lifecycle state', 'record'),
  ('communications.manage-accounts', 'Manage communication provider accounts', 'organization')
on conflict (key) do nothing;

insert into public.role_permissions (role, permission_key)
values
  ('owner', 'communications.reply'),
  ('owner', 'communications.note'),
  ('owner', 'communications.assign'),
  ('owner', 'communications.lifecycle'),
  ('owner', 'communications.manage-accounts'),
  ('admin', 'communications.reply'),
  ('admin', 'communications.note'),
  ('admin', 'communications.assign'),
  ('admin', 'communications.lifecycle'),
  ('admin', 'communications.manage-accounts'),
  ('agent', 'communications.reply'),
  ('agent', 'communications.note'),
  ('agent', 'communications.assign'),
  ('agent', 'communications.lifecycle')
on conflict (role, permission_key) do nothing;

create or replace function public.crm_resolve_whatsapp_inbound_contact(
  p_organization_id uuid,
  p_phone text,
  p_profile_name text default null
)
returns table (
  contact_id uuid,
  identity_status text,
  created boolean
)
language plpgsql
security definer
set search_path = public
as $$
declare
  resolved_contact public.crm_contacts%rowtype;
  display_name text;
begin
  if p_phone !~ '^\+[1-9][0-9]{6,14}$' then
    raise exception 'WhatsApp phone must be normalized E.164';
  end if;

  select * into resolved_contact
  from public.crm_contacts
  where organization_id = p_organization_id
    and phone_normalized = p_phone;

  if found then
    return query select resolved_contact.id, resolved_contact.identity_status, false;
    return;
  end if;

  display_name := left(coalesce(nullif(trim(p_profile_name), ''), p_phone), 120);

  insert into public.crm_contacts (
    organization_id,
    first_name,
    phone,
    phone_normalized,
    identity_status
  )
  values (
    p_organization_id,
    split_part(display_name, ' ', 1),
    p_phone,
    p_phone,
    'pending_identity_review'
  )
  on conflict (organization_id, phone_normalized) do nothing
  returning * into resolved_contact;

  if found then
    insert into public.crm_audit_events (
      organization_id,
      entity_type,
      entity_id,
      action,
      metadata
    )
    values (
      p_organization_id,
      'contact',
      resolved_contact.id,
      'whatsapp_inbound_contact_created',
      jsonb_build_object('identity_status', 'pending_identity_review')
    );
    return query select resolved_contact.id, resolved_contact.identity_status, true;
    return;
  end if;

  select * into resolved_contact
  from public.crm_contacts
  where organization_id = p_organization_id
    and phone_normalized = p_phone;

  return query select resolved_contact.id, resolved_contact.identity_status, false;
end;
$$;

revoke all on function public.crm_resolve_whatsapp_inbound_contact(uuid, text, text) from public, anon, authenticated;
grant execute on function public.crm_resolve_whatsapp_inbound_contact(uuid, text, text) to service_role;

do $$
declare
  current_table_name text;
begin
  foreach current_table_name in array array[
    'communication_accounts', 'communication_channels', 'communication_templates'
  ] loop
    execute format('drop policy if exists %I on public.%I', current_table_name || '_communications_read', current_table_name);
    execute format('drop policy if exists %I on public.%I', current_table_name || '_communications_insert', current_table_name);
    execute format('drop policy if exists %I on public.%I', current_table_name || '_communications_update', current_table_name);
    execute format('drop policy if exists %I on public.%I', current_table_name || '_communications_delete', current_table_name);
    execute format('create policy %I on public.%I for select to authenticated using (public.has_organization_permission(organization_id, ''communications.read''))', current_table_name || '_communications_read', current_table_name);
    execute format('create policy %I on public.%I for insert to authenticated with check (public.has_organization_permission(organization_id, ''communications.manage-accounts''))', current_table_name || '_communications_insert', current_table_name);
    execute format('create policy %I on public.%I for update to authenticated using (public.has_organization_permission(organization_id, ''communications.manage-accounts'')) with check (public.has_organization_permission(organization_id, ''communications.manage-accounts''))', current_table_name || '_communications_update', current_table_name);
    execute format('revoke delete on table public.%I from authenticated', current_table_name);
  end loop;
end $$;

drop policy if exists communication_conversations_communications_read on public.communication_conversations;
drop policy if exists communication_conversations_communications_insert on public.communication_conversations;
drop policy if exists communication_conversations_communications_update on public.communication_conversations;
drop policy if exists communication_conversations_communications_delete on public.communication_conversations;
create policy communication_conversations_communications_read on public.communication_conversations
  for select to authenticated
  using (public.has_organization_permission(organization_id, 'communications.read') and (workspace_id is null or public.can_access_workspace(workspace_id)));
create policy communication_conversations_communications_update on public.communication_conversations
  for update to authenticated
  using ((public.has_organization_permission(organization_id, 'communications.assign') or public.has_organization_permission(organization_id, 'communications.lifecycle')) and (workspace_id is null or public.can_access_workspace(workspace_id)))
  with check ((public.has_organization_permission(organization_id, 'communications.assign') or public.has_organization_permission(organization_id, 'communications.lifecycle')) and (workspace_id is null or public.can_access_workspace(workspace_id)));
revoke insert, delete on table public.communication_conversations from authenticated;

drop policy if exists communication_messages_communications_read on public.communication_messages;
drop policy if exists communication_messages_communications_insert on public.communication_messages;
drop policy if exists communication_messages_communications_update on public.communication_messages;
drop policy if exists communication_messages_communications_delete on public.communication_messages;
drop policy if exists communication_message_statuses_communications_read on public.communication_message_statuses;
drop policy if exists communication_message_statuses_communications_insert on public.communication_message_statuses;
drop policy if exists communication_message_statuses_communications_update on public.communication_message_statuses;
drop policy if exists communication_message_statuses_communications_delete on public.communication_message_statuses;
drop policy if exists communication_internal_notes_communications_read on public.communication_internal_notes;
drop policy if exists communication_internal_notes_communications_insert on public.communication_internal_notes;
drop policy if exists communication_internal_notes_communications_update on public.communication_internal_notes;
drop policy if exists communication_internal_notes_communications_delete on public.communication_internal_notes;

create policy communication_messages_communications_read on public.communication_messages
  for select to authenticated
  using (public.has_organization_permission(organization_id, 'communications.read') and exists (
    select 1 from public.communication_conversations conversation
    where conversation.id = communication_messages.conversation_id
      and conversation.organization_id = communication_messages.organization_id
      and (conversation.workspace_id is null or public.can_access_workspace(conversation.workspace_id))
  ));
create policy communication_messages_communications_insert on public.communication_messages
  for insert to authenticated
  with check (public.has_organization_permission(organization_id, 'communications.reply') and exists (
    select 1 from public.communication_conversations conversation
    where conversation.id = communication_messages.conversation_id
      and conversation.organization_id = communication_messages.organization_id
      and (conversation.workspace_id is null or public.can_access_workspace(conversation.workspace_id))
  ));
revoke update, delete on table public.communication_messages from authenticated;

create policy communication_message_statuses_communications_read on public.communication_message_statuses
  for select to authenticated
  using (public.has_organization_permission(organization_id, 'communications.read') and exists (
    select 1 from public.communication_messages message
    join public.communication_conversations conversation on conversation.id = message.conversation_id and conversation.organization_id = message.organization_id
    where message.id = communication_message_statuses.message_id
      and message.organization_id = communication_message_statuses.organization_id
      and (conversation.workspace_id is null or public.can_access_workspace(conversation.workspace_id))
  ));
revoke insert, update, delete on table public.communication_message_statuses from authenticated;

create policy communication_internal_notes_communications_read on public.communication_internal_notes
  for select to authenticated
  using (public.has_organization_permission(organization_id, 'communications.read') and exists (
    select 1 from public.communication_conversations conversation
    where conversation.id = communication_internal_notes.conversation_id
      and conversation.organization_id = communication_internal_notes.organization_id
      and (conversation.workspace_id is null or public.can_access_workspace(conversation.workspace_id))
  ));
create policy communication_internal_notes_communications_insert on public.communication_internal_notes
  for insert to authenticated
  with check (public.has_organization_permission(organization_id, 'communications.note') and exists (
    select 1 from public.communication_conversations conversation
    where conversation.id = communication_internal_notes.conversation_id
      and conversation.organization_id = communication_internal_notes.organization_id
      and (conversation.workspace_id is null or public.can_access_workspace(conversation.workspace_id))
  ));
revoke update, delete on table public.communication_internal_notes from authenticated;

drop policy if exists communication_webhook_events_communications_read on public.communication_webhook_events;
drop policy if exists communication_webhook_events_communications_insert on public.communication_webhook_events;
drop policy if exists communication_webhook_events_communications_update on public.communication_webhook_events;
drop policy if exists communication_webhook_events_communications_delete on public.communication_webhook_events;
create policy communication_webhook_events_communications_read on public.communication_webhook_events
  for select to authenticated
  using (public.has_organization_permission(organization_id, 'communications.manage-accounts'));
revoke insert, update, delete on table public.communication_webhook_events from authenticated;