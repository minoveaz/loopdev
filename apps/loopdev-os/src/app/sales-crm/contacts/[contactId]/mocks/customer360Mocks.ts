export const MOCK_OPPORTUNITIES = [
  {
    id: 'sim-opp-1',
    name: 'Enterprise Multi-Seat Expansion',
    stageKey: 'proposal',
    amount: 48000,
    currency: 'EUR',
    isSimulated: true,
  },
  {
    id: 'sim-opp-2',
    name: 'Quant Ops Real-Time Addon',
    stageKey: 'qualified',
    amount: 14500,
    currency: 'EUR',
    isSimulated: true,
  },
];

export const MOCK_TASKS = [
  {
    id: 'sim-task-1',
    title: 'Revisión de SLA Corporativo con equipo legal',
    status: 'pending',
    priority: 'high',
    isSimulated: true,
  },
  {
    id: 'sim-task-2',
    title: 'Demostración técnica de Quant Ops API',
    status: 'in_progress',
    priority: 'medium',
    isSimulated: true,
  },
];

export const MOCK_TIMELINE = [
  {
    source: { sourceId: 'sim-src-1' },
    kind: 'event' as const,
    event: {
      summary: 'Propuesta comercial v2.4 enviada y visualizada',
      occurredAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    },
    isSimulated: true,
  },
  {
    source: { sourceId: 'sim-src-2' },
    kind: 'event' as const,
    event: {
      summary: 'Executive Alignment Call (45 min) con Tech Lead',
      occurredAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    },
    isSimulated: true,
  },
  {
    source: { sourceId: 'sim-src-3' },
    kind: 'event' as const,
    event: {
      summary: 'Nota de prospección: Presupuesto Q3 aprobado para migración',
      occurredAt: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
    },
    isSimulated: true,
  },
];

export const MOCK_NOTES = [
  {
    id: 'sim-note-1',
    body: 'El cliente solicita soporte dedicado 24/7 y despliegue multi-región en Europa Central. Contrato objetivo a 24 meses.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    isSimulated: true,
  },
];

export const MOCK_LEADS = [
  {
    id: 'sim-lead-1',
    status: 'cualificado',
    interest: 'Inbound Enterprise SaaS Q3',
    source: { kind: 'web_form' },
    isSimulated: true,
  },
];
