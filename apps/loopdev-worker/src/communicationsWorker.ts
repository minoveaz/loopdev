import {
  CommunicationWorkerJobSchema,
  type CommunicationWorkerJob,
} from '@loopdev/contracts';

export type CommunicationsJobQueue = {
  receive(): Promise<unknown | null>;
  acknowledge(jobId: string): Promise<void>;
  fail(jobId: string, errorCode: string): Promise<void>;
};

export type CommunicationsJobHandlers = {
  deliver(job: CommunicationWorkerJob): Promise<void>;
  retry(job: CommunicationWorkerJob): Promise<void>;
  purge(job: CommunicationWorkerJob): Promise<void>;
};

export type CommunicationRetentionRecord = {
  id: string;
  lastActivityAt: string;
  legalHold: boolean;
};

export type WorkerLogRecord = {
  event: 'job_succeeded' | 'job_failed';
  jobId: string;
  jobType: CommunicationWorkerJob['type'];
  organizationId: string;
  accountId: string | null;
  messageId: string | null;
  traceId: string;
  attempt: number;
  errorCode: string | null;
};

export async function processCommunicationsJob(
  queue: CommunicationsJobQueue,
  handlers: CommunicationsJobHandlers,
  log: (record: WorkerLogRecord) => void,
): Promise<boolean> {
  const value = await queue.receive();
  if (!value) return false;

  const parsed = CommunicationWorkerJobSchema.safeParse(value);
  if (!parsed.success) {
    await queue.fail(readJobId(value), 'VALIDATION_ERROR');
    return true;
  }

  const job = parsed.data;
  try {
    await handlerFor(job, handlers)(job);
    await queue.acknowledge(job.id);
    log(workerLogRecord('job_succeeded', job, null));
  } catch (error) {
    const errorCode = error instanceof WorkerJobError ? error.code : 'WORKER_EXECUTION_FAILED';
    await queue.fail(job.id, errorCode);
    log(workerLogRecord('job_failed', job, errorCode));
  }
  return true;
}

export function isRetentionEligible(
  record: CommunicationRetentionRecord,
  now: Date,
  retentionMonths = 24,
): boolean {
  if (record.legalHold) return false;
  const lastActivity = Date.parse(record.lastActivityAt);
  if (Number.isNaN(lastActivity)) return false;
  const cutoff = new Date(now);
  cutoff.setUTCMonth(cutoff.getUTCMonth() - retentionMonths);
  return lastActivity < cutoff.getTime();
}

export function buildPurgeDryRun(
  records: CommunicationRetentionRecord[],
  now: Date,
): { eligibleIds: string[]; dryRun: true } {
  return {
    eligibleIds: records.filter((record) => isRetentionEligible(record, now)).map((record) => record.id),
    dryRun: true,
  };
}

export class WorkerJobError extends Error {
  constructor(readonly code: string, message: string) {
    super(message);
  }
}

function handlerFor(job: CommunicationWorkerJob, handlers: CommunicationsJobHandlers) {
  if (job.type === 'delivery') return handlers.deliver;
  if (job.type === 'retry') return handlers.retry;
  return handlers.purge;
}

function workerLogRecord(
  event: WorkerLogRecord['event'],
  job: CommunicationWorkerJob,
  errorCode: string | null,
): WorkerLogRecord {
  return {
    event,
    jobId: job.id,
    jobType: job.type,
    organizationId: job.organizationId,
    accountId: job.accountId ?? null,
    messageId: job.messageId ?? null,
    traceId: job.traceId,
    attempt: job.attempt,
    errorCode,
  };
}

function readJobId(value: unknown): string {
  return typeof value === 'object' && value !== null && 'id' in value && typeof value.id === 'string'
    ? value.id
    : 'unknown';
}