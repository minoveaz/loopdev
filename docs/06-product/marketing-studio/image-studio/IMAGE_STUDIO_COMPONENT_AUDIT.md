---
title: Image Studio Component Audit
status: proposed
version: 0.1
created: 2026-08-28
updated: 2026-08-28
owner: marketing-studio
program_track: tracks/planned/marketing-studio/2026-08-28-marketing-studio-module-definition.md
ux_spec: docs/06-product/marketing-studio/image-studio/IMAGE_STUDIO_UX_SPEC.md
issue: https://github.com/minoveaz/loopdev/issues/145
---

# Image Studio Component Audit

## Composition

```text
App Router -> SuiteRuntime -> SuiteCanvas mode=focus
  -> Creative Studio VerticalWorkspaceHost
    -> ImageStudioWorkspace -> Image Studio features -> Image document entity -> shared
```

| Surface or component | Layer | Decision |
| --- | --- | --- |
| Platform Shell and SuiteCanvas | Platform | Reuse; no image business rules. |
| Buttons, dialogs, tooltips, inputs, states and accessible menus | `@loopdev/ui` | Reuse or compose after availability audit. |
| `ImageStudioWorkspace`, `ImageCanvas`, `LayerPanel`, `InspectorPanel` | Image Studio widget | Implement within the vertical; canvas technology remains an implementation decision. |
| `TemplatePicker`, `AssetPicker`, `BrandContextPanel` | Image Studio feature/adapters | Consume authorized Template, Asset Library and Brand Hub contracts. |
| `ImageHistory`, `SaveImageVersion`, `ExportImageArtifact` | Image Studio feature | Use Creative Studio and Asset Library commands; no direct Storage authority. |
| `ImageDocument`, `ImageElement`, `ImageExportIntent` | Image Studio entity | Vertical-owned schema and validation after contract approval. |

VitaBlue canvas/Konva patterns are functional evidence only. A LoopDev component may not be copied or
promoted to `@loopdev/ui` without its own availability audit, second consumer and certification.
