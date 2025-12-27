# Estar Protegidos App

Esta app Next.js integra el Design System y los design tokens compartidos.

## Estructura
- **/styles/globals.css**: Importa los tokens base y el tema específico (theme-ep.css).
- **/tailwind.config.ts**: Usa el preset compartido desde `packages/tailwind-config`.
- **/app/layout.tsx**: Aplica los estilos globales.
- **/app/page.tsx**: Página de ejemplo usando clases de Tailwind y tokens.

## Scripts
- `pnpm dev` — Inicia el servidor de desarrollo Next.js
- `pnpm build` — Compila la app
- `pnpm lint` — Linting
- `pnpm typecheck` — Verificación de tipos

## Notas
- Los tokens y el preset se comparten entre apps para mantener consistencia visual.
- Cambia el tema importando otro archivo de tokens en `globals.css`.
