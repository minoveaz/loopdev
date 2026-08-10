import { fixturesHomeDataSource } from '../src/data/adapters/fixtures/home';
import { loadHomeData } from '../src/data/home-data';

describe('loadHomeData', () => {
  it('loads suites for the selected organization', async () => {
    const requestedOrganizationIds: Array<string | undefined> = [];
    const source = {
      ...fixturesHomeDataSource,
      getSuites: async (organizationId?: string) => {
        requestedOrganizationIds.push(organizationId);
        return organizationId === 'estar-protegidos'
          ? [{ id: 'workspace-crm', suiteKey: 'crm' as const, name: 'Sales CRM', slug: 'sales-crm', status: 'active' as const }]
          : [{ id: 'workspace-quant', suiteKey: 'quant' as const, name: 'Quant Ops', slug: 'quant-ops', status: 'active' as const }];
      },
    };

    const estarProtegidos = await loadHomeData(source, 'estar-protegidos');
    const loopDev = await loadHomeData(source, 'loopdev');

    expect(requestedOrganizationIds).toEqual(['estar-protegidos', 'loopdev']);
    expect(estarProtegidos.suites.map(({ suiteKey }) => suiteKey)).toEqual(['crm']);
    expect(loopDev.suites.map(({ suiteKey }) => suiteKey)).toEqual(['quant']);
  });

  it('loads all Home data through the shared source contract', async () => {
    const result = await loadHomeData(fixturesHomeDataSource);

    expect(result.status).toBe('success');
    expect(result.organizations).toHaveLength(3);
    expect(result.activity).toHaveLength(3);
    expect(result.notifications).toHaveLength(2);
    expect(result.overview?.activeUsers).toBe(42);
  });

  it('surfaces adapter failures to the caller', async () => {
    const failingSource = { ...fixturesHomeDataSource, getActivity: async () => { throw new Error('network unavailable'); } };

    await expect(loadHomeData(failingSource)).rejects.toThrow('network unavailable');
  });
});