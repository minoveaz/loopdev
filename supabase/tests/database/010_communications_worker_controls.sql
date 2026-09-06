begin;

\ir helpers/rls_helpers.sql

select plan(15);

insert into auth.users (id, aud, role, email, encrypted_password, email_confirmed_at)
values
  ('00000000-0000-4000-8d00-000000000001', 'authenticated', 'authenticated', 'communications-control-admin@example.test', '', now()),
  ('00000000-0000-4000-8d00-000000000002', 'authenticated', 'authenticated', 'communications-control-viewer@example.test', '', now());

insert into public.organizations (id, name, slug)
values
  ('00000000-0000-4000-ad00-000000000001', 'Communications Controls A', 'communications-controls-a'),
  ('00000000-0000-4000-ad00-000000000002', 'Communications Controls B', 'communications-controls-b');

insert into public.organization_memberships (organization_id, user_id, role)
values
  ('00000000-0000-4000-ad00-000000000001', '00000000-0000-4000-8d00-000000000001', 'admin'),
  ('00000000-0000-4000-ad00-000000000002', '00000000-0000-4000-8d00-000000000002', 'viewer');

insert into public.communication_organization_controls (organization_id, outbound_enabled)
values
  ('00000000-0000-4000-ad00-000000000001', true),
  ('00000000-0000-4000-ad00-000000000002', true);

select ok(exists (select 1 from pg_extension where extname = 'pgmq'), 'pgmq extension is enabled');
select ok(to_regclass('pgmq.q_communications_core') is not null, 'communications_core pgmq queue exists');
select ok(pg_temp.has_policy_for('communication_organization_controls', 'select'), 'organization controls expose a SELECT policy');
select ok(pg_temp.has_policy_for('communication_organization_controls', 'insert'), 'organization controls expose an INSERT policy');
select ok(pg_temp.has_policy_for('communication_organization_controls', 'update'), 'organization controls expose an UPDATE policy');
select ok(not pg_temp.has_policy_for('communication_organization_controls', 'delete'), 'organization controls have no DELETE policy');
select ok(pg_temp.has_policy_for('communication_retention_runs', 'select'), 'retention runs expose a SELECT policy');
select ok(not pg_temp.has_policy_for('communication_retention_runs', 'insert'), 'retention runs have no browser INSERT policy');

set local role authenticated;
select pg_temp.set_authenticated_user('00000000-0000-4000-8d00-000000000001');
select lives_ok(
  $$ update public.communication_organization_controls set outbound_enabled = false where organization_id = '00000000-0000-4000-ad00-000000000001' $$,
  'admin can pause outbound for own organization'
);
select lives_ok(
  $$ update public.communication_organization_controls set outbound_enabled = false where organization_id = '00000000-0000-4000-ad00-000000000002' $$,
  'cross-organization update is filtered by RLS'
);
select is((select count(*)::integer from public.communication_organization_controls), 1, 'admin reads controls from own organization only');

reset role;
select is((select outbound_enabled from public.communication_organization_controls where organization_id = '00000000-0000-4000-ad00-000000000002'), true, 'cross-organization control remains unchanged');

set local role authenticated;
select pg_temp.set_authenticated_user('00000000-0000-4000-8d00-000000000002');
select lives_ok(
  $$ update public.communication_organization_controls set outbound_enabled = false where organization_id = '00000000-0000-4000-ad00-000000000002' $$,
  'viewer update is filtered by RLS'
);
select is(
  (select outbound_enabled from public.communication_organization_controls where organization_id = '00000000-0000-4000-ad00-000000000002'),
  true,
  'viewer cannot change own organization control'
);
select is((select count(*)::integer from public.communication_organization_controls), 1, 'viewer reads controls from own organization only');

select * from finish();
rollback;