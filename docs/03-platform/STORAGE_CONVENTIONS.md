# Storage Conventions v1.1

## 🎯 Propósito
Estandarizar la gestión de archivos y activos en Supabase Storage para garantizar la privacidad de los datos por organización y facilitar el escalado industrial.

---

## 1. Estructura de Directorios (Buckets)
Los archivos se organizarán por `organization_id` en la raíz del bucket para permitir políticas de seguridad (RLS) granulares y eficientes.

**Patrón recomendado:**
`organizations/{organization_id}/{module_name}/{category}/{asset_id}/{filename}`

**Ejemplo para Brand Hub:**
`organizations/org-123/brand-hub/logos/logo-primary.svg`

---

## 2. Convenciones de Naming
- Usar `kebab-case` para nombres de archivos.
- Los nombres deben ser descriptivos pero sanitizados (remover caracteres especiales).
- **ID-First:** Preferir `{asset_id}-{friendly-name}.ext` para evitar colisiones.

---

## 3. Política de Acceso y Seguridad
- **Privacidad por Defecto:** Todos los buckets son privados.
- **Signed URLs:** El frontend consumirá archivos mediante URLs firmadas.
- **TTL (Time-To-Live):**
    - Activos de UI (Logos): 24 horas.
    - Documentos sensibles: 15 - 60 minutos.
    - Exportaciones masivas: 5 minutos.

---

## 4. Procesamiento Automático
- **Thumbnails:** Las imágenes subidas deben generar automáticamente una versión optimizada (WebP) mediante un Worker o la capacidad nativa de transformación de Supabase.
- **Storage Path:** `/derived/` para cualquier activo generado automáticamente del original.

---

## 5. Versionado de Archivos
- No se sobrescriben archivos existentes si se requiere historial.
- El sistema debe añadir un sufijo de versión o timestamp al path si se detecta colisión.

---
*Gobernanza de Plataforma - LoopDev Engineering*