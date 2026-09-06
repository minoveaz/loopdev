begin;

select plan(8);

insert into auth.users (id, aud, role, email, encrypted_password, email_confirmed_at)
values
  ('00000000-0000-4b00-8400-000000000001', 'authenticated', 'authenticated', 'document-storage-owner@example.test', '', now()),
  ('00000000-0000-4b00-8400-000000000002', 'authenticated', 'authenticated', 'document-storage-viewer@example.test', '', now());

insert into public.organizations (id, name, slug)
values
  ('00000000-0000-4b00-9500-000000000001', 'Document Storage A', 'document-storage-a'),
  ('00000000-0000-4b00-9500-000000000002', 'Document Storage B', 'document-storage-b');

insert into public.organization_memberships (organization_id, user_id, role)
values
  ('00000000-0000-4b00-9500-000000000001', '00000000-0000-4b00-8400-000000000001', 'owner'),
  ('00000000-0000-4b00-9500-000000000002', '00000000-0000-4b00-8400-000000000002', 'viewer');

select is(
  (select public from storage.buckets where id = 'document-intelligence-temp'),
  false,
  'document intelligence bucket remains private'
);

select is(
  (select count(*)::integer
   from pg_policies
   where schemaname = 'storage'
     and tablename = 'objects'
     and policyname = 'document intelligence members can upload own objects'),
  1,
  'document upload policy is installed'
);

select is(
  (select count(*)::integer
   from pg_policies
   where schemaname = 'storage'
     and tablename = 'objects'
     and policyname = 'document intelligence members can read own objects'),
  1,
  'document read policy is installed'
);

select is(
  (select count(*)::integer
   from pg_policies
   where schemaname = 'storage'
     and tablename = 'objects'
     and policyname = 'document intelligence members can delete own objects'),
  1,
  'document delete policy is installed'
);

select set_config('request.jwt.claim.sub', '00000000-0000-4b00-8400-000000000001', true);
set local role authenticated;

select lives_ok($$
  insert into storage.objects (bucket_id, name, owner, owner_id, metadata, version)
  values (
    'document-intelligence-temp',
    'organizations/00000000-0000-4b00-9500-000000000001/00000000-0000-4b00-8400-000000000001/00000000-0000-4b00-8600-000000000001.png',
    '00000000-0000-4b00-8400-000000000001',
    '00000000-0000-4b00-8400-000000000001',
    '{}'::jsonb,
    'document-intelligence-local-test'
  )
$$, 'organization member can upload an own document object');

select is(
  (select count(*)::integer from storage.objects),
  1,
  'document owner can read the uploaded object'
);

select set_config('request.jwt.claim.sub', '00000000-0000-4b00-8400-000000000002', true);

select is(
  (select count(*)::integer from storage.objects),
  0,
  'member of another organization cannot read the document object'
);

select throws_ok($$
  insert into storage.objects (bucket_id, name, owner, owner_id, metadata, version)
  values (
    'document-intelligence-temp',
    'organizations/00000000-0000-4b00-9500-000000000001/00000000-0000-4b00-8400-000000000002/00000000-0000-4b00-8600-000000000002.png',
    '00000000-0000-4b00-8400-000000000002',
    '00000000-0000-4b00-8400-000000000002',
    '{}'::jsonb,
    'document-intelligence-cross-org-test'
  )
$$, 'new row violates row-level security policy for table "objects"', 'cross-organization document upload is rejected');

select * from finish();
rollback;
