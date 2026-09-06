-- Synthetic CRM pilot scenarios for local development only.
-- No production data belongs in this file. Each scenario exercises a different
-- path so frontend and API teams can reproduce the same journeys.

do $$
declare
  target_organization_id uuid;
  target_workspace_id uuid;
  target_brand_id uuid;
  owner_id uuid := '00000000-0000-4000-a000-000000000001';
  agent_id uuid := '00000000-0000-4000-a000-000000000002';
begin
  select id into strict target_organization_id from public.organizations where slug = 'estar-protegidos';
  select id into strict target_workspace_id
  from public.workspaces
  where workspaces.organization_id = target_organization_id and suite_key = 'crm' and slug = 'sales-crm';
  select id into strict target_brand_id
  from public.brands
  where brands.organization_id = target_organization_id and name = 'VitaBlue';

  insert into auth.users (id, aud, role, email, encrypted_password, email_confirmed_at)
  values
    (owner_id, 'authenticated', 'authenticated', 'crm-manager@example.test', '', now()),
    (agent_id, 'authenticated', 'authenticated', 'crm-agent@example.test', '', now())
  on conflict (id) do nothing;

  insert into public.organization_memberships (organization_id, user_id, role, status)
  values
    (target_organization_id, owner_id, 'owner', 'active'),
    (target_organization_id, agent_id, 'agent', 'active')
  on conflict (organization_id, user_id) do update set status = 'active';

  insert into public.organization_memberships (organization_id, user_id, role, status)
  select target_organization_id, id, 'owner', 'active'
  from auth.users
  where lower(email) = 'admin@localhost.com'
  on conflict (organization_id, user_id) do update
    set role = excluded.role,
        status = excluded.status;

  -- S1: qualified lead that becomes a won opportunity.
  insert into public.crm_contacts
    (id, organization_id, first_name, last_name, email, phone, company_name)
  values
    ('00000000-0000-4000-a100-000000000001', target_organization_id, 'Ana', 'Garcia',
     'ana.garcia.crm@example.test', '+34610000001', null)
  on conflict (id) do nothing;
  insert into public.crm_leads
    (id, organization_id, contact_id, brand_id, workspace_id, stage, status, source, campaign, assigned_to_user_id)
  values
    ('00000000-0000-4000-a200-000000000001', target_organization_id,
     '00000000-0000-4000-a100-000000000001', target_brand_id, target_workspace_id,
     'won', 'active', 'campaign', 'crm-pilot-health-april', owner_id)
  on conflict (id) do nothing;

  -- S2: contacted lead that does not convert and is marked lost.
  insert into public.crm_contacts
    (id, organization_id, first_name, last_name, email, phone)
  values
    ('00000000-0000-4000-a100-000000000002', target_organization_id, 'Carlos', 'Martin',
     'carlos.martin.crm@example.test', '+34610000002')
  on conflict (id) do nothing;
  insert into public.crm_leads
    (id, organization_id, contact_id, brand_id, workspace_id, stage, status, source, assigned_to_user_id)
  values
    ('00000000-0000-4000-a200-000000000002', target_organization_id,
     '00000000-0000-4000-a100-000000000002', target_brand_id, target_workspace_id,
     'lost', 'inactive', 'manual', agent_id)
  on conflict (id) do nothing;

  -- S3: new lead requiring follow-up before qualification.
  insert into public.crm_contacts
    (id, organization_id, first_name, last_name, email, phone)
  values
    ('00000000-0000-4000-a100-000000000003', target_organization_id, 'Lucia', 'Fernandez',
     'lucia.fernandez.crm@example.test', '+34610000003')
  on conflict (id) do nothing;
  insert into public.crm_leads
    (id, organization_id, contact_id, brand_id, workspace_id, stage, status, source, assigned_to_user_id)
  values
    ('00000000-0000-4000-a200-000000000003', target_organization_id,
     '00000000-0000-4000-a100-000000000003', target_brand_id, target_workspace_id,
     'contacted', 'active', 'whatsapp', agent_id)
  on conflict (id) do nothing;

  -- S4: possible duplicate pair for review; neither is merged automatically.
  insert into public.crm_contacts
    (id, organization_id, first_name, last_name, email, phone)
  values
    ('00000000-0000-4000-a100-000000000004', target_organization_id, 'Marta', 'Ortega',
     'marta.ortega.crm@example.test', '+34610000004'),
    ('00000000-0000-4000-a100-000000000005', target_organization_id, 'Marta', 'Ortega',
     'marta.ortega.alt.crm@example.test', '+34610000005')
  on conflict (id) do nothing;
  insert into public.crm_leads
    (id, organization_id, contact_id, brand_id, workspace_id, stage, status, source, assigned_to_user_id)
  values
    ('00000000-0000-4000-a200-000000000004', target_organization_id,
     '00000000-0000-4000-a100-000000000004', target_brand_id, target_workspace_id,
     'lead', 'active', 'referral', agent_id)
  on conflict (id) do nothing;

  insert into public.crm_pipeline_stages
    (id, organization_id, workspace_id, key, stage_key, label, position, active, terminal_type)
  values
    ('00000000-0000-4000-a310-000000000001', target_organization_id, target_workspace_id,
     'qualified', 'qualified', 'Qualified', 0, true, 'open'),
    ('00000000-0000-4000-a310-000000000002', target_organization_id, target_workspace_id,
     'won', 'won', 'Won', 1, true, 'won'),
    ('00000000-0000-4000-a310-000000000003', target_organization_id, target_workspace_id,
     'lost', 'lost', 'Lost', 2, true, 'lost')
  on conflict (id) do nothing;

  insert into public.crm_opportunities
    (id, organization_id, lead_id, contact_id, brand_id, workspace_id, name, stage, stage_key, product_key, amount, currency, probability)
  values
    ('00000000-0000-4000-a300-000000000001', target_organization_id,
     '00000000-0000-4000-a200-000000000001',
     '00000000-0000-4000-a100-000000000001', target_brand_id, target_workspace_id,
     'Proteccion salud familiar', 'won', 'won', 'salud-familiar', 1250.00, 'EUR', 100),
    ('00000000-0000-4000-a300-000000000002', target_organization_id,
     '00000000-0000-4000-a200-000000000002',
     '00000000-0000-4000-a100-000000000002', target_brand_id, target_workspace_id,
     'Proteccion no convertida', 'lost', 'lost', 'proteccion-no-convertida', 850.00, 'EUR', 0)
  on conflict (id) do nothing;

  insert into public.crm_tasks
    (id, organization_id, lead_id, assigned_to_user_id, title, status, priority, due_at)
  values
    ('00000000-0000-4000-a400-000000000001', target_organization_id,
     '00000000-0000-4000-a200-000000000003', agent_id,
     'Llamar para confirmar necesidades', 'open', 'high', '2026-08-22T10:00:00Z'),
    ('00000000-0000-4000-a400-000000000002', target_organization_id,
     '00000000-0000-4000-a200-000000000002', agent_id,
     'Registrar motivo de perdida', 'completed', 'normal', '2026-08-15T10:00:00Z')
  on conflict (id) do nothing;

  insert into public.crm_notes
    (id, organization_id, contact_id, lead_id, author_user_id, body, visibility)
  values
    ('00000000-0000-4000-a500-000000000001', target_organization_id,
     '00000000-0000-4000-a100-000000000001',
     '00000000-0000-4000-a200-000000000001', owner_id,
     'Cliente convertido; revisar renovacion en seis meses.', 'team'),
    ('00000000-0000-4000-a500-000000000002', target_organization_id,
     '00000000-0000-4000-a100-000000000002',
     '00000000-0000-4000-a200-000000000002', agent_id,
     'No convierte en este ciclo; mantener seguimiento trimestral.', 'private')
  on conflict (id) do nothing;

  insert into public.crm_activities
    (id, organization_id, lead_id, actor_user_id, type, summary, occurred_at)
  values
    ('00000000-0000-4000-a600-000000000001', target_organization_id,
     '00000000-0000-4000-a200-000000000001', owner_id,
     'status_change', 'Lead convertido a oportunidad ganada', now()),
    ('00000000-0000-4000-a600-000000000002', target_organization_id,
     '00000000-0000-4000-a200-000000000002', agent_id,
     'status_change', 'Lead marcado como perdido', now())
  on conflict (id) do nothing;
end;
$$;

-- CRM_LEAD_CONTRACT.md scenarios (Issue #84): source vocabulary, idempotent
-- external identifiers, qualification and product-scoped conversion.
do $$
declare
  target_organization_id uuid;
  target_workspace_id uuid;
  target_brand_id uuid;
  owner_id uuid := '00000000-0000-4000-a000-000000000001';
  agent_id uuid := '00000000-0000-4000-a000-000000000002';
  qualified_lead_id uuid := '00000000-0000-4000-a800-000000000004';
  converted_lead_id uuid := '00000000-0000-4000-a800-000000000005';
begin
  select id into strict target_organization_id from public.organizations where slug = 'estar-protegidos';
  select id into strict target_workspace_id
  from public.workspaces
  where workspaces.organization_id = target_organization_id and suite_key = 'crm' and slug = 'sales-crm';
  select id into strict target_brand_id
  from public.brands
  where brands.organization_id = target_organization_id and name = 'VitaBlue';

  -- L1: manual capture, nuevo, no external attribution.
  insert into public.crm_contacts (id, organization_id, first_name, last_name, email, phone)
  values ('00000000-0000-4000-a700-000000000001', target_organization_id, 'Diego', 'Navarro',
          'diego.navarro.lead@example.test', '+34611000001')
  on conflict (id) do nothing;
  insert into public.crm_leads
    (id, organization_id, contact_id, brand_id, workspace_id, status, source, interest, assigned_to_user_id)
  values
    ('00000000-0000-4000-a800-000000000001', target_organization_id,
     '00000000-0000-4000-a700-000000000001', target_brand_id, target_workspace_id,
     'nuevo', 'manual', 'seguimiento comercial', agent_id)
  on conflict (id) do nothing;

  -- L2: campaign capture with provider/externalId idempotency and UTM.
  insert into public.crm_contacts (id, organization_id, first_name, last_name, email, phone)
  values ('00000000-0000-4000-a700-000000000002', target_organization_id, 'Sofia', 'Molina',
          'sofia.molina.lead@example.test', '+34611000002')
  on conflict (id) do nothing;
  insert into public.crm_leads
    (id, organization_id, contact_id, brand_id, workspace_id, status, source, source_provider,
     external_lead_id, campaign, interest, assigned_to_user_id)
  values
    ('00000000-0000-4000-a800-000000000002', target_organization_id,
     '00000000-0000-4000-a700-000000000002', target_brand_id, target_workspace_id,
     'contactado', 'campaign', 'meta', 'meta-lead-seed-002', 'Campana Salud Abril',
     'seguro salud', agent_id)
  on conflict (id) do nothing;
  insert into public.crm_lead_attributions
    (id, organization_id, lead_id, source, provider, campaign, medium)
  values
    ('00000000-0000-4000-a900-000000000001', target_organization_id,
     '00000000-0000-4000-a800-000000000002', 'campaign', 'meta', 'Campana Salud Abril', 'paid_social')
  on conflict (id) do nothing;

  -- L3: whatsapp_simulated, referral, social and partner sources (pilot
  -- catalog beyond manual/campaign; no real provider is activated).
  insert into public.crm_contacts (id, organization_id, first_name, last_name, email, phone)
  values
    ('00000000-0000-4000-a700-000000000003', target_organization_id, 'Marta', 'Ortega',
     'marta.ortega.lead@example.test', '+34611000003'),
    ('00000000-0000-4000-a700-000000000006', target_organization_id, 'Raul', 'Iglesias',
     'raul.iglesias.lead@example.test', '+34611000006'),
    ('00000000-0000-4000-a700-000000000007', target_organization_id, 'Laura', 'Blanco',
     'laura.blanco.lead@example.test', '+34611000007')
  on conflict (id) do nothing;
  insert into public.crm_leads
    (id, organization_id, contact_id, brand_id, workspace_id, status, source, source_provider,
     external_lead_id, interest, assigned_to_user_id)
  values
    ('00000000-0000-4000-a800-000000000003', target_organization_id,
     '00000000-0000-4000-a700-000000000003', target_brand_id, target_workspace_id,
     'nuevo', 'whatsapp_simulated', 'meta', 'wa-msg-seed-003', 'consulta inicial', agent_id),
    ('00000000-0000-4000-a800-000000000006', target_organization_id,
     '00000000-0000-4000-a700-000000000006', target_brand_id, target_workspace_id,
     'nuevo', 'referral', null, null, 'seguimiento', agent_id),
    ('00000000-0000-4000-a800-000000000007', target_organization_id,
     '00000000-0000-4000-a700-000000000007', target_brand_id, target_workspace_id,
     'nuevo', 'partner', null, null, 'consulta cobertura', owner_id)
  on conflict (id) do nothing;

  -- L4: cualificado, ready for conversion but not converted yet.
  insert into public.crm_contacts (id, organization_id, first_name, last_name, email, phone)
  values ('00000000-0000-4000-a700-000000000004', target_organization_id, 'Pablo', 'Castro',
          'pablo.castro.lead@example.test', '+34611000004')
  on conflict (id) do nothing;
  insert into public.crm_leads
    (id, organization_id, contact_id, brand_id, workspace_id, status, source, interest, assigned_to_user_id)
  values
    (qualified_lead_id, target_organization_id,
     '00000000-0000-4000-a700-000000000004', target_brand_id, target_workspace_id,
     'cualificado', 'campaign', 'seguro hogar', owner_id)
  on conflict (id) do nothing;

  -- L5: convertido, already produced one lead_conversion Opportunity; stays
  -- convertido and can still convert a distinct product key later.
  insert into public.crm_contacts (id, organization_id, first_name, last_name, email, phone)
  values ('00000000-0000-4000-a700-000000000005', target_organization_id, 'Elena', 'Suarez',
          'elena.suarez.lead@example.test', '+34611000005')
  on conflict (id) do nothing;
  insert into public.crm_leads
    (id, organization_id, contact_id, brand_id, workspace_id, status, source, interest, assigned_to_user_id)
  values
    (converted_lead_id, target_organization_id,
     '00000000-0000-4000-a700-000000000005', target_brand_id, target_workspace_id,
     'convertido', 'campaign', 'seguro salud', owner_id)
  on conflict (id) do nothing;
  insert into public.crm_opportunities
    (id, organization_id, lead_id, contact_id, brand_id, workspace_id, name, stage, stage_key, origin, product_key, amount, currency, probability)
  values
    ('00000000-0000-4000-a900-000000000002', target_organization_id,
     converted_lead_id,
     '00000000-0000-4000-a700-000000000005', target_brand_id, target_workspace_id,
     'Proteccion salud familiar', 'qualified', 'qualified', 'lead_conversion', 'health', 1250.00, 'EUR', 45)
  on conflict (id) do nothing;
end;
$$;
