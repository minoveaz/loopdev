# Guía de Implementación: Ecosistema SaaS LoopDev

Este documento define los estándares técnicos, la arquitectura y los pasos para escalar el ecosistema LoopDev, utilizando **MarketingStudio** como base funcional y transformándolo en un producto SaaS multitenant y agnóstico.

---

## 🚩 Estado Actual del Proyecto

| Fase | Descripción | Estado |
| :--- | :--- | :--- |
| **Fase 1** | Cimentación y Design System (Foundations) | ✅ Completado |
| **Fase 2** | Arquitectura de Multitenencia (TenantProvider) | ✅ Completado |
| **Fase 2.5** | Layout Foundations & App Shell | ✅ Completado |
| **Fase 3** | Re-implementación Modular (Brand Center, etc.) | 🚧 Iniciado |
| **Fase 4** | Despliegue y Orquestación SaaS | ⏳ Pendiente |

*Última actualización: 28 de diciembre de 2025*

---

## 1. Visión Técnica: El Enfoque Agnóstico
El objetivo principal es desacoplar la **Lógica de Negocio** de la **Identidad de Marca**. 
- Los componentes nunca conocen al cliente final.
- Consumen la configuración mediante el hook `useTenant()`.

---

## 2. Estándares de Composición (Layout Foundations)
Para garantizar consistencia espacial, está prohibido el uso de márgenes externos en los componentes. El espaciado se resuelve con:

### 2.1. Primitivos Estructurales
- **`Stack`**: Distribución vertical con gaps controlados por tokens.
- **`Inline`**: Distribución horizontal (badges, iconos + texto) con soporte para wrap.
- **`Grid`**: Rejilla responsive con presets para `cards`, `form` y `content`.
- **`Box`**: El átomo base para aplicar padding, fondos y radios controlados.

### 2.2. Primitivos de Página
- **`Section`**: Gestiona el ritmo vertical entre bloques de la página (`compact`, `default`, `roomy`).
- **`Container`**: Gestiona el ancho máximo y centrado horizontal (`sm` a `xl`).
- **`Bleed`**: Permite que elementos específicos rompan el contenedor para tocar bordes.

### 2.3. Mobile & Device Foundations
- **`SafeArea`**: Utilidad para respetar automáticamente el Notch y la Gesture Bar de iOS/Android.
- **`AspectRatio`**: Garantiza proporciones consistentes (16:9, 1:1, etc.) evitando Layout Shift.

---

## 3. Arquitectura de Software

### 3.1. Gestión de Tenant
El `TenantProvider` centraliza no solo la estética, sino la **Estrategia**:
```typescript
const { tenant, subbrand, strategy } = useTenant();
// strategy incluye: purpose, promise, personality, voice traits.
```

### 3.2. App Shell
El esqueleto de la aplicación es agnóstico. El `AppShell` orquestra:
- `TopBar`: Logo dinámico y selector de contexto.
- `Sidebar`: Navegación modularizada.
- `MainContent`: Área de scroll con soporte nativo para `SafeArea`.

---

## 4. Componentes Implementados (Ready to Use)
- `Button`: Con variantes semánticas y estados de carga.
- `BrandIdentityView`: Vista para visualizar el ADN estratégico de un Tenant.
- `AppShell`: Contenedor principal de la aplicación.

---

## 5. Reglas de Oro para Desarrolladores
- **Alias `@/`**: Usar siempre el alias `@/` para imports internos en `packages/ui`.
- **Layout-First**: Si ves un `div className="flex flex-col gap-4"`, reemplázalo por un `<Stack gap={4}>`.
- **Agnosticismo**: No escribas nombres de clientes en el código. Usa `TENANT_DATA`.