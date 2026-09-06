---
title: CRM Lead Contract
status: approved
version: 1.2
created: 2026-08-13
updated: 2026-09-04
owner: crm
program_track: tracks/active/crm/2026-08-13-crm-pilot-execution.md
issue: https://github.com/minoveaz/loopdev/issues/84
---

# Contrato de Lead

## Proposito

Define el contrato compartido para listar, buscar, crear/capturar, editar, cualificar y convertir
leads en oportunidades sin duplicar contactos.

## Modelo de lectura

```ts
type Lead = {
  id: string;
  organizationId: string;
  workspaceId: string | null;
  brandId: string | null;
  contactId: string;
  status: 'nuevo' | 'contactado' | 'cualificado' | 'estancado' | 'inactivo' | 'convertido';
  interest: string | null;
  assignedUserId: string | null;
  source: LeadSource;
  duplicateReviewId: string | null;
  createdAt: string;
  updatedAt: string;
};

type LeadOpportunityOrigin = 'lead_conversion' | 'manual';

type LeadSource = {
  kind: 'manual' | 'campaign' | 'whatsapp_simulated' | 'referral' | 'social' | 'partner';
  provider: string | null;
  externalId: string | null;
  campaign: string | null;
  utm: Record<string, string>;
};
```

## Commands and queries

| Operation                   | Input                                                                    | Result                                      |
| --------------------------- | ------------------------------------------------------------------------ | ------------------------------------------- |
| `listLeads`                 | scope, filters, cursor, limit, sort                                      | Paginated authorized leads                  |
| `getLead`                   | leadId and scope                                                         | Lead with contact/opportunity summary       |
| `createLead`                | contactId or contact creation input, source, assignment, idempotency key | Lead and contact relation                   |
| `updateLead`                | leadId, patch, expected version                                          | Updated lead or conflict                    |
| `moveLeadStatus`            | leadId, target status, expected version                                  | Updated state and audit event               |
| `createOpportunityFromLead` | leadId, product/interés key, opportunity input, idempotency tuple        | Opportunity linked to same contact and lead |

## Rules

- A lead always belongs to one Contact.
- A new lead may create a Contact through the approved Contact contract.
- Exact normalized external identifiers are idempotent inside provider/account/organization scope.
- Ambiguous contact matches create the contact and open human duplicate review; no automatic merge.
- Campaign and WhatsApp real integrations are deferred; `referral`, `social` and `partner` are
  active source values in the pilot and may be captured manually or through fixtures.
- Agent and manager may move authorized leads; admin configures allowed states/rules.
- `assignedUserId` may be null (automatic assignment to the actor) or an active `owner`, `admin`
  or `agent` membership in the same organization; viewers, suspended memberships and cross-org
  users are rejected before any Contact or Lead side effect.
- Every state change and conversion is auditable.
- A qualified Lead may create one conversion Opportunity per normalized product/interés key in
  stable stage ID `qualified`, initially displayed as `Cualificado`.
- The first successful `lead_conversion` changes the Lead status from `cualificado` to `convertido`.
- `convertido` means the Lead has produced at least one conversion Opportunity; it does not block
  later conversion Opportunities for different product/interés keys.
- Repeating the same Lead + product/interés conversion returns the existing Opportunity; a different
  product/interés may create another Opportunity for the same Lead and Contact.
- Pipeline may create additional manual Opportunities, identified with `origin = manual`; Lead
  conversion uses `origin = lead_conversion`.
- Creating a manual Pipeline Opportunity does not change the Lead status by itself.
- The database must enforce uniqueness for the conversion tuple `(tenant, lead, product_key,
origin=lead_conversion)` and the command must be transactional.
- The visible stage name/order may change without changing stable IDs, contracts or historical data.
- Cross-tenant leads and references are never returned.
- The application validates assignees against active organization membership, and the database
  additionally enforces `(organization_id, assigned_to_user_id)`, active operational roles and an
  RLS write check. Applying that barrier is a no-go while historical assignments do not satisfy the
  same organization/status/role invariant; the migration never repairs those rows silently.
- The conversion command never accepts `contactId`; the transactional backend operation inherits
  the Lead's authorized Contact and rejects non-qualified status. A repeated normalized
  Lead/product conversion returns the existing Opportunity, while a successful new conversion
  returns the created Opportunity and reconciles the Lead status.
- Initial-note persistence follows Lead capture. If the note fails after the Lead is created, the
  result is partial success: the client retains the created Lead identity and retries only the
  idempotent note command. It must not present the capture itself as failed or create another Lead.

## Errors

Use typed envelopes and stable codes:

```ts
type LeadErrorCode =
  | 'UNAUTHENTICATED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'VALIDATION_ERROR'
  | 'IDEMPOTENCY_CONFLICT'
  | 'INVALID_STATUS_TRANSITION'
  | 'CONTACT_REQUIRED';
```

## Frontend

- Leads list and contextual detail use `SuiteCanvas mode="split"` from module entry.
- Direct detail uses `SuiteCanvas mode="workspace"` via “Ver ficha” or a direct route.
- FSD layers are app -> widgets -> features -> entities -> shared.
- Query keys include organization, workspace, filters and source dimensions.
- State includes loading, empty, error, forbidden and success.

## Definition of contract readiness

- [x] UX and component audit approved.
- [x] Product Owner approves source, status and conversion rules.
- [x] Tech Lead approves commands, queries, errors and idempotency.
- [x] Schema/RLS impact is recorded.
