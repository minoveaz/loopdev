begin;

select plan(28);

select ok(exists (select 1 from information_schema.tables where table_schema = 'public' and table_name = 'organizations'), 'organizations table exists');
select ok(exists (select 1 from information_schema.tables where table_schema = 'public' and table_name = 'organization_memberships'), 'organization_memberships table exists');
select ok(exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'organizations' and column_name = 'legacy_tenant_id'), 'organizations keeps the legacy tenant link');
select ok(exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'organization_memberships' and column_name = 'role'), 'memberships expose a role column');
select ok(exists (select 1 from pg_constraint where conrelid = 'public.organization_memberships'::regclass and contype = 'p'), 'memberships have a composite primary key');
select ok((select relrowsecurity from pg_class where oid = 'public.organizations'::regclass), 'organizations have RLS enabled');
select ok((select relrowsecurity from pg_class where oid = 'public.organization_memberships'::regclass), 'organization memberships have RLS enabled');
select ok(exists (select 1 from pg_proc where oid = 'public.is_organization_member(uuid)'::regprocedure), 'membership helper function exists');
select ok(exists (select 1 from pg_proc where oid = 'public.has_organization_role(uuid,text[])'::regprocedure), 'role helper function exists');
select ok(exists (select 1 from information_schema.tables where table_schema = 'public' and table_name = 'platform_administrators'), 'platform administrators table exists');
select ok((select relrowsecurity from pg_class where oid = 'public.platform_administrators'::regclass), 'platform administrators have RLS enabled');
select ok(exists (select 1 from pg_proc where oid = 'public.is_platform_administrator()'::regprocedure), 'platform administrator helper function exists');
select ok(exists (select 1 from pg_proc where oid = 'public.has_platform_role(text)'::regprocedure), 'platform role helper function exists');
select ok(exists (select 1 from information_schema.tables where table_schema = 'public' and table_name = 'workspaces'), 'workspaces table exists');
select ok(exists (select 1 from information_schema.tables where table_schema = 'public' and table_name = 'workspace_brands'), 'workspace brand scopes table exists');
select ok((select relrowsecurity from pg_class where oid = 'public.workspaces'::regclass), 'workspaces have RLS enabled');
select ok(exists (select 1 from pg_proc where oid = 'public.can_access_workspace(uuid)'::regprocedure), 'workspace access helper exists');
select ok(exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'brands' and column_name = 'organization_id' and is_nullable = 'NO'), 'brands require an organization');
select ok(exists (select 1 from pg_constraint where conrelid = 'public.brands'::regclass and conname = 'brands_organization_id_fkey'), 'brands reference organizations');
select ok(exists (select 1 from pg_indexes where schemaname = 'public' and tablename = 'brands' and indexname = 'idx_brands_organization'), 'brands have an organization index');
select ok(
  not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'brands'
      and policyname in ('Admins can manage brands', 'Users can create brands', 'Users can view brands', 'Users can view brands of their own tenant')
  ),
  'legacy public brand policies are removed'
);
select ok(
	not exists (
		select 1
		from public.tenants tenant
		where not exists (
			select 1
			from public.organizations organization_record
			where organization_record.legacy_tenant_id = tenant.id
		)
	),
	'legacy tenants are represented as organizations'
);
select ok(exists (select 1 from pg_proc where oid = 'public.has_any_organization_permission(text)'::regprocedure), 'cross-organization permission helper exists');
select ok(
  not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and policyname in (
        'Anyone can view active tenants',
        'Certified assets are viewable by all users',
        'Allow read access to market config',
        'Allow public read access to market history',
        'Public read access for market data'
      )
  ),
  'legacy public tenant and Quant policies are removed'
);
select ok(
  (select count(*) from information_schema.columns where table_schema = 'public' and column_name = 'organization_id' and table_name in ('quant_audit_logs', 'quant_bots', 'quant_exchanges', 'quant_orders', 'quant_positions', 'quant_risk_settings', 'quant_signals', 'quant_strategies', 'strategy_backtest_results')) = 9,
  'organization-owned Quant tables expose organization_id'
);
select ok(
  not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and policyname in ('Users can manage their own risk settings', 'Users can only see signals from their bots', 'Users can only view results of their strategies', 'Users can only view their tenant''s bots', 'Users can only view their tenant''s exchanges', 'Users can only view their tenant''s orders', 'Users can only view their tenant''s positions', 'Users can only view their tenant''s strategies')
  ),
  'legacy tenant-based Quant policies are removed'
);
select ok(not has_table_privilege('authenticated', 'public.quant_exchanges', 'select'), 'authenticated clients cannot read exchange credentials directly');
select ok(not has_table_privilege('authenticated', 'public.quant_exchanges', 'insert'), 'authenticated clients cannot write exchange credentials directly');

select * from finish();
rollback;
