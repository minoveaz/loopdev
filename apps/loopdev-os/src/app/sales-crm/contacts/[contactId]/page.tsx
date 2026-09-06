import { Customer360View } from './Customer360View';

export default async function ContactCustomer360Page({
  params,
}: {
  params: Promise<{ contactId: string }>;
}) {
  const { contactId } = await params;
  return <Customer360View contactId={contactId} />;
}
