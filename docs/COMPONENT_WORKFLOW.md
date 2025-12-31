# Component Lifecycle & Agile Workflow v1.2

## Propósito
Este documento define el proceso de ingeniería para la creación de componentes en el ecosistema LoopDev. Tratamos cada componente como un micro-producto con ciclo de vida propio, asegurando calidad industrial, trazabilidad y **reutilización extrema para 100+ clientes**.

---

## 🏗️ 1. Fase de Preparación: Definition of Readiness (DoR)
*Un componente solo entra en desarrollo si tiene su arquitectura de historias definida:*

### A. Historias de Usuario Básicas (Obligatorias)
Definen la esencia del componente para el usuario final.
- **Story Core:** "Como [Rol], quiero [Acción] para [Beneficio]".
- **Interacción:** "Como [Rol], quiero recibir feedback visual al interactuar con el componente".

### B. Historias de Estrés (Resiliencia)
Garantizan que el componente no se rompa bajo condiciones extremas.
- **Contenido Extremo:** ¿Cómo se comporta con textos de 500 caracteres o idiomas con palabras largas?
- **Frecuencia:** ¿Qué pasa si el usuario hace click 10 veces por segundo? (Debounce/Loading).
- **Contenedor:** ¿Qué pasa si el padre tiene 50px de ancho? (Truncado/Scroll).

### C. Historias de Multitenancy (Escala SaaS)
Garantizan que el componente sea "Headless" visualmente.
- **Contraste Dinámico:** El componente debe ser legible si el cliente elige colores neón o ultra-oscuros.
- **Densidad Variable:** Debe soportar modos `compact` (CRM) y `relaxed` (Marketing).
- **Tiering:** Preparado para ocultar/mostrar sub-capacidades según el plan del cliente.

---

## 🛠️ 2. Fase de Desarrollo (Sprints Atómicos)
1. **Sprint 1: Brain:** Lógica de estados, validación de stress-cases y middleware de interceptación.
2. **Sprint 2: Body:** Vista pura reactiva a tokens `--comp-*`.
3. **Sprint 3: Quality:** Tests unitarios cubriendo casos básicos y casos de estrés.
4. **Sprint 4: Documentation:** Historias en Storybook que demuestren explícitamente los escenarios de estrés y marca.

---

## 🗄️ 3. Fase de Registro: Data Persistence (SaaS Registry)
- [ ] **DB Entry:** Registro en la colección `component_registry`.
- [ ] **Capabilities Mapping:** Definición de qué "poderes" tiene el componente en la DB.

---

## ✅ 4. Fase de Cierre: Definition of Done (DoD)
- [ ] **Stress Tested:** Validado contra textos largos y contenedores estrechos.
- [ ] **Theme Reactive:** 100% funcional con cualquier combinación de colores de la DB.
- [ ] **Vitest Suite:** Cobertura de casos de borde (Edge Cases).
- [ ] **A11y:** Navegación por teclado y lectores de pantalla.
- [ ] **Audit Log Updated:** Registro de la intervención en `ENGINEERING_LOG.md`.

---

## 📝 Plantilla de "Ticket" de Componente (V3)
```markdown
### 🎫 Component: [Nombre]
- **Story Core:** [Descripción básica]
- **Stress Scenario:** [Ej: Texto muy largo en alemán]
- **Tenant Variant:** [Ej: Color de marca con bajo contraste]

#### Checklist de Calidad & Escala:
- [ ] Brain/Body separation
- [ ] Stress-test Cases (Vitest)
- [ ] Multitenancy Token Awareness
- [ ] Registered in Firestore Registry
- [ ] Stories created for ALL scenarios
```

---
*Protocolo de Gestión Ágil - LoopDev Engineering*
