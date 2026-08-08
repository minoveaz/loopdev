begin;

select plan(56);

-- Fixtures are created by the postgres test session and rolled back at the end.
-- This keeps the suite independent from the users present in Supabase Dev.

insert into auth.users (id, aud, role, email, encrypted_password, email_confirmed_at)
values
  ('00000000-0000-4000-8000-000000000001', 'authenticated', 'authenticated', 'platform-core-a@example.test', '', now()),
  ('00000000-0000-4000-8000-000000000002', 'authenticated', 'authenticated', 'platform-core-b@example.test', '', now()),
  ('00000000-0000-4000-8000-000000000003', 'authenticated', 'authenticated', 'platform-core-admin@example.test', '', now()),
  ('00000000-0000-4000-8000-000000000004', 'authenticated', 'authenticated', 'platform-core-agent@example.test', '', now()),
  ('00000000-0000-4000-8000-000000000005', 'authenticated', 'authenticated', 'platform-core-external@example.test', '', now()),
  ('00000000-0000-4000-8000-000000000006', 'authenticated', 'authenticated', 'platform-core-platform-owner@example.test', '', now());

insert into public.platform_administrators (user_id, role)
values ('00000000-0000-4000-8000-000000000006', 'owner');

insert into public.organizations (id, name, slug)
values
  ('00000000-0000-4000-9000-000000000001', 'Platform Core A', 'platform-core-a'),
  ('00000000-0000-4000-9000-000000000002', 'Platform Core B', 'platform-core-b');

insert into public.organization_memberships (organization_id, user_id, role)
values
  ('00000000-0000-4000-9000-000000000001', '00000000-0000-4000-8000-000000000001', 'owner'),
  ('00000000-0000-4000-9000-000000000002', '00000000-0000-4000-8000-000000000002', 'viewer'),
  ('00000000-0000-4000-9000-000000000001', '00000000-0000-4000-8000-000000000003', 'admin'),
  ('00000000-0000-4000-9000-000000000001', '00000000-0000-4000-8000-000000000004', 'agent');

insert into public.brands (id, organization_id, name)
values
  ('00000000-0000-4000-9000-000000000011', '00000000-0000-4000-9000-000000000001', 'Brand A'),
  ('00000000-0000-4000-9000-000000000012', '00000000-0000-4000-9000-000000000002', 'Brand B');

insert into public.workspaces (id, organization_id, suite_key, name, slug)
values
  ('00000000-0000-4000-9000-000000000021', '00000000-0000-4000-9000-000000000001', 'marketing', 'Brand Hub A', 'brand-hub-a'),
  ('00000000-0000-4000-9000-000000000022', '00000000-0000-4000-9000-000000000002', 'health', 'Health OS B', 'health-os-b');

insert into public.workspace_brands (workspace_id, organization_id, brand_id)
values
  ('00000000-0000-4000-9000-000000000021', '00000000-0000-4000-9000-000000000001', '00000000-0000-4000-9000-000000000011'),
  ('00000000-0000-4000-9000-000000000022', '00000000-0000-4000-9000-000000000002', '00000000-0000-4000-9000-000000000012');

insert into public.tenants (id, name, slug)
values ('00000000-0000-4000-9000-000000000031', 'Platform Core Tenant A', 'platform-core-tenant-a');

update public.organizations
set legacy_tenant_id = '00000000-0000-4000-9000-000000000031'
where id = '00000000-0000-4000-9000-000000000001';

insert into public.quant_assets (symbol, name, category)
values ('PCORE/USDT', 'Platform Core Quant Asset', 'crypto');

insert into public.quant_market_config (id, pair)
values ('00000000-0000-4000-9000-000000000032', 'PCOREUSDT');

insert into public.quant_market_history (
  id, pair, environment, timeframe, open, high, low, close, volume, "timestamp"
)
values (
  '00000000-0000-4000-9000-000000000033', 'PCOREUSDT', 'testnet', '1m',
  100, 110, 90, 105, 10, '2026-08-01T00:00:00Z'
);

insert into public.quant_strategies (
  id, tenant_id, organization_id, name, mode, size_per_trade, max_positions, max_exposure, stop_loss, take_profit
)
values (
  '00000000-0000-4000-9000-000000000034', '00000000-0000-4000-9000-000000000031', '00000000-0000-4000-9000-000000000001',
  'Platform Core Strategy A', 'paper', 100, 2, 200, 2, 4
);

insert into public.quant_bots (id, tenant_id, organization_id, name, pair, strategy_id, base_investment_usdt)
values (
  '00000000-0000-4000-9000-000000000035', '00000000-0000-4000-9000-000000000031', '00000000-0000-4000-9000-000000000001',
  'Platform Core Bot A', 'PCORE/USDT', '00000000-0000-4000-9000-000000000034', 100
);

insert into public.quant_audit_logs (id, bot_id, tenant_id, organization_id, pair, event_type, price)
values (
  '00000000-0000-4000-9000-000000000036', '00000000-0000-4000-9000-000000000035', '00000000-0000-4000-9000-000000000031',
  '00000000-0000-4000-9000-000000000001', 'PCORE/USDT', 'strategy_evaluated', 100
);

insert into public.strategy_backtest_results (
  id, strategy_id, organization_id, start_date, end_date, initial_capital, final_capital, total_return, total_trades,
  winning_trades, losing_trades, win_rate, max_drawdown, profit_factor
)
values (
  '00000000-0000-4000-9000-000000000037', '00000000-0000-4000-9000-000000000034', '00000000-0000-4000-9000-000000000001',
  '2026-07-01', '2026-08-01', 1000, 1100, 10, 10, 6, 4, 60, 5, 1.5
);

select set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);
set local role authenticated;

select ok(
  exists (select 1 from public.organizations where id = '00000000-0000-4000-9000-000000000001'),
  'a member can see their organization'
);
select ok(
  not exists (select 1 from public.organizations where id = '00000000-0000-4000-9000-000000000002'),
  'a member cannot see another organization'
);
select ok(
  exists (select 1 from public.organization_memberships where organization_id = '00000000-0000-4000-9000-000000000001'),
  'a member can see their membership'
);
select ok(
  not exists (select 1 from public.organization_memberships where organization_id = '00000000-0000-4000-9000-000000000002'),
  'a member cannot see another organization membership'
);
select ok(
  public.is_organization_member('00000000-0000-4000-9000-000000000001'),
  'membership helper grants access to the current organization'
);
select ok(
  not public.is_organization_member('00000000-0000-4000-9000-000000000002'),
  'membership helper denies access to another organization'
);
select ok(
  public.has_organization_role('00000000-0000-4000-9000-000000000001', array['owner']),
  'role helper grants the owner role'
);
select ok(
  not public.has_organization_role('00000000-0000-4000-9000-000000000001', array['viewer']),
  'role helper denies an unassigned role'
);

select set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000002', true);

select ok(
  exists (select 1 from public.organizations where id = '00000000-0000-4000-9000-000000000002'),
  'the second member can see only their organization'
);
select ok(
  not exists (select 1 from public.organizations where id = '00000000-0000-4000-9000-000000000001'),
  'the second member cannot see the first organization'
);
select ok(
  public.has_organization_role('00000000-0000-4000-9000-000000000002', array['viewer']),
  'viewer membership is recognized by the role helper'
);
select ok(
  not public.has_organization_role('00000000-0000-4000-9000-000000000002', array['admin', 'owner']),
  'viewer cannot exercise admin or owner permissions'
);

select set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000003', true);
select ok(
  public.has_organization_role('00000000-0000-4000-9000-000000000001', array['admin']),
  'admin membership is recognized by the role helper'
);
select ok(
  not public.has_organization_role('00000000-0000-4000-9000-000000000001', array['owner']),
  'admin cannot exercise owner-only permissions'
);

select set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000004', true);
select ok(
  public.has_organization_role('00000000-0000-4000-9000-000000000001', array['agent']),
  'agent membership is recognized by the role helper'
);
select ok(
  not public.has_organization_role('00000000-0000-4000-9000-000000000001', array['admin', 'owner']),
  'agent cannot exercise admin or owner permissions'
);

select set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000005', true);
select ok(
  not exists (select 1 from public.organizations),
  'an authenticated user without membership cannot see organizations'
);
select ok(
  not public.is_organization_member('00000000-0000-4000-9000-000000000001'),
  'an authenticated user without membership is denied by the helper'
);

select set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);
select ok(
  public.has_organization_permission('00000000-0000-4000-9000-000000000001', 'crm.manage'),
  'owner receives the CRM management permission'
);
select ok(
  exists (select 1 from public.permissions where key = 'communications.send'),
  'the permission catalog contains communication capabilities'
);

select set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000002', true);
select ok(
  public.has_organization_permission('00000000-0000-4000-9000-000000000002', 'crm.read'),
  'viewer receives read-only CRM access'
);
select ok(
  not public.has_organization_permission('00000000-0000-4000-9000-000000000002', 'crm.manage'),
  'viewer is denied CRM management access'
);
select ok(
  not exists (select 1 from public.quant_strategies where id = '00000000-0000-4000-9000-000000000034'),
  'a Quant reader cannot view another organization strategy'
);

select set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000003', true);
select ok(
  public.has_organization_permission('00000000-0000-4000-9000-000000000001', 'members.manage'),
  'admin receives membership management access'
);

select set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000004', true);
select ok(
  not public.has_organization_permission('00000000-0000-4000-9000-000000000001', 'members.manage'),
  'agent is denied membership management access'
);

select set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);
select ok(
  exists (select 1 from public.brands where id = '00000000-0000-4000-9000-000000000011'),
  'an owner can view a brand in their organization'
);
select ok(
  not exists (select 1 from public.brands where id = '00000000-0000-4000-9000-000000000012'),
  'an owner cannot view a brand in another organization'
);
select lives_ok(
  $$ update public.brands set name = 'Brand A updated' where id = '00000000-0000-4000-9000-000000000011' $$,
  'an owner can update a brand in their organization'
);

select set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000002', true);
select ok(
  exists (select 1 from public.brands where id = '00000000-0000-4000-9000-000000000012'),
  'a viewer can view a brand in their organization'
);
select lives_ok(
  $$ update public.brands set name = 'Viewer must not update' where id = '00000000-0000-4000-9000-000000000012' $$,
  'a viewer cannot update a brand'
);
select is(
  (select name from public.brands where id = '00000000-0000-4000-9000-000000000012'),
  'Brand B',
  'a viewer update is filtered by RLS'
);

select set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000005', true);
select ok(
  not exists (select 1 from public.brands),
  'a user without membership cannot view brands'
);
select ok(not exists (select 1 from public.workspaces), 'a user without membership cannot view workspaces');
select ok(not exists (select 1 from public.tenants where id = '00000000-0000-4000-9000-000000000031'), 'a user without membership cannot view tenants');
select ok(not exists (select 1 from public.quant_assets where symbol = 'PCORE/USDT'), 'a user without Quant access cannot view Quant assets');
select ok(not exists (select 1 from public.quant_market_config where id = '00000000-0000-4000-9000-000000000032'), 'a user without Quant access cannot view market configuration');
select ok(not exists (select 1 from public.quant_market_history where id = '00000000-0000-4000-9000-000000000033'), 'a user without Quant access cannot view market history');
select ok(not exists (select 1 from public.quant_strategies where id = '00000000-0000-4000-9000-000000000034'), 'a user without membership cannot view organization Quant strategies');
select ok(not exists (select 1 from public.quant_audit_logs where id = '00000000-0000-4000-9000-000000000036'), 'a user without membership cannot view organization Quant audit logs');

select set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);
select ok(exists (select 1 from public.tenants where id = '00000000-0000-4000-9000-000000000031'), 'an organization member can view their legacy tenant');
select ok(exists (select 1 from public.quant_assets where symbol = 'PCORE/USDT'), 'a Quant user can view Quant assets');
select ok(exists (select 1 from public.quant_market_config where id = '00000000-0000-4000-9000-000000000032'), 'a Quant user can view market configuration');
select ok(exists (select 1 from public.quant_market_history where id = '00000000-0000-4000-9000-000000000033'), 'a Quant user can view market history');
select ok(exists (select 1 from public.quant_strategies where id = '00000000-0000-4000-9000-000000000034'), 'a Quant user can view organization strategies');
select lives_ok($$ update public.quant_strategies set status = 'active' where id = '00000000-0000-4000-9000-000000000034' $$, 'a Quant manager can manage organization strategies');
select ok(exists (select 1 from public.strategy_backtest_results where id = '00000000-0000-4000-9000-000000000037'), 'a Quant user can view organization backtest results');

select set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000006', true);
select ok(
  public.is_platform_administrator(),
  'a LoopDev platform owner is recognized outside organization memberships'
);
select ok(
  exists (select 1 from public.organizations where id = '00000000-0000-4000-9000-000000000002'),
  'a platform owner can view every organization'
);
select ok(
  exists (select 1 from public.organization_memberships where organization_id = '00000000-0000-4000-9000-000000000002'),
  'a platform owner can view memberships in every organization'
);
select ok(
  exists (select 1 from public.brands where id = '00000000-0000-4000-9000-000000000012'),
  'a platform owner can view brands in every organization'
);
select lives_ok(
  $$ update public.brands set name = 'Brand B platform updated' where id = '00000000-0000-4000-9000-000000000012' $$,
  'a platform owner can manage a brand in any organization'
);
select ok(exists (select 1 from public.workspaces where id = '00000000-0000-4000-9000-000000000021') and exists (select 1 from public.workspaces where id = '00000000-0000-4000-9000-000000000022'), 'a platform owner can view every workspace');

select set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);
select ok(exists (select 1 from public.workspaces where id = '00000000-0000-4000-9000-000000000021'), 'an owner can view their suite workspace');
select ok(not exists (select 1 from public.workspaces where id = '00000000-0000-4000-9000-000000000022'), 'an owner cannot view another organization workspace');
select lives_ok($$ update public.workspaces set name = 'Brand Hub A updated' where id = '00000000-0000-4000-9000-000000000021' $$, 'an organization owner can manage a workspace');

select set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000002', true);
select ok(exists (select 1 from public.workspaces where id = '00000000-0000-4000-9000-000000000022'), 'a viewer can view an enabled suite workspace');

select * from finish();
rollback;
