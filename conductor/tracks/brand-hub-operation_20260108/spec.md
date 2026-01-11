# Especificación: Brand Hub Operativo (v2.0)

## 1. Propósito
Implementar la navegación y el layout definitivo del Brand Hub siguiendo el contrato de rutas v1.0. El sistema gestiona dos modos operativos: **Module Mode** (Contexto Global) e **Identity Mode** (Contexto de Marca), orquestados por un `ModuleWorkspace` que integra navegación, intención y consecuencia.

## 2. Estructura de Rutas y Mapping
- **Global Anchor:** `/marketing-studio/brand-hub/overview`.
- **Foco:** `SuiteSidebar` colapsa automáticamente a modo **Rail** en cualquier ruta bajo `/brand-hub`.

## 3. Arquitectura de Paneles (The 4-Pane System)

### 3.1 ModuleSidebar (Navegación & Ontología)
Este componente muta según el modo:
- **Module Mode:** Lista virtualizada de marcas con búsqueda y badging de estado (`{ DRAFT }`).
- **Brand Mode:** Árbol de navegación semántico (Identity, Visual, Rules, Governance).

### 3.2 SidebarFlyout (Significado)
- **Rol:** Panel explicativo "Learn & Navigate".
- **Contenido:** Guías semánticas que explican *qué* es la sección actual antes de entrar en detalle.

### 3.3 ModuleToolbar (Intención)
El puente entre intención y decisión. Altura fija industrial (44px).

**Máquina de Estados:**
1.  **Directory Mode:** Filtros globales + "Create Brand".
2.  **Read-Only Mode:** Acciones de análisis ("Compare", "Impact") + "Create Draft".
3.  **Draft Mode:** Acciones de trabajo ("Save", "Discard") + "Request Approval".
4.  **Governance:** Acciones de decisión ("Approve", "Reject") -> Disparan Inspector.

### 3.4 ModuleInspector (Consecuencia - NUEVO)
El cerebro de consecuencias. Responde a "¿Qué implica esto?".

**Arquitectura:**
- **Shell:** `UnifiedInspector` (gestiona Tabs, Header, Close).
- **Renderer:** `BrandInspector` (inyecta contenido específico del módulo).
- **Blocks (DS):** Componentes UI estandarizados en `@loopdev/ui`:
    - `ContextBlock`: Metadatos clave-valor.
    - `ImpactBlock`: Alerta visual de radio de explosión (Blast Radius).
    - `DiffBlock`: Visualización simplificada de cambios (+/-).
    - `GovernanceBlock`: Cadena de custodia y aprobación.

**Contrato de Datos:**
Todo el inspector se hidrata desde un objeto `InspectorContext`:
```ts
{
  intent: 'inspect' | 'impact' | 'compare';
  mode: 'read' | 'draft' | 'locked';
  entity: { type: string; id: string; ... };
  permissions: { canEdit: boolean; ... };
}
```

## 4. Reglas Técnicas de Estado (Zero Bugs)
1. **URL-First State:** El `brandId` y la `view` se derivan siempre de la ruta.
2. **State Machine de Paneles:** Definición estricta de estados para Sidebar, Flyout e Inspector.
3. **Selection Sync:** Si se selecciona un item en el Canvas (o Toolbar), el Inspector se abre automáticamente en la tab relevante.
4. **No Orphan Panels:** Al cambiar de marca, se resetea el `entityRef` del Inspector.

## 5. Criterios de Aceptación (Checklist de Ingeniería)
- [x] Transición suave Module Mode <-> Brand Mode.
- [x] Toolbar muestra acciones contextuales correctas (Draft vs Published).
- [x] Inspector utiliza bloques reutilizables del Design System.
- [x] Alturas sincronizadas (Header 56px, Toolbar 44px).
- [x] 100% Compliance con ADN v3.9 (Bordes, Sombras, Tipografía).