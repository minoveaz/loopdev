import { describe, expect, it, vi } from 'vitest';
import { buildPurgeDryRun, isRetentionEligible, processCommunicationsJob, WorkerJobError } from './communicationsWorker.js';

const job = {
  id: '00000000-0000-4000-9000-000000000001',
  type: 'delivery' as const,
  organizationId: '00000000-0000-4000-9000-000000000002',
  accountId: '00000000-0000-4000-9000-000000000003',
  messageId: '00000000-0000-4000-9000-000000000004',
  traceId: 'trace-1',
  createdAt: '2026-08-30T00:00:00.000Z',
};

describe('Communications worker', () => {
  it('acknowledges a valid job and emits a redacted success log', async () => {
    const queue = { receive: vi.fn().mockResolvedValue(job), acknowledge: vi.fn(), fail: vi.fn() };
    const handlers = { deliver: vi.fn(), retry: vi.fn(), purge: vi.fn() };
    const log = vi.fn();
    await expect(processCommunicationsJob(queue, handlers, log)).resolves.toBe(true);
    expect(queue.acknowledge).toHaveBeenCalledWith(job.id);
    expect(log).toHaveBeenCalledWith(expect.objectContaining({ event: 'job_succeeded', traceId: 'trace-1' }));
    expect(JSON.stringify(log.mock.calls[0][0])).not.toContain('body');
  });

  it('marks invalid payloads as validation failures without dispatching a handler', async () => {
    const queue = { receive: vi.fn().mockResolvedValue({ id: job.id, type: 'delivery' }), acknowledge: vi.fn(), fail: vi.fn() };
    const handlers = { deliver: vi.fn(), retry: vi.fn(), purge: vi.fn() };
    await processCommunicationsJob(queue, handlers, vi.fn());
    expect(queue.fail).toHaveBeenCalledWith(job.id, 'VALIDATION_ERROR');
    expect(handlers.deliver).not.toHaveBeenCalled();
  });

  it('records handler failures with a normalized code', async () => {
    const queue = { receive: vi.fn().mockResolvedValue(job), acknowledge: vi.fn(), fail: vi.fn() };
    const handlers = { deliver: vi.fn().mockRejectedValue(new WorkerJobError('PROVIDER_UNAVAILABLE', 'offline')), retry: vi.fn(), purge: vi.fn() };
    const log = vi.fn();
    await processCommunicationsJob(queue, handlers, log);
    expect(queue.fail).toHaveBeenCalledWith(job.id, 'PROVIDER_UNAVAILABLE');
    expect(log).toHaveBeenCalledWith(expect.objectContaining({ event: 'job_failed', errorCode: 'PROVIDER_UNAVAILABLE' }));
  });

  it('selects only expired records without legal hold for a purge dry run', () => {
    const now = new Date('2026-08-30T00:00:00.000Z');
    expect(isRetentionEligible({ id: 'expired', lastActivityAt: '2024-08-29T00:00:00.000Z', legalHold: false }, now)).toBe(true);
    expect(isRetentionEligible({ id: 'held', lastActivityAt: '2024-01-01T00:00:00.000Z', legalHold: true }, now)).toBe(false);
    expect(buildPurgeDryRun([
      { id: 'expired', lastActivityAt: '2024-08-29T00:00:00.000Z', legalHold: false },
      { id: 'active', lastActivityAt: '2026-08-01T00:00:00.000Z', legalHold: false },
    ], now)).toEqual({ eligibleIds: ['expired'], dryRun: true });
  });
});