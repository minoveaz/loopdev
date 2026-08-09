import { fixturesHomeDataSource } from '../src/data/adapters/fixtures/home';
import { loadHomeData } from '../src/data/home-data';

describe('loadHomeData', () => {
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