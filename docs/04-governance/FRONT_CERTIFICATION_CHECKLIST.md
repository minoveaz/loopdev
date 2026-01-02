# Front Certification Checklist — LoopDev UI/UX

## 🎯 Propósito
Esta checklist define los criterios de certificación para cualquier componente, organismo o layout del frontend de LoopDev. Un sistema certificado es visualmente impecable, técnicamente indestructible, accesible y plenamente reactivo a los datos de marca. Esta certificación otorga el derecho a lucir el sello visual `Loopdev.lab`.

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
- [ ] **Axe Pass:** El reporte de accesibilidad en Storybook tiene 0 violaciones.
- [ ] **Chromatic Sync:** El baseline visual ha sido aceptado y no hay regresiones de píxeles.
- [ ] **Playwright Flow:** El componente ha superado el Smoke Test funcional en la app.
- [ ] **QA Matrix:** El componente `QualityShield` es visible y está en verde en Storybook.
- [ ] **Changeset:** Se ha creado el archivo de versión para el monorepo.

### 2️⃣ Arquitectura & ADN Visual
- [ ] **Brain/Body Split:** Lógica aislada en hooks, vista pura en el componente.
- [ ] **Zero Hardcoding:** No hay valores HEX ni escalas arbitrarias.
- [ ] **Dynamic Theming:** Reacciona correctamente al `DynamicThemeProvider`.
- [ ] **Modo Oscuro:** 100% legible y funcional.

### 3️⃣ Resiliencia & Estrés (Storybook)
- [ ] **Extreme Content:** Probado con textos masivos y traducciones largas sin romper el layout.
- [ ] **Layout Pressure:** Probado en contenedores estrechos (w-64) y fluidos.
- [ ] **Mirror Stories:** Cada caso de estrés en `userHistories.md` tiene su historia `Stress` en Storybook.

### 4️⃣ Calidad Técnica (Vitest)
- [ ] **Trazabilidad 1:1:** Existe un test unitario por cada historia de usuario definida.
- [ ] **Nomenclatura:** Los bloques `it()` referencian el ID de la historia (ej: `Story 1`).
- [ ] **Hardening:** Suite de pruebas cubre estados de carga, error y deshabilitado.

### 5️⃣ SaaS & Dynamic Theming (Data Ready)
- [ ] **Theme Awareness:** El componente reacciona instantáneamente al `DynamicThemeProvider`.
- [ ] **Registry Sync:** Registrado en `COMPONENT_REGISTRY.json` con sus capacidades.
- [ ] **Tenant Isolation:** No depende de contextos globales ocultos fuera de los proveedores oficiales.

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
- [ ] **User Histories:** Archivo `userHistories.md` finalizado y firmado.
- 📌 **Si no está documentado -> No está certificado.**

### 🔍 10️⃣ Audit-ready (Certificación Visual)
- [ ] El sello `Loopdev.lab` está visible en la esquina superior izquierda de Storybook.
- [ ] El código es limpio, tipado estrictamente y libre de comentarios "TODO".

---

## 🟥 Condiciones que INVALIDAN la certificación
- ❌ Uso de colores HEX o píxeles hardcodeados.
- ❌ Ausencia de historias de estrés en Storybook.
- ❌ Fallos en la suite de Vitest.
- ❌ Falta de soporte para Modo Claro (Light Mode).

---
*Gobernanza de Calidad Frontend - LoopDev Engineering Board*
