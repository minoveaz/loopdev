-- Marketing Studio: move legacy mono-brand tables into Platform Core tenancy.
-- Existing Dev records are VitaBlue records owned by Estar Protegidos.
-- Legacy payload columns remain unchanged for the compatibility period.

do $$
declare
  target_organization_id uuid;
  target_brand_id uuid;
  target_workspace_id uuid;
begin
  select id into target_organization_id
  from public.organizations
  where slug = 'estar-protegidos';

  select id into target_brand_id
  from public.brands
  where organization_id = target_organization_id
    and name = 'VitaBlue';

  select id into target_workspace_id
  from public.workspaces
  where organization_id = target_organization_id
    and suite_key = 'marketing'
    and slug = 'marketing-studio';

  if target_organization_id is null
     or target_brand_id is null
     or target_workspace_id is null then
    raise exception 'Marketing tenancy seed is incomplete';
  end if;

  alter table public.marketing_campaigns
    add column if not exists organization_id uuid,
    add column if not exists brand_id uuid,
    add column if not exists workspace_id uuid;

  update public.marketing_campaigns
  set organization_id = target_organization_id,
      brand_id = target_brand_id,
      workspace_id = target_workspace_id
  where organization_id is null
     or brand_id is null
     or workspace_id is null;

  alter table public.oauth_connections
    add column if not exists organization_id uuid,
    add column if not exists brand_id uuid,
    add column if not exists workspace_id uuid;

  update public.oauth_connections
  set organization_id = target_organization_id,
      brand_id = target_brand_id,
      workspace_id = target_workspace_id
  where organization_id is null
     or brand_id is null
     or workspace_id is null;

  alter table public.social_profiles
    add column if not exists id uuid default gen_random_uuid(),
    add column if not exists organization_id uuid,
    add column if not exists brand_id uuid,
    add column if not exists workspace_id uuid;

  update public.social_profiles
  set organization_id = target_organization_id,
      brand_id = target_brand_id,
      workspace_id = target_workspace_id
  where organization_id is null
     or brand_id is null
     or workspace_id is null;

  alter table public.oauth_states
    add column if not exists organization_id uuid,
    add column if not exists brand_id uuid,
    add column if not exists workspace_id uuid;

  update public.oauth_states
  set organization_id = target_organization_id,
      brand_id = target_brand_id,
      workspace_id = target_workspace_id
  where organization_id is null
     or brand_id is null
     or workspace_id is null;
end;
$$;

alter table public.marketing_campaigns
  alter column organization_id set not null,
  alter column brand_id set not null,
  alter column workspace_id set not null;

alter table public.oauth_connections
  alter column organization_id set not null,
  alter column brand_id set not null,
  alter column workspace_id set not null;

alter table public.social_profiles
  alter column id set not null,
  alter column organization_id set not null,
  alter column brand_id set not null,
  alter column workspace_id set not null;

alter table public.oauth_states
  alter column organization_id set not null,
  alter column brand_id set not null,
  alter column workspace_id set not null;

alter table public.social_profiles
  drop constraint if exists social_profiles_pkey;

alter table public.social_profiles
  add constraint social_profiles_pkey primary key (id);

alter table public.marketing_campaigns
  add constraint marketing_campaigns_organization_fkey
    foreign key (organization_id) references public.organizations(id) on delete restrict,
  add constraint marketing_campaigns_brand_organization_fkey
    foreign key (brand_id, organization_id)
    references public.brands(id, organization_id) on delete restrict,
  add constraint marketing_campaigns_workspace_organization_fkey
    foreign key (workspace_id, organization_id)
    references public.workspaces(id, organization_id) on delete restrict;

alter table public.oauth_connections
  add constraint oauth_connections_organization_fkey
    foreign key (organization_id) references public.organizations(id) on delete restrict,
  add constraint oauth_connections_brand_organization_fkey
    foreign key (brand_id, organization_id)
    references public.brands(id, organization_id) on delete restrict,
  add constraint oauth_connections_workspace_organization_fkey
    foreign key (workspace_id, organization_id)
    references public.workspaces(id, organization_id) on delete restrict;

alter table public.social_profiles
  add constraint social_profiles_organization_fkey
    foreign key (organization_id) references public.organizations(id) on delete restrict,
  add constraint social_profiles_brand_organization_fkey
    foreign key (brand_id, organization_id)
    references public.brands(id, organization_id) on delete restrict,
  add constraint social_profiles_workspace_organization_fkey
    foreign key (workspace_id, organization_id)
    references public.workspaces(id, organization_id) on delete restrict;

alter table public.oauth_states
  add constraint oauth_states_organization_fkey
    foreign key (organization_id) references public.organizations(id) on delete restrict,
  add constraint oauth_states_brand_organization_fkey
    foreign key (brand_id, organization_id)
    references public.brands(id, organization_id) on delete restrict,
  add constraint oauth_states_workspace_organization_fkey
    foreign key (workspace_id, organization_id)
    references public.workspaces(id, organization_id) on delete restrict;

create unique index if not exists social_profiles_scope_platform_key
  on public.social_profiles(organization_id, brand_id, platform);

create index if not exists marketing_campaigns_scope_idx
  on public.marketing_campaigns(organization_id, workspace_id, brand_id);

create index if not exists oauth_connections_scope_idx
  on public.oauth_connections(organization_id, workspace_id, brand_id);

create index if not exists oauth_states_scope_idx
  on public.oauth_states(organization_id, workspace_id, brand_id);

drop policy if exists "Marketing admins can delete campaigns" on public.marketing_campaigns;
drop policy if exists "Marketing editors can create campaigns" on public.marketing_campaigns;
drop policy if exists "Marketing editors can update campaigns" on public.marketing_campaigns;
drop policy if exists "Marketing users can read campaigns" on public.marketing_campaigns;

create policy "organization marketing admins can delete campaigns"
on public.marketing_campaigns for delete to authenticated
using (public.has_organization_permission(organization_id, 'marketing.manage'));

create policy "organization marketing editors can create campaigns"
on public.marketing_campaigns for insert to authenticated
with check (public.has_organization_permission(organization_id, 'marketing.manage'));

create policy "organization marketing editors can update campaigns"
on public.marketing_campaigns for update to authenticated
using (public.has_organization_permission(organization_id, 'marketing.manage'))
with check (public.has_organization_permission(organization_id, 'marketing.manage'));

create policy "organization marketing users can read campaigns"
on public.marketing_campaigns for select to authenticated
using (public.has_organization_permission(organization_id, 'marketing.read'));

drop policy if exists "Marketing admins can delete OAuth connections" on public.oauth_connections;
drop policy if exists "Marketing editors can manage OAuth connections" on public.oauth_connections;
drop policy if exists "Marketing editors can update OAuth connections" on public.oauth_connections;
drop policy if exists "Marketing users can read OAuth connections" on public.oauth_connections;

create policy "organization marketing admins can delete OAuth connections"
on public.oauth_connections for delete to authenticated
using (public.has_organization_permission(organization_id, 'marketing.manage'));

create policy "organization marketing editors can create OAuth connections"
on public.oauth_connections for insert to authenticated
with check (public.has_organization_permission(organization_id, 'marketing.manage') and created_by = auth.uid());

create policy "organization marketing editors can update OAuth connections"
on public.oauth_connections for update to authenticated
using (public.has_organization_permission(organization_id, 'marketing.manage'))
with check (public.has_organization_permission(organization_id, 'marketing.manage'));

create policy "organization marketing users can read OAuth connections"
on public.oauth_connections for select to authenticated
using (public.has_organization_permission(organization_id, 'marketing.read'));

drop policy if exists "Marketing admins can delete social profiles" on public.social_profiles;
drop policy if exists "Marketing editors can create social profiles" on public.social_profiles;
drop policy if exists "Marketing editors can update social profiles" on public.social_profiles;
drop policy if exists "Marketing users can read their social profiles" on public.social_profiles;

create policy "organization marketing admins can delete social profiles"
on public.social_profiles for delete to authenticated
using (public.has_organization_permission(organization_id, 'marketing.manage'));

create policy "organization marketing editors can create social profiles"
on public.social_profiles for insert to authenticated
with check (public.has_organization_permission(organization_id, 'marketing.manage'));

create policy "organization marketing editors can update social profiles"
on public.social_profiles for update to authenticated
using (public.has_organization_permission(organization_id, 'marketing.manage'))
with check (public.has_organization_permission(organization_id, 'marketing.manage'));

create policy "organization marketing users can read social profiles"
on public.social_profiles for select to authenticated
using (public.has_organization_permission(organization_id, 'marketing.read'));

drop policy if exists "Marketing users can read OAuth states" on public.oauth_states;

create policy "organization marketing users can read OAuth states"
on public.oauth_states for select to authenticated
using (public.has_organization_permission(organization_id, 'marketing.read'));

create policy "organization marketing editors can create OAuth states"
on public.oauth_states for insert to authenticated
with check (public.has_organization_permission(organization_id, 'marketing.manage') and user_id = auth.uid());
