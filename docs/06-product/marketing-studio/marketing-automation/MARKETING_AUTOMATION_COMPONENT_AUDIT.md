```text
App Router -> SuiteRuntime -> SuiteCanvas -> automation widgets -> intent features
	-> AutomationDefinition entity -> Workflow and Communications contracts
```

Worker, scheduler, provider, consent, retry and recovery behavior remain server-side platform
concerns. Shared automation controls require a second consumer and certification.
---
title: Marketing Automation Component Audit
status: proposed
version: 0.1
created: 2026-08-28
owner: marketing-studio
program_track: tracks/planned/marketing-studio/2026-08-28-marketing-studio-module-definition.md
ux_spec: docs/06-product/marketing-studio/marketing-automation/MARKETING_AUTOMATION_UX_SPEC.md
issue: https://github.com/minoveaz/loopdev/issues/151
---

# Marketing Automation Component Audit

Reuse Shell and `@loopdev/ui` data, status and dialog primitives. Implement module widgets
`AutomationList` and `AutomationRunRecord`, plus intent/pause features through Workflow contracts.
No worker, scheduler, provider client, consent engine or retry logic belongs in Canvas, widgets or
shared UI.
