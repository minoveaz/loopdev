# API Standards v1.0

## 🎯 Propósito
Definir los estándares de comunicación entre el Frontend y el Backend para garantizar consistencia, seguridad y facilidad de integración en el ecosistema LoopDev.

---

## 1. Formato de Respuesta Único
Todas las respuestas de la API deben seguir esta estructura base:

```json
{
  "success": boolean,
  "data": null | object | array,
  "error": null | {
    "code": string,      // Ej: "AUTH_EXPIRED"
    "message": string,   // Mensaje legible para dev
    "details": object,   // Opcional: errores de validación
    "traceId": string    // Para seguimiento en logs
  },
  "meta": {              // Opcional: paginación, etc.
    "timestamp": string
  }
}
```

---

## 2. Naming Conventions (Endpoints)
- **Casing:** `kebab-case` para las URLs.
- **Pluralización:** Usar sustantivos en plural para las colecciones (ej: `/tenants`, `/brands`).
- **Versatilidad:** Prefijo `/v1/` obligatorio.

---

## 3. Paginación
- Estándar recomendado: **Cursor-based pagination** para colecciones grandes.
- Parámetros: `limit`, `cursor`.

---

## 4. Códigos de Estado HTTP
- `200 OK`: Éxito con retorno de datos.
- `201 Created`: Recurso creado exitosamente.
- `400 Bad Request`: Error de validación en el cliente.
- `401 Unauthorized`: No hay sesión activa.
- `403 Forbidden`: Sesión activa pero sin permisos para el recurso/tenant.
- `404 Not Found`: Recurso no existe.
- `500 Internal Server Error`: Fallo no controlado en el servidor.

---

## 5. Notificaciones en Tiempo Real (Events)
Cuando el backend emite una notificación vía WebSocket o SSE, el payload debe seguir este contrato para ser compatible con el **Toast System**:

```json
{
  "event": "notification_trigger",
  "payload": {
    "tenantId": "uuid",
    "variant": "success | error | warning | info",
    "title": "string",
    "description": "string",
    "metadata": "string", // Ej: Error code o ID
    "action": {
      "label": "string",
      "callback_url": "string"
    }
  }
}
```

---
*Gobernanza de Plataforma - LoopDev Engineering*
