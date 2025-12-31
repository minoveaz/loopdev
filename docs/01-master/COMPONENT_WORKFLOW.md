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
  - **Estrés:** Puntos de quiebre (Texto masivo, contenedores estrechos).
  - **Multitenancy:** Adaptabilidad a 100+ clientes (Tokens dinámicos).

- **Blueprint Validated:** Diseño aprobado visualmente en `mockv2`.
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
- **Checkpoint Visual:** ¿El componente respeta los 4 pilares del Bloque 0?

---

## 🗄️ Fase 4: Persistencia & Certificación (DoD)
- [ ] **Registry Sync:** Registro en `COMPONENT_REGISTRY.json`.
- [ ] **Seal Applied:** Sello `Loopdev.lab` en Storybook arriba a la izquierda.
- [ ] **Audit Log Updated:** Registro del hito en `ENGINEERING_LOG.md`.
- [ ] **Zero Errors:** `tsc` y `vitest` en 100% verde.

---
*Protocolo de Gestión E2E - LoopDev Engineering Board*
