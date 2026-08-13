# UI Complex Readiness Checklist v1.0

## 🎯 Propósito
Evitar la acumulación de deuda técnica invisible al construir **organismos o patrones complejos** (DataTable, Kanban, Editor, etc.). Esta checklist garantiza que la UI nace sobre un contrato sólido y un entendimiento claro del backend.

---

## 🧠 Regla de Oro
> ❌ **Un solo "NO" en los puntos críticos = El desarrollo NO empieza.** 
> Se debe volver a la fase de Descubrimiento o Contrato (ver `OPERATIONAL_AI_TEMPLATES.md`).

---

## 1️⃣ Intención y Alcance (Bloqueante)
- [ ] **Propósito en 1 frase:** ¿Puedo explicar qué hace sin usar "y también"?
- [ ] **Módulos destino:** ¿Sé dónde vivirá (Brand Hub, CRM, etc.)?
- [ ] **Exclusiones claras:** ¿Sé qué **NO** va a hacer este componente en esta versión?

## 2️⃣ Arquitectura de Estados (CRÍTICO)
No basta con `loading/success`. ¿He definido la UI para:
- [ ] **Empty Real:** No hay datos en la cuenta.
- [ ] **Empty Filtrado:** La búsqueda/filtros no coinciden.
- [ ] **Error de Permisos:** El usuario no tiene rol suficiente.
- [ ] **Error de Sistema:** El API falló o hay timeout.
- [ ] **Estado Parcial:** Datos cargados pero con advertencias (ej. sync pendiente).

## 3️⃣ Validación de Infraestructura (Bloqueante)
- [ ] **Descubrimiento Realizado:** Se ha ejecutado la Plantilla 1 de `OPERATIONAL_AI_TEMPLATES.md`.
- [ ] **Preguntas Abiertas Cerradas:** Entiendo límites de paginación, filtros y ordenación del backend.
- [ ] **Cero Suposiciones:** No estoy asumiendo lógica de servidor desde el frontend.

## 4️⃣ Contrato y Consumo (CRÍTICO)
- [ ] **Contrato v0 Disponible:** Existe un esquema (Zod/TS) definido en `03-platform`.
- [ ] **Aislamiento Multi-tenant:** El contrato incluye `organization_id` y
  `scope`; `tenant_id` solo aparece cuando se documenta compatibilidad legacy.
- [ ] **Pattern de Consumo:** El componente consume datos vía hooks/props (Prohibido `fetch` directo).

## 5️⃣ Impacto en el Sistema (Gobernanza)
- [ ] **Phase Match:** Cumple con las `Phase Dependency Rules`.
- [ ] **Reutilización:** Usa átomos certificados (Button, Badge, Skeleton) en lugar de HTML nuevo.
- [ ] **Stress Plan:** Definidos casos de datos masivos y textos largos.

---

## 🏁 Resultado de la Evaluación

### ✅ READY
Si todos los puntos están en verde: Procede a la implementación usando el `FRONT_ENGINEERING_PROMPT`.

### ⛔ NOT READY
Si hay rojos: Vuelve al paso de **Descubrimiento Infra** o **Contrato Mínimo**.

---
*Gobernanza de Frontend - LoopDev Engineering Board*
