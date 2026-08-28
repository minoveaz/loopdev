## Models, scope and compatibility

```ts
type AutomationStatus = 'draft' | 'activation_requested' | 'active' | 'paused' | 'archived';
type AutomationRunStatus = 'queued' | 'running' | 'succeeded' | 'failed' | 'cancelled';
type AutomationDefinition = { id: string; organizationId: string; workspaceId: string | null; status: AutomationStatus; trigger: string; actionIntent: string; consentPolicyReference: string; createdAt: string; updatedAt: string };
type AutomationRun = { id: string; automationId: string; organizationId: string; status: AutomationRunStatus; workflowReference: string; idempotencyKey: string; createdAt: string; updatedAt: string };
type AutomationQuery = { status?: AutomationStatus; cursor?: string; limit?: number; order?: 'asc' | 'desc' };
type Page<T> = { items: T[]; nextCursor: string | null };
type Result<T> = { ok: true; data: T } | { ok: false; error: { code: AutomationErrorCode; message: string } };
type AutomationErrorCode = 'UNAUTHENTICATED' | 'FORBIDDEN' | 'NOT_FOUND' | 'VALIDATION_ERROR' | 'CONFLICT' | 'CONSENT_REQUIRED' | 'WORKFLOW_NOT_AVAILABLE' | 'AUTOMATION_NOT_CANCELLABLE';
```

`listAutomations` and runs use cursor pagination and allowlisted filters/order. Definition commands
are organization-scoped; only Workflow may advance run execution state. Proposed permissions are
`marketing.automation.read`, `marketing.automation.manage` and `marketing.automation.pause`.
---
title: Marketing Automation Contract
status: proposed
version: 0.1
created: 2026-08-28
owner: marketing-studio
program_track: tracks/planned/marketing-studio/2026-08-28-marketing-studio-module-definition.md
issue: https://github.com/minoveaz/loopdev/issues/151
---

# Marketing Automation Contract

Marketing owns `AutomationDefinition` intent and policy references; Workflow owns `AutomationRun`
execution. Operations: `listAutomations`, `getAutomation`, `createAutomationDraft`,
`requestAutomationActivation`, `pauseAutomation` and `getAutomationRun`. Activation requires
idempotency, authorized consent context and an approved durable workflow.

Errors: `UNAUTHENTICATED`, `FORBIDDEN`, `NOT_FOUND`, `VALIDATION_ERROR`, `CONFLICT`,
`CONSENT_REQUIRED`, `WORKFLOW_NOT_AVAILABLE` and `AUTOMATION_NOT_CANCELLABLE`. No browser command
executes work directly or reads communication/provider secrets.
