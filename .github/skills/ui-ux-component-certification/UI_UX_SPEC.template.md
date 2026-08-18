# UI/UX Specification: <ComponentName>

- Implementation: `<exact component path>`
- Public export: `<package or import path>`
- Owner: `<atom | composite | workspace | suite | feature | widget>`
- Runtime: `server | client | dual`
- Directive: `none | use client`
- Status: `draft | in-progress | ready-for-review | certified | expired`
- Last reviewed: `<YYYY-MM-DD>`
- Consumers: `<routes, suites or products>`
- Related track: `<active track path>`
- Spec version: `<major.minor>`
- Contract version: `<public API or behavior version>`
- Compatible since: `<release or date>`
- Platform target: `web-only | mobile-adapted | cross-platform`

## Quick reference

- Use when: <user need this component solves>
- Do not use when: <nearest alternative or out-of-scope need>
- Main composition: `<parent + sibling components>`
- Compatible with: `<components/views>`
- Not compatible with: `<components/views or ownership boundaries>`
- Certification: `<status and last evidence review>`

## Need-to-component decision

| User need | Use this component when | Prefer another component when |
| --------- | ----------------------- | ----------------------------- |
| `<...>`   | `<...>`                 | `<...>`                       |

## Purpose

Describe the user outcome this component supports. Do not describe CSS or
implementation details as the purpose.

## Responsibility

### Owns

- <semantic and visual responsibilities owned by this component>

### Does not own

- <data, authorization, persistence, shell, domain or page responsibilities>

## Anatomy and composition

```text
<parent context>
└── <component reading order and visual layers>
```

- Reading order: <...>
- Surface/plane owner: <...>
- Approved primitives: <...>
- Density: <...>
- Typography: <...>
- Semantic color roles: <...>
- Theme token mapping: <semantic tokens, never raw colors>
- Tenant/brand variation: <token-only | composition | not-supported>
- Dark mode/high contrast: <support and evidence>
- Prohibited composition: <...>

## Public UI contract

| Prop/state | Meaning | Visual behavior | Interaction | Accessibility |
| ---------- | ------- | --------------- | ----------- | ------------- |
| `<...>`    | `<...>` | `<...>`         | `<...>`     | `<...>`       |

## Interaction model

For overlays, menus and selection controls, include explicit rows for opening,
selecting, deselecting/toggling, clearing all values, Escape and outside
interaction. Mark whether each action keeps the popup open or closes it. For
multi-select, define repeated-mutation behavior separately from
`multiple=false` single-select behavior.

| Capability | User intent | Pointer/touch | Keyboard/focus | Escape/close | Feedback |
| ---------- | ----------- | ------------- | -------------- | ------------ | -------- |
| `<...>`    | `<...>`     | `<...>`       | `<...>`        | `<...>`      | `<...>`  |

## State model

| State       | Entry condition | Required UI | Allowed actions | Accessibility |
| ----------- | --------------- | ----------- | --------------- | ------------- |
| `ready`     | `<...>`         | `<...>`     | `<...>`         | `<...>`       |
| `loading`   | `<...>`         | `<...>`     | `<...>`         | `<...>`       |
| `empty`     | `<...>`         | `<...>`     | `<...>`         | `<...>`       |
| `error`     | `<...>`         | `<...>`     | `<...>`         | `<...>`       |
| `read-only` | `<...>`         | `<...>`     | `<...>`         | `<...>`       |
| `disabled`  | `<...>`         | `<...>`     | `<...>`         | `<...>`       |

| `forbidden` | `<...>` | `<...>` | `<...>` | `<...>` |
| `skeleton` | `<...>` | `<...>` | `<...>` | `<...>` |

State applicability must be explicit. Use `required`, `applicable`,
`not-applicable` or `deferred` for every state; do not leave a state blank.

## Content and localization contract

- Title/label guidance: <what the content should communicate>
- Description/help guidance: <when it is required or omitted>
- Action naming and tone: <primary, secondary, destructive or recovery wording>
- Maximum expected content: <long title, label, note or user-generated value>
- Wrapping/truncation: <wrap, truncate, clamp or never truncate>
- Translation requirements: <languages, longer strings and pluralization>
- Date/number/currency ownership: <consumer formatter and locale rules>
- User-generated content: <escaping, empty values and safe rendering>

## Density and viewport matrix

| Context     | Density | Content scale | Behavior |
| ----------- | ------- | ------------- | -------- |
| Workspace   | `<...>` | `<...>`       | `<...>`  |
| Panel/modal | `<...>` | `<...>`       | `<...>`  |
| Mobile      | `<...>` | `<...>`       | `<...>`  |

## Responsive contract

| Viewport | Layout  | Transformation | Overflow rule | Acceptance evidence |
| -------- | ------- | -------------- | ------------- | ------------------- |
| Desktop  | `<...>` | `<...>`        | `<...>`       | `<...>`             |
| Tablet   | `<...>` | `<...>`        | `<...>`       | `<...>`             |
| Mobile   | `<...>` | `<...>`        | `<...>`       | `<...>`             |

## Accessibility contract

- Semantic element/role: <...>
- Accessible name/description: <...>
- Label and help/error association: <...>
- Focus-visible and focus return: <...>
- Keyboard order and activation: <...>
- Reduced motion: <...>
- Contrast and non-color state communication: <...>
- Overlay persistence: <actions that keep open or close the popup, including select, deselect, clear, Escape and outside interaction>
- Clear-all action: <visibility, accessible role, read-only/disabled behavior, focus result and consumer callback>
- Automated A11y evidence: <vitest-axe, axe-core, Playwright or equivalent>

## Platform portability

| Platform        | Implementation             | Shared contract           | Allowed divergence               | Evidence |
| --------------- | -------------------------- | ------------------------- | -------------------------------- | -------- |
| Web/RSC         | `<...>`                    | `<tokens/types/behavior>` | `<...>`                          | `<...>`  |
| Web/client      | `<...>`                    | `<...>`                   | `<...>`                          | `<...>`  |
| Expo/NativeWind | `<path or not-applicable>` | `<...>`                   | `<layout/interaction/semantics>` | `<...>`  |

- Native equivalent: `<component path or not-applicable>`
- NativeWind compatibility: `supported | partial | not-supported`
- RSC constraints: `<browser APIs, hooks, event handlers or serialization limits>`

## Usage recipes and compatibility

### Recommended usage

```tsx
<ComponentName
/* minimum meaningful configuration */
/>
```

Use this section to show one complete composition that follows the contract.
Explain which parent owns layout, which consumer owns data and which actions
remain domain-specific.

### Avoid

```tsx
<ComponentName
/* configuration that violates ownership or creates an ambiguous UX */
/>
```

Explain why this composition is invalid and what should be used instead. Include
at least one anti-pattern involving ownership, one involving responsive layout
or overflow, and one involving accessibility or state semantics when relevant.

### Works with

| Component/view | Supported relationship          | Required conditions | Result  |
| -------------- | ------------------------------- | ------------------- | ------- |
| `<...>`        | `<wraps / composes / consumes>` | `<...>`             | `<...>` |

### Does not work with

| Component/view | Incompatibility | Reason  | Alternative |
| -------------- | --------------- | ------- | ----------- |
| `<...>`        | `<...>`         | `<...>` | `<...>`     |

### Designed capabilities and future suites

- Designed for: <tasks, states, density and user roles this component supports>
- Not designed for: <tasks, data ownership or product behavior outside scope>
- Future CRM use: <plausible screen compositions>
- Future Marketing Studio use: <plausible screen compositions>
- Future Operations use: <plausible screen compositions>
- Extension boundary: <what may be configured or composed without forking>
- New capability requires: <new state/API/consumer evidence that reopens the spec>

## Approved and experimental compositions

### Approved

- `<route or fixture>`: <why it follows this contract>

### Experimental

- `<route or fixture>`: <what is being tested and what blocks approval>

## Composition checklist

- [ ] Parent surface and ownership are correct
- [ ] Page/section hierarchy is correct
- [ ] Data, permissions and domain actions remain consumer-owned
- [ ] Compatible state is selected (`loading`, `empty`, `error`, etc.)
- [ ] Mobile transformation and overflow are explicit
- [ ] Keyboard, focus and accessible names are verified
- [ ] Overlay persistence is explicit for selection, deselection, clear, Escape and outside interaction
- [ ] Showcase/Storybook consumes the public component without corrective logic
- [ ] Theme tokens work for tenant, dark mode and high contrast where applicable
- [ ] Loading/skeleton transitions preserve dimensions and avoid CLS
- [ ] No shared behavior is duplicated in the consumer

## Performance and observability

- Rendering scale: <safe number of instances or virtualization requirement>
- Layout stability: <skeleton/measurement/layout-shift behavior; loading -> ready -> empty/error>
- Animation/assets: <cost, reduced-motion behavior and loading strategy>
- Consumer telemetry hooks: <events the consumer may emit>
- Data/privacy rule: <what must never be sent to analytics>

## Suite portability

| Consumer         | Allowed configuration | Domain behavior owned by consumer | Risks/reopen triggers |
| ---------------- | --------------------- | --------------------------------- | --------------------- |
| CRM              | `<...>`               | `<...>`                           | `<...>`               |
| Marketing Studio | `<...>`               | `<...>`                           | `<...>`               |
| Operations       | `<...>`               | `<...>`                           | `<...>`               |

## Decisions and rejected alternatives

| Decision | Current behavior | Required change | Owner   | Evidence |
| -------- | ---------------- | --------------- | ------- | -------- |
| `keep    | correct          | adapt           | compose | extract  | remove | defer` | `<...>` | `<...>` | `<...>` | `<...>` |

## Certification evidence

### Technical certification boundary

The UI/UX specification does not replace the technical certification record.
Declare the applicable dimensions and link their evidence in the registry or
active track:

| Dimension | Applicability | Status | Evidence / owner |
| --- | --- | --- | --- |
| Security and data integrity | `<required/not-applicable>` | `<status>` | `<evidence>` |
| Data flow and state ownership | `<required/not-applicable>` | `<status>` | `<evidence>` |
| Performance and runtime cost | `<required/not-applicable>` | `<status>` | `<evidence>` |
| Resilience and failure boundaries | `<required/not-applicable>` | `<status>` | `<evidence>` |
| Maintainability and testing contract | `<required/not-applicable>` | `<status>` | `<evidence>` |

`not-applicable` requires a reason. The component cannot be promoted as
globally certified while an applicable technical dimension is undocumented or
missing evidence.

- Contract: `pending | verified` - `<link or command>`
- Accessibility: `pending | verified` - `<link or command>`
- Interaction: `pending | verified` - `<link or command>`
- Responsive: `pending | verified` - `<link or command>`
- States: `pending | verified` - `<link or command>`
- Consumer ownership: `pending | verified` - `<link or command>`
- Visual review: `pending | verified` - `<link or screenshot>`
- Registry: `pending | verified` - `<registry entry>`
- Reproducibility: `pending | verified` - `<command, route, viewport, scenario and artifact>`
- A11y automation: `pending | verified` - `<Axe command, test or artifact>`

## Change impact matrix

| Change                      | Gates to reopen                                  |
| --------------------------- | ------------------------------------------------ |
| Copy only                   | `<accessibility, visual>`                        |
| New visual prop/token       | `<contract, theme, visual>`                      |
| New state                   | `<contract, accessibility, interaction, visual>` |
| Layout/responsive change    | `<responsive, interaction, visual>`              |
| New consumer/suite          | `<portability, ownership, responsive>`           |
| New action or semantic role | `<interaction, accessibility, ownership>`        |

## Spec history

| Date    | Version | Change  | Impact  | Reviewer |
| ------- | ------- | ------- | ------- | -------- |
| `<...>` | `<...>` | `<...>` | `<...>` | `<...>`  |

## Reopen triggers

- <new consumer or suite>
- <new state or interaction>
- <responsive/layout responsibility change>
- <theme/token or accessibility change>
