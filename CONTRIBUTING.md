# Contributing to LoopDev

La normativa canónica de ramas, commits y Pull Requests está en [docs/03-platform/GIT_WORKFLOW.md](docs/03-platform/GIT_WORKFLOW.md). Este documento resume el flujo de entrada para contribuir.

## Flujo obligatorio

Cada cambio debe realizarse en una rama propia y abrir un Pull Request hacia `develop`. No se deben hacer pushes directos a `develop` ni `main`.

La relación obligatoria de trabajo es:

```text
Issue -> Branch -> Commits -> Pull Request -> Checks -> Deploy -> Release
```

Una rama debe tener una sola intención principal. No se deben mezclar en la misma rama cambios de producto, migraciones, tooling y documentación no relacionados.

1. **Issue:** todo trabajo comienza en una Issue o en GitHub Projects, con objetivo, criterios de aceptación, alcance y riesgos.
2. **Rama:** crea la rama desde `develop` con una convención descriptiva:
   ```text
   feature/CRM-123-pipeline
   fix/CRM-145-auth-error
   chore/CI-20-eslint
   ```
3. **Commits:** usa Conventional Commits (`feat`, `fix`, `chore`, `test`, `docs`, `refactor`, `perf`) y referencia la Issue cuando sea útil.
4. **Pull Request:** abre la PR hacia `develop`, enlaza la Issue (`Closes #123`) y documenta cambios de contratos, migraciones, RLS, secretos o integraciones externas.
5. **Checks:** la PR no se integra hasta que CI esté verde y exista la revisión requerida.
6. **Merge:** usa squash merge para mantener un historial legible. `develop` recibe la integración de trabajo validado.
7. **Release:** el paso de `develop` a `main` se realiza mediante una PR de release con validación adicional y aprobación explícita.

No se deben hacer pushes directos a `develop` ni `main`. Las reglas de protección de ambas ramas deben exigir PR, checks obligatorios y revisión.

### Convención resumida de ramas

La convención oficial es:

```text
feature/<area>-<tema>
fix/<area>-<tema>
chore/<area>-<tema>
docs/<area>-<tema>
test/<area>-<tema>
```

Ejemplos:

```text
feature/loopdev-frontend-standardization
feature/CRM-123-pipeline
fix/auth-callback
chore/ci-quality-gates
docs/git-workflow
```

`feat/` puede aparecer en commits, pero no es la convención preferida para nombres de ramas. Las ramas de estándares, workflows o Design System deben mantenerse separadas y ser revisables por sí mismas.

La validación automática de CI comprueba el prefijo, el formato y la intención de la rama. Usa `feature/` para cambios de producto o arquitectura con impacto funcional; usa `chore/` para mantenimiento, tooling o gobernanza sin cambio funcional.

### Reglas de commits

Un commit debe representar una unidad coherente, revisable y potencialmente reversible. No se debe esperar al final de toda una feature para crear un único commit ni crear commits por cada cambio mínimo de estilo.

Formato:

```text
type(scope): descripción breve en imperativo
```

Ejemplos:

```text
feat(preview): add mock shell navigation
feat(communications): add conversation list fixtures
test(communications): cover empty and loading states
fix(ui): correct responsive sidebar behavior
docs(frontend): define preview isolation rules
```

Haz un commit cuando:

- una unidad funcional, visual o documental esté completa;
- el slice trabajado pase su validación focalizada;
- el commit no incluya cambios ajenos;
- pueda describirse claramente qué cambia y por qué.

No mezcles en un commit cambios generados por herramientas, migraciones, secretos o modificaciones locales no relacionadas. Revisa siempre `git status`, `git diff --stat` y `git diff --cached --check` antes de confirmar.

### Validación antes de commit y Pull Request

Para cambios pequeños y localizados:

```bash
pnpm exec prettier --check <archivos-modificados>
pnpm exec eslint <archivos-modificados>
```

Para componentes o features:

```bash
pnpm lint
pnpm typecheck
pnpm test
```

Antes de abrir o actualizar el Pull Request ejecuta la validación completa:

```bash
pnpm install --frozen-lockfile
pnpm lint
pnpm quality:static
pnpm typecheck
pnpm test:coverage
pnpm build
```

El atajo `pnpm validate` cubre lint, typecheck, tests y build, pero no sustituye `quality:static` ni `test:coverage` cuando el flujo de CI los exige.

Antes de hacer push revisa:

```bash
git status
git diff --stat
git diff --cached --check
git log --oneline -5
```

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

`start:loopdev` también inicia el watcher de `@loopdev/contracts`, ya que LoopDev OS consume su bundle compilado. Así los exports nuevos de contratos se actualizan durante el desarrollo.

Para configurar el entorno por primera vez:

```powershell
Copy-Item apps/loopdev-os/.env.example apps/loopdev-os/.env.local
```

Después completa `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` con los valores del proyecto remoto de desarrollo. `.env.local` está excluido del repositorio y nunca debe commitearse.

El Pull Request debe enlazar una Issue (`Closes #123`) y describir si afecta a contratos, migraciones Supabase, RLS, secretos o integraciones externas.

### Cambios solo de frontend

Las ramas de estandarización visual pueden modificar componentes, layouts, estilos, estados, fixtures, adaptadores mock y tests. No pueden modificar migraciones, tablas, buckets, índices, RLS, autenticación, organizaciones, permisos reales, API routes de negocio, secretos ni persistencia.

El preview visual debe reutilizar `@loopdev/ui` y `@loopdev/contracts`. Los datos mock deben entrar mediante fixtures o repositorios/adaptadores sustituibles, sin consultas directas a Supabase. Las rutas reales deben conservar sus providers y guards.

Cada PR frontend debe declarar:

```text
Supabase changed: no
Migrations changed: no
RLS changed: no
API changed: no
Business logic changed: no
Real persistence added: no
Mock preview added: yes/no
Shared design system changed: yes/no
```

Los cambios locales previos o generados por builds no se incluyen automáticamente en commits de la rama. Deben revisarse y separarse explícitamente.

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
