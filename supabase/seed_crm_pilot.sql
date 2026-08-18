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

  insert into public.crm_opportunities
    (id, organization_id, lead_id, workspace_id, name, stage, amount, currency, probability)
  values
    ('00000000-0000-4000-a300-000000000001', target_organization_id,
     '00000000-0000-4000-a200-000000000001', target_workspace_id,
     'Proteccion salud familiar', 'won', 1250.00, 'EUR', 100),
    ('00000000-0000-4000-a300-000000000002', target_organization_id,
     '00000000-0000-4000-a200-000000000002', target_workspace_id,
     'Proteccion no convertida', 'lost', 850.00, 'EUR', 0)
  on conflict (id) do nothing;

  insert into public.crm_tasks
    (id, organization_id, lead_id, assigned_to_user_id, title, status, priority, due_at)
  values
    ('00000000-0000-4000-a400-000000000001', target_organization_id,
     '00000000-0000-4000-a200-000000000003', agent_id,
     'Llamar para confirmar necesidades', 'pending', 'high', '2026-08-22T10:00:00Z'),
    ('00000000-0000-4000-a400-000000000002', target_organization_id,
     '00000000-0000-4000-a200-000000000002', agent_id,
     'Registrar motivo de perdida', 'completed', 'medium', '2026-08-15T10:00:00Z')
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
