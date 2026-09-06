# DocumentViewer UI/UX specification

- Implementation: `packages/document-viewer/src/DocumentViewer.tsx`
- Public export: `@loopdev/document-viewer`
- Owner: `shared composite`
- Runtime: `client`
- Directive: `use client`
- Status: `ready-for-review`
- Last reviewed: `2026-09-05`
- Consumers: `apps/loopdev-os` Document Intelligence; future CRM, Marketing Studio and Operations consumers
- Related track: `tracks/active/ai-platform/2026-09-05-document-intelligence-poc-migration.md`
- Spec version: `1.0`
- Contract version: `document-viewer/v1`
- Compatible since: `2026-09-05`
- Platform target: `web-only`

## Quick reference

- Use when: an operator needs to inspect one temporary image or PDF in a bounded workspace canvas.
- Do not use when: rendering permanent asset galleries, annotating/redacting pages, or owning upload persistence.
- Main composition: consumer-owned intake and `SuiteCanvas` → `DocumentViewer` → native image/PDF engine.
- Compatible with: `TechnicalSurface`, consumer upload controls and suite-owned recovery actions.
- Not compatible with: a second shell rail, permanent document history, hidden zoom multipliers or auto-crop.
- Certification: technical and UI/UX evidence recorded in the active Document Intelligence track.

## Need-to-component decision

| User need                    | Use this component when                                           | Prefer another component when                                        |
| ---------------------------- | ----------------------------------------------------------------- | -------------------------------------------------------------------- |
| Inspect a temporary document | One image/PDF needs fit, zoom, pan, rotate and reset              | A collection, gallery or permanent asset library is required         |
| Fit a page                   | The consumer can choose `contain`, `width` or `actual` explicitly | An automatic content crop or heuristic scale is requested            |
| Recover a PDF preview        | PDF.js cannot render and the browser can open the object URL      | The product needs page editing, annotation or server-side conversion |

## Purpose and responsibility

The shared viewer gives consumers a typed, tenant-neutral inspection surface. It owns object URL
creation/cleanup, image/PDF rendering, explicit fit modes, zoom, pan, rotation, reset and PDF
fallback. Consumers own intake, permissions, copy, file validation, persistence, crop workflows
and extraction actions.

## Anatomy and composition

```text
SuiteCanvas / consumer-owned workspace
└── transparent composition wrapper
    └── TechnicalSurface
        ├── responsive toolbar (fit, zoom, rotate, optional crop, open)
        └── inspectable viewport (native image or PDF.js canvas → iframe → download)
```

The parent owns page geometry and scroll. The viewer owns only its bounded surface and never creates
a shell header, sidebar or contextual panel. Visual behavior uses semantic LoopDev tokens and the
comfortable workspace density; tenant variation is `token-only`.

## Public UI contract

| Prop/state                    | Meaning                                 | Behavior                                                                     | Accessibility                                             |
| ----------------------------- | --------------------------------------- | ---------------------------------------------------------------------------- | --------------------------------------------------------- |
| `document`                    | Consumer-provided browser file metadata | Creates one object URL and revokes it on replacement/unmount                 | Image alternative and PDF names derive from consumer data |
| `labels`                      | Consumer-owned localized copy           | Every visible control and fallback message is configured by the consumer     | Icon controls require accessible labels                   |
| `fitMode` / `onFitModeChange` | Optional controlled fit state           | Only `contain`, `width` and `actual`; no implicit content crop or multiplier | Active mode uses `aria-pressed`                           |
| `preset`                      | Typed zoom/default-fit recipe           | `document` preset is the canonical default; custom presets are explicit      | Zoom reset announces its actual percentage                |
| `onCrop`                      | Optional image-only consumer action     | The viewer exposes a crop affordance without owning crop semantics           | Label is consumer-provided                                |

## Interaction model

| Capability      | User intent                     | Pointer/touch                      | Keyboard/focus                          | Escape/close        | Feedback                                   |
| --------------- | ------------------------------- | ---------------------------------- | --------------------------------------- | ------------------- | ------------------------------------------ |
| Fit mode        | Choose page geometry            | Press one of three toolbar buttons | Tab + Enter/Space                       | Not applicable      | `aria-pressed` updates                     |
| Zoom/reset      | Inspect detail or restore scale | Toolbar buttons                    | Tab + Enter/Space                       | Not applicable      | Percentage label updates                   |
| Pan             | Move an enlarged page           | Pointer/touch drag in viewport     | Not required; controls remain reachable | Not applicable      | Cursor changes while dragging              |
| Rotate          | Correct orientation             | 90° toolbar action                 | Tab + Enter/Space                       | Not applicable      | Transform changes without motion animation |
| PDF fallback    | Continue when canvas fails      | Browser iframe, then download      | Link is keyboard reachable              | Browser owns iframe | Error and recovery copy remain visible     |
| Open in new tab | Inspect outside the workbench   | Toolbar action                     | Tab + Enter/Space                       | Browser owns tab    | Uses the active object URL                 |

## State model

| State       | Applicability  | Required UI                       | Allowed actions               | Accessibility                            |
| ----------- | -------------- | --------------------------------- | ----------------------------- | ---------------------------------------- |
| `ready`     | required       | Toolbar and viewport              | Inspect, fit, transform, open | Native controls and names                |
| `loading`   | applicable     | Stable viewport while PDF renders | Wait or use fallback          | Canvas is not the only feedback boundary |
| `empty`     | consumer-owned | Consumer dropzone                 | Select/paste/fixture          | Not implemented inside viewer            |
| `error`     | applicable     | PDF iframe/download recovery      | Open or download              | `role=alert` at terminal fallback        |
| `read-only` | applicable     | Consumer disables actions         | Inspect only                  | Native disabled semantics                |
| `disabled`  | applicable     | Consumer owns disabled state      | No mutation                   | Native disabled semantics                |
| `forbidden` | deferred       | Consumer-owned permission state   | Consumer recovery             | Authorization never enters shared viewer |
| `skeleton`  | not-applicable | Parent owns processing skeleton   | N/A                           | N/A                                      |

## Content and localization

Consumers provide all visible labels and fallback copy. User-generated names are escaped by React,
truncated only in the metadata badge, and retained as the image alternative/download name. The
viewer performs no date, currency or domain formatting.

## Responsive contract

| Viewport | Layout                                           | Transformation                                | Overflow rule                       | Evidence                    |
| -------- | ------------------------------------------------ | --------------------------------------------- | ----------------------------------- | --------------------------- |
| Desktop  | Toolbar wraps beside a full-height viewport      | Controls remain in one semantic toolbar       | Only the inspectable canvas may pan | Vitest + Playwright desktop |
| Tablet   | Toolbar wraps without changing order             | Fit controls stay reachable before transforms | No page-level horizontal overflow   | Playwright responsive       |
| Mobile   | Toolbar becomes a wrapping row with 44px targets | Viewport remains a single inspectable canvas  | Page never scrolls horizontally     | Playwright mobile/compact   |

## Accessibility contract

- Native buttons, image, canvas, iframe and download link provide the semantic base.
- Icon-only controls receive consumer-provided accessible names.
- Active fit mode uses `aria-pressed`; pan is confined to the viewport with `touch-none`.
- Terminal PDF failure uses `role=alert`; fallback remains actionable without color-only feedback.
- The component has no popup, selection menu or clear-all action; Escape and outside click are
  therefore consumer-owned and not intercepted.
- Automated evidence: `packages/document-viewer/src/DocumentViewer.test.tsx` with `vitest-axe`
  and Playwright coverage in `e2e/document-viewer.certification.spec.mjs`.

## Platform portability

| Platform        | Implementation                                    | Shared contract                          | Allowed divergence                          | Evidence       |
| --------------- | ------------------------------------------------- | ---------------------------------------- | ------------------------------------------- | -------------- |
| Web/RSC         | Client boundary only                              | Typed document, labels and fit contract  | Browser File/URL/PDF.js APIs require client | Typecheck      |
| Web/client      | `packages/document-viewer/src/DocumentViewer.tsx` | Full interaction contract                | PDF worker/cMaps use Next-compatible URLs   | Unit + browser |
| Expo/NativeWind | not-applicable                                    | Fit/transform intent can be reused later | Native picker and PDF renderer required     | Deferred       |

## Usage recipes and compatibility

### Recommended usage

```tsx
<DocumentViewer
  document={{ file, name: file.name, mimeType: 'image/png' }}
  labels={consumerLabels}
  preset="document"
  initialFitMode="contain"
/>
```

The consumer owns file validation, tenant permissions and extraction actions. The viewer owns
inspection and cleanup. A custom crop action may be passed for images but crop pixels remain
consumer-owned.

### Avoid

```tsx
<div className="fixed left-0 top-0 w-[420px]">
  <DocumentViewer document={document} labels={labels} />
</div>
```

Do not use the viewer as a second shell rail, add corrective showcase CSS, pass technical IDs as
visible copy, persist object URLs, use heuristic auto-crop, or introduce hidden/fixed multipliers.

### Designed capabilities and future suites

- CRM: contact onboarding `RecordWorkspace` with CRM-owned upload and permission policy.
- Marketing Studio: asset metadata intake after the asset repository owns persistence.
- Operations: protected case inspector with an Operations-owned action policy.
- Extension boundary: labels, fit mode, preset, optional crop callback and consumer layout.
- Reopen certification for new states, page editing, annotation, redaction, batch rendering or a
  native implementation.

## Performance and observability

PDF rendering is first-page only, uses a bundled legacy worker and cMaps, and cancels the loading
task when file, fit mode or viewport changes. One object URL exists per active document. Consumers
may emit action telemetry but must never send file bytes, object URLs or document contents.

## Suite portability

| Consumer         | Allowed configuration                | Domain behavior                   | Reopen trigger                           |
| ---------------- | ------------------------------------ | --------------------------------- | ---------------------------------------- |
| CRM              | Labels, fit recipe, upload wrapper   | Contact linkage and authorization | Entity persistence or new review state   |
| Marketing Studio | Labels and asset-purpose composition | Asset repository lifecycle        | Gallery/batch requirements               |
| Operations       | Labels and protected action wrapper  | Case policy and audit             | Offline, audit or redaction requirements |

## Decisions and rejected alternatives

| Decision  | Current behavior                                  | Required change                                            | Owner                         | Evidence                        |
| --------- | ------------------------------------------------- | ---------------------------------------------------------- | ----------------------------- | ------------------------------- |
| `extract` | Suite-local PDF/image renderer                    | Extract one shared typed viewer package                    | frontend-platform             | Unit, browser, registry         |
| `adapt`   | Implicit page fit and local transforms            | Expose explicit fit modes and typed presets                | frontend-platform             | Fit contract tests              |
| `remove`  | Heuristic auto-crop and hidden visual multipliers | Keep page geometry truthful; no auto-crop                  | ai-platform/frontend-platform | Source and track audit          |
| `compose` | Intake and extraction mixed with rendering        | Keep upload/dropzone in consumer and render through viewer | ai-platform                   | Document Intelligence migration |

## Certification evidence

| Dimension                            | Applicability | Status | Evidence                                                                |
| ------------------------------------ | ------------- | ------ | ----------------------------------------------------------------------- |
| Security and data integrity          | required      | passed | Browser-local object URLs only; no persistence or telemetry of bytes    |
| Data flow and state ownership        | required      | passed | `types.ts`, consumer-owned document/labels, optional controlled fit     |
| Performance and runtime cost         | required      | passed | First-page PDF, cancellation, one object URL, no list rendering         |
| Resilience and failure boundaries    | required      | passed | PDF.js → iframe → download fallback                                     |
| Maintainability and testing contract | required      | passed | Vitest/Axe, package typecheck, Playwright, registry and source contract |

## Change impact matrix

| Change                   | Gates to reopen                                 |
| ------------------------ | ----------------------------------------------- |
| New state                | Contract, accessibility, interaction and visual |
| Layout/responsive change | Responsive, interaction and visual              |
| New consumer             | Portability, ownership and responsive           |
| New action/role          | Interaction, accessibility and ownership        |

## Spec history

| Date       | Version | Change                                                      | Impact                                         | Reviewer               |
| ---------- | ------- | ----------------------------------------------------------- | ---------------------------------------------- | ---------------------- |
| 2026-09-05 | 1.0     | Extracted shared viewer from Document Intelligence renderer | New package consumer and explicit fit contract | LoopDev implementation |

## Reopen triggers

- New consumer, state, theme or browser platform.
- Page editing, annotation, redaction, batch rendering or automatic content crop.
- Changes to fit semantics, toolbar ownership or object URL lifecycle.
