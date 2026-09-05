export const MAX_DOCUMENT_FILE_SIZE = 10 * 1024 * 1024;
export const ALLOWED_DOCUMENT_MIME_TYPES = ['image/jpeg', 'image/png', 'application/pdf'] as const;

export type AllowedDocumentMimeType = (typeof ALLOWED_DOCUMENT_MIME_TYPES)[number];

export function validateDocumentFile(file: File): string | null {
  if (!ALLOWED_DOCUMENT_MIME_TYPES.includes(file.type as AllowedDocumentMimeType)) {
    return 'Selecciona una imagen JPEG/PNG o un documento PDF.';
  }

  if (file.size > MAX_DOCUMENT_FILE_SIZE) {
    return 'El documento supera el límite de 10 MB.';
  }

  return null;
}
