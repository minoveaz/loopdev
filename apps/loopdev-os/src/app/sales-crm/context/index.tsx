'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

export type LeadLabel = 'Hot Lead' | 'VIP' | 'Follow-up' | 'Docs Pendientes' | 'Urgente' | 'Enterprise';

export const AVAILABLE_ASSIGNEES = ['Elena Gómez', 'Carlos Ruiz', 'María López', 'Andrés Torres'] as const;
export const AVAILABLE_LABELS: LeadLabel[] = ['Hot Lead', 'VIP', 'Follow-up', 'Docs Pendientes', 'Urgente', 'Enterprise'];

export interface ActivityLogEntry {
  timestamp: string;
  actor: string;
  type: 'NOTE' | 'CALL' | 'STATUS_CHANGE' | 'TASK_CREATED' | 'TASK_COMPLETED' | 'GENERIC' | 'DOCUMENT';
  action: string;
  details?: string;
  category?: 'general' | 'requirement' | 'pain_point' | 'budget';
  pinned?: boolean;
}

export interface LeadTask {
  id: string;
  title: string;
  description?: string;
  status: 'Pending' | 'Completed';
  dueDate: string;
  completedAt?: string;
  priority?: 'high' | 'medium' | 'low';
}

export interface LeadDocument {
  id: string;
  name: string;
  category: string;
  size: number;
  uploadedAt: string;
  status: 'verified' | 'pending' | 'error';
}

export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  dealValue: number;
  stage: 'lead' | 'contacted' | 'proposal' | 'negotiation' | 'won' | 'lost' | 'rejected' | 'discarded';
  status: 'active' | 'inactive' | 'stalled';
  assignee: string;
  labels: LeadLabel[];
  aiScore: number;
  aiInsights: string;
  avatarUrl?: string;
  lastContactDate: string;
  notes: string;
  interestedPlan?: string;
  hasGeneratedPdf?: boolean;
  hasAiAssistance?: boolean;
  relatedQuotesCount?: number;
  activityLog?: ActivityLogEntry[];
  tasks?: LeadTask[];
  documents?: LeadDocument[];
  whatsAppConversation?: string;
  closureReason?: string;
  closureDetails?: string;
  history: Array<{
    date: string;
    action: string;
    actor: string;
  }>;
  expectedCloseDate?: string;
  winProbability?: number;
  leadSourceType?: 'facebook_ads' | 'google_ads' | 'landing_page' | 'partner_referral' | 'client_referral' | 'organic';
  leadSourceCampaign?: string;
  leadSourceReferrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  // B2C Onboarding Expanded Fields
  dni?: string;
  birthDate?: string;
  gender?: string;
  maritalStatus?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  height?: number;
  weight?: number;
  smoker?: string;
  preExistingConditions?: string;
  medicalNotes?: string;
  annualPremium?: number;
  billingCycle?: string;
  contractType?: string;
  deviceType?: string;
  browser?: string;
  simulatedIp?: string;
  landingVisits?: number;
}

interface SalesCrmContextType {
  selectedLeadId: string | null;
  selectedLead: Lead | null;
  isInspectorOpen: boolean;
  openLeadInspector: (leadId: string) => void;
  closeInspector: () => void;
  leads: Lead[];
  updateLeadStage: (leadId: string, newStage: Lead['stage']) => void;
  addLead: (lead: Omit<Lead, 'id' | 'aiScore' | 'aiInsights' | 'history'>) => void;
  updateLead: (updatedLead: Lead) => void;
  // AI Budget Generator States
  generatingLeadId: string | null;
  setGeneratingLeadId: (id: string | null) => void;
  isGeneratingBudget: boolean;
  setIsGeneratingBudget: (val: boolean) => void;
  isPreviewingPdf: boolean;
  setIsPreviewingPdf: (val: boolean) => void;
  triggerAiBudget: (leadId: string) => void;
  completeBudgetGeneration: (leadId: string) => void;
}

const SalesCrmContext = createContext<SalesCrmContextType | undefined>(undefined);

// Initial mockup data
const INITIAL_LEADS: Lead[] = [
  {
    id: 'L-101',
    name: 'Carlos Mendoza',
    company: 'Logística Continental',
    email: 'carlos.m@log-continental.com',
    phone: '+57 312 456 7890',
    dealValue: 1250000,
    stage: 'negotiation',
    status: 'active',
    assignee: 'Elena Gómez',
    labels: ['Hot Lead', 'Enterprise'],
    aiScore: 92,
    aiInsights: 'El cliente muestra alta intención de compra tras recibir el demo de Brand Hub. Riesgo de competidores medio.',
    lastContactDate: '2026-07-15',
    notes: 'Solicitó cotización detallada de las licencias anuales de Marketing Studio.',
    interestedPlan: 'Plan Familiar Completo',
    hasGeneratedPdf: true,
    hasAiAssistance: true,
    relatedQuotesCount: 1,
    whatsAppConversation: 'Asesor: Hola Carlos, gusto en saludarte.\nCarlos: Hola Elena, igualmente. ¿Tienen disponible el Plan Familiar Completo?\nAsesor: Sí, por supuesto, cubre hospitalización al 100% y copagos cero.',
    activityLog: [
      {
        timestamp: '2026-07-15T15:30:00Z',
        actor: 'Elena Gómez',
        type: 'NOTE',
        action: 'Minuta de llamada técnica',
        details: 'El cliente solicita descuento en la prima de copagos corporativos. Se acuerda revisar plan.'
      },
      {
        timestamp: '2026-07-14T11:00:00Z',
        actor: 'Elena Gómez',
        type: 'CALL',
        action: 'Llamada de Seguimiento',
        details: 'Resultado: Contestó. Se aclararon dudas sobre exclusiones del seguro médico.'
      },
      {
        timestamp: '2026-07-12T09:30:00Z',
        actor: 'Inbound Bot',
        type: 'GENERIC',
        action: 'EMAIL_SENT',
        details: 'Asunto: "Bienvenido a LoopDev Salud - Primeros Pasos"'
      },
      {
        timestamp: '2026-07-10T14:00:00Z',
        actor: 'System',
        type: 'STATUS_CHANGE',
        action: 'Etapa inicial establecida: LEAD'
      }
    ],
    tasks: [
      {
        id: 'T-101',
        title: 'Enviar cotización formal con descuento corporativo',
        description: 'Aplicar el 15% de descuento correspondiente al convenio de Logística Continental.',
        status: 'Pending',
        dueDate: '2026-07-20T17:00:00Z'
      },
      {
        id: 'T-102',
        title: 'Llamada de demostración de coberturas premium',
        description: 'Explicar las coberturas internacionales y reembolsos de farmacia.',
        status: 'Completed',
        dueDate: '2026-07-12T10:00:00Z',
        completedAt: '2026-07-12T11:30:00Z'
      }
    ],
    documents: [
      {
        id: 'D-101',
        name: 'DNI_CarlosMendoza.pdf',
        category: 'Identificación',
        size: 1450200,
        uploadedAt: '2026-07-14T09:15:00Z',
        status: 'verified'
      },
      {
        id: 'D-102',
        name: 'Soporte_Ingresos_Logistica.pdf',
        category: 'Financiero',
        size: 2310400,
        uploadedAt: '2026-07-14T09:16:00Z',
        status: 'pending'
      }
    ],
    history: [
      { date: '2026-07-10', action: 'Lead registrado en campaña', actor: 'Inbound Bot' },
      { date: '2026-07-12', action: 'Llamada de demo realizada', actor: 'Elena Gómez (Sales)' },
      { date: '2026-07-15', action: 'Propuesta comercial enviada', actor: 'Elena Gómez (Sales)' }
    ],
    expectedCloseDate: '2026-08-15',
    winProbability: 80,
    leadSourceType: 'google_ads',
    leadSourceCampaign: 'Seguros Médicos Inbound Colombiano',
    utmSource: 'google',
    utmMedium: 'cpc',
    utmCampaign: 'seguros_salud_inbound_2026'
  },
  {
    id: 'L-102',
    name: 'Ana Sofía Restrepo',
    company: 'Fintech Valle',
    email: 'ana.restrepo@fintechvalle.co',
    phone: '+57 300 765 4321',
    dealValue: 850000,
    stage: 'proposal',
    status: 'active',
    assignee: 'Carlos Ruiz',
    labels: ['Follow-up', 'Docs Pendientes'],
    aiScore: 78,
    aiInsights: 'Foco en el módulo de Quant Ops para automatizar trading corporativo. El presupuesto está aprobado.',
    lastContactDate: '2026-07-16',
    notes: 'Pendiente confirmar llamada técnica sobre APIs de Supabase y Binance.',
    interestedPlan: 'Módulo Quant Pro',
    hasGeneratedPdf: false,
    hasAiAssistance: true,
    relatedQuotesCount: 0,
    activityLog: [],
    tasks: [],
    documents: [],
    history: [
      { date: '2026-07-11', action: 'Registro por formulario de contacto', actor: 'System' },
      { date: '2026-07-14', action: 'Llamada exploratoria', actor: 'Elena Gómez (Sales)' },
      { date: '2026-07-16', action: 'Revisión técnica de APIs', actor: 'Soporte Técnico' }
    ],
    expectedCloseDate: '2026-08-01',
    winProbability: 65,
    leadSourceType: 'partner_referral',
    leadSourceReferrer: 'MediCare Colombia Partners'
  },
  {
    id: 'L-103',
    name: 'Mateo Delgado',
    company: 'Grupo Nutrición',
    email: 'm.delgado@nutriciongrup.com',
    phone: '+57 315 987 6543',
    dealValue: 2400000,
    stage: 'contacted',
    status: 'stalled',
    assignee: 'María López',
    labels: ['⏰ Urgente'],
    aiScore: 45,
    aiInsights: 'Bajo engagement en correos informativos. Tomador de decisión principal ausente en las reuniones.',
    lastContactDate: '2026-07-02',
    notes: 'No ha respondido al correo de seguimiento del 2 de julio.',
    hasGeneratedPdf: false,
    hasAiAssistance: false,
    relatedQuotesCount: 0,
    activityLog: [],
    tasks: [],
    documents: [],
    history: [
      { date: '2026-06-25', action: 'Lead importado de lista de eventos', actor: 'Admin' },
      { date: '2026-06-28', action: 'Primer contacto vía email', actor: 'Elena Gómez (Sales)' },
      { date: '2026-07-02', action: 'Llamada de seguimiento - Buzón', actor: 'Elena Gómez (Sales)' }
    ]
  },
  {
    id: 'L-104',
    name: 'Valeria Jaramillo',
    company: 'E-commerce Innova',
    email: 'valeria@ecommerceinnova.com',
    phone: '+57 321 654 0987',
    dealValue: 3100000,
    stage: 'won',
    status: 'active',
    assignee: 'Elena Gómez',
    labels: ['VIP', 'Enterprise'],
    aiScore: 99,
    aiInsights: 'Negociación exitosa para la Suite completa de Marketing Studio. Contrato firmado digitalmente.',
    lastContactDate: '2026-07-17',
    notes: 'Contrato firmado. Iniciando onboarding la próxima semana.',
    hasGeneratedPdf: true,
    hasAiAssistance: false,
    relatedQuotesCount: 2,
    activityLog: [],
    tasks: [],
    documents: [],
    history: [
      { date: '2026-07-01', action: 'Demo solicitada', actor: 'System' },
      { date: '2026-07-05', action: 'Demo y propuesta presentadas', actor: 'Elena Gómez (Sales)' },
      { date: '2026-07-17', action: 'Contrato firmado y pagado', actor: 'Billing Bot' }
    ]
  },
  {
    id: 'L-105',
    name: 'Jorge Eliécer Pérez',
    company: 'Constructora Capital',
    email: 'jorge.perez@constructora-capital.com',
    phone: '+57 310 123 4567',
    dealValue: 1800000,
    stage: 'lead',
    status: 'active',
    assignee: 'Andrés Torres',
    labels: ['Hot Lead'],
    aiScore: 82,
    aiInsights: 'Interés inicial alto. Solicita especificaciones sobre el almacenamiento de archivos (DAM).',
    lastContactDate: '2026-07-17',
    notes: 'Asignado automáticamente tras descargar el Whitepaper de Design Systems.',
    hasGeneratedPdf: false,
    hasAiAssistance: true,
    relatedQuotesCount: 0,
    activityLog: [],
    tasks: [],
    documents: [],
    history: [
      { date: '2026-07-17', action: 'Whitepaper descargado', actor: 'System' }
    ]
  }
];

export const SalesCrmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);

  // AI Budget Generator States
  const [generatingLeadId, setGeneratingLeadId] = useState<string | null>(null);
  const [isGeneratingBudget, setIsGeneratingBudget] = useState(false);
  const [isPreviewingPdf, setIsPreviewingPdf] = useState(false);

  const selectedLead = leads.find(l => l.id === selectedLeadId) || null;

  const openLeadInspector = useCallback((leadId: string) => {
    setSelectedLeadId(leadId);
    setIsInspectorOpen(true);
  }, []);

  const closeInspector = useCallback(() => {
    setIsInspectorOpen(false);
  }, []);

  const updateLead = useCallback((updatedLead: Lead) => {
    setLeads(prevLeads => prevLeads.map(lead => 
      lead.id === updatedLead.id ? updatedLead : lead
    ));
  }, []);

  const updateLeadStage = useCallback((leadId: string, newStage: Lead['stage']) => {
    setLeads(prevLeads => prevLeads.map(lead => {
      if (lead.id === leadId) {
        const historyEntry = {
          date: new Date().toISOString().split('T')[0],
          action: `Etapa cambiada a: ${newStage.toUpperCase()}`,
          actor: 'Elena Gómez (Sales)'
        };
        return {
          ...lead,
          stage: newStage,
          history: [...lead.history, historyEntry]
        };
      }
      return lead;
    }));
  }, []);

  const addLead = useCallback((newLeadData: Omit<Lead, 'id' | 'aiScore' | 'aiInsights' | 'history'>) => {
    const nextId = `L-${100 + leads.length + 1}`;
    const newLead: Lead = {
      ...newLeadData,
      id: nextId,
      aiScore: Math.floor(Math.random() * 50) + 50, // random score between 50 and 100
      aiInsights: 'Lead creado recientemente. Pendiente interacción inicial para predicciones del modelo de IA.',
      activityLog: [],
      tasks: [],
      documents: [],
      history: [
        {
          date: new Date().toISOString().split('T')[0],
          action: 'Lead creado',
          actor: 'Elena Gómez (Sales)'
        }
      ]
    };
    setLeads(prev => [newLead, ...prev]);
  }, [leads.length]);

  const triggerAiBudget = useCallback((leadId: string) => {
    setGeneratingLeadId(leadId);
    setIsGeneratingBudget(true);
    setIsPreviewingPdf(false);
  }, []);

  const completeBudgetGeneration = useCallback((leadId: string) => {
    setLeads(prevLeads => prevLeads.map(lead => {
      if (lead.id === leadId) {
        const historyEntry = {
          date: new Date().toISOString().split('T')[0],
          action: 'Presupuesto generado y enviado vía IA',
          actor: 'Copilot IA'
        };
        return {
          ...lead,
          hasGeneratedPdf: true,
          relatedQuotesCount: (lead.relatedQuotesCount || 0) + 1,
          history: [...lead.history, historyEntry]
        };
      }
      return lead;
    }));
  }, []);

  return (
    <SalesCrmContext.Provider value={{
      selectedLeadId,
      selectedLead,
      isInspectorOpen,
      openLeadInspector,
      closeInspector,
      leads,
      updateLeadStage,
      addLead,
      updateLead,
      generatingLeadId,
      setGeneratingLeadId,
      isGeneratingBudget,
      setIsGeneratingBudget,
      isPreviewingPdf,
      setIsPreviewingPdf,
      triggerAiBudget,
      completeBudgetGeneration
    }}>
      {children}
    </SalesCrmContext.Provider>
  );
};

export const useSalesCrm = () => {
  const context = useContext(SalesCrmContext);
  if (!context) throw new Error('useSalesCrm must be used within SalesCrmProvider');
  return context;
};
