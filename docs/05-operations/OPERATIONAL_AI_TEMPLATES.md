# Operational AI Templates v1.0

Este documento define **las 3 plantillas oficiales** para orquestar el desarrollo con IA en LoopDev. Estas plantillas garantizan que la velocidad no comprometa la integridad de la arquitectura SaaS.

---

## 🟧 PLANTILLA 1 — Descubrimiento Guiado (Infra · Sin código)

**Cuándo usarla:**
* Tienes clara la funcionalidad (ej. tabla, kanban, editor).
* Desconoces los impactos reales de backend / infra.
* NO quieres implementar nada todavía.

**Prompt (Humano → IA):**
```text
Usa el INFRA_ENGINEERING_PROMPT (Platform Authority).

NO quiero que implementes código. 

Quiero realizar un análisis de descubrimiento para entender qué consideraciones de backend e infraestructura debo tener en cuenta antes de construir la siguiente pieza de UI:

[Describir aquí: Intención / Componente / Organismo]

Contexto LoopDev:
- Producto: SaaS multi-tenant.
- API-first & SPA Architecture.
- Yo tengo más contexto de frontend que de backend.

Necesito que identifiques:
- Capacidades backend que impactan directamente a la UI.
- Decisiones que NO debo tomar desde frontend.
- Estados reales que pueden aparecer (más allá de loading/success).
- Riesgos comunes de seguridad y aislamiento si el backend no está bien definido.
- Patrones recomendados (sin implementar).

Entrega esperada:
- Lista estructurada de consideraciones técnicas.
- Advertencias de "Layout Blindness" o "Data Leaks".
- Conceptos clave que debo respetar en UI.
```

---

## 🟧 PLANTILLA 2 — Contrato Mínimo (Infra · v0)

**Cuándo usarla:**
* Ya entiendes el problema gracias al Descubrimiento.
* Necesitas un **shape estable** (Contrato) para avanzar en la UI.
* NO quieres implementar el backend completo aún.

**Prompt (Humano → IA):**
```text
Usa el INFRA_ENGINEERING_PROMPT (Platform Authority).

Basándote en el análisis de descubrimiento previo, quiero definir un CONTRATO MÍNIMO v0 que soporte la siguiente pieza:

[Describir aquí: Intención / Componente / Organismo]

Contexto LoopDev:
- No quiero implementación lógica ni detalles de DB (SQL).
- Quiero solo contratos estables, claros y tipados.
- Multi-tenant obligatorio (tenant_id enforcement).

Entrega esperada:
- Esquema de datos (Request/Response) en Zod o TypeScript.
- Esquema de paginación, filtros o estados (si aplica).
- Esquema de errores semánticos estandarizados.
- Notas de permisos y capacidades (RBAC).
```

---

## 🟦 PLANTILLA 3 — Implementación de Ingeniería Frontend

**Cuándo usarla:**
* Ya existe un contrato mínimo definido.
* Quieres construir UI con seguridad industrial.
* NO quieres inventar el backend desde el frontend.

**Prompt (Humano → IA):**
```text
Usa el FRONT_ENGINEERING_PROMPT (Complete Frontend Authority).

Quiero implementar la siguiente pieza de UI:

[Describir aquí: Intención / Componente / Organismo]

Contexto LoopDev:
- Fase correspondiente: [phase-X].
- Consume un contrato definido previamente (Zod/TS).
- Respeta la Arquitectura Trinity (Brain/Body, Test, Dynamic Theming).
- Respeta el Bloque 0: ADN de Composición (Azul/Amarillo/Morado, { }, Grillas, Cristal).

Entrega esperada:
- Estructura completa (Brain, Body, Types, Fixtures, README).
- Archivo userHistories.md local con casos de estrés.
- Suite de tests unitarios (Vitest) en verde.
- Historias de Storybook (incluyendo variantes 'Stress' y Sello de Certificación).
- *Nota: Si es producción, no incluir Example.tsx.*
```

---

## 🧠 Regla de Oro (No Negociable)

> **Nunca saltes directamente a la implementación UI cuando no dominas el impacto en el backend.**

El orden **siempre** es:
1. **Descubrimiento** (Entender el flujo de datos).
2. **Contrato** (Definir el cableado).
3. **Implementación** (Construir la experiencia).

---
*Gobernanza Operativa - LoopDev Engineering Board*
