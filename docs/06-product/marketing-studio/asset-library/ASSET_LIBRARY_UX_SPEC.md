---
title: Asset Library UX Specification
status: proposed
version: 0.1
created: 2026-08-28
updated: 2026-08-28
owner: marketing-studio
program_track: tracks/planned/marketing-studio/2026-08-28-marketing-studio-module-definition.md
issue: https://github.com/minoveaz/loopdev/issues/143
---

# Asset Library UX Specification

## Purpose

Asset Library lets authorized teams find, classify, review and reuse approved digital resources. It
owns asset metadata, versions, permissions, retention and private Storage references. Brand Hub owns
brand identity, Creative Studio owns editable projects, and Content Engine owns editorial content.

This proposed document does not authorize routes, persistence, uploads or public delivery URLs.

## Navigation and Canvas

| Surface | Proposed route | Canvas recipe | Purpose |
| --- | --- | --- | --- |
| Library overview | `/marketing-studio/assets` | `overview` | Show recent, expiring, unclassified and review-needed assets for the active authorized scope. |
| Asset collection | `/marketing-studio/assets/library` | `data` | Search, filter, sort and select authorized assets. |
| Asset inspector | From collection selection | `split` | Retain collection context while viewing metadata, versions, rights and usage. |
| Asset record | `/marketing-studio/assets/:assetId` | `record` | Inspect the asset lifecycle, references and audit history. |
| Ingest and classify | `/marketing-studio/assets/new` | `focus` | Submit an authorized source, validate metadata and create a draft asset/version. |

All implementation uses `AppShell`, `SuiteShell`, `SuiteRuntime` and `SuiteCanvas`. Organization and
workspace context come from Platform Core; a selected brand is an optional module filter, not an
implicit tenant boundary. The module cannot create a parallel media sidebar, asset shell or browser
authorization layer.

## Roles and actions

| Role | Visible actions |
| --- | --- |
| Admin | Configure authorized access through Platform Core, manage assets, archive and restore according to retention policy. |
| Brand manager | Find and attach approved assets, manage brand-specific metadata when authorized. |
| Creative | Submit sources, create versions, classify and use authorized assets in creative projects. |
| Reviewer | Review submitted versions, mark approved/rejected and record rights or restrictions. |
| Viewer | Read and select approved assets only. |

Final permissions are pending Platform Core approval. The server determines whether previews,
metadata, downloads, version creation, archival and use references are allowed.

## Metadata and views

An asset record can include name, type, source, owner, tags, workspace/brand visibility, rights,
expiry, provenance, checksum, derivative relations and usage references. Asset binary content stays
behind private Storage references; the client does not treat raw URLs, base64 or data URLs as the
source of truth.

The collection supports allowlisted filters for type, status, tag, owner, brand, workspace, rights,
expiry and usage. Desktop uses a stable grid/table with `split` inspector. Tablet collapses the
inspector to a controlled panel. Mobile presents one region at a time and requires explicit
confirmation for archive, restore or replacement actions.

## States and journeys

Every surface provides `loading`, `empty`, `error`, `forbidden` and `success` states. A failed upload
or processing job states the next safe action and never creates a fake successful asset.

1. A Creative submits an authorized source, adds required classification and receives a draft asset
   version with visible processing status.
2. A Reviewer confirms rights and approves the version; it becomes eligible for authorized reuse.
3. A Brand manager selects an approved logo/reference through Brand Hub without copying its binary.
4. Image Studio or Video Studio links an approved asset to a project; the library records usage but
   does not become owner of the project or rendered output.

## Exclusions and approval criteria

- Asset Library does not edit brand guidance, creative canvases, video timelines, content or campaigns.
- It does not publish to channels, own provider credentials or execute AI providers.
- It does not expose cross-organization previews, original objects or signed URLs without authorization.
- The UX is ready for approval only when its lifecycle agrees with the contract, Brand Hub asset
  references and Creative Studio project/asset separation.
