-- Exchange credentials are server-side secrets. Browser clients cannot query
-- or mutate quant_exchanges; authenticated API routes authorize the actor and
-- use the service role only after that permission check.

revoke all on public.quant_exchanges from anon;
revoke all on public.quant_exchanges from authenticated;

drop policy if exists "quant users can view exchanges" on public.quant_exchanges;
drop policy if exists "quant managers can manage exchanges" on public.quant_exchanges;
