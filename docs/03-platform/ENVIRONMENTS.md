# Environments & Deployments v1.0

## 🎯 Propósito
Definir los diferentes entornos de ejecución del SaaS LoopDev y las reglas de despliegue para asegurar la estabilidad entre desarrollo y producción.

---

## 1. Niveles de Entorno

| Entorno | Propósito | Infraestructura |
| :--- | :--- | :--- |
| **DEV** | Desarrollo local y experimental. | Codespaces / Local Supabase CLI |
| **STAGING** | Validación de integración y QA. | Proyecto Supabase 'staging' |
| **PROD** | Entorno real de clientes. | Proyecto Supabase 'production' |

---

## 2. Gestión de Variables de Entorno
- Usar archivos `.env.local` (nunca subir a Git).
- Las claves del sistema (API Keys, Secrets) residen en el gestor de secretos de cada entorno.

---

## 3. Flujo de Promoción
1. El código se desarrolla en ramas `feat/` o `fix/`.
2. Se abre un Pull Request contra `main` para despliegue automático en **STAGING**.
3. Tras validación técnica y visual, se realiza el tag de versión para promover a **PROD**.

---
*Gobernanza de Plataforma - LoopDev Engineering*
