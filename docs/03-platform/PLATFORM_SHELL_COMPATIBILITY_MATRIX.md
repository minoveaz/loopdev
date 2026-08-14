---
title: Platform Shell suite compatibility matrix
status: phase-1-contract-gate
owner: platform
reviewed_at: 2026-08-14
---

# Platform Shell suite compatibility matrix

## Suite matrix

| Suite | Overview | Data | Workspace | Split | Board | Full-bleed | Required gates |
| --- | --- | --- | --- | --- | --- | --- | --- |
| CRM | dashboard / My Day | Contacts, Leads, Tasks | record/detail semantics | list + detail | Pipeline | focus workflow semantics | access fallback, cursor state, focus restore |
| Marketing Studio | suite home | asset/content lists | editor/workspace | list + inspector | campaign planning where declared | publishing/preview where declared | organization theme, permission filtering |
| Quant Ops | operations dashboard | positions, orders, strategies | strategy/execution context | list + detail | monitoring boards where declared | terminal/diagnostic surfaces | read-only and operational overlays |
| Health OS | suite home | patients/workflows where declared | regulated record context | list + record | only where explicitly approved | focused regulated workflow | privacy, audit, forbidden state |
| Operation OS | suite home | operational modules | module workspace | list + context | only where declared | focused operation | access map and route fallback |

`record` and `focus` are product semantics, not current `SuiteCanvasMode`
values. CRM maps them to `workspace` and `full-bleed` until a contract change
is explicitly approved.

## Shared acceptance gates

1. `NavigationSchema` IDs, priorities and routes are stable.
2. Access filtering happens before rendering; `hidden` never renders.
3. A disabled or forbidden active module resolves to the nearest authorized
   route without leaking module data.
4. `expanded`, `rail` and `hover` preserve the center content x-coordinate
   except for the intended hover overlay.
5. Portal menus preserve expanded state across pointer gaps and restore focus.
6. Canvas mode changes preserve URL state, announce structural changes and
   provide keyboard escape/back behavior.
7. Organization theme affects suite accents only; LoopDev identity remains
   platform-owned.

## Contract gaps requiring explicit decisions

- `AccessMap` now accepts the full shared access contract:
  `enabled`, `disabled`, `hidden`, `coming-soon`, `forbidden` and
  `read-only`. Rendering behavior for the latter two remains a UI gate.
- `SuiteCanvas` has no first-class semantic `record` or `focus` mode.
- Cross-suite interaction tests are not yet present.
