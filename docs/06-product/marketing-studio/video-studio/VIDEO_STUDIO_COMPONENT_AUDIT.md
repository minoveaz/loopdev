---
title: Video Studio Component Audit
status: proposed
version: 0.1
created: 2026-08-28
updated: 2026-08-28
owner: marketing-studio
program_track: tracks/planned/marketing-studio/2026-08-28-marketing-studio-module-definition.md
ux_spec: docs/06-product/marketing-studio/video-studio/VIDEO_STUDIO_UX_SPEC.md
issue: https://github.com/minoveaz/loopdev/issues/146
---

# Video Studio Component Audit

## Composition

```text
App Router -> SuiteRuntime -> SuiteCanvas mode=focus
  -> Creative Studio VerticalWorkspaceHost
    -> VideoStudioWorkspace
      -> VideoStage + Timeline + TransportControls
      -> Video Studio features -> Video document entity -> shared
```

| Surface or component | Layer | Decision |
| --- | --- | --- |
| Platform Shell and SuiteCanvas | Platform | Reuse; no video business rules. |
| `VideoStage`, `Timeline`, `TransportControls` | Registered workspace composition | Reuse through the declarative composition contract; certify behavior for Video Studio. |
| Buttons, dialogs, tooltips, menus, inputs and states | `@loopdev/ui` | Reuse or compose after availability audit. |
| `VideoStudioWorkspace`, `SceneInspector`, `MediaInspector` | Video Studio widget | Implement within the vertical. |
| `SceneEditor`, `TimelineEditor`, `SubtitleEditor`, `MotionControls` | Video Studio feature | Implement within the vertical; no direct worker/provider access. |
| `AssetReferencePicker`, `BrandContextSummary` | Feature adapters | Consume authorized Asset Library and Brand Hub read models. |
| `SaveVideoVersion`, `RequestVideoRender`, `RenderStatusPanel` | Feature | Use Creative Studio, Asset Library and durable job contracts. |
| `VideoDocument`, `VideoScene`, `VideoRenderIntent` | Video Studio entity | Vertical-owned models after contract approval. |

VitaBlue's stage, timeline and Remotion patterns are functional evidence. They are not components to
copy into `@loopdev/ui`; shared promotion needs a second consumer and component certification.
