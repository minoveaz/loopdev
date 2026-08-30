# Communications

Definición de producto de `Communications Core`, una capacidad transversal de LoopDev, y de `CRM Communications Inbox`, su primer consumidor operativo.

Communications no es una suite independiente en esta fase. Su owner transitorio es `crm`, sin que CRM sea propietario arquitectónico de proveedores, credenciales, webhooks, conversaciones, delivery, consentimiento o auditoría. La evolución hacia una suite o dominio independiente requiere una decisión de portfolio y de tracks aprobada.

## Definición transversal

- [Communications Core definition](COMMUNICATIONS_CORE_DEFINITION.md)

## Módulos en definición

- [Communications Core](communications-core/COMMUNICATIONS_CORE_UX_SPEC.md): paquete formal `proposed` para capacidades conversacionales, proveedores y políticas compartidas.
- [CRM Communications Inbox](crm-communications-inbox/CRM_COMMUNICATIONS_INBOX_UX_SPEC.md): paquete formal `proposed` para la primera experiencia operativa sobre WhatsApp Cloud.
- [Chatwoot -> LoopDev reference guide](crm-communications-inbox/CHATWOOT_LOOPDEV_REFERENCE_GUIDE.md): matriz de patrones operativos, adaptaciones y limites de portabilidad.

## Estado

La definición transversal y sus dos paquetes están `approved`. La aprobación no autoriza cambios directos en rutas, componentes, migraciones, proveedores, secretos, envío productivo ni RLS: cada Issue debe confirmar Definition of Ready y partir desde `develop` en su rama dedicada.

## Evidencia relacionada

- Contrato inicial: `packages/contracts/src/communications/communications.ts`.
- Persistencia y RLS: `supabase/migrations/20260829000000_communications_core_foundation.sql` y `supabase/migrations/20260902000000_crm_security_hardening.sql`.
- Webhook de WhatsApp Cloud: `supabase/functions/loopdev-whatsapp-webhook/index.ts`.
- Track de definición: `tracks/planned/crm/2026-08-29-communications-core-crm-inbox-definition.md`.
- [Handoff Docker/Supabase](COMMUNICATIONS_CORE_DOCKER_SUPABASE_HANDOFF.md): procedimiento único para validar cada fase en un entorno con runtime de base de datos.