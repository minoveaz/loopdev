'use client';

import type { ReactNode } from 'react';
import { CommunicationsInboxContext } from './InboxContext';
import { CommunicationsInboxFooter } from './InboxFooter';
import { CommunicationsInboxList } from './InboxList';
import { CommunicationsInboxModuleHeader } from './InboxModuleHeader';
import { CommunicationsInboxThread } from './InboxThread';
import { CommunicationsInboxProvider } from './useCommunicationsInbox';

export type CommunicationsInboxWidgetProps = {
  children?: ReactNode;
};

export function CommunicationsInboxWidget({ children }: CommunicationsInboxWidgetProps) {
  return children ?? <CommunicationsInboxThread />;
}

export {
  CommunicationsInboxContext,
  CommunicationsInboxFooter,
  CommunicationsInboxList,
  CommunicationsInboxModuleHeader,
  CommunicationsInboxProvider,
  CommunicationsInboxThread,
};

export { useInbox } from './useCommunicationsInbox';
export type * from './types';
