-- Avoid recursive RLS evaluation while the client detects its own
-- platform-administrator status.

drop policy if exists "platform administrators can view platform administrators"
  on public.platform_administrators;

create policy "platform administrators can view their own administrator record"
on public.platform_administrators
for select
to authenticated
using (user_id = auth.uid());
