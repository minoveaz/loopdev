import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DocumentExtractionErrorSchema, DocumentExtractionResultSchema } from '@loopdev/contracts';

import { DocumentExtractionServiceError } from '@/services/document-intelligence/extraction';

const mocks = vi.hoisted(() => ({
  getUser: vi.fn(),
  membershipMaybeSingle: vi.fn(),
  upload: vi.fn(),
  remove: vi.fn(),
  invokeExtraction: vi.fn(),
}));
const { getUser, membershipMaybeSingle, upload, remove, invokeExtraction } = mocks;

const supabase = {
  auth: { getUser },
  from: vi.fn(() => ({
    select: vi.fn(() => ({
      eq: vi.fn(() => ({
        eq: vi.fn(() => ({ maybeSingle: membershipMaybeSingle })),
      })),
    })),
  })),
  storage: {
    from: vi.fn(() => ({ upload, remove })),
  },
};

vi.mock('@/lib/supabase/server', () => ({
  createServerSupabaseClient: vi.fn(async () => supabase),
}));

vi.mock('@/services/document-intelligence/extraction', async () => {
  const actual = await vi.importActual<
    typeof import('@/services/document-intelligence/extraction')
  >('@/services/document-intelligence/extraction');
  return {
    ...actual,
    extractIdentityDocument: mocks.invokeExtraction,
  };
});

import { POST } from './route';

const organizationId = '11111111-1111-4111-8111-111111111111';
const userId = '22222222-2222-4222-8222-222222222222';

function requestWithFiles(files: { front?: File; back?: File }, organization = organizationId) {
  const formData = new FormData();
  if (files.front) formData.append('front', files.front);
  if (files.back) formData.append('back', files.back);
  return {
    headers: new Headers({ 'x-loopdev-organization-id': organization }),
    formData: vi.fn(async () => formData),
  } as unknown as Request;
}

const extractionResult = {
  classification: { type: 'spanish-dni', confidence: 0.95 },
  fields: {
    documentType: 'spanish-dni',
    issuingCountry: 'ES',
    fullName: null,
    givenNames: null,
    surnames: null,
    firstSurname: null,
    secondSurname: null,
    documentNumber: null,
    birthDate: null,
    nationality: null,
    sex: null,
    issueDate: null,
    expiryDate: null,
    birthplace: null,
    supportNumber: null,
    address: null,
    mrz: null,
  },
  validations: [],
  provider: 'gemini',
  usage: null,
};

beforeEach(() => {
  vi.clearAllMocks();
  getUser.mockResolvedValue({ data: { user: { id: userId } }, error: null });
  membershipMaybeSingle.mockResolvedValue({
    data: { organization_id: organizationId },
    error: null,
  });
  upload.mockResolvedValue({ error: null });
  remove.mockResolvedValue({ error: null });
  invokeExtraction.mockResolvedValue(extractionResult);
});

describe('POST /api/document-intelligence/extract', () => {
  it('rejects missing authentication before reading multipart data', async () => {
    getUser.mockResolvedValueOnce({ data: { user: null }, error: new Error('unauthorized') });

    const response = await POST(
      requestWithFiles({
        front: new File(['front'], 'front.png', { type: 'image/png' }),
      }),
    );

    expect(response.status).toBe(401);
    expect(upload).not.toHaveBeenCalled();
  });

  it('rejects an organization without an authenticated membership', async () => {
    membershipMaybeSingle.mockResolvedValueOnce({ data: null, error: null });

    const response = await POST(
      requestWithFiles({
        front: new File(['front'], 'front.png', { type: 'image/png' }),
      }),
    );

    expect(response.status).toBe(404);
    expect(upload).not.toHaveBeenCalled();
  });

  it('rejects unsupported MIME and oversized payloads before upload', async () => {
    const unsupportedResponse = await POST(
      requestWithFiles({
        front: new File(['front'], 'front.txt', { type: 'text/plain' }),
      }),
    );

    expect(unsupportedResponse.status).toBe(415);
    expect(DocumentExtractionErrorSchema.parse((await unsupportedResponse.json()).error).code).toBe(
      'unsupported-media',
    );
    expect(upload).not.toHaveBeenCalled();

    const oversizedBack = new File([new Uint8Array(10 * 1024 * 1024 + 1)], 'back.pdf', {
      type: 'application/pdf',
    });
    const oversizedResponse = await POST(
      requestWithFiles({
        front: new File(['front'], 'front.png', { type: 'image/png' }),
        back: oversizedBack,
      }),
    );

    expect(oversizedResponse.status).toBe(413);
    expect(DocumentExtractionErrorSchema.parse((await oversizedResponse.json()).error).code).toBe(
      'file-too-large',
    );
    expect(upload).not.toHaveBeenCalled();
  });

  it('uploads both multipart sides, invokes the contract service, and cleans both paths', async () => {
    const front = new File(['front'], 'front.png', { type: 'image/png' });
    const back = new File(['back'], 'back.png', { type: 'image/png' });

    const response = await POST(requestWithFiles({ front, back }));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.provider).toBe('gemini');
    expect(DocumentExtractionResultSchema.parse(payload).provider).toBe('gemini');
    expect(upload).toHaveBeenCalledTimes(2);
    expect(invokeExtraction).toHaveBeenCalledWith(
      expect.objectContaining({
        fileName: 'front.png',
        backFileName: 'back.png',
        mimeType: 'image/png',
        backMimeType: 'image/png',
      }),
    );
    expect(remove).toHaveBeenCalledWith([
      expect.stringMatching(new RegExp(`^organizations/${organizationId}/${userId}/.+\\.png$`)),
      expect.stringMatching(new RegExp(`^organizations/${organizationId}/${userId}/.+\\.png$`)),
    ]);
  });

  it('cleans an uploaded front object when the extraction service fails', async () => {
    invokeExtraction.mockRejectedValueOnce(
      new DocumentExtractionServiceError({
        code: 'provider-failed',
        status: 502,
        message: 'The extraction provider failed.',
        recoverable: true,
      }),
    );

    const response = await POST(
      requestWithFiles({
        front: new File(['front'], 'front.pdf', { type: 'application/pdf' }),
      }),
    );

    expect(response.status).toBe(502);
    expect(DocumentExtractionErrorSchema.parse((await response.json()).error).code).toBe(
      'provider-failed',
    );
    expect(remove).toHaveBeenCalledWith([
      expect.stringMatching(new RegExp(`^organizations/${organizationId}/${userId}/.+\\.pdf$`)),
    ]);
  });

  it('keeps the extraction response when cleanup removal fails', async () => {
    remove.mockRejectedValueOnce(new Error('cleanup-failed'));
    const response = await POST(
      requestWithFiles({
        front: new File(['front'], 'front.png', { type: 'image/png' }),
      }),
    );

    expect(response.status).toBe(200);
    expect(DocumentExtractionResultSchema.parse(await response.json()).provider).toBe('gemini');
  });

  it('cleans already-uploaded files if a later upload fails', async () => {
    upload.mockResolvedValueOnce({ error: null });
    upload.mockResolvedValueOnce({ error: new Error('upload-failed') });

    const response = await POST(
      requestWithFiles({
        front: new File(['front'], 'front.png', { type: 'image/png' }),
        back: new File(['back'], 'back.png', { type: 'image/png' }),
      }),
    );

    expect(response.status).toBe(502);
    expect(DocumentExtractionErrorSchema.parse((await response.json()).error).code).toBe(
      'provider-failed',
    );
    expect(remove).toHaveBeenCalledWith([
      expect.stringMatching(new RegExp(`^organizations/${organizationId}/${userId}/.+\\.png$`)),
    ]);
  });

  it('returns a typed provider timeout error from the extraction service', async () => {
    invokeExtraction.mockRejectedValueOnce(
      new DocumentExtractionServiceError({
        code: 'provider-failed',
        status: 502,
        message: 'The extraction provider timed out.',
        recoverable: true,
      }),
    );

    const response = await POST(
      requestWithFiles({
        front: new File(['front'], 'front.png', { type: 'image/png' }),
      }),
    );

    expect(response.status).toBe(502);
    expect(DocumentExtractionErrorSchema.parse((await response.json()).error)).toMatchObject({
      code: 'provider-failed',
      message: 'The extraction provider timed out.',
      recoverable: true,
    });
  });
});
