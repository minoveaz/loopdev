---
title: SaaS view specification template
status: phase-0-contract
owner: platform
reviewed_at: 2026-08-14
---

# SaaS view specification template

Copy this template into the owning product track before implementing a new
view. The specification is the review contract, not a substitute for tests.

## Identity

- **Suite:**
- **Module/view:**
- **Owner:**
- **Route:**
- **Canvas mode:**
- **Visual recipe:**

## Composition

- **Regions and owners:**
- **Surface sequence:**
- **Background variant:**
- **Density:**
- **Spacing/layout constraints:**
- **Allowed shared components:**
- **Domain-specific components:**

## Behavior and states

- **Loading:**
- **Empty:**
- **Error:**
- **Forbidden:**
- **Read-only:**
- **Offline/stale/conflict:**
- **Primary/secondary actions:**
- **Keyboard/focus/Escape behavior:**
- **Portal/overlay behavior:**

## Data and security

- **Permissions/capabilities:**
- **Active-route fallback:**
- **Organization isolation:**
- **Pagination/filter/sort contract:**
- **Formatting/localization/timezone:**
- **Audit/telemetry events:**
- **Sensitive data/redaction:**

## Responsive and accessibility

- **Desktop behavior:**
- **Tablet behavior:**
- **Mobile behavior:**
- **Touch versus hover:**
- **Focus order and restoration:**
- **Contrast and reduced motion:**
- **Screen-reader semantics:**

## Validation and exceptions

- **Contract tests:**
- **Interaction tests:**
- **Visual/browser checks:**
- **Performance budget:**
- **Exception IDs and approval evidence:**
- **Deferred validation:**
