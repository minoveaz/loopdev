-- RLS is only evaluated after PostgreSQL table privileges. Grant the minimum
-- CRUD surface to authenticated users and let the Platform Core policies make
-- the authorization decision for every row and operation.

grant select, insert, update, delete on public.organizations to authenticated;
grant select, insert, update, delete on public.organization_memberships to authenticated;
grant select, insert, update, delete on public.platform_administrators to authenticated;
grant select, insert, update, delete on public.brands to authenticated;
grant select, insert, update, delete on public.workspaces to authenticated;
grant select, insert, update, delete on public.workspace_brands to authenticated;
