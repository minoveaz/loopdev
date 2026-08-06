# Spec: RecentActivityFeed (v1.0)

## 1. Purpose
Provides a snapshot of the most recent changes to the brand. Reinforces auditability and situational awareness.

## 2. Visual Rules
- **Structure:** Vertical list of `AuditEventRow`.
- **Empty State:** Shows a clear message if no activity is recorded.
- **Footer:** Includes a link to "View Full Audit" (`/governance/audit`).

## 3. Interaction
- Clicking an event row updates the Inspector context to that specific event.
- If the event has a diff, the Inspector should prioritize the `Diff` tab.
