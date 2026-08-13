# Orchestrator Commands — LoopDev Auto-Pilot v1.0

Este documento define los comandos maestros que disparan flujos de trabajo automatizados. Al recibir un comando, la IA debe ejecutar el bloque correspondiente de forma autónoma, deteniéndose solo en los **Sync Points** definidos.

---

## 🚀 Comando: `Iniciar Ciclo: [Nombre del Componente]`

Este comando inicia el ciclo de vida completo (Full-Stack) de una pieza del sistema.

### 🛑 BLOQUE 0: Pre-Flight (Descubrimiento & Contrato)
**Role:** `INFRA_IMPLEMENTATION_SKILL`
1.  **Evaluación:** Determinar si el componente requiere persistencia o comunicación con API.
2.  **Descubrimiento:** Ejecutar Plantilla 1 de `OPERATIONAL_AI_TEMPLATES.md`.
3.  **Contrato v0:** Definir esquemas Zod/TS y aislamiento de `tenant_id`.
4.  **Trazabilidad:** Registrar los 4 pilares del Bloque 0, decisiones y
    evidencia en el track correspondiente.
5.  **Log:** Crear ticket inicial en `ENGINEERING_LOG.md`.

👉 **SYNC POINT 1:** Presentar Contrato y User Stories. Esperar "OK".

### 🛠️ BLOQUE 1: Construction (Frontend Engineering)
**Role:** `FRONT_ENGINEERING_PROMPT`
1.  **Arquitectura:** Implementar Brain (`useX.ts`) y Body (`index.tsx`) siguiendo el contrato v0.
2.  **Hardening:** Crear suite de Vitest `.test.tsx` vinculada 1:1 a las Historias de Usuario.
3.  **Visual Docs:** Crear `.stories.tsx` incluyendo:
    - Casos de uso estándar.
    - **Regla de Espejo:** Casos de estrés (`StressContent`, `StressLayout`).
    - Sello `Loopdev.lab` en estado `beta` o `experimental`.

👉 **SYNC POINT 2:** Presentar reporte de tests y link de Storybook. Esperar "Certificado".

### 🔵 BLOQUE 2: Certification (Final DoD)
**Role:** `INFRA_IMPLEMENTATION_SKILL` + frontend skills
1.  **Auditoría:** Ejecutar la skill de QA y las validaciones del track.
2.  **Registry:** Registrar en `docs/registries/frontend-components.json`.
3.  **Log Final:** Cerrar el hito con timestamp en `ENGINEERING_LOG.md`.
4.  **Sello:** Actualizar el sello a `certified` en Storybook.

---

## 📋 Reglas del Orquestador
- **Autonomía:** No pedir confirmación por cada archivo creado. Ejecutar el bloque completo.
- **Contexto:** Mantener siempre la consciencia del `tenant_id` y el aislamiento de datos.
- **Limpieza:** Al terminar un bloque, realizar una limpieza de código (Hardcoding audit).

---
*Gobernanza Operativa - LoopDev Engineering Board*
