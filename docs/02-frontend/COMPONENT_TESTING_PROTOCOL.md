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

## 🛠️ Los 5 Pilares del Test

### 1. Renderizado Básico (The Smoke Test)
Verificar que el componente se monta sin explotar y muestra el contenido esperado.

### 2. Accesibilidad (Axe-core Audit)
**Obligatorio para v1.** El componente debe pasar el check de Axe-core en Storybook con 0 violaciones graves.

### 3. Lógica de Variantes (Prop Mapping)
Validar que las clases CSS esperadas estén presentes en `className`.

### 4. Estados de Interacción (Flow Shield)
Probar estados dinámicos. Para flujos complejos entre páginas, usar **Playwright** para simular el comportamiento real del navegador.

### 5. Integridad de Marca (Chromatic Visual QA)
Uso de Chromatic para detectar regresiones visuales de píxeles antes de cualquier merge.

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
