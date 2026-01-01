# BRAND HUB — Domain Definition

> **Status:** Draft v0.1
> **Scope:** Marketing Studio · Brand Hub
> **Audience:** CEO · Product · Design · Engineering
> **Purpose:** Single source of truth for what a “Brand” means inside loop.dev

---

## 1. Purpose of This Document

This document defines the Brand domain inside loop.dev.

It exists to:
1.  **Create a shared mental model** across business, product, and engineering.
2.  **Prevent ambiguity** before any UI, API, or database design.
3.  **Act as the authoritative reference** for all Brand Hub–related decisions.

> ❗ **Rule:** If something is unclear here, it must not be coded.

---

## 2. Market Benchmark (Reality Check)

Before defining our own model, it is important to acknowledge how Brand management is typically handled in existing tools.

### Common market patterns
*(Adobe, Figma, Frontify, Bynder, Canva for Teams)*

Most platforms today:
*   Treat a Brand as a **static container of assets**.
*   Focus on: Logos, Colors, Typography, Basic guidelines (PDF).
*   Offer limited or no: Versioning, Cross-module governance, Context-aware enforcement.

### Observed limitations
*   Brands are often **documents**, not systems.
*   Changes propagate manually or inconsistently.
*   Little connection between Brand definition and Campaign execution.

### loop.dev opportunity
loop.dev positions Brand not as a document, but as a **living, governed system** that:
*   **Evolves over time.**
*   **Is enforceable** across modules.
*   **Is observable**, versioned, and auditable.

---

## 3. Core Definition

### What is a Brand in loop.dev?
A Brand in loop.dev is:
> A **governed, versioned representation** of a company’s identity, rules, and constraints, designed to be **consumed consistently** by multiple modules across the platform.

A Brand is:
*   **Context-aware** (light/dark, channel, market).
*   **Versioned** (changes are explicit, traceable, and reversible).
*   **Governed** (roles, approvals, and permissions apply).
*   **Consumable** (other modules depend on it as a source of truth).

### What a Brand is NOT
*   ❌ A Brand is not a campaign.
*   ❌ A Brand is not a single logo.
*   ❌ A Brand is not a static style guide document.
*   ❌ A Brand is not owned by a single module.

---

## 4. Brand Ownership & Multi‑Tenancy

*   Every Brand must belong to **exactly one Tenant**.
*   A Tenant may have:
    *   One Brand (simple use cases).
    *   Multiple Brands (multi-brand organizations).
*   A Brand cannot exist outside a Tenant.

---

## 5. Brand Components (Domain Breakdown)

A Brand is composed of multiple domain components.

### 5.1 Identity Assets
*   **Logos:** Multiple variants allowed (Horizontal/Vertical, Color/Mono, Light/Dark).
*   **Management:** Stored in **Asset Manager**, referenced by Brand Hub.

### 5.2 Color System
Colors in loop.dev are defined as **semantic tokens**, not raw values.
*   Example: `brand.primary`, `brand.surface`, `brand.accent`.
*   Each token resolves to HEX/RGB/HSL depending on context (Dark Mode).
*   **Rule:** Raw color values must not be consumed directly by other modules.

### 5.3 Typography
*   Defined as: Font families + Font roles (heading, body, UI).
*   Follows the same token-based approach as colors.

### 5.4 Brand Rules & Constraints (Differentiator) 🌟
This is a key differentiation point for loop.dev. A Brand may define **machine-readable rules**:
*   Minimum logo size.
*   Forbidden color combinations.
*   Allowed tone of voice levels (e.g., "Professional", "Witty").
*   Channel-specific constraints.

These rules are:
*   **Declarative.**
*   **Enforceable** by other modules (Content Engine, Canvas).
*   **Versioned** together with the Brand.

---

## 6. Versioning & Lifecycle

### 6.1 Brand States
A Brand can be in one of the following states:
1.  **Draft:** Work in progress, invisible to consumers.
2.  **Published:** The active "Source of Truth".
3.  **Archived:** Read-only, preserved for history.

### 6.2 Version Model
*   Every change creates a new **immutable version**.
*   Published versions are read-only.
*   Rollback to a previous version is supported.

### 6.3 Consumption Rules
*   Campaigns and content reference a specific Brand version (Snapshot) OR verify against Latest.
*   New work defaults to the latest published version.

---

## 7. Governance & Permissions

Brand governance is role-based (RBAC):
*   **Brand Admin:** Full control (Delete, Publish).
*   **Brand Editor:** Can edit Drafts.
*   **Brand Viewer:** Can consume assets.

Approval workflows are configurable per Tenant.

---

## 8. Relationships with Other Modules

*   **Asset Manager:** Owns binary assets; Brand Hub references them by ID.
*   **Campaign Orchestrator:** Consumes Brand versions; cannot mutate Brand data.
*   **Content Engine:** Uses Brand Rules to guide generation; validates output against constraints.

---

## 9. Domain Invariants (Non‑Negotiable Rules)

1.  A Brand always belongs to a Tenant.
2.  A published Brand version is immutable.
3.  A Brand with active dependencies cannot be deleted.
4.  All consuming modules must reference a Brand version.

---

## 10. Strategic Differentiation Summary

loop.dev Brand Hub differentiates by:
1.  Treating Brand as a **system**, not a document.
2.  **Enforcing** Brand rules automatically.
3.  **Versioning** Brand identity like code.
4.  Making Brand a **first-class dependency** across the platform.

---

## 11. Open Questions (To Be Closed)

*   [ ] Do we allow cross-Brand inheritance? (e.g., "Sub-brand" inherits "Parent Brand")
*   [ ] Do Brands support regional overrides?
*   [ ] How strict is rule enforcement (warn vs block)?

These questions must be resolved before implementation.
