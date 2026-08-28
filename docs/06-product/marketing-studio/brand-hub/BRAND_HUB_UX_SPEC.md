---
title: Brand Hub UX Specification
status: proposed
version: 0.1
created: 2026-08-28
updated: 2026-08-28
owner: marketing-studio
program_track: tracks/planned/marketing-studio/2026-08-28-marketing-studio-module-definition.md
issue: https://github.com/minoveaz/loopdev/issues/142
---

# Brand Hub UX Specification

## Purpose

Brand Hub lets authorized marketing teams define, review and publish the brand context that Asset
Library, Creative Studio, Image Studio, Video Studio and Content Engine consume. It owns brand
identity and its published versions; it does not own assets, creative projects, content, campaigns
or external publication.

This is a proposed definition. It does not authorize routes, product code or persistence.

## VitaBlue exploratory starting point

VitaBlue already has a functional Brand Identity Panel with logo variants, color-token display,
typography guidance and creative rules. It is a useful visual and interaction reference that can
continue evolving as exploratory work. It is not a Brand Hub lifecycle: its identity data is
presentation-oriented and does not establish authorized `Brand`/`BrandVersion` persistence, version
review, publication, tenant scope or audit in LoopDev.

LoopDev may learn from that panel's information architecture, but must rebuild its behavior through
the proposed Brand Hub contract and Platform Shell. No VitaBlue brand colors, static rules or logo
implementations become LoopDev or tenant source of truth automatically.

## Navigation and Canvas

| Surface | Proposed route | Canvas recipe | Purpose |
| --- | --- | --- | --- |
| Brand overview | `/marketing-studio/brand-hub` | `overview` | Select an authorized brand and see its published context, version status and review work. |
| Brand list | `/marketing-studio/brand-hub/brands` | `data` | Find, filter and open brands within the authorized scope. |
| Brand detail | `/marketing-studio/brand-hub/brands/:brandId` | `record` | Inspect the published identity, rules and version history of one brand. |
| Draft editor | `/marketing-studio/brand-hub/brands/:brandId/versions/:versionId` | `focus` | Edit a draft version and send it for review. |
| Review | From version detail | `split` | Compare draft and published versions while recording an approval decision. |

The implementation must use `AppShell`, `SuiteShell`, `SuiteRuntime` and `SuiteCanvas`. The active
organization and workspace belong to platform context; the selected brand is module context. No
parallel header, sidebar, rail or brand-specific navigation is permitted.

## Roles and actions

| Role | Visible actions |
| --- | --- |
| Admin | Create a brand, grant access through Platform Core, create drafts, request review, approve and publish when authorized. |
| Brand manager | Create and edit drafts, request review, respond to requested changes and publish when granted `marketing.brand.publish`. |
| Creative | Read published brand context; may propose changes only when granted edit permission. |
| Reviewer | Read draft and published versions; approve, reject or request changes without editing identity fields. |
| Viewer | Read published context only. |

The final permission names and mappings are pending Platform Core review. The browser must never
decide whether a role can read, edit, review or publish.

## Brand version content

A draft version may include the following configurable groups. Required fields remain pending the
product approval of the first implementation slice.

| Group | Examples | Status |
| --- | --- | --- |
| Identity | Name, description, market and owner reference | Required to identify a brand |
| Visual guidance | Color tokens, typography references, logo references and usage rules | Optional/configurable |
| Voice and messaging | Tone, preferred terms, prohibited terms and claims guidance | Optional/configurable |
| Audience and channels | Target audience notes, approved channels and locale guidance | Optional/configurable |
| Governance | Review notes, effective date, expiry date and restrictions | Required for publication when applicable |

Logo and media entries are references to Asset Library. Brand Hub must not upload, duplicate or own
the binary asset lifecycle.

## States and responsive behavior

Every view defines `loading`, `empty`, `error`, `forbidden` and `success` states. A missing active
brand is an empty/select state, not an implicit default. A stale, expired or unpublished version
must be visibly distinguished from the current published version.

Desktop may use `split` for review with stable comparison and inspector regions. Tablet collapses
the inspector into a controlled panel. Mobile shows one region at a time, preserves review context
in navigation and uses an explicit confirmation before request-review, approve, reject or publish.

## Primary journeys

1. A Brand manager selects an authorized workspace, creates a brand, edits its first draft and
   requests review.
2. A Reviewer compares the draft with the current published version, requests changes or approves
   the version with an audit reason.
3. An authorized Brand manager publishes the approved version; consumers receive only the stable
   published context.
4. A Creative opens Image Studio or Video Studio and reads the active published brand context
   without gaining access to unpublished drafts.

## Negative journeys and exclusions

- A user outside the authorized organization, workspace or brand receives `forbidden` or `not
  found` according to the server-side disclosure policy.
- A Reviewer cannot modify identity fields while approving a version.
- A rejected or superseded version cannot be published without a new authorized review transition.
- Brand Hub does not manage asset uploads, creative editors, campaign planning, provider credentials,
  social publication, AI provider execution or CRM contacts.

## Approval criteria

- The routes and recipes preserve the mandatory Platform Shell.
- The brand/version lifecycle and role actions agree with the Brand Hub contract.
- Asset references remain delegated to Asset Library.
- Loading, empty, error, forbidden and success states are specified for each primary surface.
- Product Owner and Tech Lead explicitly approve this proposed UX before implementation.