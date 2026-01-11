# Spec: MetricTile (v1.0)

## 1. Purpose
Reusable metric card for operational dashboards. Communicates health status and triggers contextual analysis.

## 2. Visual Rules
- **OK:** Border and accent use `emerald-500`.
- **WARN:** Border and accent use `yellow-500`.
- **BLOCK:** Border and accent use `red-500`.
- **Background:** `shell-canvas` with subtle overlay.
- **Micro-interaction:** Hover increases border opacity and shows pointer cursor.

## 3. Interaction
- Clicking the tile should call `onClick`, which in most cases will open the **Inspector** on a specific tab (e.g., Compliance -> Validation).

## 4. Hierarchy
1. Label (Nano, bold, uppercase)
2. Value (Large, main text)
3. Meta (Xs, muted text)
