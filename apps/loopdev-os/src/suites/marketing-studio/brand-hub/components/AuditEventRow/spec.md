# Spec: AuditEventRow (v1.0)

## 1. Purpose
Compact list item for recent activity feeds. Provides quick insight into who did what and when.

## 2. Visual Rules
- **Height:** Optimized for density (approx 48-56px).
- **Icons:** Uses `material-symbols` mapped to event types (e.g., `publish` -> `publish`, `token_change` -> `palette`).
- **Interaction:** Hover state highlights the entire row.

## 3. Interaction
- Clicking the row should call `onClick`, opening the **Inspector** on the **Context** tab (and **Diff** if `hasDiff` is true).
