'use client';

import type { CrmLead } from '@loopdev/contracts';
import { Button } from '@loopdev/ui';

type QualifiedLeadGuardProps = {
  lead: Pick<CrmLead, 'status'>;
  canManage: boolean;
  onConvert: () => void;
};

export function canConvertQualifiedLead(lead: Pick<CrmLead, 'status'>, canManage: boolean) {
  return canManage && (lead.status === 'cualificado' || lead.status === 'convertido');
}

export function QualifiedLeadGuard({ lead, canManage, onConvert }: QualifiedLeadGuardProps) {
  if (!canConvertQualifiedLead(lead, canManage)) return null;

  return (
    <Button type="button" size="sm" variant="secondary" onClick={onConvert}>
      Crear Opportunity
    </Button>
  );
}
