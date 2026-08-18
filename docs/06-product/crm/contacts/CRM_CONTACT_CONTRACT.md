---
title: CRM Contact Contract
status: approved
version: 1.1
created: 2026-08-13
updated: 2026-08-18
owner: crm
program_track: tracks/planned/crm/2026-08-13-crm-pilot-execution.md
issue: https://github.com/minoveaz/loopdev/issues/82
approver: User
approved_at: 2026-08-13
---

# Contrato de Contact

## 1. Proposito

Define el contrato compartido que usaran la UI CRM, el BFF, los casos de uso y los repositorios
para listar, buscar, crear, editar, consultar y revisar posibles duplicados de contactos.

Este contrato se implementa primero como backend-first en
`feature/crm-contacts-backend-foundation`. La integracion visual queda fuera de
este slice y consumira estos mismos tipos y envelopes.

## 2. Modelo de lectura

```ts
type Contact = {
  id: string;
  organizationId: string;
  workspaceId: string | null;
  brandId: string | null;
  firstName: string;
  lastName: string;
  secondLastName: string | null;
  preferredName: string | null;
  primaryPhone: string | null;
  secondaryPhone: string | null;
  primaryEmail: string | null;
  secondaryEmail: string | null;
  documentType: 'DNI' | 'NIE' | 'PASSPORT' | null;
  documentNumber: string | null;
  birthDate: string | null;
  gender: string | null;
  maritalStatus: string | null;
  address: ContactAddress | null;
  companyName: string | null;
  jobTitle: string | null;
  preferredLanguage: string | null;
  preferredChannel: 'phone' | 'email' | 'whatsapp' | null;
  tags: string[];
  source: ContactSource;
  assignedUserId: string | null;
  duplicateReview: DuplicateReview | null;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string | null;
};

type ContactAddress = {
  country: string | null;
  province: string | null;
  city: string | null;
  postalCode: string | null;
  line1: string | null;
};

type ContactSource = {
  kind: 'manual' | 'campaign' | 'whatsapp_simulated';
  provider: string | null;
  externalId: string | null;
  campaign: string | null;
  utm: Record<string, string>;
};
```

## 3. Commands and queries

| Operation                 | Input                                                 | Result                                                     |
| ------------------------- | ----------------------------------------------------- | ---------------------------------------------------------- |
| `listContacts`            | organization, workspace, filters, cursor, limit, sort | Paginated contacts and next cursor                         |
| `getContact`              | contactId and authorized scope                        | Contact with permitted Customer 360 summary                |
| `searchContacts`          | query, scope, filters, cursor, limit                  | Paginated authorized matches                               |
| `createContact`           | create input, idempotency key                         | Created contact and duplicate review state when applicable |
| `updateContact`           | contactId, patch, expected version                    | Updated contact or `CONFLICT`                              |
| `findPotentialDuplicates` | candidate contact data and scope                      | Ranked candidates with reason, never automatic merge       |
| `approveContactMerge`     | survivorId, duplicateId, reason, expected versions    | Merge result, references preserved and audit event         |
| `dismissDuplicateReview`  | reviewId, reason                                      | Dismissed review and audit event                           |

## 4. Create and update input

Required on create:

- `firstName`.
- `lastName`.
- At least one of `primaryPhone` or `primaryEmail`.
- `source.kind`.
- `brandId` when the workspace requires it.
- `assignedUserId` when assignment is required by the organization.

Optional on create/update:

- Second surname, preferred name, secondary phone/email.
- DNI/NIE/passport, birth date, gender and marital status.
- Address, company, job title, language, preferred channel, tags and initial note.

The organization field configuration may hide or require existing fields. It cannot create custom
fields during the pilot. DNI/NIE/passport is required only when a later quotation or policy-request
flow starts; those flows are outside this pilot.

## 5. Deduplication and merge

- Exact normalized phone E.164 or normalized email inside the same organization may reuse the existing
  contact.
- Name plus partial identifier, or a similar name with a different phone, creates the new contact
  and opens a potential-duplicate review.
- No ambiguous match may block contact creation or merge automatically.
- Agent or manager approval is required for a merge.
- Merge preserves lead, opportunity, task, note, attribution and audit references.
- Merge and dismissal record actor, reason, timestamp, source and survivor/duplicate IDs.
- Cross-organization candidates are never returned.

## 6. Authorization and scope

- Every read and mutation resolves active user, organization, workspace and permission server-side.
- `service_role` is forbidden for ordinary browser requests.
- Agent may create/update permitted contacts and review permitted duplicate candidates.
- Manager may perform agent actions and approve permitted merges.
- Organization admin controls field visibility/requiredness and organization-level settings.
- Superdev support access uses a separate privileged path with purpose, actor and audit.

## 7. Response and error contract

Success responses use a typed envelope with `traceId` where applicable. Errors use:

```ts
type ContactErrorCode =
  | 'UNAUTHENTICATED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'VALIDATION_ERROR'
  | 'DUPLICATE_REVIEW_REQUIRED'
  | 'MERGE_NOT_ALLOWED';
```

Errors never include PII belonging to another tenant. Validation errors identify fields without
returning secrets or full sensitive payloads.

## 8. Frontend contract

- Contact list renders in `SuiteCanvas mode="data"`.
- Contact detail and Customer 360 render in `SuiteCanvas mode="split"`.
- App routes remain thin; widgets compose features and entities.
- Contact entities own view models and public APIs; features own create/update/merge actions.
- Server state is tenant-aware and invalidated on organization/workspace change.
- UI implements `loading`, `empty`, `error`, `forbidden` and `success` states.

## 9. Definition of contract readiness

- [x] Product Owner approves fields and roles.
- [x] Tech Lead approves command/query/error shapes.
- [x] Schema and RLS impact is recorded in the impact assessment.
- [x] Contract examples cover two organizations and duplicate review.
- [x] No existing CRM fixture is treated as an authoritative contract.

## 10. Aprobacion

Contrato aprobado el 2026-08-13 por User para preparar `CRM-01`. La aprobacion no autoriza por si
sola una migracion destructiva ni el inicio de implementacion sin respetar las dependencias del
impact assessment.

## 11. Backend-first delivery

The first implementation slice exposes:

- `GET /api/crm/contacts` for authorized list/search with cursor pagination.
- `POST /api/crm/contacts` for validated creation with organization-scoped
  duplicate reuse.
- `PATCH /api/crm/contacts` for optimistic-concurrency updates using
  `expectedUpdatedAt`.

The route adapters remain thin. Authorization is resolved server-side through
the CRM permission helper, and the frontend must not access CRM tables directly.
Contacts are organization-scoped in this first slice; workspace assignment and
explicit idempotency keys remain planned extensions and are not accepted by the
current API.
