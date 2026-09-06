import { describe, expect, it } from 'vitest';

import { parseDocumentReference } from '../../../../../supabase/functions/extract-identity-document/validation';

const organizationId = '11111111-1111-4111-8111-111111111111';
const userId = '22222222-2222-4222-8222-222222222222';

describe('extract-identity-document path validation', () => {
  it('accepts only organization-scoped paths owned by the authenticated user', () => {
    expect(
      parseDocumentReference(
        `organizations/${organizationId}/${userId}/33333333-3333-4333-8333-333333333333.pdf`,
        userId,
      )?.organizationId,
    ).toBe(organizationId);
    expect(
      parseDocumentReference(
        `organizations/${organizationId}/44444444-4444-4444-8444-444444444444/file.pdf`,
        userId,
      ),
    ).toBeNull();
  });

  it('rejects traversal, absolute, and cross-user references', () => {
    expect(parseDocumentReference('../secrets.pdf', userId)).toBeNull();
    expect(parseDocumentReference('/organizations/file.pdf', userId)).toBeNull();
    expect(
      parseDocumentReference(
        `organizations/${organizationId}/44444444-4444-4444-8444-444444444444/33333333-3333-4333-8333-333333333333.png`,
        userId,
      ),
    ).toBeNull();
  });
});
