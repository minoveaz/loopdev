/** @vitest-environment jsdom */
import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { WorkbenchPrototypeProvider, useWorkbenchPrototype } from './workbench-context';

function Harness() {
  const workbench = useWorkbenchPrototype();
  return (
    <div>
      <output data-testid="state">{workbench.flowState}</output>
      <output data-testid="history-count">{workbench.history.length}</output>
      <button type="button" onClick={() => workbench.loadDemoDocument()}>
        fixture
      </button>
      <button type="button" onClick={() => workbench.startExtraction('success')}>
        extract
      </button>
      <button type="button" onClick={() => workbench.completeReview('approved')}>
        approve
      </button>
    </div>
  );
}

afterEach(() => {
  window.localStorage.clear();
  vi.useRealTimers();
});

describe('WorkbenchPrototypeProvider', () => {
  it('persists the operational fixture flow and closes a basic review decision', () => {
    vi.useFakeTimers();
    render(
      <WorkbenchPrototypeProvider>
        <Harness />
      </WorkbenchPrototypeProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'fixture' }));
    expect(screen.getByTestId('state')).toHaveTextContent('preparation');
    fireEvent.click(screen.getByRole('button', { name: 'extract' }));
    expect(screen.getByTestId('state')).toHaveTextContent('processing');

    act(() => {
      vi.advanceTimersByTime(1600);
    });
    expect(screen.getByTestId('state')).toHaveTextContent('review');
    fireEvent.click(screen.getByRole('button', { name: 'approve' }));
    expect(screen.getByTestId('state')).toHaveTextContent('preparation');
    expect(Number(screen.getByTestId('history-count').textContent)).toBeGreaterThan(0);
    expect(
      window.localStorage.getItem('loopdev.document-intelligence.operational-history.v1'),
    ).toContain('fixture-spanish-dni');
  });
});
