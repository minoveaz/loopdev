# API & Communication Standards v1.0

> **Authority:** Platform Engineering
> **Scope:** All REST APIs within `loopdev-os` (Next.js API Routes, Supabase Functions).
> **Enforcement:** Mandatory for Code Review.

---

## 1. Core Philosophy: Predictability
The API is a product used by our Frontend developers. It must be predictable, typed, and semantic.
*   **JSON Only:** All requests and responses must use `Content-Type: application/json`.
*   **RESTful-ish:** We use HTTP verbs (GET, POST, PATCH, DELETE) semantically, but pragmatism wins over dogma.

---

## 2. The Response Envelope
We never return raw data arrays or primitives at the root level. All successful responses use a standard envelope.

### 2.1 Success Response (`2xx`)
```typescript
interface SuccessResponse<T> {
  data: T;           // The resource or collection requested
  meta?: {           // Optional metadata (pagination, tracing)
    page?: number;
    limit?: number;
    total?: number;
    traceId: string;
  };
}
```

### 2.2 Error Response (`4xx`, `5xx`)
Errors must be machine-readable first, human-readable second.
```typescript
interface ErrorResponse {
  error: {
    code: string;        // Immutable string code (e.g., "RESOURCE_NOT_FOUND")
    message: string;     // English human-readable description (for devs/logs)
    details?: any;       // Validation errors (Zod issues)
    traceId: string;     // Correlation ID for logs
  };
}
```

---

## 3. Standard Data Types

| Data Type | Format | Example | Why? |
| :--- | :--- | :--- | :--- |
| **ID** | UUID v4 | `"550e8400-e29b..."` | Security (unpredictable) & Mergability. |
| **Date** | ISO-8601 (UTC) | `"2024-01-30T14:00:00Z"` | No timezone hell. Frontend formats to local. |
| **Money** | Integer (Cents) | `1999` (= $19.99) | Floating point math errors (`0.1 + 0.2 != 0.3`). |
| **Flags** | Boolean | `true` / `false` | No `0` or `1` or `"yes"`. |

---

## 4. HTTP Status Codes (Semantics)

We restrict usage to a simplified subset of HTTP codes to reduce cognitive load.

| Code | Meaning | Context |
| :--- | :--- | :--- |
| **200** | OK | Generic success (GET, PATCH). |
| **201** | Created | Resource created successfully (POST). |
| **204** | No Content | Action successful, nothing to return (DELETE). |
| **400** | Bad Request | Validation failed (Zod error). |
| **401** | Unauthorized | User is not logged in (Missing/Invalid Token). |
| **403** | Forbidden | User logged in but lacks Permission (RBAC). |
| **404** | Not Found | Resource does not exist (or tenant mismatch). |
| **409** | Conflict | Domain rule violation (e.g., Duplicate Email). |
| **429** | Too Many Requests | Rate limit hit. |
| **500** | Internal Error | Unhandled exception (Bug). |

---

## 5. Pagination Standard
We default to **Offset-based** pagination for admin tables.

**Query Params:**
*   `?page=1` (default)
*   `?limit=20` (default, max 100)

**Response Meta:**
```json
"meta": {
  "page": 1,
  "limit": 20,
  "total": 154,
  "totalPages": 8
}
```

---

## 6. Error Catalog (Common)

| Error Code | Status | Description |
| :--- | :--- | :--- |
| `VALIDATION_ERROR` | 400 | Zod schema validation failed. Returns `details` array. |
| `TENANT_MISMATCH` | 403 | Attempting to access data from another tenant. |
| `INSUFFICIENT_PERMISSIONS` | 403 | User role does not allow this action. |
| `RESOURCE_NOT_FOUND` | 404 | ID does not exist or was deleted. |
| `INTERNAL_SERVER_ERROR` | 500 | Something exploded. Check logs with `traceId`. |

---

## 7. Versioning Strategy
*   **URL Versioning:** `/api/v1/...`
*   Changes that break the contract require a new version (v2).
*   Adding fields is **non-breaking**. Removing/Renaming fields is **breaking**.