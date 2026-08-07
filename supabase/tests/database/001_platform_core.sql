begin;

select plan(10);

select ok(exists (select 1 from information_schema.tables where table_schema = 'public' and table_name = 'organizations'), 'organizations table exists');
select ok(exists (select 1 from information_schema.tables where table_schema = 'public' and table_name = 'organization_memberships'), 'organization_memberships table exists');
select ok(exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'organizations' and column_name = 'legacy_tenant_id'), 'organizations keeps the legacy tenant link');
select ok(exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'organization_memberships' and column_name = 'role'), 'memberships expose a role column');
select ok(exists (select 1 from pg_constraint where conrelid = 'public.organization_memberships'::regclass and contype = 'p'), 'memberships have a composite primary key');
select ok((select relrowsecurity from pg_class where oid = 'public.organizations'::regclass), 'organizations have RLS enabled');
select ok((select relrowsecurity from pg_class where oid = 'public.organization_memberships'::regclass), 'organization memberships have RLS enabled');
select ok(exists (select 1 from pg_proc where oid = 'public.is_organization_member(uuid)'::regprocedure), 'membership helper function exists');
select ok(exists (select 1 from pg_proc where oid = 'public.has_organization_role(uuid,text[])'::regprocedure), 'role helper function exists');
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

select * from finish();
rollback;
