-- Creative Studio asset persistence and bounded client storage.
-- Additive only: CRM tables and rows are not changed.

alter table public.marketing_creative_projects
  add column if not exists draft_document jsonb not null default '{}'::jsonb,
  add column if not exists autosave_revision integer not null default 0,
  add column if not exists autosaved_at timestamptz;

create table if not exists public.marketing_creative_assets (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  brand_id uuid not null,
  workspace_id uuid not null,
  project_id uuid,
  kind text not null,
  status text not null default 'active',
  storage_path text not null,
  mime_type text not null,
  size_bytes bigint not null,
  content_hash text not null,
  source_asset_id uuid,
  compressed boolean not null default false,
  width integer,
  height integer,
  expires_at timestamptz,
  orphaned_at timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, organization_id),
  foreign key (organization_id) references public.organizations(id) on delete restrict,
  foreign key (brand_id, organization_id) references public.brands(id, organization_id) on delete restrict,
  foreign key (workspace_id, organization_id) references public.workspaces(id, organization_id) on delete restrict,
  foreign key (project_id, organization_id) references public.marketing_creative_projects(id, organization_id) on delete set null,
  foreign key (source_asset_id, organization_id) references public.marketing_creative_assets(id, organization_id) on delete restrict,
  check (kind in ('source', 'export', 'thumbnail')),
  check (status in ('active', 'orphaned', 'expired')),
  check (size_bytes > 0 and size_bytes <= 26214400),
  check (content_hash ~ '^[0-9a-fA-F]{64}$'),
  check (storage_path !~* '^data:' and storage_path !~ '\.\.'),
  check (width is null or width > 0),
  check (height is null or height > 0),
  check (id is distinct from source_asset_id),
  check ((kind = 'thumbnail' and compressed and size_bytes <= 524288) or kind <> 'thumbnail'),
  check ((kind = 'export' and expires_at is not null) or (kind <> 'export' and expires_at is null))
);

alter table public.marketing_creative_variants
  add constraint marketing_creative_variants_id_organization_key unique (id, organization_id);

create unique index if not exists marketing_creative_assets_dedupe_idx
  on public.marketing_creative_assets(organization_id, workspace_id, kind, content_hash)
  where status <> 'expired';

create table if not exists public.marketing_creative_asset_references (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  brand_id uuid not null,
  workspace_id uuid not null,
  asset_id uuid not null,
  project_id uuid not null,
  project_version_id uuid,
  variant_id uuid,
  layer_id uuid,
  reference_type text not null,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (id, organization_id),
  foreign key (organization_id) references public.organizations(id) on delete restrict,
  foreign key (brand_id, organization_id) references public.brands(id, organization_id) on delete restrict,
  foreign key (workspace_id, organization_id) references public.workspaces(id, organization_id) on delete restrict,
  foreign key (asset_id, organization_id) references public.marketing_creative_assets(id, organization_id) on delete restrict,
  foreign key (project_id, organization_id) references public.marketing_creative_projects(id, organization_id) on delete cascade,
  foreign key (project_version_id, project_id, organization_id)
    references public.marketing_creative_project_versions(id, project_id, organization_id) on delete restrict,
  foreign key (variant_id, organization_id)
    references public.marketing_creative_variants(id, organization_id) on delete restrict,
  check (reference_type in ('layer', 'variant', 'thumbnail')),
  check (
    (reference_type = 'layer' and project_version_id is not null and layer_id is not null and variant_id is null)
    or (reference_type = 'variant' and variant_id is not null and layer_id is null)
    or (reference_type = 'thumbnail' and project_version_id is null and variant_id is null and layer_id is null)
  )
);

create unique index if not exists marketing_creative_asset_references_unique_idx
  on public.marketing_creative_asset_references(
    organization_id,
    asset_id,
    project_version_id,
    variant_id,
    layer_id,
    reference_type
  );

create table if not exists public.marketing_creative_storage_quotas (
  organization_id uuid not null,
  workspace_id uuid not null,
  quota_bytes bigint not null default 5368709120,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (organization_id, workspace_id),
  foreign key (organization_id) references public.organizations(id) on delete restrict,
  foreign key (workspace_id, organization_id) references public.workspaces(id, organization_id) on delete cascade,
  check (quota_bytes > 0)
);

create table if not exists public.marketing_creative_storage_usage (
  organization_id uuid not null,
  workspace_id uuid not null,
  used_bytes bigint not null default 0,
  asset_count integer not null default 0,
  updated_at timestamptz not null default now(),
  primary key (organization_id, workspace_id),
  foreign key (organization_id) references public.organizations(id) on delete restrict,
  foreign key (workspace_id, organization_id) references public.workspaces(id, organization_id) on delete cascade,
  check (used_bytes >= 0),
  check (asset_count >= 0)
);

create index if not exists marketing_creative_assets_scope_idx
  on public.marketing_creative_assets(organization_id, workspace_id, project_id, status);
create index if not exists marketing_creative_asset_references_asset_idx
  on public.marketing_creative_asset_references(organization_id, asset_id);
create index if not exists marketing_creative_assets_expiry_idx
  on public.marketing_creative_assets(expires_at)
  where kind = 'export' and status = 'active';

create or replace function public.marketing_creative_json_has_inline_data(value jsonb)
returns boolean
language sql
immutable
as $$
  select case jsonb_typeof(value)
    when 'object' then exists (
      select 1 from jsonb_each(value) entry
      where public.marketing_creative_json_has_inline_data(entry.value)
    )
    when 'array' then exists (
      select 1 from jsonb_array_elements(value) entry
      where public.marketing_creative_json_has_inline_data(entry.value)
    )
    when 'string' then (
      value #>> '{}' ~* '(^data:[^,]+;base64,|(^|[^a-z])base64([,:;" ]|$))'
      or (
        length(value #>> '{}') >= 256
        and value #>> '{}' ~ '^[A-Za-z0-9+/=]+$'
      )
    )
    else false
  end;
$$;

create or replace function public.marketing_creative_validate_documents()
returns trigger
language plpgsql
as $$
begin
  if tg_table_name = 'marketing_creative_projects' then
    if tg_op = 'UPDATE' and new.autosave_revision < old.autosave_revision then
      raise exception 'Creative project autosave revision is stale';
    end if;
    if public.marketing_creative_json_has_inline_data(new.draft_document)
      or octet_length(new.draft_document::text) > 10485760 then
      raise exception 'Creative project drafts must use Storage references and remain within the project size limit';
    end if;
  elsif tg_table_name = 'marketing_creative_project_versions' then
    if public.marketing_creative_json_has_inline_data(new.document)
      or octet_length(new.document::text) > 10485760 then
      raise exception 'Creative project versions must use Storage references and remain within the project size limit';
    end if;
  elsif tg_table_name = 'marketing_creative_variants' then
    if public.marketing_creative_json_has_inline_data(new.payload)
      or octet_length(new.payload::text) > 10485760 then
      raise exception 'Creative variants must use Storage references and remain within the project size limit';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists marketing_creative_projects_validate_documents on public.marketing_creative_projects;
create trigger marketing_creative_projects_validate_documents
before insert or update of draft_document on public.marketing_creative_projects
for each row execute function public.marketing_creative_validate_documents();

drop trigger if exists marketing_creative_project_versions_validate_documents on public.marketing_creative_project_versions;
create trigger marketing_creative_project_versions_validate_documents
before insert or update of document on public.marketing_creative_project_versions
for each row execute function public.marketing_creative_validate_documents();

drop trigger if exists marketing_creative_variants_validate_documents on public.marketing_creative_variants;
create trigger marketing_creative_variants_validate_documents
before insert or update of payload on public.marketing_creative_variants
for each row execute function public.marketing_creative_validate_documents();

create or replace function public.marketing_creative_update_usage()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  old_bytes bigint := 0;
  old_count integer := 0;
  new_bytes bigint := 0;
  new_count integer := 0;
  target_organization uuid;
  target_workspace uuid;
begin
  if tg_op <> 'INSERT' and old.status = 'active' then
    old_bytes := old.size_bytes;
    old_count := 1;
  end if;
  if tg_op <> 'DELETE' and new.status = 'active' then
    new_bytes := new.size_bytes;
    new_count := 1;
  end if;
  target_organization := coalesce(new.organization_id, old.organization_id);
  target_workspace := coalesce(new.workspace_id, old.workspace_id);
  insert into public.marketing_creative_storage_usage (
    organization_id, workspace_id, used_bytes, asset_count, updated_at
  )
  values (
    target_organization,
    target_workspace,
    greatest(new_bytes - old_bytes, 0),
    greatest(new_count - old_count, 0),
    now()
  )
  on conflict (organization_id, workspace_id) do update set
    used_bytes = greatest(public.marketing_creative_storage_usage.used_bytes + new_bytes - old_bytes, 0),
    asset_count = greatest(public.marketing_creative_storage_usage.asset_count + new_count - old_count, 0),
    updated_at = now();
  return coalesce(new, old);
end;
$$;

create or replace function public.marketing_creative_validate_asset_scope()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  source_kind text;
  project_bytes bigint;
  quota_bytes bigint;
  used_bytes bigint;
  old_active_bytes bigint := 0;
begin
  if tg_op = 'UPDATE' and (
    new.organization_id <> old.organization_id
    or new.brand_id <> old.brand_id
    or new.workspace_id <> old.workspace_id
  ) then
    raise exception 'Creative asset tenant scope is immutable';
  end if;
  if new.source_asset_id is not null then
    select kind into source_kind
    from public.marketing_creative_assets
    where id = new.source_asset_id and organization_id = new.organization_id;
    if source_kind is distinct from 'source' then
      raise exception 'Creative thumbnails must reference a source asset';
    end if;
  end if;
  if new.kind = 'thumbnail' and new.project_id is null then
    raise exception 'Creative thumbnails must belong to a project';
  end if;
  if new.status = 'active' then
    if tg_op = 'UPDATE' and old.status = 'active' then
      old_active_bytes := old.size_bytes;
    end if;
    select coalesce(sum(size_bytes), 0) into project_bytes
    from public.marketing_creative_assets asset
    where asset.organization_id = new.organization_id
      and asset.workspace_id = new.workspace_id
      and asset.project_id is not distinct from new.project_id
      and asset.status = 'active'
      and asset.id <> new.id;
    if new.project_id is not null and project_bytes + new.size_bytes > 10485760 then
      raise exception 'Creative project asset limit exceeded';
    end if;
    select quota.quota_bytes into quota_bytes
    from public.marketing_creative_storage_quotas quota
    where quota.organization_id = new.organization_id
      and quota.workspace_id = new.workspace_id;
    select coalesce(usage.used_bytes, 0) into used_bytes
    from public.marketing_creative_storage_usage usage
    where usage.organization_id = new.organization_id
      and usage.workspace_id = new.workspace_id;
    if coalesce(used_bytes, 0) - old_active_bytes + new.size_bytes > coalesce(quota_bytes, 5368709120) then
      raise exception 'Creative storage quota exceeded';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists marketing_creative_assets_validate_scope on public.marketing_creative_assets;
create trigger marketing_creative_assets_validate_scope
before insert or update on public.marketing_creative_assets
for each row execute function public.marketing_creative_validate_asset_scope();

drop trigger if exists marketing_creative_assets_usage on public.marketing_creative_assets;
create trigger marketing_creative_assets_usage
after insert or update of status, size_bytes, organization_id, workspace_id or delete
on public.marketing_creative_assets
for each row execute function public.marketing_creative_update_usage();

create or replace function public.retain_marketing_creative_versions(
  target_project_id uuid,
  target_organization_id uuid,
  keep_count integer default 10
)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  deleted_count integer;
begin
  if keep_count < 1 or not public.has_organization_permission(target_organization_id, 'marketing.manage') then
    raise exception 'Creative version retention request denied';
  end if;
  delete from public.marketing_creative_project_versions version
  where version.project_id = target_project_id
    and version.organization_id = target_organization_id
    and version.id in (
      select candidate.id
      from public.marketing_creative_project_versions candidate
      where candidate.project_id = target_project_id
        and candidate.organization_id = target_organization_id
        and not exists (
          select 1
          from public.marketing_creative_asset_references reference
          where reference.project_version_id = candidate.id
            or reference.variant_id in (
              select variant.id
              from public.marketing_creative_variants variant
              where variant.project_version_id = candidate.id
            )
        )
      order by candidate.version_number desc
      offset keep_count
    );
  get diagnostics deleted_count = row_count;
  return deleted_count;
end;
$$;

create or replace function public.cleanup_marketing_creative_assets(
  target_organization_id uuid,
  target_workspace_id uuid,
  orphan_before timestamptz default now() - interval '24 hours'
)
returns setof uuid
language sql
security definer
set search_path = public
as $$
  delete from public.marketing_creative_assets asset
  where asset.organization_id = target_organization_id
    and asset.workspace_id = target_workspace_id
    and (
      (asset.kind = 'export' and asset.expires_at <= now())
      or (asset.status = 'orphaned' and asset.orphaned_at <= orphan_before)
    )
    and not exists (
      select 1
      from public.marketing_creative_asset_references reference
      where reference.asset_id = asset.id
    )
  returning asset.id;
$$;

grant execute on function public.retain_marketing_creative_versions(uuid, uuid, integer) to authenticated;
grant execute on function public.cleanup_marketing_creative_assets(uuid, uuid, timestamptz) to authenticated;

alter table public.marketing_creative_assets enable row level security;
alter table public.marketing_creative_asset_references enable row level security;
alter table public.marketing_creative_storage_quotas enable row level security;
alter table public.marketing_creative_storage_usage enable row level security;

grant select, insert, update on table public.marketing_creative_assets to authenticated;
grant select, insert, delete on table public.marketing_creative_asset_references to authenticated;
grant select, insert, update on table public.marketing_creative_storage_quotas to authenticated;
grant select on table public.marketing_creative_storage_usage to authenticated;

create policy "organization marketing users can read creative assets"
on public.marketing_creative_assets for select to authenticated
using (public.has_organization_permission(organization_id, 'marketing.read'));

create policy "organization marketing editors can create creative assets"
on public.marketing_creative_assets for insert to authenticated
with check (public.has_organization_permission(organization_id, 'marketing.manage'));

create policy "organization marketing editors can update creative assets"
on public.marketing_creative_assets for update to authenticated
using (public.has_organization_permission(organization_id, 'marketing.manage'))
with check (public.has_organization_permission(organization_id, 'marketing.manage'));

create policy "organization marketing editors can remove safe creative assets"
on public.marketing_creative_assets for delete to authenticated
using (
  public.has_organization_permission(organization_id, 'marketing.manage')
  and (
    (kind = 'export' and expires_at <= now())
    or (status = 'orphaned' and orphaned_at <= now() - interval '24 hours')
  )
  and not exists (
    select 1
    from public.marketing_creative_asset_references reference
    where reference.asset_id = id
  )
);

create policy "organization marketing users can read creative asset references"
on public.marketing_creative_asset_references for select to authenticated
using (public.has_organization_permission(organization_id, 'marketing.read'));

create policy "organization marketing editors can create creative asset references"
on public.marketing_creative_asset_references for insert to authenticated
with check (public.has_organization_permission(organization_id, 'marketing.manage'));

create policy "organization marketing editors can remove creative asset references"
on public.marketing_creative_asset_references for delete to authenticated
using (public.has_organization_permission(organization_id, 'marketing.manage'));

create policy "organization marketing users can read creative quotas"
on public.marketing_creative_storage_quotas for select to authenticated
using (public.has_organization_permission(organization_id, 'marketing.read'));

create policy "organization marketing admins can manage creative quotas"
on public.marketing_creative_storage_quotas for insert to authenticated
with check (public.has_organization_permission(organization_id, 'marketing.manage'));

create policy "organization marketing admins can update creative quotas"
on public.marketing_creative_storage_quotas for update to authenticated
using (public.has_organization_permission(organization_id, 'marketing.manage'))
with check (public.has_organization_permission(organization_id, 'marketing.manage'));

create policy "organization marketing users can read creative usage"
on public.marketing_creative_storage_usage for select to authenticated
using (public.has_organization_permission(organization_id, 'marketing.read'));

insert into storage.buckets (id, name, public)
values ('marketing-creative', 'marketing-creative', false)
on conflict (id) do nothing;

create or replace function public.marketing_creative_storage_scope_allowed(
  object_name text,
  required_permission text
)
returns boolean
language plpgsql
stable
as $$
declare
  parts text[];
begin
  if object_name !~ '^org/[0-9a-fA-F-]{36}/workspace/[0-9a-fA-F-]{36}/(source|export|thumbnail)/[0-9a-fA-F]{64}[^/]*$' then
    return false;
  end if;
  parts := string_to_array(object_name, '/');
  return public.has_organization_permission(parts[2]::uuid, required_permission)
    and exists (
      select 1
      from public.workspaces workspace
      where workspace.id = parts[4]::uuid
        and workspace.organization_id = parts[2]::uuid
    );
end;
$$;

create policy "organization marketing users can read creative Storage"
on storage.objects for select to authenticated
using (
  bucket_id = 'marketing-creative'
  and public.marketing_creative_storage_scope_allowed(name, 'marketing.read')
);

create policy "organization marketing editors can create creative Storage"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'marketing-creative'
  and public.marketing_creative_storage_scope_allowed(name, 'marketing.manage')
);

create policy "organization marketing editors can update creative Storage"
on storage.objects for update to authenticated
using (
  bucket_id = 'marketing-creative'
  and public.marketing_creative_storage_scope_allowed(name, 'marketing.manage')
)
with check (
  bucket_id = 'marketing-creative'
  and public.marketing_creative_storage_scope_allowed(name, 'marketing.manage')
);

create policy "organization marketing editors can remove creative Storage"
on storage.objects for delete to authenticated
using (
  bucket_id = 'marketing-creative'
  and public.marketing_creative_storage_scope_allowed(name, 'marketing.manage')
);
