-- Scope legacy marketing links, publications and click analytics.
-- Legacy campaign/link identifiers remain for compatibility.

do $$
declare
  target_organization_id uuid;
  target_brand_id uuid;
  target_workspace_id uuid;
begin
  select id into target_organization_id from public.organizations where slug = 'estar-protegidos';
  select id into target_brand_id from public.brands where organization_id = target_organization_id and name = 'VitaBlue';
  select id into target_workspace_id from public.workspaces where organization_id = target_organization_id and suite_key = 'marketing' and slug = 'marketing-studio';

  if target_organization_id is null or target_brand_id is null or target_workspace_id is null then
    raise exception 'Marketing tenancy seed is incomplete';
  end if;

  alter table public.marketing_links
    add column if not exists organization_id uuid,
    add column if not exists brand_id uuid,
    add column if not exists workspace_id uuid,
    add column if not exists canonical_campaign_id uuid;

  update public.marketing_links link
  set organization_id = coalesce(campaign.organization_id, target_organization_id),
      brand_id = coalesce(campaign.brand_id, target_brand_id),
      workspace_id = coalesce(campaign.workspace_id, target_workspace_id),
      canonical_campaign_id = campaign.id
  from public.marketing_campaign_records campaign
  where campaign.legacy_id = link.campaign_id
    and (link.organization_id is null or link.brand_id is null or link.workspace_id is null or link.canonical_campaign_id is null);

  update public.marketing_links
  set organization_id = coalesce(organization_id, target_organization_id),
      brand_id = coalesce(brand_id, target_brand_id),
      workspace_id = coalesce(workspace_id, target_workspace_id)
  where organization_id is null or brand_id is null or workspace_id is null;

  alter table public.marketing_link_clicks
    add column if not exists organization_id uuid,
    add column if not exists brand_id uuid,
    add column if not exists workspace_id uuid;

  update public.marketing_link_clicks click
  set organization_id = link.organization_id,
      brand_id = link.brand_id,
      workspace_id = link.workspace_id
  from public.marketing_links link
  where link.id = click.link_id
    and (click.organization_id is null or click.brand_id is null or click.workspace_id is null);

  alter table public.marketing_campaign_publications
    add column if not exists organization_id uuid,
    add column if not exists brand_id uuid,
    add column if not exists workspace_id uuid,
    add column if not exists canonical_campaign_id uuid;

  update public.marketing_campaign_publications publication
  set organization_id = campaign.organization_id,
      brand_id = campaign.brand_id,
      workspace_id = campaign.workspace_id,
      canonical_campaign_id = campaign.id
  from public.marketing_campaign_records campaign
  where campaign.legacy_id = publication.campaign_id
    and (publication.organization_id is null or publication.brand_id is null or publication.workspace_id is null or publication.canonical_campaign_id is null);

  if exists (select 1 from public.marketing_campaign_publications where organization_id is null or brand_id is null or workspace_id is null) then
    raise exception 'Cannot scope campaign publications: legacy campaign mapping is incomplete';
  end if;

  if exists (select 1 from public.marketing_link_clicks where organization_id is null or brand_id is null or workspace_id is null) then
    raise exception 'Cannot scope link clicks: legacy link mapping is incomplete';
  end if;
end;
$$;

alter table public.marketing_links
  alter column organization_id set not null,
  alter column brand_id set not null,
  alter column workspace_id set not null;

alter table public.marketing_link_clicks
  alter column organization_id set not null,
  alter column brand_id set not null,
  alter column workspace_id set not null;

alter table public.marketing_campaign_publications
  alter column organization_id set not null,
  alter column brand_id set not null,
  alter column workspace_id set not null;

alter table public.marketing_links
  add constraint marketing_links_organization_fkey
    foreign key (organization_id) references public.organizations(id) on delete restrict,
  add constraint marketing_links_brand_organization_fkey
    foreign key (brand_id, organization_id) references public.brands(id, organization_id) on delete restrict,
  add constraint marketing_links_workspace_organization_fkey
    foreign key (workspace_id, organization_id) references public.workspaces(id, organization_id) on delete restrict,
  add constraint marketing_links_canonical_campaign_fkey
    foreign key (canonical_campaign_id) references public.marketing_campaign_records(id) on delete set null;

alter table public.marketing_link_clicks
  add constraint marketing_link_clicks_organization_fkey
    foreign key (organization_id) references public.organizations(id) on delete restrict,
  add constraint marketing_link_clicks_brand_organization_fkey
    foreign key (brand_id, organization_id) references public.brands(id, organization_id) on delete restrict,
  add constraint marketing_link_clicks_workspace_organization_fkey
    foreign key (workspace_id, organization_id) references public.workspaces(id, organization_id) on delete restrict;

alter table public.marketing_campaign_publications
  add constraint marketing_publications_organization_fkey
    foreign key (organization_id) references public.organizations(id) on delete restrict,
  add constraint marketing_publications_brand_organization_fkey
    foreign key (brand_id, organization_id) references public.brands(id, organization_id) on delete restrict,
  add constraint marketing_publications_workspace_organization_fkey
    foreign key (workspace_id, organization_id) references public.workspaces(id, organization_id) on delete restrict,
  add constraint marketing_publications_canonical_campaign_fkey
    foreign key (canonical_campaign_id) references public.marketing_campaign_records(id) on delete cascade;

create index if not exists marketing_links_scope_idx on public.marketing_links(organization_id, workspace_id, brand_id);
create index if not exists marketing_link_clicks_scope_idx on public.marketing_link_clicks(organization_id, workspace_id, brand_id);
create index if not exists marketing_publications_scope_idx on public.marketing_campaign_publications(organization_id, workspace_id, brand_id);

drop policy if exists "Marketing admins can delete links" on public.marketing_links;
drop policy if exists "Marketing editors can create links" on public.marketing_links;
drop policy if exists "Marketing editors can update links" on public.marketing_links;
drop policy if exists "Marketing users can read links" on public.marketing_links;
drop policy if exists "Marketing users can read link clicks" on public.marketing_link_clicks;
drop policy if exists "Marketing admins can delete campaign publications" on public.marketing_campaign_publications;
drop policy if exists "Marketing editors can create campaign publications" on public.marketing_campaign_publications;
drop policy if exists "Marketing editors can update campaign publications" on public.marketing_campaign_publications;
drop policy if exists "Marketing users can read campaign publications" on public.marketing_campaign_publications;

create policy "organization marketing admins can delete links"
on public.marketing_links for delete to authenticated
using (public.has_organization_permission(organization_id, 'marketing.manage'));
create policy "organization marketing editors can create links"
on public.marketing_links for insert to authenticated
with check (public.has_organization_permission(organization_id, 'marketing.manage'));
create policy "organization marketing editors can update links"
on public.marketing_links for update to authenticated
using (public.has_organization_permission(organization_id, 'marketing.manage'))
with check (public.has_organization_permission(organization_id, 'marketing.manage'));
create policy "organization marketing users can read links"
on public.marketing_links for select to authenticated
using (public.has_organization_permission(organization_id, 'marketing.read'));

create policy "organization marketing users can read link clicks"
on public.marketing_link_clicks for select to authenticated
using (public.has_organization_permission(organization_id, 'marketing.read'));

create policy "organization marketing admins can delete campaign publications"
on public.marketing_campaign_publications for delete to authenticated
using (public.has_organization_permission(organization_id, 'marketing.manage'));
create policy "organization marketing editors can create campaign publications"
on public.marketing_campaign_publications for insert to authenticated
with check (public.has_organization_permission(organization_id, 'marketing.manage'));
create policy "organization marketing editors can update campaign publications"
on public.marketing_campaign_publications for update to authenticated
using (public.has_organization_permission(organization_id, 'marketing.manage'))
with check (public.has_organization_permission(organization_id, 'marketing.manage'));
create policy "organization marketing users can read campaign publications"
on public.marketing_campaign_publications for select to authenticated
using (public.has_organization_permission(organization_id, 'marketing.read'));
