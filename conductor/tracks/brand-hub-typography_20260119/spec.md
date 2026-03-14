# Spec: Brand Hub Typography System (v1.0)

> **Source:** `labdev/pages/system/Typography.tsx`
> **Status:** Definition
> **Owner:** Brand Hub Team

## 1. Overview
The Typography module serves as the authoritative source for a brand's typographic system. It defines the typefaces, weights, and usage rules for both UI (User Interface) and Technical (Code/Data) contexts.

## 2. Technical Architecture
Following the "Contract-First" approach, typography data must be modeled in Zod before UI implementation.

### 2.1 Data Model (Schema)
The `BrandIdentity` will be extended. Unlike the simple Lab view, the industrial model supports governance:

- **Font Family:** Name, Type (Sans, Serif, Mono, Display).
- **Source:** Provider (Google, Custom, System) + URI/File path.
- **License:** Type (OFL, Proprietary, Adobe) to ensure legal safety.
- **Weights:** Specific weights authorized for use (avoiding loading unused 900 italic).
- **Fallbacks:** The CSS stack string for safety.

### 2.2 Zod Definition (`typography.schema.ts`)
```typescript
export const FontSourceSchema = z.enum(['google', 'system', 'custom', 'adobe']);

export const FontVariantSchema = z.object({
  weight: z.number(), // 400, 700
  style: z.enum(['normal', 'italic']),
  usage: z.string().optional() // "Body text only"
});

export const FontDefinitionSchema = z.object({
  family: z.string(),
  type: z.enum(['sans', 'serif', 'mono', 'display', 'handwriting']),
  source: FontSourceSchema,
  sourceUrl: z.string().optional(), // For Google/Custom
  license: z.string().optional(),
  variants: z.array(FontVariantSchema),
  fallbacks: z.array(z.string()).default(['sans-serif'])
});

export const TypographySystemSchema = z.object({
  primary: FontDefinitionSchema,
  secondary: FontDefinitionSchema.optional(), // Mono is optional for non-tech brands
  baseSize: z.number().min(12).default(16), // Accessibility floor
  scaleRatio: z.number().default(1.25), // Major Third by default
  lineHeightBase: z.number().default(1.5)
});
```

## 3. UI Implementation Strategy (Lab -> OS)

### 3.1 Visual Components
The `labdev` design introduces specific presentation patterns that need to be industrialized:

1.  **TypefaceCard:** A rich presentation card for fonts.
    *   *Variant A (Brand):* Light theme, large watermark "Aa", alphabet preview.
    *   *Variant B (Technical):* Dark theme, code decorations (`{ }`, `< >`), monospaced.
    *   *Interactive:* Allow user to type in the preview area (HU-9).
2.  **TypeScaleTable:** A table view showing the hierarchy (H1...Caption).
    *   *Logic:* Must calculate the px/rem values based on `baseSize` * `scaleRatio`.

### 3.2 Page Layout (`TypographyPage`)
- **Header:** Standard `BrandHub` header (Title + Subtitle).
- **Section 1:** Typeface Definitions (Grid of Primary + Secondary).
- **Section 2:** Hierarchy/Scale Table (Live calculation).

## 4. Business Logic & Governance
- **Read-Only (MVP):** Initially, this view displays the system defaults.
- **Validation:** `baseSize` cannot be < 12px (Accessibility Rule).
- **Safety:** If Primary font fails to load (network error), the `fallback` stack must be displayed in the Inspector.

## 5. Success Criteria
1.  The `TypographyPage` matches the `labdev` visual fidelity.
2.  Data is served from a structured object (even if mocked initially), not hardcoded JSX text.
3.  Components use `@loopdev/ui` primitives (`LpdText`, `TechnicalCard`, etc.).
4.  Inspector shows "License" and "Weights" when a card is clicked.
