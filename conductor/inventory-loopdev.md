# Inventario técnico de LoopDev

Fecha de corte: 2026-08-06  
Rama auditada: `develop`

## Aplicación y rutas

`apps/loopdev-os` contiene 30 páginas App Router y los layouts de las suites:

- Shell: `/`, `/login`, `/auth/callback`, `/dashboard`, `/launchpad`.
- Sales CRM: `/sales-crm`, `/sales-crm/pipeline`, `/sales-crm/customers`, `/sales-crm/ai-insights`.
- Marketing Studio: Brand Hub, marcas, identidad, versiones, reglas, gobernanza, dependencias, publicación, logos, colores y tipografía.
- Health OS: `/health-os` y módulos de agenda, triage, consultas, contratos y billing.
- Quant Ops: overview, bots, terminal, estrategias, history, risk y exchanges.

## Módulos y límites

- `apps/loopdev-os/src/app`: experiencia Next.js y rutas por suite.
- `apps/loopdev-os/src/components/layout`: piezas de layout compartidas entre suites.
- `apps/loopdev-os/src/hooks`: acceso a estado remoto y adaptadores de UI.
- `packages/contracts`: contratos compartidos (actualmente base; se ampliará en Fase 4).
- `ds/packages/ui`: sistema de diseño y componentes compartidos.
- `modules/mod-quant-core`: ejecución Python de Quant Ops.
- `modules/mod-architect`: módulo histórico sin consumidores activos; no forma parte del SaaS operativo.

## Supabase y datos

- Hay 56 migraciones en `supabase/migrations`.
- El historial está concentrado en Brand Hub, tenants iniciales y Quant Ops.
- No existen todavía migraciones de `organizations`, memberships, CRM persistente, conversaciones o WhatsApp multiempresa; pertenecen a Fases 2, 4, 6 y 8.
- `supabase/seed_loopdev.sql` es semilla de desarrollo y no debe tratarse como dataset de producción.
- El proyecto actual se considera Supabase Dev; la base de producción se creará limpia más adelante.

## Variables de entorno

El contrato público documentado en `apps/loopdev-os/.env.example` contiene:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Los valores reales permanecen fuera de Git en `.env.local`/Render. No se copian secretos al inventario.

## Calidad y ejecución

- `pnpm typecheck`
- `pnpm quality:static`
- `pnpm test`
- `pnpm --filter loopdev-os dev`
- `pnpm --filter loopdev-os build`

## Riesgos derivados del inventario

- CRM y parte de Marketing Studio todavía contienen fixtures o contextos demo.
- El esquema Supabase actual está dominado por Brand Hub y Quant Ops, no por el modelo SaaS multiempresa.
- La evolución debe comenzar por Platform Core y tenancy antes de convertir CRM/Marketing en fuente de verdad.
