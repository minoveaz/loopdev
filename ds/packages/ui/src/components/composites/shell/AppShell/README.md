# AppShell (Layout)

**Description:** Chasis industrial de la plataforma LoopDev OS. Es la infraestructura visual raíz para todas las aplicaciones autenticadas, implementando la jerarquía asimétrica oficial y el sistema de slots dinámicos.

## 🏛️ Anatomía de Slots
- **`navSlot`:** Sidebar izquierdo de altura completa (Global Navigation).
- **`headerSlot`:** Barra superior (Contexto global / Búsqueda / Usuario).
- **`contextSlot`:** Panel derecho contextual (Inspector / IA Insights).
- **`footerSlot`:** Barra de estado inferior (Status Bar).
- **`children`:** Área de trabajo principal (Canvas).

## 🚀 Comportamiento Híbrido (Standard LoopDev)
El componente implementa inteligencia de viewport integrada mediante **Container Queries**:
- **Desktop (@lg+):** Los paneles laterales funcionan en modo **PUSH** (empujan el contenido central).
- **Tablet/Mobile (< @lg):** Los paneles funcionan en modo **OVERLAY** (flotan sobre el contenido con un backdrop).

## 🌑 Temas y Superficies
- Utiliza el token `Deep Space` para el fondo base.
- Soporte nativo para Modo Claro/Oscuro mediante clases condicionales.
- Barras de scroll industriales ultrafinas (4px) pre-configuradas.

## 🕹️ Uso Profesional
```tsx
import { AppShell } from '@loopdev/ui';

<AppShell 
  navSlot={<GlobalNav />}
  headerSlot={<TopBar />}
  contextSlot={<Inspector />}
  config={{
    context: 'normal',
    isLeftSidebarOpen: true
  }}
>
  <MyModuleView />
</AppShell>
```

## 🛡️ Certificación & Calidad
### Estatus: **Front_Certified 🔵**
- **A11y:** Cumplimiento de landmarks HTML5 y roles ARIA.
- **Resiliencia:** Probado contra desbordamientos narrativos.
- **Aislamiento:** Regla de "Single Scroll" aplicada por slot.

---
*Certificado para Fase 4 — Producción LoopSaaS*
