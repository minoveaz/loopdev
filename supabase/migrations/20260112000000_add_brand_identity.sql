-- Migration: Add Identity Column to Brands
-- Description: Expands the brands table to store semantic identity data (Narrative, Voice, Claims).

-- 1. Add JSONB column for Identity
ALTER TABLE public.brands 
ADD COLUMN IF NOT EXISTS identity jsonb DEFAULT '{}'::jsonb;

-- 2. Seed LoopDev Identity Data (The Source of Truth)
-- We update the existing LoopDev brand record with its real identity definition.
UPDATE public.brands
SET identity = '{
  "narrative": {
    "mission": "Build the operational system that turns intent and truth into enforceable workflows.",
    "vision": "A world where every team ships on-brand by default, with governance built into creation.",
    "values": [
      { "title": "Precision", "description": "Systems over opinions." },
      { "title": "Transparency", "description": "Explainable rules and auditable change." },
      { "title": "Velocity", "description": "Fast iteration without breaking truth." },
      { "title": "Craft", "description": "Industrial design quality in every interaction." }
    ],
    "promise": "On-brand by default. On-system by design."
  },
  "voice": {
    "profiles": [
      {
        "id": "professional",
        "name": "Professional",
        "description": "Clear, precise, system-oriented.",
        "examples": {
          "do": ["Here is the impact of this change.", "This rule is blocked by policy."],
          "dont": ["Don''t worry about it.", "We are the best in the world."]
        }
      },
      {
        "id": "witty",
        "name": "Witty (Controlled)",
        "description": "Light, but never unprofessional.",
        "examples": {
          "do": ["Let''s keep this clean and compliant."],
          "dont": ["We break the rules."]
        }
      }
    ]
  },
  "claims": {
    "forbidden": ["guaranteed", "best", "cure", "risk-free"],
    "regulated": [
      { "id": "c1", "text": "Guaranteed results", "jurisdiction": "EU", "severity": "block", "reason": "Misleading advertising." },
      { "id": "c2", "text": "No risk", "jurisdiction": "EU/UK", "severity": "warn", "reason": "Requires qualification." }
    ]
  }
}'::jsonb
WHERE name = 'LoopDev';
