import { NextResponse } from 'next/server';
import { DocumentExtractionRequestSchema } from '@loopdev/contracts';

import { createServerSupabaseClient } from '@/lib/supabase/server';
import {
  DocumentExtractionServiceError,
  extractIdentityDocument,
} from '@/services/document-intelligence/extraction';

const BUCKET = 'document-intelligence-temp';
const MAX_DOCUMENT_BYTES = 10 * 1024 * 1024;
const SUPPORTED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'application/pdf']);
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function errorResponse(status: number, code: string, message: string, recoverable = true) {
  return NextResponse.json({ error: { code, status, message, recoverable } }, { status });
}

function getFile(formData: FormData, key: string): File | null {
  const value = formData.get(key);
  return value instanceof File && value.size > 0 ? value : null;
}

function validateFile(file: File): string | null {
  if (!SUPPORTED_MIME_TYPES.has(file.type)) return 'unsupported-media';
  if (file.size > MAX_DOCUMENT_BYTES) return 'file-too-large';
  return null;
}

export async function POST(request: Request) {
  const organizationId = request.headers.get('x-loopdev-organization-id');
  if (!organizationId || !UUID.test(organizationId)) {
    return errorResponse(
      400,
      'invalid-payload',
      'A valid organization context is required.',
      false,
    );
  }

  const supabase = await createServerSupabaseClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();
  const userId = userData.user?.id;
  if (userError || !userId) {
    return errorResponse(401, 'unauthorized', 'An authenticated session is required.', false);
  }

  const { data: membership, error: membershipError } = await supabase
    .from('organization_memberships')
    .select('organization_id')
    .eq('organization_id', organizationId)
    .eq('user_id', userId)
    .maybeSingle();
  if (membershipError || !membership) {
    return errorResponse(404, 'not-found', 'The organization context was not found.', false);
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return errorResponse(400, 'invalid-payload', 'The request must be multipart form data.');
  }
  const front = getFile(formData, 'front');
  const back = getFile(formData, 'back');
  if (!front) return errorResponse(400, 'invalid-payload', 'A front document is required.');

  const frontError = validateFile(front);
  const backError = back ? validateFile(back) : null;
  if (frontError || backError) {
    const code = frontError ?? backError;
    return errorResponse(
      code === 'file-too-large' ? 413 : 415,
      code === 'file-too-large' ? 'file-too-large' : 'unsupported-media',
      code === 'file-too-large'
        ? 'The document exceeds the 10 MB limit.'
        : 'The document MIME type is not supported.',
    );
  }

  const references: string[] = [];
  try {
    const upload = async (file: File) => {
      const extension =
        file.type === 'application/pdf' ? 'pdf' : file.type === 'image/jpeg' ? 'jpg' : 'png';
      const path = `organizations/${organizationId}/${userId}/${crypto.randomUUID()}.${extension}`;
      const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
        contentType: file.type,
        upsert: false,
      });
      if (error) throw new Error('upload-failed');
      references.push(path);
      return path;
    };

    const frontReference = await upload(front);
    const backReference = back ? await upload(back) : undefined;
    const input = DocumentExtractionRequestSchema.parse({
      fileName: front.name,
      mimeType: front.type,
      documentReference: frontReference,
      ...(back
        ? {
            backFileName: back.name,
            backMimeType: back.type,
            backDocumentReference: backReference,
          }
        : {}),
    });
    const result = await extractIdentityDocument(input);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof DocumentExtractionServiceError) {
      return errorResponse(
        error.details.status,
        error.details.code,
        error.details.message,
        error.details.recoverable,
      );
    }
    return errorResponse(502, 'provider-failed', 'Document extraction failed.');
  } finally {
    if (references.length > 0) {
      try {
        await supabase.storage.from(BUCKET).remove(references);
      } catch {
        console.error('Document extraction temporary cleanup failed', {
          referenceCount: references.length,
        });
      }
    }
  }
}
