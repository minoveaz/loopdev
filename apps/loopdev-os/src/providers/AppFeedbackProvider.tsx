'use client';

import { FeedbackProvider } from '@loopdev/ui';

export function AppFeedbackProvider({ children }: { children: React.ReactNode }) {
  return <FeedbackProvider>{children}</FeedbackProvider>;
}
