import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
import {
  CommunicationsInboxContext,
  CommunicationsInboxList,
  CommunicationsInboxProvider,
  CommunicationsInboxThread,
} from '@/suites/sales-crm/communications/CommunicationsInboxWidget';
import { COMMUNICATIONS_INBOX_COPY, COMMUNICATIONS_INBOX_FORMATTERS } from '@/suites/sales-crm/communications/copy';
import { createFixtureInboxDataSource } from '@/suites/sales-crm/communications/inbox-data-source';
import { COMMUNICATIONS_INBOX_MODEL } from '@/suites/sales-crm/communications/inbox.fixture';

function renderInbox() {
  return render(
    <CommunicationsInboxProvider
      initialModel={COMMUNICATIONS_INBOX_MODEL}
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

  it('shows filtered-empty feedback for an unmatched search', () => {
    renderInbox();

    fireEvent.change(screen.getByRole('textbox', { name: 'Search conversations' }), {
      target: { value: 'does-not-exist' },
    });

    expect(screen.getByText('No matches')).toBeInTheDocument();
    expect(screen.getByText('Try another search or clear the status filter.')).toBeInTheDocument();
  });

  it('passes axe for the ready composition', async () => {
    const { container } = renderInbox();
    expect(await axe(container)).toHaveNoViolations();
  });
});
