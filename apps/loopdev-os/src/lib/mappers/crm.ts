import { CrmContactSchema, CrmLeadSchema, type CrmContact, type CrmLead } from '@loopdev/contracts';

export type CrmContactRow = {
  id: string; organization_id: string; first_name: string; last_name: string | null; email: string | null;
  phone: string | null; company_name: string | null; created_at: string; updated_at: string;
};

export type CrmLeadRow = {
  id: string; organization_id: string; contact_id: string; brand_id: string | null; workspace_id: string | null;
  status: string; source: string; source_provider: string | null; external_lead_id: string | null;
  campaign: string | null; interest: string | null; assigned_to_user_id: string | null;
  created_at: string; updated_at: string;
};

export function mapCrmContactRow(row: CrmContactRow): CrmContact {
  return CrmContactSchema.parse({
    id: row.id, organizationId: row.organization_id, firstName: row.first_name, lastName: row.last_name,
    email: row.email, phone: row.phone, companyName: row.company_name, createdAt: row.created_at, updatedAt: row.updated_at,
  });
}

export function mapCrmLeadRow(row: CrmLeadRow): CrmLead {
  return CrmLeadSchema.parse({
    id: row.id, organizationId: row.organization_id, workspaceId: row.workspace_id, brandId: row.brand_id,
    contactId: row.contact_id, status: row.status, interest: row.interest, assignedUserId: row.assigned_to_user_id,
    source: {
      kind: row.source,
      provider: row.source_provider,
      externalId: row.external_lead_id,
      campaign: row.campaign,
      utm: {},
    },
    duplicateReviewId: null,
    createdAt: row.created_at, updatedAt: row.updated_at,
  });
}
