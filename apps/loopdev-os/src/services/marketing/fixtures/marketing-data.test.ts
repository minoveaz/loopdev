import { describe, expect, it } from 'vitest';
import { marketingFixtureAssets, marketingFixtureBrandSnapshots, marketingFixtureConnections } from './marketing-data';

describe('Marketing offline fixtures', () => {
  it('keeps assets and snapshots organization-scoped', () => {
    expect(marketingFixtureAssets).toHaveLength(2);
    expect(marketingFixtureBrandSnapshots).toHaveLength(2);
    expect(marketingFixtureBrandSnapshots[0]?.assets[0]?.organizationId).toBe(marketingFixtureBrandSnapshots[0]?.organizationId);
    expect(marketingFixtureBrandSnapshots[1]?.assets[0]?.organizationId).toBe(marketingFixtureBrandSnapshots[1]?.organizationId);
  });

  it('includes connected and expired social connection states without credentials', () => {
    expect(marketingFixtureConnections.map((connection) => connection.status)).toEqual(['connected', 'expired']);
    expect(marketingFixtureConnections.every((connection) => !('accessToken' in connection))).toBe(true);
  });
});