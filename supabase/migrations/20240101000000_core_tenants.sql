-- Migration: Core Tenants Table
-- Description: Establishes the foundation for multi-tenancy in LoopDev.

CREATE TABLE IF NOT EXISTS public.tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Seed a default tenant for development (LoopDev Demo)
INSERT INTO public.tenants (id, name, slug)
VALUES ('00000000-0000-0000-0000-000000000000', 'LoopDev Demo', 'loopdev-demo')
ON CONFLICT (id) DO NOTHING;

-- Enable RLS (Read-only for authenticated users by default)
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active tenants" ON public.tenants FOR SELECT USING (is_active = true);
