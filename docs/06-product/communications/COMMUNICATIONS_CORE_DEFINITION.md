---
title: Communications Core Definition
status: approved
version: 0.1
created: 2026-08-29
updated: 2026-08-29
owner: crm
program_track: tracks/planned/crm/2026-08-29-communications-core-crm-inbox-definition.md
issue: https://github.com/minoveaz/loopdev/issues/156
approver: User
approved_at: 2026-08-29
---

# Communications Core

## Intent

### Problem

LoopDev needs to receive and send customer communications without every suite independently integrating providers, storing credentials, duplicating conversations or enforcing delivery and consent rules inconsistently.

### Target users

- Agents and commercial managers operating customer conversations in CRM.
- Organization administrators configuring authorized communication accounts.
- Future authorized users of Marketing Studio, Insurance Pack and Health OS through public Communications contracts.

### Value and success signal

The first success signal is that an authorized CRM agent can operate an inbound WhatsApp conversation with the canonical contact context, delivery state and enforced provider policy, without cross-organization exposure or provider secrets in the client.

## Domain boundary

### Included

- Organization-scoped provider accounts and channel identities.
- Provider adapters, credential references, webhook verification and idempotent event intake.
- Conversations, messages, delivery states, internal notes and templates.
- Policy enforcement for authorization, consent, conversation windows and approved templates.
- Retry intent, operational audit and observability without logging secrets or message bodies.
- Public contracts for authorized suite consumers.

### Excluded

- CRM ownership of contacts, leads, opportunities, activities and commercial attribution.
- Marketing campaign orchestration, segmentation, publication and analytics.
- A standalone support desk, SLA program, calls, knowledge base, bots or AI agent.
- Direct provider integrations, credential storage or internal-table mutations from suites.
- Live channels other than WhatsApp Cloud in the first vertical.

### Adjacent suites and ownership

| Capability | Owning area | Boundary |
| --- | --- | --- |
| Contacts, leads, opportunities, activities and commercial consent | CRM | CRM supplies canonical references and consumes conversation context. |
| Accounts, providers, webhooks, conversation state and delivery | Communications Core | Core enforces policy and exposes public operations. |
| Provider connections and secrets | Integration Hub / Communications Core | Server-side adapters and credential references only; no suite owns tokens. |
| Campaign intent, audiences and marketing metrics | Marketing Studio | Marketing requests authorized communications through contracts; it does not own transport. |
| Tenant membership, base access and audit foundation | Platform Core | Platform resolves actor and organization server-side. |

## Module map

### Initial modules

| Module | Purpose | Priority | Dependency | Definition status |
| --- | --- | --- | --- | --- |
| Communications Core | Normalize secure, tenant-safe communication operations and WhatsApp Cloud adaptation. | Foundation | Platform Core, CRM canonical contacts, Meta Cloud API | Proposed |
| CRM Communications Inbox | Let CRM users triage, inspect and act on authorized WhatsApp conversations. | First vertical | Communications Core, CRM contacts and Shell recipes | Proposed |

### Future modules

| Module | Reason to defer | Dependency or gate |
| --- | --- | --- |
| Additional channel adapters | No approved provider or operational model. | Provider contract, security review and operational readiness. |
| Media and attachments | Require Storage controls and lifecycle decisions. | Approved media contract and security gates. |
| Team routing, saved views and macros | Not necessary to validate the first agent workflow. | Assignment, permissions and audit contract. |
| Marketing and transactional sends | Different consent, audience, billing and recovery requirements. | Marketing/Workflow contracts and compliance approval. |
| Independent Communications suite | Portfolio boundary is not approved and one consumer does not justify it. | Two real consumers or an approved portfolio decision. |

## Experience

Communications Core has no parallel suite shell. Its first visible experience is CRM Communications Inbox, documented separately. The inbox uses `SplitWorkspace`: conversation list and filters, conversation canvas and a CRM context panel. Every view preserves `PlatformHeader`, `SuiteSidebar`, `PlatformContextPanel` and `SuiteCanvas` through `SuiteRuntime`.

The Core must report loading, disconnected account, provider error, forbidden, webhook failure, message failed, no conversation and policy-restricted states to its consumers through stable codes and read models. It must not expose provider payloads or credentials to the UI.

## Contracts and security

### Canonical entities and ownership

Core owns accounts, channels, conversations, messages, message status history, internal notes, templates, webhook events and retry intent. A conversation references a CRM contact but does not own or replicate that contact. The public contract must distinguish external replies from internal notes and preserve immutable delivery and audit evidence.

### Tenancy and isolation

Every business record is scoped by `organization_id`. Organization context and permission are resolved server-side from authenticated membership. RLS, composite organization foreign keys and negative isolation tests are mandatory for new persistence. `tenant_id` is legacy-only and is not permitted in new contracts.

### Roles and permissions

The initial model separates `communications.read`, reply/internal-note, assignment, lifecycle and account-management permissions. Agent may read and operate conversations assigned within an authorized workspace and assign an eligible conversation to self. Manager may operate and reassign conversations within authorized workspaces. Viewer is read-only. Organization administrator configures accounts outside the routine inbox. Export remains deferred.

### Events and integrations

WhatsApp Cloud is the first adapter. Organization administrators use Meta Embedded Signup as the standard onboarding flow. Manual configuration is restricted to approved support, migration or technical cases. Webhooks verify their signature, resolve the organization from the configured account, normalize provider events and deduplicate them before a domain mutation. For an unknown E.164 number, Core requests CRM's public contact command to create or link a minimum pending-identity contact; Core never writes CRM tables directly. The result creates no lead, opportunity, commercial assignment or marketing consent. Outbound operations must validate the conversation, account, channel policy, consent, window and template requirements before calling the adapter. Provider failures must return normalized errors and preserve a correlation identifier.

### Audit and retention

Sensitive actions, status transitions, assignments, policy denials and account changes require audit evidence. Message bodies, attachment content and provider tokens must not appear in ordinary logs. Messages and internal notes are retained for 24 months from the last authorized conversation update, represented by a domain `lastActivityAt` value separate from technical timestamps. Delivery and audit evidence is retained for 36 months without message bodies. Manual deletion is unavailable in the first vertical; a server-side, traceable, idempotent purge runs only after dry-run evidence. Legal hold is deferred but the design must permit it.

## Component reuse and impact

The inbox will reuse the Platform Shell, SuiteRuntime, SuiteCanvas recipes and existing UI primitives. Conversation rows, transcript items, delivery indicators and policy-aware composer remain module composition until a second real consumer justifies promotion. A component audit will record the evidence before implementation.

The existing contract package, migration foundation and WhatsApp webhook are evidence requiring alignment, not a completed product certification. Their contract gaps, tests, RLS, storage, providers, observability, rollout and rollback requirements are recorded in the module impact assessments.

## Phases and readiness

| Phase | Objective | Deliverables | Validation | Exit criteria |
| --- | --- | --- | --- | --- |
| Definition | Define Core and Inbox packages. | Two complete proposed packages and track evidence. | Links, track and cross-document review. | Scope and open decisions are explicit. |
| Foundation | Align public contracts, permissions and persistence. | Approved Core contract and security design. | Contract, RLS and isolation validation. | No provider or tenant boundary is ambiguous. |
| First vertical | Integrate WhatsApp end to end in CRM. | Inbox, inbound, outbound, delivery and template lifecycle. | Focused experience, provider, security and E2E checks. | All enabled WhatsApp states are auditable and policy-enforced. |
| Integrations | Add gated adapters and operations. | Provider-specific contracts and runbooks. | Provider, retry and incident validation. | Each channel meets its own gate. |
| Readiness | Approve rollout. | Evidence, monitoring, kill switch and rollback plan. | Required release validation. | User approval is recorded. |

## Decisions, risks and dependencies

The owning track records approved decisions, risks and validation evidence. Legal hold, media/attachments and post-pilot expansion remain deferred. Conversational inbound and contextual reply do not grant marketing consent; proactive, transactional and marketing sends require their own approved purpose and consent policy. Rollout advances through Dev, one-organization internal pilot, inbound, outbound within the customer window, templates and general availability only when each phase has recorded evidence.

## Implementation handoff

No implementation branch is authorized. The first rollout is limited to one designated partner organization and authorized users. A server-side kill switch per organization and account must stop outbound dispatch and retries while preserving inbox read access, delivery history and audit evidence. The next action is to obtain explicit product and technical approval before any code, migration, provider or RLS change.

## Approval gate

This definition was approved by User on 2026-08-29. It is not a new suite declaration. Implementation remains subject to the approved handoffs, Issue readiness confirmation and creation of the dedicated implementation branch from updated `develop`.