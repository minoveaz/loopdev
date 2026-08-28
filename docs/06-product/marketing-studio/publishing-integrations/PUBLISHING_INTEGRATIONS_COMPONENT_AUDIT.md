---
title: Publishing and Integrations Component Audit
status: proposed
version: 0.1
created: 2026-08-28
owner: marketing-studio
program_track: tracks/planned/marketing-studio/2026-08-28-marketing-studio-module-definition.md
ux_spec: docs/06-product/marketing-studio/publishing-integrations/PUBLISHING_INTEGRATIONS_UX_SPEC.md
issue: https://github.com/minoveaz/loopdev/issues/149
---

# Publishing and Integrations Component Audit

Reuse Platform Shell, `@loopdev/ui` tables, dialogs, status badges and states. Implement module
widgets `ConnectionList`, `PublicationRecord` and `DeliveryEvidence`; implement features
`ConnectProvider`, `RequestPublication` and `RetryPublication` through server contracts. Providers,
OAuth clients, webhooks and secrets belong to Integration Hub/Platform, not UI, widgets or Canvas.

```text
App Router -> SuiteRuntime -> SuiteCanvas -> publication widgets -> features
	-> ChannelConnection and Publication entities -> Integration Hub contracts
```

Provider-specific forms and delivery actions are module features. Platform Core owns authorization,
audit and durable jobs. Any shared connection/status primitive needs a second consumer and certification.
