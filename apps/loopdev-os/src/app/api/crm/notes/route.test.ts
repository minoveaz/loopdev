import { beforeEach, describe, expect, it, vi } from 'vitest';

const { authorizeCrm, listCrmNotes } = vi.hoisted(() => ({
  authorizeCrm: vi.fn(),
  listCrmNotes: vi.fn(),
}));

vi.mock('../_lib/access', () => ({ authorizeCrm }));
vi.mock('@/services/crm/operations', () => ({ createCrmNote: vi.fn(), listCrmNotes }));

import { GET } from './route';

describe('CRM notes API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    authorizeCrm.mockResolvedValue({ allowed: false, status: 403 });
  });

  it('does not call the repository without read permission', async () => {
    const response = await GET(new Request('http://localhost/api/crm/notes?organizationId=00000000-0000-4000-9000-000000000001'));
    expect(response.status).toBe(403);
    expect(listCrmNotes).not.toHaveBeenCalled();
  });
});
