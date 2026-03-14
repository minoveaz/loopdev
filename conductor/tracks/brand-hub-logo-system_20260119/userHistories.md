# User Histories: Brand Logo System (v1.0)

**Goal:** Provide a centralized, governed, and industrial-grade repository for all brand logo assets and their usage rules.

## 📚 Historias de Usuario

### [A] Asset Management & Accessibility
1. **[CENTRALIZATION] Source of Truth**
   - **HU:** As a Brand Manager, I want a single place to host all official versions of the logo (Horizontal, Vertical, Isotype) so that team members stop using outdated or low-quality versions found on Slack or Google Drive.
2. **[FORMATS] Production Ready**
   - **HU:** As a Designer, I want to download logos in multiple formats (SVG for web, PNG for docs) directly from the dashboard to save time during campaign creation.
3. **[SVG_COPY] Dev Velocity**
   - **HU:** As a Frontend Developer, I want to copy the raw SVG code of any logo variant with one click so I can paste it directly into my components without handling files.

### [B] Technical Specs & Governance
4. **[LOCKUPS] Contextual Variants**
   - **HU:** As a Designer, I want to define specific "Lockups" (e.g., Vertical for social media, Horizontal for headers) so the system understands which one to suggest for different layouts.
5. **[SAFE_ZONE] Clearspace Rules**
   - **HU:** As a Brand Guardian, I want to visualize the "Safety Zone" (grid) around the logo to ensure it always has enough breathing room and isn't cramped by other UI elements.
6. **[CONTRAST] Background Logic**
   - **HU:** As a system, I need to know which logo variant to use on Dark vs. Light backgrounds automatically to ensure 100% brand legibility at all times.

### [C] Quality & Scale
7. **[MIN_SIZE] Scale Integrity**
   - **HU:** As an Accessibility Lead, I want to see a "Scale Test" (rendering at 16px, 32px, 64px) to verify that the logo remains recognizable at favicon or mobile header sizes.
8. **[ISOTYPE] Symbol Autonomy**
   - **HU:** As a Brand Manager, I want to define the "Isotype" (symbol only) as a standalone asset for use in app icons and loading states (like the LogoSpinner).

### [D] Inspector & Context
9. **[INSPECT] Construction Specs**
   - **HU:** As a user, when I click a logo, I want the Inspector to show me technical specs (Aspect Ratio, Stroke rules, Grid type) so I understand its construction principles.
10. **[AUDIT] Usage History**
    - **HU:** As an Admin, I want to see when a logo variant was last updated and by whom to maintain a clean audit trail of brand evolution.

## 📐 Criterios de Aceptación Técnicos
- [ ] Implementar `LogoVariantCard` con acciones de descarga y copia.
- [ ] Visualizador de construcción con rejilla (Grid Pattern).
- [ ] Soporte para metadatos técnicos (Aspect Ratio, Stroke).
- [ ] Sección de "Applications" (Favicon, App Icon) con previsualización de contexto.
- [ ] Integración con el `useActiveBrand` hook para datos persistentes.
