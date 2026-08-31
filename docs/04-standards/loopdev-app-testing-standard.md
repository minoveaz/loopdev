# Estándar Canónico de Calidad y Testing de 7 Capas para Apps de LoopDev

## 1. Visión y Propósito

Este documento establece el **estándar oficial transversal de pruebas automatizadas, calidad y medición de rendimiento** para todas las aplicaciones de producto de LoopDev (CIMO, ProtegeTuSalud, CRM, Marketing Studio).

Inspirado en el modelo de ingeniería de **Vitablue (`protegetusalud`)** y las mejores prácticas de **Airbnb, Linear y Strava**, este protocolo garantiza que ninguna aplicación se publique sin certificar su funcionalidad, accesibilidad, resiliencia y velocidad extrema.

---

## 2. La Pirámide Canónica de 7 Capas de Testing

```
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                          LAS 7 CAPAS DE CALIDAD DE LOOPDEV                                  │
├─────────────────────────────────────────────────────────────────────────────────────────────┤
│ 🧪 CAPA 1: TESTS ATÓMICOS DE COMPONENTE (UI & Variantes)                                   │
│    • Renderizado limpio (smoke test) con props reales y mocks tipados de `@loopdev/contracts`.│
│    • Mapeo exhaustivo de variantes y estados (activo, hover, disabled, vacío, lleno).       │
│    • Cero emojis del SO en controles interactivos; verificación de iconos vectoriales SVG. │
├─────────────────────────────────────────────────────────────────────────────────────────────┤
│ ⚡ CAPA 2: INTERACCIÓN Y FLUJOS DE USUARIO (User-Centric RTL)                               │
│    • Eventos de usuario: clicks, filtros reactivos, inputs, formularios y atajos (`Escape`).│
│    • Deep Linking: Verificación de cambio de hash (`#/app/...`), parámetros y retroceso.    │
│    • Copia al portapapeles con micro-feedback reactivo (toasts).                            │
├─────────────────────────────────────────────────────────────────────────────────────────────┤
│ ♿ CAPA 3: ACCESIBILIDAD & WCAG (a11y Testing)                                              │
│    • Cumplimiento con la European Accessibility Act y ADA.                                  │
│    • `aria-label` obligatorio en botones de solo icono.                                     │
│    • Roles semánticos explícitos (`role="button"`, `role="navigation"`, `role="feed"`).     │
│    • Textos alternativos (`alt`) en portadas y avatares. Navegación por teclado (Tab/Enter).│
├─────────────────────────────────────────────────────────────────────────────────────────────┤
│ 🌐 CAPA 4: SEO, METADATOS Y OPENGRAPH (Public Shell & Landing)                              │
│    • Inyección de metatags dinámicos: `<title>`, `meta description`, `og:image`, `og:title`.│
│    • Marcado estructurado JSON-LD Schema (`SportsEvent`, `Person`, `Organization`).         │
│    • Validación de slugs semánticos y compatibilidad bidireccional de URLs.                 │
├─────────────────────────────────────────────────────────────────────────────────────────────┤
│ 🛡️ CAPA 5: RESILIENCIA, ERRORES Y CASOS LÍMITE (Edge Cases)                                │
│    • Fallback de URLs inexistentes (ej: ID no encontrado redirige al Feed sin 404 crash).   │
│    • Resiliencia de imágenes: `onError` reemplaza automáticamente por fallback por defecto. │
│    • Textos largos extremos (anti-overflow y truncado visual elegante).                     │
├─────────────────────────────────────────────────────────────────────────────────────────────┤
│ 💾 CAPA 6: PERSISTENCIA Y ESTADO LOCAL (Storage & Session)                                  │
│    • Persistencia de preferencias del usuario y filtros de búsqueda (`localStorage`).       │
│    • Integridad del estado ante recargas de página (F5 / Refresh).                          │
├─────────────────────────────────────────────────────────────────────────────────────────────┤
│ 🚀 CAPA 7: RENDIMIENTO & ANTI-CLS (Cumulative Layout Shift)                                 │
│    • Botones con anchura fija (`w-28`) para evitar saltos visuales al cambiar de estado.    │
│    • Ratios de aspecto fijos (`aspect-video`, `h-48`) en imágenes para renderizado estable. │
└─────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Protocolo de Medición de Rendimiento y Velocidad (Performance Engine)

Para garantizar que las aplicaciones de LoopDev sean instantáneas en cualquier dispositivo móvil (4G/5G), establecemos los siguientes umbrales obligatorios basados en **Google Core Web Vitals**:

```
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                       MÉTRICAS OBLIGATORIAS DE RENDIMIENTO (SLA)                            │
├─────────────────────────────────────────────────────────────────────────────────────────────┤
│ ⏱️ LCP (Largest Contentful Paint): < 1.2 segundos (El contenido principal aparece al instante)│
│ ⚡ INP (Interaction to Next Paint): < 50 milisegundos (Respuesta inmediata a cualquier click) │
│ 📐 CLS (Cumulative Layout Shift): 0.00 (Cero saltos visuales en la pantalla)                │
│ 📦 Bundle Size Budget: < 150 kB (gzip) en la carga inicial                                  │
│ 🏎️ Framerate de Scroll: 60 FPS estables sin tirones                                         │
└─────────────────────────────────────────────────────────────────────────────────────────────┘
```

### ¿Cómo medimos estas métricas en LoopDev?

1. **Lighthouse CI / Quality Gate en Pipeline:**
   - En cada compilación, Lighthouse evalúa Performance, Accessibility, Best Practices y SEO.
   - Puntuación mínima exigida para merge: **≥ 95/100**.
2. **Real User Monitoring (RUM) en `@loopdev/public-shell`:**
   - Conexión nativa con la librería `web-vitals` para registrar los tiempos de carga reales de usuarios en producción.
3. **Control de Fugas de Memoria (Chrome DevTools / MemLab):**
   - Verificación de que el cambio entre vistas y chats no retenga listeners ni consuma memoria residual.

---

## 4. Estructura de Suites de Test por Aplicación

Cada aplicación de LoopDev (ej. `apps/cimo`) debe organizar sus pruebas bajo `src/__tests__/`:

```
apps/cimo/src/__tests__/
├── CimoApp.test.tsx                 # Capa 1 y 2: Shell principal y navegación de rutas
├── CimoCuratedFeed.test.tsx         # Capa 1, 2 y 7: Feed central, filtros y Anti-CLS
├── CimoFloatingSearchBar.test.tsx   # Capa 2 y 3: Búsqueda, dropdowns y teclado (Escape)
├── CimoActivityDetailView.test.tsx  # Capa 1, 2 y 5: Detalle inmersivo, chat y resiliencia
├── CimoCrewNetworkView.test.tsx     # Capa 1 y 2: Squads, Círculo Íntimo y Squad Hubs
├── CimoProfileView.test.tsx         # Capa 1, 2 y 5: Ficha técnica, modo propio/ajeno y fotos
└── CimoA11yAndSeo.test.tsx          # Capa 3 y 4: Auditoría de accesibilidad ARIA y SEO
```
