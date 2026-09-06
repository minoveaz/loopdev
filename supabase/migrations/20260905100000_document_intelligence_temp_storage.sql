-- Document Intelligence uses short-lived private objects only while an
-- extraction request is being processed. Organization and actor identifiers
-- are encoded in the path so Storage RLS can enforce the same boundary.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'document-intelligence-temp',
  'document-intelligence-temp',
  false,
  10485760,
  array['image/jpeg', 'image/png', 'application/pdf']::text[]
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "document intelligence members can upload own objects"
  on storage.objects;
drop policy if exists "document intelligence members can read own objects"
  on storage.objects;
drop policy if exists "document intelligence members can delete own objects"
  on storage.objects;

create policy "document intelligence members can upload own objects"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'document-intelligence-temp'
  and name ~ '^organizations/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(jpg|jpeg|png|pdf)$'
  and split_part(name, '/', 3)::uuid = auth.uid()
  and public.is_organization_member(split_part(name, '/', 2)::uuid)
);

create policy "document intelligence members can read own objects"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'document-intelligence-temp'
  and name ~ '^organizations/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(jpg|jpeg|png|pdf)$'
  and split_part(name, '/', 3)::uuid = auth.uid()
  and public.is_organization_member(split_part(name, '/', 2)::uuid)
);

create policy "document intelligence members can delete own objects"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'document-intelligence-temp'
  and name ~ '^organizations/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(jpg|jpeg|png|pdf)$'
  and split_part(name, '/', 3)::uuid = auth.uid()
  and public.is_organization_member(split_part(name, '/', 2)::uuid)
);
