# Contributing to LoopDev

## Flujo obligatorio

Cada cambio debe realizarse en una rama propia y abrir un Pull Request hacia `develop`. No se deben hacer pushes directos a `develop` ni `main`.

Antes de abrir o actualizar el Pull Request, ejecuta desde la raíz del repositorio:

```powershell
pnpm install
pnpm lint
pnpm typecheck
pnpm test
pnpm test:coverage
pnpm build
```

El atajo equivalente es:

```powershell
pnpm validate
```

## Arranque local

Los aliases personales no son necesarios. Desde la raíz del repositorio:

```powershell
# LoopDev OS usando el proyecto Supabase dev configurado en .env.local
pnpm start:loopdev

# LoopDev OS + Supabase local (requiere Docker)
pnpm start:loopdev:local

# LoopDev OS + Storybook (solo si trabajas en el Design System)
pnpm start:loopdev:ui
```

También se pueden activar servicios individualmente:

```powershell
pnpm start:loopdev -- --with-supabase
pnpm start:loopdev -- --with-storybook
```

URLs locales:

- LoopDev OS: `http://localhost:3000`
- Storybook: `http://localhost:6006`
- Supabase local: `http://127.0.0.1:54323`

El script es multiplataforma y gestiona la terminación de los procesos al pulsar `Ctrl+C`.

El arranque estándar usa el proyecto remoto Supabase de desarrollo mediante las variables de `.env.local`; no requiere Docker. `start:loopdev:local` activa el stack Supabase local y requiere Docker. Storybook queda como herramienta opcional y fuera del flujo principal del SaaS; solo se levanta con `start:loopdev:ui`.

Para configurar el entorno por primera vez:

```powershell
Copy-Item apps/loopdev-os/.env.example apps/loopdev-os/.env.local
```

Después completa `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` con los valores del proyecto remoto de desarrollo. `.env.local` está excluido del repositorio y nunca debe commitearse.

El Pull Request debe enlazar una Issue (`Closes #123`) y describir si afecta a contratos, migraciones Supabase, RLS, secretos o integraciones externas.

## Qué valida cada comando

- `pnpm lint`: ESLint en los workspaces del monorepo. Los avisos se tratan como deuda técnica; los errores bloquean.
- `pnpm typecheck`: compilación TypeScript sin emitir archivos.
- `pnpm test`: tests unitarios, de componentes y de contratos mediante Vitest Projects.
- `pnpm test:coverage`: misma suite con cobertura para CI.
- `pnpm build`: build de todos los workspaces que participan en Turbo.
- `pnpm validate`: ejecuta lint, typecheck, tests y build en orden.

## CI en GitHub

`.github/workflows/ci.yml` se ejecuta en cada Pull Request y en cada push a `develop` o `main`. Usa Node 20, pnpm 9, lockfile congelado y permisos mínimos. Un cambio no está listo para integrar hasta que el workflow sea verde.

Los tests E2E de Playwright, la validación de Supabase/RLS, seguridad y despliegues de Render se añadirán como workflows independientes cuando sus entornos estén configurados; no deben ejecutarse contra producción.

## Estado inicial conocido

La primera ejecución puede descubrir fallos heredados del repositorio. No se deben silenciar con `|| echo`, `continue-on-error` ni exclusiones no justificadas. Cada fallo debe convertirse en una Issue y resolverse o documentarse explícitamente antes de relajar un gate.
