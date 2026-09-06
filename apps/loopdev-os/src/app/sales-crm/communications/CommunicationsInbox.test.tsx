import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
import {
  CommunicationsInboxContext,
  CommunicationsInboxList,
  CommunicationsInboxProvider,
  CommunicationsInboxThread,
} from '@/suites/sales-crm/communications/CommunicationsInboxWidget';
import {
  COMMUNICATIONS_INBOX_COPY,
  COMMUNICATIONS_INBOX_FORMATTERS,
} from '@/suites/sales-crm/communications/copy';
import { createFixtureInboxDataSource } from '@/suites/sales-crm/communications/inbox-data-source';
import { COMMUNICATIONS_INBOX_MODEL } from '@/suites/sales-crm/communications/inbox.fixture';
import type { InboxPresentationState } from '@/suites/sales-crm/communications/types';

function renderInbox(model = COMMUNICATIONS_INBOX_MODEL) {
  return render(
    <CommunicationsInboxProvider
      initialModel={model}
      dataSource={createFixtureInboxDataSource('You')}
      copy={COMMUNICATIONS_INBOX_COPY}
      formatters={COMMUNICATIONS_INBOX_FORMATTERS}
      actorLabel="You"
    >
      <div className="grid grid-cols-[18rem_minmax(0,1fr)_18rem]">
        <CommunicationsInboxList />
        <CommunicationsInboxThread />
        <CommunicationsInboxContext />
      </div>
    </CommunicationsInboxProvider>,
  );
}

describe('Communications Inbox', () => {
  it('renders the WhatsApp list, selected thread and CRM context', () => {
    renderInbox();

    expect(screen.getByRole('button', { name: /Ana Garcia/ })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Ana Garcia', level: 2 })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'CRM context' })).toBeInTheDocument();
    expect(
      within(screen.getByLabelText('Messages with Ana Garcia')).getByText(
        'Could you send me the updated proposal?',
      ),
    ).toBeInTheDocument();
  });

  it('supports selection, assignment and sending a reply', async () => {
    renderInbox();

    fireEvent.click(screen.getByRole('button', { name: /Ana Garcia/ }));
    expect(screen.getByRole('heading', { name: 'Ana Garcia', level: 2 })).toBeInTheDocument();

    fireEvent.click(screen.getAllByRole('button', { name: /Assign to me/ })[0]);
    await waitFor(() => expect(screen.getAllByRole('button', { name: /You/ })).toHaveLength(2));
    expect(screen.getByRole('button', { name: /Assigned to You/ })).toBeInTheDocument();

    fireEvent.change(screen.getByRole('textbox', { name: 'Reply message' }), {
      target: { value: 'I will send the updated proposal shortly.' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Send reply/ }));

    await waitFor(() => {
      expect(
        within(screen.getByLabelText('Messages with Ana Garcia')).getByText(
          'I will send the updated proposal shortly.',
        ),
      ).toBeInTheDocument();
      expect(screen.getByRole('status')).toHaveTextContent('Reply sent.');
    });
  });

  it('sends an approved template with completed parameters', async () => {
    renderInbox();

    await waitFor(() => expect(screen.getByRole('button', { name: 'Template' })).toBeEnabled());
    fireEvent.click(screen.getByRole('button', { name: 'Template' }));
    const templateSelect = await screen.findByRole('button', {
      name: 'Approved WhatsApp template',
    });
    fireEvent.click(templateSelect);
    const templateOptions = screen.getAllByText('Proposal follow-up');
    fireEvent.click(templateOptions[templateOptions.length - 1]);
    expect(screen.getByRole('textbox', { name: 'Template parameter firstName' })).toHaveValue(
      'Ana',
    );
    fireEvent.click(screen.getByRole('button', { name: /Send reply/ }));

    await waitFor(() => {
      expect(
        within(screen.getByLabelText('Messages with Ana Garcia')).getByText(
          'Hola Ana, te compartimos el seguimiento de tu propuesta.',
        ),
      ).toBeInTheDocument();
      expect(screen.getByRole('status')).toHaveTextContent('Reply sent.');
    });
  });

  it('blocks free-form replies after the WhatsApp window expires', async () => {
    const expiredModel = {
      ...COMMUNICATIONS_INBOX_MODEL,
      conversations: COMMUNICATIONS_INBOX_MODEL.conversations.map((conversation, index) =>
        index === 0
          ? { ...conversation, windowExpiresAt: '2020-01-01T00:00:00.000Z' }
          : conversation,
      ),
    };
    renderInbox(expiredModel);

    expect(
      screen.getByText(
        'The WhatsApp reply window has expired. Use an approved template to restart the conversation.',
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Reply message' })).toBeDisabled();
    await waitFor(() => expect(screen.getByRole('button', { name: 'Template' })).toBeEnabled());
    expect(screen.getByRole('button', { name: /Send reply/ })).toBeDisabled();
  });

  it('renders queued, delivered and failed delivery states in the thread', () => {
    const deliveryModel = {
      ...COMMUNICATIONS_INBOX_MODEL,
      conversations: COMMUNICATIONS_INBOX_MODEL.conversations.map((conversation, index) =>
        index === 0
          ? {
              ...conversation,
              messages: [
                ...conversation.messages,
                {
                  id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
                  organizationId: conversation.organizationId,
                  conversationId: conversation.id,
                  externalId: null,
                  direction: 'outbound' as const,
                  status: 'queued' as const,
                  body: 'Queued message',
                  templateId: null,
                  createdAt: conversation.updatedAt,
                  updatedAt: conversation.updatedAt,
                  kind: 'message' as const,
                  authorName: 'You',
                },
                {
                  id: 'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
                  organizationId: conversation.organizationId,
                  conversationId: conversation.id,
                  externalId: 'wamid.delivered',
                  direction: 'outbound' as const,
                  status: 'delivered' as const,
                  body: 'Delivered message',
                  templateId: null,
                  createdAt: conversation.updatedAt,
                  updatedAt: conversation.updatedAt,
                  kind: 'message' as const,
                  authorName: 'You',
                },
                {
                  id: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
                  organizationId: conversation.organizationId,
                  conversationId: conversation.id,
                  externalId: 'wamid.failed',
                  direction: 'outbound' as const,
                  status: 'failed' as const,
                  body: 'Failed message',
                  templateId: null,
                  createdAt: conversation.updatedAt,
                  updatedAt: conversation.updatedAt,
                  kind: 'message' as const,
                  authorName: 'You',
                },
              ],
            }
          : conversation,
      ),
    };
    renderInbox(deliveryModel);

    const messages = within(screen.getByLabelText('Messages with Ana Garcia'));
    expect(messages.getByText('Delivered')).toBeInTheDocument();
    expect(messages.getByText('Queued')).toBeInTheDocument();
    expect(messages.getByText('Failed')).toBeInTheDocument();
  });

  it('shows filtered-empty feedback for an unmatched search', () => {
    renderInbox();

    fireEvent.change(screen.getByRole('textbox', { name: 'Search conversations' }), {
      target: { value: 'does-not-exist' },
    });

    expect(screen.getByText('No matches')).toBeInTheDocument();
    expect(screen.getByText('Try another search or clear the status filter.')).toBeInTheDocument();
  });

  it('shows the empty inbox state when the authorized inbox has no conversations', () => {
    renderInbox({
      ...COMMUNICATIONS_INBOX_MODEL,
      conversations: [],
      presentation: 'ready',
    });

    expect(screen.getByRole('heading', { name: 'No conversations yet' })).toBeInTheDocument();
    expect(screen.getByText('New WhatsApp conversations will appear here.')).toBeInTheDocument();
  });

  it.each([
    ['paused', 'WhatsApp account paused'],
    ['window-expired', 'Reply window expired'],
    ['send-failure', 'Message not sent'],
    ['conflict', 'Conversation changed'],
    ['offline', 'You are offline'],
  ] as const)('renders the %s presentation state', (state, title) => {
    renderInbox({ ...COMMUNICATIONS_INBOX_MODEL, presentation: state as InboxPresentationState });

    expect(screen.getByRole('heading', { name: title })).toBeInTheDocument();
  });

  it('moves through list, thread and CRM context surfaces for mobile', () => {
    renderInbox();

    const list = screen.getByRole('list', { name: 'Conversations' }).closest('div.bg-background');
    const thread = screen.getByLabelText('Messages with Ana Garcia').closest('div.bg-shell-canvas');
    const context = screen.getByRole('heading', { name: 'CRM context' }).closest('div.space-y-5');

    expect(list.className).not.toContain('max-lg:hidden');
    expect(thread?.className).toContain('max-lg:hidden');
    expect(context?.className).toContain('max-lg:hidden');

    fireEvent.click(screen.getByRole('button', { name: /Ana Garcia/ }));
    expect(list.className).toContain('max-lg:hidden');
    expect(thread?.className).not.toContain('max-lg:hidden');

    fireEvent.click(screen.getByRole('button', { name: 'Open CRM context' }));
    expect(thread?.className).toContain('max-lg:hidden');
    expect(context?.className).not.toContain('max-lg:hidden');

    fireEvent.click(screen.getByRole('button', { name: 'Back to conversation' }));
    expect(thread?.className).not.toContain('max-lg:hidden');
    expect(context?.className).toContain('max-lg:hidden');
  });

  it('passes axe for the ready composition', async () => {
    const { container } = renderInbox();
    expect(await axe(container)).toHaveNoViolations();
  });
});
