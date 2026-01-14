# BrandHub — Visual System · Colors (SaaS-Level) · Spec (v1.6)

> **View:** Visual System → Colors (Brand Mode)
> **Route:** `/marketing-studio/brand-hub/brands/:brandId/visual/colors`
> **Purpose:** Provide an enterprise-grade environment to define **brand color truth** as **semantic tokens**. Examples and usage guidelines are delivered contextually via the Inspector.

---

## 0) Core Philosophy (SaaS-grade)
1.  **Colors are Contracts:** A hex is implementation; a token is meaning.
2.  **Two-Layer Model:** Raw Palette vs. Semantic Tokens.
3.  **Just-in-Time Education:** "How-to-use" is explained in the Inspector when risk is detected, keeping the main Canvas clean and technical.

---

## 1) Information Architecture (Page Layout)
... (Same as v1.5) ...

---

## 2) Component System
... (Same as v1.5) ...

---

## 3) Inspector Mapping (Consequence Wiring)

| Selection | Inspector Tab | Content |
| :--- | :--- | :--- |
| **Color Token** | `Context` | Metadata, owner, version. |
| **Color Token** | `Validation` | WCAG checks, ratio, remediation. |
| **Color Token** | `Explain` | **Usage Oracle (Do/Don't):** <br> - ✅ **OK:** Semantic usage examples (e.g., "Button background"). <br> - ❌ **NOT OK:** Misuse warnings (e.g., "Body text on white"). |
| **Color Token** | `Impact` | List of consuming modules/campaigns. |

---

## 4) Explain Tab Design Rules
*   **No Heavy Graphics:** Use mini-chips, typography previews, and text-based logic.
*   **Role-Driven:** Examples must be tied to the token's `role` (background, text, etc.).
*   **Actionable:** Every "Don't" should suggest an "OK" alternative.

