---
name: ui-ux-component-certification
user-invocable: true
description: 'Use with component-development when creating, changing, auditing, reviewing, or certifying LoopDev components. Owns the UI/UX contract, interaction model, responsive behavior, accessibility, visual composition, and final design certification.'
---

# UI/UX Component Certification

This skill is the design authority for LoopDev component quality. It runs in
parallel with `component-development`, but it does not replace technical
ownership, route classification, implementation, tests, registry work or
product authorization.

The reusable UI/UX contract lives next to the actual component in
`UI_UX_SPEC.md`. Use [UI_UX_SPEC.template.md](./UI_UX_SPEC.template.md) for
new specifications. The active track records the project history and gate
decisions; the registry indexes the component and links to its evidence. Do
not use the track or registry as a substitute for the component specification.

`component-development` answers: **where does the component live, what does it
own technically, how is it implemented and what evidence is required?**

This skill answers: **what should the user experience, how should it behave,
how should it compose, and is the result coherent enough to certify?**

A component cannot be promoted or marked certified until both gates pass:

```text
Technical gate: component-development = certified
UI/UX gate: ui-ux-component-certification = certified
Promotion: allowed only when both are certified
```

UI/UX certification remains independent from the technical certification
dimensions. It owns experience, interaction, responsive composition,
accessibility, visual review, theme portability and visible state behavior. It
does not replace the technical review of security, data ownership, runtime
cost, resilience or testing; those dimensions are coordinated by
`component-development` and recorded in the registry and active track.

## Non-negotiable ownership

- Shared primitives own semantics, accessible interaction, tokenized visual
  behavior and stable geometry.
- Shared composites own reusable composition without suite business rules.
- Features, widgets and suite compositions own domain copy, data state,
  permissions, queries and product actions.
- `composition-showcase` is a consumer-level approval surface. It must never
  implement the component's visual or interaction logic.
- Showcase, Storybook and equivalent fixtures must consume the public component
  without corrective CSS, duplicated behavior, artificial wrappers or mocks
  that hide defects in the real implementation. Test data is allowed only when
  it exercises the actual public contract.
- Do not solve a UI/UX finding with showcase-only CSS or duplicated controls.
  Return the finding to the component's owning layer.
- Do not certify a fixture, screenshot or route as a component. Certify the
  actual exported implementation and record its consumers.
- Reusable composites must expose every consumer-controlled decision through
  typed API: data, labels/copy, filter definitions and values, states,
  permissions, actions, selection and recovery handlers. Domain values,
  technical IDs rendered as user-facing copy, fixture records and mutation
  behavior must not be hardcoded in the implementation.
- Source-contract certification is a shared gate for current and future
  components. Fixtures may contain representative data, but the exported
  implementation may not contain domain data, default visible copy, raw
  palette values, literal z-indexes or inline visual styles. The canonical
  evidence is `pnpm certification:source-contracts`; a local component test
  cannot waive or replace it.

## Certification states

Every audited component must carry one UI/UX status in its active track:

| Status              | Meaning                                                                             |
| ------------------- | ----------------------------------------------------------------------------------- |
| `not-started`       | No UI/UX audit exists                                                               |
| `in-progress`       | Audit or evidence collection is active                                              |
| `changes-requested` | A concrete UX/UI defect blocks approval                                             |
| `ready-for-review`  | Contract and automated/interaction evidence are complete; visual review is next     |
| `certified`         | UX/UI contract, accessibility, responsive, interaction and final visual review pass |
| `expired`           | A new consumer, state, route, theme or responsibility invalidated prior evidence    |

`certified` is invalid if any required evidence is missing or if the component
changed after the last review without reopening the affected gates.

## Required order

```text
Identify actual implementation
  -> UI/UX inventory
  -> user and suite contract
  -> composition and responsive model
  -> functional/accessibility model
  -> concrete design decisions
  -> implementation handoff
  -> contract and accessibility checks
  -> interaction and responsive checks
  -> visual review last
  -> certify or request changes
```

Visual review is always last. A screenshot cannot waive missing keyboard,
accessibility, responsive, ownership or test evidence.

## 1. Identify the actual component

Before reviewing a component, record:

- name, aliases and exact implementation path;
- exported public entry point;
- ownership layer and owner;
- current consumers and intended future consumers;
- current UI/UX status and evidence links;
- spec version, public contract version and compatibility date;
- whether the request changes capability, state, layout, responsibility or only
  copy/theme.

Locate or create the adjacent `UI_UX_SPEC.md` **before auditing behavior or
creating/substantially changing the component**. Copy
[UI_UX_SPEC.template.md](./UI_UX_SPEC.template.md), replace placeholders with
the actual implementation contract and set `Status: draft` or `in-progress`.
This initial version is the design baseline for the audit; its absence blocks
the workflow from proceeding beyond `not-started`.

If only a showcase fixture exists, status is `not-started`; first create or
locate the actual component through the technical workflow.

## 2. UI/UX inventory

Inspect the implementation, public API, primitives it composes, tests, registry,
fixtures and rendered consumers. Record current behavior for:

- primary task and expected user outcome;
- reading order and information hierarchy;
- surfaces, planes, spacing, density, typography and semantic color roles;
- pointer, touch, keyboard, focus, Escape and reduced-motion behavior;
- loading, empty, filtered-empty, error, forbidden, read-only, disabled,
  offline and conflict states where applicable;
- viewport classes, wrapping, stacking, mobile transformation and overflow;
- labels, names, roles, announcements, focus return and contrast;
- whether visible text derives from consumer labels rather than technical IDs;
- theme and tenant portability.
- runtime boundary: Server Component, Client Component, `dual`, directive and
  serializable props;
- semantic token mapping, tenant/brand variation, dark mode and high contrast;
- Web versus Expo/NativeWind target, native equivalent and allowed divergence;
- content localization, long strings, pluralization and formatter ownership;
- layout stability across skeleton/loading -> ready -> empty/error transitions;
- rendering scale, virtualization, animation cost and consumer telemetry.

## 3. Define the experience contract

Write the contract before implementation or substantial restyling.

### User outcome

State what the user is trying to accomplish and what successful completion
looks like. Avoid describing CSS or implementation details as the outcome.

### Anatomy

Define the visual layers and reading order:

```text
Shell/SuiteCanvas context
└── transparent composition wrapper
    ├── primary content or control plane
    ├── state/context feedback
    └── data or action surface
```

For each layer, name its owner, surface boundary, density, responsive behavior
and prohibited responsibilities. Do not nest an outer card around a complete
workflow unless the contract explicitly requires a framed tool.

### Usage and compatibility recipes

Every `UI_UX_SPEC.md` must include concrete composition guidance before review:

- one recommended usage example with the real public API;
- one or more anti-patterns showing how not to use the component;
- components, primitives and views it is designed to compose with;
- components, views or ownership boundaries it must not be combined with;
- capabilities it supports today and explicit non-goals;
- likely compositions for CRM, Marketing Studio and Operations, even when the
  component is currently consumed by only one suite;
- the extension boundary that future suites may configure without forking the
  component, plus the change that would require reopening certification.

Examples must describe ownership and behavior, not merely show a visually
plausible JSX snippet. They are part of the reusable contract and must be
updated whenever the public API, consumer, state model or composition changes.

The specification must also provide a quick reference, a need-to-component
decision table, approved versus experimental compositions, a density matrix,
content/localization rules, performance and telemetry boundaries, reproducible
evidence, a change-impact matrix and a versioned history. State rows must be
marked `required`, `applicable`, `not-applicable` or `deferred`; an empty state
row is not evidence.

### Change impact routing

Use the spec's change-impact matrix to reopen only the affected gates. At
minimum: new states reopen contract/accessibility/interaction/visual; layout
changes reopen responsive/interaction/visual; new consumers reopen
portability/ownership/responsive; new actions or semantic roles reopen
interaction/accessibility/ownership.

### Interaction matrix

Use this table for every capability:

| Capability | User intent | Affordance | Pointer/touch | Keyboard/focus | States | Accessibility |
| ---------- | ----------- | ---------- | ------------- | -------------- | ------ | ------------- |
|            |             |            |               |                |        |               |

Distinguish transient hover/focus from persistent active context and selection.
Distinguish domain status from control state. Define what happens after Escape,
outside click, submit, cancel, retry, clear and destructive confirmation.

For every popup, menu, select or filter control, explicitly state which actions
open, keep open or close the overlay. For single-select and multi-select
controls, document separately what happens after select, deselect, toggle,
`Clear selection`, Escape and outside interaction. Multi-select controls should
keep the popup open for repeated mutations unless the product contract chooses
another behavior. A clear-all action must define visibility, disabled/read-only
behavior, accessible role, focus result, popup persistence and the
consumer-owned state callback before implementation.

### Responsive contract

Define behavior for desktop, tablet and mobile. State whether content wraps,
stacks, transforms, moves into a popover/bottom sheet, or becomes a semantic
mobile representation. Every transformation must preserve task order,
accessible names, reachability and stable geometry. Reject page-level
horizontal overflow unless the component is explicitly an inspectable canvas.

### Accessibility contract

Specify:

- semantic element and role;
- accessible name and description;
- label association and error/help relationship;
- keyboard order and activation keys;
- focus-visible treatment and focus return;
- Escape and outside-click behavior for overlays;
- announcement requirements for loading, errors, results and selection;
- disabled versus read-only behavior;
- contrast and non-color state communication.
- automated Axe evidence through `vitest-axe`, `axe-core`, Playwright or an
  equivalent project-approved runner.

### Runtime and platform contract

Every spec must declare `Runtime: server | client | dual`, the `Directive`, and
the RSC serialization/browser API constraints. Web responsive behavior does not
prove React Native compatibility. When mobile is relevant, document the native
equivalent, shared contract, NativeWind status and allowed divergence.

### Theme and tenant contract

Certified components use semantic tokens rather than raw colors. The spec must
state tenant/brand variation (`token-only`, `composition` or `not-supported`),
dark mode/high contrast support and the evidence for contrast across supported
themes.

## 4. Suite portability review

Review current and plausible consumers, at minimum CRM, Marketing Studio and
Operations when they may use the component. Separate:

- shared capability and behavior;
- suite composition and copy;
- domain data and permissions;
- feature-only actions;
- prohibited suite leakage into `@loopdev/ui`.

A component is not portable merely because it accepts a `className`. Its
contract must survive different data density, tenant theme, viewport and user
permission states.

## 5. Concrete decision record

Every finding must use one decision:

| Decision  | Use when                                                     |
| --------- | ------------------------------------------------------------ |
| `keep`    | Current behavior meets the contract and has evidence         |
| `correct` | Current behavior violates the UX/UI contract                 |
| `adapt`   | Capability remains but API, state or interaction must change |
| `compose` | Existing primitives should own the behavior                  |
| `extract` | Repeated behavior requires a shared component                |
| `remove`  | Behavior is duplicate, misleading or outside ownership       |
| `defer`   | Intentionally postponed with owner and unblock condition     |

For each decision record the exact file/component, current behavior, concrete
change, reason, rejected alternative, owner, consumer impact, dependency order
and acceptance evidence. Do not accept generic actions such as “improve UI”.

## 6. Evidence gate

A component may move to `ready-for-review` only after all applicable rows pass:

| Gate          | Required evidence                                                                        |
| ------------- | ---------------------------------------------------------------------------------------- |
| Contract      | Public states, anatomy, ownership and tokens recorded                                    |
| Accessibility | Focused unit/Axe coverage and semantic role/name checks                                  |
| Interaction   | Keyboard, pointer/touch, Escape, clear, submit, retry and selection flows                |
| Responsive    | Desktop, tablet and mobile checks including overflow and transformation                  |
| State         | Loading, empty/filtered-empty, error, forbidden, read-only and disabled where applicable |
| Consumer      | At least one declarative consumer and no implementation logic in showcase                |
| Registry      | Owner, route, status, consumers and evidence recorded                                    |
| Source contract | Manifest entry and passing global zero-hardcode validation                          |
| Visual        | Final review only after every preceding gate passes                                      |

Accessibility evidence should prefer the project's existing `vitest-axe` or
`axe-core` setup, with Playwright or Storybook automation when those tools are
actually part of the repository. Do not introduce Storybook solely to satisfy
this skill.

The performance gate must verify stable dimensions and no unacceptable Cumulative
Layout Shift across `skeleton/loading -> ready -> empty/error`, including the
appearance of contextual actions and mobile transformations.

Evidence must identify the actual implementation path, not only a screenshot or
story. A failed row creates `changes-requested` and names the owning layer.

## 7. Visual review

Perform visual review last and inspect at least:

- hierarchy and reading order;
- density and stable dimensions;
- surface nesting and transparent canvas context;
- semantic color and contrast in light/dark/tenant themes;
- hover, focus, active, selected, disabled and read-only states;
- long labels, empty results, error copy and action reachability;
- desktop, tablet and mobile screenshots;
- reduced-motion behavior and animation restraint.

Record findings as `pass`, `changes-requested` or `defer`. A visual failure
returns the component to the concrete decision record; do not patch the
showcase to conceal it.

## 8. Certification record

Add a compact record to the active track:

```md
### UI/UX certification: <Component>

- Implementation: `<exact path>`
- Owner: `<layer/team>`
- Status: `certified | changes-requested | ...`
- Contract: `verified | missing`
- Accessibility: `verified | missing`
- Interaction: `verified | missing`
- Responsive: `verified | missing`
- States: `verified | missing`
- Consumer ownership: `verified | missing`
- API ownership: `verified | missing` for data, labels, states, actions,
  permissions, selection and recovery handlers;
- Visual review: `verified | missing`
- Evidence: `<tests, Playwright, screenshots, registry>`
- Reopen triggers: `<new consumer/state/theme/responsibility>`
```

Only the UI/UX skill may set `Status: certified` for this gate. The technical
workflow may record implementation completion, but it cannot override a
`changes-requested`, `ready-for-review` or missing UI/UX status.

At the end of certification, update the same adjacent `UI_UX_SPEC.md` with the
final contract, resolved decisions, actual evidence links, review date,
consumer ownership and `Status: certified`. The active track must reference
that file and record the certification verdict. A component cannot receive the
UI/UX `certified` status while its specification is still `draft`, `approved`,
stale or missing evidence.

Whenever the public contract, anatomy, state model, responsive behavior,
accessibility behavior or suite portability changes, reopen the specification
at the start of the new audit and repeat the closing update after validation.
