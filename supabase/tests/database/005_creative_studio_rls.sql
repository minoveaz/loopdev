begin;

select plan(10);

insert into auth.users (id, aud, role, email, encrypted_password, email_confirmed_at)
values
  ('00000000-0000-4000-8300-000000000001', 'authenticated', 'authenticated', 'creative-owner@example.test', '', now()),
  ('00000000-0000-4000-8300-000000000002', 'authenticated', 'authenticated', 'creative-viewer@example.test', '', now());

insert into public.organizations (id, name, slug)
values
  ('00000000-0000-4000-9600-000000000001', 'Creative RLS A', 'creative-rls-a'),
  ('00000000-0000-4000-9600-000000000002', 'Creative RLS B', 'creative-rls-b');

insert into public.organization_memberships (organization_id, user_id, role)
values
  ('00000000-0000-4000-9600-000000000001', '00000000-0000-4000-8300-000000000001', 'owner'),
  ('00000000-0000-4000-9600-000000000002', '00000000-0000-4000-8300-000000000002', 'viewer');

insert into public.brands (id, organization_id, name)
values
  ('00000000-0000-4000-9700-000000000001', '00000000-0000-4000-9600-000000000001', 'Creative Brand A'),
  ('00000000-0000-4000-9700-000000000002', '00000000-0000-4000-9600-000000000002', 'Creative Brand B');

insert into public.workspaces (id, organization_id, suite_key, name, slug)
values
  ('00000000-0000-4000-9800-000000000001', '00000000-0000-4000-9600-000000000001', 'marketing', 'Creative Workspace A', 'creative-workspace-a'),
  ('00000000-0000-4000-9800-000000000002', '00000000-0000-4000-9600-000000000002', 'marketing', 'Creative Workspace B', 'creative-workspace-b');

select set_config('request.jwt.claim.sub', '00000000-0000-4000-8300-000000000001', true);
set local role authenticated;

insert into public.marketing_creative_projects (
  id, organization_id, brand_id, workspace_id, name, type, created_by, updated_by
)
values (
  '00000000-0000-4000-9900-000000000001',
  '00000000-0000-4000-9600-000000000001',
  '00000000-0000-4000-9700-000000000001',
  '00000000-0000-4000-9800-000000000001',
  'Creative project A',
  'social_post',
  '00000000-0000-4000-8300-000000000001',
  '00000000-0000-4000-8300-000000000001'
);

select is((select count(*)::integer from public.marketing_creative_projects), 1, 'creative owner reads projects in own organization');
select lives_ok($$ insert into public.marketing_creative_project_versions (
  organization_id, brand_id, workspace_id, project_id, version_number, document, created_by, updated_by
) values (
  '00000000-0000-4000-9600-000000000001',
  '00000000-0000-4000-9700-000000000001',
  '00000000-0000-4000-9800-000000000001',
  '00000000-0000-4000-9900-000000000001',
  1,
  '{"layers":[]}'::jsonb,
  '00000000-0000-4000-8300-000000000001',
  '00000000-0000-4000-8300-000000000001'
) $$, 'creative owner appends a project version');
select lives_ok($$ insert into public.marketing_creative_variants (
  organization_id, brand_id, workspace_id, project_id, project_version_id, key, channel, format, width, height, created_by, updated_by
) values (
  '00000000-0000-4000-9600-000000000001',
  '00000000-0000-4000-9700-000000000001',
  '00000000-0000-4000-9800-000000000001',
  '00000000-0000-4000-9900-000000000001',
  (select id from public.marketing_creative_project_versions where project_id = '00000000-0000-4000-9900-000000000001' and version_number = 1),
  'instagram-square',
  'instagram',
  'square',
  1080,
  1080,
  '00000000-0000-4000-8300-000000000001',
  '00000000-0000-4000-8300-000000000001'
) $$, 'creative owner appends a project variant');
select lives_ok($$ update public.marketing_creative_projects set name = 'Creative project A updated' where id = '00000000-0000-4000-9900-000000000001' $$, 'creative owner updates project metadata');
select is((select count(*)::integer from public.marketing_creative_project_versions), 1, 'creative owner reads project versions in own organization');
select is((select count(*)::integer from public.marketing_creative_variants), 1, 'creative owner reads project variants in own organization');

select set_config('request.jwt.claim.sub', '00000000-0000-4000-8300-000000000002', true);
select is((select count(*)::integer from public.marketing_creative_projects), 0, 'viewer cannot read another organization projects');
select throws_ok($$ insert into public.marketing_creative_projects (
  organization_id, brand_id, workspace_id, name
) values (
  '00000000-0000-4000-9600-000000000001',
  '00000000-0000-4000-9700-000000000001',
  '00000000-0000-4000-9800-000000000001',
  'Cross tenant project'
) $$, 'new row violates row-level security policy for table "marketing_creative_projects"', 'creative viewer cannot create a project in another organization');
select throws_ok($$ insert into public.marketing_creative_project_versions (
  organization_id, brand_id, workspace_id, project_id, version_number
) values (
  '00000000-0000-4000-9600-000000000001',
  '00000000-0000-4000-9700-000000000001',
  '00000000-0000-4000-9800-000000000001',
  '00000000-0000-4000-9900-000000000001',
  2
) $$, 'new row violates row-level security policy for table "marketing_creative_project_versions"', 'creative viewer cannot append a project version');
select throws_ok($$ delete from public.marketing_creative_project_versions $$, 'permission denied for table marketing_creative_project_versions', 'creative project versions remain append-only');

select * from finish();
rollback;
