# 🧠 LoopDev AI Context

> **ATENCIÓN AGENTE:** Lee este archivo al inicio de tu sesión para alinearte con el proyecto.

## 🌍 Identidad del Proyecto
**LoopDev** es una plataforma SaaS multitenant para la gestión de productos digitales.
- **Arquitectura:** Monorepo (Turbo + PNPM).
- **Frontend:** React, Vite, Tailwind, Shadcn/ui.
- **Backend:** Node.js + Python (Quant Core).
- **Database:** Supabase (PostgreSQL) + Cents Precision.

## 🏗️ Arquitectura de Grado Industrial (Quant Ops)
El motor de trading ha sido desacoplado en una arquitectura de 3 capas:
1.  **Tier A (Data Sentinel)**: Ingestor autónomo en Python. Actualiza `quant_market_history` 24/7.
2.  **Tier B (Signal Engine)**: Lógica de trading. Consume datos de la DB LOCAL (Cents).
3.  **Tier C (Execution Manager)**: Acción y Riesgo. Ejecuta órdenes en Binance y actualiza el bot.

### 🔐 Estándares de Datos
- **Precisión Financiera**: Todos los precios en DB son **BIGINT (Cents)**. (Precio Real * 100).
- **Contratos**: Definidos en `packages/contracts/src/quant/`. Espejados en Python en `models.py`.

## Map Mental del Código (Three-Layer Architecture)

Respetamos estrictamente estas fronteras. **No alucines importaciones cruzadas.**

### 1. `/ds` (Design System)
*La base visual. "Tonto" y puro.*
- `packages/ui`: Componentes React (BotCards, Buttons, Inputs).
- **Regla:** Nunca importa lógica de negocio.

### 2. `/modules` (Functional Core)
- `mod-quant-core`: Motor de trading (Python). Tier A, B y C.
- **Regla:** Importa de `/ds`. No sabe nada de `/apps`.

### 3. `/apps` (Orquestadores)
- `loopdev-os`: El portal principal. Contiene el Dashboard de Quant Ops.

---

## 🛠️ Comandos Esenciales (Desde la raíz `loopdev/`)

- **Instalar:** `pnpm install`
- **Dev UI:** `pnpm dev`
- **Iniciar Ingestor (Sentinel):** `startingestor` (Utility command)
- **Iniciar Motor Quant:** `startquant` (Utility command)

---

## 📅 Estado Actual (Marzo 2021)
- **Arquitectura 3-Tier Certificada**: Ingesta, Lógica y Ejecución desacopladas.
- **Cents Precision**: Implementado en todo el flujo de datos.
- **Data Sentinel**: Operativo 24/7 con buffer de memoria y backfill.
