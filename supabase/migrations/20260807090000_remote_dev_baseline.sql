--
-- PostgreSQL database dump
--

\restrict 77O6ezUpZm82ocLNRndqRbcHEjKcHY2q93JOUJijlDylKaqqDz4RoygjhrQ1Po1

-- Dumped from database version 17.6
-- Dumped by pg_dump version 18.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA public;


--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA public IS 'standard public schema';


--
-- Name: trading_environment; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.trading_environment AS ENUM (
    'testnet',
    'production'
);


--
-- Name: communications_set_updated_at(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.communications_set_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;


--
-- Name: consume_oauth_state(text, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.consume_oauth_state(p_provider text, p_state_hash text) RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
    deleted_count integer;
BEGIN
    DELETE FROM public.oauth_states
    WHERE state_hash = p_state_hash
      AND provider = p_provider
      AND user_id = auth.uid()
      AND expires_at > now();
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count > 0;
END;
$$;


--
-- Name: decrypt_api_key(text, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.decrypt_api_key(encrypted_text text, secret_key text) RETURNS text
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
    RETURN pgp_sym_decrypt(decode(encrypted_text, 'base64'), secret_key);
END;
$$;


--
-- Name: delete_oauth_connection(text, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.delete_oauth_connection(p_provider text, p_external_account_id text) RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
    secret_ref text;
    deleted_count integer;
BEGIN
    IF NOT public.has_marketing_role('editor') THEN
        RAISE EXCEPTION 'Insufficient role';
    END IF;

    SELECT credential_ref INTO secret_ref
    FROM public.oauth_connections
    WHERE provider = p_provider
      AND external_account_id = p_external_account_id;

    IF secret_ref IS NULL THEN
        RETURN false;
    END IF;

    DELETE FROM vault.secrets
    WHERE id = secret_ref::uuid;

    DELETE FROM public.oauth_connections
    WHERE provider = p_provider
      AND external_account_id = p_external_account_id;
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count > 0;
END;
$$;


--
-- Name: encrypt_api_key(text, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.encrypt_api_key(plaintext text, secret_key text) RETURNS text
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
    RETURN encode(pgp_sym_encrypt(plaintext, secret_key), 'base64');
END;
$$;


--
-- Name: get_my_marketing_role(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_my_marketing_role() RETURNS text
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  select role
  from public.user_roles
  where user_id = auth.uid()
  limit 1;
$$;


--
-- Name: has_marketing_role(text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.has_marketing_role(required_role text) RETURNS boolean
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = auth.uid()
      AND (
        role = 'admin'
        OR role = required_role
        OR (required_role = 'viewer' AND role IN ('editor', 'viewer'))
      )
  );
$$;


--
-- Name: register_oauth_state(text, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.register_oauth_state(p_provider text, p_state_hash text) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
    IF NOT public.has_marketing_role('editor') THEN
        RAISE EXCEPTION 'Insufficient role';
    END IF;
    INSERT INTO public.oauth_states (state_hash, user_id, provider)
    VALUES (p_state_hash, auth.uid(), p_provider);
END;
$$;


--
-- Name: store_oauth_connection_secret(text, text, text, text[], text, text, timestamp with time zone); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.store_oauth_connection_secret(p_provider text, p_external_account_id text, p_display_name text, p_scopes text[], p_access_token text, p_refresh_token text, p_expires_at timestamp with time zone) RETURNS uuid
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
    secret_id uuid;
    connection_id uuid;
BEGIN
    IF NOT public.has_marketing_role('editor') THEN
        RAISE EXCEPTION 'Insufficient role';
    END IF;

    IF p_provider NOT IN ('facebook', 'instagram', 'linkedin', 'youtube', 'x', 'tiktok') THEN
        RAISE EXCEPTION 'Unsupported OAuth provider';
    END IF;

    IF nullif(trim(p_access_token), '') IS NULL THEN
        RAISE EXCEPTION 'Access token is required';
    END IF;

    SELECT vault.create_secret(
        jsonb_build_object(
            'access_token', p_access_token,
            'refresh_token', nullif(p_refresh_token, '')
        )::text,
        format('oauth:%s:%s', p_provider, p_external_account_id),
        'VitaBlue OAuth credential'
    ) INTO secret_id;

    INSERT INTO public.oauth_connections (
        provider,
        external_account_id,
        display_name,
        scopes,
        credential_ref,
        expires_at,
        created_by,
        updated_at
    ) VALUES (
        p_provider,
        p_external_account_id,
        p_display_name,
        coalesce(p_scopes, '{}'),
        secret_id::text,
        p_expires_at,
        auth.uid(),
        now()
    )
    ON CONFLICT (provider, external_account_id)
    DO UPDATE SET
        display_name = excluded.display_name,
        scopes = excluded.scopes,
        credential_ref = excluded.credential_ref,
        expires_at = excluded.expires_at,
        updated_at = now();

    SELECT id INTO connection_id
    FROM public.oauth_connections
    WHERE provider = p_provider
      AND external_account_id = p_external_account_id;

    RETURN connection_id;
END;
$$;


--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: brands; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.brands (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    tenant_id uuid NOT NULL,
    name text NOT NULL,
    description text,
    status text DEFAULT 'draft'::text NOT NULL,
    logo_url text,
    palette jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    created_by uuid DEFAULT auth.uid(),
    identity jsonb DEFAULT '{}'::jsonb,
    typography jsonb DEFAULT '{"primary": {"type": "sans", "family": "Inter", "source": "google", "variants": [], "fallbacks": ["sans-serif"]}, "baseSize": 16, "scaleRatio": 1.25, "aiOptimized": true, "lineHeightBase": 1.5}'::jsonb,
    logos jsonb,
    rules_engine jsonb DEFAULT '{"rules": [], "globalPolicy": {"blockAlwaysPreventsPublish": true, "warnRequiresAcknowledgment": true}}'::jsonb,
    CONSTRAINT brands_name_check CHECK ((char_length(name) >= 2)),
    CONSTRAINT brands_status_check CHECK ((status = ANY (ARRAY['draft'::text, 'published'::text, 'archived'::text])))
);


--
-- Name: COLUMN brands.typography; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.brands.typography IS 'Stores the typographic system configuration (fonts, scales, ratios) modeled by TypographySystemSchema.';


--
-- Name: COLUMN brands.logos; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.brands.logos IS 'Stores the logo system assets (Isotype, Lockups, Variants) modeled by LogoSystemSchema.';


--
-- Name: COLUMN brands.rules_engine; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.brands.rules_engine IS 'Stores the rules engine configuration (triggers, conditions, actions) modeled by RulesEngineSchema.';


--
-- Name: communication_entity_links; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.communication_entity_links (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    workspace_id text NOT NULL,
    communication_type text NOT NULL,
    communication_id uuid NOT NULL,
    external_entity_type text NOT NULL,
    external_entity_id text NOT NULL,
    relationship_type text NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT communication_entity_links_communication_type_check CHECK ((communication_type = ANY (ARRAY['contact'::text, 'conversation'::text, 'message'::text])))
);


--
-- Name: communications_ai_feedback; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.communications_ai_feedback (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    workspace_id text NOT NULL,
    event_date date DEFAULT (timezone('utc'::text, now()))::date NOT NULL,
    contact_category text NOT NULL,
    detected_fields text[] DEFAULT '{}'::text[] NOT NULL,
    suggestion_pattern text NOT NULL,
    action text NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT communications_ai_feedback_action_check CHECK ((action = ANY (ARRAY['suggested'::text, 'accepted'::text, 'discarded'::text]))),
    CONSTRAINT communications_ai_feedback_contact_category_check CHECK ((contact_category = ANY (ARRAY['lead'::text, 'client'::text, 'other'::text])))
);


--
-- Name: communications_ai_suggestions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.communications_ai_suggestions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    client_reference text NOT NULL,
    workspace_id text NOT NULL,
    contact_id uuid NOT NULL,
    fields jsonb DEFAULT '{}'::jsonb NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT communications_ai_suggestions_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'accepted'::text, 'discarded'::text])))
);


--
-- Name: communications_attachments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.communications_attachments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    workspace_id text NOT NULL,
    message_id uuid NOT NULL,
    provider_media_id text,
    media_type text NOT NULL,
    mime_type text,
    storage_path text,
    file_size bigint,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT communications_attachments_file_size_check CHECK (((file_size IS NULL) OR (file_size >= 0)))
);


--
-- Name: communications_channels; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.communications_channels (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    workspace_id text NOT NULL,
    contact_id uuid NOT NULL,
    channel_type text DEFAULT 'whatsapp'::text NOT NULL,
    provider text DEFAULT 'whatsapp_cloud'::text NOT NULL,
    phone_e164 text NOT NULL,
    provider_account_id text,
    is_official boolean DEFAULT false NOT NULL,
    is_primary boolean DEFAULT false NOT NULL,
    consent_status text DEFAULT 'unknown'::text NOT NULL,
    consent_source text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT communications_channels_channel_type_check CHECK ((channel_type = 'whatsapp'::text)),
    CONSTRAINT communications_channels_consent_status_check CHECK ((consent_status = ANY (ARRAY['unknown'::text, 'pending'::text, 'granted'::text, 'revoked'::text]))),
    CONSTRAINT communications_channels_provider_check CHECK ((provider = 'whatsapp_cloud'::text))
);


--
-- Name: communications_contacts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.communications_contacts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    workspace_id text NOT NULL,
    phone_e164 text NOT NULL,
    display_name text,
    email text,
    birthdate date,
    status text DEFAULT 'lead'::text NOT NULL,
    consent_status text DEFAULT 'unknown'::text NOT NULL,
    consent_source text,
    metadata jsonb DEFAULT '{}'::jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT communications_contacts_consent_status_check CHECK ((consent_status = ANY (ARRAY['unknown'::text, 'pending'::text, 'granted'::text, 'revoked'::text]))),
    CONSTRAINT communications_contacts_status_check CHECK ((status = ANY (ARRAY['lead'::text, 'client'::text, 'other'::text])))
);


--
-- Name: communications_conversation_imports; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.communications_conversation_imports (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    workspace_id text NOT NULL,
    contact_id uuid NOT NULL,
    migration_id uuid,
    file_name text NOT NULL,
    mime_type text NOT NULL,
    storage_path text,
    parsed_text text,
    summary text,
    status text DEFAULT 'pending'::text NOT NULL,
    error_code text,
    imported_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT communications_conversation_imports_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'processed'::text, 'failed'::text])))
);


--
-- Name: communications_conversations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.communications_conversations (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    workspace_id text NOT NULL,
    contact_id uuid NOT NULL,
    channel_id uuid NOT NULL,
    channel_type text DEFAULT 'whatsapp'::text NOT NULL,
    provider text DEFAULT 'whatsapp_cloud'::text NOT NULL,
    provider_account_id text,
    external_conversation_id text,
    status text DEFAULT 'open'::text NOT NULL,
    assigned_user_id text,
    last_message_at timestamp with time zone,
    window_expires_at timestamp with time zone,
    source text,
    campaign text,
    referrer_code text,
    metadata jsonb DEFAULT '{}'::jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT communications_conversations_channel_type_check CHECK ((channel_type = 'whatsapp'::text)),
    CONSTRAINT communications_conversations_provider_check CHECK ((provider = 'whatsapp_cloud'::text)),
    CONSTRAINT communications_conversations_status_check CHECK ((status = ANY (ARRAY['open'::text, 'pending'::text, 'assigned'::text, 'closed'::text])))
);


--
-- Name: communications_events; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.communications_events (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    workspace_id text NOT NULL,
    event_type text NOT NULL,
    aggregate_type text NOT NULL,
    aggregate_id uuid NOT NULL,
    payload jsonb DEFAULT '{}'::jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


--
-- Name: communications_internal_notes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.communications_internal_notes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    workspace_id text NOT NULL,
    conversation_id uuid NOT NULL,
    message_id uuid,
    author_id text,
    body text NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


--
-- Name: communications_message_statuses; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.communications_message_statuses (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    workspace_id text NOT NULL,
    message_id uuid NOT NULL,
    status text NOT NULL,
    provider_timestamp timestamp with time zone,
    raw_event_id uuid,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT communications_message_statuses_status_check CHECK ((status = ANY (ARRAY['received'::text, 'sending'::text, 'sent'::text, 'delivered'::text, 'read'::text, 'failed'::text])))
);


--
-- Name: communications_messages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.communications_messages (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    workspace_id text NOT NULL,
    conversation_id uuid NOT NULL,
    external_message_id text,
    direction text NOT NULL,
    message_type text NOT NULL,
    status text NOT NULL,
    body text,
    media_reference text,
    template_name text,
    template_language text,
    reply_to_message_id uuid,
    failure_code text,
    provider_timestamp timestamp with time zone,
    metadata jsonb DEFAULT '{}'::jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT communications_messages_direction_check CHECK ((direction = ANY (ARRAY['inbound'::text, 'outbound'::text]))),
    CONSTRAINT communications_messages_message_type_check CHECK ((message_type = ANY (ARRAY['text'::text, 'template'::text, 'image'::text, 'document'::text, 'audio'::text, 'location'::text, 'interactive'::text, 'internal_note'::text]))),
    CONSTRAINT communications_messages_status_check CHECK ((status = ANY (ARRAY['received'::text, 'sending'::text, 'sent'::text, 'delivered'::text, 'read'::text, 'failed'::text])))
);


--
-- Name: communications_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.communications_migrations (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    workspace_id text NOT NULL,
    contact_id uuid NOT NULL,
    personal_channel_id uuid,
    official_channel_id uuid,
    status text DEFAULT 'pending'::text NOT NULL,
    template_id uuid,
    consent_status text DEFAULT 'unknown'::text NOT NULL,
    agent_notified_at timestamp with time zone,
    template_sent_at timestamp with time zone,
    migrated_at timestamp with time zone,
    failure_code text,
    metadata jsonb DEFAULT '{}'::jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT communications_migrations_consent_status_check CHECK ((consent_status = ANY (ARRAY['unknown'::text, 'pending'::text, 'granted'::text, 'revoked'::text]))),
    CONSTRAINT communications_migrations_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'agent_notified'::text, 'template_sent'::text, 'waiting_reply'::text, 'migrated'::text, 'failed'::text])))
);


--
-- Name: communications_templates; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.communications_templates (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    workspace_id text NOT NULL,
    provider text DEFAULT 'whatsapp_cloud'::text NOT NULL,
    name text NOT NULL,
    language text NOT NULL,
    category text,
    status text DEFAULT 'pending'::text NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT communications_templates_provider_check CHECK ((provider = 'whatsapp_cloud'::text)),
    CONSTRAINT communications_templates_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'approved'::text, 'rejected'::text, 'paused'::text])))
);


--
-- Name: communications_webhook_events; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.communications_webhook_events (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    workspace_id text NOT NULL,
    provider text DEFAULT 'whatsapp_cloud'::text NOT NULL,
    provider_event_id text,
    event_type text NOT NULL,
    payload_hash text NOT NULL,
    raw_payload jsonb NOT NULL,
    processing_status text DEFAULT 'received'::text NOT NULL,
    received_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    processed_at timestamp with time zone,
    error_code text,
    retry_count integer DEFAULT 0 NOT NULL,
    CONSTRAINT communications_webhook_events_processing_status_check CHECK ((processing_status = ANY (ARRAY['received'::text, 'processed'::text, 'failed'::text]))),
    CONSTRAINT communications_webhook_events_provider_check CHECK ((provider = 'whatsapp_cloud'::text)),
    CONSTRAINT communications_webhook_events_retry_count_check CHECK ((retry_count >= 0))
);


--
-- Name: marketing_campaign_publications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.marketing_campaign_publications (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    campaign_id text NOT NULL,
    platform text NOT NULL,
    publication_url text NOT NULL,
    external_post_id text,
    account_handle text,
    status text DEFAULT 'published'::text NOT NULL,
    published_at timestamp with time zone,
    link_id text,
    content_id text,
    notes text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT marketing_campaign_publications_platform_check CHECK ((platform = ANY (ARRAY['facebook'::text, 'instagram'::text, 'tiktok'::text, 'youtube'::text, 'linkedin'::text, 'x'::text]))),
    CONSTRAINT marketing_campaign_publications_status_check CHECK ((status = ANY (ARRAY['prepared'::text, 'published'::text, 'archived'::text]))),
    CONSTRAINT marketing_campaign_publications_url_check CHECK ((publication_url ~* '^https?://'::text))
);


--
-- Name: marketing_campaigns; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.marketing_campaigns (
    id text NOT NULL,
    name text NOT NULL,
    objective text,
    status text DEFAULT 'draft'::text,
    start_date date,
    platforms text[] DEFAULT '{}'::text[],
    copies jsonb DEFAULT '{}'::jsonb,
    assets jsonb DEFAULT '[]'::jsonb,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    automatic_platforms text[] DEFAULT '{}'::text[],
    automatic_platforms_configured boolean DEFAULT false,
    content_types text[] DEFAULT '{text}'::text[]
);


--
-- Name: marketing_link_clicks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.marketing_link_clicks (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    link_id text NOT NULL,
    clicked_at timestamp with time zone DEFAULT now() NOT NULL,
    referrer text,
    user_agent text,
    device text,
    country_code text,
    language text,
    browser text,
    operating_system text,
    landing_url text,
    utm_source text,
    utm_medium text,
    utm_campaign text,
    utm_content text,
    redirect_status text DEFAULT 'success'::text NOT NULL,
    CONSTRAINT marketing_link_clicks_country_code_check CHECK (((country_code IS NULL) OR (country_code ~ '^[A-Z]{2}$'::text)))
);


--
-- Name: marketing_links; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.marketing_links (
    id text NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    campaign_id text,
    channel text DEFAULT 'other'::text NOT NULL,
    phone text NOT NULL,
    message text NOT NULL,
    active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    placement text,
    content_id text,
    CONSTRAINT marketing_links_channel_check CHECK ((channel = ANY (ARRAY['tiktok'::text, 'instagram'::text, 'facebook'::text, 'youtube'::text, 'linkedin'::text, 'x'::text, 'other'::text]))),
    CONSTRAINT marketing_links_phone_check CHECK ((phone ~ '^[0-9]{8,15}$'::text)),
    CONSTRAINT marketing_links_slug_check CHECK ((slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'::text))
);


--
-- Name: marketing_link_stats; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.marketing_link_stats WITH (security_invoker='true') AS
 SELECT l.id,
    l.slug,
    (count(c.id))::integer AS clicks,
    max(c.clicked_at) AS last_clicked_at
   FROM (public.marketing_links l
     LEFT JOIN public.marketing_link_clicks c ON ((c.link_id = l.id)))
  GROUP BY l.id, l.slug;


--
-- Name: oauth_connections; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.oauth_connections (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    provider text NOT NULL,
    external_account_id text NOT NULL,
    display_name text,
    scopes text[] DEFAULT '{}'::text[] NOT NULL,
    credential_ref text NOT NULL,
    expires_at timestamp with time zone,
    created_by uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT oauth_connections_provider_check CHECK ((provider = ANY (ARRAY['facebook'::text, 'instagram'::text, 'linkedin'::text, 'youtube'::text, 'x'::text, 'tiktok'::text])))
);


--
-- Name: COLUMN oauth_connections.credential_ref; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.oauth_connections.credential_ref IS 'Referencia a secreto server-side; nunca almacenar aquí access_token ni refresh_token.';


--
-- Name: oauth_states; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.oauth_states (
    state_hash text NOT NULL,
    user_id uuid NOT NULL,
    provider text NOT NULL,
    expires_at timestamp with time zone DEFAULT (now() + '00:10:00'::interval) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT oauth_states_provider_check CHECK ((provider = ANY (ARRAY['facebook'::text, 'instagram'::text, 'linkedin'::text, 'youtube'::text, 'x'::text, 'tiktok'::text])))
);


--
-- Name: quant_assets; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.quant_assets (
    symbol text NOT NULL,
    name text NOT NULL,
    category text NOT NULL,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    providers text[] DEFAULT '{binance}'::text[],
    CONSTRAINT quant_assets_category_check CHECK ((category = ANY (ARRAY['crypto'::text, 'commodity'::text, 'forex'::text, 'index'::text])))
);


--
-- Name: TABLE quant_assets; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.quant_assets IS 'Authorized assets available for trading bot deployment.';


--
-- Name: COLUMN quant_assets.providers; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.quant_assets.providers IS 'List of exchange providers that support this specific asset symbol.';


--
-- Name: quant_audit_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.quant_audit_logs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    bot_id uuid NOT NULL,
    tenant_id uuid DEFAULT '00000000-0000-0000-0000-000000000000'::uuid,
    pair text NOT NULL,
    event_type text NOT NULL,
    side text,
    price bigint NOT NULL,
    pnl_pct numeric(10,4) DEFAULT 0.0,
    logic_snapshot jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: TABLE quant_audit_logs; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.quant_audit_logs IS 'Chronological record of all bot decisions and risk management actions for post-trade analysis.';


--
-- Name: COLUMN quant_audit_logs.price; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.quant_audit_logs.price IS 'Price at the time of the event, stored in cents (BIGINT).';


--
-- Name: COLUMN quant_audit_logs.logic_snapshot; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.quant_audit_logs.logic_snapshot IS 'Complete state of strategy indicators and confluence checks at the moment of the event.';


--
-- Name: quant_book_metrics; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.quant_book_metrics (
    pair text NOT NULL,
    "timestamp" timestamp with time zone NOT NULL,
    imbalance_pct double precision NOT NULL,
    spread_pct double precision NOT NULL,
    mid_price bigint NOT NULL,
    depth_usdt double precision NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb
);

ALTER TABLE ONLY public.quant_book_metrics REPLICA IDENTITY FULL;


--
-- Name: quant_bots; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.quant_bots (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    tenant_id uuid NOT NULL,
    exchange_id uuid,
    name text NOT NULL,
    pair text NOT NULL,
    strategy_id uuid,
    status text DEFAULT 'paper_trading'::text NOT NULL,
    base_investment_usdt numeric NOT NULL,
    risk_profile jsonb DEFAULT '{"maxRebuys": 3, "maxDailyLossPct": 2, "maxExposureUsdt": 100, "globalStopLossPct": 5}'::jsonb NOT NULL,
    use_initial_range_filter boolean DEFAULT true,
    use_market_regime_filter boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    current_action text DEFAULT 'Engine_Idle'::text,
    last_logic_snapshot jsonb DEFAULT '{}'::jsonb,
    last_exit_targets jsonb DEFAULT '{}'::jsonb,
    current_pnl_pct numeric DEFAULT 0.0,
    current_pnl_usdt numeric DEFAULT 0.0,
    current_entry_price numeric DEFAULT 0.0,
    current_position_opened_at timestamp with time zone,
    last_price numeric(20,8),
    last_sma numeric(20,8),
    last_atr numeric(20,8),
    last_sentiment character varying(50),
    last_metrics_update timestamp with time zone,
    signal_strength integer DEFAULT 0,
    total_trades integer DEFAULT 0,
    winning_trades integer DEFAULT 0,
    losing_trades integer DEFAULT 0,
    avg_pnl_pct numeric DEFAULT 0,
    pending_command text,
    price_history_1h jsonb DEFAULT '[]'::jsonb,
    current_position_max_price bigint DEFAULT 0,
    trailing_stop_distance numeric DEFAULT 1.0,
    current_position_side text,
    current_position_min_price bigint DEFAULT 0
);


--
-- Name: TABLE quant_bots; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.quant_bots IS 'Main configuration table for trading bots.';


--
-- Name: COLUMN quant_bots.strategy_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.quant_bots.strategy_id IS 'Formal reference to the trading protocol blueprint.';


--
-- Name: COLUMN quant_bots.current_action; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.quant_bots.current_action IS 'Narrative of what the bot is doing in its current loop (e.g., Scanning Market, Awaiting Signal).';


--
-- Name: COLUMN quant_bots.last_logic_snapshot; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.quant_bots.last_logic_snapshot IS 'Real-time indicators and strategy math (SMA, ATR, RSI, etc.) for UI visualization.';


--
-- Name: COLUMN quant_bots.last_exit_targets; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.quant_bots.last_exit_targets IS 'Current Stop Loss and Take Profit price targets for the open position.';


--
-- Name: COLUMN quant_bots.current_pnl_pct; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.quant_bots.current_pnl_pct IS 'Latest calculated PnL percentage for the active position.';


--
-- Name: COLUMN quant_bots.current_pnl_usdt; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.quant_bots.current_pnl_usdt IS 'Latest calculated PnL value in USDT for the active position.';


--
-- Name: COLUMN quant_bots.current_entry_price; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.quant_bots.current_entry_price IS 'The price at which the bot opened the current active position.';


--
-- Name: COLUMN quant_bots.current_position_opened_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.quant_bots.current_position_opened_at IS 'The exact timestamp when the current active position was opened.';


--
-- Name: COLUMN quant_bots.last_price; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.quant_bots.last_price IS 'The most recent price fetched from the exchange for this trading pair.';


--
-- Name: COLUMN quant_bots.last_sma; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.quant_bots.last_sma IS 'The Simple Moving Average (20 periods) calculated from the last 60 candles.';


--
-- Name: COLUMN quant_bots.last_atr; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.quant_bots.last_atr IS 'The Average True Range (14 periods) for volatility measurement.';


--
-- Name: COLUMN quant_bots.last_sentiment; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.quant_bots.last_sentiment IS 'Market sentiment derived from macro analysis or market regime detection (bullish/bearish/neutral).';


--
-- Name: COLUMN quant_bots.last_metrics_update; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.quant_bots.last_metrics_update IS 'Timestamp when these metrics were last updated by the backend strategy manager.';


--
-- Name: COLUMN quant_bots.signal_strength; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.quant_bots.signal_strength IS 'Real-time proximity to a trade signal (0-100). Managed by Tier B Engine.';


--
-- Name: COLUMN quant_bots.total_trades; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.quant_bots.total_trades IS 'Contador de operaciones cerradas en la sesión actual.';


--
-- Name: COLUMN quant_bots.winning_trades; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.quant_bots.winning_trades IS 'Operaciones cerradas con PnL > 0.';


--
-- Name: COLUMN quant_bots.losing_trades; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.quant_bots.losing_trades IS 'Operaciones cerradas con PnL <= 0.';


--
-- Name: COLUMN quant_bots.avg_pnl_pct; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.quant_bots.avg_pnl_pct IS 'Promedio de beneficio porcentual de la sesión activa.';


--
-- Name: COLUMN quant_bots.pending_command; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.quant_bots.pending_command IS 'Bus de comandos para intervenciones manuales (MARKET_EXIT, TP_NOW, MOVE_TO_BE).';


--
-- Name: COLUMN quant_bots.price_history_1h; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.quant_bots.price_history_1h IS 'Array de los últimos 20-30 precios de cierre para el gráfico Sparkline de la UI.';


--
-- Name: COLUMN quant_bots.current_position_max_price; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.quant_bots.current_position_max_price IS 'El precio más alto (en centavos) alcanzado por el par desde que se abrió la posición actual.';


--
-- Name: COLUMN quant_bots.trailing_stop_distance; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.quant_bots.trailing_stop_distance IS 'Distancia porcentual (Callback Rate) para el Trailing Stop. Ej: 1.0 = 1% de distancia del pico máximo.';


--
-- Name: COLUMN quant_bots.current_position_side; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.quant_bots.current_position_side IS 'Indica la dirección de la operación abierta: LONG o SHORT.';


--
-- Name: COLUMN quant_bots.current_position_min_price; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.quant_bots.current_position_min_price IS 'Tracks the lowest price reached during a SHORT position for trailing stop calculations.';


--
-- Name: quant_exchanges; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.quant_exchanges (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    tenant_id uuid NOT NULL,
    name text NOT NULL,
    exchange_provider text DEFAULT 'binance'::text NOT NULL,
    api_key text NOT NULL,
    api_secret text NOT NULL,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    last_verified_at timestamp with time zone,
    last_error_message text,
    is_paper boolean DEFAULT false
);


--
-- Name: TABLE quant_exchanges; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.quant_exchanges IS 'Stores exchange credentials. API Keys are encrypted via public.encrypt_api_key.';


--
-- Name: COLUMN quant_exchanges.api_key; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.quant_exchanges.api_key IS 'Store only base64 encoded pgcrypto strings encrypted via quant_security functions.';


--
-- Name: COLUMN quant_exchanges.api_secret; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.quant_exchanges.api_secret IS 'Store only base64 encoded pgcrypto strings encrypted via quant_security functions.';


--
-- Name: COLUMN quant_exchanges.last_verified_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.quant_exchanges.last_verified_at IS 'The last time the credentials were successfully or unsuccessfully tested against the exchange API.';


--
-- Name: COLUMN quant_exchanges.last_error_message; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.quant_exchanges.last_error_message IS 'Stores the last error response from the broker (e.g., "Invalid API Key").';


--
-- Name: COLUMN quant_exchanges.is_paper; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.quant_exchanges.is_paper IS 'If true, the bot will use Sandbox/Testnet mode for this exchange account.';


--
-- Name: quant_market_config; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.quant_market_config (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    pair character varying(20) NOT NULL,
    is_active boolean DEFAULT true,
    retention_days integer DEFAULT 30,
    fetch_interval character varying(5) DEFAULT '1m'::character varying,
    last_backfill_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: TABLE quant_market_config; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.quant_market_config IS 'Control panel for the Market Ingestor service. Defines which pairs to monitor 24/7.';


--
-- Name: COLUMN quant_market_config.pair; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.quant_market_config.pair IS 'Trading pair identifier (Binance Standard).';


--
-- Name: quant_market_history; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.quant_market_history (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    pair character varying(20) NOT NULL,
    environment public.trading_environment DEFAULT 'testnet'::public.trading_environment NOT NULL,
    timeframe character varying(5) NOT NULL,
    open bigint NOT NULL,
    high bigint NOT NULL,
    low bigint NOT NULL,
    close bigint NOT NULL,
    volume numeric NOT NULL,
    "timestamp" timestamp with time zone NOT NULL,
    provider character varying(20) DEFAULT 'binance'::character varying,
    created_at timestamp with time zone DEFAULT now(),
    latency_ms integer DEFAULT 0
);


--
-- Name: TABLE quant_market_history; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.quant_market_history IS 'Unified time-series storage for market candles (Testnet & Production).';


--
-- Name: COLUMN quant_market_history.environment; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.quant_market_history.environment IS 'Separates simulation data from real market data to prevent strategy contamination.';


--
-- Name: COLUMN quant_market_history.latency_ms; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.quant_market_history.latency_ms IS 'Tiempo de respuesta del exchange en milisegundos.';


--
-- Name: quant_orders; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.quant_orders (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    tenant_id uuid NOT NULL,
    bot_id uuid,
    exchange_order_id text,
    side text NOT NULL,
    type text NOT NULL,
    status text NOT NULL,
    quantity numeric NOT NULL,
    price numeric,
    filled_quantity numeric DEFAULT 0,
    average_fill_price numeric,
    fee_amount numeric,
    fee_currency text,
    signal_source text,
    error_message text,
    created_at timestamp with time zone DEFAULT now(),
    fee_usdt bigint DEFAULT 0,
    pnl_pct numeric DEFAULT 0,
    signal_id uuid
);


--
-- Name: TABLE quant_orders; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.quant_orders IS 'Full history of orders sent to exchanges.';


--
-- Name: COLUMN quant_orders.fee_usdt; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.quant_orders.fee_usdt IS 'Comisión de la operación en centavos.';


--
-- Name: COLUMN quant_orders.pnl_pct; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.quant_orders.pnl_pct IS 'Resultado porcentual de la operación (solo para cierres).';


--
-- Name: COLUMN quant_orders.signal_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.quant_orders.signal_id IS 'ID de la señal que originó esta orden (Vínculo Tier B -> Tier C).';


--
-- Name: quant_positions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.quant_positions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    tenant_id uuid NOT NULL,
    bot_id uuid,
    pair text NOT NULL,
    entry_price numeric NOT NULL,
    average_price numeric NOT NULL,
    total_quantity numeric NOT NULL,
    total_invested_usdt numeric NOT NULL,
    rebuys_count integer DEFAULT 0,
    unrealized_pnl_usdt numeric DEFAULT 0,
    unrealized_pnl_pct numeric DEFAULT 0,
    last_updated timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: TABLE quant_positions; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.quant_positions IS 'Dynamic state of active trading positions for real-time monitoring.';


--
-- Name: COLUMN quant_positions.created_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.quant_positions.created_at IS 'The timestamp when the position was first opened.';


--
-- Name: quant_risk_settings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.quant_risk_settings (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    tenant_id uuid NOT NULL,
    kill_switch_active boolean DEFAULT false,
    max_daily_loss_usdt numeric DEFAULT 500.0,
    max_total_exposure_usdt numeric DEFAULT 5000.0,
    max_concurrent_bots integer DEFAULT 10,
    alert_threshold_pct numeric DEFAULT 80.0,
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: TABLE quant_risk_settings; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.quant_risk_settings IS 'Global safety and risk governance parameters for the trading engine.';


--
-- Name: quant_signals; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.quant_signals (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    tenant_id uuid NOT NULL,
    bot_id uuid,
    pair character varying(20) NOT NULL,
    side character varying(10) NOT NULL,
    price bigint NOT NULL,
    environment public.trading_environment DEFAULT 'testnet'::public.trading_environment NOT NULL,
    status character varying(20) DEFAULT 'PENDING'::character varying NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT quant_signals_side_check CHECK (((side)::text = ANY ((ARRAY['BUY'::character varying, 'SELL'::character varying, 'EXIT'::character varying, 'SHORT'::character varying])::text[]))),
    CONSTRAINT quant_signals_status_check CHECK (((status)::text = ANY ((ARRAY['PENDING'::character varying, 'EXECUTED'::character varying, 'REJECTED'::character varying, 'EXPIRED'::character varying])::text[])))
);


--
-- Name: TABLE quant_signals; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.quant_signals IS 'Decoupled signals generated by the Signal Engine (Tier B). Consumed by Execution Manager (Tier C).';


--
-- Name: COLUMN quant_signals.side; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.quant_signals.side IS 'Dirección de la señal: BUY (Long), SHORT (Venta en corto), EXIT (Cierre).';


--
-- Name: COLUMN quant_signals.price; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.quant_signals.price IS 'Price in Cents (e.g., 7042068 = $704.2068).';


--
-- Name: quant_strategies; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.quant_strategies (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    tenant_id uuid NOT NULL,
    exchange_id uuid,
    name text NOT NULL,
    description text,
    mode text NOT NULL,
    status text DEFAULT 'draft'::text NOT NULL,
    pairs text[] DEFAULT '{}'::text[],
    size_per_trade numeric DEFAULT 100 NOT NULL,
    max_positions integer DEFAULT 5 NOT NULL,
    max_exposure numeric DEFAULT 1000 NOT NULL,
    stop_loss numeric DEFAULT 2.0 NOT NULL,
    take_profit numeric DEFAULT 5.0 NOT NULL,
    trailing_stop numeric DEFAULT 0.0,
    cooldown_minutes integer DEFAULT 60,
    daily_loss_limit numeric DEFAULT 5.0,
    version integer DEFAULT 1,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    core_id text DEFAULT 'atr-breakout-v1'::text NOT NULL,
    parameters jsonb DEFAULT '{}'::jsonb,
    trading_style text DEFAULT 'DAY_TRADING'::text,
    CONSTRAINT quant_strategies_mode_check CHECK ((mode = ANY (ARRAY['paper'::text, 'live'::text]))),
    CONSTRAINT quant_strategies_status_check CHECK ((status = ANY (ARRAY['draft'::text, 'active'::text, 'paused'::text, 'archived'::text])))
);


--
-- Name: TABLE quant_strategies; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.quant_strategies IS 'Trading logic definitions and risk parameters.';


--
-- Name: COLUMN quant_strategies.core_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.quant_strategies.core_id IS 'Identifier of the Python logic engine to execute.';


--
-- Name: COLUMN quant_strategies.parameters; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.quant_strategies.parameters IS 'Strategy-specific settings (e.g., RSI periods, multiplier values).';


--
-- Name: COLUMN quant_strategies.trading_style; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.quant_strategies.trading_style IS 'Define el horizonte temporal y agresividad: SCALPING, DAY_TRADING, SWING.';


--
-- Name: quant_system_health; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.quant_system_health (
    component_id text NOT NULL,
    last_heartbeat timestamp with time zone DEFAULT now(),
    status text DEFAULT 'ONLINE'::text,
    metadata jsonb DEFAULT '{}'::jsonb
);

ALTER TABLE ONLY public.quant_system_health REPLICA IDENTITY FULL;


--
-- Name: social_profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.social_profiles (
    platform text NOT NULL,
    url text NOT NULL,
    username text,
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: strategy_backtest_results; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.strategy_backtest_results (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    strategy_id uuid NOT NULL,
    start_date date NOT NULL,
    end_date date NOT NULL,
    status text DEFAULT 'completed'::text,
    initial_capital numeric NOT NULL,
    final_capital numeric NOT NULL,
    total_return numeric NOT NULL,
    total_trades integer NOT NULL,
    winning_trades integer NOT NULL,
    losing_trades integer NOT NULL,
    win_rate numeric NOT NULL,
    max_drawdown numeric NOT NULL,
    profit_factor numeric NOT NULL,
    sharpe_ratio numeric,
    avg_win numeric,
    avg_loss numeric,
    trades jsonb DEFAULT '[]'::jsonb,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: TABLE strategy_backtest_results; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.strategy_backtest_results IS 'Historical performance data for strategy simulations.';


--
-- Name: tenants; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tenants (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: user_roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_roles (
    user_id uuid NOT NULL,
    role text DEFAULT 'editor'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT user_roles_role_check CHECK ((role = ANY (ARRAY['admin'::text, 'editor'::text, 'viewer'::text])))
);


--
-- Name: brands brands_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.brands
    ADD CONSTRAINT brands_pkey PRIMARY KEY (id);


--
-- Name: communication_entity_links communication_entity_links_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.communication_entity_links
    ADD CONSTRAINT communication_entity_links_pkey PRIMARY KEY (id);


--
-- Name: communication_entity_links communication_entity_links_workspace_id_communication_type__key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.communication_entity_links
    ADD CONSTRAINT communication_entity_links_workspace_id_communication_type__key UNIQUE (workspace_id, communication_type, communication_id, external_entity_type, external_entity_id, relationship_type);


--
-- Name: communications_ai_feedback communications_ai_feedback_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.communications_ai_feedback
    ADD CONSTRAINT communications_ai_feedback_pkey PRIMARY KEY (id);


--
-- Name: communications_ai_suggestions communications_ai_suggestions_client_reference_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.communications_ai_suggestions
    ADD CONSTRAINT communications_ai_suggestions_client_reference_key UNIQUE (client_reference);


--
-- Name: communications_ai_suggestions communications_ai_suggestions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.communications_ai_suggestions
    ADD CONSTRAINT communications_ai_suggestions_pkey PRIMARY KEY (id);


--
-- Name: communications_attachments communications_attachments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.communications_attachments
    ADD CONSTRAINT communications_attachments_pkey PRIMARY KEY (id);


--
-- Name: communications_channels communications_channels_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.communications_channels
    ADD CONSTRAINT communications_channels_pkey PRIMARY KEY (id);


--
-- Name: communications_channels communications_channels_workspace_id_provider_phone_e164_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.communications_channels
    ADD CONSTRAINT communications_channels_workspace_id_provider_phone_e164_key UNIQUE (workspace_id, provider, phone_e164);


--
-- Name: communications_contacts communications_contacts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.communications_contacts
    ADD CONSTRAINT communications_contacts_pkey PRIMARY KEY (id);


--
-- Name: communications_contacts communications_contacts_workspace_id_phone_e164_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.communications_contacts
    ADD CONSTRAINT communications_contacts_workspace_id_phone_e164_key UNIQUE (workspace_id, phone_e164);


--
-- Name: communications_conversation_imports communications_conversation_imports_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.communications_conversation_imports
    ADD CONSTRAINT communications_conversation_imports_pkey PRIMARY KEY (id);


--
-- Name: communications_conversations communications_conversations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.communications_conversations
    ADD CONSTRAINT communications_conversations_pkey PRIMARY KEY (id);


--
-- Name: communications_conversations communications_conversations_workspace_id_provider_external_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.communications_conversations
    ADD CONSTRAINT communications_conversations_workspace_id_provider_external_key UNIQUE (workspace_id, provider, external_conversation_id);


--
-- Name: communications_events communications_events_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.communications_events
    ADD CONSTRAINT communications_events_pkey PRIMARY KEY (id);


--
-- Name: communications_internal_notes communications_internal_notes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.communications_internal_notes
    ADD CONSTRAINT communications_internal_notes_pkey PRIMARY KEY (id);


--
-- Name: communications_message_statuses communications_message_statuses_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.communications_message_statuses
    ADD CONSTRAINT communications_message_statuses_pkey PRIMARY KEY (id);


--
-- Name: communications_messages communications_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.communications_messages
    ADD CONSTRAINT communications_messages_pkey PRIMARY KEY (id);


--
-- Name: communications_messages communications_messages_workspace_id_external_message_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.communications_messages
    ADD CONSTRAINT communications_messages_workspace_id_external_message_id_key UNIQUE (workspace_id, external_message_id);


--
-- Name: communications_migrations communications_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.communications_migrations
    ADD CONSTRAINT communications_migrations_pkey PRIMARY KEY (id);


--
-- Name: communications_templates communications_templates_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.communications_templates
    ADD CONSTRAINT communications_templates_pkey PRIMARY KEY (id);


--
-- Name: communications_templates communications_templates_workspace_id_provider_name_languag_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.communications_templates
    ADD CONSTRAINT communications_templates_workspace_id_provider_name_languag_key UNIQUE (workspace_id, provider, name, language);


--
-- Name: communications_webhook_events communications_webhook_events_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.communications_webhook_events
    ADD CONSTRAINT communications_webhook_events_pkey PRIMARY KEY (id);


--
-- Name: communications_webhook_events communications_webhook_events_workspace_id_provider_payload_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.communications_webhook_events
    ADD CONSTRAINT communications_webhook_events_workspace_id_provider_payload_key UNIQUE (workspace_id, provider, payload_hash);


--
-- Name: marketing_campaign_publications marketing_campaign_publications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.marketing_campaign_publications
    ADD CONSTRAINT marketing_campaign_publications_pkey PRIMARY KEY (id);


--
-- Name: marketing_campaigns marketing_campaigns_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.marketing_campaigns
    ADD CONSTRAINT marketing_campaigns_pkey PRIMARY KEY (id);


--
-- Name: marketing_link_clicks marketing_link_clicks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.marketing_link_clicks
    ADD CONSTRAINT marketing_link_clicks_pkey PRIMARY KEY (id);


--
-- Name: marketing_links marketing_links_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.marketing_links
    ADD CONSTRAINT marketing_links_pkey PRIMARY KEY (id);


--
-- Name: marketing_links marketing_links_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.marketing_links
    ADD CONSTRAINT marketing_links_slug_key UNIQUE (slug);


--
-- Name: oauth_connections oauth_connections_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.oauth_connections
    ADD CONSTRAINT oauth_connections_pkey PRIMARY KEY (id);


--
-- Name: oauth_connections oauth_connections_provider_external_account_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.oauth_connections
    ADD CONSTRAINT oauth_connections_provider_external_account_id_key UNIQUE (provider, external_account_id);


--
-- Name: oauth_states oauth_states_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.oauth_states
    ADD CONSTRAINT oauth_states_pkey PRIMARY KEY (state_hash);


--
-- Name: quant_assets quant_assets_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quant_assets
    ADD CONSTRAINT quant_assets_pkey PRIMARY KEY (symbol);


--
-- Name: quant_audit_logs quant_audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quant_audit_logs
    ADD CONSTRAINT quant_audit_logs_pkey PRIMARY KEY (id);


--
-- Name: quant_book_metrics quant_book_metrics_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quant_book_metrics
    ADD CONSTRAINT quant_book_metrics_pkey PRIMARY KEY (pair, "timestamp");


--
-- Name: quant_bots quant_bots_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quant_bots
    ADD CONSTRAINT quant_bots_pkey PRIMARY KEY (id);


--
-- Name: quant_exchanges quant_exchanges_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quant_exchanges
    ADD CONSTRAINT quant_exchanges_pkey PRIMARY KEY (id);


--
-- Name: quant_market_config quant_market_config_pair_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quant_market_config
    ADD CONSTRAINT quant_market_config_pair_key UNIQUE (pair);


--
-- Name: quant_market_config quant_market_config_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quant_market_config
    ADD CONSTRAINT quant_market_config_pkey PRIMARY KEY (id);


--
-- Name: quant_market_history quant_market_history_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quant_market_history
    ADD CONSTRAINT quant_market_history_pkey PRIMARY KEY (id);


--
-- Name: quant_orders quant_orders_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quant_orders
    ADD CONSTRAINT quant_orders_pkey PRIMARY KEY (id);


--
-- Name: quant_positions quant_positions_bot_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quant_positions
    ADD CONSTRAINT quant_positions_bot_id_key UNIQUE (bot_id);


--
-- Name: quant_positions quant_positions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quant_positions
    ADD CONSTRAINT quant_positions_pkey PRIMARY KEY (id);


--
-- Name: quant_risk_settings quant_risk_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quant_risk_settings
    ADD CONSTRAINT quant_risk_settings_pkey PRIMARY KEY (id);


--
-- Name: quant_risk_settings quant_risk_settings_tenant_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quant_risk_settings
    ADD CONSTRAINT quant_risk_settings_tenant_id_key UNIQUE (tenant_id);


--
-- Name: quant_signals quant_signals_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quant_signals
    ADD CONSTRAINT quant_signals_pkey PRIMARY KEY (id);


--
-- Name: quant_strategies quant_strategies_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quant_strategies
    ADD CONSTRAINT quant_strategies_pkey PRIMARY KEY (id);


--
-- Name: quant_system_health quant_system_health_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quant_system_health
    ADD CONSTRAINT quant_system_health_pkey PRIMARY KEY (component_id);


--
-- Name: social_profiles social_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.social_profiles
    ADD CONSTRAINT social_profiles_pkey PRIMARY KEY (platform);


--
-- Name: strategy_backtest_results strategy_backtest_results_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.strategy_backtest_results
    ADD CONSTRAINT strategy_backtest_results_pkey PRIMARY KEY (id);


--
-- Name: tenants tenants_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tenants
    ADD CONSTRAINT tenants_pkey PRIMARY KEY (id);


--
-- Name: tenants tenants_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tenants
    ADD CONSTRAINT tenants_slug_key UNIQUE (slug);


--
-- Name: quant_market_history unique_market_tick; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quant_market_history
    ADD CONSTRAINT unique_market_tick UNIQUE (pair, environment, timeframe, "timestamp");


--
-- Name: user_roles user_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY (user_id);


--
-- Name: communications_ai_feedback_reporting_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX communications_ai_feedback_reporting_idx ON public.communications_ai_feedback USING btree (workspace_id, event_date, action);


--
-- Name: communications_ai_suggestions_contact_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX communications_ai_suggestions_contact_idx ON public.communications_ai_suggestions USING btree (workspace_id, contact_id, created_at DESC);


--
-- Name: communications_channels_contact_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX communications_channels_contact_idx ON public.communications_channels USING btree (workspace_id, contact_id);


--
-- Name: communications_conversations_inbox_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX communications_conversations_inbox_idx ON public.communications_conversations USING btree (workspace_id, status, last_message_at DESC);


--
-- Name: communications_entity_links_external_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX communications_entity_links_external_idx ON public.communication_entity_links USING btree (workspace_id, external_entity_type, external_entity_id);


--
-- Name: communications_messages_conversation_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX communications_messages_conversation_idx ON public.communications_messages USING btree (workspace_id, conversation_id, created_at);


--
-- Name: communications_migrations_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX communications_migrations_status_idx ON public.communications_migrations USING btree (workspace_id, status, updated_at DESC);


--
-- Name: communications_webhook_events_processing_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX communications_webhook_events_processing_idx ON public.communications_webhook_events USING btree (workspace_id, processing_status, received_at);


--
-- Name: idx_audit_logs_bot_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_audit_logs_bot_id ON public.quant_audit_logs USING btree (bot_id);


--
-- Name: idx_audit_logs_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_audit_logs_created_at ON public.quant_audit_logs USING btree (created_at DESC);


--
-- Name: idx_audit_logs_event_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_audit_logs_event_type ON public.quant_audit_logs USING btree (event_type);


--
-- Name: idx_book_metrics_timestamp; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_book_metrics_timestamp ON public.quant_book_metrics USING btree ("timestamp" DESC);


--
-- Name: idx_brands_tenant; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_brands_tenant ON public.brands USING btree (tenant_id);


--
-- Name: idx_market_history_audit_time_lookup; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_market_history_audit_time_lookup ON public.quant_market_history USING btree (timeframe, "timestamp" DESC);


--
-- Name: idx_market_history_pair_ts; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_market_history_pair_ts ON public.quant_market_history USING btree (pair, timeframe, "timestamp" DESC);


--
-- Name: idx_market_history_query; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_market_history_query ON public.quant_market_history USING btree (pair, environment, timeframe, "timestamp" DESC);


--
-- Name: idx_market_history_sentinel_sync; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_market_history_sentinel_sync ON public.quant_market_history USING btree (pair, timeframe, "timestamp");


--
-- Name: idx_market_history_strategy_fast_lookup; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_market_history_strategy_fast_lookup ON public.quant_market_history USING btree (pair, timeframe, environment, "timestamp" DESC);


--
-- Name: idx_quant_bots_last_price; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_quant_bots_last_price ON public.quant_bots USING btree (last_price);


--
-- Name: idx_quant_bots_metrics_update; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_quant_bots_metrics_update ON public.quant_bots USING btree (last_metrics_update DESC);


--
-- Name: idx_quant_bots_strategy_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_quant_bots_strategy_id ON public.quant_bots USING btree (strategy_id);


--
-- Name: idx_signals_pending; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_signals_pending ON public.quant_signals USING btree (status, created_at DESC) WHERE ((status)::text = 'PENDING'::text);


--
-- Name: marketing_campaign_publications_campaign_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX marketing_campaign_publications_campaign_idx ON public.marketing_campaign_publications USING btree (campaign_id);


--
-- Name: marketing_campaign_publications_external_post_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX marketing_campaign_publications_external_post_idx ON public.marketing_campaign_publications USING btree (platform, external_post_id) WHERE (external_post_id IS NOT NULL);


--
-- Name: marketing_campaign_publications_platform_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX marketing_campaign_publications_platform_idx ON public.marketing_campaign_publications USING btree (platform);


--
-- Name: marketing_link_clicks_clicked_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX marketing_link_clicks_clicked_at_idx ON public.marketing_link_clicks USING btree (clicked_at);


--
-- Name: marketing_link_clicks_country_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX marketing_link_clicks_country_idx ON public.marketing_link_clicks USING btree (country_code);


--
-- Name: marketing_link_clicks_landing_url_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX marketing_link_clicks_landing_url_idx ON public.marketing_link_clicks USING btree (landing_url);


--
-- Name: marketing_link_clicks_link_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX marketing_link_clicks_link_id_idx ON public.marketing_link_clicks USING btree (link_id);


--
-- Name: marketing_link_clicks_utm_campaign_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX marketing_link_clicks_utm_campaign_idx ON public.marketing_link_clicks USING btree (utm_campaign);


--
-- Name: marketing_links_active_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX marketing_links_active_idx ON public.marketing_links USING btree (active);


--
-- Name: marketing_links_campaign_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX marketing_links_campaign_id_idx ON public.marketing_links USING btree (campaign_id);


--
-- Name: communications_channels communications_channels_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER communications_channels_updated_at BEFORE UPDATE ON public.communications_channels FOR EACH ROW EXECUTE FUNCTION public.communications_set_updated_at();


--
-- Name: communications_contacts communications_contacts_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER communications_contacts_updated_at BEFORE UPDATE ON public.communications_contacts FOR EACH ROW EXECUTE FUNCTION public.communications_set_updated_at();


--
-- Name: communications_conversation_imports communications_conversation_imports_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER communications_conversation_imports_updated_at BEFORE UPDATE ON public.communications_conversation_imports FOR EACH ROW EXECUTE FUNCTION public.communications_set_updated_at();


--
-- Name: communications_conversations communications_conversations_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER communications_conversations_updated_at BEFORE UPDATE ON public.communications_conversations FOR EACH ROW EXECUTE FUNCTION public.communications_set_updated_at();


--
-- Name: communications_messages communications_messages_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER communications_messages_updated_at BEFORE UPDATE ON public.communications_messages FOR EACH ROW EXECUTE FUNCTION public.communications_set_updated_at();


--
-- Name: communications_migrations communications_migrations_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER communications_migrations_updated_at BEFORE UPDATE ON public.communications_migrations FOR EACH ROW EXECUTE FUNCTION public.communications_set_updated_at();


--
-- Name: communications_templates communications_templates_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER communications_templates_updated_at BEFORE UPDATE ON public.communications_templates FOR EACH ROW EXECUTE FUNCTION public.communications_set_updated_at();


--
-- Name: quant_bots update_quant_bots_modtime; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_quant_bots_modtime BEFORE UPDATE ON public.quant_bots FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: quant_exchanges update_quant_exchanges_modtime; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_quant_exchanges_modtime BEFORE UPDATE ON public.quant_exchanges FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: quant_market_config update_quant_market_config_modtime; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_quant_market_config_modtime BEFORE UPDATE ON public.quant_market_config FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: quant_strategies update_quant_strategies_modtime; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_quant_strategies_modtime BEFORE UPDATE ON public.quant_strategies FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: communications_ai_suggestions communications_ai_suggestions_contact_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.communications_ai_suggestions
    ADD CONSTRAINT communications_ai_suggestions_contact_id_fkey FOREIGN KEY (contact_id) REFERENCES public.communications_contacts(id) ON DELETE CASCADE;


--
-- Name: communications_attachments communications_attachments_message_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.communications_attachments
    ADD CONSTRAINT communications_attachments_message_id_fkey FOREIGN KEY (message_id) REFERENCES public.communications_messages(id) ON DELETE CASCADE;


--
-- Name: communications_channels communications_channels_contact_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.communications_channels
    ADD CONSTRAINT communications_channels_contact_id_fkey FOREIGN KEY (contact_id) REFERENCES public.communications_contacts(id) ON DELETE CASCADE;


--
-- Name: communications_conversation_imports communications_conversation_imports_contact_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.communications_conversation_imports
    ADD CONSTRAINT communications_conversation_imports_contact_id_fkey FOREIGN KEY (contact_id) REFERENCES public.communications_contacts(id) ON DELETE CASCADE;


--
-- Name: communications_conversation_imports communications_conversation_imports_migration_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.communications_conversation_imports
    ADD CONSTRAINT communications_conversation_imports_migration_id_fkey FOREIGN KEY (migration_id) REFERENCES public.communications_migrations(id) ON DELETE SET NULL;


--
-- Name: communications_conversations communications_conversations_channel_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.communications_conversations
    ADD CONSTRAINT communications_conversations_channel_id_fkey FOREIGN KEY (channel_id) REFERENCES public.communications_channels(id) ON DELETE RESTRICT;


--
-- Name: communications_conversations communications_conversations_contact_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.communications_conversations
    ADD CONSTRAINT communications_conversations_contact_id_fkey FOREIGN KEY (contact_id) REFERENCES public.communications_contacts(id) ON DELETE CASCADE;


--
-- Name: communications_internal_notes communications_internal_notes_conversation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.communications_internal_notes
    ADD CONSTRAINT communications_internal_notes_conversation_id_fkey FOREIGN KEY (conversation_id) REFERENCES public.communications_conversations(id) ON DELETE CASCADE;


--
-- Name: communications_internal_notes communications_internal_notes_message_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.communications_internal_notes
    ADD CONSTRAINT communications_internal_notes_message_id_fkey FOREIGN KEY (message_id) REFERENCES public.communications_messages(id) ON DELETE SET NULL;


--
-- Name: communications_message_statuses communications_message_statuses_message_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.communications_message_statuses
    ADD CONSTRAINT communications_message_statuses_message_id_fkey FOREIGN KEY (message_id) REFERENCES public.communications_messages(id) ON DELETE CASCADE;


--
-- Name: communications_message_statuses communications_message_statuses_raw_event_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.communications_message_statuses
    ADD CONSTRAINT communications_message_statuses_raw_event_id_fkey FOREIGN KEY (raw_event_id) REFERENCES public.communications_webhook_events(id) ON DELETE SET NULL;


--
-- Name: communications_messages communications_messages_conversation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.communications_messages
    ADD CONSTRAINT communications_messages_conversation_id_fkey FOREIGN KEY (conversation_id) REFERENCES public.communications_conversations(id) ON DELETE CASCADE;


--
-- Name: communications_messages communications_messages_reply_to_message_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.communications_messages
    ADD CONSTRAINT communications_messages_reply_to_message_id_fkey FOREIGN KEY (reply_to_message_id) REFERENCES public.communications_messages(id) ON DELETE SET NULL;


--
-- Name: communications_migrations communications_migrations_contact_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.communications_migrations
    ADD CONSTRAINT communications_migrations_contact_id_fkey FOREIGN KEY (contact_id) REFERENCES public.communications_contacts(id) ON DELETE CASCADE;


--
-- Name: communications_migrations communications_migrations_official_channel_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.communications_migrations
    ADD CONSTRAINT communications_migrations_official_channel_id_fkey FOREIGN KEY (official_channel_id) REFERENCES public.communications_channels(id) ON DELETE SET NULL;


--
-- Name: communications_migrations communications_migrations_personal_channel_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.communications_migrations
    ADD CONSTRAINT communications_migrations_personal_channel_id_fkey FOREIGN KEY (personal_channel_id) REFERENCES public.communications_channels(id) ON DELETE SET NULL;


--
-- Name: communications_migrations communications_migrations_template_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.communications_migrations
    ADD CONSTRAINT communications_migrations_template_id_fkey FOREIGN KEY (template_id) REFERENCES public.communications_templates(id) ON DELETE SET NULL;


--
-- Name: quant_bots fk_bot_strategy; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quant_bots
    ADD CONSTRAINT fk_bot_strategy FOREIGN KEY (strategy_id) REFERENCES public.quant_strategies(id) ON DELETE SET NULL;


--
-- Name: marketing_campaign_publications marketing_campaign_publications_campaign_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.marketing_campaign_publications
    ADD CONSTRAINT marketing_campaign_publications_campaign_id_fkey FOREIGN KEY (campaign_id) REFERENCES public.marketing_campaigns(id) ON DELETE CASCADE;


--
-- Name: marketing_campaign_publications marketing_campaign_publications_link_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.marketing_campaign_publications
    ADD CONSTRAINT marketing_campaign_publications_link_id_fkey FOREIGN KEY (link_id) REFERENCES public.marketing_links(id) ON DELETE SET NULL;


--
-- Name: marketing_link_clicks marketing_link_clicks_link_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.marketing_link_clicks
    ADD CONSTRAINT marketing_link_clicks_link_id_fkey FOREIGN KEY (link_id) REFERENCES public.marketing_links(id) ON DELETE CASCADE;


--
-- Name: marketing_links marketing_links_campaign_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.marketing_links
    ADD CONSTRAINT marketing_links_campaign_id_fkey FOREIGN KEY (campaign_id) REFERENCES public.marketing_campaigns(id) ON DELETE SET NULL;


--
-- Name: oauth_connections oauth_connections_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.oauth_connections
    ADD CONSTRAINT oauth_connections_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE RESTRICT;


--
-- Name: oauth_states oauth_states_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.oauth_states
    ADD CONSTRAINT oauth_states_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: quant_audit_logs quant_audit_logs_bot_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quant_audit_logs
    ADD CONSTRAINT quant_audit_logs_bot_id_fkey FOREIGN KEY (bot_id) REFERENCES public.quant_bots(id) ON DELETE CASCADE;


--
-- Name: quant_bots quant_bots_exchange_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quant_bots
    ADD CONSTRAINT quant_bots_exchange_id_fkey FOREIGN KEY (exchange_id) REFERENCES public.quant_exchanges(id) ON DELETE SET NULL;


--
-- Name: quant_bots quant_bots_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quant_bots
    ADD CONSTRAINT quant_bots_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;


--
-- Name: quant_exchanges quant_exchanges_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quant_exchanges
    ADD CONSTRAINT quant_exchanges_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;


--
-- Name: quant_orders quant_orders_bot_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quant_orders
    ADD CONSTRAINT quant_orders_bot_id_fkey FOREIGN KEY (bot_id) REFERENCES public.quant_bots(id) ON DELETE CASCADE;


--
-- Name: quant_orders quant_orders_signal_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quant_orders
    ADD CONSTRAINT quant_orders_signal_id_fkey FOREIGN KEY (signal_id) REFERENCES public.quant_signals(id) ON DELETE SET NULL;


--
-- Name: quant_orders quant_orders_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quant_orders
    ADD CONSTRAINT quant_orders_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;


--
-- Name: quant_positions quant_positions_bot_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quant_positions
    ADD CONSTRAINT quant_positions_bot_id_fkey FOREIGN KEY (bot_id) REFERENCES public.quant_bots(id) ON DELETE CASCADE;


--
-- Name: quant_positions quant_positions_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quant_positions
    ADD CONSTRAINT quant_positions_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;


--
-- Name: quant_risk_settings quant_risk_settings_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quant_risk_settings
    ADD CONSTRAINT quant_risk_settings_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;


--
-- Name: quant_signals quant_signals_bot_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quant_signals
    ADD CONSTRAINT quant_signals_bot_id_fkey FOREIGN KEY (bot_id) REFERENCES public.quant_bots(id) ON DELETE CASCADE;


--
-- Name: quant_strategies quant_strategies_exchange_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quant_strategies
    ADD CONSTRAINT quant_strategies_exchange_id_fkey FOREIGN KEY (exchange_id) REFERENCES public.quant_exchanges(id) ON DELETE SET NULL;


--
-- Name: quant_strategies quant_strategies_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quant_strategies
    ADD CONSTRAINT quant_strategies_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;


--
-- Name: strategy_backtest_results strategy_backtest_results_strategy_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.strategy_backtest_results
    ADD CONSTRAINT strategy_backtest_results_strategy_id_fkey FOREIGN KEY (strategy_id) REFERENCES public.quant_strategies(id) ON DELETE CASCADE;


--
-- Name: user_roles user_roles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: brands Admins can manage brands; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage brands" ON public.brands USING ((auth.role() = 'authenticated'::text)) WITH CHECK ((auth.role() = 'authenticated'::text));


--
-- Name: quant_market_history Allow public read access to market history; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow public read access to market history" ON public.quant_market_history FOR SELECT USING (true);


--
-- Name: quant_market_config Allow read access to market config; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow read access to market config" ON public.quant_market_config FOR SELECT USING (true);


--
-- Name: tenants Anyone can view active tenants; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view active tenants" ON public.tenants FOR SELECT USING ((is_active = true));


--
-- Name: quant_assets Certified assets are viewable by all users; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Certified assets are viewable by all users" ON public.quant_assets FOR SELECT USING (true);


--
-- Name: oauth_connections Marketing admins can delete OAuth connections; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Marketing admins can delete OAuth connections" ON public.oauth_connections FOR DELETE TO authenticated USING (public.has_marketing_role('admin'::text));


--
-- Name: marketing_campaign_publications Marketing admins can delete campaign publications; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Marketing admins can delete campaign publications" ON public.marketing_campaign_publications FOR DELETE TO authenticated USING (public.has_marketing_role('admin'::text));


--
-- Name: marketing_campaigns Marketing admins can delete campaigns; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Marketing admins can delete campaigns" ON public.marketing_campaigns FOR DELETE TO authenticated USING (public.has_marketing_role('admin'::text));


--
-- Name: marketing_links Marketing admins can delete links; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Marketing admins can delete links" ON public.marketing_links FOR DELETE TO authenticated USING (public.has_marketing_role('admin'::text));


--
-- Name: social_profiles Marketing admins can delete social profiles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Marketing admins can delete social profiles" ON public.social_profiles FOR DELETE TO authenticated USING (public.has_marketing_role('admin'::text));


--
-- Name: marketing_campaign_publications Marketing editors can create campaign publications; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Marketing editors can create campaign publications" ON public.marketing_campaign_publications FOR INSERT TO authenticated WITH CHECK (public.has_marketing_role('editor'::text));


--
-- Name: marketing_campaigns Marketing editors can create campaigns; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Marketing editors can create campaigns" ON public.marketing_campaigns FOR INSERT TO authenticated WITH CHECK (public.has_marketing_role('editor'::text));


--
-- Name: marketing_links Marketing editors can create links; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Marketing editors can create links" ON public.marketing_links FOR INSERT TO authenticated WITH CHECK (public.has_marketing_role('editor'::text));


--
-- Name: social_profiles Marketing editors can create social profiles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Marketing editors can create social profiles" ON public.social_profiles FOR INSERT TO authenticated WITH CHECK (public.has_marketing_role('editor'::text));


--
-- Name: oauth_connections Marketing editors can manage OAuth connections; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Marketing editors can manage OAuth connections" ON public.oauth_connections FOR INSERT TO authenticated WITH CHECK ((public.has_marketing_role('editor'::text) AND (created_by = auth.uid())));


--
-- Name: oauth_connections Marketing editors can update OAuth connections; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Marketing editors can update OAuth connections" ON public.oauth_connections FOR UPDATE TO authenticated USING (public.has_marketing_role('editor'::text)) WITH CHECK (public.has_marketing_role('editor'::text));


--
-- Name: marketing_campaign_publications Marketing editors can update campaign publications; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Marketing editors can update campaign publications" ON public.marketing_campaign_publications FOR UPDATE TO authenticated USING (public.has_marketing_role('editor'::text)) WITH CHECK (public.has_marketing_role('editor'::text));


--
-- Name: marketing_campaigns Marketing editors can update campaigns; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Marketing editors can update campaigns" ON public.marketing_campaigns FOR UPDATE TO authenticated USING (public.has_marketing_role('editor'::text)) WITH CHECK (public.has_marketing_role('editor'::text));


--
-- Name: marketing_links Marketing editors can update links; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Marketing editors can update links" ON public.marketing_links FOR UPDATE TO authenticated USING (public.has_marketing_role('editor'::text)) WITH CHECK (public.has_marketing_role('editor'::text));


--
-- Name: social_profiles Marketing editors can update social profiles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Marketing editors can update social profiles" ON public.social_profiles FOR UPDATE TO authenticated USING (public.has_marketing_role('editor'::text)) WITH CHECK (public.has_marketing_role('editor'::text));


--
-- Name: oauth_connections Marketing users can read OAuth connections; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Marketing users can read OAuth connections" ON public.oauth_connections FOR SELECT TO authenticated USING (public.has_marketing_role('viewer'::text));


--
-- Name: marketing_campaign_publications Marketing users can read campaign publications; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Marketing users can read campaign publications" ON public.marketing_campaign_publications FOR SELECT TO authenticated USING (public.has_marketing_role('viewer'::text));


--
-- Name: marketing_campaigns Marketing users can read campaigns; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Marketing users can read campaigns" ON public.marketing_campaigns FOR SELECT TO authenticated USING (public.has_marketing_role('viewer'::text));


--
-- Name: marketing_link_clicks Marketing users can read link clicks; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Marketing users can read link clicks" ON public.marketing_link_clicks FOR SELECT TO authenticated USING (public.has_marketing_role('viewer'::text));


--
-- Name: marketing_links Marketing users can read links; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Marketing users can read links" ON public.marketing_links FOR SELECT TO authenticated USING (public.has_marketing_role('viewer'::text));


--
-- Name: social_profiles Marketing users can read their social profiles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Marketing users can read their social profiles" ON public.social_profiles FOR SELECT TO authenticated USING (public.has_marketing_role('viewer'::text));


--
-- Name: quant_market_history Public read access for market data; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public read access for market data" ON public.quant_market_history FOR SELECT USING (true);


--
-- Name: brands Users can create brands; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create brands" ON public.brands FOR INSERT WITH CHECK ((auth.uid() IS NOT NULL));


--
-- Name: quant_risk_settings Users can manage their own risk settings; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can manage their own risk settings" ON public.quant_risk_settings USING (((tenant_id = auth.uid()) OR (tenant_id = '00000000-0000-0000-0000-000000000000'::uuid)));


--
-- Name: quant_signals Users can only see signals from their bots; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can only see signals from their bots" ON public.quant_signals USING (((tenant_id = auth.uid()) OR (tenant_id = '00000000-0000-0000-0000-000000000000'::uuid)));


--
-- Name: strategy_backtest_results Users can only view results of their strategies; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can only view results of their strategies" ON public.strategy_backtest_results USING ((strategy_id IN ( SELECT quant_strategies.id
   FROM public.quant_strategies
  WHERE ((quant_strategies.tenant_id = auth.uid()) OR (quant_strategies.tenant_id = '00000000-0000-0000-0000-000000000000'::uuid)))));


--
-- Name: quant_bots Users can only view their tenant's bots; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can only view their tenant's bots" ON public.quant_bots USING (((tenant_id = auth.uid()) OR (tenant_id = '00000000-0000-0000-0000-000000000000'::uuid)));


--
-- Name: quant_exchanges Users can only view their tenant's exchanges; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can only view their tenant's exchanges" ON public.quant_exchanges USING (((tenant_id = auth.uid()) OR (tenant_id = '00000000-0000-0000-0000-000000000000'::uuid)));


--
-- Name: quant_orders Users can only view their tenant's orders; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can only view their tenant's orders" ON public.quant_orders USING (((tenant_id = auth.uid()) OR (tenant_id = '00000000-0000-0000-0000-000000000000'::uuid)));


--
-- Name: quant_positions Users can only view their tenant's positions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can only view their tenant's positions" ON public.quant_positions USING (((tenant_id = auth.uid()) OR (tenant_id = '00000000-0000-0000-0000-000000000000'::uuid)));


--
-- Name: quant_strategies Users can only view their tenant's strategies; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can only view their tenant's strategies" ON public.quant_strategies USING (((tenant_id = auth.uid()) OR (tenant_id = '00000000-0000-0000-0000-000000000000'::uuid)));


--
-- Name: brands Users can view brands; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view brands" ON public.brands FOR SELECT USING ((auth.uid() IS NOT NULL));


--
-- Name: brands Users can view brands of their own tenant; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view brands of their own tenant" ON public.brands FOR SELECT USING ((auth.role() = 'authenticated'::text));


--
-- Name: brands; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;

--
-- Name: communication_entity_links; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.communication_entity_links ENABLE ROW LEVEL SECURITY;

--
-- Name: communications_ai_feedback; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.communications_ai_feedback ENABLE ROW LEVEL SECURITY;

--
-- Name: communications_ai_suggestions; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.communications_ai_suggestions ENABLE ROW LEVEL SECURITY;

--
-- Name: communications_attachments; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.communications_attachments ENABLE ROW LEVEL SECURITY;

--
-- Name: communications_channels; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.communications_channels ENABLE ROW LEVEL SECURITY;

--
-- Name: communications_contacts; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.communications_contacts ENABLE ROW LEVEL SECURITY;

--
-- Name: communications_conversation_imports; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.communications_conversation_imports ENABLE ROW LEVEL SECURITY;

--
-- Name: communications_conversations; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.communications_conversations ENABLE ROW LEVEL SECURITY;

--
-- Name: communications_events; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.communications_events ENABLE ROW LEVEL SECURITY;

--
-- Name: communications_internal_notes; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.communications_internal_notes ENABLE ROW LEVEL SECURITY;

--
-- Name: communications_message_statuses; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.communications_message_statuses ENABLE ROW LEVEL SECURITY;

--
-- Name: communications_messages; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.communications_messages ENABLE ROW LEVEL SECURITY;

--
-- Name: communications_migrations; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.communications_migrations ENABLE ROW LEVEL SECURITY;

--
-- Name: communications_templates; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.communications_templates ENABLE ROW LEVEL SECURITY;

--
-- Name: communications_webhook_events; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.communications_webhook_events ENABLE ROW LEVEL SECURITY;

--
-- Name: marketing_campaign_publications; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.marketing_campaign_publications ENABLE ROW LEVEL SECURITY;

--
-- Name: marketing_campaigns; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.marketing_campaigns ENABLE ROW LEVEL SECURITY;

--
-- Name: marketing_link_clicks; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.marketing_link_clicks ENABLE ROW LEVEL SECURITY;

--
-- Name: marketing_links; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.marketing_links ENABLE ROW LEVEL SECURITY;

--
-- Name: oauth_connections; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.oauth_connections ENABLE ROW LEVEL SECURITY;

--
-- Name: oauth_states; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.oauth_states ENABLE ROW LEVEL SECURITY;

--
-- Name: quant_assets; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.quant_assets ENABLE ROW LEVEL SECURITY;

--
-- Name: quant_bots; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.quant_bots ENABLE ROW LEVEL SECURITY;

--
-- Name: quant_exchanges; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.quant_exchanges ENABLE ROW LEVEL SECURITY;

--
-- Name: quant_market_config; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.quant_market_config ENABLE ROW LEVEL SECURITY;

--
-- Name: quant_market_history; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.quant_market_history ENABLE ROW LEVEL SECURITY;

--
-- Name: quant_orders; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.quant_orders ENABLE ROW LEVEL SECURITY;

--
-- Name: quant_positions; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.quant_positions ENABLE ROW LEVEL SECURITY;

--
-- Name: quant_risk_settings; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.quant_risk_settings ENABLE ROW LEVEL SECURITY;

--
-- Name: quant_signals; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.quant_signals ENABLE ROW LEVEL SECURITY;

--
-- Name: quant_strategies; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.quant_strategies ENABLE ROW LEVEL SECURITY;

--
-- Name: social_profiles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.social_profiles ENABLE ROW LEVEL SECURITY;

--
-- Name: strategy_backtest_results; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.strategy_backtest_results ENABLE ROW LEVEL SECURITY;

--
-- Name: tenants; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;

--
-- Name: user_roles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

--
-- PostgreSQL database dump complete
--

\unrestrict 77O6ezUpZm82ocLNRndqRbcHEjKcHY2q93JOUJijlDylKaqqDz4RoygjhrQ1Po1

