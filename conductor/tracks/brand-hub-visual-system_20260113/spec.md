# BrandHub — Visual System · Colors (SaaS-Level) · Spec (v1.5)

> **View:** Visual System → Colors (Brand Mode)
> **Route:** `/marketing-studio/brand-hub/brands/:brandId/visual/colors`
> **Purpose:** Provide an enterprise-grade environment to define **brand color truth** as **semantic tokens** (context-aware, versioned, auditable).

---

## 0) Core Philosophy (SaaS-grade)
1.  **Colors are Contracts:** A hex is implementation; a token is meaning.
2.  **Two-Layer Model:**
    *   **Raw Palette:** Base swatches (hex/hsl). Not consumed directly.
    *   **Semantic Tokens:** Context-aware aliases (`brand.primary`) resolving to raw values.
3.  **Immutable Versioning:** Published versions are read-only. Changes require a Draft.

---

## 1) Information Architecture (Page Layout)

The page is composed of 4 zones inside the ModuleCanvas:

### Zone A — Context Bar (In-Canvas)
*   **Context Selector:** Theme (Light/Dark), Medium, Market.
*   **View Toggle:** Grid vs Table.
*   **Filter/Search:** Category and text search.
*   **Rule:** Selectors affect *preview* and *validation*, not navigation.

### Zone B — Token Groups (Rail)
*   Navigation rail for: Core Brand, Semantic, Neutrals.
*   Metrics: Token count, warning count.

### Zone C — Main Palette Surface
*   **Grid Mode:** Responsive grid of `ColorTokenCard`.
*   **Table Mode:** Dense data view with resolved values and usage stats.

### Zone D — Quick Actions (Optional)
*   Export (JSON), Copy All, View Guidelines.

---

## 2) Component System

### 2.1 ColorTokenCard (Molecule)
*   **Visuals:** Swatch preview, Token Name, Resolved Value (Hex), Contrast Badge.
*   **Behavior:** 
    *   Click Card → Open Inspector (Context/Diff).
    *   Click Hex → Copy to clipboard.
    *   Click Badge → Open Inspector (Validation).

### 2.2 ContrastBadge (Atom)
*   **Visuals:** Ratio (e.g., 4.5:1) + Status Icon (Check/Warning).
*   **Context:** Updates based on selected theme (Light/Dark).

---

## 3) Data Model (Types)

```ts
type SemanticColorToken = {
  id: string;
  name: string; // e.g., 'brand.primary'
  description?: string;
  category: 'core' | 'semantic' | 'neutral';
  role?: 'bg' | 'text' | 'border' | 'status';
  resolvesTo: {
    light: string; // Hex or Raw ID
    dark: string;
  };
  contrast?: {
    onBg: string; // Token ID to check contrast against
  };
};

type BrandPalette = {
  tokens: SemanticColorToken[];
};
```

---

## 4) Inspector Mapping (Consequence Wiring)

| Selection | Inspector Tab | Content |
| :--- | :--- | :--- |
| **Token (Stable)** | `Context` | Metadata, resolved values, owner. |
| **Token (Draft Change)** | `Diff` | Before/After swatch comparison. |
| **Contrast Badge** | `Validation` | WCAG checks, ratio, remediation. |
| **Usage Badge** | `Impact` | List of consuming modules/campaigns. |
| **Policy Lock** | `Governance` | Approvers required for change. |
