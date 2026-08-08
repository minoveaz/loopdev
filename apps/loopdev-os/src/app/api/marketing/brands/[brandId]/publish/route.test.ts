import { beforeEach, describe, expect, it, vi } from 'vitest';

const { getUser, rpc, publishBrandContextVersion } = vi.hoisted(() => ({
  getUser: vi.fn(),
  rpc: vi.fn(),
  publishBrandContextVersion: vi.fn(),
}));

vi.mock('@/lib/supabase/server', () => ({
  createServerSupabaseClient: vi.fn(async () => ({ auth: { getUser }, rpc })),
}));

vi.mock('@/services/marketing/brandContext', () => ({ publishBrandContextVersion }));

import { POST } from './route';

const organizationId = '00000000-0000-4000-9000-000000000001';
const brandId = '00000000-0000-4000-9200-000000000001';

function request(url: string) {
  return new Request(`http://localhost${url}`, { method: 'POST' });
}

describe('Brand context publish API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getUser.mockResolvedValue({ data: { user: { id: '00000000-0000-4000-8100-000000000001' } } });
    rpc.mockResolvedValue({ data: true, error: null });
    publishBrandContextVersion.mockResolvedValue({
      id: '00000000-0000-4000-9500-000000000001',
      organizationId,
      brandId,
      versionNumber: 1,
      status: 'published',
      snapshot: {},
      publishedAt: '2026-08-08T00:00:00.000Z',
      createdBy: '00000000-0000-4000-8100-000000000001',
      createdAt: '2026-08-08T00:00:00.000Z',
    });
  });

  it('returns 401 without a session', async () => {
    getUser.mockResolvedValue({ data: { user: null } });
    const response = await POST(request(`/api/marketing/brands/${brandId}/publish?organizationId=${organizationId}`), { params: Promise.resolve({ brandId }) });
    expect(response.status).toBe(401);
  });

  it('requires marketing.manage', async () => {
    rpc.mockResolvedValue({ data: false, error: null });
    const response = await POST(request(`/api/marketing/brands/${brandId}/publish?organizationId=${organizationId}`), { params: Promise.resolve({ brandId }) });
    expect(response.status).toBe(403);
    expect(publishBrandContextVersion).not.toHaveBeenCalled();
  });

  it('publishes the requested brand for the authenticated user', async () => {
    const response = await POST(request(`/api/marketing/brands/${brandId}/publish?organizationId=${organizationId}`), { params: Promise.resolve({ brandId }) });
    expect(response.status).toBe(201);
    expect(publishBrandContextVersion).toHaveBeenCalledWith(organizationId, brandId, '00000000-0000-4000-8100-000000000001');
  });
});
