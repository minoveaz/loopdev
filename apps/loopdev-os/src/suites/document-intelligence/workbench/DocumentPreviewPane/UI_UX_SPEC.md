# DocumentPreviewPane UI/UX specification

- Implementation: `apps/loopdev-os/src/suites/document-intelligence/workbench/DocumentPreviewPane.tsx`
- Public export: `DocumentPreviewPane` (suite-local feature)
- Owner: `feature`
- Runtime: `client`
- Directive: `use client`
- Status: `ready-for-review`
- Last reviewed: `2026-09-05`
- Consumers: `/document-intelligence/new`, `/document-intelligence/:documentId`
- Related track: `tracks/active/ai-platform/2026-09-05-document-intelligence-poc-migration.md`
- Spec version: `1.0`
- Contract version: `document-preview-pane/v1`
- Compatible since: `2026-09-05`
- Empty intake composition: the full dropzone group is vertically and horizontally
  centered inside the `TechnicalSurface`; the upload icon and hierarchy use the
  comfortable workspace scale, while action buttons stack full-width on narrow
  viewports and return to an inline group from `sm` upward.
- Platform target: `web-only`

## Quick reference

- Use when: an operator must inspect a temporary identity-document image or PDF
  before extraction.
- Do not use when: showing permanent document history, editing extracted fields,
  or rendering a generic media gallery.
- Main composition: `SuiteRuntime` → `RecordWorkspace` canvas → preview/review
  record plane.
- Compatible with: `TechnicalSurface`, `Button`, `IconButton`, `Badge`,
  `EmptyState`, `ExtractionReviewForm`.
- Not compatible with: a second shell, permanent storage controls, or a
  business-validation summary.
- Certification: technical evidence is in progress; visual review is deferred.

## Need-to-component decision

| User need | Use this component when | Prefer another component when |
| --- | --- | --- |
| Inspect an intake document | The file is a temporary image/PDF and extraction has not been approved | The content is a permanent asset or a collection |
| Prepare a dual-sided ID | The operator needs front/back selection and replacement | The consumer needs batch upload |
| Adjust a scan | Zoom, pan, rotate, image crop or open-in-tab is sufficient | Redaction, annotation or page-level PDF editing is required |

## Purpose and responsibility

The operator can safely choose a supported document, understand whether it is
ready for extraction, inspect it at a useful scale, and hand it to the fixture
or future server extraction flow.

### Owns

- Temporary browser file selection, drag/drop and clipboard intake.
- MIME and 10 MB size validation before the context receives a file.
- Image preview and PDF.js first-page canvas rendering with an iframe fallback.
- Front/back selection, zoom/reset, rotation, pointer pan, image crop and
  open-in-new-tab affordances.
- The second-side control is conditional on an available back file; removing
  the active back file resets the viewer to the front side.
- Object URL lifecycle and local viewer state.

### Does not own

- Tenant authorization, upload persistence, provider credentials, extraction,
  business validation, permanent history, or review decisions.
- Shell geometry, platform context overlays, or a parallel sidebar.

## Anatomy and composition

```text
SuiteCanvas / RecordWorkspace
└── transparent record wrapper
    └── TechnicalSurface
        ├── intake and side toolbar
        ├── document viewport
        └── action footer (upload, extract)
```

The parent owns the grid and scrolling. The preview surface owns only its
internal viewport. The canvas uses comfortable workspace density, semantic
LoopDev tokens, and no tenant-specific colors.

## Public UI contract

| Prop/state | Meaning | Visual behavior | Interaction | Accessibility |
| --- | --- | --- | --- | --- |
| `documentLoaded=false` | No file is selected | Dashed intake surface | Select, drag/drop, paste, or use fixture | File input has an accessible name and allowlist |
| `front` / `back` | Active document side | `Reverso` appears only when a second-side file exists; otherwise `Anverso` is the only control | Switching side keeps the viewer context; removing the active back file returns to front | `aria-pressed` communicates active side and no unavailable side receives focus |
| image file | Browser-local image | `<img>` inside transformed viewport | Pan, zoom, rotate, crop, open tab | File name is the image alternative |
| PDF file | Browser-local PDF | PDF.js canvas; iframe on render failure | Same view controls except crop | Canvas/iframe has the file name |
| `processing` | Extraction is running | Action shows loading state | Consumer controls the flow timer | Loading state is announced by workbench |
| validation error | Intake rejected | Alert copy below controls | Correct file and retry | `role=alert`, no color-only feedback |

## Interaction model

| Capability | User intent | Pointer/touch | Keyboard/focus | Escape/close | Feedback |
| --- | --- | --- | --- | --- | --- |
| Select file | Choose a local file | Native file picker | Enter/Space on button | Picker owns close | MIME/size error remains near input |
| Drag/drop | Drop a document | Drop on dashed surface | Not applicable | Not applicable | Accepted file replaces active side |
| Paste | Use clipboard image | Clipboard action | Enter/Space | Not applicable | Unsupported clipboard content is recoverable |
| Zoom/reset | Inspect detail | Toolbar buttons | Tab then Enter/Space | Not applicable | Percentage updates in button label |
| Pan | Move a zoomed document | Pointer/touch drag | Not applicable; controls remain reachable | Not applicable | Cursor changes while dragging |
| Rotate | Correct orientation | Toolbar button | Tab then Enter/Space | Not applicable | Rotation is applied in 90° increments |
| Crop image | Remove scan margins | Image-only toolbar icon and crop dialog | Range and buttons are keyboard reachable | Cancel closes without mutation | New JPEG replaces active side |
| Open tab | Inspect outside workbench | Toolbar button | Tab then Enter/Space | Browser owns close | Uses the active object URL |

Crop is an explicit modal-like dialog owned by the feature. It does not create
an overlay manager; the browser dialog surface is bounded to the feature and
cancel never mutates the source.

## State model

| State | Applicability | Required UI | Allowed actions | Accessibility |
| --- | --- | --- | --- | --- |
| `ready` | required | Toolbar, viewport, footer | Inspect, replace, extract | Names and pressed states are present |
| `loading` | applicable | Extraction action loading | Wait or use workbench recovery | Workbench announces progress |
| `empty` | required | Dropzone and intake actions | Select, drop, paste, fixture | File input and alert relationship are explicit |
| `error` | applicable | Recoverable intake error | Choose another file | `role=alert`, no focus trap |
| `read-only` | not-applicable | Not used in this workbench | N/A | N/A |
| `disabled` | applicable | Controls disabled while no file or processing | No mutation | Native `disabled` semantics |
| `forbidden` | deferred | Provider/tenant permission is consumer-owned | Future recovery | Server contract required |
| `skeleton` | not-applicable | Workbench owns processing feedback | N/A | N/A |

## Content and localization

- Consumer owns route titles and review copy; this component owns concise intake
  and control labels.
- File names are user-generated text and are rendered as text/alt content, not
  HTML.
- Long file names truncate in metadata while the accessible name remains full.
- Copy is currently Spanish and must move to the suite localization boundary
  before another language is supported.
- Date, currency and business validation formatting do not belong here.

## Density and responsive matrix

| Context | Density | Content scale | Behavior |
| --- | --- | --- | --- |
| Workspace desktop | Comfortable | Full toolbar and dual record columns | Viewport owns internal overflow |
| Tablet | Comfortable | Wrapping toolbar | Parent may move inspector to overlay |
| Mobile | Compact | Controls wrap; side buttons remain reachable | Preview remains a single inspectable canvas; no page overflow |

| Viewport | Layout | Transformation | Overflow rule | Acceptance evidence |
| --- | --- | --- | --- | --- |
| Desktop | Surface fills record column | Toolbar stays above viewport | Internal viewport only | Focused component test + browser review |
| Tablet | Surface compresses with record | Toolbar wraps | No horizontal page overflow | `validate:experience` and Playwright follow-up |
| Mobile | Single-column record | Actions wrap below viewport | Document viewport may pan, page may not overflow | Mobile interaction evidence pending |

## Accessibility contract

- Semantic controls are native buttons, input, range, image, canvas and iframe.
- Icon-only buttons have `aria-label`; side controls use `aria-pressed`.
- File errors use `role="alert"` and are not communicated by color alone.
- Focus remains on the invoking control after crop cancellation or completion.
- The crop dialog has a labelled heading, a named range, and explicit cancel.
- Pointer pan uses `touch-action: none` only inside the inspectable viewport.
- Reduced motion is respected by avoiding animation in the viewer transform.
- Axe/browser evidence is pending; focused unit coverage is present.

## Platform portability

| Platform | Implementation | Shared contract | Allowed divergence | Evidence |
| --- | --- | --- | --- | --- |
| Web/RSC | Client feature under `apps/loopdev-os` | File safety and viewer actions | Browser APIs are client-only | Typecheck |
| Web/client | `DocumentPreviewPane.tsx` | Same | PDF.js worker/iframe behavior | Focused tests |
| Expo/NativeWind | not-applicable | Intake contract may be reused later | Native document picker and PDF renderer required | Deferred |

RSC constraints: browser `File`, `URL`, `window.open`, `ResizeObserver` and
PDF.js are isolated to the client component. No provider secrets or server
references are accepted as props.

## Usage recipes and compatibility

### Recommended usage

```tsx
<SuiteRuntime config={documentIntelligenceConfig}>
  <RecordWorkspaceCanvas>
    <DocumentPreviewPane />
    <ExtractionReviewForm />
  </RecordWorkspaceCanvas>
</SuiteRuntime>
```

The workbench context owns document state and recovery; the parent owns the
workspace grid; extraction and review remain separate feature concerns.

### Avoid

```tsx
<DocumentPreviewPane className="fixed left-0 top-0 w-[420px]" />
```

Do not position it as a second shell rail, inject business validation rules,
persist identity fields in localStorage, or wrap it in corrective showcase CSS.
Do not place a permanent history list inside the preview surface.

### Designed capabilities and future suites

- Designed for: one temporary front/back identity document and fixture-driven
  extraction.
- Not designed for: batch processing, annotation, redaction, legal proof or
  permanent document management.
- Future CRM use: contact onboarding `RecordWorkspace` with document intake.
- Future Marketing Studio use: campaign asset metadata intake, only after a
  suite-owned upload contract is defined.
- Future Operations use: a protected case inspector with an Operations-owned
  provider/action policy.
- Extension boundary: consumers may own upload policy, labels and extraction
  callbacks through the workbench context without forking viewer behavior.
- New capability requires: a new state/action, browser evidence, privacy review
  and reopening this spec.

## Approved and experimental compositions

### Approved

- `/document-intelligence/new`: temporary fixture/client intake inside
  `RecordWorkspace`; approved for technical review.

### Experimental

- `/document-intelligence/:documentId`: route restoration backed by operational
  local metadata; permanent history and server retrieval are deferred.

## Performance and observability

- One active file per side; no list virtualization is required.
- PDF rendering is first-page only and cancelled on file/viewport changes.
- Object URLs are revoked on replacement and unmount.
- Consumer may emit extraction-start and review-decision telemetry; file contents,
  names and identity fields must never be sent to analytics.

## Suite portability

| Consumer | Allowed configuration | Domain behavior owned by consumer | Risks/reopen triggers |
| --- | --- | --- | --- |
| CRM | Intake labels and contact linkage | Permission and persistence | New customer-entity state |
| Marketing Studio | Asset-purpose copy and provider action | Asset repository policy | Batch/asset-library behavior |
| Operations | Case context and role action | Case authorization | Offline or audit requirements |

## Decisions and rejected alternatives

| Decision | Current behavior | Required change | Owner | Evidence |
| --- | --- | --- | --- | --- |
| `adapt` | Fase 0 placeholder | Real browser intake and viewer controls | ai-platform | Focused tests/typecheck |
| `compose` | Local surface | Reuse LoopDev `TechnicalSurface` and controls | frontend-platform | Registry |
| `remove` | Visible `ValidationSummaryList` | Defer business validation UI | ai-platform | Workbench diff |
| `defer` | No server provider | Keep fixture boundary until backend phase | ai-platform | Track decision |

## Certification evidence

| Dimension | Applicability | Status | Evidence / owner |
| --- | --- | --- | --- |
| Security and data integrity | required | in-progress | MIME/size tests; server boundary deferred |
| Data flow and state ownership | required | passed | workbench context + object URL cleanup |
| Performance and runtime cost | required | in-progress | PDF cancellation; browser matrix pending |
| Resilience and failure boundaries | required | passed | iframe PDF fallback and intake errors |
| Maintainability and testing contract | required | in-progress | focused tests; visual/Axe evidence pending |

- Contract: `verified` — this specification and file-validation tests
- Accessibility: `pending` — automated Axe/browser evidence pending
- Interaction: `verified` — focused intake/control tests; browser matrix pending
- Responsive: `pending` — experience validation pending
- States: `verified` — empty, ready, disabled and error paths
- Consumer ownership: `verified` — SuiteRuntime/workbench context owns composition
- Visual review: `pending` — no visual certification claimed
- Registry: `verified` — `document-preview-pane`
- Reproducibility: `pending` — requires browser route artifact
- A11y automation: `pending` — requires approved browser runner

## Change impact matrix

| Change | Gates to reopen |
| --- | --- |
| Copy only | Accessibility, visual |
| New viewer state | Contract, accessibility, interaction, visual |
| Layout/responsive change | Responsive, interaction, visual |
| New consumer/suite | Portability, ownership, responsive |
| New upload action or semantic role | Interaction, accessibility, ownership |

## Spec history

| Date | Version | Change | Impact | Reviewer |
| --- | --- | --- | --- | --- |
| 2026-09-05 | 1.0 | Replaced placeholder with temporary intake and document viewer contract | Technical review ready; visual review deferred | Copilot |

## Reopen triggers

- New consumer or suite.
- New file type, provider action, state or persistence behavior.
- Responsive/layout ownership change.
- Theme, token, privacy or accessibility change.
