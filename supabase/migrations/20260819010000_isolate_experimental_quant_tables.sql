-- Quant is experimental and is not part of the active application runtime.
-- Keep the legacy tables for local recovery, but make them inaccessible to
-- client roles until Quant receives its own tenancy and policy design.

revoke all on table public.quant_book_metrics from anon, authenticated;
revoke all on table public.quant_system_health from anon, authenticated;

alter table public.quant_book_metrics enable row level security;
alter table public.quant_system_health enable row level security;
