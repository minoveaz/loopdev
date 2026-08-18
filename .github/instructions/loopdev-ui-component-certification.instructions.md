---
description: "Apply when creating, changing, or certifying LoopDev UI components and primitives. Use the UI/UX specification skill first, require visual approval before Playwright, and keep intermediate validation output hidden unless visual review is required."
applyTo: "ds/**,apps/**,packages/**"
---

# LoopDev UI component certification

Sigue siempre este ciclo para crear o modificar un componente UI de LoopDev.
El orden es obligatorio y no debes saltar una fase.

## 1. Especificación UI/UX primero

Antes de escribir código, lanza o consulta la skill de UI/UX aplicable al
componente y crea o actualiza una `UI_UX_SPEC.md` junto al componente.

La spec debe definir, como mínimo:

- propósito y resultado esperado para el usuario;
- API pública, ownership y límites de responsabilidad;
- anatomía, variantes, tamaños y tokens;
- estados normales, hover, focus, active, disabled, loading y error cuando
  sean aplicables;
- interacción de mouse, touch y teclado;
- matriz explícita de acciones de overlay: qué acciones abren, mantienen
  abierto o cierran el popup, diferenciando single-select y multi-select;
- acciones de recuperación y limpieza, como `Clear selection`, incluyendo
  visibilidad, disponibilidad, cierre o permanencia del popup y ownership del
  estado resultante;
- nombre accesible, foco, semántica y evidencia Axe;
- responsive, geometría estable, overflow y targets táctiles;
- temas claro/oscuro y tokens de tenant;
- portabilidad entre suites y consumidores;
- límites de datos, seguridad, rendimiento y resiliencia;
- anti-patrones, criterios de reapertura y matriz de evidencia.

Actúa como especialista senior de UI/UX: no te limites a describir la
implementación actual. Define primero el comportamiento correcto del
componente, detecta ambigüedades y pregunta solo cuando falte una decisión que
cambie significativamente el contrato.

## 2. Implementación contra la spec

Después de cerrar la spec, inspecciona la implementación, consumidores, tests,
registro y patrones vecinos. Implementa todo lo necesario para cumplir el
contrato aprobado:

- reutiliza la API pública y los tokens existentes;
- conserva los límites de ownership entre componente y consumidor;
- evita CSS correctivo en fixtures o showcases;
- no uses `any` ni selectores o nombres accesibles ambiguos;
- añade estados y semántica nativa donde la spec los exija;
- actualiza README, registry, track o documentación directamente afectada.

La fixture de showcase debe consumir únicamente la API pública, ser
Data-driven, determinista y representativa del uso real.

Para controles de selección, la spec debe definir antes de implementar:

- si seleccionar una opción mantiene el popup abierto o lo cierra;
- si deseleccionar y limpiar todas las opciones siguen el mismo comportamiento;
- qué ocurre en `multiple={false}`;
- cómo se comunica una acción de limpieza al consumidor sin que el primitive
  posea el estado de negocio.

## 3. Tests técnicos antes de la revisión visual

Ejecuta primero la validación más pequeña que cubra el componente:

- Vitest y Testing Library;
- Axe en los estados aplicables;
- TypeScript y lint focalizados;
- validaciones de contrato, registry y documentación cuando correspondan.

Corrige los fallos de esta fase antes de solicitar revisión visual.
No abras Playwright todavía.

## 4. Pausa de validación visual del usuario

Cuando la implementación y los tests técnicos estén preparados, muestra al
usuario únicamente la información necesaria para validar visualmente:

- qué componente y estados debe revisar;
- la ruta o URL local para abrirlo;
- la matriz visual disponible: desktop, mobile, mobile-compact, light y dark;
- cualquier decisión visual relevante que requiera confirmación.

No muestres logs completos, trazas, comandos ni resultados intermedios de
Vitest, TypeScript o lint en esta pausa. Resume esos checks internamente y
comunica solo bloqueos o información imprescindible.

Detén el flujo y espera la aprobación visual explícita del usuario. No ejecutes
Playwright ni marques el componente como certificado antes de esa aprobación.

## 5. Playwright después de la aprobación

Solo después de la aprobación visual, ejecuta el proceso E2E estándar en este
orden:

1. servidor con la configuración oficial de Playwright;
2. preflight HTTP y DOM;
3. smoke test desktop;
4. suite desktop;
5. matriz desktop, mobile y mobile-compact;
6. temas light/dark y screenshots cuando sean parte de la spec;
7. revisión de evidencia y limpieza de `test-results/`.

Usa los scripts oficiales del repositorio (`e2e:preflight`, `e2e:smoke`,
`e2e:desktop`, `e2e:matrix` o el shortcut específico del componente). No
lances la matriz completa como primera comprobación.

Los selectores deben estar scoped al componente y preferir roles accesibles o
`data-testid` estable de fixture. No uses `force: true` para ocultar overlays,
selectores ambiguos o problemas reales de interacción.

## 6. Cierre de certificación

Marca la spec y el registry como `certified` solo cuando exista evidencia para
el contrato, implementación, accesibilidad, estados, responsive, temas,
visual, mantenimiento y tests. Declara explícitamente cualquier dimensión
`not-applicable` con justificación.

Antes de cerrar:

- revisa el diff completo;
- elimina artefactos generados;
- confirma que no hay cambios ajenos;
- registra la evidencia en el track correspondiente;
- informa al usuario solo de resultados finales, fallos pendientes y archivos
  relevantes.

La comunicación de cierre debe ser breve: resultado, evidencia principal,
limitaciones y commit si se solicita. No inundes al usuario con logs de
validación que no necesita revisar.
