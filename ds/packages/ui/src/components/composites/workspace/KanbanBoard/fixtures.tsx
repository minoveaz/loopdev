import React from 'react';
import { KanbanColumn } from './types';

export interface MockKanbanItem {
  id: string;
  name: string;
  company: string;
  dealValue: number;
  stage: string;
  aiScore: number;
  interestedPlan: string;
}

export const MOCK_KANBAN_COLUMNS: KanbanColumn[] = [
  { id: 'lead', title: 'Nuevos Leads' },
  { id: 'contacted', title: 'Contactados' },
  { id: 'proposal', title: 'Propuesta' },
  { id: 'negotiation', title: 'Negociación' },
  { id: 'won', title: 'Ganados' },
];

export const MOCK_KANBAN_ITEMS: MockKanbanItem[] = [
  {
    id: 'lead-1',
    name: 'Carlos Mendoza',
    company: 'Logística Express',
    dealValue: 12000000,
    stage: 'lead',
    aiScore: 92,
    interestedPlan: 'Plan Colectivo Salud Oro',
  },
  {
    id: 'lead-2',
    name: 'Sofía Castro',
    company: 'Tech Solutions SAS',
    dealValue: 45000000,
    stage: 'contacted',
    aiScore: 84,
    interestedPlan: 'Plan Sanitas Integral Pyme',
  },
  {
    id: 'lead-3',
    name: 'Javier Herrera',
    company: 'Distribuidora Global',
    dealValue: 8000000,
    stage: 'proposal',
    aiScore: 71,
    interestedPlan: 'Seguro Médico Premium Individual',
  },
  {
    id: 'lead-4',
    name: 'Valentina Ortiz',
    company: 'AgroIndustrial del Norte',
    dealValue: 24000000,
    stage: 'negotiation',
    aiScore: 95,
    interestedPlan: 'Plan Medisan Familiar Adeslas',
  },
  {
    id: 'lead-5',
    name: 'Andrés Felipe Restrepo',
    company: 'Inversiones R.F.',
    dealValue: 75000000,
    stage: 'won',
    aiScore: 99,
    interestedPlan: 'Plan Salud Global Multitenant',
  },
];
