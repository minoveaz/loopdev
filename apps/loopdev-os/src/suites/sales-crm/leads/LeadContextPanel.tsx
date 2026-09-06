'use client';

import { useRouter } from 'next/navigation';
import { useOrganizationPermissions } from '@/hooks/useOrganizationPermissions';
import { LeadRecordPreview } from './LeadRecordPreview';
import { useLeadsRuntime } from './runtime';

export function LeadContextPanel() {
  const router = useRouter();
  const { selectedLead, clearSelectedLead } = useLeadsRuntime();
  const { isLoading, hasPermission } = useOrganizationPermissions(['crm.manage']);

  if (!selectedLead) return null;

  return (
    <LeadRecordPreview
      lead={selectedLead}
      organizationId={selectedLead.organizationId}
      onClose={clearSelectedLead}
      onOpenRecord={() => router.push(`/sales-crm/leads/${selectedLead.id}`)}
      onOpenContact={() =>
        router.push(`/sales-crm/contacts?q=${encodeURIComponent(selectedLead.contactId)}`)
      }
      canManage={!isLoading && hasPermission('crm.manage')}
    />
  );
}
