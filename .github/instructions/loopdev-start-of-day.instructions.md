---
description: Contexto y flujo obligatorio para iniciar trabajo en LoopDev
applyTo: "**"
---

# Inicio de jornada en LoopDev

Antes de modificar código, reconstruye el contexto de trabajo de forma
proporcional a la tarea. No inventes arquitectura, convenciones ni estado del
producto.

## Secuencia de arranque

1. Lee [`AI_CONTEXT.md`](../../AI_CONTEXT.md), que contiene la identidad del
   proyecto, sus fronteras arquitectónicas y los comandos esenciales.
2. Comprueba el estado local de Git, la rama activa y los cambios existentes.
   No sobrescribas ni reviertas cambios previos sin confirmación explícita.
3. Determina si existe un track activo relacionado con la tarea. Si existe,
   lee su brief, alcance, decisiones, handoff y criterios de validación.
4. Consulta únicamente la documentación y las skills relevantes al dominio:
   - `track-governance` para alcance, decisiones, evidencia y ciclo de vida.
   - `validation-framework` para seleccionar las validaciones adecuadas.
   - `security-review` para RLS, aislamiento por organización, contratos,
     migraciones y secretos.
   - `git-workflow` para rama, commits y pull requests.
   - `platform-shell` siempre que la tarea cree, componga o modifique una
     pantalla, suite, layout, navegación, canvas o zona contextual.
5. Inspecciona las implementaciones y pruebas existentes antes de crear
   abstracciones nuevas. Respeta la separación entre `/ds`, `/modules` y
   `/apps`.
6. Resume internamente el objetivo, las restricciones, los archivos
   relevantes, los riesgos y la validación prevista. Si falta una decisión
   que cambie significativamente el diseño, pregunta antes de codificar.

## Reglas durante el trabajo

- Haz cambios quirúrgicos y mantén el comportamiento no relacionado.
- Reutiliza contratos, helpers, patrones y componentes existentes.
- No cruces fronteras arquitectónicas ni añadas dependencias sin justificación.
- No compongas una pantalla fuera del estándar de Platform Shell. Toda
  experiencia de suite debe conservar las zonas obligatorias
  `PlatformHeader`, `SuiteSidebar`, `PlatformContextPanel` y `SuiteCanvas`.
- Usa `AppShell`, `SuiteShell` y `SuiteSidebar` existentes. Configura la shell
  mediante sus contratos y esquemas declarativos; no crees sidebars, headers,
  rails o primitivas de navegación paralelas dentro de una suite.
- Antes de elegir un layout, identifica el modo o recipe canónico apropiado
  (`SuiteOverview`, `DataWorkspace`, `RecordWorkspace`, `SplitWorkspace`,
  `BoardWorkspace`, `ImmersiveWorkflow` o `CreativeEditor`) y documenta el uso
  de sus zonas opcionales. Full-bleed no elimina las zonas obligatorias.
- Trata `SuiteHeader`, `SuiteToolbar`, `ModuleContextSidebar` y
  `ModuleContextPanel` como zonas opcionales declaradas por el módulo. No las
  añadas por costumbre ni las fuerces desde el nombre del modo.
- Una `ModuleContextSidebar` no puede convertirse en una segunda navegación
  persistente. Si necesita abrirse desde rail, usa `Suite Contextual Action`
  dentro de `SuiteSidebar`, con etiqueta funcional, icono registrado, tono
  semántico y nombre accesible.
- Respeta los modos `expanded`, `rail` y `hover`: la expansión por hover debe
  superponerse al canvas sin moverlo; no uses `:has` ni mutaciones de ancho
  para implementarla. Los portales de Radix deben considerarse fuera del DOM
  de la sidebar al razonar sobre hover y dropdowns.
- Mantén separadas la identidad corporativa de LoopDev y la tematización de la
  organización. No hardcodees colores de tenant ni recolorees el logo de
  LoopDev.
- Al cambiar shell o composición, ejecuta `pnpm test:shell:changed` durante el
  desarrollo, `pnpm test:shell` antes de un commit importante y
  `pnpm validate:ci` antes de abrir o actualizar un pull request.
- En datos financieros conserva la precisión en BIGINT/cents y respeta los
  contratos compartidos.
- No expongas secretos ni relajes aislamiento multi-tenant.
- Valida el cambio con el comando más pequeño que cubra su alcance y registra
  cualquier limitación o fallo que no puedas resolver.
- Actualiza la documentación directamente afectada por el cambio.

## Cierre

Antes de terminar, revisa el diff completo, confirma que no hay archivos
temporales ni cambios accidentales y comunica los archivos modificados, la
validación ejecutada y las cuestiones pendientes.
