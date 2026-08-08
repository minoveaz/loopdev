begin;

select plan(14);

insert into auth.users (id, aud, role, email, encrypted_password, email_confirmed_at)
values
  ('00000000-0000-4000-8100-000000000001', 'authenticated', 'authenticated', 'marketing-owner@example.test', '', now()),
  ('00000000-0000-4000-8100-000000000002', 'authenticated', 'authenticated', 'marketing-viewer@example.test', '', now()),
  ('00000000-0000-4000-8100-000000000003', 'authenticated', 'authenticated', 'marketing-external@example.test', '', now());

insert into public.organizations (id, name, slug)
values
  ('00000000-0000-4000-9100-000000000001', 'Marketing RLS A', 'marketing-rls-a'),
  ('00000000-0000-4000-9100-000000000002', 'Marketing RLS B', 'marketing-rls-b');

insert into public.organization_memberships (organization_id, user_id, role)
values
  ('00000000-0000-4000-9100-000000000001', '00000000-0000-4000-8100-000000000001', 'owner'),
  ('00000000-0000-4000-9100-000000000002', '00000000-0000-4000-8100-000000000002', 'viewer');

insert into public.brands (id, organization_id, name)
values
  ('00000000-0000-4000-9200-000000000001', '00000000-0000-4000-9100-000000000001', 'Marketing Brand A'),
  ('00000000-0000-4000-9200-000000000002', '00000000-0000-4000-9100-000000000002', 'Marketing Brand B');

insert into public.workspaces (id, organization_id, suite_key, name, slug)
values
  ('00000000-0000-4000-9300-000000000001', '00000000-0000-4000-9100-000000000001', 'marketing', 'Marketing Workspace A', 'marketing-workspace-a'),
  ('00000000-0000-4000-9300-000000000002', '00000000-0000-4000-9100-000000000002', 'marketing', 'Marketing Workspace B', 'marketing-workspace-b');

insert into public.workspace_brands (workspace_id, organization_id, brand_id)
values
  ('00000000-0000-4000-9300-000000000001', '00000000-0000-4000-9100-000000000001', '00000000-0000-4000-9200-000000000001'),
  ('00000000-0000-4000-9300-000000000002', '00000000-0000-4000-9100-000000000002', '00000000-0000-4000-9200-000000000002');

insert into public.marketing_campaigns (id, name, objective, organization_id, brand_id, workspace_id)
values ('marketing-legacy-a', 'Legacy campaign A', 'RLS fixture', '00000000-0000-4000-9100-000000000001', '00000000-0000-4000-9200-000000000001', '00000000-0000-4000-9300-000000000001');

insert into public.marketing_campaign_records (id, legacy_id, organization_id, brand_id, workspace_id, name, objective, created_by, updated_by)
values ('00000000-0000-4000-9400-000000000001', 'marketing-legacy-a', '00000000-0000-4000-9100-000000000001', '00000000-0000-4000-9200-000000000001', '00000000-0000-4000-9300-000000000001', 'Campaign A', 'RLS fixture', '00000000-0000-4000-8100-000000000001', '00000000-0000-4000-8100-000000000001');

insert into public.marketing_links (id, name, slug, campaign_id, phone, message, organization_id, brand_id, workspace_id, canonical_campaign_id)
values ('marketing-link-a', 'Campaign link A', 'campaign-link-a', 'marketing-legacy-a', '34600000000', 'Hello', '00000000-0000-4000-9100-000000000001', '00000000-0000-4000-9200-000000000001', '00000000-0000-4000-9300-000000000001', '00000000-0000-4000-9400-000000000001');

insert into public.marketing_link_clicks (link_id, organization_id, brand_id, workspace_id)
values ('marketing-link-a', '00000000-0000-4000-9100-000000000001', '00000000-0000-4000-9200-000000000001', '00000000-0000-4000-9300-000000000001');

insert into public.marketing_campaign_publications (campaign_id, platform, publication_url, organization_id, brand_id, workspace_id, canonical_campaign_id)
values ('marketing-legacy-a', 'instagram', 'https://example.test/publication-a', '00000000-0000-4000-9100-000000000001', '00000000-0000-4000-9200-000000000001', '00000000-0000-4000-9300-000000000001', '00000000-0000-4000-9400-000000000001');

select set_config('request.jwt.claim.sub', '00000000-0000-4000-8100-000000000001', true);
set local role authenticated;

select is((select count(*)::integer from public.marketing_campaign_records), 1, 'owner can read campaigns in own organization');
select is((select count(*)::integer from public.marketing_links), 1, 'owner can read links in own organization');
select is((select count(*)::integer from public.marketing_link_clicks), 1, 'owner can read clicks in own organization');
select is((select count(*)::integer from public.marketing_campaign_publications), 1, 'owner can read publications in own organization');
select lives_ok($$ insert into public.marketing_campaign_records (organization_id, brand_id, workspace_id, name, objective, created_by, updated_by) values ('00000000-0000-4000-9100-000000000001', '00000000-0000-4000-9200-000000000001', '00000000-0000-4000-9300-000000000001', 'Created by owner', 'RLS fixture', '00000000-0000-4000-8100-000000000001', '00000000-0000-4000-8100-000000000001') $$, 'owner can create campaign in own organization');
 select throws_ok(
   $$ insert into public.marketing_campaign_records (organization_id, brand_id, workspace_id, name, objective, created_by, updated_by)
      values ('00000000-0000-4000-9100-000000000002', '00000000-0000-4000-9200-000000000002', '00000000-0000-4000-9300-000000000002', 'Cross tenant', 'RLS fixture', '00000000-0000-4000-8100-000000000001', '00000000-0000-4000-8100-000000000001') $$,
   '42501: new row violates row-level security policy for table "marketing_campaign_records"',
   'owner cannot create campaign in another organization'
 );

select set_config('request.jwt.claim.sub', '00000000-0000-4000-8100-000000000002', true);
select is((select count(*)::integer from public.marketing_campaign_records), 0, 'viewer cannot read another organization campaigns');
select is((select count(*)::integer from public.marketing_links), 0, 'viewer cannot read another organization links');
select is((select count(*)::integer from public.marketing_link_clicks), 0, 'viewer cannot read another organization clicks');
select is((select count(*)::integer from public.marketing_campaign_publications), 0, 'viewer cannot read another organization publications');
 select throws_ok(
   $$ insert into public.marketing_campaign_records (organization_id, brand_id, workspace_id, name, objective, created_by, updated_by)
      values ('00000000-0000-4000-8100-000000000001', '00000000-0000-4000-9200-000000000001', '00000000-0000-4000-9300-000000000001', 'Viewer cross tenant', 'RLS fixture', '00000000-0000-4000-8100-000000000002', '00000000-0000-4000-8100-000000000002') $$,
   '42501: new row violates row-level security policy for table "marketing_campaign_records"',
   'viewer cannot create campaign'
 );

select set_config('request.jwt.claim.sub', '00000000-0000-4000-8100-000000000003', true);
select is((select count(*)::integer from public.marketing_campaign_records), 0, 'user without membership cannot read campaigns');
select is((select count(*)::integer from public.marketing_links), 0, 'user without membership cannot read links');
select is((select count(*)::integer from public.marketing_campaign_publications), 0, 'user without membership cannot read publications');
select * from finish();
rollback;
