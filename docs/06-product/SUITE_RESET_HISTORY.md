# Estado anterior de las suites

**Fecha del registro:** 2026-08-14
**Track:** `suite-reset`
**Rama de trabajo:** `chore/platform-shell-deprecation`

Este documento conserva una memoria breve del estado de las suites antes de su reinicio. No es una especificacion de producto ni una autorizacion para reutilizar automaticamente las implementaciones anteriores.

## Estado anterior

| Suite o superficie | Estado observado | Tratamiento en el reinicio |
| --- | --- | --- |
| Marketing Studio raiz | Ya compone `SuiteShell` con `PlatformHeader` y navegacion compartida. | Conservar solo la infraestructura necesaria; redefinir el contenido de suite posteriormente. |
| Brand Hub | Layout operativo basado en `ModuleWorkspace`, con contenido de dominio, paneles e inspector. | Inventariar y limpiar; reconstruir mediante contratos nuevos. |
| DAM | Layout operativo basado en `ModuleWorkspace`, con composicion propia de assets y paneles. | Inventariar y limpiar; reconstruir mediante contratos nuevos. |
| Health OS | Layout basado en `AppShell` + `SuiteHeader` + `ModuleWorkspace`. | Limpiar la superficie actual; definir una suite nueva posteriormente. |
| Sales CRM | Layout basado en `AppShell` + `SuiteHeader` + `ModuleWorkspace`, con prototipos y componentes CRM existentes. | Limpiar la superficie actual; definir CRM nuevamente en tracks posteriores. |
| Quant Ops | Suite experimental basada en la composicion anterior, con componentes y flujos propios. | Excepcion: conservarla tal como esta y no incluirla en el reinicio. |
| Shell Showcase | Referencia ejecutable de la composicion de plataforma nueva (`SuiteRuntime` + `SuiteCanvas`). | Conservar como referencia de plataforma, no como suite de producto. |

## Limites

Se conserva la infraestructura compartida de plataforma que tenga un contrato vigente y consumidores protegidos. Se retiran o archivan las superficies de producto de las suites incluidas cuando la matriz del track lo apruebe. Quant Ops queda fuera del alcance.

La limpieza debe precederse de un inventario completo de rutas, componentes, contratos, registros, tests y documentacion. Ningun borrado irreversible queda autorizado solo por esta memoria historica.

## Direccion posterior

Las suites productivas se redefiniran desde contratos nuevos y deberan consumir la composicion de shell aprobada: `SuiteShell`, `PlatformHeader`, `SuiteRuntime` y `SuiteCanvas`. La implementacion de cada suite se tratara en su propio track de definicion y reconstruccion.
