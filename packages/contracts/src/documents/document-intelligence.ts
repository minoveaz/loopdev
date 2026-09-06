import { z } from 'zod';

export const IdentityDocumentTypeSchema = z.enum([
  'passport',
  'spanish-dni',
  'spanish-nie',
  'national-id',
  'unknown',
]);
export type IdentityDocumentType = z.infer<typeof IdentityDocumentTypeSchema>;

const NullableTextSchema = z.string().trim().max(10_000).nullable();

export const IdentityDocumentFieldsSchema = z.object({
  documentType: IdentityDocumentTypeSchema.nullable(),
  issuingCountry: NullableTextSchema,
  fullName: NullableTextSchema,
  givenNames: NullableTextSchema,
  surnames: NullableTextSchema,
  firstSurname: NullableTextSchema,
  secondSurname: NullableTextSchema,
  documentNumber: NullableTextSchema,
  birthDate: NullableTextSchema,
  nationality: NullableTextSchema,
  sex: NullableTextSchema,
  issueDate: NullableTextSchema,
  expiryDate: NullableTextSchema,
  birthplace: NullableTextSchema,
  supportNumber: NullableTextSchema,
  address: NullableTextSchema,
  mrz: NullableTextSchema,
});
export type IdentityDocumentFields = z.infer<typeof IdentityDocumentFieldsSchema>;

export const DocumentBoundingBoxSchema = z
  .tuple([z.number(), z.number(), z.number(), z.number()])
  .refine((values) => values.every((value) => value >= 0 && value <= 1000), {
    message: 'Bounding boxes must use normalized values between 0 and 1000.',
  });
export type DocumentBoundingBox = z.infer<typeof DocumentBoundingBoxSchema>;

export const DocumentFieldValidationSchema = z.object({
  field: z.string().trim().min(1),
  valid: z.boolean(),
  message: z.string().nullable(),
});

export const DocumentExtractionUsageSchema = z.object({
  promptTokens: z.number().int().nonnegative(),
  outputTokens: z.number().int().nonnegative(),
  totalTokens: z.number().int().nonnegative(),
  estimatedCostUsd: z.number().nonnegative(),
});

export const DocumentExtractionRequestSchema = z.object({
  fileName: z.string().trim().min(1).max(240),
  mimeType: z.enum(['image/jpeg', 'image/png', 'application/pdf']),
  documentReference: z.string().trim().min(1).max(500),
  backFileName: z.string().trim().min(1).max(240).optional(),
  backMimeType: z.enum(['image/jpeg', 'image/png', 'application/pdf']).optional(),
  backDocumentReference: z.string().trim().min(1).max(500).optional(),
});
export type DocumentExtractionRequest = z.infer<typeof DocumentExtractionRequestSchema>;

export const DocumentExtractionResultSchema = z.object({
  classification: z.object({
    type: IdentityDocumentTypeSchema,
    confidence: z.number().min(0).max(1).nullable(),
  }),
  fields: IdentityDocumentFieldsSchema,
  rawFields: IdentityDocumentFieldsSchema.nullable().optional(),
  boundingBoxes: z.record(z.string(), DocumentBoundingBoxSchema).nullable().optional(),
  validations: z.array(DocumentFieldValidationSchema),
  provider: z.enum(['fixture', 'gemini']),
  usage: DocumentExtractionUsageSchema.nullable().optional(),
});
export type DocumentExtractionResult = z.infer<typeof DocumentExtractionResultSchema>;

export const DocumentExtractionErrorSchema = z.object({
  code: z.enum([
    'invalid-payload',
    'unauthorized',
    'not-found',
    'file-too-large',
    'unsupported-media',
    'provider-failed',
    'provider-unavailable',
  ]),
  status: z.union([
    z.literal(400),
    z.literal(401),
    z.literal(404),
    z.literal(413),
    z.literal(415),
    z.literal(502),
    z.literal(503),
  ]),
  message: z.string().trim().min(1).max(1_000),
  recoverable: z.boolean(),
});
export type DocumentExtractionError = z.infer<typeof DocumentExtractionErrorSchema>;

export const IdentityDocumentReviewDecisionSchema = z.object({
  documentId: z.string().uuid(),
  decision: z.enum(['approved', 'rejected']),
  comments: z.string().max(10_000).nullable(),
});
export type IdentityDocumentReviewDecision = z.infer<typeof IdentityDocumentReviewDecisionSchema>;
