# Historias de Usuario: SuiteHeader (v1.3 — Enterprise Ready)

**Versión:** 1.3 — **Taxonomía:** Composites (AppShell Level)

Este documento es el contrato oficial para la construcción del `SuiteHeader`, el dispositivo de orientación, comando y telemetría de LoopDev OS. La versión 1.3 añade refinamientos de gobernanza, estados offline y arquitectura de extensibilidad.

---

### 🧬 Bloque 0: ADN de Composición (v3.9)
- **Trinidad Cromática:** Azul (Interacción), Amarillo (Estado de Sistema), Morado (IA).
- **Sintaxis Loop:** Brackets `{ }` para atajos (`⌘K`) y metadatos.
- **Technical Canvas:** Altura inmutable de **56px**. Borde inferior de **0.5px**.
- **Surface Soul:** Fondo reactivo al tema con `backdrop-blur` condicional.

---

### 🛠️ Historias de Usuario Detalladas

#### A. Cápsula Izquierda (Orientación y Gobernanza)
1.  **Contexto de Suite (`SuiteSwitcher`):** Ver mi suite actual y cambiar a otra contratada.
2.  **Navegación Jerárquica (`ContextPath`):** Breadcrumb técnico (`Suite / Módulo`) con colapso inteligente.
3.  **Gobierno de Acceso (`Switcher Guarded`):** El `SuiteSwitcher` solo muestra las suites a las que tengo acceso.
4.  **Contexto de Tenant:** Ver siempre el `Workspace/Org` activo.

#### B. Cápsula Central (Comando y Productividad)
5.  **Comando Global (`CommandBarTrigger`):** Disparador de **Paleta de Comandos (`⌘K`)** siempre accesible.
6.  **Descubribilidad de Atajos:** El disparador debe mostrar claramente el hint (`⌘K`) y un tooltip.

#### C. Cápsula Derecha (Estado y Control del Sistema)
7.  **Creación Global:** Botón `+` universal para crear activos.
8.  **Telemetría de Sistema (`StatusIndicator`):** Ver el estado de conectividad (`Syncing`, `Offline`) con un tooltip técnico.
9.  **Notificaciones Relevantes:** Campana que alerta de eventos nuevos.
10. **Perfil y Rol (`UserMenu`):** Acceso a mi perfil que muestre mi rol (`Admin`, `Editor`).

#### D. Comportamiento y Arquitectura del Shell
11. **Adaptabilidad Progresiva:** El header se colapsa en un orden predecible.
12. **Accesibilidad por Teclado:** Todos los controles son accesibles con Tab.
13. **Salto de Contenido:** Link "Skip to content" oculto para lectores de pantalla.
14. **Estabilidad Visual:** No hay "layout shift" al cargar contadores.
15. **Internacionalización (i18n):** Soporte para textos largos.

#### E. Interacciones Avanzadas y Gobernanza (v1.2+)
16. **Sincronización de Suite:** Al cambiar de suite, el `navSlot` del `AppShell` se actualiza.
17. **Orquestación de Overlay:** `CommandBarTrigger` abre la `CommandPalette` en el `overlaySlot`.
18. **Seguridad Cognitiva (Overlay Safety):** Cuando un **overlay bloqueante** está activo, el `SuiteHeader` se vuelve inerte.
19. **Notificaciones y Panel de Contexto:** Link "Ver Todo" en popover de notificaciones abre el `SuiteContextPanel`.
20. **Estado Offline Degradado:** Cuando el sistema está offline, las acciones de creación y subida se deshabilitan o advierten del riesgo.

#### F. Contrato Arquitectónico (v1.3)
21. **Contrato de Extensión de Slots:** El `SuiteHeader` debe exponer slots estables (left, center, right) con reglas claras para permitir extensiones futuras sin modificar el núcleo.

---
*Arquitectura de Header - LoopDev Engineering Board*
