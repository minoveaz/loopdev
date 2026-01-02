# SaaS Data Model v1.0

## 🎯 Propósito
Proporcionar una visión de alto nivel del esquema relacional que sostiene el ecosistema LoopDev, garantizando la integridad de la jerarquía multitenant.

---

## 1. Tablas Core (Foundation)

### `tenants`
El corazón del sistema. Cada cliente es un registro único.
- `id` (uuid)
- `name` (string)
- `subdomain` (string)
- `theme_config` (jsonb) - Para el DynamicThemeProvider.

### `users`
Identidades globales del sistema.
- `id` (uuid)
- `email` (string)
- `full_name` (string)

### `memberships`
La tabla de unión que define qué usuario tiene acceso a qué tenant y con qué rol.
- `user_id` (uuid)
- `tenant_id` (uuid)
- `role` (enum: owner, admin, member, viewer)

---

## 2. Tablas de Módulo (Brand Hub)

### `brands`
Definición de marcas dentro de un tenant.
- `id` (uuid)
- `tenant_id` (fkey)
- `name` (string)

### `brand_assets`
Archivos asociados a una marca.
- `id` (uuid)
- `brand_id` (fkey)
- `storage_path` (string)
- `asset_type` (enum: logo, color, font)

---

## 3. Auditoría

### `audit_log`
Bitácora de mutaciones en la base de datos.
- `id` (uuid)
- `tenant_id` (fkey)
- `user_id` (fkey)
- `action` (string)
- `metadata` (jsonb)

---
*Fundamentos de Plataforma - LoopDev Engineering*
