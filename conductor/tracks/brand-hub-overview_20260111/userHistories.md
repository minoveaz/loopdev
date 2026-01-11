# User Histories: Brand Overview Console (v1.1)

**Goal:** Provide supervision, resilience, and safe entry points for brand operations.

## 📚 Historias de Usuario

### [A] Supervision & Status (Snapshot)
1. **[STATUS] Instant Clarity**
   - **HU:** As a user landing on the overview, I want to see immediately if the brand is `{ PUBLISHED }`, `{ DRAFT }` or `{ ARCHIVED }` via clear visual chips.
2. **[MODE] Editing Awareness**
   - **HU:** As a user, I want to clearly see whether I am in `{ READ ONLY }`, `{ DRAFT MODE }` or `{ REVIEW MODE }` so I know if changes are allowed before I try to click anything.
3. **[VERSION] Lifecycle Awareness**
   - **HU:** As a user, I want to see the current active version number (e.g., v1.2.0) and who updated it last.

### [B] Health & Risk (Indicators)
4. **[HEALTH] Risk Assessment**
   - **HU:** As a brand manager, I want to see a "Compliance" tile that turns Red/Yellow if there are critical errors, so I can prioritize fixing them.
5. **[HEALTH] Severity Explanation**
   - **HU:** As a user, when a tile is Red or Yellow, I want to know **why** and **what to do next** via the Inspector (Explain tab).
6. **[IMPACT] Dependency Visibility**
   - **HU:** As an architect, I want to see a "Dependencies" tile showing how many modules consume this brand.

### [C] Governance & Audit (Activity)
7. **[GOVERNANCE] Permission Granularity**
   - **HU:** As a user, I want to see which domains (Colors, Rules) are `Allowed`, which require `Approval`, and which are `Restricted` (Admin only).
8. **[AUDIT] Recent Changes**
   - **HU:** As a reviewer, I want to see a feed of the last 5 changes. Clicking an event must open the Inspector showing the **Diff**.

### [D] Actionability & Navigation
9. **[ACTION] Safe Entry**
   - **HU:** As an editor, I want to see a "Create Draft" button if I'm in a read-only view, or "Continue Draft" if one exists.
10. **[NAVIGATION] URL-first consistency**
    - **HU:** As a user, if I refresh or deep-link to `/brands/:id/overview`, I want the same state (Brand loaded, Inspector closed/open) without losing context.

### [E] Resilience & Onboarding
11. **[RESILIENCE] Partial failure handling**
    - **HU:** As a user, if one block (e.g. Activity) fails to load, I want the rest of the overview to remain usable so I'm not blocked.
12. **[ONBOARDING] First-brand clarity**
    - **HU:** As a user on a newly created brand, I want clear empty states explaining what has not been configured yet and where to start.

## 📐 Criterios de Aceptación Técnicos
- [ ] Implementar `BrandStatusSnapshot` con los 3 modos explícitos.
- [ ] Implementar `BrandHealthPanel` con código de colores semántico (Green/Yellow/Red).
- [ ] Implementar `ActionLauncher` sensible al rol y estado.
- [ ] **Crucial:** Conectar cada elemento clickeable al `UnifiedInspector`.
- [ ] Layout responsive: 2 columnas en Desktop, Stack en Mobile.
- [ ] Manejo de errores por bloque (Error Boundaries).