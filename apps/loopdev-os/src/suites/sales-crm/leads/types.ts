import type {
  ActivityItem,
  CrmContact,
  CrmLead,
  CrmLeadQuery,
  CrmOpportunity,
} from '@loopdev/contracts';

export type LeadRowViewModel = {
  id: string;
  organizationId?: string;
  contactId: string;
  status: CrmLead['status'];
  statusLabel: string;
  sourceKind: CrmLead['source']['kind'];
  sourceLabel: string;
  interest: string | null;
  assignedUserId: string | null;
  brandId: string | null;
  workspaceId: string | null;
  duplicateReviewId: string | null;
  campaign: string | null;
  createdAt: string;
  updatedAt: string;
};

export type LeadDetailViewModel = {
  lead: CrmLead;
  contact: CrmContact | null;
  opportunities: CrmOpportunity[];
  activity: ActivityItem[];
  state: 'loading' | 'ready' | 'error' | 'forbidden' | 'stale';
  errorMessage?: string;
};

export type LeadMutationCapabilities = {
  canRead: boolean;
  canManage: boolean;
};

export type LeadFilterKey = 'status' | 'source' | 'assignedUserId' | 'workspaceId';
export type LeadFilterValues = Partial<Record<LeadFilterKey, string>>;

export type LeadsQueryKey = [
  'crm',
  'leads',
  CrmLeadQuery & { organizationId: string; limit: number },
];

export type LeadListState =
  'loading' | 'ready' | 'empty' | 'filtered-empty' | 'error' | 'forbidden';
