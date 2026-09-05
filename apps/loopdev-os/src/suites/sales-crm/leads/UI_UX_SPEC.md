# UI/UX Specification: CRM Leads list, preview, record and conversion

- Implementation: `apps/loopdev-os/src/suites/sales-crm/leads`
- Public exports: `LeadListWidget`, `LeadTable`, `LeadFilters`, `LeadContextPanel`,
  `LeadRecordPreview`, `LeadRecordView`
- Owner: `sales-crm` suite
- Runtime: `client` (browser fetch and responsive interaction)
- Status: `in-progress`
- Version: `1.1.0`

## User outcome and anatomy

An authorized CRM user can find a Lead, narrow the current cursor page with
filters/search, and inspect the selected Lead without losing list context.

```text
PlatformHeader + SuiteSidebar + SuiteCanvas(mode="split")
└── LeadListWidget
    ├── ModuleHeader (identity and create action)
    ├── LeadFilters (search and authorized filters)
    ├── LeadTable (desktop/tablet table, mobile cards)
    └── SuiteRuntime moduleContextPanel renderer
        └── LeadContextPanel (selected row preview and actions)
```

The list owns query state, cursor history, permissions and API recovery. The
context panel is supplied by `SuiteRuntime`; the page never mounts a shell
panel directly. Contact names are intentionally not invented because the list
contract returns only the authorized `contactId`.

`LeadRecordPreview` composes state, attribution, Contact, related Opportunities
and Activity using the authorized Lead detail and existing Customer 360 read
model. The contextual panel owns an independent vertical scroll region and
focuses its heading when selection changes. `LeadRecordView` is the
`RecordWorkspace` consumer for `/sales-crm/leads/:leadId`; mobile reaches it
instead of forcing a two-column split.

Editing, reassignment and manual status changes require `crm.manage`. The
backend currently exposes `expectedUpdatedAt`, not a numeric `expectedVersion`;
the UI preserves that concurrency token and treats `409` as `stale`, requiring
an explicit refresh before replacing data. Assignment remains a UUID because
the backend does not expose a user catalogue.

## Public contract and recipes

`getLeads` accepts the validated `CrmLeadQuery` contract and returns a validated
`CrmLeadPage`. `mapLeadToRowViewModel` is the only presentation mapping
boundary. Search is debounced and applied to the loaded page; server-side
pagination and filters remain bounded by the API contract.

Recommended composition:

```tsx
<SuiteRuntime
  config={suiteConfig}
  moduleContextPanelRenderers={{ leads: () => <LeadContextPanel /> }}
>
  <LeadListWidget />
</SuiteRuntime>
```

Anti-patterns:

- Do not render `ModuleContextPanel`, `SuiteSidebar` or a second header in the
  page.
- Do not read Supabase or use fixtures in production.
- Do not place Lead business rules in `@loopdev/ui` or change Contacts.
- Do not turn mobile into a two-column split; cards navigate to workspace.

CRM is the current consumer. Marketing Studio and Operations may compose the
same table/filter state contract with their own labels and data adapters; a
new action, state, consumer or shell responsibility reopens certification.

## State, interaction and accessibility matrix

| Capability            | Pointer/touch                                         | Keyboard/focus                        | States                         | Accessibility                             |
| --------------------- | ----------------------------------------------------- | ------------------------------------- | ------------------------------ | ----------------------------------------- |
| Search                | Type in the labeled input; debounce 300ms             | Normal form order                     | loading/ready/filtered-empty   | Labeled input and live result count       |
| Filter                | Open a single-select dropdown and toggle a value      | Enter/Space opens; Escape closes      | selected/disabled              | Existing `FilterDropdown` semantics       |
| Row inspection        | Click row on desktop/tablet                           | Focusable table row action            | selected/closed                | Active row remains announced by table     |
| Mobile card           | Tap card to open workspace                            | Focusable button, Enter/Space         | ready/disabled                 | Card has an action name                   |
| Pagination            | Previous/Next buttons                                 | Tab and Enter                         | first/last/loading             | Disabled controls expose native state     |
| Recovery              | Retry is provided by the consuming error surface      | Focus follows retry control           | error/forbidden                | Safe message, no internal details         |
| Initial note recovery | Retry only the idempotent note after Lead success     | Named retry button remains reachable  | partial-success/retrying/saved | Alert states that the Lead already exists |
| Detail actions        | Edit, reassign or change manual status when permitted | Form order; focus remains in workflow | saving/stale/forbidden         | `crm.manage` and live conflict message    |
| Contact 360           | Open the related Contact context                      | Named button                          | ready/error                    | Reuses the Contacts route and contract    |

## Responsive, theme and runtime contract

Desktop/tablet retain the dense table and horizontal table-zone overflow owned
by `ResponsiveTable`. Mobile renders semantic cards with the priority order
Contact, status, source, assignee and last activity, then navigates to
`/sales-crm/leads/:leadId`. No page-level horizontal overflow is introduced.

The implementation uses semantic LoopDev tokens and inherits tenant theme,
dark mode and high-contrast behavior from the shell. No raw palette values,
fixed z-index or inline visual style is introduced. Browser APIs are limited
to `fetch`, `AbortController` and the debounce timer; all props remain
serializable at the route boundary.

## Evidence and change impact

Focused evidence:

- `apps/loopdev-os/src/app/sales-crm/leads/leads.test.ts`
- `apps/loopdev-os/src/app/sales-crm/leads/leads-components.test.tsx`
- `packages/contracts/src/crm/crm.ts`
- `apps/loopdev-os/src/app/api/crm/leads/route.test.ts`
- `apps/loopdev-os/src/app/api/crm/leads/[leadId]/route.test.ts`
- `apps/loopdev-os/src/app/sales-crm/leads/lead-record.test.tsx`
- `apps/loopdev-os/src/app/sales-crm/leads/LeadRecordView.test.tsx`

## Conversion contract

`QualifiedLeadGuard` exposes conversion only when the user has `crm.manage` and
the Lead is `cualificado` or `convertido`. The converted state supports an
additional product while the backend reuses the existing Opportunity for the
same normalized product. `CreateOpportunityFromLead` requires a non-empty
product/interés value and sends the existing `POST /api/crm/leads/conversion`
contract. It never renders or accepts an editable `contactId`: the backend
inherits the authorized Contact from the Lead.

The conversion dialog reports `created` (HTTP 201), `existing` (HTTP 200 after
the normalized Lead/product idempotency check), or `conflict` (HTTP 409). After
success, the preview refreshes Lead, related Opportunities and Contact 360
through the existing read endpoints. `qualified` remains the stable stage key;
its visible label is consumer-owned.

Capture reports a separate `initialNote` state after Lead persistence. A note
failure uses an assertive alert that says the Lead is already saved and exposes
only a named note retry; the capture request is not repeated. Successful retry
changes the same result surface to a polite saved status.

## Evidence and gate status

Focused conversion evidence:

- `apps/loopdev-os/src/app/sales-crm/leads/lead-conversion.test.tsx`
- `apps/loopdev-os/src/app/sales-crm/leads/lead-record.test.tsx`
- `apps/loopdev-os/src/app/api/crm/leads/conversion/route.test.ts`

Technical contract, accessibility, interaction and responsive checks pass for
the implemented states. Visual review and Playwright remain blocked until
explicit user approval, so the UI/UX status stays `in-progress`; no visual
certification is claimed.

Phase 5 technical evidence on 2026-08-24: Leads-focused tests pass `82/82` and
the full serial suite passes `859/859`; typecheck, lint, shell, registry,
source-contracts, ownership, links and track/Supabase governance pass. Build
and pgTAP are environment-blocked by missing Supabase variables and unavailable
Docker/Postgres. Staging readiness is `NOT READY` without a release candidate.

New states reopen contract, accessibility, interaction and visual review. New
consumers reopen portability and ownership. New actions or roles reopen
interaction, accessibility and ownership.
