# UI/UX Specification: CommunicationsInboxWidget

- Implementation: `apps/loopdev-os/src/suites/sales-crm/communications/CommunicationsInboxWidget.tsx`
- Public export: `@/suites/sales-crm/communications/CommunicationsInboxWidget`
- Owner: `widget`
- Runtime: `client`
- Directive: `use client`
- Status: `in-progress`
- Last reviewed: `2026-08-30`
- Consumers: `/sales-crm/communications`
- Related track: `tracks/active/crm/2026-08-30-communications-inbox-implementation.md`
- Spec version: `0.2`
- Contract version: `0.2`
- Compatible since: `2026-08-30`
- Platform target: `mobile-adapted`

## Quick reference

- Use when: an authorized suite needs to triage conversations and work one selected thread with contextual data.
- Do not use when: a page needs a table-only workflow, provider administration or a second navigation system.
- Main composition: `SalesCrmShell -> SuiteRuntime -> SplitWorkspace -> CommunicationsInboxWidget`
- Data path: `SalesCrmShell -> CommunicationsInboxProvider -> GET /api/communications/inbox -> authorized Communications Core read model`
- Compatible with: `SuiteRuntime`, `SplitWorkspace`, CRM context views and public Communications read models.
- Not compatible with: direct Supabase access, provider adapters, a parallel shell or an outer workflow card.
- Certification: in progress; technical and visual evidence pending.

## Need-to-component decision

| User need                                  | Use this component when                                                                   | Prefer another component when                                                   |
| ------------------------------------------ | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| Triage and operate a selected conversation | The user needs list, thread, composer and context in one workflow.                        | The user only needs a CRM contact table or a provider settings form.            |
| Review a conversation without mutation     | The user has authorized read access but no reply, assignment or lifecycle permission.     | The user needs an audit report with no interactive selection.                   |
| Adapt the same workflow to another product | The consumer can provide participant and context read models through the public contract. | The consumer would need CRM entities or provider credentials inside the widget. |

## Purpose

Help an authorized agent understand which conversations need attention, act on
one conversation, and keep the relevant customer context visible without
leaving the CRM workspace.

## Responsibility

### Owns

- Conversation list, active filter state and selected conversation presentation.
- Thread reading order, Reply/Template/Internal note mode and user feedback for actions.
- Presentation of assignment, lifecycle and Core policy states.
- Responsive transition between list, thread and context.

### Does not own

- Organization resolution, authorization decisions or tenant filtering.
- Supabase persistence, provider calls, webhook processing or delivery policy.
- CRM contact mutation, lead creation, opportunity creation or marketing consent.
- Platform shell geometry, navigation, global overlays or tenant color selection.

## Anatomy and composition

```text
SuiteRuntime / SplitWorkspace
├── ModuleContextSidebar
│   ├── status filters
│   └── conversation list
├── SuiteCanvas
│   ├── conversation identity and actions
│   ├── message timeline
│   └── Reply / Template / Internal note composer
└── ModuleContextPanel
    └── CRM-owned participant and relationship context
```

- Reading order: active filter -> conversation identity -> latest messages -> composer -> selected participant context.
- Surface/plane owner: `SplitWorkspace` owns structural planes; this widget owns content within the declared slots.
- Approved primitives: existing heading, button, badge, avatar, input, scroll, empty, loading, error, menu and dialog primitives after inventory review.
- Density: compact operational density for list and timeline; normal density for CRM context.
- Typography: existing LoopDev type tokens and semantic hierarchy.
- Semantic color roles: channel, unread, success, warning, error, disabled and neutral tokens; never raw colors.
- Theme token mapping: inherited LoopDev semantic tokens with organization theme support.
- Tenant/brand variation: `composition`; consumer may provide contextual content and copy, but may not recolor LoopDev identity.
- Dark mode/high contrast: required; state meaning must not rely on color alone.
- Prohibited composition: nested page cards, fixed positioning, page-local overlay managers, arbitrary widths or a second sidebar.

## Public UI contract

The public boundary is split by responsibility:

- `CommunicationsInboxProvider` receives `organizationId`, `initialModel`,
  `dataSource`, `copy`, `formatters` and `actorLabel` through typed props.
- `InboxDataSource` owns loading and optional mutations. The API adapter
  implements authorized reads and actions; the fixture adapter is used by
  isolated tests and the E2E bypass.
- `InboxCopy` owns all visible product copy, labels, status naming and
  accessibility text. Components do not define domain data or business copy.
- `InboxModel` and its nested conversation/message contracts are exported by
  `@loopdev/contracts` and validated at the API boundary.

The visual surfaces are split into `InboxList`, `InboxThread`, `InboxComposer`,
`CommunicationsInboxContext`, `InboxModuleHeader`, `InboxFooter` and
`InboxState`. They consume the provider contract and do not resolve
organizations, permissions, persistence or provider credentials.

| Prop/state     | Meaning                                                           | Visual behavior                                       | Interaction                                              | Accessibility                                           |
| -------------- | ----------------------------------------------------------------- | ----------------------------------------------------- | -------------------------------------------------------- | ------------------------------------------------------- |
| `initialModel` | Optional authorized initial read model                            | Renders immediately when supplied; otherwise loading  | Consumer controls server-side hydration                  | Model states use semantic regions                       |
| `dataSource`   | Typed read and mutation adapter                                   | Loads data and exposes only supported actions         | Provider owns request lifecycle and local action updates | Unsupported capabilities are unavailable, not focusable |
| `copy`         | Visible labels, status names, action labels and accessible text   | Keeps domain copy outside visual components           | Consumer can localize or adapt wording                   | Labels and announcements remain explicit                |
| `formatters`   | Date and time presentation                                        | Formats timestamps without changing the model         | Consumer owns locale and timezone policy                 | Dates retain machine-readable values where rendered     |
| `actorLabel`   | Current actor display name                                        | Names local outbound messages and assignment feedback | Consumer supplies the authorized actor context           | Author identity is readable in the timeline             |
| `presentation` | `ready`, `loading`, `empty`, `forbidden`, `error` or policy state | Selects a complete state while preserving geometry    | Retry is exposed through the provider                    | `role=status` or `role=alert` is used by urgency        |
| template parameters | Values required by the approved template | Known CRM values are prefilled; unresolved values remain editable inputs | Consumer owns the context mapping and manual edits | Each parameter has an associated accessible label |

## Interaction model

The template selector is the shared `Select` single-select control. Opening is
owned by the control, selecting a template closes its menu, and Escape restores
the previous selection without submitting. Known parameters are prefilled from
the selected CRM contact (`firstName`, `contactName`, `phone` and
`companyName` when available), remain editable, and are never overwritten after
the user changes them. Unknown parameters remain manual inputs. No clear action
is needed because an empty template selection returns the composer to its
disabled state.

| Capability                 | User intent               | Pointer/touch             | Keyboard/focus                                             | Escape/close                              | Feedback                                    |
| -------------------------- | ------------------------- | ------------------------- | ---------------------------------------------------------- | ----------------------------------------- | ------------------------------------------- |
| Select conversation        | Open a thread             | Activate a row            | Tab to row, Enter or Space activates                       | No overlay; selection remains             | Selected row and thread heading update      |
| Change status filter       | Narrow triage list        | Activate one filter       | Arrow keys within filter group, Enter commits              | No overlay                                | Result count and list update                |
| Toggle Reply/Template/Internal note | Choose audience or approved outbound format | Activate the mode control | Tab and arrow keys; mode is single-select | No overlay | Composer label and send action change |
| Select approved template | Choose a policy-compliant outbound template | Open the shared Select and choose one option | Arrow keys and Enter within the menu | Escape restores prior selection | Parameter fields and send action update |
| Assign to self             | Claim work                | Activate assign action    | Button activation with Enter or Space                      | No overlay                                | Pending then assignment event               |
| Send reply or note         | Submit a composed message | Activate send             | Ctrl/Cmd+Enter submits when valid; Enter creates a newline | Draft remains available                   | Queued, sent, failed or policy feedback     |
| Change lifecycle           | Progress or close work    | Activate status action    | Button/menu trigger is keyboard reachable                  | Destructive confirmation closes on Escape | Timeline event and status badge update      |
| Mobile context             | Inspect CRM information   | Navigate to context view  | Back returns to thread and restores focus                  | No overlay                                | Context heading identifies the current view |

## State model

| State            | Entry condition                                          | Required UI                                               | Allowed actions                            | Accessibility                                     |
| ---------------- | -------------------------------------------------------- | --------------------------------------------------------- | ------------------------------------------ | ------------------------------------------------- |
| `ready`          | Authorized data is available                             | List, selected thread and context                         | Contract-authorized actions                | Active conversation and headings are exposed      |
| `loading`        | Initial or refreshed read model is pending               | Stable skeleton list, thread and context geometry         | No mutation until data is ready            | Loading status is announced without layout shift  |
| `skeleton`       | Placeholder rendering is explicitly requested            | Same geometry as `loading`                                | None                                       | Skeletons are hidden from assistive technology    |
| `empty`          | No authorized conversations exist                        | Empty explanation and recovery action if available        | Change view or refresh                     | Empty region has a meaningful heading             |
| `filtered-empty` | Active filter has no matches                             | Empty result with clear-filters action                    | Clear filters                              | Clear action has an accessible name               |
| `no-selection`   | List exists but no conversation is selected              | Instructional neutral canvas                              | Select a conversation                      | Status is understandable without visual placement |
| `error`          | Read or action request failed                            | Normalized error and retry path                           | Retry, preserve safe draft                 | Error uses `role=alert` when actionable           |
| `forbidden`      | Actor lacks read scope                                   | No conversation data; access explanation                  | Navigate away or retry after access change | Sensitive content is absent from DOM              |
| `read-only`      | Actor can read but cannot mutate                         | Full thread and context, no mutation controls             | Navigation and reading only                | Hidden actions are not focusable                  |
| `paused`         | Core account or organization kill switch blocks outbound | History remains; reply and retry are disabled with reason | Read, inspect and allowed non-send actions | Pause is communicated as text, not color only     |
| `window-expired` | WhatsApp free-text window is closed                      | Free text disabled; approved template path when supplied | Select valid template and fill parameters or read | Disabled reason is associated with composer |
| `send-failure`   | Core/provider returns normalized failure                 | Draft retained and failure shown                          | Correct or explicitly retry                | Failure announcement includes recovery guidance   |
| `conflict`       | Version changed since read                               | Affected context refresh notice                           | Reload current state; no silent overwrite  | Conflict is announced and focus moves to recovery |
| `offline`        | Network is unavailable                                   | Read cache or unavailable state as supplied by consumer   | Retry; no false success                    | Offline status is visible and announced           |

## Content and localization contract

- Title/label guidance: describe the work context, such as `Communications` or `Conversation with Ana Garcia`, not technical IDs.
- Description/help guidance: explain permission, account, window and policy restrictions only when they affect an action.
- Action naming and tone: use functional verbs such as `Assign to me`, `Reply`, `Add note`, `Set pending`, `Close` and `Retry`.
- Maximum expected content: long contact names, translated statuses, long message bodies and failure explanations must fit without clipping.
- Wrapping/truncation: list previews may clamp after two lines; message bodies wrap; accessible names retain the complete value.
- Translation requirements: all consumer copy must be localizable, including plural counts and policy explanations.
- Date/number/currency ownership: consumer formatter supplies locale-aware relative and absolute timestamps; this widget does not assume a locale.
- User-generated content: render message and note bodies as escaped text; never interpret provider markup or executable content.

## Density and viewport matrix

| Context       | Density             | Content scale                              | Behavior                                                   |
| ------------- | ------------------- | ------------------------------------------ | ---------------------------------------------------------- |
| Workspace     | Compact operational | Small list metadata, readable message body | List and thread scroll independently within SplitWorkspace |
| Context panel | Normal              | Relationship fields and actions            | Panel scrolls independently and may collapse on tablet     |
| Mobile        | Compact, touch-safe | One task surface at a time                 | List, thread and context become sequential views           |

## Responsive contract

| Viewport | Layout                                           | Transformation                                              | Overflow rule                                                    | Acceptance evidence                           |
| -------- | ------------------------------------------------ | ----------------------------------------------------------- | ---------------------------------------------------------------- | --------------------------------------------- |
| Desktop  | Three declared SplitWorkspace areas              | List, thread and CRM context remain visible                 | Each region owns vertical scrolling; no page horizontal overflow | Responsive geometry and interaction tests     |
| Tablet   | List and thread primary; CRM context collapsible | Context panel becomes an explicit module action or drawer   | Thread remains readable; no clipped composer                     | Tablet responsive test and keyboard review    |
| Mobile   | One semantic surface at a time                   | List -> thread -> CRM context; URL selection remains stable | No horizontal page overflow; message body wraps                  | Mobile interaction and accessibility evidence |

## Accessibility contract

- Semantic element/role: landmarks for list, main thread and context; buttons for actions; listbox/list semantics only when the interaction contract supports them.
- Accessible name/description: every region identifies its purpose; conversation rows include participant, status, unread state and last activity.
- Label and help/error association: composer mode, input, policy restriction and failure are explicitly associated.
- Focus-visible and focus return: selection moves focus to the conversation heading on mobile; returning to the list restores the active row.
- Keyboard order and activation: filters -> list -> thread actions -> timeline -> composer -> context; all actions support keyboard activation.
- Reduced motion: no required motion; transitions are disabled or shortened under `prefers-reduced-motion`.
- Contrast and non-color state communication: status text, icons or labels accompany color indicators.
- Overlay persistence: the template selector is native single-select; selection closes it, Escape restores the previous value and outside interaction is browser-owned.
- Clear-all action: `Clear filters` is consumer-owned, visible when filters are active, disabled when none are active and returns focus to the filter group. Template selection has no clear action; the consumer can return to Reply or Note.
- Automated A11y evidence: focused Vitest/Testing Library and Axe evidence before visual review.

## Platform portability

| Platform        | Implementation                                                               | Shared contract                                      | Allowed divergence                              | Evidence                                |
| --------------- | ---------------------------------------------------------------------------- | ---------------------------------------------------- | ----------------------------------------------- | --------------------------------------- |
| Web/RSC         | Route server boundary supplies serializable model; widget is client-rendered | Public read models, capabilities and semantic states | Server data loading and URL routing             | Pending implementation                  |
| Web/client      | `CommunicationsInboxWidget` owns interaction presentation                    | Typed provider, data-source and copy contracts       | Consumer-specific context and copy              | Pending implementation                  |
| Expo/NativeWind | Not implemented in this slice                                                | Conversation, message and action semantics           | Native navigation and input controls may differ | Deferred until a native consumer exists |

- Native equivalent: not applicable to current CRM web slice.
- NativeWind compatibility: partial by contract; no native implementation yet.
- RSC constraints: browser event handlers and draft state remain in the client widget; props must be serializable at the route boundary.

## Usage recipes and compatibility

### Recommended usage

```tsx
<CommunicationsInboxProvider
  organizationId={organizationId}
  initialModel={initialModel}
  dataSource={dataSource}
  copy={copy}
  formatters={formatters}
  actorLabel={actorLabel}
>
  <CommunicationsInboxWidget />
</CommunicationsInboxProvider>
```

`SalesCrmShell` owns the platform layout. The CRM route owns the model,
permissions, copy and adapter. The widget owns only workflow presentation and
local draft/mode state. A future VitaBlue route can provide a different context
renderer and action set through the same boundary.

### Avoid

```tsx
<div className="fixed left-0 top-0 w-[420px]">
  <CommunicationsInboxWidget />
</div>
```

This creates page-owned geometry and bypasses `SuiteRuntime`. The widget must
also not receive a Supabase client, provider credential, organization ID from
untrusted client state or CRM repository instance. Use the route and approved
server API boundary instead.

### Works with

| Component/view                    | Supported relationship                  | Required conditions                                  | Result                                            |
| --------------------------------- | --------------------------------------- | ---------------------------------------------------- | ------------------------------------------------- |
| `SuiteRuntime` / `SplitWorkspace` | Hosts and positions                     | Route declares the recipe and optional context zones | Stable list/thread/context composition            |
| CRM contact context               | Supplies selected context               | Data is authorized and sanitized by CRM              | Contact and Customer 360 remain CRM-owned         |
| Communications Core read model    | Supplies conversations and policy state | Public contract and normalized errors                | UI reflects Core decisions without bypassing them |

### Does not work with

| Component/view                            | Incompatibility         | Reason                                      | Alternative                             |
| ----------------------------------------- | ----------------------- | ------------------------------------------- | --------------------------------------- |
| `AppShell` nested inside widget           | Parallel shell          | Violates platform ownership                 | Render through existing `SalesCrmShell` |
| Direct provider adapter                   | Provider mutation in UI | Leaks credentials and policy responsibility | Consumer callback to authorized API     |
| CRM-only entity props in shared primitive | Cross-suite coupling    | Blocks VitaBlue and future consumers        | Keep CRM data in the context renderer   |

### Designed capabilities and future suites

- Designed for: triage, selected-thread reading, policy-aware reply, internal notes, assignment and lifecycle presentation.
- Not designed for: campaigns, automation, bots, AI, media, attachments, labels, calls, SLA or provider configuration. These were not capabilities of the confirmed WhatsApp POC and are not Inbox parity gaps.
- Future CRM use: contact record deep link, Customer 360 conversation history and lead follow-up context.
- Future Marketing Studio use: only an approved transactional conversation review surface; campaign composition remains outside this widget.
- Future Operations use: provider health and delivery inspection with read-only context, not human reply workflow unless separately approved.
- Extension boundary: participant summary, context renderer, capabilities, labels, filters and callbacks may be configured without forking.
- New capability requires: a new public state/action contract, ownership review, accessibility/responsive evidence and explicit track approval.

### Current adapter boundary

- The provider receives the active organization from `SalesCrmShell` and requests
  only that organization's Inbox through the authorized API route.
- The API route owns authentication and `communications.read`; the server
  service owns tenant-scoped joins across conversations, contacts, channels and
  messages.
- `GET /api/communications/templates` exposes approved WhatsApp templates after
  `communications.read`; `POST /api/communications/inbox/actions` owns the
  authorized reply, template, note, assignment and lifecycle command envelope.
- The action route maps each envelope to a Core command without forwarding the
  transport discriminator, and Core keeps provider credentials server-side.
- Fixture data is retained only when the provider is used without an
  organization, which keeps isolated component tests and the E2E visual bypass
  deterministic.
- The API adapter refreshes the authorized Inbox read model after mutations;
  fixture mutations remain deterministic test behavior, not evidence of live
  provider persistence.

## Approved and experimental compositions

### Approved

- `/sales-crm/communications`: CRM composition through `SalesCrmShell`, `SuiteRuntime` and `SplitWorkspace`.

### Experimental

- VitaBlue communication workspace: future consumer; blocked until a real route, data contract and permission model exist.

## Composition checklist

- [ ] Parent surface and ownership are correct.
- [ ] Page/section hierarchy is correct.
- [ ] Data, permissions and domain actions remain consumer-owned.
- [ ] Compatible state is selected.
- [ ] Mobile transformation and overflow are explicit.
- [ ] Keyboard, focus and accessible names are verified.
- [ ] Overlay persistence is explicit before adding a popup.
- [ ] Theme tokens work for tenant, dark mode and high contrast.
- [ ] Loading/skeleton transitions preserve dimensions.
- [ ] No shared behavior is duplicated in the consumer.

## Performance and observability

- Rendering scale: first slice targets up to 100 visible conversations; virtualization is deferred until measured need.
- Layout stability: list, thread and composer keep stable region geometry through loading, empty and error states.
- Animation/assets: no required animation or external assets; reduced motion is the default-compatible path.
- Consumer telemetry hooks: consumers may report view, selection, action outcome and policy denial using trace-safe metadata.
- Data/privacy rule: never send message bodies, phone numbers, provider IDs, credentials or raw CRM context to analytics.

## Suite portability

| Consumer         | Allowed configuration                                      | Domain behavior owned by consumer                            | Risks/reopen triggers                         |
| ---------------- | ---------------------------------------------------------- | ------------------------------------------------------------ | --------------------------------------------- |
| CRM              | Contact context, CRM actions, authorized workspace filters | Contact identity, Customer 360, lead and opportunity actions | New CRM mutation or sensitive field           |
| Marketing Studio | Approved campaign or transactional context only            | Audience, consent and campaign governance                    | Any proactive send or campaign action         |
| Operations       | Read-only delivery and account-health context              | Incident handling and operational permissions                | Provider controls or cross-tenant diagnostics |

## Decisions and rejected alternatives

| Decision  | Current behavior                                      | Required change                                                   | Owner                   | Evidence                                      |
| --------- | ----------------------------------------------------- | ----------------------------------------------------------------- | ----------------------- | --------------------------------------------- |
| `compose` | CRM route has no Inbox composition                    | Mount widget through existing `SuiteRuntime` and `SplitWorkspace` | CRM                     | Route/config and component tests              |
| `adapt`   | Chatwoot patterns are external reference              | Use LoopDev tokens, contracts and tenant boundaries               | CRM/platform            | Reference guide and UX review                 |
| `defer`   | Shared conversation primitives have one real consumer | Reopen after a second real consumer                               | CRM/platform            | Duplicate review and second-consumer evidence |
| `remove`  | Provider and repository concerns could leak into UI   | Keep them outside widget props and implementation                 | Communications/platform | Static ownership review                       |

## Certification evidence

### Technical certification boundary

| Dimension                            | Applicability | Status      | Evidence / owner                  |
| ------------------------------------ | ------------- | ----------- | --------------------------------- |
| Security and data integrity          | required      | in-progress | CRM/Communications API boundary   |
| Data flow and state ownership        | required      | in-progress | Typed model and callback tests    |
| Performance and runtime cost         | required      | in-progress | Render-scale and layout evidence  |
| Resilience and failure boundaries    | required      | in-progress | Error, policy and conflict states |
| Maintainability and testing contract | required      | in-progress | Focused tests and active track    |

- Contract: `in-progress` - public widget props, action adapter, template model and CRM parameter autofill are implemented; visual review remains.
- Accessibility: `in-progress` - Axe evidence passes; keyboard review remains.
- Interaction: `in-progress` - focused action, template and policy tests pass; keyboard review remains.
- Responsive: `in-progress` - mobile list -> thread -> context evidence passes; visual review remains.
- States: `in-progress` - policy, delivery, operational failure, conflict, offline and forbidden state evidence is covered; visual review remains.
- Consumer ownership: `in-progress` - documented in the active track.
- Visual review: `pending` - visual approval is required before Playwright.
- Registry: `pending` - module widget is not a shared registry entry.
- Reproducibility: `pending` - route, fixture and viewport evidence pending.
- A11y automation: `passed` - focused Vitest Axe test passes for the ready composition.

## Change impact matrix

| Change                      | Gates to reopen                                 |
| --------------------------- | ----------------------------------------------- |
| Copy only                   | Accessibility and visual                        |
| New visual prop/token       | Contract, theme and visual                      |
| New state                   | Contract, accessibility, interaction and visual |
| Layout/responsive change    | Responsive, interaction and visual              |
| New consumer/suite          | Portability, ownership and responsive           |
| New action or semantic role | Interaction, accessibility and ownership        |

## Spec history

| Date       | Version | Change                                            | Impact                                                                 | Reviewer |
| ---------- | ------- | ------------------------------------------------- | ---------------------------------------------------------------------- | -------- |
| 2026-08-30 | 0.1     | Initial widget contract for mock-backed CRM Inbox | Establishes ownership, states, responsive and future-consumer boundary | Pending  |
| 2026-08-30 | 0.2     | Adds approved-template interaction and authorized action boundary | Covers template parameters, expired-window behavior and Core handoff | Pending  |
| 2026-08-31 | 0.3     | Prefills known template parameters from CRM contact context | Keeps Meta parameter validation while removing repeated manual entry | Pending  |

## Reopen triggers

- New consumer or suite.
- New state or interaction.
- Responsive or layout responsibility change.
- Theme, token or accessibility change.
