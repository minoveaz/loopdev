-- External lead identifiers make provider retries idempotent per organization.
alter table public.crm_leads
  add column if not exists external_lead_id text;

create unique index if not exists crm_leads_external_id_idx
  on public.crm_leads(organization_id, source, external_lead_id)
  where external_lead_id is not null;
