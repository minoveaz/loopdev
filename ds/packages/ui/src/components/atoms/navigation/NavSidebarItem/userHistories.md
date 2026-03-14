# Historias de Usuario: NavSidebarItem (v1.1)

Este átomo es el bloque interactivo fundamental del sidebar. Actúa como el controlador de navegación, gobierno y confirmación de contexto en LoopDev OS.

## 🧬 Bloque 0: ADN de Composición (OBLIGATORIO)
1. **Trinidad Cromática:** 
   - Hover: Acento azul sutil (`bg-primary/5`).
   - Active: Azul vibrante + Barra lateral + Pulso amarillo (Momentum) en modo expandido.
2. **Sintaxis Loop:** Uso de brackets `{ }` en tooltips técnicos y metadatos del estado.
3. **Technical Canvas:** Alineación perfecta en modo Rail (56px) con tooltips de sistema obligatorios.
4. **Surface Soul:** Bordes redondeados (`rounded-xl`) y sombras de iluminación técnica (`shadow-primary/20`).

## 🛠️ Historias de Usuario

### 1. Orientación y Confianza Cognitiva
- **Historia 1 (Identidad Activa):** Como usuario, quiero que el item activo sea reconocible de forma persistente (fondo sólido + texto blanco + barra lateral) sin depender del mouse, para mantener conciencia constante de mi contexto de trabajo.
- **Historia 2 (Confirmación de Acción):** Al hacer clic, quiero recibir una confirmación visual inmediata para saber que mi intención fue registrada por el sistema.

### 2. Accesibilidad y Teclado (Enterprise Standard)
- **Historia 3 (Accesibilidad por Teclado):** Como usuario avanzado, quiero poder navegar los items usando Tab y activarlos con Enter/Space, con un estado de foco técnico visible.
- **Historia 4 (Lectores de Pantalla):** Como usuario con lector de pantalla, quiero que el item comunique su estado (activo, bloqueado, disponible) mediante roles ARIA (`aria-current`, `aria-disabled`).

### 3. Gobierno y Producto (Multitenancy)
- **Historia 5 (Diferenciación de Estados):** Como usuario, quiero distinguir claramente entre un módulo bloqueado por permisos (Candado + Grayscale) y uno que es "Próximamente" (Reloj) para entender mi capacidad de acceso.
- **Historia 6 (Prevención de Errores):** Como sistema, quiero que los items bloqueados no ejecuten navegación ni acciones, evitando errores de flujo.

### 4. Modo Experto (Rail Mode)
- **Historia 7 (Reconocimiento en Rail):** En Rail Mode, quiero identificar el item activo mediante la barra lateral de acento, sin animaciones de pulso que distraigan en modo compacto.
- **Historia 8 (Tooltips de Sistema):** Como usuario en Rail, quiero tooltips que informen del `Nombre del Módulo` y su `Estado Operativo` de forma inmediata.

## ⚠️ Casos de Estrés
- **Prioridad del Contexto Vivo:** El indicador de Momentum (pulso amarillo) siempre debe renderizarse visualmente por encima de cualquier badge de telemetría.
- **Transición de Suite:** El estado activo debe limpiarse instantáneamente al cambiar de suite para evitar "fantasmas" de navegación.
- **Contenedor Estrecho:** El texto debe truncarse con puntos suspensivos sin romper la alineación del icono.