# Front Certification Checklist — LoopDev UI/UX

## 🎯 Propósito
Esta checklist define los criterios de certificación para cualquier componente,
organismo o layout del frontend de LoopDev. La certificación requiere evidencia
de track, registry, pruebas y validación visual reproducible.

---

## 🟦 Estados de Certificación (UI Maturity)
| Estado | Nombre | Significado |
| :--- | :--- | :--- |
| 🔵 | **Front_Certified** | Listo para producción y escalado SaaS. |
| 🟡 | **Front_Audit** | Funcional, pero con deuda técnica o visual pendiente. |
| 🟣 | **Front_Lab** | Blueprint experimental del laboratorio. |

❗ Solo los elementos marcados como **Front_Certified** pueden integrarse en aplicaciones finales del ecosistema.

---

## ✅ Criterios de Certificación (Front_Certified)

### 1️⃣ The Quality Shield (Automatización Obligatoria)
- [ ] **Axe Pass:** Las pruebas Playwright de accesibilidad tienen 0 violaciones.
- [ ] **Playwright Visual:** Los snapshots visuales han sido revisados y no hay regresiones de píxeles.
- [ ] **Playwright Flow:** El componente ha superado el Smoke Test funcional en la app.
- [ ] **QA Matrix:** La matriz de calidad del componente está en verde.
- [ ] **Changeset:** Se ha creado el archivo de versión para el monorepo.

### 2️⃣ Arquitectura & ADN Visual
- [ ] **Brain/Body Split:** Lógica aislada en hooks, vista pura en el componente.
- [ ] **Zero Hardcoding:** No hay valores HEX ni escalas arbitrarias.
- [ ] **Dynamic Theming:** Reacciona correctamente al `DynamicThemeProvider`.
- [ ] **Modo Oscuro:** 100% legible y funcional.

### 3️⃣ Resiliencia & Estrés (Playwright)
- [ ] **Extreme Content:** Probado con textos masivos y traducciones largas sin romper el layout.
- [ ] **Layout Pressure:** Probado en contenedores estrechos (w-64) y fluidos.
- [ ] **Mirror Scenarios:** Cada caso de estrés definido en el track tiene una
  prueba visual `Stress` en Playwright.

### 4️⃣ Calidad Técnica (Vitest)
- [ ] **Trazabilidad 1:1:** Existe un test unitario por cada escenario definido
  en el track.
- [ ] **Nomenclatura:** Los bloques `it()` referencian el ID de la historia (ej: `Story 1`).
- [ ] **Hardening:** Suite de pruebas cubre estados de carga, error y deshabilitado.

### 5️⃣ SaaS & Dynamic Theming (Data Ready)
- [ ] **Theme Awareness:** El componente reacciona instantáneamente al `DynamicThemeProvider`.
- [ ] **Registry Sync:** Registrado en `docs/registries/frontend-components.json` con sus capacidades.
- [ ] **Organization Isolation:** No depende de contextos globales ocultos fuera de los proveedores oficiales.

### 6️⃣ Accesibilidad (A11y - Bloqueante)
- [ ] **Keyboard Ready:** Navegación completa por teclado y `focus-visible` impecable.
- [ ] **Semantic HTML:** Uso correcto de roles ARIA y etiquetas semánticas.
- [ ] **Reduced Motion:** Animaciones desactivadas automáticamente ante `prefers-reduced-motion`.

### 7️⃣ Performance de Renderizado
- [ ] **Animation Cost:** Uso de propiedades baratas (`transform`, `opacity`) para animaciones.
- [ ] **Re-render Optimization:** Uso de `useMemo` y `useCallback` en el Brain para evitar ciclos innecesarios.

### 8️⃣ Feedback & Loading Strategy
- [ ] **Momentum Sync:** Transiciones alineadas con los tokens de `MOTION`.
- [ ] **Placeholder Logic:** Implementación de Skeletons o Spinners oficiales según el tiempo de carga previsto.

### 9️⃣ Documentación & Auditoría
- [ ] **README Completo:** Incluye API, Matriz de decisión UX y contexto para IA.
- [ ] **Track Evidence:** El track contiene alcance, decisiones y evidencia
  suficiente para certificar el componente.
- 📌 **Si no está documentado -> No está certificado.**

### 🔍 10️⃣ Audit-ready (Certificación Visual)
- [ ] La evidencia visual de Playwright está revisada y vinculada al track.
- [ ] El código es limpio, tipado estrictamente y libre de comentarios "TODO".

---

## 🟥 Condiciones que INVALIDAN la certificación
- ❌ Uso de colores HEX o píxeles hardcodeados.
- ❌ Ausencia de escenarios de estrés en Playwright.
- ❌ Fallos en la suite de Vitest.
- ❌ Falta de soporte para Modo Claro (Light Mode).

---
*Gobernanza de Calidad Frontend - LoopDev Engineering Board*
