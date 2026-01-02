# LoopDev · Estrategia Oficial de QA, Code Review y Automatización

> **Contexto**: GitHub · Monorepo Nx/Turborepo · SaaS multi-tenant · Design System certificado
> **Objetivo**: Automatizar entre el **80–95%** del QA y code review, manteniendo control humano solo donde aporta valor real (arquitectura, UX, riesgo).

---

## 1. Principios Fundamentales

1. **No PR, no merge**
   Ningún cambio entra en `main` sin Pull Request.

2. **CI es juez**
   Todo lo medible se automatiza y se convierte en *gate*.

3. **Certificación como proceso, no opinión**
   Un componente o módulo está certificado porque **pasó checks**, no porque alguien lo diga.

---

## 2. El Arsenal Técnico (The Quality Shield)

| Herramienta | Función | Gate |
| :--- | :--- | :--- |
| **Axe-core** | Auditoría de Accesibilidad (A11y) | Dev/Storybook |
| **Chromatic** | Regresión Visual Pixel-Perfect | PR Review |
| **Playwright** | E2E Testing (Camino Crítico) | CI Check |
| **Vitest** | Unit & Integration Testing | Local/CI |
| **Changesets** | Automatización de Versionado | Release |
| **Snyk** | Security & Vulnerability Scanning | CI Gate |

---

## 3. Estados de Certificación

### Certified v0 — Legacy
- Componentes existentes antes del pipeline completo.
- Uso permitido, pero cambios obligan a recertificar.

### Certified v1 — Full
Requisitos obligatorios:
- [ ] Axe-core: 0 Violations.
- [ ] Chromatic: Baseline aceptado.
- [ ] Vitest: 100% Cobertura de User Stories.
- [ ] Storybook: Historias de estrés incluidas.
- [ ] Tokens: 0 hardcoded colors.

---

## 4. Gobierno del Code Review
- **`packages/ui/**`**: Requiere 2 aprobaciones + Chromatic Pass.
- **`apps/**`**: Requiere 1 aprobación + Playwright Smoke Test Pass.

---
*Gobernanza de Calidad - LoopDev Engineering Board*
