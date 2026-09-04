begin;

select plan(10);

insert into auth.users (id, aud, role, email, encrypted_password, email_confirmed_at)
values
  ('00000000-0000-4000-8400-000000000001', 'authenticated', 'authenticated', 'creative-storage-owner@example.test', '', now()),
  ('00000000-0000-4000-8400-000000000002', 'authenticated', 'authenticated', 'creative-storage-viewer@example.test', '', now());

insert into public.organizations (id, name, slug)
values
  ('00000000-0000-4000-9500-000000000001', 'Creative Storage A', 'creative-storage-a'),
  ('00000000-0000-4000-9500-000000000002', 'Creative Storage B', 'creative-storage-b');

insert into public.organization_memberships (organization_id, user_id, role)
values
  ('00000000-0000-4000-9500-000000000001', '00000000-0000-4000-8400-000000000001', 'owner'),
  ('00000000-0000-4000-9500-000000000002', '00000000-0000-4000-8400-000000000002', 'viewer');

insert into public.brands (id, organization_id, name)
values
  ('00000000-0000-4000-9700-000000000001', '00000000-0000-4000-9500-000000000001', 'Storage Brand A'),
  ('00000000-0000-4000-9700-000000000002', '00000000-0000-4000-9500-000000000002', 'Storage Brand B');

insert into public.workspaces (id, organization_id, suite_key, name, slug)
values
  ('00000000-0000-4000-9800-000000000001', '00000000-0000-4000-9500-000000000001', 'marketing', 'Storage Workspace A', 'storage-workspace-a'),
  ('00000000-0000-4000-9800-000000000002', '00000000-0000-4000-9500-000000000002', 'marketing', 'Storage Workspace B', 'storage-workspace-b');

insert into public.marketing_creative_projects (
  id, organization_id, brand_id, workspace_id, name, type
)
values (
  '00000000-0000-4000-9900-000000000001',
  '00000000-0000-4000-9500-000000000001',
  '00000000-0000-4000-9700-000000000001',
  '00000000-0000-4000-9800-000000000001',
  'Storage project',
  'social_post'
);

select set_config('request.jwt.claim.sub', '00000000-0000-4000-8400-000000000001', true);
set local role authenticated;

select lives_ok($$ insert into public.marketing_creative_assets (
  organization_id, brand_id, workspace_id, project_id, kind, storage_path, mime_type, size_bytes, content_hash
) values (
  '00000000-0000-4000-9500-000000000001',
  '00000000-0000-4000-9700-000000000001',
  '00000000-0000-4000-9800-000000000001',
  '00000000-0000-4000-9900-000000000001',
  'source',
  'org/00000000-0000-4000-9500-000000000001/workspace/00000000-0000-4000-9800-000000000001/source/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa.png',
  'image/png',
  1024,
  repeat('a', 64)
) $$, 'creative owner creates a source asset in the tenant storage scope');

select is((select count(*)::integer from public.marketing_creative_assets), 1, 'creative owner reads the source asset in the tenant');
select is((select used_bytes::integer from public.marketing_creative_storage_usage), 1024, 'creative storage usage accounts for the source asset bytes');
select lives_ok($$ insert into public.marketing_creative_assets (
  organization_id, brand_id, workspace_id, project_id, kind, source_asset_id, compressed, storage_path, mime_type, size_bytes, content_hash
) values (
  '00000000-0000-4000-9500-000000000001',
  '00000000-0000-4000-9700-000000000001',
  '00000000-0000-4000-9800-000000000001',
  '00000000-0000-4000-9900-000000000001',
  'thumbnail',
  (select id from public.marketing_creative_assets limit 1),
  true,
  'org/00000000-0000-4000-9500-000000000001/workspace/00000000-0000-4000-9800-000000000001/thumbnail/bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb.png',
  'image/png',
  100,
  repeat('b', 64)
) $$, 'creative owner creates a compressed thumbnail linked to the source asset');
select throws_ok($$ update public.marketing_creative_projects set draft_document = '{"image":"data:image/png;base64,AAAA"}'::jsonb $$,
  'Creative project drafts must use Storage references and remain within the project size limit',
  'creative project drafts reject inline data URLs');
select is((select count(*)::integer from public.marketing_creative_assets), 2, 'compressed thumbnail remains in the tenant asset set');
select is((select count(*)::integer from public.marketing_creative_assets where kind = 'source'), 1, 'source asset remains deduplicated after thumbnail creation');

select set_config('request.jwt.claim.sub', '00000000-0000-4000-8400-000000000002', true);
select is((select count(*)::integer from public.marketing_creative_assets), 0, 'creative viewer cannot read assets from another organization');
select throws_ok($$ insert into public.marketing_creative_assets (
  organization_id, brand_id, workspace_id, kind, storage_path, mime_type, size_bytes, content_hash
) values (
  '00000000-0000-4000-9500-000000000001',
  '00000000-0000-4000-9700-000000000001',
  '00000000-0000-4000-9800-000000000001',
  'source',
  'org/00000000-0000-4000-9500-000000000001/workspace/00000000-0000-4000-9800-000000000001/source/cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc.png',
  'image/png',
  1024,
  repeat('c', 64)
) $$, 'new row violates row-level security policy for table "marketing_creative_assets"', 'creative viewer cannot create assets in another organization');
select throws_ok($$ delete from public.marketing_creative_assets $$,
  'permission denied for table marketing_creative_assets',
  'creative viewer cannot delete tenant assets');

select * from finish();
rollback;
