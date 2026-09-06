import type { CrmLead } from '@loopdev/contracts';
import type { LeadRowViewModel } from './types';

const STATUS_LABELS: Record<CrmLead['status'], string> = {
  nuevo: 'Nuevo',
  contactado: 'Contactado',
  cualificado: 'Cualificado',
  estancado: 'Estancado',
  inactivo: 'Inactivo',
  convertido: 'Convertido',
};

const SOURCE_LABELS: Record<CrmLead['source']['kind'], string> = {
  manual: 'Manual',
  campaign: 'Campaña',
  whatsapp_simulated: 'WhatsApp simulado',
  referral: 'Referido',
  social: 'Social',
  partner: 'Partner',
};

export function getLeadStatusLabel(status: CrmLead['status']) {
  return STATUS_LABELS[status];
}

export function getLeadSourceLabel(source: CrmLead['source']['kind']) {
  return SOURCE_LABELS[source];
}

export function mapLeadToRowViewModel(lead: CrmLead): LeadRowViewModel {
  return {
    id: lead.id,
    organizationId: lead.organizationId,
    contactId: lead.contactId,
    status: lead.status,
    statusLabel: getLeadStatusLabel(lead.status),
    sourceKind: lead.source.kind,
    sourceLabel: getLeadSourceLabel(lead.source.kind),
    interest: lead.interest ?? null,
    assignedUserId: lead.assignedUserId ?? null,
    brandId: lead.brandId ?? null,
    workspaceId: lead.workspaceId ?? null,
    duplicateReviewId: lead.duplicateReviewId ?? null,
    campaign: lead.source.campaign ?? null,
    createdAt: lead.createdAt,
    updatedAt: lead.updatedAt,
  };
}

export function mapLeadsToRowViewModels(leads: CrmLead[]) {
  return leads.map(mapLeadToRowViewModel);
}
