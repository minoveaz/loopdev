/** @vitest-environment jsdom */
import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ExtractionReviewForm } from './ExtractionReviewForm';
import { WorkbenchPrototypeProvider, useWorkbenchPrototype } from './workbench-context';

function ReviewHarness() {
  const workbench = useWorkbenchPrototype();
  return (
    <>
      <button type="button" onClick={() => workbench.loadDemoDocument()}>
        fixture
      </button>
      <button
        type="button"
        onClick={() => {
          workbench.startExtraction('success');
          workbench.markProcessingVisualComplete();
        }}
      >
        extract
      </button>
      {workbench.flowState === 'review' ? <ExtractionReviewForm /> : null}
    </>
  );
}

afterEach(() => {
  vi.useRealTimers();
});

describe('ExtractionReviewForm', () => {
  it('starts with Aseguradora 1 and exposes the three profile formats', async () => {
    vi.useFakeTimers();
    render(
      <WorkbenchPrototypeProvider>
        <ReviewHarness />
      </WorkbenchPrototypeProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'fixture' }));
    fireEvent.click(screen.getByRole('button', { name: 'extract' }));
    await act(async () => {
      await vi.advanceTimersByTimeAsync(7400);
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(0);
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(3000);
    });

    expect(screen.getByRole('button', { name: 'Formato de datos' })).toHaveTextContent(
      'Aseguradora 1',
    );
    expect(
      Array.from(document.querySelectorAll('select option')).map((option) => option.textContent),
    ).toEqual(['Aseguradora 1', 'Aseguradora 2', 'ICAO / Internacional']);
  });

  it('copies the current value from an individual field action', async () => {
    vi.useFakeTimers();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    });

    render(
      <WorkbenchPrototypeProvider>
        <ReviewHarness />
      </WorkbenchPrototypeProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'fixture' }));
    fireEvent.click(screen.getByRole('button', { name: 'extract' }));
    await act(async () => {
      await vi.advanceTimersByTimeAsync(7400);
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(0);
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(3000);
    });

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Copiar Nombre(s)' }));
    });

    expect(writeText).toHaveBeenCalledWith('María');
    expect(screen.getByRole('status')).toHaveTextContent('Nombre(s) copiado');
  });
});
