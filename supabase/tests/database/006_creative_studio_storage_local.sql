-- Reproducible local fallback for the Creative Studio Storage/RLS pgTAP suite.
-- Run with: docker exec -i supabase_db_loopdev psql -U postgres -d postgres -v ON_ERROR_STOP=1
begin;

insert into auth.users (id, aud, role, email, encrypted_password, email_confirmed_at)
values
  ('00000000-0000-4a00-8400-000000000001', 'authenticated', 'authenticated', 'creative-local-owner@example.test', '', now()),
  ('00000000-0000-4a00-8400-000000000002', 'authenticated', 'authenticated', 'creative-local-viewer@example.test', '', now());

insert into public.organizations (id, name, slug)
values
  ('00000000-0000-4a00-9500-000000000001', 'Creative Local A', 'creative-local-a'),
  ('00000000-0000-4a00-9500-000000000002', 'Creative Local B', 'creative-local-b');

insert into public.organization_memberships (organization_id, user_id, role)
values
  ('00000000-0000-4a00-9500-000000000001', '00000000-0000-4a00-8400-000000000001', 'owner'),
  ('00000000-0000-4a00-9500-000000000002', '00000000-0000-4a00-8400-000000000002', 'viewer');

insert into public.brands (id, organization_id, name)
values
  ('00000000-0000-4a00-9700-000000000001', '00000000-0000-4a00-9500-000000000001', 'Creative Local Brand A'),
  ('00000000-0000-4a00-9700-000000000002', '00000000-0000-4a00-9500-000000000002', 'Creative Local Brand B');

insert into public.workspaces (id, organization_id, suite_key, name, slug)
values
  ('00000000-0000-4a00-9800-000000000001', '00000000-0000-4a00-9500-000000000001', 'marketing', 'Creative Local Workspace A', 'creative-local-workspace-a'),
  ('00000000-0000-4a00-9800-000000000002', '00000000-0000-4a00-9500-000000000002', 'marketing', 'Creative Local Workspace B', 'creative-local-workspace-b');

do $$
begin
  if (select "public" from storage.buckets where id = 'marketing-creative') is distinct from false then
    raise exception 'Creative Storage bucket should remain private';
  end if;
end
$$;

select set_config('request.jwt.claim.sub', '00000000-0000-4a00-8400-000000000001', true);
set local role authenticated;

insert into public.marketing_creative_projects (
  id, organization_id, brand_id, workspace_id, name, type, created_by, updated_by
)
values (
  '00000000-0000-4a00-9900-000000000001',
  '00000000-0000-4a00-9500-000000000001',
  '00000000-0000-4a00-9700-000000000001',
  '00000000-0000-4a00-9800-000000000001',
  'Creative local project',
  'social_post',
  '00000000-0000-4a00-8400-000000000001',
  '00000000-0000-4a00-8400-000000000001'
);

do $$
declare
  failed boolean := false;
begin
  begin
    insert into public.marketing_creative_assets (
      organization_id, brand_id, workspace_id, project_id, kind, storage_path, mime_type, size_bytes, content_hash
    ) values (
      '00000000-0000-4a00-9500-000000000001',
      '00000000-0000-4a00-9700-000000000001',
      '00000000-0000-4a00-9800-000000000001',
      '00000000-0000-4a00-9900-000000000001',
      'source',
      'org/00000000-0000-4a00-9500-000000000001/workspace/00000000-0000-4a00-9800-000000000001/source/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa.png',
      'image/png',
      1024,
      repeat('a', 64)
    );
  exception when others then
    failed := true;
    raise;
  end;
  if failed then
    raise exception 'owner should create a source asset';
  end if;
end
$$;

do $$
begin
  if (select count(*) from public.marketing_creative_assets) <> 1 then
    raise exception 'owner should read one source asset';
  end if;
  if (select used_bytes from public.marketing_creative_storage_usage
      where organization_id = '00000000-0000-4a00-9500-000000000001'
        and workspace_id = '00000000-0000-4a00-9800-000000000001') <> 1024 then
    raise exception 'source asset usage should be accounted';
  end if;
end
$$;

insert into public.marketing_creative_assets (
  organization_id, brand_id, workspace_id, project_id, kind, source_asset_id, compressed,
  storage_path, mime_type, size_bytes, content_hash
)
values (
  '00000000-0000-4a00-9500-000000000001',
  '00000000-0000-4a00-9700-000000000001',
  '00000000-0000-4a00-9800-000000000001',
  '00000000-0000-4a00-9900-000000000001',
  'thumbnail',
  (select id from public.marketing_creative_assets limit 1),
  true,
  'org/00000000-0000-4a00-9500-000000000001/workspace/00000000-0000-4a00-9800-000000000001/thumbnail/bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb.png',
  'image/png',
  100,
  repeat('b', 64)
);

do $$
declare
  failed boolean := false;
begin
  begin
    update public.marketing_creative_projects
      set draft_document = '{"image":"data:image/png;base64,AAAA"}'::jsonb
      where id = '00000000-0000-4a00-9900-000000000001';
  exception when others then
    failed := true;
  end;
  if not failed then
    raise exception 'inline project data should be rejected';
  end if;
end
$$;

insert into storage.objects (bucket_id, name, owner, owner_id, metadata, version)
values (
  'marketing-creative',
  'org/00000000-0000-4a00-9500-000000000001/workspace/00000000-0000-4a00-9800-000000000001/source/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa.png',
  '00000000-0000-4a00-8400-000000000001',
  '00000000-0000-4a00-8400-000000000001',
  '{}'::jsonb,
  'local-test-source'
);

select set_config('request.jwt.claim.sub', '00000000-0000-4a00-8400-000000000002', true);

do $$
declare
  failed boolean := false;
begin
  if (select count(*) from public.marketing_creative_assets) <> 0 then
    raise exception 'viewer should not read another organization assets';
  end if;
  if (select count(*) from storage.objects) <> 0 then
    raise exception 'viewer should not read another organization Storage objects';
  end if;
  begin
    insert into public.marketing_creative_assets (
      organization_id, brand_id, workspace_id, kind, storage_path, mime_type, size_bytes, content_hash
    ) values (
      '00000000-0000-4a00-9500-000000000001',
      '00000000-0000-4a00-9700-000000000001',
      '00000000-0000-4a00-9800-000000000001',
      'source',
      'org/00000000-0000-4a00-9500-000000000001/workspace/00000000-0000-4a00-9800-000000000001/source/cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc.png',
      'image/png',
      1024,
      repeat('c', 64)
    );
  exception when others then
    failed := true;
  end;
  if not failed then
    raise exception 'viewer should not create assets';
  end if;
  failed := false;
  begin
    delete from public.marketing_creative_assets;
  exception when others then
    failed := true;
  end;
  if not failed then
    raise exception 'viewer should not delete assets';
  end if;
end
$$;

rollback;
