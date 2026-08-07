begin;

select plan(36);

-- Fixtures are created by the postgres test session and rolled back at the end.
-- This keeps the suite independent from the users present in Supabase Dev.

insert into auth.users (id, aud, role, email, encrypted_password, email_confirmed_at)
values
  ('00000000-0000-4000-8000-000000000001', 'authenticated', 'authenticated', 'platform-core-a@example.test', '', now()),
  ('00000000-0000-4000-8000-000000000002', 'authenticated', 'authenticated', 'platform-core-b@example.test', '', now()),
  ('00000000-0000-4000-8000-000000000003', 'authenticated', 'authenticated', 'platform-core-admin@example.test', '', now()),
  ('00000000-0000-4000-8000-000000000004', 'authenticated', 'authenticated', 'platform-core-agent@example.test', '', now()),
  ('00000000-0000-4000-8000-000000000005', 'authenticated', 'authenticated', 'platform-core-external@example.test', '', now()),
  ('00000000-0000-4000-8000-000000000006', 'authenticated', 'authenticated', 'platform-core-platform-owner@example.test', '', now());

insert into public.platform_administrators (user_id, role)
values ('00000000-0000-4000-8000-000000000006', 'owner');

insert into public.organizations (id, name, slug)
values
  ('00000000-0000-4000-9000-000000000001', 'Platform Core A', 'platform-core-a'),
  ('00000000-0000-4000-9000-000000000002', 'Platform Core B', 'platform-core-b');

insert into public.organization_memberships (organization_id, user_id, role)
values
  ('00000000-0000-4000-9000-000000000001', '00000000-0000-4000-8000-000000000001', 'owner'),
  ('00000000-0000-4000-9000-000000000002', '00000000-0000-4000-8000-000000000002', 'viewer'),
  ('00000000-0000-4000-9000-000000000001', '00000000-0000-4000-8000-000000000003', 'admin'),
  ('00000000-0000-4000-9000-000000000001', '00000000-0000-4000-8000-000000000004', 'agent');

insert into public.brands (id, tenant_id, organization_id, name)
values
  ('00000000-0000-4000-9000-000000000011', '00000000-0000-4000-9000-000000000001', '00000000-0000-4000-9000-000000000001', 'Brand A'),
  ('00000000-0000-4000-9000-000000000012', '00000000-0000-4000-9000-000000000002', '00000000-0000-4000-9000-000000000002', 'Brand B');

select set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);
set local role authenticated;

select ok(
  exists (select 1 from public.organizations where id = '00000000-0000-4000-9000-000000000001'),
  'a member can see their organization'
);
select ok(
  not exists (select 1 from public.organizations where id = '00000000-0000-4000-9000-000000000002'),
  'a member cannot see another organization'
);
select ok(
  exists (select 1 from public.organization_memberships where organization_id = '00000000-0000-4000-9000-000000000001'),
  'a member can see their membership'
);
select ok(
  not exists (select 1 from public.organization_memberships where organization_id = '00000000-0000-4000-9000-000000000002'),
  'a member cannot see another organization membership'
);
select ok(
  public.is_organization_member('00000000-0000-4000-9000-000000000001'),
  'membership helper grants access to the current organization'
);
select ok(
  not public.is_organization_member('00000000-0000-4000-9000-000000000002'),
  'membership helper denies access to another organization'
);
select ok(
  public.has_organization_role('00000000-0000-4000-9000-000000000001', array['owner']),
  'role helper grants the owner role'
);
select ok(
  not public.has_organization_role('00000000-0000-4000-9000-000000000001', array['viewer']),
  'role helper denies an unassigned role'
);

select set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000002', true);

select ok(
  exists (select 1 from public.organizations where id = '00000000-0000-4000-9000-000000000002'),
  'the second member can see only their organization'
);
select ok(
  not exists (select 1 from public.organizations where id = '00000000-0000-4000-9000-000000000001'),
  'the second member cannot see the first organization'
);
select ok(
  public.has_organization_role('00000000-0000-4000-9000-000000000002', array['viewer']),
  'viewer membership is recognized by the role helper'
);
select ok(
  not public.has_organization_role('00000000-0000-4000-9000-000000000002', array['admin', 'owner']),
  'viewer cannot exercise admin or owner permissions'
);

select set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000003', true);
select ok(
  public.has_organization_role('00000000-0000-4000-9000-000000000001', array['admin']),
  'admin membership is recognized by the role helper'
);
select ok(
  not public.has_organization_role('00000000-0000-4000-9000-000000000001', array['owner']),
  'admin cannot exercise owner-only permissions'
);

select set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000004', true);
select ok(
  public.has_organization_role('00000000-0000-4000-9000-000000000001', array['agent']),
  'agent membership is recognized by the role helper'
);
select ok(
  not public.has_organization_role('00000000-0000-4000-9000-000000000001', array['admin', 'owner']),
  'agent cannot exercise admin or owner permissions'
);

select set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000005', true);
select ok(
  not exists (select 1 from public.organizations),
  'an authenticated user without membership cannot see organizations'
);
select ok(
  not public.is_organization_member('00000000-0000-4000-9000-000000000001'),
  'an authenticated user without membership is denied by the helper'
);

select set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);
select ok(
  public.has_organization_permission('00000000-0000-4000-9000-000000000001', 'crm.manage'),
  'owner receives the CRM management permission'
);
select ok(
  exists (select 1 from public.permissions where key = 'communications.send'),
  'the permission catalog contains communication capabilities'
);

select set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000002', true);
select ok(
  public.has_organization_permission('00000000-0000-4000-9000-000000000002', 'crm.read'),
  'viewer receives read-only CRM access'
);
select ok(
  not public.has_organization_permission('00000000-0000-4000-9000-000000000002', 'crm.manage'),
  'viewer is denied CRM management access'
);

select set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000003', true);
select ok(
  public.has_organization_permission('00000000-0000-4000-9000-000000000001', 'members.manage'),
  'admin receives membership management access'
);

select set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000004', true);
select ok(
  not public.has_organization_permission('00000000-0000-4000-9000-000000000001', 'members.manage'),
  'agent is denied membership management access'
);

select set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);
select ok(
  exists (select 1 from public.brands where id = '00000000-0000-4000-9000-000000000011'),
  'an owner can view a brand in their organization'
);
select ok(
  not exists (select 1 from public.brands where id = '00000000-0000-4000-9000-000000000012'),
  'an owner cannot view a brand in another organization'
);
select lives_ok(
  $$ update public.brands set name = 'Brand A updated' where id = '00000000-0000-4000-9000-000000000011' $$,
  'an owner can update a brand in their organization'
);

select set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000002', true);
select ok(
  exists (select 1 from public.brands where id = '00000000-0000-4000-9000-000000000012'),
  'a viewer can view a brand in their organization'
);
select lives_ok(
  $$ update public.brands set name = 'Viewer must not update' where id = '00000000-0000-4000-9000-000000000012' $$,
  'a viewer cannot update a brand'
);
select is(
  (select name from public.brands where id = '00000000-0000-4000-9000-000000000012'),
  'Brand B',
  'a viewer update is filtered by RLS'
);

select set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000005', true);
select ok(
  not exists (select 1 from public.brands),
  'a user without membership cannot view brands'
);

select set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000006', true);
select ok(
  public.is_platform_administrator(),
  'a LoopDev platform owner is recognized outside organization memberships'
);
select ok(
  exists (select 1 from public.organizations where id = '00000000-0000-4000-9000-000000000002'),
  'a platform owner can view every organization'
);
select ok(
  exists (select 1 from public.organization_memberships where organization_id = '00000000-0000-4000-9000-000000000002'),
  'a platform owner can view memberships in every organization'
);
select ok(
  exists (select 1 from public.brands where id = '00000000-0000-4000-9000-000000000012'),
  'a platform owner can view brands in every organization'
);
select lives_ok(
  $$ update public.brands set name = 'Brand B platform updated' where id = '00000000-0000-4000-9000-000000000012' $$,
  'a platform owner can manage a brand in any organization'
);

select * from finish();
rollback;
