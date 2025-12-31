# 📜 Guía de Desarrollo para Mockups: "LoopDev Ready" Standard

Este documento define las reglas de ingeniería que el equipo de prototipado debe seguir para que los componentes sean 100% compatibles con el ecosistema **LoopDev**.

> **Misión:** Lograr que la migración de un "Blueprint" a un "Componente de Producción" sea un simple proceso de copiar y pegar.

---

## 🏗️ 1. Arquitectura del Componente (Folder Pattern)

No se aceptan archivos sueltos. Cada componente funcional debe ser una carpeta autocontenida con la siguiente estructura:

| Archivo | Responsabilidad |
| :--- | :--- |
| `index.tsx` | **The Body:** Solo contiene el JSX y las clases de Tailwind. No gestiona lógica compleja. |
| `use[Nombre].ts` | **The Brain:** El Custom Hook que gestiona el estado (`useState`), efectos y handlers. |
| `components.tsx` | **Sub-piezas:** Pequeños componentes internos que solo se usan dentro de este módulo. |
| `utils.ts` | **Helpers:** Funciones de ayuda, constantes de datos o formatos. |
| `types.ts` | **Contratos:** Definición de las interfaces de TypeScript. |

---

## 🎨 2. El Sistema de Tokens (Prohibido el Hardcoding)

Está terminantemente prohibido usar colores hexadecimales (`#...`) directos en el código. Se deben usar los **Tokens Semánticos** de LoopDev para garantizar que el componente sea multitenant.

### 2.1. Tabla de Mapeo Oficial
Si el diseño requiere estos colores, usad estas clases de Tailwind:

| Token Semántico | Color Hex | Propósito |
| :--- | :--- | :--- |
| `primary` | `#135BEC` | Botones principales, enlaces, branding activo. |
| `primary-dark` | `#0B46BE` | Estados hover de elementos primarios. |
| `energy` | `#FFD025` | Highlights técnicos, alertas, puntos de estado IA. |
| `background-light`| `#F8F9FC` | Fondo base de aplicaciones en modo claro. |
| `background-dark` | `#0F1115` | Fondo base de aplicaciones en modo oscuro. |
| `surface-dark` | `#181B21` | Tarjetas y paneles sobre el fondo oscuro. |
| `border-dark` | `#2D3442` | Líneas de división y bordes en modo oscuro. |
| `text-main` | `#0F172A` | Texto principal en modo claro. |
| `text-muted` | `#64748B` | Texto secundario o descripciones. |

### 2.2. Configuración de Tailwind
Asegurad que vuestro `tailwind.config.js` incluya estos nombres en la sección `theme.extend.colors`. De esta forma, podéis usar `className="bg-primary"` y funcionará instantáneamente en producción.

---

## 🧠 3. Patrón "Cerebro vs Músculo" (MVVM)

Para que podamos testear vuestros componentes, la lógica **debe** estar separada.

**❌ Mal (Lógica y Vista mezcladas):**
```tsx
export const MyComponent = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  return <div onClick={handleOpen}>{open ? 'Open' : 'Closed'}</div>;
}
```

**✅ Bien (Arquitectura LoopDev):**
```tsx
// useMyComponent.ts (The Brain)
export const useMyComponent = () => {
  const [open, setOpen] = useState(false);
  return { open, toggle: () => setOpen(!open) };
}

// index.tsx (The Body)
export const MyComponent = () => {
  const { open, toggle } = useMyComponent();
  return <div onClick={toggle}>{open ? 'Open' : 'Closed'}</div>;
}
```

---

## 📋 4. Protocolo de Metadatos (Indexer Ready)

Nuestro motor de auditoría (**The Architect**) escanea vuestro código. Para que sea indexado correctamente, cada archivo raíz debe empezar con este comentario:

```tsx
/**
 * @component [Nombre del Componente]
 * @description [Explicación breve de qué hace]
 * @category [Components | Layout | Pages]
 */
```

---

## 🛠️ 5. Estándares Visuales y Assets

1.  **Iconos:** Usad exclusivamente la librería `lucide-react` o los nombres de `Material Symbols Outlined`.
2.  **Fuentes:** No defináis fuentes custom en el CSS. Usad `font-sans` (Inter) o `font-mono` (JetBrains Mono).
3.  **Animaciones:** Usad las clases de Tailwind (`animate-pulse`, `animate-bounce`) o transiciones estándar (`transition-all duration-200`).
4.  **Imágenes:** No peguéis SVGs gigantes en el código. Usad archivos externos o componentes de icono.

---

## ✅ Checklist de Entrega
Antes de enviar un componente a la carpeta `blueprints`, aseguraos de:
- [ ] No hay ni un solo color hexadecimal (`#`) en el JSX.
- [ ] El componente funciona tanto en `dark` como en `light` mode.
- [ ] No hay estilos inline (`style={{...}}`).
- [ ] El archivo de lógica está separado en un `.ts`.
- [ ] Tiene el bloque de metadatos `@component` al inicio.

---

*El incumplimiento de estas normas generará "Deuda Técnica" automática en el dashboard del Architect.*
