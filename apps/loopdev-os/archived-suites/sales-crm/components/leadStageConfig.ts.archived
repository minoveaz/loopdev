import type { Lead } from '../context';

export const stageLabels: Record<Lead['stage'], string> = {
  lead: 'Nuevo Lead',
  contacted: 'Contactado',
  proposal: 'Propuesta',
  negotiation: 'Negociación',
  won: 'Ganado',
  lost: 'Perdido',
  rejected: 'Rechazado',
  discarded: 'Descartado',
};
export const stageSeverityMap: Record<
  Lead['stage'],
  'info' | 'warning' | 'danger' | 'success' | 'innovation' | 'neutral' | 'primary'
> = {
  lead: 'neutral',
  contacted: 'info',
  proposal: 'innovation',
  negotiation: 'warning',
  won: 'success',
  lost: 'danger',
  rejected: 'danger',
  discarded: 'neutral',
};
