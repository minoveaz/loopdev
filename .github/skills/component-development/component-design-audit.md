# Component Design Audit

Use this artifact before implementing or substantially restyling any LoopDev component.
It is required for components that are not already certified, including existing
components with visual, interaction, responsive, token, or public-contract changes.

## Audit goal

Produce one approved design and implementation decision before code changes begin.
The audit must distinguish platform behavior, suite-specific behavior, current
behavior, required behavior, and behavior that must be removed.

## Required order

### 1. Identify the component

Record:

- component name, aliases, route, owner and current consumers;
- current certification status and evidence;
- candidate ownership layer: atom, composite, workspace, suite shared, feature,
  entity or widget;
- requested user outcome and the problem being solved.

Certification is not assumed from age, location or passing tests. A certified
component may bypass only the audit stages explicitly covered by current evidence;
new consumers or changed responsibilities reopen the relevant stages.

### 2. Inventory the current implementation

Inspect the implementation, public types, hooks, exports, tests, registry entry,
fixtures and active documentation. Record:

- what it renders and what it owns;
- current states, interactions and accessibility behavior;
- current tokens, surfaces, spacing, density and responsive behavior;
- known visual and interaction debt;
- duplicated or conflicting implementations.

### 3. Cross-platform contract

Define behavior that must remain consistent across LoopDev suites and platforms:

- supported viewport classes and input modes;
- keyboard, focus, pointer, touch and reduced-motion behavior;
- loading, empty, error, forbidden, read-only, disabled and offline states;
- accessibility semantics, labels, roles and announcements;
- tenant/theme token requirements and contrast expectations;
- stable geometry, overflow ownership and responsive transformation.

### 4. Suite-specific contract

For each current or plausible consumer, record what changes and what must not
leak into the shared component. Include at least the current suite and likely
future suites such as CRM, Marketing Studio and Operations. Separate:

- shared capability;
- suite composition;
- domain semantics and data shape;
- permissions and product actions;
- suite-only visual treatment.

### 5. Composition and visual standard

Identify the LoopDev composition pattern being proposed:

- owning canvas or shell mode;
- transparent structural wrappers and surface boundaries;
- planes, hierarchy, spacing and depth;
- semantic color roles and state mapping;
- typography, density and technical metadata;
- approved primitives and existing references;
- prohibited nesting, local colors, arbitrary shadows or duplicated controls.

State the user reading order and the visual reason for every layer. Do not start
with CSS values; start with planes, responsibilities and interaction priorities.

### 6. Functional UX model

List each capability and define its UI behavior:

| Capability | User intent | Visual affordance | Interaction | States | Accessibility |
| ---------- | ----------- | ----------------- | ----------- | ------ | ------------- |
|            |             |                   |             |        |               |

Explicitly model transient, persistent and contextual states. Distinguish active
context from multi-selection, hover from focus, and domain status from control
state. Include future capabilities when they affect the public contract.

### 7. Decision record

For every concern, record one decision:

- already correct and retained;
- adapt with a backwards-compatible contract;
- compose from existing primitives;
- extract a shared primitive/composite;
- move to suite ownership;
- remove or retire;
- pending user/design decision.

Record rejected alternatives and why they would violate ownership, reuse,
accessibility, theming, responsive behavior or composition standards.

### 7.1 Concrete action inventory

The audit must end with an implementation-ready action inventory. Do not use
generic conclusions such as "review", "improve" or "align" without naming the
behavior and the change required. Every relevant current behavior must be
classified as one of the following:

| Action    | Meaning                                                                        |
| --------- | ------------------------------------------------------------------------------ |
| `keep`    | Already meets the contract; preserve it and name the evidence                  |
| `correct` | Existing behavior is wrong or unsafe; change it at the owning layer            |
| `adapt`   | Keep the capability but change its API, tokens, states or interaction contract |
| `remove`  | Delete an undocumented, duplicate or conflicting behavior                      |
| `compose` | Move responsibility to an existing primitive or consuming composition          |
| `defer`   | Do not change now; record the owner, reason and unblock condition              |

For each action, record:

- exact component and file or ownership layer;
- current behavior;
- concrete change or explicit preservation decision;
- reason and rejected alternative when relevant;
- owner and consumer impact;
- acceptance evidence: contract, accessibility, responsive, visual or test;
- dependency and order relative to the other actions.

An audit is not implementation-handoff ready until this inventory contains no
unresolved generic verbs and every `defer` has an owner and unblock condition.

### 8. Implementation handoff

Only after the audit is reviewed, define the ordered implementation track:

1. contract and token changes;
2. primitive reuse or extraction;
3. structural composition and surfaces;
4. primary functionality;
5. state and interaction behavior;
6. responsive and accessibility behavior;
7. future-consumer compatibility;
8. tests and registry/documentation evidence;
9. Playwright interaction and responsive checks;
10. visual review as the final certification gate.

The visual review must be the last certification step. Do not use visual
findings to skip or reorder contract, accessibility, test, registry, ownership,
responsive, or interaction validation. If visual review fails, return to the
audit decision and repeat the affected validation sequence after the fix.

Each step must name its owner, affected files, consumer impact and evidence.
The handoff must reference the concrete action inventory from section 7.1 and
must not introduce a new action that was absent from the reviewed decision
record.

### 9. Showcase approval gate

Do not render an implementation in `composition-showcase` until the audit has:

- a reviewed contract and decision record;
- a declared fixture/view-model;
- the implementation handoff;
- explicit visual and functional acceptance criteria.

The showcase is then a consumer-level review surface. It must expose representative
states and interactions without owning the component's visual implementation.

Approval must capture, only after all automated and interaction checks pass:

- visual hierarchy and composition;
- colors and state semantics;
- keyboard/pointer behavior;
- responsive transformation;
- representative loading, empty, error and active states;
- cross-suite portability assumptions.

A failed visual review returns the work to the audit decision, not directly to
random styling patches.

### 10. Post-implementation re-audit

After implementation, rerun this audit against the resulting code, fixtures,
exports and registry diff. Do not create a second informal checklist. Use the
concrete action inventory from section 7.1 as the comparison baseline and
record a status for every action:

| Status           | Meaning                                                                       |
| ---------------- | ----------------------------------------------------------------------------- |
| `verified`       | The requested behavior is implemented and its acceptance evidence passes      |
| `partial`        | The implementation exists but evidence or part of the contract is missing     |
| `failed`         | The action was not implemented or violates the approved ownership/UX contract |
| `still-deferred` | The bounded defer decision remains valid and documented                       |

The re-audit must inspect the implementation diff, public exports, fixtures,
registry metadata and applicable validation results. It must explicitly check
for regressions in ownership, duplicated styling, accessibility, responsive
behavior, theme portability and future-suite compatibility. Any `partial` or
`failed` action returns to the implementation handoff before certification.

## Required audit output

The active track must link or contain:

- current-state inventory;
- cross-platform contract;
- suite matrix;
- composition standard;
- functional UX table;
- keep/adapt/compose/extract/move/remove decisions;
- ordered implementation handoff;
- concrete action inventory classifying behavior as `keep`, `correct`, `adapt`,
  `remove`, `compose` or `defer`;
- post-implementation re-audit with `verified`, `partial`, `failed` or
  `still-deferred` status for every action;
- showcase acceptance criteria and approval status.
