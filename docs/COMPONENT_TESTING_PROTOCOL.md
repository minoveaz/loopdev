# Component Testing Protocol v1.0

## Objetivo
Garantizar que cada componente del Design System de LoopDev sea técnicamente infalible, accesible y resistente a regresiones mediante una suite de pruebas automatizadas con **Vitest** y **React Testing Library**.

---

## 📂 Ubicación de los Tests
Los tests deben vivir junto al componente (colocación) para facilitar el mantenimiento.
```
Button/
├── index.tsx
├── useButton.ts
└── Button.test.tsx  <-- Obligatorio
```

---

## 🛠️ Los 4 Pilares del Test

### 1. Renderizado Básico (The Smoke Test)
Verificar que el componente se monta sin explotar y muestra el contenido esperado.
- **Acción:** `render(<Component>Text</Component>)`
- **Expectativa:** `expect(screen.getByText(/text/i)).toBeInTheDocument()`

### 2. Lógica de Variantes (Prop Mapping)
No probamos si Tailwind funciona, probamos que nuestra lógica asigna la clase correcta.
- **Acción:** Pasar props como `variant`, `size` o `status`.
- **Expectativa:** Verificar que la clase CSS esperada esté presente en `className`.

### 3. Estados de Interacción
Probar estados dinámicos como `isLoading`, `disabled` o `active`.
- **Importante:** Validar que `disabled` bloquee realmente los eventos de click.

### 4. Integridad de Marca (Iconografía)
Dado que usamos Material Symbols (fuente), los iconos se buscan por su glifo textual.
- **Acción:** `render(<Icon name="add" />)`
- **Expectativa:** `expect(screen.getByText('add')).toBeInTheDocument()`

---

## 🧠 Mocking & Context
Si un componente consume el `ThemeContext`, debe ser envuelto en el test:
```tsx
const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <DynamicThemeProvider config={mockConfig}>
      {ui}
    </DynamicThemeProvider>
  );
};
```

---

## 🚫 Prohibiciones (Bad Practices)
1. **NO** buscar por clases CSS volátiles (ej. `mt-4`). Buscar por roles ARIA o texto.
2. **NO** testear implementación interna. Testear la salida del DOM (lo que el usuario ve).
3. **NO** dejar componentes sin test al promover a producción.

---

## ⚠️ Advertencias Técnicas (Layout Blindness)
**Importante:** Vitest y JSDOM simulan el DOM pero **no tienen motor de renderizado (layout engine)**.
- **No detectan:** Desbordamientos (overflow), colisiones flexbox, fallos de `z-index` visual o problemas de `aspect-ratio`.
- **Mitigación:** Estos casos deben validarse mediante **Historias de Estrés** en Storybook y, en el futuro, con **Visual Regression Testing** (Playwright/Chromatic).

---
*Protocolo de Ingeniería de Calidad - LoopDev*
