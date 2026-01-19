# Component Lifecycle & Agile Workflow v1.5

## Propósito
Este documento define el proceso de ingeniería E2E. Implementamos la **colocación de requerimientos** mediante archivos `userHistories.md` y garantizamos la **integridad visual** mediante el cumplimiento del Bloque 0.

---

## 🏗️ Fase 1: Ideación & Contrato (DoR)
- **User Histories:** Creación de `userHistories.md` en la carpeta del componente.
  
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

- **Blueprint Validated:** Diseño aprobado visualmente en `labdev`.
- **Session Entry:** Registro de inicio de tarea en `ENGINEERING_LOG.md`.

---

## 🛠️ Fase 2: Desarrollo & Hardening
1. **Sprint 1 (Brain/Body):** Implementación del componente.
2. **Sprint 2 (Testing):** Creación de tests en Vitest que validen **cada historia** (incluyendo estrés).
3. **Sprint 3 (Docs):** Historias de Storybook que demuestren visualmente el cumplimiento.
   - **Regla de Espejo:** Toda historia de estrés debe tener su correspondiente historia `Stress` en Storybook.

---

## 🔍 Fase 3: Auditoría Externa
- **Action:** El Auditor independiente valida el código contra el `userHistories.md`.
- **Tools:** Uso de `AUDIT_UI_PROMPT.md` para frontend o `AUDIT_INFRA_PROMPT.md` para plataforma.
- **Checkpoint Visual:** ¿El componente respeta los 4 pilares del Bloque 0?

---

## 🗄️ Fase 4: Persistencia & Certificación (DoD)

> ⚠️ **REGLA DE ORO:** El sello `LOOPDEV.LAB` (`CertificationStamp`) y el `InfraStamp` solo pueden ser inyectados en el código de producción **tras el cierre exitoso de la Fase 3 (Auditoría)** y la corrección de todos sus hallazgos. Cualquier componente con sellos pero sin auditoría registrada será rechazado automáticamente.

- [ ] **Registry Sync:** Registro en `COMPONENT_REGISTRY.json`.
- [ ] **Seal Applied:** Sello `Loopdev.lab` en Storybook arriba a la izquierda.
- [ ] **Audit Log Updated:** Registro del hito en `ENGINEERING_LOG.md`.
- [ ] **Zero Errors:** `tsc` y `vitest` en 100% verde.

---
*Protocolo de Gestión E2E - LoopDev Engineering Board*