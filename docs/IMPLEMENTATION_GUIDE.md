# Guía de Implementación: Ecosistema SaaS LoopDev

Este documento define la arquitectura de **Tres Capas** para escalar el ecosistema LoopDev, garantizando 100% de reutilización entre productos.

---

## 🚩 Estado Actual del Proyecto

| Fase | Descripción | Estado |
| :--- | :--- | :--- |
| **Capa 1** | Design System (Foundations & UI) | ✅ Maduro |
| **Capa 2** | Módulos Funcionales (Lógica Compartida) | 🚧 Iniciado |
| **Capa 3** | Aplicaciones (Productos Finales) | ⏳ Pendiente |

*Última actualización: 28 de diciembre de 2025*

---

## 1. Arquitectura de Tres Capas

Para lograr escalabilidad masiva, dividimos el código en tres fronteras claras:

### 1.1. Capa 1: UI Library (`ds/packages/ui`)
- **Qué es**: Componentes atómicos puros.
- **Regla**: Prohibida la lógica de negocio o llamadas a API específicas.
- **Salida**: Botones, Inputs, Modales, Layouts.

### 1.2. Capa 2: Functional Modules (`modules/`)
- **Qué es**: Piezas de lógica reutilizables con su propia UI.
- **Ejemplo**: `mod-auditor`, `mod-weather`, `mod-auth`.
- **Regla**: Consumen la Capa 1 y exponen funcionalidades completas.

### 1.3. Capa 3: Applications (`apps/`)
- **Qué es**: El producto final que usa el cliente.
- **Ejemplo**: `portal-loopdev`, `marketing-studio`.
- **Regla**: Orquestan módulos y definen las rutas.

---

## 2. El Módulo de Auditoría (`mod-auditor`)

Este módulo es una herramienta de **DesignOps** diseñada para:
1. Leer código React proveniente de diseño ("Blueprints").
2. Generar versiones atómicas automáticas usando el motor de conversión.
3. Permitir la aprobación visual A/B antes de mover el código a producción.

---

## 3. Principios de Ingeniería

### 3.1. Root Monorepo
El proyecto se gestiona como un único espacio de trabajo de PNPM en la raíz de `loopdev/`. Esto permite que una App en `/apps` importe un módulo en `/modules` y este a su vez use el DS en `/ds` de forma instantánea.

### 3.2. Branding System
Toda la identidad (Logos, Colores, Brackets) vive en la Capa 1 como componentes dinámicos que reaccionan al `TenantProvider`.

---

## 4. Checklist para Nuevos Módulos
- [ ] ¿Usa exclusivamente componentes de `@loopdev/ui`?
- [ ] ¿Es agnóstico a la App donde se inyectará?
- [ ] ¿Tiene un manifiesto de configuración claro?
