# Spec: Brand Hub Logo System (v1.0)

> **Source:** `labdev/pages/system/Overview.tsx`
> **Status:** Definition
> **Track:** `brand-hub-logo-system_20260119`

## 1. Overview
The Logo System is the visual cornerstone of the Brand Hub. It transitions from a simple `logoUrl` string to a structured set of assets, variants, and technical specifications that govern how the brand is represented across all mediums.

## 2. Technical Architecture

### 2.1 Data Model (Schema)
The legacy `logoUrl` field in `public.brands` will be replaced/complemented by a `logos` JSONB object.

**Structure:**
- **Isotype:** The core symbol (e.g., Infinite Loop).
- **Lockups:** Combinations of symbol + text (Horizontal, Vertical).
- **Variants:** Color behaviors (Full Color, Monochrome Dark, Monochrome Light).
- **Metadata:** Technical specs (Grid, Aspect Ratio, Stroke).

### 2.2 Zod Definition (`logo.schema.ts`)
```typescript
export const LogoAssetSchema = z.object({
  url: z.string().url(),
  rawSvg: z.string().optional(), // For copy-paste dev velocity
  width: z.number().optional(),
  height: z.number().optional()
});

export const LogoLockupSchema = z.object({
  horizontal: LogoAssetSchema,
  vertical: LogoAssetSchema,
  isotype: LogoAssetSchema
});

export const LogoSystemSchema = z.object({
  primary: LogoLockupSchema, // Full color versions
  monochrome: z.object({
    positive: LogoLockupSchema, // Dark on Light
    negative: LogoLockupSchema  // Light on Dark
  }).optional(),
  specs: z.object({
    aspectRatio: z.string().default("Variable"),
    gridType: z.string().default("Pixel Perfect"),
    strokeWeight: z.string().default("Fluid")
  })
});
```

## 3. UI Components (Industrialized from Lab)

### 3.1 `LogoHeroShowcase`
- **Visuals:** Large center display of the Isotype.
- **Features:** Grid background (Clearspace visualization), "FIG 1.0" technical label, and contextual action buttons.

### 3.2 `LogoVariantCard`
- **Visuals:** Card with a dotted/grid background.
- **Variants:** Stacks vertically or horizontally depending on the lockup.
- **Actions:** SVG Copy, Download Button.

### 3.3 `LogoApplicationPreview`
- **Contexts:**
    - **Favicon:** Browser tab mockup.
    - **App Icon:** Mobile device/Springboard mockup.
    - **Scale:** Comparison at 16/32/64px.

## 4. Business Rules
1. **Fallback Logic:** If a specific variant (e.g., Monochrome) is missing, the system should default to the `primary` version but warn the user in the Inspector.
2. **Read-Only (MVP):** Initial implementation displays LoopDev's own logos as the reference system.
3. **Accessibility:** Every logo MUST have an `alt` text definition in the metadata.

## 5. Success Criteria
1. The Logos page renders at 100% visual parity with the Lab blueprint.
2. Users can copy raw SVG code to clipboard.
3. Data is fully driven by the `logos` JSONB column in Supabase.
4. Inspector opens with technical specs when a logo is clicked.
