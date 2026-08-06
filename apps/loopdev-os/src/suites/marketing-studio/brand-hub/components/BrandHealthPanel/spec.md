# Spec: BrandHealthPanel (v1.0)

## 1. Purpose
Aggregated view of brand health indicators. Serves as the primary diagnostic tool for operators.

## 2. Visual Rules
- **Layout:** Responsive grid (2x2 on Desktop, 1x4 on Mobile).
- **Spacing:** standard `gap-4` or `gap-6` matching the platform grid.
- **Header:** Includes a section title "System Health".

## 3. Interaction
- Orchestrates individual `MetricTile` clicks.
- Passes the metric ID up to the page level for Inspector mapping.
