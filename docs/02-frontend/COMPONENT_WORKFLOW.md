# Component Lifecycle & Agile Workflow v1.5

## Propósito
Este documento define el proceso de ingeniería E2E. Los requisitos y el estado de
ejecución se gobiernan mediante los tracks, y la integridad visual se garantiza
mediante el cumplimiento del Bloque 0.

---

## 🏗️ Fase 1: Ideación & Contrato (DoR)
- **Track:** Crear o actualizar el track correspondiente con el alcance,
  decisiones, evidencia y fase de ejecución.
  
  ### 🧬 Bloque 0: ADN de Composición (OBLIGATORIO)
  *Todo componente de LoopDev debe integrar estos 4 pilares:*
  1. **Trinidad Cromática:** Azul (Estructura), Amarillo (Actividad), Morado (IA/Innovación).
  2. **Sintaxis `{ }`:** Uso de llaves como operadores o contenedores.
  3. **Technical Canvas (Superficies):** Evaluar aplicación de grilla (Líneas para Estructura / Puntos para IA).
  4. **Surface Soul:** Estética de cristal (Backdrop blur) y bordes técnicos.

- **Fases Restantes:**
  - **Básicas:** El "qué" y "para qué".
  - **Estrés:** Puntos de quiebre técnicos.
    - **Contenido masivo:** Textos largos y traducciones.
    - **Contenedores estrechos:** Adaptabilidad visual.
    - **Contraste Extremo (NUEVO):** Validación de legibilidad sobre el fondo más oscuro y más claro permitido.
  - **Multitenancy:** Adaptabilidad a 100+ clientes (Tokens dinámicos).

- **Blueprint Validated:** Diseño aprobado visualmente en el entorno de
  validación del proyecto.
- **Session Entry:** Registro de inicio de tarea en `ENGINEERING_LOG.md`.

---

### 🟢 Fase 2: Blindaje y Calidad (The Shield)
1. **Unit Testing:** Cobertura de todos los estados en Vitest.
2. **A11y Audit:** Pasar Axe-core en Storybook (0 violaciones).
3. **Visual Review:** Ejecutar las pruebas visuales de Playwright y revisar
   explícitamente cualquier diff de snapshots.
4. **Integration Test:** Smoke test del componente en su app real mediante Playwright.

### 🔵 Fase 3: Promoción y Registro
1. **Pull Request:** Debe incluir el reporte de QA automático en verde.
2. **Changeset:** Crear el archivo de changeset para el versionado.
3. **Registry:** Actualizar `docs/registries/frontend-components.json` con el sello de certificación.

---

## 🗄️ Fase 4: Persistencia & Certificación (DoD)

> ⚠️ **REGLA DE ORO:** El sello `LOOPDEV.LAB` (`CertificationStamp`) y el `InfraStamp` solo pueden ser inyectados en el código de producción **tras el cierre exitoso de la Fase 3 (Auditoría)** y la corrección de todos sus hallazgos. Cualquier componente con sellos pero sin auditoría registrada será rechazado automáticamente.

- [ ] **Registry Sync:** Registro en `docs/registries/frontend-components.json`.
- [ ] **Seal Applied:** Sello `Loopdev.lab` en Storybook arriba a la izquierda.
- [ ] **Audit Log Updated:** Registro del hito en `ENGINEERING_LOG.md`.
- [ ] **Zero Errors:** `tsc` y `vitest` en 100% verde.

---
*Protocolo de Gestión E2E - LoopDev Engineering Board*