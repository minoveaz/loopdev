---
title: SaaS standardization matrix
status: phase-0-baseline
owner: platform
reviewed_at: 2026-08-14
---

# SaaS standardization matrix

This matrix turns the fifteen cross-cutting concerns into reviewable
contracts. Each product view must provide evidence for every applicable row.

| # | Concern | Platform standard | View evidence |
| --- | --- | --- | --- |
| 1 | Layout and spacing | Grid, gutters, breakpoints and density tokens | Recipe and responsive spec |
| 2 | Visual hierarchy | Shared typography, actions, emphasis and panel hierarchy | View composition |
| 3 | Functional states | Loading, empty, error, forbidden, read-only, offline, stale and conflict | State fixtures/tests |
| 4 | Interactions | Hover, focus, pressed, disabled, keyboard, Escape and portal rules | Interaction tests |
| 5 | Data density | Tables, filters, pagination, sorting, selection and formatting | Data contract |
| 6 | Accessibility | Semantics, contrast, focus, reduced motion and non-color cues | Accessibility evidence |
| 7 | Responsive behavior | Desktop, tablet, mobile and touch rules | Responsive recipe |
| 8 | Theming and tenancy | Platform identity, suite accent and tenant-safe tokens | Theme contract |
| 9 | Internationalization | Text expansion, pluralization, dates, currencies, timezone and RTL readiness | Localization review |
| 10 | Security and permissions | Server enforcement, pre-render filtering, fallback and audit | Permission/RLS evidence |
| 11 | Performance | Bundle, render, list, animation and interaction budgets | Performance check |
| 12 | Observability | Navigation, errors, latency and permission telemetry without sensitive data | Event contract |
| 13 | Component governance | Owner, API, variants, tests and promotion path | Registry/component record |
| 14 | Exceptions | Reason, approval, scope, expiry and removal plan | Exception record |
| 15 | Documentation and validation | View specification, links, tests and review evidence | Track handoff |

## Review rule

A view is not ready for implementation when a required row is missing an owner,
contract or validation plan. Exceptions must be explicit; silence is not an
approval.
