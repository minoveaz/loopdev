# User Histories: Brand Hub Operation (v1.6)

**Strategic Goal:** "Operability through Structured Meaning & Contextual Consequence"

## 🧬 Bloque 0: ADN de Composición
1. **Hierarchical Flow:** El usuario nunca debe dudar de si está viendo el módulo o una marca específica.
2. **State Reactivity:** El Inspector es el espejo del trabajo realizado en el Canvas.

## 📚 Historias de Usuario

### 1. [NAVEGACIÓN] Transición de Niveles
- **HU:** Como usuario, quiero entrar en `/brand-hub/brands` para elegir mi marca, y que al seleccionarla, mi Sidebar cambie automáticamente al "Brand Mode" con las opciones de Identidad y Reglas.

### 2. [APRENDIZAJE] El Sidebar Flyout
- **HU:** Como usuario novel, al hacer clic en "Visual System" en el Sidebar, quiero que el Flyout se abra para explicarme qué es un Token Semántico y mostrarme los accesos directos a Colores y Tipografía.

### 3. [NAVEGACIÓN] Deep-link directo a Brand Mode
- **HU:** Como usuario, si abro directamente `/brand-hub/brands/:brandId/rules/visual`, quiero que el sistema cargue la marca, ponga el Sidebar en modo marca y abra el Flyout de "Rules" automáticamente.

### 4. [RESILIENCIA] Estado "Sin acceso"
- **HU:** Como usuario sin permisos sobre una marca, si navego a su ruta, quiero ver un estado claro (403) en el Canvas, pero manteniendo el Header y Sidebar para no perder mi navegación.

### 5. [ESTADO] Persistencia URL-First
- **HU:** Como usuario, si refresco el navegador (F5) estando en una vista profunda de marca, quiero volver exactamente al mismo punto, confirmando que la ruta es la fuente única de verdad.

### 6. [INTERACCIÓN] Sincronización Canvas-Inspector
- **HU:** Como usuario, cuando selecciono un Token de Color en el Canvas, quiero que el Inspector se abra automáticamente mostrando su impacto y las diferencias con la versión publicada.

### 7. [GOBERNANZA] Lock de Versiones Publicadas
- **HU:** Como editor, cuando visualizo una versión publicada, quiero que el Canvas sea `read-only` y la Toolbar me ofrezca la opción de "Crear borrador desde esta versión".

### 8. [OPERACIÓN] Exit Brand Mode
- **HU:** Como usuario, quiero poder volver al listado maestro de marcas desde el breadcrumb del Header y que el Sidebar vuelva automáticamente al modo global del módulo.

## 📐 Criterios de Aceptación Técnicos
- [ ] Implementar la máquina de estados de paneles: `sidebarMode`, `flyoutOpen`, `inspectorOpen`.
- [ ] Garantizar que no queden "paneles huérfanos" al cambiar de marca.
- [ ] Implementar el modo `read-only` para el Canvas basado en el estatus de la marca.
