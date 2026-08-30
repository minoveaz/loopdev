import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { InboxContextValue, InboxModel, InboxProviderProps, InboxConversation } from './types';

const InboxContext = createContext<InboxContextValue | null>(null);

export function useInbox() {
  const value = useContext(InboxContext);
  if (!value) {
    throw new Error('Communications inbox components must be rendered inside the provider.');
  }
  return value;
}

function loadingModel(organizationId: string) {
  return {
    organizationId,
    conversations: [],
    capabilities: {
      canReply: false,
      canNote: false,
      canAssign: false,
      canChangeLifecycle: false,
    },
    presentation: 'loading' as const,
  };
}

function modelForDataSource(
  model: InboxModel,
  dataSource: InboxProviderProps['dataSource'],
): InboxModel {
  return {
    ...model,
    capabilities: {
      canReply: model.capabilities.canReply && Boolean(dataSource.send),
      canNote: model.capabilities.canNote && Boolean(dataSource.send),
      canAssign: model.capabilities.canAssign && Boolean(dataSource.assignToSelf),
      canChangeLifecycle: model.capabilities.canChangeLifecycle && Boolean(dataSource.changeStatus),
    },
  };
}

export function CommunicationsInboxProvider({
  children,
  organizationId,
  initialModel,
  dataSource,
  copy,
  formatters,
  actorLabel,
}: InboxProviderProps) {
  const useFixtureModel =
    organizationId === undefined ||
    !organizationId ||
    process.env.NEXT_PUBLIC_E2E_AUTH_BYPASS === 'true';
  const [model, setModel] = useState(() =>
    modelForDataSource(initialModel ?? loadingModel(organizationId ?? ''), dataSource),
  );
  const [conversations, setConversations] = useState(model.conversations);
  const [selectedId, setSelectedId] = useState<string | undefined>(model.conversations[0]?.id);
  const [filter, setFilter] = useState<InboxContextValue['filter']>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [composerMode, setComposerMode] = useState<InboxContextValue['composerMode']>('reply');
  const [draft, setDraft] = useState('');
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [reloadVersion, setReloadVersion] = useState(0);
  const [mobileSurface, setMobileSurface] = useState<InboxContextValue['mobileSurface']>('list');

  useEffect(() => {
    if (useFixtureModel || !organizationId) return;

    let isMounted = true;
    setModel(loadingModel(organizationId));
    setConversations([]);
    setSelectedId(undefined);

    void dataSource
      .load(organizationId)
      .then((nextModel) => {
        if (!isMounted) return;
        setModel(modelForDataSource(nextModel, dataSource));
        setConversations(nextModel.conversations);
        setSelectedId(nextModel.conversations[0]?.id);
      })
      .catch(() => {
        if (!isMounted) return;
        setModel({ ...loadingModel(organizationId), presentation: 'error' });
      });

    return () => {
      isMounted = false;
    };
  }, [dataSource, organizationId, reloadVersion, useFixtureModel]);

  const visibleConversations = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    return conversations.filter((conversation) => {
      const matchesFilter = filter === 'all' || conversation.status === filter;
      const matchesQuery =
        !normalizedQuery ||
        `${conversation.contactName} ${conversation.preview} ${conversation.contactCompany}`
          .toLowerCase()
          .includes(normalizedQuery);
      return matchesFilter && matchesQuery;
    });
  }, [conversations, filter, searchQuery]);

  const selectedConversation = conversations.find(({ id }) => id === selectedId);

  const updateSelected = (update: (conversation: InboxConversation) => InboxConversation) => {
    setConversations((current) =>
      current.map((conversation) =>
        conversation.id === selectedId ? update(conversation) : conversation,
      ),
    );
  };

  const applyAction = async (
    action: (() => Promise<{ conversation?: InboxConversation }>) | undefined,
    notice: string,
  ) => {
    if (!selectedConversation || !action) return;
    const result = await action();
    if (result.conversation) {
      updateSelected(() => result.conversation as InboxConversation);
    }
    setActionNotice(notice);
  };

  const value: InboxContextValue = {
    model,
    conversations: visibleConversations,
    selectedConversation,
    filter,
    searchQuery,
    composerMode,
    draft,
    actionNotice,
    copy,
    formatters,
    actorLabel,
    mobileSurface,
    setFilter,
    setSearchQuery,
    selectConversation: (conversationId) => {
      setSelectedId(conversationId);
      setActionNotice(null);
      setMobileSurface('thread');
    },
    showMobileList: () => setMobileSurface('list'),
    showMobileThread: () => setMobileSurface('thread'),
    showMobileContext: () => setMobileSurface('context'),
    setComposerMode: (mode) => {
      setComposerMode(mode);
      setActionNotice(null);
    },
    setDraft,
    retry: () => setReloadVersion((current) => current + 1),
    assignToSelf: () => {
      void applyAction(
        dataSource.assignToSelf?.bind(dataSource, selectedConversation as InboxConversation),
        copy.actionNotice.assigned,
      );
    },
    sendDraft: () => {
      const body = draft.trim();
      if (!body || !selectedConversation) return;
      void applyAction(
        dataSource.send?.bind(dataSource, selectedConversation, composerMode, body),
        composerMode === 'note' ? copy.actionNotice.noteAdded : copy.actionNotice.replySent,
      ).then(() => setDraft(''));
    },
    changeStatus: (status) => {
      void applyAction(
        dataSource.changeStatus?.bind(
          dataSource,
          selectedConversation as InboxConversation,
          status,
        ),
        copy.actionNotice.statusChanged(copy.statusLabel(status)),
      );
    },
  };

  return <InboxContext.Provider value={value}>{children}</InboxContext.Provider>;
}
