begin;

select plan(7);

insert into auth.users (id, aud, role, email, encrypted_password, email_confirmed_at)
values
  ('00000000-0000-4000-8200-000000000001', 'authenticated', 'authenticated', 'content-owner@example.test', '', now()),
  ('00000000-0000-4000-8200-000000000002', 'authenticated', 'authenticated', 'content-viewer@example.test', '', now());

insert into public.organizations (id, name, slug)
values
  ('00000000-0000-4000-9200-000000000001', 'Content RLS A', 'content-rls-a'),
  ('00000000-0000-4000-9200-000000000002', 'Content RLS B', 'content-rls-b');

insert into public.organization_memberships (organization_id, user_id, role)
values
  ('00000000-0000-4000-9200-000000000001', '00000000-0000-4000-8200-000000000001', 'owner'),
  ('00000000-0000-4000-9200-000000000002', '00000000-0000-4000-8200-000000000002', 'viewer');

insert into public.brands (id, organization_id, name)
values
  ('00000000-0000-4000-9300-000000000001', '00000000-0000-4000-9200-000000000001', 'Content Brand A'),
  ('00000000-0000-4000-9300-000000000002', '00000000-0000-4000-9200-000000000002', 'Content Brand B');

insert into public.brand_context_versions (organization_id, brand_id, version_number, status, snapshot)
values ('00000000-0000-4000-9200-000000000001', '00000000-0000-4000-9300-000000000001', 1, 'published', '{}'::jsonb);

insert into public.content_briefs (organization_id, brand_id, name, objective)
values ('00000000-0000-4000-9200-000000000001', '00000000-0000-4000-9300-000000000001', 'Brief A', 'Test content isolation');

select set_config('request.jwt.claim.sub', '00000000-0000-4000-8200-000000000001', true);
set local role authenticated;

select is((select count(*)::integer from public.content_briefs), 1, 'content owner can read briefs in own organization');
select lives_ok($$ insert into public.content_items (organization_id, brand_id, title, type) values ('00000000-0000-4000-9200-000000000001', '00000000-0000-4000-9300-000000000001', 'Item A', 'social_post') $$, 'content owner can create an item in own organization');
select lives_ok($$ insert into public.content_generation_jobs (organization_id, brand_id, provider, model, status, input_hash) values ('00000000-0000-4000-9200-000000000001', '00000000-0000-4000-9300-000000000001', 'pending', 'none', 'queued', 'content-input-a') $$, 'content owner can create a generation job in own organization');

select set_config('request.jwt.claim.sub', '00000000-0000-4000-8200-000000000002', true);
select is((select count(*)::integer from public.content_briefs), 0, 'content viewer cannot read briefs from another organization');
select is((select count(*)::integer from public.content_items), 0, 'content viewer cannot read items from another organization');
select is((select count(*)::integer from public.content_generation_jobs), 0, 'content viewer cannot read generation jobs from another organization');
select throws_ok($$ insert into public.content_briefs (organization_id, brand_id, name, objective) values ('00000000-0000-4000-9200-000000000001', '00000000-0000-4000-9300-000000000001', 'Cross tenant', 'Denied') $$, 'new row violates row-level security policy for table "content_briefs"', 'content viewer cannot create a brief across organizations');

select * from finish();
rollback;
