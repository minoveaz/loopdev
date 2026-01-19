# User Histories: Brand Typography System (v1.0)

**Goal:** Ensure typographic consistency and readability across all brand touchpoints (Marketing & Product).

## 📚 Historias de Usuario

### [A] Definition & Hierarchy
1. **[PRIMARY] Brand Voice in Type**
   - **HU:** As a Brand Manager, I want to define a "Primary Typeface" (e.g., Inter) that is automatically applied to all Marketing headings and UI body text to ensure brand recognition.
2. **[SECONDARY] Technical Precision**
   - **HU:** As a Developer Experience Lead, I want to define a specific "Monospace Typeface" (e.g., JetBrains Mono) for all code snippets and technical data displays to ensure clarity for engineering users.
3. **[SCALE] Dynamic Hierarchy**
   - **HU:** As a Designer, I want the H1-H6 headers to follow a mathematical ratio (e.g., 1.2 or 1.5) based on a base size, so that the visual rhythm is always harmonious without manual tweaking.

### [B] Governance & Usage
4. **[SOURCE] Legal Compliance**
   - **HU:** As a Legal Officer, I want to specify the "Provider" of the font (Google Fonts vs. Custom Upload) and attach license details to prevent copyright infringement lawsuits.
5. **[FALLBACK] Performance Safety**
   - **HU:** As a CTO, I want to define a "System Fallback Stack" (e.g., sans-serif) that loads immediately if the webfont fails, ensuring the site is never unreadable.
6. **[USAGE] Contextual Rules**
   - **HU:** As a Designer, I want to attach "Usage Guidelines" (e.g., "Only use Black weight for Hero sections") to the font definition so that content creators don't misuse the weights.

### [C] Inspector & AI Context
7. **[INSPECT] Character Set**
   - **HU:** As a localization specialist, I want to inspect the supported "Character Sets" (Latin, Cyrillic) via the Inspector to verify we can launch in new markets.
8. **[AI] Readability Optimization**
   - **HU:** As an AI Content Agent, I need to know the "Optimal Line Height" and "Max Line Length" defined in the typography system to generate layouts that are easy to read.

### [D] Visualization (The Lab Blueprint)
9. **[PREVIEW] Real-time Testing**
   - **HU:** As a stakeholder, I want to type my own text into a "Playground" area within the Typeface Card to see how my specific brand name looks in that font.
10. **[CONTRAST] Accessibility Check**
    - **HU:** As an accessibility advocate, I want the system to warn me if the chosen "Base Font Size" is too small (<16px) for legibility standards.

## 📐 Criterios de Aceptación Técnicos
- [ ] Modelo de datos soporta `provider` (Google/Custom/System).
- [ ] La UI distingue visualmente entre Contexto Marca (Light/Serif/Sans) y Contexto Técnico (Dark/Mono).
- [ ] La tabla de escala muestra valores calculados (rem/px) reales.
- [ ] El inspector muestra detalles de licencia y pesos disponibles.
