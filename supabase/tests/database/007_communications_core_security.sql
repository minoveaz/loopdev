begin;

\ir helpers/rls_helpers.sql

select plan(18);

insert into auth.users (id, aud, role, email, encrypted_password, email_confirmed_at)
values
  ('00000000-0000-4000-8a00-000000000001', 'authenticated', 'authenticated', 'communications-agent-a@example.test', '', now()),
  ('00000000-0000-4000-8a00-000000000002', 'authenticated', 'authenticated', 'communications-viewer-b@example.test', '', now());

insert into public.organizations (id, name, slug)
values
  ('00000000-0000-4000-aa00-000000000001', 'Communications Security A', 'communications-security-a'),
  ('00000000-0000-4000-aa00-000000000002', 'Communications Security B', 'communications-security-b');

insert into public.organization_memberships (organization_id, user_id, role)
values
  ('00000000-0000-4000-aa00-000000000001', '00000000-0000-4000-8a00-000000000001', 'agent'),
  ('00000000-0000-4000-aa00-000000000002', '00000000-0000-4000-8a00-000000000002', 'viewer');

insert into public.crm_contacts (id, organization_id, first_name, phone, phone_normalized)
values
  ('00000000-0000-4000-ba00-000000000001', '00000000-0000-4000-aa00-000000000001', 'Existing A', '+34600123456', '+34600123456'),
  ('00000000-0000-4000-ba00-000000000002', '00000000-0000-4000-aa00-000000000002', 'Existing B', '+34600123457', '+34600123457');

insert into public.communication_accounts (id, organization_id, channel, provider, external_account_id, credentials_ref)
values
  ('00000000-0000-4000-ca00-000000000001', '00000000-0000-4000-aa00-000000000001', 'whatsapp', 'whatsapp_cloud', 'phone-a', 'vault:communications-a'),
  ('00000000-0000-4000-ca00-000000000002', '00000000-0000-4000-aa00-000000000002', 'whatsapp', 'whatsapp_cloud', 'phone-b', 'vault:communications-b');

select ok(exists (select 1 from public.permissions where key = 'communications.reply'), 'reply permission exists');
select ok(exists (select 1 from public.permissions where key = 'communications.note'), 'internal note permission exists');
select ok(exists (select 1 from public.permissions where key = 'communications.assign'), 'assignment permission exists');
select ok(exists (select 1 from public.permissions where key = 'communications.lifecycle'), 'lifecycle permission exists');
select ok(exists (select 1 from public.permissions where key = 'communications.manage-accounts'), 'account management permission exists');
select ok(exists (select 1 from public.role_permissions where role = 'agent' and permission_key = 'communications.reply'), 'agent can reply');
select ok(exists (select 1 from public.role_permissions where role = 'admin' and permission_key = 'communications.assign'), 'admin can reassign');
select ok(not exists (select 1 from public.role_permissions where role = 'viewer' and permission_key = 'communications.reply'), 'viewer cannot reply');

select ok(not has_function_privilege('authenticated', 'public.crm_resolve_whatsapp_inbound_contact(uuid, text, text)', 'execute'), 'authenticated users cannot invoke inbound CRM resolution');
select ok(has_function_privilege('service_role', 'public.crm_resolve_whatsapp_inbound_contact(uuid, text, text)', 'execute'), 'service role can invoke inbound CRM resolution');
select is((select created from public.crm_resolve_whatsapp_inbound_contact('00000000-0000-4000-aa00-000000000001', '+34600123456', 'Existing A')), false, 'existing inbound phone resolves without creating another contact');
select is((select identity_status from public.crm_resolve_whatsapp_inbound_contact('00000000-0000-4000-aa00-000000000001', '+34600123456', 'Existing A')), 'verified', 'existing contact preserves its identity status');
select is((select created from public.crm_resolve_whatsapp_inbound_contact('00000000-0000-4000-aa00-000000000001', '+34600123458', 'New Contact')), true, 'unknown inbound phone creates a CRM contact');
select is((select identity_status from public.crm_contacts where organization_id = '00000000-0000-4000-aa00-000000000001' and phone_normalized = '+34600123458'), 'pending_identity_review', 'new inbound contact is pending identity review');
select throws_ok(
  $$ select * from public.crm_resolve_whatsapp_inbound_contact('00000000-0000-4000-aa00-000000000001', '600123456', 'Malformed') $$,
  'WhatsApp phone must be normalized E.164',
  'inbound resolution rejects malformed phones'
);

set local role authenticated;
select pg_temp.set_authenticated_user('00000000-0000-4000-8a00-000000000001');
select is((select count(*)::integer from public.communication_accounts), 1, 'agent reads communication accounts in own organization only');
select ok(not exists (select 1 from public.communication_accounts where organization_id = '00000000-0000-4000-aa00-000000000002'), 'agent cannot read another organization communication account');
select throws_ok(
  $$ insert into public.communication_accounts (organization_id, channel, provider, external_account_id, credentials_ref) values ('00000000-0000-4000-aa00-000000000002', 'whatsapp', 'whatsapp_cloud', 'cross-org', 'vault:cross-org') $$,
  'new row violates row-level security policy for table "communication_accounts"',
  'agent cannot create a communication account in another organization'
);

select * from finish();
rollback;