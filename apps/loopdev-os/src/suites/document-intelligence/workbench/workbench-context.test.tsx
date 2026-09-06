/** @vitest-environment jsdom */
import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { WorkbenchPrototypeProvider, useWorkbenchPrototype } from './workbench-context';

function Harness() {
  const workbench = useWorkbenchPrototype();
  const front = new File(['front'], 'front.png', { type: 'image/png' });
  const back = new File(['back'], 'back.png', { type: 'image/png' });

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
      <button
        type="button"
        onClick={() =>
          workbench.startExtraction('success', {
            organizationId: '11111111-1111-4111-8111-111111111111',
            front,
            back,
          })
        }
      >
        extract real
      </button>
      <button type="button" onClick={workbench.retryExtraction}>
        retry
      </button>
      <button type="button" onClick={workbench.markProcessingVisualComplete}>
        processing complete
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
  vi.unstubAllGlobals();
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
      vi.advanceTimersByTime(7400);
    });
    expect(screen.getByTestId('state')).toHaveTextContent('processing');

    fireEvent.click(screen.getByRole('button', { name: 'processing complete' }));
    act(() => {
      vi.advanceTimersByTime(0);
    });
    expect(screen.getByTestId('state')).toHaveTextContent('loading-results');

    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(screen.getByTestId('state')).toHaveTextContent('review');
    fireEvent.click(screen.getByRole('button', { name: 'approve' }));
    expect(screen.getByTestId('state')).toHaveTextContent('preparation');
    expect(Number(screen.getByTestId('history-count').textContent)).toBeGreaterThan(0);
    expect(
      window.localStorage.getItem('loopdev.document-intelligence.operational-history.v1'),
    ).toContain('fixture-spanish-dni');
  });

  it('retries a failed real extraction with the same payload and reaches review', async () => {
    vi.useFakeTimers();
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: false,
        status: 502,
        json: async () => ({
          error: {
            code: 'provider-failed',
            status: 502,
            message: 'The extraction provider timed out.',
            recoverable: true,
          },
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          classification: { type: 'unknown', confidence: null },
          fields: {
            documentType: 'unknown',
            issuingCountry: null,
            fullName: null,
            givenNames: null,
            surnames: null,
            firstSurname: null,
            secondSurname: null,
            documentNumber: null,
            birthDate: null,
            nationality: null,
            sex: null,
            issueDate: null,
            expiryDate: null,
            birthplace: null,
            supportNumber: null,
            address: null,
            mrz: null,
          },
          validations: [],
          provider: 'gemini',
          usage: null,
        }),
      });
    vi.stubGlobal('fetch', fetchMock);

    render(
      <WorkbenchPrototypeProvider>
        <Harness />
      </WorkbenchPrototypeProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'extract real' }));
    await act(async () => {
      await Promise.resolve();
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('state')).toHaveTextContent('error');

    fireEvent.click(screen.getByRole('button', { name: 'retry' }));
    await act(async () => {
      await Promise.resolve();
    });
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(screen.getByTestId('state')).toHaveTextContent('processing');

    const secondCall = fetchMock.mock.calls[1];
    const secondBody = secondCall?.[1]?.body;
    expect(secondCall?.[0]).toBe('/api/document-intelligence/extract');
    expect(secondCall?.[1]?.headers).toEqual({
      'x-loopdev-organization-id': '11111111-1111-4111-8111-111111111111',
    });
    expect(secondBody).toBeInstanceOf(FormData);
    expect((secondBody as FormData).get('front')).toBeInstanceOf(File);
    expect((secondBody as FormData).get('back')).toBeInstanceOf(File);

    fireEvent.click(screen.getByRole('button', { name: 'processing complete' }));
    act(() => {
      vi.advanceTimersByTime(0);
    });
    expect(screen.getByTestId('state')).toHaveTextContent('loading-results');

    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(screen.getByTestId('state')).toHaveTextContent('review');
  });
});
