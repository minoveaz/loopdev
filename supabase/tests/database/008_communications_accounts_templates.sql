begin;

\ir helpers/rls_helpers.sql

select plan(14);

insert into auth.users (id, aud, role, email, encrypted_password, email_confirmed_at)
values
  ('00000000-0000-4000-8b00-000000000001', 'authenticated', 'authenticated', 'communications-admin-a@example.test', '', now()),
  ('00000000-0000-4000-8b00-000000000002', 'authenticated', 'authenticated', 'communications-viewer-b@example.test', '', now());

insert into public.organizations (id, name, slug)
values
  ('00000000-0000-4000-ab00-000000000001', 'Communications Template A', 'communications-template-a'),
  ('00000000-0000-4000-ab00-000000000002', 'Communications Template B', 'communications-template-b');

insert into public.organization_memberships (organization_id, user_id, role)
values
  ('00000000-0000-4000-ab00-000000000001', '00000000-0000-4000-8b00-000000000001', 'admin'),
  ('00000000-0000-4000-ab00-000000000002', '00000000-0000-4000-8b00-000000000002', 'viewer');

insert into public.brands (id, organization_id, name)
values
  ('00000000-0000-4000-bb00-000000000001', '00000000-0000-4000-ab00-000000000001', 'Brand A1'),
  ('00000000-0000-4000-bb00-000000000002', '00000000-0000-4000-ab00-000000000001', 'Brand A2'),
  ('00000000-0000-4000-bb00-000000000003', '00000000-0000-4000-ab00-000000000002', 'Brand B1');

insert into public.communication_accounts (id, organization_id, brand_id, channel, provider, external_account_id, credentials_ref, status, outbound_enabled, provider_metadata)
values
  ('00000000-0000-4000-cb00-000000000001', '00000000-0000-4000-ab00-000000000001', '00000000-0000-4000-bb00-000000000001', 'whatsapp', 'whatsapp_cloud', 'phone-template-a', 'vault:template-a', 'connected', true, '{}'::jsonb),
  ('00000000-0000-4000-cb00-000000000002', '00000000-0000-4000-ab00-000000000002', '00000000-0000-4000-bb00-000000000003', 'whatsapp', 'whatsapp_cloud', 'phone-template-b', 'vault:template-b', 'connected', true, '{}'::jsonb);

insert into public.communication_templates (id, organization_id, brand_id, account_id, channel, external_template_id, language, name, category, status, body, parameter_names)
values
  ('00000000-0000-4000-db00-000000000001', '00000000-0000-4000-ab00-000000000001', '00000000-0000-4000-bb00-000000000001', '00000000-0000-4000-cb00-000000000001', 'whatsapp', 'template-approved-a', 'es', 'welcome', 'utility', 'approved', 'Hola {{firstName}}', '["firstName"]'::jsonb),
  ('00000000-0000-4000-db00-000000000002', '00000000-0000-4000-ab00-000000000002', '00000000-0000-4000-bb00-000000000003', '00000000-0000-4000-cb00-000000000002', 'whatsapp', 'template-rejected-b', 'es', 'rejected', 'utility', 'rejected', 'No usar', '[]'::jsonb);

select ok(pg_temp.has_policy_for('communication_account_onboardings', 'select'), 'onboarding records expose a SELECT policy');
select ok(pg_temp.has_policy_for('communication_account_onboardings', 'insert'), 'onboarding records expose an INSERT policy');
select ok(pg_temp.has_policy_for('communication_account_onboardings', 'update'), 'onboarding records expose an UPDATE policy');
select ok(not pg_temp.has_policy_for('communication_account_onboardings', 'delete'), 'onboarding records have no DELETE policy');
select ok(pg_temp.has_scoped_fk('communication_templates', 'communication_accounts'), 'templates enforce account organization ownership');
select ok(pg_temp.has_scoped_fk('communication_account_onboardings', 'brands'), 'onboarding records enforce brand organization ownership');

set local role authenticated;
select pg_temp.set_authenticated_user('00000000-0000-4000-8b00-000000000001');
select is((select count(*)::integer from public.communication_templates), 1, 'admin reads templates from own organization only');
select is((select count(*)::integer from public.communication_accounts), 1, 'admin reads accounts from own organization only');
select lives_ok(
  $$ insert into public.communication_account_onboardings (organization_id, brand_id, state_hash, expires_at) values ('00000000-0000-4000-ab00-000000000001', '00000000-0000-4000-bb00-000000000002', repeat('a', 64), now() + interval '10 minutes') $$,
  'admin can start an onboarding for another brand within own organization'
);
select throws_ok(
  $$ insert into public.communication_account_onboardings (organization_id, brand_id, state_hash, expires_at) values ('00000000-0000-4000-ab00-000000000002', '00000000-0000-4000-bb00-000000000003', repeat('b', 64), now() + interval '10 minutes') $$,
  'new row violates row-level security policy for table "communication_account_onboardings"',
  'admin cannot start onboarding for another organization'
);

select pg_temp.set_authenticated_user('00000000-0000-4000-8b00-000000000002');
select is((select count(*)::integer from public.communication_templates), 1, 'viewer reads templates from own organization only');
select throws_ok(
  $$ insert into public.communication_account_onboardings (organization_id, state_hash, expires_at) values ('00000000-0000-4000-ab00-000000000002', repeat('c', 64), now() + interval '10 minutes') $$,
  'new row violates row-level security policy for table "communication_account_onboardings"',
  'viewer cannot start onboarding'
);

reset role;
select throws_ok(
  $$ insert into public.communication_templates (organization_id, account_id, channel, external_template_id, language, name, category, status, body) values ('00000000-0000-4000-ab00-000000000001', '00000000-0000-4000-cb00-000000000002', 'whatsapp', 'cross-account', 'es', 'cross', 'utility', 'approved', 'Cross organization') $$,
  'insert or update on table "communication_templates" violates foreign key constraint "communication_templates_account_org_fkey"',
  'template cannot reference an account from another organization'
);
select throws_ok(
  $$ insert into public.communication_account_onboardings (organization_id, brand_id, state_hash, expires_at) values ('00000000-0000-4000-ab00-000000000001', '00000000-0000-4000-bb00-000000000003', repeat('d', 64), now() + interval '10 minutes') $$,
  'insert or update on table "communication_account_onboardings" violates foreign key constraint "communication_account_onboardings_brand_org_fkey"',
  'onboarding cannot reference a brand from another organization'
);

select * from finish();
rollback;