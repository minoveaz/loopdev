-- Controlled retries for outbound communication messages.
alter table public.communication_messages
  add column if not exists retry_count integer not null default 0,
  add column if not exists max_retries integer not null default 3,
  add column if not exists next_retry_at timestamptz,
  add column if not exists last_error_code text;

alter table public.communication_messages
  drop constraint if exists communication_messages_retry_bounds_check;

alter table public.communication_messages
  add constraint communication_messages_retry_bounds_check
  check (retry_count >= 0 and max_retries between 0 and 3 and retry_count <= max_retries);

create index if not exists communication_messages_retry_queue_idx
  on public.communication_messages(status, next_retry_at)
  where status = 'failed' and next_retry_at is not null;
