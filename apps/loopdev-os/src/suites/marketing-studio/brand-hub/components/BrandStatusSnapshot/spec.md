# Spec: BrandStatusSnapshot (v1.0)

## 1. Purpose
Contextual anchor for the brand canvas. Identifies the brand, its lifecycle state, and editing mode.

## 2. Visual Rules
- **Typography:** Brand name in `XL` or `2XL` weight.
- **Chips:** Uses bracket syntax `{ MODE }` for high technical feel.
- **Layout:** Flex row with metadata on the right or below depending on container width.

## 3. Mode Chips Mapping
- `read-only` -> Severity: Neutral, Label: "READ ONLY"
- `draft-mode` -> Severity: Warning, Label: "DRAFT ACTIVE"
- `review-mode` -> Severity: Critical, Label: "IN REVIEW"
