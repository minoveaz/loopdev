Guía de Composición Visual loop.dev (v3.7)

Single Source of Truth — Diseño · Ensamblaje · SaaS

Status: Active
Owner: LoopDev Design System
Aplica a: Blueprints, Mockups, Componentes React, Layouts y Pages del ecosistema loop.dev / LoopDev SaaS

Tabla de Contenidos

Principios No Negociables

Metáfora Estructural: Universo No Literal

Paleta de Color: Color como Rol

Superficies y Profundidad (Depth Architecture)

Geometría, Grid y Espaciado

Tipografía Dual

Movimiento y Momentum

Patrones de Composición LoopDev

Brackets {} como Operadores

Traducción a Código (Design → Dev)

Set de Mapeos Oficiales (Design → Dev)

Checklist de Aceptación Visual

Reglas de Decisión

Compatibilidad SaaS (LoopDev Ready)

1. Principios No Negociables

Color = Rol, no decoración

Grid = estructura (base 4px)

Profundidad = superficies + bordes, no sombras negras

Tipografía = autoridad (Inter) + precisión (JetBrains Mono)

Movimiento = feedback funcional

{} = operadores estructurales

Todo componente debe ser multitenant-ready

Si un componente “se ve bien” pero rompe el sistema, se rechaza.

2. Metáfora Estructural: Universo No Literal

La interfaz de loop.dev se concibe como un sistema vivo de bloques interconectados.

Uso deliberado del espacio negativo

Jerarquía clara por estructura y espaciado

Elementos anclados visualmente (nada flota sin lógica)

Implicación Dev:
no añadir estilos decorativos fuera del sistema; todo debe responder a tokens y reglas.

3. Paleta de Color: Color como Rol
   3.1 Core — Azul estructural
   Rol Token Uso
   Primary Blue --color-primary CTAs, foco, estructura
   Primary Light --color-primary-light hover
   Primary Dark --color-primary-dark profundidad
   3.2 Signal — Amarillo energía
   Rol Token Uso
   Energy Yellow --color-energy IA viva, alertas positivas

Regla: nunca usar para texto largo.

3.3 IA y analítica
Rol Token Uso
IA Purple --color-ia badges, iconos IA
Soft IA --color-ia-soft fondos
Deep Indigo --color-analytics dashboards
3.4 Estados semánticos
Estado Token
Success --color-success
Danger --color-danger
Operational --color-operational 4. Superficies y Profundidad (Depth Architecture)
Nivel Token / Color Uso
Deep Space #0F1115 fondo base app
Laboratory Canvas #0D121B interacción técnica
Surface #181B21 cards, panels
Glass rgba(255,255,255,0.03) overlays

Regla: profundidad se logra con contraste + borde, no con sombras negras.

5. Geometría, Grid y Espaciado
   5.1 Grid

Unidad base: 4px

Todos los padding / margin / gap deben respetarlo

5.2 Densidad
Densidad Uso
High Density ingeniería, dashboards
Low Density marketing, onboarding 6. Tipografía Dual
Contexto Fuente
UI / títulos / body Inter
IDs / logs / shortcuts JetBrains Mono

Regla: datos vivos en mono suelen ir en bold.

7. Movimiento y Momentum
   Tipo Duración
   Hover ~150ms
   Entradas ~300ms
   IA loop 3–8s

Curva base: cubic-bezier(0.25, 0.1, 0.25, 1.0)

8. Patrones de Composición LoopDev
   8.1 Laboratory Canvas

Lift: scale 1.05

Rotación ±1deg

Halo azul o amarillo según rol

Drop targets dashed + hover activo

8.2 Threading

Indentación progresiva

Conectores visuales en L

8.3 Timeline / Feed

Eje vertical 1px

Ritmo visual pb-8

8.4 AI Ghost

Bordes con gradiente animado

Shimmer lento en empty/loading

9. Brackets {} como Operadores
   Nivel Uso
   Macro secciones, pasos
   Meso entornos, variables
   Micro estados vivos, shortcuts

Hover: los corchetes se “abren” (translate-x).

10. Traducción a Código (Design → Dev)
    Prohibiciones

❌ hex en JSX/CSS

❌ estilos inline productivos

❌ CSS global

❌ spacing fuera de escala

Obligatorio

Tokens semánticos

Brain vs Body

Overrides por CSS vars

Example.tsx demostrativo

11. Set de Mapeos Oficiales (Design → Dev)
    11.1 Estado → Token → Clase (ejemplo Tailwind)
    Estado Token Clase
    Default primary text-primary
    Hover primary-light hover:text-primary-light
    Active primary-dark bg-primary-dark
    Disabled text-muted opacity-50
    Error danger text-danger
    11.2 Superficie → Clases
    Superficie Clases
    Deep Space bg-background-dark
    Surface bg-surface-dark border border-border-dark
    Glass bg-white/3 backdrop-blur-md
    Canvas bg-[#0D121B] (solo tokenizado en config)
    11.3 Densidad → Spacing
    Densidad Padding
    High p-2 p-3
    Low p-8 p-10
    11.4 Tipografía → Clases
    Uso Clase
    UI general font-sans
    Técnico font-mono
    Label uppercase text-[10px] tracking-widest
12. Checklist de Aceptación Visual

Tokens correctos (sin hex)

Grid 4px respetado

Estados completos

Tipografía correcta

Profundidad coherente

Brackets bien usados

Dark / light OK

13. Reglas de Decisión

Falta claridad → vuelve a diseño

Se ve plano → mejora superficie, no sombra

Necesita hex → falta token

Estado inventado → error de proceso

14. Compatibilidad SaaS (LoopDev Ready)

Para publicarse:

multitenant probado

override funcional

auditoría sin violaciones

Example + README completos
