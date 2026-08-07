-- Permissions for the remaining LoopDev suites.
-- Financial Ops stays product-locked in the Launchpad until its module exists,
-- but its permission is defined now so activation does not require a schema change.

insert into public.permissions (key, description, scope)
values
  ('health.read', 'View Health OS workspaces and records', 'workspace'),
  ('health.manage', 'Manage Health OS workspaces and records', 'workspace'),
  ('quant.read', 'View Quant Ops workspaces and execution data', 'workspace'),
  ('quant.manage', 'Manage Quant Ops strategies and execution', 'workspace'),
  ('finance.read', 'View Financial Ops workspaces and reports', 'workspace'),
  ('finance.manage', 'Manage Financial Ops configuration and reports', 'workspace')
on conflict (key) do nothing;

insert into public.role_permissions (role, permission_key)
select role, permission_key
from (
  values
    ('owner', 'health.read'), ('owner', 'health.manage'),
    ('owner', 'quant.read'), ('owner', 'quant.manage'),
    ('owner', 'finance.read'), ('owner', 'finance.manage'),
    ('admin', 'health.read'), ('admin', 'health.manage'),
    ('admin', 'quant.read'), ('admin', 'quant.manage'),
    ('admin', 'finance.read'), ('admin', 'finance.manage'),
    ('agent', 'health.read'), ('agent', 'quant.read'),
    ('viewer', 'health.read'), ('viewer', 'quant.read'), ('viewer', 'finance.read')
) as matrix(role, permission_key)
on conflict (role, permission_key) do nothing;
