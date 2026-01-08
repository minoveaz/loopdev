# User Histories: AppShell Industrial (v2.0)

## 🗺️ Categoría 1: Estructura y Navegación
- **US-LAYOUT-01 (Asymmetric Quad-Slot):** El usuario debe ver 4 zonas: **Left Sidebar** (altura completa), **Global Header** (superior derecho), **Main Canvas** (centro) e **Inspector** (lateral derecho, bajo el Header).
- **US-LAYOUT-02 (Collapsible Logic):** El Sidebar Izquierdo debe permitir el colapso entre modo expandido y modo "Icon-only" para maximizar el área de trabajo.
- **US-LAYOUT-03 (Navigation Integrity):** El cambio de módulos o sesiones no debe re-renderizar el `GlobalHeader`, manteniendo visible la búsqueda global y el perfil de usuario.

## 🛡️ Categoría 2: Escenarios de Estrés
- **US-STRESS-01 (Extreme Viewport):** El layout debe ser infalible desde **320px** (móvil) hasta **1440px+** (ultra-wide), gestionando colisiones mediante el colapso automático de paneles.
- **US-STRESS-02 (Inspector Saturation):** Contenido masivo en el Sidebar Derecho (previews de IA, tablas largas) debe tener scroll interno independiente sin afectar al Canvas.
- **US-STRESS-03 (Rapid Context Switching):** El sistema debe manejar "spam clicks" en la navegación sin dejar Toasts huérfanos o estados de carga bloqueados.
- **US-STRESS-04 (Narrative Overload):** Soporte para breadcrumbs profundos (6+ niveles) y listas de navegación largas (30+ items) con scroll técnico.

## ♿ Categoría 3: Accesibilidad y UX
- **US-A11Y-01 (Keyboard Zoning):** El usuario debe poder saltar por teclado entre zonas (Nav → Header → Canvas → Inspector) en un orden lógico.
- **US-A11Y-02 (Single Scroll Rule):** Solo una zona de trabajo debe dominar el scroll principal; los paneles laterales usan barras de scroll de 4px que aparecen solo en hover.
- **US-A11Y-03 (Focus Management):** Al abrir menús de configuración o modales, el foco debe quedar atrapado (trap focus) dentro del overlay.

## 🧠 Categoría 4: Multi-tenancy y Estado
- **US-TENANT-01 (Hot Tenant Switch):** Al cambiar de tenant, el layout debe resetear la navegación y limpiar los overlays de sesión anterior instantáneamente.
- **US-TENANT-02 (Global System States):** Capacidad de inyectar un `SystemBanner` (Offline / Mantenimiento) que empuje todo el layout hacia abajo sin ocultar el Header.

## 💾 Categoría 5: Persistencia de Estado
- **US-SHELL-STATE-01 (UI Persistence):** El estado del Sidebar (`isSidebarOpen`) y el último módulo visitado deben persistir para que la experiencia sea continua tras refrescar.
