import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CreateMarketingCampaignSchema } from '@loopdev/contracts';

const { getUser, rpc, listMarketingCampaigns, createMarketingCampaign } = vi.hoisted(() => ({
  getUser: vi.fn(),
  rpc: vi.fn(),
  listMarketingCampaigns: vi.fn(),
  createMarketingCampaign: vi.fn(),
}));

vi.mock('@/lib/supabase/server', () => ({
  createServerSupabaseClient: vi.fn(async () => ({ auth: { getUser }, rpc })),
}));

vi.mock('@/services/marketing/campaigns', () => ({
  listMarketingCampaigns,
  createMarketingCampaign,
}));

import { GET, POST } from './route';

const organizationId = '00000000-0000-4000-9000-000000000002';
const brandId = '00000000-0000-4000-9000-000000000003';
const workspaceId = '00000000-0000-4000-9000-000000000004';

const campaignInput = {
  organizationId,
  brandId,
  workspaceId,
  name: 'Summer launch',
  objective: 'Generate qualified leads',
};

function request(url: string, init?: RequestInit) {
  return new Request(`http://localhost${url}`, init);
}

describe('Marketing campaigns API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getUser.mockResolvedValue({ data: { user: { id: '00000000-0000-4000-9000-000000000005' } } });
    rpc.mockResolvedValue({ data: true, error: null });
    listMarketingCampaigns.mockResolvedValue([]);
    createMarketingCampaign.mockResolvedValue({ id: '00000000-0000-4000-9000-000000000006', ...campaignInput });
  });

  it('returns 401 without an authenticated session', async () => {
    getUser.mockResolvedValue({ data: { user: null } });

    const response = await GET(request(`/api/marketing/campaigns?organizationId=${organizationId}&workspaceId=${workspaceId}`));

    expect(response.status).toBe(401);
    expect(listMarketingCampaigns).not.toHaveBeenCalled();
  });

  it('returns 403 without the required marketing permission', async () => {
    rpc.mockResolvedValue({ data: false, error: null });

    const response = await GET(request(`/api/marketing/campaigns?organizationId=${organizationId}&workspaceId=${workspaceId}`));

    expect(response.status).toBe(403);
    expect(listMarketingCampaigns).not.toHaveBeenCalled();
  });

  it('lists campaigns scoped by organization and workspace', async () => {
    const response = await GET(request(`/api/marketing/campaigns?organizationId=${organizationId}&workspaceId=${workspaceId}`));

    expect(response.status).toBe(200);
    expect(listMarketingCampaigns).toHaveBeenCalledWith(organizationId, workspaceId);
    expect(rpc).toHaveBeenCalledWith('has_organization_permission', {
      target_organization_id: organizationId,
      required_permission: 'marketing.read',
    });
  });

  it('returns 400 for an invalid campaign payload', async () => {
    const response = await POST(request('/api/marketing/campaigns', {
      method: 'POST',
      body: JSON.stringify({ ...campaignInput, organizationId: 'not-a-uuid' }),
      headers: { 'content-type': 'application/json' },
    }));

    expect(response.status).toBe(400);
    expect(createMarketingCampaign).not.toHaveBeenCalled();
  });

  it('requires manage permission and creates campaigns for the authenticated user', async () => {
    const parsed = CreateMarketingCampaignSchema.parse(campaignInput);
    const response = await POST(request('/api/marketing/campaigns', {
      method: 'POST',
      body: JSON.stringify(campaignInput),
      headers: { 'content-type': 'application/json' },
    }));

    expect(response.status).toBe(201);
    expect(rpc).toHaveBeenCalledWith('has_organization_permission', {
      target_organization_id: organizationId,
      required_permission: 'marketing.manage',
    });
    expect(createMarketingCampaign).toHaveBeenCalledWith(parsed, '00000000-0000-4000-9000-000000000005');
  });
});
