---
title: Campaign Orchestrator UX Specification
status: proposed
version: 0.1
created: 2026-08-28
updated: 2026-08-28
owner: marketing-studio
program_track: tracks/planned/marketing-studio/2026-08-28-marketing-studio-module-definition.md
issue: https://github.com/minoveaz/loopdev/issues/148
---

# Campaign Orchestrator UX Specification

## Purpose

Campaign Orchestrator coordinates marketing objectives, calendar and approved content references. It
owns Campaign and CampaignItem lifecycle; Content Engine owns editorial versions, Publishing owns
external delivery, and CRM owns contacts, leads, opportunities, revenue and conversion records.

This is a proposed definition and does not authorize routes, persistence, provider integrations or
campaign activation.

## VitaBlue exploratory starting point

Campaign Orchestrator already has an exploratory Campaign Manager in VitaBlue. Its working surfaces
cover campaign name/objective/status/date, selected platforms, manual versus connected-channel mode,
text/video content selection, per-channel copy, asset editing and post/story preview, readiness
checks, links with tracking, activity history, download/export and preparation for publication.

VitaBlue also persists campaigns and publication records as an exploratory backoffice capability.
Its browser `localStorage` fallback, browser download/clipboard preparation, direct UI assumptions
and role-only campaign-publication RLS are not LoopDev authority. In particular, the reviewed
publication RLS does not model the required organization/workspace/brand isolation. LoopDev uses
this work as evidence for journeys, controls and failure modes, while rebuilding runtime contracts,
authorization, durable delivery and audit on Platform Core.

## Navigation and Canvas

| Surface | Proposed route | Canvas recipe | Purpose |
| --- | --- | --- | --- |
| Campaign overview | `/marketing-studio/campaigns` | `overview` | Show authorized objective, calendar and execution status summaries. |
| Campaign list | `/marketing-studio/campaigns/library` | `data` | Find, filter, sort and open authorized campaigns. |
| Calendar and planning board | `/marketing-studio/campaigns/calendar` | `board` | Plan campaign items by approved dates and owned states. |
| Campaign record | `/marketing-studio/campaigns/:campaignId` | `record` | Inspect objective, audience references, content items and external delivery evidence. |
| Campaign item inspection | From board/list selection | `split` | Review an item without losing planning context. |

The implementation must compose the Platform Shell. `board` is a generic Canvas recipe, not a
Campaign-specific shell. Organization/workspace are platform context; brand is optional authorized
context. No custom persistent campaign rail is permitted.

## Roles, states and journeys

| Role | Actions |
| --- | --- |
| Admin | Manage authorized access and campaign policy through Platform Core. |
| Marketer | Create/edit campaign drafts, objectives, dates and approved-content associations. |
| Content manager | Inspect and attach only approved Content Engine references. |
| Reviewer | Inspect planning state and permitted review decisions. |
| Viewer | Read authorized campaign summaries and delivery evidence. |

States are `loading`, `empty`, `error`, `forbidden`, `saving`, `conflict` and `success`. Desktop uses
the stable board/calendar where appropriate; tablet and mobile use a list/record focus rather than
compressing an unusable board.

1. A Marketer creates a campaign draft with objective, period and authorized brand/workspace context.
2. The Marketer attaches approved content versions; Campaign Orchestrator never edits their body.
3. The team plans CampaignItems in the calendar. An item remains internal planning state until a
   future Publishing contract reports external schedule/delivery evidence.
4. CRM conversion/attribution references are displayed only when an approved contract supplies them.

## Exclusions and approval criteria

- No social/email publishing, provider credential, transport, contact targeting, consent enforcement
  or automation execution belongs to this module.
- Campaign Orchestrator does not write to CRM entities, create content drafts or own asset lifecycle.
- The package needs approval only after campaign/item lifecycle agrees with Content Engine immutability
  and Publishing/CRM ownership boundaries.
