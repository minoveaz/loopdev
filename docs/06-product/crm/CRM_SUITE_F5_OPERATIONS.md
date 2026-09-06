# CRM Suite — Fase 5: calidad, staging y operaciones

Este documento es el runbook versionado para la Fase 5 del track `crm-suite-closure`
(`#189`). No declara certificada ninguna capacidad que dependa de infraestructura,
credenciales o usuarios externos. La base de trabajo es `develop` actualizado; F5 no
abre alcance de F6/F7 ni activa WABA, usuarios piloto o GA.

## Gate de CI

El job `changes` ejecuta `test:crm:f5-operations` y `validate:crm:f5-operations` en
cada push/PR. El gate comprueba que el runbook y el track canónico existen, conservan
las secciones de evidencia requeridas y no contienen valores de secretos. El job no
simula un proveedor ni convierte un resultado local en evidencia de staging.

Para la validación local:

```sh
pnpm test:crm:f5-operations
pnpm validate:crm:f5-operations
```

La protección requerida del check agregado y la regla de rama `develop` deben
configurarse en GitHub Branch Protection por un administrador. El repositorio no puede
demostrar esa configuración desde Git sin inventar permisos externos.

## Staging reproducible

**Objetivo de aceptación:** crear un entorno vacío desde las migraciones versionadas,
aplicar `supabase db reset`, cargar únicamente datos sintéticos de dos organizaciones y
ejecutar los checks CRM/API/RLS sin bypass de autenticación.

Secuencia propuesta, en un proyecto Supabase de staging autorizado:

```sh
supabase link --project-ref "$SUPABASE_STAGING_PROJECT_REF"
supabase db push --dry-run
supabase db reset --linked
pnpm test:data:domain
pnpm test:crm:bootstrap
pnpm test:crm:backend-http
```

Los valores `SUPABASE_STAGING_PROJECT_REF`, URL, claves y credenciales se inyectan
únicamente desde el entorno de CI/staging. No se versionan, no se copian desde Dev y no
se usan secretos de producción. Render Blueprint, promociones protegidas y el proyecto
Supabase staging siguen bloqueados hasta disponer de acceso administrativo.

## Observabilidad

La aceptación requiere endpoint health/readiness, logs JSON con `organization_id`,
correlation/request id, error tracking y alertas con owner y umbral. Antes de configurar
Sentry o alertas reales se debe registrar el proveedor, proyecto, DSN/token en el gestor
de secretos y una prueba de evento sintético. No se incluyen DSN, tokens ni destinos
reales en este repositorio.

## Continuidad y rollback

La aceptación requiere:

1. backup/PITR habilitado y evidencia de retención;
2. restore drill aislado con checksum y conteo no sensible;
3. rollback documentado para cada migración CRM aplicable;
4. purge dry-run que informe candidatos sin borrar datos.

El restore/PITR y la promoción/rollback dependen del proyecto Supabase y del proveedor de
deploy. Hasta que exista acceso autorizado, el estado es **bloqueado**, no certificado.
No se ejecutan `DROP`, `TRUNCATE` ni operaciones destructivas como parte de F5.

## Evidencia y bloqueos

| Bloque                    | Evidencia versionable                 | Evidencia externa requerida                             | Estado            |
| ------------------------- | ------------------------------------- | ------------------------------------------------------- | ----------------- |
| #76 required gate         | workflow, script y tests del gate     | branch protection con check required                    | bloqueado externo |
| #77 checks loopdev-os     | comandos y artefactos de CI           | ejecución CI verde sobre el PR                          | pendiente         |
| #78 Auth/RLS E2E          | catálogo y comandos reproducibles     | dos organizaciones en Supabase staging, sin bypass      | bloqueado externo |
| #79 staging               | migraciones y secuencia de reset      | Render Blueprint/promoción protegida y proyecto staging | bloqueado externo |
| #80 health/logs/Sentry    | contrato de campos y runbook          | DSN, alertas y owner configurados                       | bloqueado externo |
| #81 backup/restore        | procedimiento y criterios de checksum | PITR/restore drill real y rollback de deploy            | bloqueado externo |
| #90 fixtures/simulaciones | inventario y prohibición del gate     | eliminación validada en rutas críticas                  | pendiente         |
| #91 accesibilidad         | comandos Axe/Playwright existentes    | ejecución sobre staging autenticado                     | pendiente         |
| #92 UAT                   | checklist P0/P1 y criterios           | defectos y aprobación de usuario                        | fuera de F5       |

Un bloque solo puede pasar a `certificado` cuando su evidencia externa esté adjunta al
PR o a la Issue correspondiente. F5 no cierra Issues ni cambia el estado del track sin
aprobación explícita del usuario.
