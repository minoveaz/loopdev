# User Histories: Brand Hub Operation (v1.7)

**Strategic Goal:** "Operability through Structured Meaning & Contextual Consequence"

## 🧬 Bloque 0: ADN de Composición
1. **Hierarchical Flow:** El usuario nunca debe dudar de si está viendo el módulo o una marca específica.
2. **State Reactivity:** El Inspector es el espejo del trabajo realizado en el Canvas.

## 📚 Historias de Usuario

### 1. [NAVEGACIÓN] Transición de Niveles
- **HU:** Como usuario, quiero entrar en `/brand-hub/brands` para elegir mi marca, y que al seleccionarla, mi Sidebar cambie automáticamente al "Brand Mode" con las opciones de Identidad y Reglas.

### 2. [EXPLORACIÓN] Sidebar en Module Mode
- **HU:** Como usuario, quiero poder filtrar la lista de marcas escribiendo en un input técnico en la cabecera del Sidebar, para encontrar rápidamente "Loop Health" entre docenas de opciones.
- **HU:** Como usuario, quiero ver el estado (`{ DRAFT }`) de cada marca en la lista sin tener que entrar en ella.

### 3. [NAVEGACIÓN] Sidebar en Brand Mode
- **HU:** Como usuario, quiero un botón claro de "Atrás" en la cabecera del Sidebar para volver al directorio global de marcas.
- **HU:** Como diseñador, quiero ver la estructura de la marca organizada en grupos lógicos (Visual, Verbal, Reglas) para no perderme en la configuración.

### 4. [APRENDIZAJE] El Sidebar Flyout
- **HU:** Como usuario novel, al hacer clic en "Visual System" en el Sidebar, quiero que el Flyout se abra para explicarme qué es un Token Semántico y mostrarme los accesos directos a Colores y Tipografía.

### 5. [INTENCIÓN] Toolbar Contextual (Nuevo)
- **HU:** Como usuario en una marca publicada, quiero ver claramente que la única acción primaria es "Create Draft", para entender que no puedo editar directamente.
- **HU:** Como editor en un borrador activo, quiero tener botones rápidos para "Save" y "Request Approval" siempre visibles en la barra superior.
- **HU:** Como aprobador en modo revisión, quiero ver las opciones de "Approve" y "Reject" en el Toolbar, pero que al pulsarlas se abra el Inspector para confirmar mi decisión formalmente.

### 6. [RESILIENCIA] Estado "Sin acceso"
- **HU:** Como usuario sin permisos sobre una marca, si navego a su ruta, quiero ver un estado claro (403) en el Canvas, pero manteniendo el Header y Sidebar para no perder mi navegación.

### 7. [ESTADO] Persistencia URL-First
- **HU:** Como usuario, si refresco el navegador (F5) estando en una vista profunda de marca, quiero volver exactamente al mismo punto, confirmando que la ruta es la fuente única de verdad.

## 📐 Criterios de Aceptación Técnicos
- [ ] Implementar `ModuleSidebar` con soporte condicional para `mode="module"` y `mode="brand"`.
- [ ] Implementar `BrandToolbar` orquestador con los 4 estados definidos.
- [ ] Usar `Input` (v3.9) para el buscador.
- [ ] Usar `TechnicalStatusBadge` para los estados en la lista.
