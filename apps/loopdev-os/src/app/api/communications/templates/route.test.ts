import { beforeEach, describe, expect, it, vi } from 'vitest';

const { authorizeCommunications, listCommunicationTemplates } = vi.hoisted(() => ({
  authorizeCommunications: vi.fn(),
  listCommunicationTemplates: vi.fn(),
}));

vi.mock('../_lib/access', () => ({ authorizeCommunications }));
vi.mock('@/services/communications/core', () => ({ listCommunicationTemplates }));

import { GET } from './route';

const organizationId = '00000000-0000-4000-9000-000000000001';
const userId = '00000000-0000-4000-9000-000000000003';

function request(url: string) {
  return new Request(url);
}

describe('Communications templates API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    authorizeCommunications.mockResolvedValue({ allowed: true, userId });
  });

  it('rejects an invalid organization before authorization', async () => {
    const response = await GET(request('http://localhost/api/communications/templates?organizationId=invalid'));

    expect(response.status).toBe(400);
    expect(authorizeCommunications).not.toHaveBeenCalled();
  });

  it('returns unauthorized when there is no authenticated user', async () => {
    authorizeCommunications.mockResolvedValue({ allowed: false, status: 401 });

    const response = await GET(request(`http://localhost/api/communications/templates?organizationId=${organizationId}`));

    expect(response.status).toBe(401);
    expect(listCommunicationTemplates).not.toHaveBeenCalled();
  });

  it('returns forbidden when the user lacks communications read permission', async () => {
    authorizeCommunications.mockResolvedValue({ allowed: false, status: 403 });

    const response = await GET(request(`http://localhost/api/communications/templates?organizationId=${organizationId}`));

    expect(response.status).toBe(403);
    expect(authorizeCommunications).toHaveBeenCalledWith(organizationId, 'communications.read');
    expect(listCommunicationTemplates).not.toHaveBeenCalled();
  });

  it('returns approved templates from Core after authorization', async () => {
    const templates = [{
      id: '00000000-0000-4000-9000-000000000004',
      organizationId,
      channel: 'whatsapp',
      externalTemplateId: 'proposal_follow_up',
      language: 'es',
      name: 'proposal_follow_up',
      body: 'Hola {{firstName}}',
      parameterNames: ['firstName'],
    }];
    listCommunicationTemplates.mockResolvedValue(templates);

    const response = await GET(request(`http://localhost/api/communications/templates?organizationId=${organizationId}`));

    expect(response.status).toBe(200);
    expect(authorizeCommunications).toHaveBeenCalledWith(organizationId, 'communications.read');
    expect(listCommunicationTemplates).toHaveBeenCalledWith(organizationId);
    expect(await response.json()).toEqual({ templates });
  });
});