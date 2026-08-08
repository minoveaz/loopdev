# Configuración de entorno del vault de Quant

El vault de exchanges de Quant solo puede activarse cuando estas variables existan en el entorno **server-side** de LoopDev OS. Nunca se añaden al navegador, a `NEXT_PUBLIC_*`, a un archivo versionado ni a logs.

| Variable | Origen | Entornos | Uso |
|---|---|---|---|
| `SUPABASE_SERVICE_ROLE_KEY` | Proyecto Supabase correspondiente, sección API | Desarrollo y Render | Cliente administrativo usado exclusivamente por los Route Handlers de Quant. |
| `QUANT_CORE_URL` | URL HTTPS o URL interna del servicio Quant Core | Desarrollo y Render cuando se habilite la comprobación de conexión | Endpoint que comprueba credenciales de exchanges desde `POST /api/quant/exchanges/:id/test`. |

## Provisionamiento

1. Obtén la clave `service_role` del proyecto Supabase de desarrollo. No reutilices una clave de producción.
2. Crea `SUPABASE_SERVICE_ROLE_KEY` en `.env.local` para el desarrollo local y como secreto server-side del servicio `loopdev-os` de Render.
3. Crea `QUANT_CORE_URL` con la URL del entorno Quant Core correspondiente. No debe tener prefijo `NEXT_PUBLIC_`.
4. Reinicia el proceso local o redeploya el servicio de Render después de cambiar variables.
5. Repite el proceso de forma independiente para staging y producción cuando existan; no copies secretos entre entornos.

## Verificación segura

- Inicia sesión como usuario con `quant.manage` en una organización activa.
- Crea o consulta una conexión mediante `/api/quant/exchanges`; la respuesta solo puede incluir `apiKeyMasked`, nunca `api_key` ni `api_secret`.
- Ejecuta la prueba de conexión. Si `QUANT_CORE_URL` falta, el endpoint debe responder `503` sin revelar configuración interna.
- Confirma en las herramientas del navegador que las respuestas, JavaScript y variables públicas no contienen la service role key.
- Revoca y rota la clave inmediatamente si aparece en una consola, commit o herramienta de terceros.

## Límites

La aplicación ya comprueba la sesión y `quant.manage` antes de usar el cliente administrativo. La carga efectiva de secretos en Supabase/Render requiere acceso de administrador a esos entornos y no se automatiza desde Git.
