-- Organization owners and admins may manage membership lifecycle in their own
-- organization. Client roles cannot change membership ownership or scope.

revoke update on public.organization_memberships from authenticated;
grant update (status, role) on public.organization_memberships to authenticated;

create policy "organization managers can update membership lifecycle"
on public.organization_memberships
for update
to authenticated
using (
  public.has_organization_permission(organization_id, 'organization.manage')
)
with check (
  public.has_organization_permission(organization_id, 'organization.manage')
);