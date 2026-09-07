#!/usr/bin/env node

/**
 * Seed synthetic CRM demo data for local development and visual verification.
 * Populates Contacts, Pipeline Stages, Leads, Opportunities, and Tasks
 * for the organizations in Supabase (LoopDev and Estar Protegidos).
 *
 * References:
 * - GitHub Issue #66: "G0: acordar campos CRM minimos y dataset sintetico"
 * - docs/06-product/crm/fixtures/crm-pilot-contacts.csv
 * - docs/06-product/crm/fixtures/crm-pilot-leads.csv
 * - docs/06-product/crm/fixtures/crm-pilot-pipeline-stages.csv
 * - docs/06-product/crm/fixtures/crm-pilot-opportunities.csv
 * - docs/06-product/crm/fixtures/crm-pilot-work.csv
 */

import { randomUUID } from 'node:crypto';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error(
    'NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required to seed CRM demo data',
  );
}

const headers = {
  apikey: serviceRoleKey,
  Authorization: `Bearer ${serviceRoleKey}`,
  'Content-Type': 'application/json',
  Prefer: 'return=representation,resolution=merge-duplicates',
};

async function api(path, method = 'GET', body = null) {
  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);
  const response = await fetch(`${supabaseUrl}/rest/v1${path}`, options);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API error ${response.status} on ${method} ${path}: ${errorText}`);
  }
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

// Stage templates
const STAGES = [
  { stage_key: 'lead', label: 'Lead Nuevo', position: 0, active: true, terminal_type: 'open', is_terminal: false },
  { stage_key: 'contactado', label: 'Contactado', position: 1, active: true, terminal_type: 'open', is_terminal: false },
  { stage_key: 'qualified', label: 'Cualificado', position: 2, active: true, terminal_type: 'open', is_terminal: false },
  { stage_key: 'propuesta', label: 'Propuesta', position: 3, active: true, terminal_type: 'open', is_terminal: false },
  { stage_key: 'negociacion', label: 'Negociación', position: 4, active: true, terminal_type: 'open', is_terminal: false },
  { stage_key: 'won', label: 'Ganado', position: 5, active: true, terminal_type: 'won', is_terminal: true },
  { stage_key: 'lost', label: 'Perdido', position: 6, active: true, terminal_type: 'lost', is_terminal: true },
];

// Contacts templates
const CONTACTS_DATA = [
  { first_name: 'Ana', last_name: 'García López', email: 'ana.garcia@acmeindustries.es', phone: '+34610000001', company_name: 'Acme Industries' },
  { first_name: 'Carlos', last_name: 'Martín Sanz', email: 'carlos.martin@northstarhealth.es', phone: '+34610000002', company_name: 'Northstar Health' },
  { first_name: 'Lucía', last_name: 'Fernández Ruiz', email: 'lucia.fernandez@studiomeridian.com', phone: '+34610000003', company_name: 'Studio Meridian' },
  { first_name: 'Diego', last_name: 'Navarro Gil', email: 'diego.navarro@techcorp.es', phone: '+34610000004', company_name: 'TechCorp Solutions' },
  { first_name: 'Marta', last_name: 'Ortega Vidal', email: 'marta.ortega@grupoinnova.es', phone: '+34610000005', company_name: 'Grupo Innova' },
  { first_name: 'José', last_name: 'Lorenzo Marín', email: 'jose.lorenzo@lorenzoconsulting.com', phone: '+34610000006', company_name: 'Lorenzo Consulting' },
  { first_name: 'Sofía', last_name: 'Molina Cano', email: 'sofia.molina@solucionesdigitales.es', phone: '+34610000007', company_name: 'Soluciones Digitales' },
  { first_name: 'Pablo', last_name: 'Castro Rey', email: 'pablo.castro@reyasociados.es', phone: '+34610000008', company_name: 'Rey & Asociados' },
  { first_name: 'Elena', last_name: 'Suárez Díaz', email: 'elena.suarez@medtechglobal.com', phone: '+34610000011', company_name: 'MedTech Global' },
  { first_name: 'Raúl', last_name: 'Iglesias Prat', email: 'raul.iglesias@iglesiaslogistics.es', phone: '+34610000012', company_name: 'Iglesias Logistics' },
  { first_name: 'Laura', last_name: 'Blanco Soler', email: 'laura.blanco@blancomedia.com', phone: '+34610000013', company_name: 'Blanco Media' },
  { first_name: 'Alberto', last_name: 'Ramos Serra', email: 'alberto.ramos@ramosseguros.es', phone: '+34610000014', company_name: 'Ramos Seguros' },
];

async function seedOrganization(org) {
  console.log(`\n========================================`);
  console.log(`🌱 Seeding Organization: ${org.name} (${org.slug})`);
  console.log(`========================================`);

  // 1. Get or resolve workspace
  const workspaces = await api(`/workspaces?organization_id=eq.${org.id}&suite_key=eq.crm`);
  const workspace = workspaces[0] || null;
  const workspaceId = workspace?.id || null;

  // 2. Get or resolve brand
  const brands = await api(`/brands?organization_id=eq.${org.id}`);
  const brand = brands[0] || null;
  const brandId = brand?.id || null;

  console.log(`Workspace ID: ${workspaceId}, Brand ID: ${brandId}`);

  // 3. Upsert Pipeline Stages
  console.log(`\n1. Creating Pipeline Stages...`);
  for (const s of STAGES) {
    const stagePayload = {
      organization_id: org.id,
      workspace_id: workspaceId,
      key: s.stage_key,
      stage_key: s.stage_key,
      label: s.label,
      position: s.position,
      active: s.active,
      terminal_type: s.terminal_type,
      is_terminal: s.is_terminal,
    };
    // Check if stage already exists
    const existing = await api(`/crm_pipeline_stages?organization_id=eq.${org.id}&stage_key=eq.${s.stage_key}`);
    if (existing.length > 0) {
      await api(`/crm_pipeline_stages?id=eq.${existing[0].id}`, 'PATCH', stagePayload);
      console.log(`  ✓ Updated stage: ${s.label} (${s.stage_key})`);
    } else {
      await api(`/crm_pipeline_stages`, 'POST', stagePayload);
      console.log(`  + Created stage: ${s.label} (${s.stage_key})`);
    }
  }

  // 4. Create Contacts
  console.log(`\n2. Creating Contacts...`);
  const createdContacts = [];
  for (const c of CONTACTS_DATA) {
    const existing = await api(`/crm_contacts?organization_id=eq.${org.id}&email=eq.${c.email}`);
    if (existing.length > 0) {
      createdContacts.push(existing[0]);
      console.log(`  ✓ Contact exists: ${c.first_name} ${c.last_name}`);
    } else {
      const payload = {
        id: randomUUID(),
        organization_id: org.id,
        first_name: c.first_name,
        last_name: c.last_name,
        email: c.email,
        phone: c.phone,
        company_name: c.company_name,
      };
      const [contact] = await api(`/crm_contacts`, 'POST', payload);
      createdContacts.push(contact);
      console.log(`  + Created contact: ${c.first_name} ${c.last_name} (${contact.id})`);
    }
  }

  // 5. Create Leads
  console.log(`\n3. Creating Leads...`);
  const LEADS_PLAN = [
    { contactIdx: 0, status: 'nuevo', stage: 'lead', source: 'manual', interest: 'Seguro de salud para directivos' },
    { contactIdx: 1, status: 'contactado', stage: 'contacted', source: 'campaign', campaign: 'Campaña Salud 2026', interest: 'Póliza colectiva PYME' },
    { contactIdx: 2, status: 'cualificado', stage: 'proposal', source: 'whatsapp_simulated', interest: 'Plan familiar ampliado' },
    { contactIdx: 3, status: 'convertido', stage: 'won', source: 'campaign', campaign: 'Meta Ads Retargeting', interest: 'Protección integral' },
    { contactIdx: 4, status: 'nuevo', stage: 'lead', source: 'referral', interest: 'Consultoría de cobertura' },
    { contactIdx: 5, status: 'cualificado', stage: 'proposal', source: 'partner', interest: 'Seguro médico corporativo' },
    { contactIdx: 6, status: 'contactado', stage: 'contacted', source: 'manual', interest: 'Ampliación dental y óptica' },
    { contactIdx: 7, status: 'convertido', stage: 'won', source: 'campaign', campaign: 'Google Search Paid', interest: 'Póliza ejecutiva sénior' },
  ];

  const createdLeads = [];
  for (let i = 0; i < LEADS_PLAN.length; i++) {
    const plan = LEADS_PLAN[i];
    const contact = createdContacts[plan.contactIdx];
    if (!contact) continue;

    const existing = await api(`/crm_leads?organization_id=eq.${org.id}&contact_id=eq.${contact.id}`);
    if (existing.length > 0) {
      createdLeads.push(existing[0]);
      console.log(`  ✓ Lead exists for contact: ${contact.first_name}`);
    } else {
      const payload = {
        id: randomUUID(),
        organization_id: org.id,
        workspace_id: workspaceId,
        brand_id: brandId,
        contact_id: contact.id,
        status: plan.status,
        stage: plan.stage,
        source: plan.source,
        campaign: plan.campaign || null,
        interest: plan.interest,
      };
      const [lead] = await api(`/crm_leads`, 'POST', payload);
      createdLeads.push(lead);
      console.log(`  + Created lead: ${plan.interest} for ${contact.first_name} (${lead.id})`);

      // Add attribution if campaign
      if (plan.campaign) {
        await api(`/crm_lead_attributions`, 'POST', {
          id: randomUUID(),
          organization_id: org.id,
          lead_id: lead.id,
          source: plan.source,
          campaign: plan.campaign,
          medium: 'paid_social',
        }).catch(() => null);
      }
    }
  }

  // 6. Create Opportunities
  console.log(`\n4. Creating Opportunities...`);
  const OPPS_PLAN = [
    {
      contactIdx: 0,
      leadIdx: 0,
      name: 'Plan Salud Directivos Acme',
      stage_key: 'lead',
      stage: 'lead',
      amount: 1450,
      probability: 20,
      product_key: 'salud-directivos',
      expected_close_at: new Date(Date.now() + 30 * 86400000).toISOString(),
    },
    {
      contactIdx: 1,
      leadIdx: 1,
      name: 'Póliza Colectiva Northstar (15 pax)',
      stage_key: 'contactado',
      stage: 'contactado',
      amount: 4800,
      probability: 40,
      product_key: 'salud-colectiva',
      expected_close_at: new Date(Date.now() + 20 * 86400000).toISOString(),
    },
    {
      contactIdx: 2,
      leadIdx: 2,
      name: 'Protección Familiar Meridian',
      stage_key: 'qualified',
      stage: 'qualified',
      amount: 1850,
      probability: 60,
      product_key: 'salud-familiar',
      expected_close_at: new Date(Date.now() + 14 * 86400000).toISOString(),
    },
    {
      contactIdx: 3,
      leadIdx: 3,
      name: 'Póliza Protección Integral TechCorp',
      stage_key: 'propuesta',
      stage: 'propuesta',
      amount: 3200,
      probability: 75,
      product_key: 'proteccion-integral',
      expected_close_at: new Date(Date.now() + 7 * 86400000).toISOString(),
    },
    {
      contactIdx: 5,
      leadIdx: 5,
      name: 'Seguro Corporativo Lorenzo Consulting',
      stage_key: 'negociacion',
      stage: 'negociacion',
      amount: 6500,
      probability: 85,
      product_key: 'corporativo-salud',
      expected_close_at: new Date(Date.now() + 3 * 86400000).toISOString(),
    },
    {
      contactIdx: 7,
      leadIdx: 7,
      name: 'Póliza Ejecutiva Sénior Rey & Asoc',
      stage_key: 'won',
      stage: 'won',
      amount: 2950,
      probability: 100,
      product_key: 'ejecutiva-senior',
      expected_close_at: new Date(Date.now() - 5 * 86400000).toISOString(),
    },
    {
      contactIdx: 4,
      leadIdx: 4,
      name: 'Auditoría Pólizas Colectivas Sol',
      stage_key: 'lead',
      stage: 'lead',
      amount: 2200,
      probability: 25,
      product_key: 'salud-directivos',
      expected_close_at: new Date(Date.now() + 25 * 86400000).toISOString(),
    },
    {
      contactIdx: 6,
      leadIdx: 6,
      name: 'Ampliación Dental y Óptica Nova',
      stage_key: 'contactado',
      stage: 'contactado',
      amount: 3400,
      probability: 45,
      product_key: 'dental-optica',
      expected_close_at: new Date(Date.now() + 18 * 86400000).toISOString(),
    },
    {
      contactIdx: 8,
      leadIdx: null,
      name: 'Póliza Directiva Multirriesgo Sigma',
      stage_key: 'qualified',
      stage: 'qualified',
      amount: 5100,
      probability: 65,
      product_key: 'salud-familiar',
      expected_close_at: new Date(Date.now() + 12 * 86400000).toISOString(),
    },
    {
      contactIdx: 9,
      leadIdx: null,
      name: 'Plan Bienestar y Salud Mental Grupo 10',
      stage_key: 'propuesta',
      stage: 'propuesta',
      amount: 4200,
      probability: 70,
      product_key: 'proteccion-integral',
      expected_close_at: new Date(Date.now() + 9 * 86400000).toISOString(),
    },
    {
      contactIdx: 10,
      leadIdx: null,
      name: 'Renovación Póliza Flota Logística Trans',
      stage_key: 'negociacion',
      stage: 'negociacion',
      amount: 8900,
      probability: 90,
      product_key: 'corporativo-salud',
      expected_close_at: new Date(Date.now() + 2 * 86400000).toISOString(),
    },
    {
      contactIdx: 11,
      leadIdx: null,
      name: 'Cobertura Integral Directivos Grupo Norte',
      stage_key: 'won',
      stage: 'won',
      amount: 7600,
      probability: 100,
      product_key: 'ejecutiva-senior',
      expected_close_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    },
    {
      contactIdx: 12,
      leadIdx: null,
      name: 'Seguro Colectivo Comercio Descartado',
      stage_key: 'lost',
      stage: 'lost',
      amount: 1900,
      probability: 0,
      product_key: 'salud-colectiva',
      expected_close_at: new Date(Date.now() - 10 * 86400000).toISOString(),
    },
  ];

  const createdOpps = [];
  for (const opp of OPPS_PLAN) {
    const contact = createdContacts[opp.contactIdx];
    const lead = createdLeads[opp.leadIdx] || null;
    if (!contact) continue;

    const existing = await api(`/crm_opportunities?organization_id=eq.${org.id}&name=eq.${encodeURIComponent(opp.name)}`);
    if (existing.length > 0) {
      createdOpps.push(existing[0]);
      console.log(`  ✓ Opportunity exists: ${opp.name}`);
    } else {
      const payload = {
        id: randomUUID(),
        organization_id: org.id,
        workspace_id: workspaceId,
        brand_id: brandId,
        contact_id: contact.id,
        lead_id: lead?.id || null,
        name: opp.name,
        stage: opp.stage,
        stage_key: opp.stage_key,
        origin: lead ? 'lead_conversion' : 'manual',
        product_key: opp.product_key,
        amount: opp.amount,
        currency: 'EUR',
        probability: opp.probability,
        expected_close_at: opp.expected_close_at,
      };
      const [created] = await api(`/crm_opportunities`, 'POST', payload);
      createdOpps.push(created);
      console.log(`  + Created opportunity: ${opp.name} (${opp.amount} €) -> [${opp.stage_key}]`);
    }
  }

  // 7. Create Tasks
  console.log(`\n5. Creating Tasks...`);
  const now = Date.now();
  const todayAt16 = new Date();
  todayAt16.setHours(16, 0, 0, 0);

  const TASKS_PLAN = [
    {
      title: 'Confirmar datos de contacto y necesidades',
      relation_type: 'contact',
      getRelationId: () => createdContacts[0]?.id,
      priority: 'high',
      status: 'open',
      due_at: todayAt16.toISOString(),
      type: 'call',
      description: 'Llamar a Ana para verificar los miembros de la póliza de salud.',
    },
    {
      title: 'Preparar propuesta detallada para Northstar',
      relation_type: 'opportunity',
      getRelationId: () => createdOpps[1]?.id || createdContacts[1]?.id,
      priority: 'urgent',
      status: 'open',
      due_at: todayAt16.toISOString(),
      type: 'proposal',
      description: 'Enviar propuesta con descuento por colectivo de 15 empleados.',
    },
    {
      title: 'Llamada de seguimiento demo TechCorp',
      relation_type: 'lead',
      getRelationId: () => createdLeads[3]?.id || createdContacts[3]?.id,
      priority: 'normal',
      status: 'completed',
      due_at: new Date(now - 86400000).toISOString(),
      completed_at: new Date(now - 3600000).toISOString(),
      type: 'call',
      description: 'Demo presentada con éxito; solicitan propuesta formal.',
    },
    {
      title: 'Reactivar oportunidad estancada - Grupo Innova',
      relation_type: 'opportunity',
      getRelationId: () => createdOpps[2]?.id || createdContacts[4]?.id,
      priority: 'high',
      status: 'open',
      due_at: new Date(now - 2 * 86400000).toISOString(), // Overdue
      type: 'follow_up',
      description: 'Sin respuesta desde hace 10 días. Proponer llamada con el especialista.',
    },
    {
      title: 'Seguimiento inicial por WhatsApp a Lucía',
      relation_type: 'lead',
      getRelationId: () => createdLeads[2]?.id || createdContacts[2]?.id,
      priority: 'urgent',
      status: 'open',
      due_at: new Date(now - 86400000).toISOString(), // Overdue
      type: 'message',
      description: 'Responder duda sobre copagos en hospitales concertados.',
    },
    {
      title: 'Enviar comparativa de pólizas corporativas',
      relation_type: 'opportunity',
      getRelationId: () => createdOpps[4]?.id || createdContacts[5]?.id,
      priority: 'normal',
      status: 'open',
      due_at: new Date(now + 3 * 86400000).toISOString(), // Upcoming
      type: 'email',
      description: 'Adjuntar tabla comparativa de coberturas dentales y reembolso internacional.',
    },
    {
      title: 'Cierre formal y emisión de póliza ejecutiva',
      relation_type: 'opportunity',
      getRelationId: () => createdOpps[5]?.id || createdContacts[7]?.id,
      priority: 'normal',
      status: 'completed',
      due_at: new Date(now - 4 * 86400000).toISOString(),
      completed_at: new Date(now - 4 * 86400000).toISOString(),
      type: 'contract',
      description: 'Contrato firmado digitalmente y póliza activada.',
    },
    {
      title: 'Revisar documentación de titular y beneficiarios',
      relation_type: 'contact',
      getRelationId: () => createdContacts[6]?.id,
      priority: 'low',
      status: 'open',
      due_at: new Date(now + 5 * 86400000).toISOString(), // Upcoming
      type: 'verification',
      description: 'Comprobar DNI y libro de familia antes del alta.',
    },
  ];

  for (const task of TASKS_PLAN) {
    const relationId = task.getRelationId();
    if (!relationId) continue;

    const existing = await api(`/crm_tasks?organization_id=eq.${org.id}&title=eq.${encodeURIComponent(task.title)}`);
    if (existing.length > 0) {
      console.log(`  ✓ Task exists: ${task.title}`);
    } else {
      const payload = {
        id: randomUUID(),
        organization_id: org.id,
        workspace_id: workspaceId,
        brand_id: brandId,
        relation_type: task.relation_type,
        relation_id: relationId,
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status,
        type: task.type,
        due_at: task.due_at,
        completed_at: task.completed_at || null,
        version: 1,
      };
      const [created] = await api(`/crm_tasks`, 'POST', payload);
      console.log(`  + Created task: [${task.priority}] ${task.title} (${task.status})`);
    }
  }

  // 8. Create Notes & Activities for Customer 360
  console.log(`\n6. Creating Notes & Activities for Customer 360...`);
  for (let i = 0; i < Math.min(createdContacts.length, 3); i++) {
    const contact = createdContacts[i];
    const existingNotes = await api(`/crm_notes?organization_id=eq.${org.id}&contact_id=eq.${contact.id}`);
    if (existingNotes.length === 0) {
      await api(`/crm_notes`, 'POST', {
        id: randomUUID(),
        organization_id: org.id,
        workspace_id: workspaceId,
        contact_id: contact.id,
        relation_type: 'contact',
        relation_id: contact.id,
        author_user_id: '07b3b75e-68dd-48c6-900b-8be98150375f', // admin@localhost.com
        body: `Nota comercial: El cliente ${contact.first_name} tiene gran interés en la cobertura dental y hospitalaria para su familia. Mantener seguimiento prioritario.`,
        visibility: 'team',
        version: 1,
      }).catch(err => console.log('    (Note skip: ' + err.message + ')'));
      console.log(`  + Created note for ${contact.first_name}`);
    }
  }

  console.log(`\n✨ Finished seeding ${org.name}!`);
}

async function main() {
  console.log(`🚀 Starting CRM Demo Data Seeding`);
  console.log(`Supabase URL: ${supabaseUrl}`);

  const orgs = await api(`/organizations?is_active=eq.true`);
  console.log(`Found ${orgs.length} active organizations: ${orgs.map(o => o.name).join(', ')}`);

  for (const org of orgs) {
    if (org.slug === 'loopdev' || org.slug === 'estar-protegidos') {
      await seedOrganization(org);
    }
  }

  console.log(`\n========================================`);
  console.log(`🎉 All demo data successfully seeded!`);
  console.log(`========================================`);
}

main().catch(err => {
  console.error('\n❌ Seeding failed:', err);
  process.exit(1);
});
