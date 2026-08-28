-- CRM Lead contract alignment (Issue #84, CRM_LEAD_CONTRACT.md v1.0).
-- Additive: existing crm_leads/crm_opportunities rows remain valid. Check
-- constraints widen to accept the newly approved vocabulary; nothing
-- previously stored is invalidated or rewritten. crm_opportunities.stage has
-- no fixed check constraint, so the stable conversion stage id ('qualified')
-- is already an accepted value and requires no schema change.

alter table public.crm_leads
  drop constraint if exists crm_leads_status_check;
alter table public.crm_leads
  add constraint crm_leads_status_check
  check (status in (
    -- legacy prototype values, preserved for existing rows
    'active', 'inactive', 'stalled',
    -- CRM_LEAD_CONTRACT.md approved Lead status
    'nuevo', 'contactado', 'cualificado', 'estancado', 'inactivo', 'convertido'
  ));

alter table public.crm_leads
  drop constraint if exists crm_leads_source_check;
alter table public.crm_leads
  add constraint crm_leads_source_check
  check (source in (
    -- legacy prototype values, preserved for existing rows
    'manual', 'website', 'facebook', 'instagram', 'whatsapp', 'email', 'referral', 'campaign', 'other',
    -- CRM_LEAD_CONTRACT.md approved LeadSource.kind values not already covered above
    'whatsapp_simulated', 'social', 'partner'
  ));

-- Free-text interest/product captured at lead creation (Lead.interest).
alter table public.crm_leads
  add column if not exists interest text;

-- Provider half of LeadSource; source/external_lead_id already exist and
-- keep enforcing idempotency per organization+source+external id.
alter table public.crm_leads
  add column if not exists source_provider text;

alter table public.crm_lead_attributions
  add column if not exists provider text;

create index if not exists crm_leads_status_idx
  on public.crm_leads(organization_id, workspace_id, status);

-- Conversion Opportunity origin and normalized product/interest key. The
-- default 'manual' is correct for every previously seeded/manual Opportunity.
alter table public.crm_opportunities
  add column if not exists origin text not null default 'manual';
alter table public.crm_opportunities
  add column if not exists product_key text;

alter table public.crm_opportunities
  drop constraint if exists crm_opportunities_origin_check;
alter table public.crm_opportunities
  add constraint crm_opportunities_origin_check
  check (origin in ('manual', 'lead_conversion'));

-- CRM_LEAD_CONTRACT.md: "the database must enforce uniqueness for the
-- conversion tuple (tenant, lead, product_key, origin=lead_conversion)".
create unique index if not exists crm_opportunities_lead_conversion_key
  on public.crm_opportunities(organization_id, lead_id, product_key)
  where origin = 'lead_conversion';
