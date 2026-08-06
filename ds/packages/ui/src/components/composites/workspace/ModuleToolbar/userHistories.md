# User Histories: ModuleToolbar

**Component:** ModuleToolbar
**Version:** 1.0
**Taxonomía:** Composite

## 🧬 Bloque 0: ADN de Composición (OBLIGATORIO)
1. **Trinidad Cromática:** Azul para focos de búsqueda. Morado para activadores de IA.
2. **Sintaxis { }:** (Si aplica) Brackets para mostrar el conteo de ítems seleccionados.
3. **Technical Canvas:** Altura fija mediante token `--lpd-workspace-toolbar-h`. Fondo sólido o semi-translúcido según densidad.
4. **Surface Soul:** Borde inferior técnico de 0.5px.

## 📚 Historias de Usuario

### A. Historias Básicas
1. **Control Operativo:** Como usuario, quiero tener filtros y herramientas de vista (list/grid) cerca del contenido para manipular los datos rápidamente.
2. **Acciones en Masa:** Como usuario, quiero ver acciones grupales solo cuando tengo elementos seleccionados.
3. **Visibilidad Situacional:** Como sistema, quiero que el toolbar no ocupe espacio si no tiene herramientas disponibles.

### B. Historias de Estrés
1. **Densidad de Acciones:** Como usuario avanzado, quiero que el toolbar maneje múltiples botones y filtros sin desbordar el contenedor.

### C. Multitenancy
1. **Adaptabilidad:** Como desarrollador, quiero poder inyectar slots (left, center, right) específicos para las necesidades de cada módulo.
