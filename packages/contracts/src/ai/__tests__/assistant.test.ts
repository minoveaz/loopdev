import { describe, expect, it } from 'vitest';
import { AiAssistantRunSchema, AiRecommendationSchema } from '../assistant';

const ids = { id: '00000000-0000-4000-9000-000000000001', organizationId: '00000000-0000-4000-9000-000000000002' };
const timestamp = '2026-08-09T00:00:00.000Z';

describe('CRM AI contracts', () => {
  it('requires an idempotent run context', () => {
    expect(AiAssistantRunSchema.safeParse({ id: ids.id, organizationId: ids.organizationId, taskType: 'conversation_summary', modelProvider: 'server', modelVersion: 'v1', contextVersion: 'crm-1', inputHash: 'hash', createdAt: timestamp }).success).toBe(true);
  });

  it('requires human-review state for recommendations', () => {
    expect(AiRecommendationSchema.safeParse({ id: ids.id, organizationId: ids.organizationId, runId: ids.organizationId, entityType: 'lead', entityId: ids.id, summary: 'Follow up', status: 'pending', createdAt: timestamp, updatedAt: timestamp }).success).toBe(true);
  });
});
