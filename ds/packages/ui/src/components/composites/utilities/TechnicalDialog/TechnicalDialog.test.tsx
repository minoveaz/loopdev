import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TechnicalDialog } from './index';

describe('TechnicalDialog Composite', () => {
  it('does not render when closed', () => {
    render(<TechnicalDialog isOpen={false} onClose={vi.fn()} title="Confirm" />);
    expect(screen.queryByText('Confirm')).not.toBeInTheDocument();
  });

  it('renders title, description and actions when open', () => {
    render(
      <TechnicalDialog
        isOpen
        onClose={vi.fn()}
        title="Delete protocol"
        description="This operation is irreversible"
        actions={<button>Confirm Delete</button>}
      >
        <div>Dialog body</div>
      </TechnicalDialog>,
    );

    expect(screen.getByText('Delete protocol')).toBeInTheDocument();
    expect(screen.getByText('This operation is irreversible')).toBeInTheDocument();
    expect(screen.getByText('Dialog body')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Confirm Delete' })).toBeInTheDocument();
    expect(document.body.querySelector('.lpd-technical-dialog-backdrop')).toBeVisible();
  });

  it('invokes onClose from backdrop click', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <TechnicalDialog isOpen onClose={onClose} title="Close me" />,
    );

    const backdrop = document.body.querySelector('.lpd-technical-dialog-backdrop') as HTMLElement;
    await user.click(backdrop);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
