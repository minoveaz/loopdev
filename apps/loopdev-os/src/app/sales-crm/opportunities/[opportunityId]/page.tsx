import { OpportunityRecordView } from '@/suites/sales-crm/crm';

export default async function OpportunityPage({
  params,
}: {
  params: Promise<{ opportunityId: string }>;
}) {
  const { opportunityId } = await params;
  return <OpportunityRecordView opportunityId={opportunityId} />;
}
