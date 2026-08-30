import { processCommunicationsJob, type CommunicationsJobHandlers, type CommunicationsJobQueue } from './communicationsWorker.js';

export async function startCommunicationsWorker(
  queue: CommunicationsJobQueue,
  handlers: CommunicationsJobHandlers,
  log: (record: Record<string, unknown>) => void,
): Promise<void> {
  let running = true;
  const stop = () => { running = false; };
  process.once('SIGINT', stop);
  process.once('SIGTERM', stop);

  while (running) {
    const processed = await processCommunicationsJob(queue, handlers, log);
    if (!processed) await new Promise((resolve) => setTimeout(resolve, 250));
  }
}