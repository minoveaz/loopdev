/// <reference lib="deno.ns" />

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { MAX_DOCUMENT_BYTES, parseDocumentReference, SUPPORTED_MIME_TYPES } from './validation.ts';

const BUCKET = 'document-intelligence-temp';
const PROVIDER_TIMEOUT_MS = 30_000;
const DOCUMENT_TYPES = [
  'passport',
  'spanish-dni',
  'spanish-nie',
  'national-id',
  'unknown',
] as const;
const FIELD_NAMES = [
  'documentType',
  'issuingCountry',
  'fullName',
  'givenNames',
  'surnames',
  'firstSurname',
  'secondSurname',
  'documentNumber',
  'birthDate',
  'nationality',
  'sex',
  'issueDate',
  'expiryDate',
  'birthplace',
  'supportNumber',
  'address',
  'mrz',
] as const;

type FieldName = (typeof FIELD_NAMES)[number];
type DocumentType = (typeof DOCUMENT_TYPES)[number];
type Payload = {
  fileName?: unknown;
  mimeType?: unknown;
  documentReference?: unknown;
  backFileName?: unknown;
  backMimeType?: unknown;
  backDocumentReference?: unknown;
};

const extractionSchema = {
  type: 'OBJECT',
  properties: Object.fromEntries(
    FIELD_NAMES.map((field) => [
      field,
      field === 'documentType'
        ? { type: 'STRING', enum: DOCUMENT_TYPES }
        : { type: 'STRING', nullable: true },
    ]),
  ),
  required: ['documentType'],
};

const emptyFields = (): Record<FieldName, string | null> =>
  Object.fromEntries(FIELD_NAMES.map((field) => [field, null])) as Record<FieldName, string | null>;

function corsHeaders(request: Request): HeadersInit {
  const origin = request.headers.get('Origin');
  const configuredOrigins = (Deno.env.get('DOCUMENT_INTELLIGENCE_ALLOWED_ORIGINS') ?? '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);
  const isAllowed = origin
    ? configuredOrigins.includes(origin) ||
      /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)
    : false;
  const headers: Record<string, string> = {
    'Access-Control-Allow-Headers': 'authorization, apikey, x-client-info, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    Vary: 'Origin',
  };
  if (isAllowed && origin) headers['Access-Control-Allow-Origin'] = origin;
  return headers;
}

function jsonResponse(request: Request, body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders(request), 'Content-Type': 'application/json' },
  });
}

function errorResponse(
  request: Request,
  code: string,
  message: string,
  status: 400 | 401 | 404 | 413 | 415 | 502 | 503,
  recoverable = true,
): Response {
  return jsonResponse(request, { error: { code, message, recoverable } }, status);
}

function isString(value: unknown, maxLength: number): value is string {
  return typeof value === 'string' && value.trim().length > 0 && value.length <= maxLength;
}

function normalizeDate(value: string | null): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  const ymd = trimmed.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/);
  if (ymd) return `${ymd[3].padStart(2, '0')}/${ymd[2].padStart(2, '0')}/${ymd[1]}`;
  const dmy = trimmed.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})$/);
  if (dmy) return `${dmy[1].padStart(2, '0')}/${dmy[2].padStart(2, '0')}/${dmy[3]}`;
  return trimmed || null;
}

function normalizeExtraction(
  value: Record<string, unknown>,
  usageMetadata?: {
    promptTokenCount?: number;
    candidatesTokenCount?: number;
    totalTokenCount?: number;
  },
) {
  const fields = emptyFields();
  const rawFields = emptyFields();
  const dateFields = new Set<FieldName>(['birthDate', 'issueDate', 'expiryDate']);

  for (const field of FIELD_NAMES) {
    const rawValue = value[field];
    const normalized = typeof rawValue === 'string' ? rawValue.trim() || null : null;
    rawFields[field] = normalized;
    fields[field] = dateFields.has(field) ? normalizeDate(normalized) : normalized;
  }

  const type = DOCUMENT_TYPES.includes(value.documentType as DocumentType)
    ? (value.documentType as DocumentType)
    : 'unknown';
  const promptTokens = usageMetadata?.promptTokenCount ?? 0;
  const outputTokens = usageMetadata?.candidatesTokenCount ?? 0;
  const totalTokens = usageMetadata?.totalTokenCount ?? promptTokens + outputTokens;

  return {
    classification: { type, confidence: null },
    fields,
    rawFields,
    boundingBoxes: null,
    validations: [],
    provider: 'gemini',
    usage: {
      promptTokens,
      outputTokens,
      totalTokens,
      estimatedCostUsd: Number(((promptTokens * 0.3 + outputTokens * 2.5) / 1_000_000).toFixed(6)),
    },
  };
}

async function toBase64(blob: Blob): Promise<string> {
  const bytes = new Uint8Array(await blob.arrayBuffer());
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response(null, { headers: corsHeaders(request) });
  if (request.method !== 'POST') {
    return errorResponse(request, 'invalid-method', 'Only POST is supported.', 400);
  }

  const authorization = request.headers.get('Authorization');
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
  if (!authorization || !supabaseUrl || !supabaseAnonKey) {
    return errorResponse(
      request,
      'unauthorized',
      'An authenticated session is required.',
      401,
      false,
    );
  }

  const client = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: authorization } },
  });
  const { data: userData, error: userError } = await client.auth.getUser();
  const userId = userData.user?.id;
  if (userError || !userId) {
    return errorResponse(request, 'unauthorized', 'The session is invalid or expired.', 401, false);
  }

  const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
  if (!geminiApiKey) {
    return errorResponse(
      request,
      'provider-unavailable',
      'Document extraction is not configured.',
      503,
    );
  }

  let payload: Payload;
  try {
    payload = (await request.json()) as Payload;
  } catch {
    return errorResponse(request, 'invalid-payload', 'The request body must be valid JSON.', 400);
  }

  if (
    !isString(payload.fileName, 240) ||
    !isString(payload.mimeType, 64) ||
    !SUPPORTED_MIME_TYPES.has(payload.mimeType)
  ) {
    return errorResponse(
      request,
      'unsupported-media',
      'The front document MIME type is not supported.',
      415,
    );
  }
  const front = parseDocumentReference(payload.documentReference, userId);
  if (!front) {
    return errorResponse(request, 'invalid-payload', 'The document reference is invalid.', 400);
  }
  if (!isString(payload.backFileName, 240) && payload.backFileName !== undefined) {
    return errorResponse(request, 'invalid-payload', 'The back document name is invalid.', 400);
  }
  if (
    payload.backMimeType !== undefined &&
    (!isString(payload.backMimeType, 64) || !SUPPORTED_MIME_TYPES.has(payload.backMimeType))
  ) {
    return errorResponse(
      request,
      'unsupported-media',
      'The back document MIME type is not supported.',
      415,
    );
  }
  const back =
    payload.backDocumentReference === undefined
      ? null
      : parseDocumentReference(payload.backDocumentReference, userId);
  if (
    payload.backDocumentReference !== undefined &&
    (!back || back.organizationId !== front.organizationId)
  ) {
    return errorResponse(
      request,
      'invalid-payload',
      'The document references must belong to one organization and actor.',
      400,
    );
  }

  const { data: membership, error: membershipError } = await client
    .from('organization_memberships')
    .select('organization_id')
    .eq('organization_id', front.organizationId)
    .eq('user_id', userId)
    .maybeSingle();
  if (membershipError || !membership) {
    return errorResponse(request, 'not-found', 'The document could not be found.', 404);
  }

  const pathsToCleanup = [front.path, ...(back ? [back.path] : [])];
  try {
    const parts: Array<Record<string, unknown>> = [];
    for (const [path, mimeType] of [
      [front.path, payload.mimeType],
      ...(back ? [[back.path, payload.backMimeType ?? payload.mimeType]] : []),
    ] as Array<[string, string]>) {
      const { data, error } = await client.storage.from(BUCKET).download(path);
      if (error || !data)
        return errorResponse(request, 'not-found', 'The document could not be loaded.', 404);
      if (data.size > MAX_DOCUMENT_BYTES) {
        return errorResponse(
          request,
          'file-too-large',
          'The document exceeds the 10 MB limit.',
          413,
        );
      }
      parts.push({ inlineData: { mimeType, data: await toBase64(data) } });
    }

    parts.push({
      text: 'Extract this identity document as JSON. Never infer absent values; return null for unreadable fields. Dates must use DD/MM/YYYY. If two sides are provided, correlate them as one document.',
    });
    const providerController = new AbortController();
    const providerTimeout = setTimeout(() => providerController.abort(), PROVIDER_TIMEOUT_MS);
    let providerResponse: Response;
    try {
      providerResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(geminiApiKey)}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: providerController.signal,
          body: JSON.stringify({
            systemInstruction: {
              parts: [
                {
                  text: 'You are an identity document OCR service. Extract documentType, issuingCountry, fullName, givenNames, surnames, firstSurname, secondSurname, documentNumber, birthDate, nationality, sex, issueDate, expiryDate, birthplace, supportNumber, address and mrz.',
                },
              ],
            },
            contents: [{ parts }],
            generationConfig: {
              temperature: 0,
              responseMimeType: 'application/json',
              responseSchema: extractionSchema,
            },
          }),
        },
      );
    } catch {
      return errorResponse(request, 'provider-timeout', 'The extraction provider timed out.', 502);
    } finally {
      clearTimeout(providerTimeout);
    }
    if (!providerResponse.ok) {
      return errorResponse(request, 'provider-failed', 'The extraction provider failed.', 502);
    }

    let providerPayload: {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
      usageMetadata?: {
        promptTokenCount?: number;
        candidatesTokenCount?: number;
        totalTokenCount?: number;
      };
    };
    try {
      providerPayload = (await providerResponse.json()) as typeof providerPayload;
    } catch {
      return errorResponse(
        request,
        'provider-failed',
        'The provider returned invalid extraction data.',
        502,
      );
    }
    const text = providerPayload.candidates?.[0]?.content?.parts?.find(
      (part) => typeof part.text === 'string',
    )?.text;
    if (!text)
      return errorResponse(request, 'provider-failed', 'The provider returned no extraction.', 502);

    try {
      return jsonResponse(
        request,
        normalizeExtraction(
          JSON.parse(text) as Record<string, unknown>,
          providerPayload.usageMetadata,
        ),
      );
    } catch {
      return errorResponse(
        request,
        'provider-failed',
        'The provider returned invalid extraction data.',
        502,
      );
    }
  } finally {
    await client.storage.from(BUCKET).remove(pathsToCleanup);
  }
});
