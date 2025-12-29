# 📜 LoopDev Developer Manifesto

> **"Build Systems, Not Just Features."**
>
> Este documento define los estándares innegociables de ingeniería para el ecosistema `loopdev`. Es la constitución técnica para humanos y Agentes de IA.

---

## 🏛️ 1. Arquitectura & Patrones (The Logic Layer)

En LoopDev no usamos MVC tradicional. Usamos **Modular DDD** con el patrón **Separation of Concerns (Logic in Hooks, UI in Components)**.

### El Patrón de Oro: "Cerebro vs Músculo"

Cada funcionalidad compleja debe separarse en tres capas físicas:

| Capa | Responsabilidad | Dónde vive |
| :--- | :--- | :--- |
| **1. The Core (Model)** | Tipos de datos, Servicios API, Constantes. *Puro TypeScript.* | `src/core/types.ts`, `src/core/api.ts` |
| **2. The Brain (ViewModel)** | Lógica de estado, Efectos, Llamadas a API, Transformación de datos. *Custom Hooks.* | `src/hooks/use[Feature].ts` |
| **3. The Body (View)** | Renderizado visual. Recibe datos por props. "Tonto" y puro. *React Components.* | `src/components/[Feature].tsx` |

### ❌ Bad Practice (Spaghetti Code)
*Mezclar lógica y vista hace que el código sea imposible de testear y mantener.*

```tsx
// ❌ NO HAGAS ESTO
export const ClientList = () => {
  const [data, setData] = useState([]);
  
  useEffect(() => {
    fetch('/api/clients').then(res => setData(res.json()));
  }, []);

  if (!data) return <div>Loading...</div>; // Lógica en la vista

  return (
    <div>
      {data.map(c => <div>{c.name}</div>)} {/* UI acoplada */}
    </div>
  );
};
```

### ✅ Good Practice (Architected Code)
*Separar responsabilidades permite reutilización y tests aislados.*

```tsx
// 1. The Brain (Hook reutilizable y testeable)
export const useClientList = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Lógica de negocio encapsulada
  useEffect(() => {
    clientService.getAll().then((data) => {
      setClients(data);
      setIsLoading(false);
    });
  }, []);

  return { clients, isLoading };
};

// 2. The Body (Componente visual puro)
export const ClientListUI = ({ clients, isLoading }: ClientListProps) => {
  if (isLoading) return <Spinner />;
  return (
    <List>
      {clients.map(c => <ClientItem key={c.id} data={c} />)}
    </List>
  );
};

// 3. The Orchestrator (Página)
export const ClientsPage = () => {
  const logic = useClientList();
  return <ClientListUI {...logic} />;
};
```

---

## 🌍 2. Reglas de Desarrollo SaaS (The Scalability Laws)

Estas reglas protegen la naturaleza Multitenant del sistema.

### 🏢 Single Source of Truth (Configuración)
*   **Regla:** **PROHIBIDO** hardcodear nombres de clientes, colores o logos.
*   **Implementación:** Todo debe venir del `TenantContext` o `ThemeContext`.
*   **Check:** Si escribes "LoopDev" en un componente, estás rompiendo la regla. Debe ser `{tenant.name}`.

### 🗺️ Strict Routing Hierarchy
*   **Regla:** Las URLs deben ser predecibles y jerárquicas.
*   **Patrón:** `/:tenantId/:module/:view`
    *   ✅ `/acme-corp/crm/leads`
    *   ❌ `/leads` (¿De quién son estos leads?)

### 👁️ The Visibility Mandate
*   **Regla:** "Si no lo veo, no existe". Una feature no está terminada hasta que el usuario puede llegar a ella navegando.
*   **Checklist de Entrega:**
    1.  ¿Está en el Sidebar o Menú?
    2.  ¿Tiene Breadcrumbs para volver?
    3.  ¿Es accesible por URL directa?

---

## 💎 3. Calidad & Estilo (The Craft Laws)

### 🗣️ Human-Centric Voice
*   **Regla:** Prohibido el lenguaje de máquina en la UI.
*   **Anti-Patrón:** "Error 500: Null Reference Exception".
*   **Correcto:** "Tuvimos un problema cargando tus datos. Intenta recargar."
*   **Por qué:** Nuestros usuarios son humanos, no compiladores.

### 📚 Docs-First Culture
*   **Regla:** Antes de escribir una línea de código complejo, escribe (o lee) el comentario que explica el "Por qué".
*   **Para IAs:** Si vas a modificar un módulo, lee primero su `README.md` o la documentación en `/docs`.

### 🧪 Evidence-Based PRs
*   **UI Changes:** Requieren captura de pantalla (Screenshot) en el PR.
*   **Logic Changes:** Requieren output de tests pasando.

---

## 🛡️ 4. Fronteras del Monorepo (The Boundaries)

Respetamos estrictamente la arquitectura de 3 capas.

1.  **Apps (`/apps`)** → Orquestan. Pueden importar todo hacia abajo.
2.  **Modules (`/modules`)** → Lógica encapsulada. Solo importan `/ds`. **NUNCA** importan `/apps`.
3.  **Design System (`/ds`)** → Átomos visuales. **NUNCA** importa lógica de negocio.

---

*Este manifiesto es ley. Romperlo es introducir deuda técnica conscientemente.*