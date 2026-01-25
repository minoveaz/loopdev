import { z } from 'zod';

// --- ENUMS & ATOMS ---

export const RuleDomainSchema = z.enum(['identity', 'visual', 'typography', 'content']);
export type RuleDomain = z.infer<typeof RuleDomainSchema>;

export const RuleSeveritySchema = z.enum(['WARN', 'BLOCK']);
export type RuleSeverity = z.infer<typeof RuleSeveritySchema>;

export const RuleOperatorSchema = z.enum(['<', '<=', '>', '>=', '==', '!=', 'contains', 'excludes']);
export type RuleOperator = z.infer<typeof RuleOperatorSchema>;

// --- COMPOSITES ---

export const RuleExplainTemplateSchema = z.object({
  why: z.string().min(1),
  risk: z.string().min(1),
  howToFix: z.string().min(1),
  doExample: z.string().optional(),
  dontExample: z.string().optional(),
});

export const RuleDefinitionSchema = z.object({
  id: z.string(),
  name: z.string().min(2),
  domain: RuleDomainSchema,
  status: z.enum(['active', 'disabled']).default('active'),
  
  // 1. SCOPE (Applies to)
  scope: z.object({
    target: z.string(), // e.g. "colorToken", "toneProfile", "claim"
    filter: z.string().optional(), // e.g. "role == 'bg'"
  }),

  // 2. LOGIC (Condition)
  logic: z.object({
    metric: z.string(), // e.g. "contrastRatio", "length", "forbiddenWord"
    operator: RuleOperatorSchema,
    threshold: z.union([z.number(), z.string(), z.array(z.string())]),
  }),

  // 3. ENFORCEMENT
  enforcement: z.object({
    severity: RuleSeveritySchema,
    blockPublish: z.boolean().default(false),
    requiresAck: z.boolean().default(true),
    allowOverride: z.boolean().default(false),
  }),

  // 4. APPROVAL
  approval: z.object({
    required: z.boolean().default(false),
    approverRole: z.enum(['admin', 'legal', 'design', 'owner']).optional(),
  }),

  // 5. EXPLAINABILITY
  explain: RuleExplainTemplateSchema,

  // METADATA
  updatedAt: z.string(),
  updatedBy: z.string().optional(),
});

export type RuleDefinition = z.infer<typeof RuleDefinitionSchema>;

// --- ROOT COLLECTION ---

export const RulesEngineSchema = z.object({
  rules: z.array(RuleDefinitionSchema).default([]),
  globalPolicy: z.object({
    blockAlwaysPreventsPublish: z.boolean().default(true),
    warnRequiresAcknowledgment: z.boolean().default(true),
  }).default({
    blockAlwaysPreventsPublish: true,
    warnRequiresAcknowledgment: true
  }),
});

export type RulesEngine = z.infer<typeof RulesEngineSchema>;
