# UI/UX Specification: CommandDialog

- Implementation: `ds/packages/ui/src/components/composites/utilities/CommandDialog`
- Public export: `@loopdev/ui`
- Owner: `composite`
- Runtime: `client`
- Directive: `use client`
- Status: `certified`
- Last reviewed: `2026-08-16`
- Consumers: SuiteHeader, CRM shell and future workspace command surfaces
- Related track: `tracks/active/crm/2026-08-15-crm-ui-foundation.md`
- Spec version: `0.2`
- Contract version: `command-dialog-v1`
- Compatible since: `2026-08-16`
- Platform target: `mobile-adapted`

## Quick reference

- Use when: a suite needs a keyboard-friendly command search overlay owned by the
  consumer.
- Do not use when: the workflow is a confirmation, form, filter menu or
  domain-specific search page.
- Main composition: `PlatformHeader` renders `CommandBarTrigger`; the shell
  owns the global shortcut and controlled open state; `CommandDialog` owns the
  overlay and command interaction.
- Compatible with: `CommandBarTrigger`, `SuiteHeader`, `AppShell.overlaySlot`,
  CRM and workspace command surfaces.
- Not compatible with: embedding data fetching, authorization policy, mutation
  logic or a full-page search workflow inside the shared component.
- Certification: `certified`; source-contract, focused unit, accessibility, responsive, interaction and final visual gates pass.

## Need-to-component decision

| User need | Use this component when | Prefer another component when |
| --- | --- | --- |
| Execute a known workspace action | Commands are supplied by the consumer and need quick keyboard access | A normal page action or `Button` is sufficient |
| Find a command by label or keywords | The result set is bounded and local to the current shell/workspace | Search requires remote data, pagination or record lookup |
| Confirm a destructive operation | The action needs a confirmation decision | Use `TechnicalDialog` with consumer-owned confirmation copy |
| Filter records | The user is narrowing domain data | Use `Input`, `Select` or `FilterDropdown` |

## Purpose

Help an experienced user discover and execute available workspace commands from
an overlay without leaving the current context. Opening and closing the dialog
must preserve context, keyboard continuity and the focus origin.

## Responsibility

### Owns

- Dialog semantics, overlay geometry, search input, result filtering, active
  result state, keyboard navigation, empty-result feedback, Escape handling,
  focus trap and focus return.
- Stable result-row geometry, semantic theme treatment and reduced-motion
  behavior.

### Does not own

- Command definitions, domain data, permissions, navigation policy, fetching,
  persistence, mutation execution or global shortcut registration.
- The trigger button; `CommandBarTrigger` remains a separate consumer-owned
  opener.

## Proposed public contract

```ts
type CommandDialogItem = {
  id: string;
  label: string;
  description?: string;
  keywords?: string[];
  shortcut?: string;
  icon?: ReactNode;
  disabled?: boolean;
  onSelect?: () => void;
};

type CommandDialogGroup = {
  id: string;
  label?: string;
  commands: CommandDialogItem[];
};

type CommandDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  commands: CommandDialogItem[];
  groups?: CommandDialogGroup[];
  placeholder: string;
  emptyMessage: string;
  title: string;
  description?: string;
  closeLabel: string;
  closeOnSelect: boolean;
};
```

The component exposes a controlled `open` state only. `PlatformHeader` renders
the trigger through `searchSlot`, while the shell/provider registers `Meta+K` /
`Ctrl+K` and owns the shared open state. Command callbacks and copy remain
consumer-owned. Technical IDs are never rendered as labels. The initial
implementation supports bounded local commands and optional flat groups, but
does not own remote loading or async command search; those are deferred until a
separate contract exists.

## Anatomy and composition

```text
AppShell / SuiteHeader overlay plane
└── CommandDialog
    ├── accessible dialog name and description
    ├── search input with search icon
    ├── result list / active option
    │   ├── optional icon
    │   ├── label and description
    │   └── optional shortcut hint
    └── empty-result state
```

- Reading order: dialog title/description, search field, result list, result
  labels/descriptions and shortcut hints.
- Surface/plane owner: `CommandDialog` owns the dialog surface; the shell owns
  global shortcut registration, controlled visibility and placement through
  `AppShell.overlaySlot`.
- Approved primitives: Radix Dialog, `Input` semantics where compatible,
  `Icon`, `IconButton` and semantic text primitives.
- Density: compact workspace utility; result rows must remain touch-reachable.
- Typography: concise labels, optional one-line descriptions and monospace
  shortcut hints.
- Semantic color roles: overlay surface, border, text, muted text, accent,
  focus and disabled tokens only.
- Theme token mapping: semantic tokens, never raw tenant colors.
- Tenant/brand variation: `token-only`.
- Dark mode/high contrast: required; focus, active result and disabled states
  must remain distinguishable without color alone.
- Prohibited composition: nested dialogs, remote record search, consumer-side
  corrective CSS, commands hardcoded inside the shared component or recursive
  command navigation.

## Visual specification

The visual direction is a focused command surface over a quiet, de-emphasized
workspace. The Supabase command menu reference establishes the interaction
language: a compact search-first surface, grouped commands, restrained rows and
keyboard hints. LoopDev must preserve its own industrial theme tokens and
typography rather than reproducing the reference literally.

### Desktop geometry

| Element | Specification | Acceptance rule |
| --- | --- | --- |
| Overlay | Full viewport, blocking backdrop with subdued opacity and optional blur | Underlying shell is visibly de-emphasized but remains recognizable |
| Dialog width | `min(42rem, calc(100vw - 2rem))` | Width remains stable while filtering |
| Dialog height | Content-driven with `max-height: min(38rem, calc(100vh - 4rem))` | Results scroll internally; page never scrolls behind the dialog |
| Dialog surface | Elevated overlay surface, thin semantic border, restrained shadow | One clear plane; no nested cards |
| Header | Search row with consistent horizontal padding and bottom divider | Search field is the first visual and keyboard target |
| Result row | Minimum `2.75rem` height, compact horizontal padding | Pointer target and focus ring do not resize the row |
| Group | Small uppercase/label treatment with vertical separation | Group label is secondary to command labels |
| Shortcut hint | Compact token/chip aligned to the trailing edge | Never overlaps or pushes the command label out of view |

### Desktop visual hierarchy

1. Search input and dialog surface establish the primary focus.
2. Group labels organize the result list without competing with commands.
3. Command labels carry the strongest result-list emphasis.
4. Descriptions and shortcut hints are supporting information.
5. The active row uses surface/accent/focus tokens, not a loud filled badge.

### Row and state treatment

| State | Visual treatment | Non-visual requirement |
| --- | --- | --- |
| Default | Transparent or low-contrast surface | Label remains the primary readable content |
| Hover | Subtle semantic surface lift | Pointer feedback is supplementary |
| Active | Clear focus ring plus accent surface/border | `aria-selected` or equivalent active semantics |
| Disabled | Muted label/icon and reduced affordance | `aria-disabled`; excluded from keyboard execution |
| Empty | Centered compact message with optional search icon | Message is exposed as dialog status |
| Executing | Preserve row dimensions while callback runs | Callback fires once; no layout shift |

### Visual content rules

- Search placeholder: concise action-oriented copy, for example `Run a command
  or search...`, localized by the consumer.
- Group labels: short nouns or categories such as `Shortcuts`, `Actions` and
  `Navigation`; they are optional when the list is small.
- Command labels: verb-led, one line where possible; descriptions may wrap on
  mobile but must not obscure the label.
- Shortcut hints: use platform-aware symbols (`⌘`, `⌥`, `⇧`, `⌃`) only when
  the consumer supplies a meaningful shortcut; do not render empty keycaps.
- Icons: optional and semantically supportive; icon presence must not alter
  label alignment between rows.

### Mobile visual transformation

- The dialog becomes a near-full-width bottom sheet with a small safe-area
  margin and rounded top corners only when that matches the shell token system.
- Search remains pinned at the top of the sheet while results scroll below it.
- Rows use touch-safe height and preserve the same label/description/shortcut
  order as desktop.
- The compact visible title remains in the sheet header; it must not consume
  hero-scale space.
- Backdrop, focus, active state and reduced-motion rules remain equivalent to
  desktop.

### Visual acceptance criteria

- [ ] Desktop surface is centered, bounded and visually dominant without being
  oversized.
- [ ] Backdrop de-emphasizes the shell without making the overlay feel opaque
  or detached from the current context.
- [ ] Search, group labels, rows and shortcuts maintain a stable alignment.
- [ ] Long labels do not overlap icons, descriptions or shortcut hints.
- [ ] Empty, disabled and active states are distinguishable without relying on
  color alone.
- [ ] Mobile bottom sheet does not create horizontal page overflow.
- [ ] Light, dark and high-contrast themes preserve the same hierarchy.
- [ ] Screenshot review covers default, filtered, empty, disabled and mobile
  compositions before certification.

## Interaction model

| Capability | User intent | Pointer/touch | Keyboard/focus | Escape/close | Feedback |
| --- | --- | --- | --- | --- | --- |
| Open | Start command search | `CommandBarTrigger` rendered by `PlatformHeader` | Shell/provider handles `Meta+K`/`Ctrl+K` | Not applicable | Dialog opens with search focused |
| Search | Narrow visible commands | Type/tap field | Input receives typing immediately | Escape closes dialog | Matching rows update without layout jump |
| Move active result | Inspect available commands | Tap a row | Arrow Up/Down changes active option | Escape keeps no selection and closes | Active row has semantic selected state |
| Execute | Run selected command | Tap enabled row | Enter executes active enabled row | Closes by default after execution; explicit `closeOnSelect={false}` may keep it open | `onSelect` fires once |
| Disabled result | Understand unavailable action | Row cannot activate | Skipped by keyboard selection | Dialog remains open | Disabled semantics and styling |
| No results | Recover from query | Clear/edit query | `Meta+A`/`Ctrl+A` remains native input behavior | Escape closes | Consumer-configured empty message |
| Outside interaction | Return to context | Click/tap backdrop closes | Focus returns to opener | Outside close is equivalent to cancel | No command executes |

Selecting an enabled command closes by default after invoking its consumer-owned
callback. `closeOnSelect={false}` keeps the dialog open for explicitly approved
multi-action workflows. Disabled commands never execute and are skipped by
keyboard navigation. There is no clear-all action because the only transient
state is the search query; clearing the input is native input behavior.

## State model

| State | Applicability | Entry condition | Required UI | Allowed actions | Accessibility |
| --- | --- | --- | --- | --- | --- |
| `ready` | required | Dialog open with commands or optional groups | Search, grouped result list | Search, navigate, execute | Dialog and list semantics |
| `loading` | deferred | Remote command source | Consumer-owned loading composition | None until commands arrive | Consumer announcement |
| `empty` | applicable | Consumer supplies no commands | Empty command message | Close or return | Dialog remains named |
| `filtered-empty` | required | Query matches no commands | Empty result message | Edit query, close | Status is readable |
| `error` | deferred | Remote command source fails | Consumer-owned error state | Consumer retry | Consumer announcement |
| `read-only` | not-applicable | Dialog has no read-only mode | N/A | N/A | Do not imply mutation state |
| `disabled` | applicable | Individual command unavailable | Disabled result row | Navigate past, close | Native/ARIA disabled semantics |
| `forbidden` | deferred | Permission policy outside component | Consumer-owned command omission/message | Consumer-owned | No permission leakage |
| `skeleton` | deferred | Async command loading | Consumer-owned placeholder | None | Consumer announcement |

## Content and localization contract

- Title/label guidance: visible compact `Command palette` or a localized
  equivalent; never a technical component name.
- Description/help guidance: optional short context explaining the available
  scope, not keyboard documentation.
- Action naming and tone: commands use concise verb-led localized labels.
- Maximum expected content: labels should remain one line; descriptions may
  truncate visually only when the full accessible name remains available.
- Wrapping/truncation: result labels never silently truncate their semantic
  meaning; descriptions may wrap on mobile.
- Translation requirements: labels, descriptions, empty copy and shortcut hints
  are consumer-localized; do not hardcode English in the implementation.
- Date/number/currency ownership: not applicable; command consumers format any
  domain values before supplying visible copy.
- User-generated content: React escaping applies; command IDs and raw payloads
  are never rendered.

## Density and viewport matrix

| Context | Density | Content scale | Behavior |
| --- | --- | --- | --- |
| Workspace | compact | small/standard | Centered bounded dialog with keyboard-first rows |
| Panel/modal | compact | small | Uses the owning overlay plane without nesting |
| Mobile | touch-sized | standard | Near-full-width bottom sheet with internal result scrolling and no horizontal overflow |

## Responsive contract

| Viewport | Layout | Transformation | Overflow rule | Acceptance evidence |
| --- | --- | --- | --- | --- |
| Desktop | Centered bounded dialog | Search and results remain in one surface | Internal result scroll only | Playwright and visual review |
| Tablet | Centered dialog with flexible width | Rows preserve label/action order | No page overflow | Playwright responsive review |
| Mobile | Near-full-width bottom sheet | Header, search and results stack; title remains compact and visible | Internal vertical scroll only | Playwright mobile review |

## Accessibility contract

- Semantic element/role: Radix `dialog`, search `input`, and listbox/option
  semantics only if the active-result model follows the corresponding ARIA
  pattern.
- Accessible name/description: visible localized title and optional
  description are associated with the dialog; the search field has a visible
  or programmatic label.
- Label and help/error association: search help/error IDs are consumer-safe and
  component-owned when supplied by the API.
- Focus-visible and focus return: focus enters the search field on open and
  returns to the opener on close when the opener remains mounted.
- Keyboard order and activation: typing, Arrow Up/Down, Enter and Escape; Tab
  remains constrained to the dialog's actionable controls.
- Reduced motion: remove non-essential overlay/result transitions.
- Contrast and non-color state communication: active and disabled states use
  semantics, text and focus treatment in addition to color.
- Overlay persistence: search and navigation keep the dialog open; Enter on an
  enabled command closes by default after execution; Escape and outside click
  close without executing a command.
- Clear-all action: not applicable; the search input's native clear/edit behavior
  owns query reset.
- Automated A11y evidence: focused Vitest/Axe plus Playwright keyboard and
  dialog semantics coverage.

## Platform portability

| Platform | Implementation | Shared contract | Allowed divergence | Evidence |
| --- | --- | --- | --- | --- |
| Web/RSC | Client boundary wrapper required | command data and execution intent | browser dialog/focus APIs | focused tests |
| Web/client | `CommandDialog` | tokens, typed items and interaction model | none | Vitest and Playwright |
| Expo/NativeWind | native command sheet per suite | command discovery/execution intent | native sheet and focus model | future suite evidence |

- Native equivalent: suite-owned native command sheet.
- NativeWind compatibility: `partial` at contract level.
- RSC constraints: controlled state and callbacks require a client boundary;
  command items must be supplied by the client composition.

## Usage recipes and compatibility

### Recommended usage

```tsx
<CommandDialog
  open={isCommandOpen}
  onOpenChange={setCommandOpen}
  commands={commands}
  title="Command palette"
/>
```

The shell consumer owns `isCommandOpen`, command definitions, permissions,
localization and execution. `CommandBarTrigger` owns only the opener affordance.

### Avoid

```tsx
<CommandDialog commands={recordsFromRepository} onSelect={saveRecord} />
```

Do not fetch records, decide permissions, mutate domain data or replace a
record-search page with this bounded command surface. Do not wrap it in another
modal or add showcase-only focus/geometry repairs.

## Works with / does not work with

| Component/view | Supported relationship | Required conditions | Result |
| --- | --- | --- | --- |
| `CommandBarTrigger` | opener | controlled `open` state | consistent trigger/dialog flow |
| `AppShell.overlaySlot` | overlay host | one active blocking overlay | shell-aware layering |
| `SuiteHeader` | shell composition | consumer owns shortcut and commands | global command access |
| `Button` / `IconButton` | command content | concise action semantics | consistent command rows |

| Component/view | Incompatibility | Reason | Alternative |
| --- | --- | --- | --- |
| `TechnicalDialog` | nested/replaced command search | different content and interaction model | use as separate confirmation |
| `FilterDropdown` | domain filtering | different state and ownership contract | use filter control |
| repository/service | data fetching/mutation | violates shared composite boundary | inject consumer-owned callbacks |

## Designed capabilities and future suites

- Designed for: bounded local command discovery in CRM, Marketing Studio and
  Operations shells.
- Not designed for: remote record search, long result sets, permissions,
  confirmation flows or navigation policy.
- Future CRM use: contacts, tasks, pipeline actions and workspace navigation.
- Future Marketing Studio use: asset, campaign and brand workspace commands.
- Future Operations use: queue actions, inspectors and operational navigation.
- Extension boundary: typed command labels, descriptions, icons, shortcuts,
  disabled state and consumer callbacks without forking.
- New capability requires: remote loading, nested navigation,
  destructive confirmation or new focus/overlay semantics to reopen this spec.

## Approved and experimental compositions

### Approved

- Contract baseline approved for implementation review: shell-owned shortcut,
  optional flat groups, default close after selection, compact visible title
  and mobile bottom-sheet geometry.

### Experimental

- CRM CertificationLab fixture: planned full/empty/disabled and keyboard review.

## Composition checklist

- [ ] Parent overlay ownership is correct
- [ ] Command data, permissions and execution remain consumer-owned
- [ ] Search, active result and empty-result semantics are explicit
- [ ] Mobile transformation and overflow are explicit
- [ ] Keyboard, Escape, outside click and focus return are verified
- [ ] Showcase consumes the public component without corrective logic
- [ ] Theme tokens work for light, dark and high contrast
- [ ] Dialog open/close and result transitions preserve geometry
- [ ] No command behavior is duplicated in the consumer

## Performance and observability

- Rendering scale: bounded local command lists; consumers own virtualization
  for larger result sets.
- Layout stability: dialog and result rows keep stable dimensions while query
  filtering changes; no page-level layout shift.
- Animation/assets: restrained overlay transition with reduced-motion fallback;
  no component-owned remote assets.
- Consumer telemetry hooks: consumers may record command selection events; the
  shell may record open/close reasons without receiving command payloads.
- Data/privacy rule: the component emits no command payloads, permission data or
  user-entered query text to telemetry.

## Suite portability

| Consumer | Allowed configuration | Domain behavior owned by consumer | Risks/reopen triggers |
| --- | --- | --- | --- |
| CRM | labels, commands, icons, shortcuts | permissions, routing, mutations | record search or async commands |
| Marketing Studio | labels, commands, icons, shortcuts | asset/campaign actions | large remote command catalog |
| Operations | labels, commands, icons, shortcuts | queue and inspector actions | destructive or audited actions |

## Decisions and rejected alternatives

| Decision | Current behavior | Required change | Owner | Evidence |
| --- | --- | --- | --- | --- |
| `compose` | `PlatformHeader` renders the trigger through `searchSlot` | Keep trigger presentation in the header and move global shortcut/open-state ownership to the shell | frontend-platform | shell slot review |
| `compose` | `TechnicalDialog` owns generic modal presentation | Reuse Radix dialog primitives, not confirmation semantics | frontend-platform | dependency review |
| `compose` | No command palette implementation exists | Support local commands with optional flat groups in v1 | frontend-platform | product decision |
| `keep` | Selection closes the command surface in the normal flow | Default `closeOnSelect` to `true`; allow explicit opt-out | frontend-platform | interaction decision |
| `compose` | Mobile overlay geometry is unspecified | Use a near-full-width bottom sheet with compact visible title | frontend-platform | responsive decision |
| `defer` | Remote command loading is unspecified | Keep local bounded commands in v1 | frontend-platform | scope review |
| `defer` | Native implementation is absent | Define native equivalent when a second platform consumer exists | suite owner | portability review |

## Change impact matrix

| Change | Gates to reopen |
| --- | --- |
| Add nested navigation | Contract, interaction, accessibility, responsive, visual |
| Add remote/async command loading | State, resilience, performance, accessibility, visual |
| Change focus or overlay ownership | Contract, interaction, accessibility, shell integration |
| Add destructive confirmation | Ownership, state, interaction, accessibility, visual |
| Add new suite consumer | Portability, ownership, responsive, visual |

## Certification evidence

- Contract: `verified` - public API, types and focused component tests.
- Accessibility: `verified` - focused Axe coverage for dialog semantics and
  keyboard behavior.
- Responsive: `verified` - CRM Playwright desktop, mobile and mobile-compact
  matrix.
- Source contract: `verified` - `pnpm certification:source-contracts`.
- Registry: `verified` - `command-dialog-v1` entry and CRM showcase evidence.

## Version history

| Date | Version | Change | Impact | Reviewer |
| --- | --- | --- | --- | --- |
| `2026-08-16` | `0.3` | Certification evidence recorded after implementation and CRM matrix review | `certified` | `GitHub Copilot` |
| `2026-08-16` | `0.2` | Approved decisions: shell shortcut, flat groups, close behavior, title and mobile sheet | `ready-for-review` | `GitHub Copilot` |
| `2026-08-16` | `0.1` | Initial contract baseline before implementation | `in-progress` | `GitHub Copilot` |
