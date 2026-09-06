---
title: Document Intelligence Core UX Specification
status: proposed
version: 0.1
created: 2026-09-06
updated: 2026-09-06
owner: ai-platform
program_track: ../../../../tracks/planned/ai-platform/2026-09-06-document-intelligence-core-definition.md
issue: https://github.com/minoveaz/loopdev/issues/198
related_issues: [199, 200, 204, 202, 205, 201, 203, 176]
---

# Document Intelligence Core UX Specification

## Purpose and status

Esta especificación `proposed` define la evolución cross-suite del módulo existente de Document
Intelligence después del POC cerrado en #176. No autoriza rutas, migraciones, provider ni cambios de
RLS. Las aprobaciones de Product Owner y Tech Lead están pendientes.

## Navigation and native Canvas composition

| Surface | Proposed route | Canvas recipe | Ownership |
| --- | --- | --- | --- |
| Extraction history | `/document-intelligence` | `DataWorkspace` | Module widget over authorized Core query |
| New extraction | `/document-intelligence/new` | Existing `RecordWorkspace` evolution | Existing module flow |
| Versioned extraction | `/document-intelligence/:documentId` | Existing `RecordWorkspace` evolution | Existing module flow plus persisted version context |

Las rutas actuales del POC se conservan como baseline; el historial no crea `/history` ni un
workbench paralelo. La composición obligatoria es
`AppShell -> PlatformHeader -> SuiteSidebar -> PlatformContextPanel -> SuiteCanvas -> SuiteRuntime`.
`ModuleHeader`, `ModuleContextPanel` y toolbar son zonas opcionales declaradas por el módulo. El
Canvas solo compone widgets/features/entities y nunca contiene repositories, Storage, provider
clients o reglas de dominio.

## Roles and visible actions

| Role (pending final permission map) | Read history | Open version | Edit/review | Approve/reject | Configure rules |
| --- | --- | --- | --- | --- | --- |
| Operator | authorized scope | yes | if assigned | if granted | no |
| Reviewer | authorized scope | yes | yes | yes | no |
| Manager | workspace scope | yes | if granted | if granted | maybe, pending |
| Org admin | organization scope | yes | policy-dependent | policy-dependent | yes, pending |
| Viewer | read-only | yes | no | no | no |

La autorización final, assignments y permisos `documents.*` deben aprobarse antes de implementación;
la UI no infiere permisos por rol nominal.

## Fields, filters and states

History requires `documentId`, version, document type, lifecycle status, created/updated timestamps,
owner/workspace reference, retention state and last safe action. Filters are allowlisted: status,
type, workspace, created/updated range, validation severity and provider status. Ordering is stable
(`updatedAt`, `id`) and pagination is cursor-based. Source documents and extracted PII are never
displayed in a list without an authorized detail query.

Every surface defines:

- **Loading:** skeleton/table placeholder with stable geometry and announced busy state.
- **Empty:** explanation plus authorized `New extraction` action; no fake records.
- **Error:** typed actionable error, retry and correlation reference without provider internals.
- **Forbidden:** permission-safe message with no existence leak.
- **Success:** status, version and next action are explicit; approval/rejection is confirmable.
- **Conflict/stale:** expected-version conflict keeps edits local and asks the user to reload.
- **Retention/cleanup:** visible state and safe recovery; destructive action is never implicit.

## Responsive and accessibility

- **Desktop:** `DataWorkspace` list/table with optional contextual panel; existing
  `RecordWorkspace` keeps preview/review and contextual state.
- **Tablet:** contextual content uses the platform panel/overlay contract; it must not resize the
  shell by mutating sidebar width.
- **Mobile:** one region at a time, semantic stacked history rows, full-width primary actions,
  no horizontal overflow and minimum 44px touch targets.
- **Keyboard:** table rows and actions have deterministic focus order; dialogs restore focus;
  tabs retain `role="tablist"/"tab"/"tabpanel"` semantics; Escape closes only the owned overlay.
- **Screen readers:** loading, errors, status and retention state are text, not color-only signals.
- **Themes:** LoopDev identity remains unchanged; organization theming uses approved semantic tokens.
- **Reduced motion:** processing/cleanup transitions respect `prefers-reduced-motion`.

## Journeys

**Primary:** authorized reviewer opens history, filters to a pending version, opens it in the
existing `RecordWorkspace`, reviews extraction/validation evidence, edits allowed fields, saves with
an expected version, and approves. Audit and retention state are visible but owned by Core.

**Negative:** a user opens an ID outside scope, receives `forbidden/not-found` without leakage,
retrying a provider failure preserves the version and audit trail, a stale edit returns a conflict,
and an expired document shows cleanup status instead of a download or destructive affordance.

## Explicit exclusions and approval gate

Fraud, authenticity, liveness, legal verification, batch operations, public sharing, manual
permanent deletion and consumer-specific business workflows are excluded. Product Owner must approve
scope, roles, copy, retention visibility and journeys; Tech Lead must approve shell composition,
contract states, tenancy and recovery. Both approvals are pending.
