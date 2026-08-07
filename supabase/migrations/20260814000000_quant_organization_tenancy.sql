-- Quant tenant transition. tenant_id remains temporarily for compatibility with
-- existing workers and clients, but organization_id becomes the authorization
-- boundary for every organization-owned Quant record.

alter table public.quant_audit_logs add column organization_id uuid;
alter table public.quant_bots add column organization_id uuid;
alter table public.quant_exchanges add column organization_id uuid;
alter table public.quant_orders add column organization_id uuid;
alter table public.quant_positions add column organization_id uuid;
alter table public.quant_risk_settings add column organization_id uuid;
alter table public.quant_signals add column organization_id uuid;
alter table public.quant_strategies add column organization_id uuid;
alter table public.strategy_backtest_results add column organization_id uuid;

update public.quant_audit_logs record set organization_id = organization_record.id from public.organizations organization_record where organization_record.legacy_tenant_id = record.tenant_id;
update public.quant_bots record set organization_id = organization_record.id from public.organizations organization_record where organization_record.legacy_tenant_id = record.tenant_id;
update public.quant_exchanges record set organization_id = organization_record.id from public.organizations organization_record where organization_record.legacy_tenant_id = record.tenant_id;
update public.quant_orders record set organization_id = organization_record.id from public.organizations organization_record where organization_record.legacy_tenant_id = record.tenant_id;
update public.quant_positions record set organization_id = organization_record.id from public.organizations organization_record where organization_record.legacy_tenant_id = record.tenant_id;
update public.quant_risk_settings record set organization_id = organization_record.id from public.organizations organization_record where organization_record.legacy_tenant_id = record.tenant_id;
update public.quant_signals record set organization_id = organization_record.id from public.organizations organization_record where organization_record.legacy_tenant_id = record.tenant_id;
update public.quant_strategies record set organization_id = organization_record.id from public.organizations organization_record where organization_record.legacy_tenant_id = record.tenant_id;
update public.strategy_backtest_results record set organization_id = strategy.organization_id from public.quant_strategies strategy where strategy.id = record.strategy_id;

do $$
begin
  if exists (
    select 1 from public.quant_audit_logs where organization_id is null
    union all select 1 from public.quant_bots where organization_id is null
    union all select 1 from public.quant_exchanges where organization_id is null
    union all select 1 from public.quant_orders where organization_id is null
    union all select 1 from public.quant_positions where organization_id is null
    union all select 1 from public.quant_risk_settings where organization_id is null
    union all select 1 from public.quant_signals where organization_id is null
    union all select 1 from public.quant_strategies where organization_id is null
    union all select 1 from public.strategy_backtest_results where organization_id is null
  ) then
    raise exception 'Every legacy Quant record must map from tenant_id to an organization before this migration can complete';
  end if;
end;
$$;

alter table public.quant_audit_logs alter column organization_id set not null;
alter table public.quant_bots alter column organization_id set not null;
alter table public.quant_exchanges alter column organization_id set not null;
alter table public.quant_orders alter column organization_id set not null;
alter table public.quant_positions alter column organization_id set not null;
alter table public.quant_risk_settings alter column organization_id set not null;
alter table public.quant_signals alter column organization_id set not null;
alter table public.quant_strategies alter column organization_id set not null;
alter table public.strategy_backtest_results alter column organization_id set not null;

alter table public.quant_audit_logs add constraint quant_audit_logs_organization_id_fkey foreign key (organization_id) references public.organizations(id) on delete cascade;
alter table public.quant_bots add constraint quant_bots_organization_id_fkey foreign key (organization_id) references public.organizations(id) on delete cascade;
alter table public.quant_exchanges add constraint quant_exchanges_organization_id_fkey foreign key (organization_id) references public.organizations(id) on delete cascade;
alter table public.quant_orders add constraint quant_orders_organization_id_fkey foreign key (organization_id) references public.organizations(id) on delete cascade;
alter table public.quant_positions add constraint quant_positions_organization_id_fkey foreign key (organization_id) references public.organizations(id) on delete cascade;
alter table public.quant_risk_settings add constraint quant_risk_settings_organization_id_fkey foreign key (organization_id) references public.organizations(id) on delete cascade;
alter table public.quant_signals add constraint quant_signals_organization_id_fkey foreign key (organization_id) references public.organizations(id) on delete cascade;
alter table public.quant_strategies add constraint quant_strategies_organization_id_fkey foreign key (organization_id) references public.organizations(id) on delete cascade;
alter table public.strategy_backtest_results add constraint strategy_backtest_results_organization_id_fkey foreign key (organization_id) references public.organizations(id) on delete cascade;

create index idx_quant_audit_logs_organization on public.quant_audit_logs(organization_id);
create index idx_quant_bots_organization on public.quant_bots(organization_id);
create index idx_quant_exchanges_organization on public.quant_exchanges(organization_id);
create index idx_quant_orders_organization on public.quant_orders(organization_id);
create index idx_quant_positions_organization on public.quant_positions(organization_id);
create unique index idx_quant_risk_settings_organization on public.quant_risk_settings(organization_id);
create index idx_quant_signals_organization on public.quant_signals(organization_id);
create index idx_quant_strategies_organization on public.quant_strategies(organization_id);
create index idx_strategy_backtest_results_organization on public.strategy_backtest_results(organization_id);

create or replace function public.sync_quant_organization_from_tenant()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  mapped_organization_id uuid;
begin
  select id into mapped_organization_id
  from public.organizations
  where legacy_tenant_id = new.tenant_id;

  if mapped_organization_id is null then
    raise exception 'Quant tenant % is not linked to an organization', new.tenant_id;
  end if;

  if new.organization_id is not null and new.organization_id <> mapped_organization_id then
    raise exception 'Quant organization_id must match the organization linked to tenant_id';
  end if;

  new.organization_id := mapped_organization_id;
  return new;
end;
$$;

create or replace function public.sync_quant_backtest_organization()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  strategy_organization_id uuid;
begin
  select organization_id into strategy_organization_id
  from public.quant_strategies
  where id = new.strategy_id;

  if strategy_organization_id is null then
    raise exception 'Quant strategy % is not linked to an organization', new.strategy_id;
  end if;

  if new.organization_id is not null and new.organization_id <> strategy_organization_id then
    raise exception 'Backtest organization_id must match its strategy organization';
  end if;

  new.organization_id := strategy_organization_id;
  return new;
end;
$$;

revoke all on function public.sync_quant_organization_from_tenant() from public;
revoke all on function public.sync_quant_backtest_organization() from public;

create trigger quant_audit_logs_organization_from_tenant before insert or update of tenant_id, organization_id on public.quant_audit_logs for each row execute function public.sync_quant_organization_from_tenant();
create trigger quant_bots_organization_from_tenant before insert or update of tenant_id, organization_id on public.quant_bots for each row execute function public.sync_quant_organization_from_tenant();
create trigger quant_exchanges_organization_from_tenant before insert or update of tenant_id, organization_id on public.quant_exchanges for each row execute function public.sync_quant_organization_from_tenant();
create trigger quant_orders_organization_from_tenant before insert or update of tenant_id, organization_id on public.quant_orders for each row execute function public.sync_quant_organization_from_tenant();
create trigger quant_positions_organization_from_tenant before insert or update of tenant_id, organization_id on public.quant_positions for each row execute function public.sync_quant_organization_from_tenant();
create trigger quant_risk_settings_organization_from_tenant before insert or update of tenant_id, organization_id on public.quant_risk_settings for each row execute function public.sync_quant_organization_from_tenant();
create trigger quant_signals_organization_from_tenant before insert or update of tenant_id, organization_id on public.quant_signals for each row execute function public.sync_quant_organization_from_tenant();
create trigger quant_strategies_organization_from_tenant before insert or update of tenant_id, organization_id on public.quant_strategies for each row execute function public.sync_quant_organization_from_tenant();
create trigger strategy_backtest_results_organization_from_strategy before insert or update of strategy_id, organization_id on public.strategy_backtest_results for each row execute function public.sync_quant_backtest_organization();

grant select, insert, update, delete on public.quant_audit_logs to authenticated;
grant select, insert, update, delete on public.quant_bots to authenticated;
grant select, insert, update, delete on public.quant_exchanges to authenticated;
grant select, insert, update, delete on public.quant_orders to authenticated;
grant select, insert, update, delete on public.quant_positions to authenticated;
grant select, insert, update, delete on public.quant_risk_settings to authenticated;
grant select, insert, update, delete on public.quant_signals to authenticated;
grant select, insert, update, delete on public.quant_strategies to authenticated;
grant select, insert, update, delete on public.strategy_backtest_results to authenticated;

alter table public.quant_audit_logs enable row level security;

drop policy if exists "Users can manage their own risk settings" on public.quant_risk_settings;
drop policy if exists "Users can only see signals from their bots" on public.quant_signals;
drop policy if exists "Users can only view results of their strategies" on public.strategy_backtest_results;
drop policy if exists "Users can only view their tenant's bots" on public.quant_bots;
drop policy if exists "Users can only view their tenant's exchanges" on public.quant_exchanges;
drop policy if exists "Users can only view their tenant's orders" on public.quant_orders;
drop policy if exists "Users can only view their tenant's positions" on public.quant_positions;
drop policy if exists "Users can only view their tenant's strategies" on public.quant_strategies;

create policy "quant users can view audit logs" on public.quant_audit_logs for select to authenticated using (public.has_organization_permission(organization_id, 'quant.read') or public.is_platform_administrator());
create policy "quant users can view bots" on public.quant_bots for select to authenticated using (public.has_organization_permission(organization_id, 'quant.read') or public.is_platform_administrator());
create policy "quant managers can manage bots" on public.quant_bots for all to authenticated using (public.has_organization_permission(organization_id, 'quant.manage') or public.is_platform_administrator()) with check (public.has_organization_permission(organization_id, 'quant.manage') or public.is_platform_administrator());
create policy "quant users can view exchanges" on public.quant_exchanges for select to authenticated using (public.has_organization_permission(organization_id, 'quant.read') or public.is_platform_administrator());
create policy "quant managers can manage exchanges" on public.quant_exchanges for all to authenticated using (public.has_organization_permission(organization_id, 'quant.manage') or public.is_platform_administrator()) with check (public.has_organization_permission(organization_id, 'quant.manage') or public.is_platform_administrator());
create policy "quant users can view orders" on public.quant_orders for select to authenticated using (public.has_organization_permission(organization_id, 'quant.read') or public.is_platform_administrator());
create policy "quant managers can manage orders" on public.quant_orders for all to authenticated using (public.has_organization_permission(organization_id, 'quant.manage') or public.is_platform_administrator()) with check (public.has_organization_permission(organization_id, 'quant.manage') or public.is_platform_administrator());
create policy "quant users can view positions" on public.quant_positions for select to authenticated using (public.has_organization_permission(organization_id, 'quant.read') or public.is_platform_administrator());
create policy "quant managers can manage positions" on public.quant_positions for all to authenticated using (public.has_organization_permission(organization_id, 'quant.manage') or public.is_platform_administrator()) with check (public.has_organization_permission(organization_id, 'quant.manage') or public.is_platform_administrator());
create policy "quant users can view risk settings" on public.quant_risk_settings for select to authenticated using (public.has_organization_permission(organization_id, 'quant.read') or public.is_platform_administrator());
create policy "quant managers can manage risk settings" on public.quant_risk_settings for all to authenticated using (public.has_organization_permission(organization_id, 'quant.manage') or public.is_platform_administrator()) with check (public.has_organization_permission(organization_id, 'quant.manage') or public.is_platform_administrator());
create policy "quant users can view signals" on public.quant_signals for select to authenticated using (public.has_organization_permission(organization_id, 'quant.read') or public.is_platform_administrator());
create policy "quant managers can manage signals" on public.quant_signals for all to authenticated using (public.has_organization_permission(organization_id, 'quant.manage') or public.is_platform_administrator()) with check (public.has_organization_permission(organization_id, 'quant.manage') or public.is_platform_administrator());
create policy "quant users can view strategies" on public.quant_strategies for select to authenticated using (public.has_organization_permission(organization_id, 'quant.read') or public.is_platform_administrator());
create policy "quant managers can manage strategies" on public.quant_strategies for all to authenticated using (public.has_organization_permission(organization_id, 'quant.manage') or public.is_platform_administrator()) with check (public.has_organization_permission(organization_id, 'quant.manage') or public.is_platform_administrator());
create policy "quant users can view backtest results" on public.strategy_backtest_results for select to authenticated using (public.has_organization_permission(organization_id, 'quant.read') or public.is_platform_administrator());
create policy "quant managers can manage backtest results" on public.strategy_backtest_results for all to authenticated using (public.has_organization_permission(organization_id, 'quant.manage') or public.is_platform_administrator()) with check (public.has_organization_permission(organization_id, 'quant.manage') or public.is_platform_administrator());
