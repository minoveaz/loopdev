# Spec: StructuredTextField (v1.0)

## 1. Purpose
Semantic data entry for long-form brand definitions (Mission, Vision).

## 2. Visual Rules
- **Read-only Mode:** Renders as clean body text with a technical label.
- **Edit Mode:** Renders as a `Textarea` with fixed height or auto-resize.
- **Micro-interaction:** Hover in read-only mode shows a subtle border to indicate it's an actionable data block.

## 3. Interaction
- In `draft` mode, changes are buffered locally until "Save Draft" is called in the toolbar.
- Clicking the block opens the **Inspector** on the **Diff** tab.
