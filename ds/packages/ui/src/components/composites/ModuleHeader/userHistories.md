# User Histories: ModuleHeader

**Component:** ModuleHeader
**Version:** 1.0
**Taxonomía:** Composite

## 🧬 Bloque 0: ADN de Composición (OBLIGATORIO)
1. **Trinidad Cromática:** Azul para bordes activos y estados de navegación. Amarillo para indicadores de actividad (ej. { DRAFT }).
2. **Sintaxis { }:** Brackets usados para mostrar el estado del dominio (ej. { LIVE }).
3. **Technical Canvas:** Altura fija mediante token `--lpd-workspace-header-h`. Borde inferior técnico de 0.5px.
4. **Surface Soul:** Fondo `bg-shell-canvas/80` con `backdrop-blur-md`.

## 📚 Historias de Usuario

### A. Historias Básicas
1. **Identidad del Módulo:** Como usuario, quiero ver el nombre del módulo y mi ubicación jerárquica (breadcrumbs) para no perder el contexto.
2. **Navegación de Retorno:** Como usuario, quiero poder volver atrás mediante un botón dedicado si el flujo lo requiere.
3. **Estado del Dominio:** Como usuario, quiero ver si el contenido actual está en borrador o publicado mediante un indicador visual claro.

### B. Historias de Estrés
1. **Rutas Profundas:** Como desarrollador, quiero verificar que los breadcrumbs manejan correctamente rutas muy largas mediante truncamiento inteligente.
2. **Contenedores Estrechos:** Como usuario, quiero que el título se trunque elegantemente en pantallas pequeñas sin romper el layout.

### C. Multitenancy
1. **Consistencia de Marca:** Como administrador, quiero que el header respete los colores de mi tenant en los elementos interactivos.
