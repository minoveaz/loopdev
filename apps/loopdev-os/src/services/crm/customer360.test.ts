import { describe, expect, it } from 'vitest';
import { deduplicateActivityItems } from './customer360';

const ids = {
  tenantId: '00000000-0000-4200-9000-000000000001',
  sourceId: '00000000-0000-4200-9000-000000000002',
  secondId: '00000000-0000-4200-9000-000000000003',
};

function activity(sourceType: 'task' | 'note' | 'event', sourceId: string) {
  const event = {
    id: sourceId,
    organizationId: ids.tenantId,
    tenantId: ids.tenantId,
    workspaceId: null,
    brandId: null,
    relationType: 'contact' as const,
    relationId: ids.tenantId,
    type: 'task' as const,
    actorId: null,
    actorType: 'system' as const,
    origin: 'task' as const,
    occurredAt: '2026-08-19T00:00:00.000Z',
    summary: `${sourceType}:${sourceId}`,
    metadata: {},
  };
  return {
    kind: 'event' as const,
    source: { sourceType, sourceId },
    event,
  };
}

describe('Customer 360 aggregation helpers', () => {
  it('deduplicates only identical sourceType/sourceId pairs', () => {
    const items = [
      activity('task', ids.sourceId),
      activity('task', ids.sourceId),
      activity('note', ids.sourceId),
      activity('event', ids.secondId),
    ];
    expect(deduplicateActivityItems(items)).toHaveLength(3);
    expect(deduplicateActivityItems(items).map((item) => item.source.sourceType)).toEqual([
      'task',
      'note',
      'event',
    ]);
  });
});
