# Domain Validation Routing Handoff

Fecha: 2026-08-31
Rama: `test/domain-validation-routing`
Base: `origin/develop` (`66c64a27`)
Estado: Fases 0, 1, 2, 3, 4 y 6 completadas; Fase 5 bloqueada; Fase 7 en curso.

## Objetivo

Esta rama reorganiza la validacion de LoopDev para que cada cambio ejecute los
controles que protegen su riesgo real. El objetivo no es reducir calidad ni
eliminar tests: es evitar ejecuciones ajenas, impedir dominios sin contrato y
mantener una certificacion amplia para integracion y release.

## Commits de la rama

- `19a07114 test(platform): add domain validation routing`
- `255ed19f test(platform): scope static quality checks`
- `eface5e0 test(platform): complete shared consumer routing`
- `b58bb995 test(platform): catalog data and browser validation`
- `HEAD` incluye la orquestacion CI de Fase 7 y este handoff.

## Modelo de scopes

- `pnpm validate:worktree`: cambios staged, unstaged y untracked. No hereda
  el diff acumulado de la rama ni hace preflight de base.
- `pnpm validate:commit -- HEAD`: solo un commit. No hace preflight de base.
- `pnpm validate:branch`: diff `origin/develop...HEAD` y preflight de base.
- `pnpm validate:changed`: alias estable de `validate:branch`.
- `pnpm validate:full`: certificacion completa.

Para static checks:

- `pnpm quality:static:worktree`: Prettier y ESLint de archivos modificados.
- `pnpm quality:static:commit`: Prettier y ESLint de un commit.
- `pnpm quality:static:branch`: checks anteriores mas auditorias globales.

No ejecutar `pnpm validate:ci` como feedback de cada cambio pequeno. Es el
control de integracion y ejecuta lint, quality gates, typecheck, cobertura,
tests y build.

## Catalogos y ownership

- `config/validation-domain-catalog.json`: contratos de dominio, manifests,
  controles y metadata de routing.
- `config/validation-data-catalog.json`: ownership de SQL por subdominio.
- `config/e2e-validation-catalog.json`: ownership, perfil y proyectos de cada
  spec Playwright.
- `config/validation-registry.json`: controles, riesgo, coste y modos.

Un dominio nuevo debe declarar owner, rutas, manifest, lint, typecheck, unit y
build, o una razon explicita de `notApplicable`. Una app nueva sin entrada en
el catalogo falla CI.

La shell global sigue siendo propiedad de `platform`. Public Shell es una
excepcion advisory mientras `public-shell-foundation` siga activo: los dominios
pueden contribuir a su evolucion, pero los consumidores y controles deben
seguir declarados.

Quant queda fuera mientras sea experimental y no publicable.

## Estado por dominio

- CIMO: catalogado; lint, typecheck, Vitest y build pasan. Vitest resuelve
  contratos desde source. Hay 1.247 warnings historicos de Tailwind y un aviso
  de chunk grande que no bloquean esta rama.
- LoopDev OS: routing catalogado; API, services y types no activan experiencia
  web.
- Mobile: routing catalogado y job especializado conservado.
- Contracts/UI/Public Shell/Public Blocks: consumidores directos y deduplicacion
  verificados.
- Tooling: `pnpm test:tooling`; 19 archivos y 96 tests pasan.
- Worker: no esta versionado en esta rama; solo hay una carpeta local generada
  con dependencias. No registrarlo como dominio hasta que exista source real.
- Quant: fuera de alcance.

## Ejecutar validaciones

Checks sin Docker:

```text
pnpm install --frozen-lockfile
pnpm validate:domain-catalog
pnpm validate:e2e-catalog
pnpm validate:ci-orchestration
pnpm quality:static:worktree
pnpm test:tooling
pnpm test:e2e-catalog
pnpm test:e2e:profile
```

Checks con Docker Desktop y Supabase CLI:

```text
supabase start
supabase db reset
supabase db lint --local
pnpm validate:supabase-governance
pnpm test:supabase-governance
pnpm validate:data-catalog
pnpm test:data
```

La suite SQL actual contiene 9 archivos en platform, marketing, creative y
CRM. Communications esta declarado, pero vacio en esta rama porque los
controles `007` a `010` no estan presentes como archivos versionados.

Checks E2E:

```text
pnpm e2e:preflight
pnpm e2e:profile smoke -- --project=desktop
pnpm e2e:profile domain:marketing-studio -- --project=desktop
pnpm e2e:profile responsive -- --project=mobile --project=mobile-compact
pnpm exec playwright test --list
```

## Fase 7 pendiente

La orquestacion CI ya valida:

- IDs unicos de controles.
- owner, domain, risk, command y modes.
- gates de catalogos en el job `changes`.
- ausencia de comandos duplicados en el registry.

Falta obtener evidencia de ejecuciones reales de CI y servicios:

- duracion por dominio y scope;
- cobertura Vitest/Jest cuando proceda;
- false runs y false skips;
- riesgos de duplicacion entre jobs;
- resultados flaky;
- certificacion real Supabase/RLS.

No fabricar estas metricas. Registrar observaciones validas con el esquema de
`config/validation-observations.example.json` y ejecutar:

```text
pnpm validation:observations config/validation-observations.example.json
```

## Siguiente accion del equipo

1. Instalar Docker Desktop, iniciar Docker y comprobar `docker version`.
2. Actualizar esta rama con los SQL Communications `007` a `010` si son parte
   de la entrega que se quiere certificar.
3. Anadir esos archivos al catalogo SQL y probar que no quedan sin owner.
4. Ejecutar Supabase reset, lint y tests SQL completos.
5. Ejecutar varios perfiles CI y registrar duracion, cobertura y duplicacion.
6. Revisar los resultados y decidir si se cierra la Fase 5 y la Fase 7.
7. No cerrar el track automaticamente: requiere aprobacion explicita del usuario.

## Validacion realizada en esta rama

- Routing y catalogos: todos los tests focalizados pasan.
- Catalogo de dominios: 14 dominios y 2 superficies protegidas.
- Catalogo E2E: 28 specs y 3 proyectos; discovery actual de 282 tests en 27
  archivos.
- Catalogo SQL: 9 tests y 5 dominios, con Communications explicitamente vacio.
- Tooling: 19 archivos y 96 tests.
- Orquestacion CI: 15 controles validos.
- Limitacion: no se certifico Supabase local por ausencia de Docker/Podman.
