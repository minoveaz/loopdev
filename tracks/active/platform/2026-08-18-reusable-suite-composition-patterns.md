---
id: reusable-suite-composition-patterns
title: Reusable suite composition patterns
status: active
created: 2026-08-18
updated: 2026-08-18
owner: platform
lead: User
branch: feature/reusable-suite-composition-patterns
branches: []
phase: 0
pull_requests: []
issues: []
packages: []
release: not-required
areas: [platform, frontend, design-system]
dependencies: [platform-shell-mode-inventory, crm-ui-foundation]
blocked_by: []
supersedes: []
---

# Reusable suite composition patterns

## Outcome

Define and implement reusable operational interaction patterns that can compose CRM and future
suite pages without coupling shared UI to a domain, persistence layer, authorization model or
specific route.

## Context

Shell, SuiteRuntime, SuiteCanvas, canvas modes, surfaces, layers, primitives and data-table
compositions are available. The next reusable boundary is the pattern layer between primitives and
module pages. This track provides stable contracts for repeated operational workflows while keeping
business logic in the consuming suite.

## Alcance inicial

### Incluido

- Audit existing search, command, filter and toolbar primitives before creating duplicates.
- Define the ownership and public contracts for `SearchInput`, `FilterBar` and `QueryToolbar`.
- Cover loading, empty, error, disabled, read-only, keyboard, focus, accessibility and responsive
  states.
- Provide fixtures, focused tests, Axe evidence and responsive showcase coverage.
- Demonstrate consumption through a domain-neutral fixture and one CRM-oriented composition without
  adding CRM data fetching or persistence.
- Record registry, documentation and ownership evidence for every promoted pattern.

### Excluido

- Supabase, RLS, tenant authorization, CRM contracts or server-side data access.
- Entity-specific search behavior, ranking, debouncing policy or query persistence.
- New Shell, SuiteRuntime or SuiteCanvas contracts.
- Route implementation for Contacts, Leads, Pipeline, Tasks or Customer 360.
- Promotion of a pattern without a reviewed contract and focused evidence.

## Primer slice

1. `SearchInput`: controlled query entry, clear, loading, submit, keyboard and accessible status.
2. `FilterBar`: active filter tokens, reset behavior, overflow and mobile representation.
3. `QueryToolbar`: composition boundary with slots for search, filters, view controls and actions.

The first slice must keep fetching, permissions, query serialization and domain semantics in the
consumer. `SearchCombobox` and `SearchCommand` remain separate future patterns because selection
and command navigation have different semantics from text search.

## Fases

### Fase 0: inventario y contrato

- [ ] Existing primitives and duplicate implementations are inventoried.
- [ ] Ownership layer and public API are approved for each pattern.
- [ ] Controlled state, events, slots and consumer responsibilities are documented.
- [ ] Responsive recipes are mapped to validated SuiteCanvas modes.

### Fase 1: implementation and evidence

- [ ] SearchInput implemented with focused unit and Axe coverage.
- [ ] FilterBar implemented with active, reset and responsive states.
- [ ] QueryToolbar implemented as a compositional boundary.
- [ ] Domain-neutral fixtures and responsive Playwright evidence pass.
- [ ] Registry and documentation links match implementation ownership.

### Fase 2: promotion

- [ ] Patterns are consumed by at least two distinct composition contexts or the reuse decision is
      explicitly documented.
- [ ] Accessibility, visual, responsive and source-contract gates pass.
- [ ] Handoff documents define how CRM and future suites consume the patterns.

## Criterios de cierre

- [ ] No duplicate shared component is introduced.
- [ ] Public contracts do not contain CRM entity or persistence semantics.
- [ ] All supported states and responsive transformations have evidence.
- [ ] At least one real or representative suite composition consumes the slice.
- [ ] Registry, tests, fixtures and documentation are synchronized.
- [ ] Closure is approved explicitly by the user.

## Relacion con CRM

CRM consumes this track as a shared frontend capability. It does not replace `crm-shared-foundation`
and does not unblock G0, G1 or module implementation. CRM-specific data, permissions and query
behavior remain owned by the CRM tracks.
