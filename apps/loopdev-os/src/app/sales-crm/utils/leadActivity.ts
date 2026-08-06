import type { Lead } from '../context';

const DAY_MS = 1000 * 60 * 60 * 24;

export function daysSinceContact(lastContactDate: string, now = new Date()): number {
  return Math.ceil(Math.abs(now.getTime() - new Date(lastContactDate).getTime()) / DAY_MS);
}

export function isLeadStale(
  lead: Pick<Lead, 'stage' | 'lastContactDate'>,
  now = new Date(),
): boolean {
  return lead.stage === 'contacted' && daysSinceContact(lead.lastContactDate, now) > 5;
}
