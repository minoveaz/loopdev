import { describe, expect, it } from 'vitest';

import { MAX_DOCUMENT_FILE_SIZE, validateDocumentFile } from './file-validation';

describe('Document Intelligence file intake', () => {
  it('accepts the supported image and PDF MIME types under the size limit', () => {
    expect(
      validateDocumentFile(new File(['image'], 'front.png', { type: 'image/png' })),
    ).toBeNull();
    expect(
      validateDocumentFile(new File(['pdf'], 'document.pdf', { type: 'application/pdf' })),
    ).toBeNull();
  });

  it('rejects unsupported media and oversized documents before upload', () => {
    expect(
      validateDocumentFile(new File(['text'], 'document.txt', { type: 'text/plain' })),
    ).toMatch(/JPEG\/PNG.*PDF/i);
    const oversized = new File([new Uint8Array(MAX_DOCUMENT_FILE_SIZE + 1)], 'large.pdf', {
      type: 'application/pdf',
    });
    expect(validateDocumentFile(oversized)).toMatch(/10 MB/);
  });

  it('accepts the 10 MB boundary and rejects values above it', () => {
    const atLimit = new File([new Uint8Array(MAX_DOCUMENT_FILE_SIZE)], 'limit.jpg', {
      type: 'image/jpeg',
    });
    expect(validateDocumentFile(atLimit)).toBeNull();
    const aboveLimit = new File([new Uint8Array(MAX_DOCUMENT_FILE_SIZE + 1)], 'too-large.jpg', {
      type: 'image/jpeg',
    });
    expect(validateDocumentFile(aboveLimit)).toMatch(/10 MB/);
  });
});
