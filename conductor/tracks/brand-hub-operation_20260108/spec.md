# Especificación: Brand Hub Operativo (v1.6)

## 1. Propósito
Implementar la navegación y el layout definitivo del Brand Hub siguiendo el contrato de rutas v1.0. El sistema debe gestionar dos modos operativos: **Module Mode** (Contexto Global) e **Identity Mode** (Contexto de Marca), garantizando un foco operativo absoluto mediante una máquina de estados sincronizada con la URL.

## 2. Estructura de Rutas y Mapping

### [A] Chasis Compartido: ModuleWorkspace
- **Global Anchor:** `/marketing-studio/brand-hub/overview`.
- **Foco:** `SuiteSidebar` colapsa automáticamente a modo **Rail** en cualquier ruta bajo `/brand-hub`.

### [B] Rutas de Módulo (Module Mode)
1. `/marketing-studio/brand-hub/overview`: Dashboard operativo global.
2. `/marketing-studio/brand-hub/brands`: Directorio maestro de marcas.
3. `/marketing-studio/brand-hub/glossary`: Definiciones técnicas.

### [C] Rutas de Marca (Brand Mode)
> Prefijo: `/marketing-studio/brand-hub/brands/:brandId`
- `/overview`: Estatus del oráculo y alertas.
- `/identity`: Narrativa y tono de voz.
- `/visual/colors`: Definición de tokens cromáticos.
- `/visual/typography`: Roles tipográficos.
- `/visual/logos`: Referencias de activos de identidad.
- `/rules`: Motor de restricciones (Visual/Verbal/Contextual/Structural).
- `/versions`: Historial inmutable.
- `/versions/compare`: Comparativa entre snapshots.
- `/dependencies`: Grafo de impacto real (Consumers).
- `/governance/audit`: Registro histórico de decisiones.
- `/publish`: Preflight de gobernanza y publicación.

## 3. Mapping de Paneles (Regla de Oro)

### 3.1 Sidebar & Flyout (Estructura y Significado)
- **Sidebar Modes:** `module` | `brand` (basado en la presencia de `:brandId`).
- **Flyout Modes:**
    - **Learn Mode (Default):** Qué es esta sección, reglas, ejemplos.
    - **Navigate Mode:** Sub-rutas + anchors internos.
    - **Quick Actions:** Atajos seguros (ej: "Ver glosario").
- **Regla:** El Flyout NO muestra gobernanza ni impacto crítico.

### 3.2 Inspector (Consecuencia)
- **Tabs Mínimas:**
    - `Context`: Metadata del objeto seleccionado.
    - `Impact`: Dependencias y superficies afectadas.
    - `Diff`: Cambios vs versión publicada.
    - `Governance`: Aprobaciones, locks y justificaciones.

## 4. Reglas Técnicas de Estado (Zero Bugs)
1. **URL-First State:** El `brandId` y la `view` se derivan siempre de la ruta. La UI no inventa contexto.
2. **State Machine de Paneles:** Definición estricta de estados para Sidebar, Flyout e Inspector.
3. **No Orphan Panels:** Al cambiar de marca, se resetea el `entityRef` del Inspector y se recalcula el Flyout.

## 5. Criterios de Aceptación
- [ ] Implementar la transición suave entre Module Mode y Brand Mode.
- [ ] La selección en el Canvas (Token/Rule) debe reflejar el contexto en el Inspector automáticamente.
- [ ] Las versiones publicadas (Published) deben activar un modo `read-only` en el Canvas.
- [ ] 100% ADN v3.9 (Bordes 0.5px, Grilla 40px).
