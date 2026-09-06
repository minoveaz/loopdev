export const MAX_DOCUMENT_BYTES = 10 * 1024 * 1024;
export const SUPPORTED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'application/pdf']);

const UUID = '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}';
const DOCUMENT_PATH = new RegExp(
  `^organizations/(${UUID})/(${UUID})/(${UUID})\\.(jpg|jpeg|png|pdf)$`,
  'i',
);

export function parseDocumentReference(
  value: unknown,
  userId: string,
): { organizationId: string; path: string } | null {
  if (typeof value !== 'string' || value.trim().length === 0 || value.length > 500) return null;
  const match = value.match(DOCUMENT_PATH);
  if (!match || match[2].toLowerCase() !== userId.toLowerCase()) return null;
  return { organizationId: match[1], path: value };
}
