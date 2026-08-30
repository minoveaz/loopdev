begin;

\ir helpers/rls_helpers.sql

select plan(12);

insert into auth.users (id, aud, role, email, encrypted_password, email_confirmed_at)
values
  ('00000000-0000-4000-8c00-000000000001', 'authenticated', 'authenticated', 'communications-owner-a@example.test', '', now()),
  ('00000000-0000-4000-8c00-000000000002', 'authenticated', 'authenticated', 'communications-owner-b@example.test', '', now());

insert into public.organizations (id, name, slug)
values
  ('00000000-0000-4000-ac00-000000000001', 'Communications Delivery A', 'communications-delivery-a'),
  ('00000000-0000-4000-ac00-000000000002', 'Communications Delivery B', 'communications-delivery-b');

insert into public.organization_memberships (organization_id, user_id, role)
values
  ('00000000-0000-4000-ac00-000000000001', '00000000-0000-4000-8c00-000000000001', 'owner'),
  ('00000000-0000-4000-ac00-000000000002', '00000000-0000-4000-8c00-000000000002', 'owner');

insert into public.crm_contacts (id, organization_id, first_name, phone, phone_normalized)
values
  ('00000000-0000-4000-bc00-000000000001', '00000000-0000-4000-ac00-000000000001', 'Inbound A', '+34600123001', '+34600123001'),
  ('00000000-0000-4000-bc00-000000000002', '00000000-0000-4000-ac00-000000000002', 'Inbound B', '+34600123002', '+34600123002');

insert into public.communication_accounts (id, organization_id, channel, provider, external_account_id, credentials_ref)
values
  ('00000000-0000-4000-cc00-000000000001', '00000000-0000-4000-ac00-000000000001', 'whatsapp', 'whatsapp_cloud', 'phone-delivery-a', 'vault:delivery-a'),
  ('00000000-0000-4000-cc00-000000000002', '00000000-0000-4000-ac00-000000000002', 'whatsapp', 'whatsapp_cloud', 'phone-delivery-b', 'vault:delivery-b');

insert into public.communication_channels (id, organization_id, account_id, contact_id, channel, address)
values
  ('00000000-0000-4000-dc00-000000000001', '00000000-0000-4000-ac00-000000000001', '00000000-0000-4000-cc00-000000000001', '00000000-0000-4000-bc00-000000000001', 'whatsapp', '+34600123001'),
  ('00000000-0000-4000-dc00-000000000002', '00000000-0000-4000-ac00-000000000002', '00000000-0000-4000-cc00-000000000002', '00000000-0000-4000-bc00-000000000002', 'whatsapp', '+34600123002');

insert into public.communication_conversations (id, organization_id, contact_id, channel_id, channel, status, last_activity_at)
values
  ('00000000-0000-4000-ec00-000000000001', '00000000-0000-4000-ac00-000000000001', '00000000-0000-4000-bc00-000000000001', '00000000-0000-4000-dc00-000000000001', 'whatsapp', 'open', now()),
  ('00000000-0000-4000-ec00-000000000002', '00000000-0000-4000-ac00-000000000002', '00000000-0000-4000-bc00-000000000002', '00000000-0000-4000-dc00-000000000002', 'whatsapp', 'open', now());

insert into public.communication_messages (id, organization_id, conversation_id, external_id, direction, status, body)
values
  ('00000000-0000-4000-fc00-000000000001', '00000000-0000-4000-ac00-000000000001', '00000000-0000-4000-ec00-000000000001', 'wamid.delivery-a', 'inbound', 'delivered', 'Hola'),
  ('00000000-0000-4000-fc00-000000000002', '00000000-0000-4000-ac00-000000000002', '00000000-0000-4000-ec00-000000000002', 'wamid.delivery-b', 'inbound', 'delivered', 'Hola');

select ok(pg_temp.has_scoped_fk('communication_conversations', 'communication_channels'), 'conversations enforce channel organization ownership');
select ok(pg_temp.has_scoped_fk('communication_messages', 'communication_conversations'), 'messages enforce conversation organization ownership');
select ok(pg_temp.has_scoped_fk('communication_webhook_events', 'communication_accounts'), 'webhook events enforce account organization ownership');
select lives_ok(
  $$ insert into public.communication_webhook_events (organization_id, account_id, external_event_id, external_message_id, payload_version) values ('00000000-0000-4000-ac00-000000000001', '00000000-0000-4000-cc00-000000000001', 'message:wamid.delivery-a', 'wamid.delivery-a', 'whatsapp-cloud-v1') $$,
  'first provider event is persisted'
);
select throws_ok(
  $$ insert into public.communication_webhook_events (organization_id, account_id, external_event_id, external_message_id, payload_version) values ('00000000-0000-4000-ac00-000000000001', '00000000-0000-4000-cc00-000000000001', 'message:wamid.delivery-a', 'wamid.delivery-a', 'whatsapp-cloud-v1') $$,
  'duplicate key value violates unique constraint "communication_webhook_events_organization_id_account_id_external_event_id_key"',
  'duplicate provider event is rejected by the idempotency key'
);
select lives_ok(
  $$ insert into public.communication_message_statuses (organization_id, message_id, status, provider_timestamp) values ('00000000-0000-4000-ac00-000000000001', '00000000-0000-4000-fc00-000000000001', 'read', now()) $$,
  'same-organization delivery status is append-only'
);

set local role authenticated;
select pg_temp.set_authenticated_user('00000000-0000-4000-8c00-000000000001');
select is((select count(*)::integer from public.communication_conversations), 1, 'owner reads conversations in own organization only');
select is((select count(*)::integer from public.communication_messages), 1, 'owner reads messages in own organization only');
select ok(not exists (select 1 from public.communication_messages where organization_id = '00000000-0000-4000-ac00-000000000002'), 'owner cannot read another organization messages');
select throws_ok(
  $$ insert into public.communication_messages (organization_id, conversation_id, direction, status, body) values ('00000000-0000-4000-ac00-000000000002', '00000000-0000-4000-ec00-000000000002', 'outbound', 'queued', 'Cross organization') $$,
  'new row violates row-level security policy for table "communication_messages"',
  'owner cannot send into another organization conversation'
);

reset role;
select throws_ok(
  $$ insert into public.communication_messages (organization_id, conversation_id, direction, status, body) values ('00000000-0000-4000-ac00-000000000001', '00000000-0000-4000-ec00-000000000002', 'outbound', 'queued', 'Cross reference') $$,
  'insert or update on table "communication_messages" violates foreign key constraint "communication_messages_conversation_org_fkey"',
  'message cannot reference a conversation from another organization'
);
select throws_ok(
  $$ insert into public.communication_conversations (organization_id, contact_id, channel_id, channel, status, last_activity_at) values ('00000000-0000-4000-ac00-000000000001', '00000000-0000-4000-bc00-000000000001', '00000000-0000-4000-dc00-000000000002', 'whatsapp', 'open', now()) $$,
  'insert or update on table "communication_conversations" violates foreign key constraint "communication_conversations_channel_org_fkey"',
  'conversation cannot reference a channel from another organization'
);

select * from finish();
rollback;