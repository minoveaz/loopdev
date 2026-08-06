# Contributing to LoopDev

## Flujo obligatorio

Cada cambio debe realizarse en una rama propia y abrir un Pull Request hacia `develop`. No se deben hacer pushes directos a `develop` ni `main`.

## Flujo de trabajo y trazabilidad

El flujo oficial mantiene la relación:

```text
Issue -> Branch -> Commits -> Pull Request -> Checks -> Deploy -> Release
```

1. **Issue:** todo trabajo comienza en una Issue o en GitHub Projects, con objetivo, criterios de aceptación, alcance y riesgos.
2. **Rama:** crea la rama desde `develop` con una convención descriptiva:
   ```text
   feature/CRM-123-pipeline
   fix/CRM-145-auth-error
   chore/CI-20-eslint
   ```
3. **Commits:** usa Conventional Commits (`feat`, `fix`, `chore`, `test`, `docs`, `refactor`) y referencia la Issue cuando sea útil.
4. **Pull Request:** abre la PR hacia `develop`, enlaza la Issue (`Closes #123`) y documenta cambios de contratos, migraciones, RLS, secretos o integraciones externas.
5. **Checks:** la PR no se integra hasta que CI esté verde y exista la revisión requerida.
6. **Merge:** usa squash merge para mantener un historial legible. `develop` recibe la integración de trabajo validado.
7. **Release:** el paso de `develop` a `main` se realiza mediante una PR de release con validación adicional y aprobación explícita.

No se deben hacer pushes directos a `develop` ni `main`. Las reglas de protección de ambas ramas deben exigir PR, checks obligatorios y revisión.

### Entornos y secretos

- `.env.local`: configuración local del desarrollador; nunca se commitea.
- GitHub Environment `development`: secretos utilizados por CI/CD de desarrollo.
- GitHub Environment `production`: secretos separados para producción.
- Render: variables de entorno del servicio desplegado; no se deben copiar al repositorio.

Las claves `service_role` son exclusivamente de servidor y nunca deben exponerse como variables `NEXT_PUBLIC_*`.

El despliegue previsto es: merge en `develop` -> despliegue dev en Render -> smoke tests; PR de release a `main` -> aprobación -> despliegue productivo.

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

```

También se pueden activar servicios individualmente:

```powershell
pnpm start:loopdev -- --with-supabase
```

URLs locales:

- LoopDev OS: `http://localhost:3000`
- Supabase local: `http://127.0.0.1:54323`

El script es multiplataforma y gestiona la terminación de los procesos al pulsar `Ctrl+C`.

El arranque estándar usa el proyecto remoto Supabase de desarrollo mediante las variables de `.env.local`; no requiere Docker. `start:loopdev:local` activa el stack Supabase local y requiere Docker. La validación visual y de estados de componentes se realiza mediante Vitest y React Testing Library.

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

La calidad estÃ¡tica se valida con `pnpm quality:static`. El comando comprueba el formato de los archivos modificados, clases estÃ¡ticas repetidas, clases Tailwind contradictorias, duplicaciÃ³n y dependencias sin uso. La deuda histÃ³rica de duplicaciÃ³n y Knip se reporta inicialmente sin bloquear; cualquier contribuciÃ³n nueva debe mantener el formato y no aÃ±adir nuevas incidencias.

`.github/workflows/ci.yml` se ejecuta en cada Pull Request y en cada push a `develop` o `main`. Usa Node 20, pnpm 9, lockfile congelado y permisos mínimos. Un cambio no está listo para integrar hasta que el workflow sea verde.

Los tests E2E de Playwright, la validación de Supabase/RLS, seguridad y despliegues de Render se añadirán como workflows independientes cuando sus entornos estén configurados; no deben ejecutarse contra producción.

## Estado inicial conocido

La primera ejecución puede descubrir fallos heredados del repositorio. No se deben silenciar con `|| echo`, `continue-on-error` ni exclusiones no justificadas. Cada fallo debe convertirse en una Issue y resolverse o documentarse explícitamente antes de relajar un gate.
