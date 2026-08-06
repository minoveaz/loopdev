# User Histories: Brand Hub Operation (v2.0)

**Strategic Goal:** "Operability through Structured Meaning & Contextual Consequence"

## 🧬 Bloque 0: ADN de Composición
1. **Hierarchical Flow:** El usuario nunca debe dudar de si está viendo el módulo o una marca específica.
2. **State Reactivity:** El Inspector es el espejo del trabajo realizado en el Canvas.

## 📚 Historias de Usuario

### [A] Navegación y Descubrimiento
1. **[NAVEGACIÓN] Transición de Niveles**
   - **HU:** Como usuario, quiero entrar en `/brands` y seleccionar una marca, viendo cómo mi entorno (Sidebar/Toolbar) cambia instantáneamente al contexto de esa marca.
2. **[EXPLORACIÓN] Sidebar Search**
   - **HU:** Como usuario, quiero filtrar la lista de marcas escribiendo en el sidebar para encontrar rápidamente un item específico.
3. **[APRENDIZAJE] Contextual Flyout**
   - **HU:** Como usuario novel, al navegar por "Visual System", quiero ver una guía rápida en el Flyout que me explique los conceptos antes de editar.

### [B] Intención Operativa (Toolbar)
4. **[INTENCIÓN] Read-Only Safety**
   - **HU:** Como usuario en una marca publicada, quiero ver claramente "Create Draft" como acción principal, entendiendo que no puedo romper nada accidentalmente.
5. **[INTENCIÓN] Draft Efficiency**
   - **HU:** Como editor, quiero tener botones accesibles para "Save" y "Request Approval" en la barra superior.
6. **[INTENCIÓN] Impact Awareness**
   - **HU:** Como usuario, quiero un botón de "Impact" que me lleve directamente al análisis de consecuencias antes de hacer cambios.

### [C] Consecuencia y Gobernanza (Inspector)
7. **[INSPECT] Entity Context**
   - **HU:** Como usuario, al seleccionar un objeto o abrir el panel de info, quiero ver sus metadatos (Autor, Versión) en un formato estandarizado.
8. **[IMPACT] Blast Radius**
   - **HU:** Como arquitecto, quiero ver una tarjeta de alerta (Amarilla/Roja) indicando cuántos módulos se verán afectados si modifico esta marca.
9. **[DIFF] Visual Comparison**
   - **HU:** Como revisor, quiero ver un bloque de "Diff" que me muestre qué se añadió (+) y qué se eliminó (-) en este borrador.
10. **[GOVERNANCE] Approval Chain**
    - **HU:** Como manager, quiero ver el estado de la cadena de aprobación (Quién aprobó, Quién falta) en el panel de gobernanza.

### [D] Resiliencia Técnica
11. **[ESTADO] Persistencia**
    - **HU:** Si refresco la página con el Inspector abierto en la pestaña "Impact", quiero que el sistema restaure ese estado exacto.

## 📐 Criterios de Aceptación Técnicos
- [x] Implementar `ModuleSidebar` con soporte condicional.
- [x] Implementar `BrandToolbar` orquestador (State Machine).
- [x] Implementar `UnifiedInspector` + `InspectorBlocks` (Context, Impact, Diff).
- [ ] Test E2E cubriendo el flujo: Open Brand -> Create Draft -> Check Impact.