import { z } from 'zod';

const IdSchema = z.string().uuid();
const TimestampSchema = z.string().datetime();

export const InsuranceProductStatusSchema = z.enum(['draft', 'active', 'archived']);
export const QuoteStatusSchema = z.enum(['draft', 'quoted', 'accepted', 'declined', 'expired']);
export const OnboardingStatusSchema = z.enum(['pending', 'in_progress', 'awaiting_documents', 'verified', 'submitted', 'completed', 'cancelled']);
export const PolicyStatusSchema = z.enum(['pending', 'active', 'cancelled', 'expired', 'renewed']);
export const EligibilityOutcomeSchema = z.enum(['eligible', 'ineligible', 'manual_review']);

export const InsuranceProductSchema = z.object({
  id: IdSchema,
  organizationId: IdSchema,
  brandId: IdSchema.nullable().optional(),
  insurerName: z.string().trim().min(1).max(160),
  name: z.string().trim().min(1).max(160),
  status: InsuranceProductStatusSchema.default('draft'),
  currency: z.string().regex(/^[A-Z]{3}$/).default('EUR'),
  configuration: z.record(z.string(), z.unknown()).default({}),
  createdAt: TimestampSchema,
  updatedAt: TimestampSchema,
});
export type InsuranceProduct = z.infer<typeof InsuranceProductSchema>;

export const EligibilityResultSchema = z.object({
  productId: IdSchema,
  outcome: EligibilityOutcomeSchema,
  reasons: z.array(z.string().trim().min(1).max(500)).default([]),
  score: z.number().min(0).max(100).nullable().optional(),
  evaluatedAt: TimestampSchema,
});
export type EligibilityResult = z.infer<typeof EligibilityResultSchema>;

export const QuoteSchema = z.object({
  id: IdSchema,
  organizationId: IdSchema,
  brandId: IdSchema.nullable().optional(),
  workspaceId: IdSchema.nullable().optional(),
  leadId: IdSchema,
  productId: IdSchema,
  version: z.number().int().positive(),
  status: QuoteStatusSchema.default('draft'),
  premiumAmount: z.number().nonnegative().nullable().optional(),
  currency: z.string().regex(/^[A-Z]{3}$/).default('EUR'),
  eligibility: EligibilityResultSchema.nullable().optional(),
  expiresAt: TimestampSchema.nullable().optional(),
  createdAt: TimestampSchema,
  updatedAt: TimestampSchema,
});
export type Quote = z.infer<typeof QuoteSchema>;

export const OnboardingSchema = z.object({
  id: IdSchema,
  organizationId: IdSchema,
  brandId: IdSchema.nullable().optional(),
  leadId: IdSchema,
  quoteId: IdSchema.nullable().optional(),
  assignedToUserId: IdSchema.nullable().optional(),
  status: OnboardingStatusSchema.default('pending'),
  currentStep: z.string().trim().min(1).max(120),
  createdAt: TimestampSchema,
  updatedAt: TimestampSchema,
});
export type Onboarding = z.infer<typeof OnboardingSchema>;

export const PolicySchema = z.object({
  id: IdSchema,
  organizationId: IdSchema,
  brandId: IdSchema.nullable().optional(),
  leadId: IdSchema,
  quoteId: IdSchema.nullable().optional(),
  productId: IdSchema,
  policyNumber: z.string().trim().min(1).max(120),
  status: PolicyStatusSchema.default('pending'),
  effectiveAt: TimestampSchema.nullable().optional(),
  expiresAt: TimestampSchema.nullable().optional(),
  createdAt: TimestampSchema,
  updatedAt: TimestampSchema,
});
export type Policy = z.infer<typeof PolicySchema>;
