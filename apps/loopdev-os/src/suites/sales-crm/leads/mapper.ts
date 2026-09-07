import type { CrmContact, CrmLead } from '@loopdev/contracts';
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

export function mapLeadToRowViewModel(
  lead: CrmLead,
  contactsMap?: Map<string, CrmContact>,
  brandsMap?: Map<string, string>,
  workspacesMap?: Map<string, string>,
): LeadRowViewModel {
  const contact = contactsMap?.get(lead.contactId);
  const contactName = contact
    ? [contact.firstName, contact.lastName].filter(Boolean).join(' ') ||
      contact.email ||
      contact.phone ||
      lead.contactId
    : undefined;
  const contactCompany = contact?.companyName ?? null;
  const contactEmail = contact?.email ?? null;

  return {
    id: lead.id,
    organizationId: lead.organizationId,
    contactId: lead.contactId,
    contactName,
    contactCompany,
    contactEmail,
    brandName: lead.brandId ? (brandsMap?.get(lead.brandId) ?? null) : null,
    workspaceName: lead.workspaceId ? (workspacesMap?.get(lead.workspaceId) ?? null) : null,
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

export function mapLeadsToRowViewModels(
  leads: CrmLead[],
  contactsMap?: Map<string, CrmContact>,
  brandsMap?: Map<string, string>,
  workspacesMap?: Map<string, string>,
) {
  return leads.map((l) => mapLeadToRowViewModel(l, contactsMap, brandsMap, workspacesMap));
}
