# 🧠 LoopDev AI Context

> **ATENCIÓN AGENTE:** Lee este archivo al inicio de tu sesión para alinearte con el proyecto.

## 🌍 Identidad del Proyecto
**LoopDev** es una plataforma SaaS multitenant para la gestión de productos digitales.
- **Arquitectura:** Monorepo (Turbo + PNPM).
- **Frontend:** React, Vite, Tailwind, Shadcn/ui.
- **Backend:** Node.js, Firebase (Functions/Firestore).
- **Estado:** En transición de MVP a SaaS Enterprise.

## 🗺️ Mapa Mental del Código (Three-Layer Architecture)

Respetamos estrictamente estas fronteras. **No alucines importaciones cruzadas.**

### 1. `/ds` (Design System)
*La base visual. "Tonto" y puro.*
- `packages/ui`: Componentes React (Buttons, Inputs).
- `packages/tokens`: Colores, tipografía, espaciado.
- **Regla:** Nunca importa lógica de negocio.

### 2. `/modules` (Functional Core)
*Bloques de Lego con lógica de negocio.*
- `mod-core-shared`: Autenticación, SDKs, i18n.
- `mod-auditor`: Herramienta de DesignOps.
- `mod-crm`: Gestión de clientes.
- **Regla:** Importa de `/ds`. No sabe nada de `/apps`.

### 3. `/apps` (Orquestadores)
*El producto final que ve el usuario.*
- `loopdev-os`: El portal principal (Sistema Operativo).
- **Regla:** Conecta `/modules` con el Router y Auth Provider.

---

## 🏗️ Patrones de Diseño Obligatorios

### 1. The Workbench Pattern (Tool Modules)
Para herramientas internas (Architect, etc.):
- **Shell Layer:** Fondo técnico y carga.
- **Coordinator Layer:** Lógica y orquestación.
- **Domain Layer:** Componentes puros de UI.

### 2. Cerebro vs Músculo (MVVM)
- Lógica en Custom Hooks (`Brain`).
- UI en componentes puros (`Body`).

---

## 🛠️ Comandos Esenciales (Desde la raíz `loopdev/`)

- **Instalar:** `pnpm install`
- **Dev:** `pnpm dev` (Levanta todo en paralelo)
- **Build:** `pnpm build` (Verifica compilación TS)
- **Lint:** `pnpm lint`
- **Test:** `pnpm test`

---

## ⚠️ Protocolos de Seguridad para IA

1.  **No borres sin confirmar:** Especialmente en `/ds` o `/modules`.
2.  **Verifica rutas:** Antes de editar, confirma dónde estás con `pwd` o `ls`.
3.  **Mantén la coherencia:** Si editas un componente en `/ui`, verifica si rompe `/apps`.
4.  **Dry Run:** Si vas a ejecutar un script destructivo, explica qué hará primero.

---

## 📅 Estado Actual (Contexto Dinámico)
*A fecha: Diciembre 2025*
- Estamos implementando el **Auditor Module**.
- Estamos creando el scaffolding de **LoopDev OS**.
- Prioridad: Establecer el flujo de migración de diseños (Mock -> Code).
