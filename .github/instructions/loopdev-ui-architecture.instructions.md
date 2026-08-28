---
description: "Apply when creating or changing LoopDev Shells, SuiteCanvas compositions, UI components, or domain modules."
applyTo: "ds/**,packages/contracts/src/platform/**,modules/**,apps/**"
---

# LoopDev UI architecture

Use the canonical architecture guide:
[`LOOPDEV_UI_ARCHITECTURE.md`](../../docs/architecture/LOOPDEV_UI_ARCHITECTURE.md).

LoopDev has two complementary layers:

1. **Contract-driven composable Shell:** `AppShell`, `SuiteShell`,
   `SuiteRuntime`, `SuiteCanvas`, navigation schemas, access maps and registered
   composition recipes are platform-owned.
2. **Domain-oriented UI:** suite modules organize domain components as
   `widgets -> features -> entities -> shared` inside the Canvas.

When editing UI:

- Configure the shared Shell through contracts; never create a parallel header,
  sidebar, rail or navigation primitive inside a suite.
- Choose a registered Canvas recipe before creating a view composition.
- Keep the Shell independent from CRM or other domain entities.
- Keep persistence, RLS and server authorization out of UI foundation work.
- Run component inventory and duplicate review before scaffolding a component.
- Record ownership, composition slot, states, accessibility behavior and registry
  evidence for new components.

Read the `platform-shell` skill for Shell behavior and the
`component-development` skill for the component lifecycle. Read the relevant
ADR and product track before changing a contract or domain boundary.