# BRAND HUB — Domain Definition (v1.0)

> **Status:** Active / Production Ready
> **Scope:** Marketing Studio · Brand Hub
> **Audience:** CEO · Product · Design · Engineering
> **Purpose:** Single source of truth for what a “Brand” means inside loop.dev

---

## 1. Purpose of This Document

This document defines the Brand domain inside loop.dev. It exists to create a shared mental model, prevent ambiguity in architecture, and act as the authoritative reference for all Brand Hub–related decisions.

> ❗ **Rule:** If something is unclear here, it must not be coded.

---

## 2. Product Definition: The Brand Oracle

**What is Brand Hub?**
Brand Hub is the authoritative domain service responsible for **defining, versioning, and governing Brand semantics** inside loop.dev.

It does **not** store production assets, generate content, or execute campaigns. It defines the **truth**: the rules, identity, and constraints that every other module must obey.

---

## 3. Core Brand Object

A Brand is a governed, versioned representation of an identity. Every Brand object must contain:
- `id`: UUID.
- `tenantId`: Ownership link.
- `name` & `description`.
- `status`: `{ DRAFT | PUBLISHED | ARCHIVED }`.
- `version`: Semantic versioning (immutable).
- `inheritsFrom`: `BrandId | null` (Support for hierarchy).
- `governanceConfigId`: Rules for approval and modification.

---

## 4. Brand Architecture & Inheritance

Brand Hub supports complex enterprise hierarchies:
- **Parent Brand:** Defines global foundations (e.g., Global Logo, Core Blue).
- **Sub-brand:** Inherits tokens and rules from Parent.
- **Rules of Inheritance:**
    - Inheritance is **Explicit** and **Versioned**.
    - **Override-aware:** Sub-brands can only override domains allowed by the Parent's governance.

---

## 5. Domain Components

### 5.1 Identity References
Brand Hub does **not** own binaries. It declares **Semantic Roles**:
- `logo.primary`, `logo.inverted`, `icon.favicon`.
- These are pointers to assets stored in the **Asset Manager**.

### 5.2 Token System (The DNA)
All brand values are **Semantic Tokens**:
- **Rule:** Raw values (HEX/RGB) are prohibited in consumption.
- Tokens are **Context-Aware**: Support for `Dark/Light`, `Print/Web`, and `Market` overrides.

### 5.3 Brand Rules Engine (The Crown Jewel) 🌟
Machine-readable, declarative rules:
- **Visual:** Min sizes, contrast ratios, safe areas.
- **Verbal:** Tone of voice, forbidden words, regulated claims.
- **Structural:** Naming conventions, layout constraints.
- **Property:** Rules are **Explainable** (designed for AI consumption).

---

## 6. Lifecycle & Dependency Graph

### 6.1 Version Model
- Changes create new **immutable versions**.
- Published versions are read-only.

### 6.2 Dependency Awareness (Critical)
Brand Hub tracks **who depends on what**:
- Knows which Campaigns, Contents, or Flows are tied to which Brand version.
- **Impact Analysis:** Shows consequences before publishing a new version.
- **Deletion Protection:** Blocks deletion if active dependencies exist.

---

## 7. Governance & Enforcement

- **Definition:** Governance is defined in Brand Hub (who can change what, approval flows).
- **Enforcement:** Executed by other modules (e.g., Content Engine validates against Brand Rules).

---

## 8. Access Architecture (Navigation Schema)

Brand Hub follows a strict triple-level hierarchy: `{ SUITE / MODULE / VIEW }`.

### 8.1 Module Mode (Discovery)
- **Scope:** No specific brand selected.
- **Focus:** Overview of the entire brand ecosystem, global glossary, and module-wide settings.

### 8.2 Brand Mode (Deep Governance)
- **Scope:** Specific brand (`:brandId`) selected.
- **Focus:** Atomic definition of truth (Identity, Visuals, Rules) and audit of consequences (Impact, Dependencies).

## 9. Explicit Non-Responsibilities

Brand Hub **DOES NOT**:
- ❌ Store or version binary files (Asset Manager job).
- ❌ Render or edit creative pieces.
- ❌ Generate content.
- ❌ Execute campaigns.
- ❌ Validate final production outputs.

---

## 9. Conclusion

> **Brand Hub is not where brand assets live. It is where brand truth lives.**