import { isValidPhoneNumber } from 'libphonenumber-js';
import { z } from 'zod';
import type { CrmCaptureLeadCommand, CrmLead } from '@loopdev/contracts';

// `@loopdev/contracts` schemas are built with zod v3; the app validates
// forms with zod v4 (see package.json). The two builders are not
// interchangeable, so this enum mirrors CrmLeadSourceKindSchema's literal
// values (packages/contracts/src/crm/crm.ts) instead of embedding it.
const LEAD_SOURCE_KINDS = [
  'manual',
  'campaign',
  'whatsapp_simulated',
  'referral',
  'social',
  'partner',
] as const satisfies readonly CrmLead['source']['kind'][];
const leadSourceKindSchema = z.enum(LEAD_SOURCE_KINDS);
export { LEAD_SOURCE_KINDS };

/**
 * Client-side capture form schema for QuickLeadCapture and
 * LeadCaptureWorkspace (CRM_LEADS_UI_IMPLEMENTATION_PLAN.md Fase 2).
 *
 * Mirrors `CrmCaptureLeadCommandSchema` (CRM_LEAD_CONTRACT.md `createLead`):
 * a Lead always requires either an existing `contactId` or the data to
 * create a new Contact through the same authorized Contact flow, plus a
 * required interest and source. `buildCaptureLeadCommand` maps the form
 * shape to the exact API command.
 */
export const leadCaptureFormSchema = z
  .object({
    contactMode: z.enum(['existing', 'new']),
    contactId: z.string().uuid().optional(),
    contactLabel: z.string().optional(),
    firstName: z.string().trim().max(120, 'First name must be 120 characters or fewer.').optional(),
    lastName: z.string().trim().max(120, 'Last name must be 120 characters or fewer.').optional(),
    email: z.string().trim().email('Enter a valid email address.').optional().or(z.literal('')),
    phone: z
      .string()
      .trim()
      .max(32, 'Phone number must be 32 characters or fewer.')
      .optional()
      .or(z.literal(''))
      .refine(
        (value) => !value || isValidPhoneNumber(value),
        'Enter a complete, valid phone number.',
      ),
    companyName: z
      .string()
      .trim()
      .max(160, 'Company name must be 160 characters or fewer.')
      .optional(),
    interest: z
      .string()
      .trim()
      .min(1, 'Interest is required.')
      .max(240, 'Interest must be 240 characters or fewer.'),
    sourceKind: leadSourceKindSchema,
    provider: z.string().trim().max(120, 'Provider must be 120 characters or fewer.').optional(),
    externalId: z
      .string()
      .trim()
      .max(240, 'External id must be 240 characters or fewer.')
      .optional(),
    campaign: z.string().trim().max(160, 'Campaign must be 160 characters or fewer.').optional(),
    utmMedium: z.string().trim().max(500).optional(),
    utmContent: z.string().trim().max(500).optional(),
    utmTerm: z.string().trim().max(500).optional(),
    note: z.string().trim().max(20_000, 'Note must be 20,000 characters or fewer.').optional(),
    assignedUserId: z
      .string()
      .trim()
      .optional()
      .or(z.literal(''))
      .refine(
        (value) => !value || z.string().uuid().safeParse(value).success,
        'Enter a valid user id.',
      ),
  })
  .superRefine((values, ctx) => {
    if (values.contactMode === 'existing' && !values.contactId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['contactId'],
        message: 'Select an existing contact or create a new one.',
      });
    }
    if (values.contactMode === 'new') {
      if (!values.firstName) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['firstName'],
          message: 'First name is required for a new contact.',
        });
      }
      if (!values.email && !values.phone) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['email'],
          message: 'Enter at least one email address or phone number.',
        });
      }
    }
  });

export type LeadCaptureFormValues = z.infer<typeof leadCaptureFormSchema>;

export const DEFAULT_LEAD_CAPTURE_VALUES: LeadCaptureFormValues = {
  contactMode: 'existing',
  contactId: undefined,
  contactLabel: undefined,
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  companyName: '',
  interest: '',
  sourceKind: 'manual',
  provider: '',
  externalId: '',
  campaign: '',
  utmMedium: '',
  utmContent: '',
  utmTerm: '',
  note: '',
  assignedUserId: '',
};

export function buildCaptureLeadCommand(
  organizationId: string,
  values: LeadCaptureFormValues,
): CrmCaptureLeadCommand {
  const utm: Record<string, string> = {};
  if (values.utmMedium) utm.medium = values.utmMedium;
  if (values.utmContent) utm.content = values.utmContent;
  if (values.utmTerm) utm.term = values.utmTerm;

  const contact =
    values.contactMode === 'existing'
      ? { contactId: values.contactId }
      : {
          firstName: values.firstName,
          lastName: values.lastName || null,
          email: values.email || null,
          phone: values.phone || null,
          companyName: values.companyName || null,
        };

  return {
    organizationId,
    ...contact,
    interest: values.interest,
    assignedUserId: values.assignedUserId || null,
    source: {
      kind: values.sourceKind,
      provider: values.provider || null,
      externalId: values.externalId || null,
      campaign: values.campaign || null,
      utm,
    },
  };
}
