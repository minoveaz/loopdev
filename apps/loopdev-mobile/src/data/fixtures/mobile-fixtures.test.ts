import { createFixtureHomeDataSource, fixtureSuites } from './mobile-fixtures';

describe('mobile fixtures', () => {
  it('provides the launchpad suite catalog with stable contracts', () => {
    expect(fixtureSuites.map((suite) => suite.suiteId)).toEqual(['marketing', 'crm', 'quant', 'health']);
    expect(fixtureSuites.find((suite) => suite.suiteId === 'health')?.availability).toBe('disabled');
  });

  it('provides an operational scenario', async () => {
    const source = createFixtureHomeDataSource('operational');
    const [organizations, activity, notifications, overview] = await Promise.all([
      source.getOrganizations(),
      source.getActivity(),
      source.getNotifications(),
      source.getPlatformOverview(),
    ]);
    expect(organizations).toHaveLength(2);
    expect(activity.length).toBeGreaterThan(0);
    expect(notifications.some((notification) => notification.unread)).toBe(true);
    expect(overview.systemStatus).toBe('operational');
  });

  it('models empty, degraded, paused, and error scenarios', async () => {
    const empty = createFixtureHomeDataSource('empty');
    const degraded = createFixtureHomeDataSource('degraded');
    const paused = createFixtureHomeDataSource('paused');
    const error = createFixtureHomeDataSource('error');

    expect(await empty.getOrganizations()).toEqual([]);
    expect((await degraded.getPlatformOverview()).systemStatus).toBe('degraded');
    expect((await paused.getOrganizations()).every((organization) => organization.status === 'paused')).toBe(true);
    await expect(error.getOrganizations()).rejects.toThrow('Fixture backend unavailable');
  });
});
