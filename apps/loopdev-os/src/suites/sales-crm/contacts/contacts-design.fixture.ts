import type { CrmContact, CrmContactPage } from '@loopdev/contracts';

const DESIGN_FIXTURE_CONTACTS: CrmContact[] = [
  {
    id: 'design-contact-ana',
    organizationId: 'design-fixture-organization',
    firstName: 'Ana',
    lastName: 'Garcia',
    email: 'ana.garcia@example.com',
    phone: '+1 555 0100',
    companyName: 'Acme Industries',
    identityStatus: 'verified',
    createdAt: '2026-08-14T09:42:00.000Z',
    updatedAt: '2026-08-14T09:42:00.000Z',
  },
  {
    id: 'design-contact-luis',
    organizationId: 'design-fixture-organization',
    firstName: 'Luis',
    lastName: 'Martinez',
    email: 'luis.martinez@example.com',
    phone: '+1 555 0101',
    companyName: 'Northstar Health',
    identityStatus: 'verified',
    createdAt: '2026-08-12T16:18:00.000Z',
    updatedAt: '2026-08-12T16:18:00.000Z',
  },
  {
    id: 'design-contact-marta',
    organizationId: 'design-fixture-organization',
    firstName: 'Marta',
    lastName: 'Ruiz',
    email: 'marta.ruiz@example.com',
    phone: null,
    companyName: 'Studio Meridian',
    identityStatus: 'verified',
    createdAt: '2026-08-10T11:06:00.000Z',
    updatedAt: '2026-08-10T11:06:00.000Z',
  },
  {
    id: 'design-contact-david',
    organizationId: 'design-fixture-organization',
    firstName: 'David',
    lastName: 'Chen',
    email: null,
    phone: '+1 555 0103',
    companyName: 'Acme Industries',
    identityStatus: 'verified',
    createdAt: '2026-08-08T13:24:00.000Z',
    updatedAt: '2026-08-08T13:24:00.000Z',
  },
  {
    id: 'design-contact-sofia',
    organizationId: 'design-fixture-organization',
    firstName: 'Sofia',
    lastName: 'Patel',
    email: 'sofia.patel@example.com',
    phone: null,
    companyName: null,
    identityStatus: 'verified',
    createdAt: '2026-08-05T08:15:00.000Z',
    updatedAt: '2026-08-05T08:15:00.000Z',
  },
];

function matchesQuery(contact: CrmContact, query: string) {
  const haystack = [
    contact.firstName,
    contact.lastName,
    contact.email,
    contact.phone,
    contact.companyName,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  return haystack.includes(query.trim().toLowerCase());
}

export function getContactsDesignFixturePage({
  organizationId,
  query = '',
  cursor,
  limit,
}: {
  organizationId: string;
  query?: string;
  cursor?: string;
  limit: number;
}): CrmContactPage {
  const start = cursor ? Number.parseInt(cursor, 10) : 0;
  const matchingContacts = DESIGN_FIXTURE_CONTACTS.filter((contact) =>
    matchesQuery(contact, query),
  ).map((contact) => ({ ...contact, organizationId }));
  const items = matchingContacts.slice(start, start + limit);
  const nextIndex = start + items.length;

  return {
    items,
    nextCursor: nextIndex < matchingContacts.length ? String(nextIndex) : null,
    hasMore: nextIndex < matchingContacts.length,
  };
}
