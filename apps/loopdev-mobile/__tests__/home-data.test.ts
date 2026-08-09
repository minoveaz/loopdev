import { fixturesHomeDataSource } from '../src/data/adapters/fixtures/home';

describe('fixtures home data source', () => {
  it('exposes the contract required by the shell', async () => {
    const [organizations, activity, notifications, overview] = await Promise.all([
      fixturesHomeDataSource.getOrganizations(),
      fixturesHomeDataSource.getActivity(),
      fixturesHomeDataSource.getNotifications(),
      fixturesHomeDataSource.getPlatformOverview(),
    ]);

    expect(organizations.length).toBeGreaterThan(0);
    expect(activity.length).toBeGreaterThan(0);
    expect(notifications.length).toBeGreaterThan(0);
    expect(overview.systemStatus).toBe('operational');
  });
});