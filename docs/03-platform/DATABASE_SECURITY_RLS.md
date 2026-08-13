# Database Security & RLS Policy

## 🎯 Propósito
Garantizar el aislamiento absoluto de datos entre organizaciones mediante el uso
de **Row Level Security (RLS)** en Postgres. Ninguna aplicación o usuario podrá
acceder a datos que no pertenezcan a su `organization_id`.

---

## 🛡️ El Muro de Seguridad (RLS)

### 1. Regla de Oro
**Toda tabla** que contenga información de negocio debe tener activado RLS y
poseer una columna `organization_id`.

### 2. Resolución de Identidad
El backend no confía en el cliente. El `organization_id` se resuelve cruzando el
`auth.uid()` del usuario con su membresía en la tabla
`organization_memberships`.

---

## 📝 Patrones de Políticas (Supabase)

### Política de Lectura (SELECT)
```sql
CREATE POLICY "Users can only view their tenant data" ON "public"."table_name"
FOR SELECT USING (
  organization_id IN (
    SELECT organization_id
    FROM organization_memberships
    WHERE user_id = auth.uid()
  )
);
```

### Política de Escritura (INSERT/UPDATE)
```sql
CREATE POLICY "Users can only modify their tenant data" ON "public"."table_name"
FOR ALL USING (
  organization_id IN (
    SELECT organization_id
    FROM organization_memberships
    WHERE user_id = auth.uid() AND role IN ('admin', 'owner')
  )
) WITH CHECK (
  organization_id IN (
    SELECT organization_id
    FROM organization_memberships
    WHERE user_id = auth.uid() AND role IN ('admin', 'owner')
  )
);
```

---

## 🧪 Pruebas de Aislamiento
Todo cambio en la base de datos debe pasar por un **Isolation Test**:
1. Crear Usuario A en Organization 1.
2. Crear Usuario B en Organization 2.
3. Validar que Usuario A reciba un error 403 o array vacío al intentar leer IDs
   de Organization 2.

---
`tenants` y `tenant_id` solo se conservan como compatibilidad legacy durante la
migración. Las nuevas tablas, políticas y pruebas deben usar
`organizations` y `organization_id`.

*Gobernanza de Plataforma - LoopDev Engineering*
