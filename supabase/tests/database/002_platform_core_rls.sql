begin;

select plan(12);

-- Fixtures are created by the postgres test session and rolled back at the end.
-- This keeps the suite independent from the users present in Supabase Dev.

insert into auth.users (id, aud, role, email, encrypted_password, email_confirmed_at)
values
  ('00000000-0000-4000-8000-000000000001', 'authenticated', 'authenticated', 'platform-core-a@example.test', '', now()),
  ('00000000-0000-4000-8000-000000000002', 'authenticated', 'authenticated', 'platform-core-b@example.test', '', now());

insert into public.organizations (id, name, slug)
values
  ('00000000-0000-4000-9000-000000000001', 'Platform Core A', 'platform-core-a'),
  ('00000000-0000-4000-9000-000000000002', 'Platform Core B', 'platform-core-b');

insert into public.organization_memberships (organization_id, user_id, role)
values
  ('00000000-0000-4000-9000-000000000001', '00000000-0000-4000-8000-000000000001', 'owner'),
  ('00000000-0000-4000-9000-000000000002', '00000000-0000-4000-8000-000000000002', 'viewer');

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

select * from finish();
rollback;
