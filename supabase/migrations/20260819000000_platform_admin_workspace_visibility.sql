-- Platform administrators need to inspect every organization's enabled suites
-- without becoming members of the customer organization.

drop policy if exists "platform administrators can view workspaces" on public.workspaces;
create policy "platform administrators can view workspaces"
on public.workspaces
for select
to authenticated
using (public.is_platform_administrator());

drop policy if exists "platform administrators can view workspace brands" on public.workspace_brands;
create policy "platform administrators can view workspace brands"
on public.workspace_brands
for select
to authenticated
using (public.is_platform_administrator());
