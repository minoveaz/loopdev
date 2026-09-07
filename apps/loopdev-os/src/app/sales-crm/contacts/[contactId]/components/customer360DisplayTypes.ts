export interface ContactLeadSummary {
  id: string;
  status: string;
  interest?: string | null;
  source?: { kind: string };
  isSimulated?: boolean;
}

export interface OpportunityDisplayItem {
  id: string;
  name: string;
  stageKey: string;
  amount?: number | null;
  currency: string;
  isSimulated?: boolean;
}

export interface TaskDisplayItem {
  id: string;
  title: string;
  status: string;
  priority: string;
  dueAt?: string | null;
  isSimulated?: boolean;
}

export interface TimelineDisplayItem {
  kind: string;
  source: { sourceId: string };
  event?: { occurredAt?: string; summary?: string };
  task?: { createdAt?: string; title?: string };
  note?: { createdAt?: string; body?: string | null };
  isSimulated?: boolean;
}

export interface NoteDisplayItem {
  id: string;
  body: string | null;
  createdAt: string;
  isSimulated?: boolean;
}
