-- Synthetic Communications Inbox data for local/development validation only.
-- Apply after the platform, CRM and Communications Core migrations.

do $$
declare
  target_organization_id uuid;
  workspace_id uuid;
  contact_id uuid;
  account_id uuid;
  channel_id uuid;
  conversation_id uuid;
begin
  select id into strict target_organization_id
  from public.organizations
  where slug = 'estar-protegidos' and is_active = true;

  select workspace.id into strict workspace_id
  from public.workspaces as workspace
  where workspace.organization_id = target_organization_id
    and workspace.suite_key = 'crm'
    and workspace.slug = 'sales-crm'
    and workspace.status = 'active';

  insert into public.crm_contacts (
    organization_id, first_name, last_name, email, phone, phone_normalized, company_name
  ) values (
    target_organization_id, 'Ana', 'Garcia', 'ana.communications@example.test',
    '+34610000099', '+34610000099', 'Acme Industries'
  )
  on conflict (organization_id, email_normalized) do update set
    first_name = excluded.first_name,
    last_name = excluded.last_name,
    email = excluded.email,
    phone = excluded.phone,
    phone_normalized = excluded.phone_normalized,
    company_name = excluded.company_name,
    updated_at = now()
  returning id into contact_id;

  insert into public.communication_accounts (
    organization_id, channel, provider, external_account_id, status, credentials_ref
  ) values (
    target_organization_id, 'whatsapp', 'whatsapp_cloud',
    'development-phone-number', 'connected', 'supabase-vault://communications/development'
  )
  on conflict (organization_id, provider, external_account_id) do update set
    status = excluded.status,
    updated_at = now()
  returning id into account_id;

  insert into public.communication_channels (
    organization_id, account_id, contact_id, channel, address, display_name, is_primary
  ) values (
    target_organization_id, account_id, contact_id, 'whatsapp',
    '+34610000099', 'Ana Garcia', true
  )
  on conflict (organization_id, account_id, channel, address) do update set
    contact_id = excluded.contact_id,
    address = excluded.address,
    display_name = excluded.display_name,
    updated_at = now()
  returning id into channel_id;

  select conversation.id into conversation_id
  from public.communication_conversations as conversation
  where conversation.organization_id = target_organization_id
    and conversation.contact_id = contact_id
    and conversation.channel_id = channel_id
  order by conversation.updated_at desc
  limit 1;

  if conversation_id is null then
    conversation_id := gen_random_uuid();
  end if;

  insert into public.communication_conversations (
    id, organization_id, workspace_id, contact_id, channel_id, channel, status,
    last_inbound_at, window_expires_at
  ) values (
    conversation_id, target_organization_id, workspace_id, contact_id, channel_id, 'whatsapp', 'open',
    now() - interval '10 minutes', now() + interval '23 hours 50 minutes'
  )
  on conflict (id) do update set
    workspace_id = excluded.workspace_id,
    contact_id = excluded.contact_id,
    channel_id = excluded.channel_id,
    status = excluded.status,
    last_inbound_at = excluded.last_inbound_at,
    window_expires_at = excluded.window_expires_at,
    updated_at = now()
  where public.communication_conversations.organization_id = excluded.organization_id;

  insert into public.communication_messages (
    organization_id, conversation_id, external_id, direction, status, body
  ) values
    (
      target_organization_id, conversation_id, 'development-inbox-message-1',
      'inbound', 'read', 'Hi, I reviewed the proposal and have one question.'
    ),
    (
      target_organization_id, conversation_id, 'development-inbox-message-2',
      'inbound', 'read', 'Could you send me the updated proposal?'
    )
  on conflict (organization_id, external_id) do update set
    conversation_id = excluded.conversation_id,
    body = excluded.body,
    status = excluded.status,
    updated_at = now();
end;
$$;
