# 🧠 Inspector System Architecture — LoopDev OS (v1.0)

> **Estado:** Activo / Autoridad Técnica v1.0
> **Tipo:** Patrón de UI / Sistema de Consecuencias
> **Alcance:** Global (`@loopdev/ui`)
> **Objetivo:** Estandarizar cómo el sistema comunica impacto, cambios y gobernanza.

---

## 0️⃣ Concepto: Intención vs. Consecuencia

En LoopDev, separamos la acción de la ejecución:
1.  **Toolbar (Intención):** "Quiero publicar esta marca".
2.  **Inspector (Consecuencia):** "Si publicas, afectarás a 12 módulos. ¿Confirmas?".

El `UnifiedInspector` es el vehículo para esta conversación.

---

## 1️⃣ Arquitectura del Componente

El Inspector no es un componente monolítico; es una composición de 3 capas:

### 1.1 Shell Universal (`UnifiedInspector`)
Contenedor agnóstico que gestiona:
- **Tabs Estándar:** Context, Impact, Diff, Governance.
- **Header:** Título de entidad y badges de estado (`LOCKED`, `DRAFT`).
- **Footer:** Zona de confirmación de gobernanza (solo en flujos de aprobación).

### 1.2 Renderer Específico (`BrandInspector`)
Cada módulo inyecta su propio cerebro. Decide qué mostrar en cada pestaña basándose en el tipo de entidad (`brand.token` vs `crm.lead`).

### 1.3 Bloques Reutilizables (The LEGO Blocks)
Para evitar deuda técnica, el contenido se construye con bloques estandarizados del Design System:

| Bloque | Propósito | Ejemplo de Uso |
| :--- | :--- | :--- |
| **`ContextBlock`** | Metadatos clave-valor limpios. | Autor, Versión, ID. |
| **`ImpactBlock`** | Alerta visual de radio de explosión. | "High Impact: 12 systems affected". |
| **`DiffBlock`** | Visualización de cambios (+/-). | "Added: Primary Color". |
| **`GovernanceBlock`** | Cadena de custodia y aprobación. | "Step 1: Approved by You". |

---

## 2️⃣ El Contrato de Datos (`InspectorContext`)

El Inspector es puramente derivado. Se hidrata desde un objeto de contexto inmutable:

```ts
interface InspectorContext {
  scope: 'module' | 'entity';
  mode: 'read' | 'draft' | 'locked';
  intent: 'inspect' | 'impact' | 'approve';
  entity: {
    type: string;
    id: string;
    name: string;
  };
  permissions: {
    canEdit: boolean;
    canApprove: boolean;
  };
}
```

---

## 3️⃣ Flujos Canónicos

### Escenario A: Análisis de Impacto
1.  Usuario hace clic en **"Impact"** en la Toolbar.
2.  Toolbar llama a `setInspectorOpen(true)` y `setActiveTab('impact')`.
3.  Inspector renderiza `ImpactBlock` con severidad calculada.

### Escenario B: Aprobación de Cambios
1.  Usuario hace clic en **"Request Approval"**.
2.  Contexto cambia a `intent: 'request-approval'`.
3.  Inspector muestra `GovernanceBlock` y habilita el botón de confirmación en el footer.

---
*Sistema de Inspector - LoopDev Engineering Board*
