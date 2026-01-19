# LoopDev · Component Lifecycle Protocol (v2.0)

> **Propósito**: Definir el camino crítico desde la concepción de un componente hasta su certificación de grado industrial (🔵🔵).
> **Meta**: 95% de automatización en QA mediante el "Quality Shield".

---

## 🔄 El Ciclo de Certificación

### 🟢 FASE 1: Descubrimiento & Contrato
1. **Análisis de Requisitos:** Alineación con el Roadmap y Dominios de Negocio.
2. **Definición de Historias:** Creación de `userHistories.md`.
3. **El Contrato:** Creación de `types.ts` (Interfaces de Props y Estados).
4. **Validación:** Aprobación del Root Admin sobre el alcance definido.

### 🧪 FASE 2: Prototipado en Laboratorio (labdev)
1. **Implementación Raw:** Maquetación rápida para validar el Look & Feel.
2. **Story Sandbox:** Creación de `Example.tsx` para visualización dinámica.
3. **Refinamiento:** Ajustes estéticos basados en la maqueta de referencia.

### 🔵 FASE 3: Certificación Frontend (packages/ui)
1. **Promoción:** Migración del código al Design System oficial.
2. **Arquitectura:** Aplicación del patrón Brain/Body (`useX.ts` / `index.tsx`).
3. **[TEST] Unitario (Vitest):** Validación 1:1 de cada historia de usuario.
4. **[TEST] Accesibilidad (Axe-core):** Gate de 0 violaciones en Storybook.
5. **[TEST] Regresión Visual (Chromatic):** Aprobación de baseline visual en la nube.
6. **Auditoría UI:** Ejecución del `AUDIT_UI_PROMPT`.
**Hito: Front_Certified 🔵**

### 🛡️ FASE 4: Certificación Infraestructura (contracts/apps)
1. **Data Sync:** Sincronización de esquemas en `@loopdev/contracts`.
2. **[TEST] Seguridad (Snyk):** Escaneo de vulnerabilidades y secretos.
3. **[TEST] Funcional E2E (Playwright):** Validación del componente en el flujo real de la app.
4. **Auditoría Infra:** Ejecución del `AUDIT_INFRA_PROMPT`.
**Hito: Infra_Certified 🔵**

### 📜 FASE 5: Gobernanza & Release
1. **Versionado (Changesets):** Creación del acta de cambio para el release.
2. **Registro:** Inscripción en `COMPONENT_REGISTRY.json`.
3. **Audit Trail:** Registro en `ENGINEERING_LOG.md`.

---

## 📊 Matriz de Jueces Automáticos

| Fase | Herramienta | Validación | Gate |
| :--- | :--- | :--- | :--- |
| **F3.3** | **Vitest** | Lógica y Props | Bloqueante |
| **F3.4** | **Axe-core** | Accesibilidad (WCAG) | Bloqueante |
| **F3.5** | **Chromatic** | Píxeles y Diseño | Review Humano |
| **F4.2** | **Snyk** | Seguridad y Deps | Bloqueante |
| **F4.3** | **Playwright** | Flujo de Negocio | Bloqueante |

---
*Gobernanza de Ingeniería - LoopDev Board*
