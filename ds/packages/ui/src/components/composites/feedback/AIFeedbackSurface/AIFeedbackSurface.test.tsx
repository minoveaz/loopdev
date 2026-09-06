import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { AIFeedbackSurface } from './index';

describe('AIFeedbackSurface', () => {
  const steps = [
    { id: 'prepare', label: 'Prepare', status: 'complete' as const },
    { id: 'extract', label: 'Extract', description: 'Reading fields', status: 'active' as const },
  ];

  it('renders consumer-owned copy, stages and progress', () => {
    render(
      <AIFeedbackSurface
        title="Extracting document data"
        description="The document remains inside the tenant boundary."
        status="processing"
        statusLabel="PROCESSING"
        activeMessage="Reading fields"
        progress={66}
        steps={steps}
      />,
    );

    expect(screen.getByRole('region')).toHaveTextContent('Extracting document data');
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '66');
    expect(screen.getAllByText('Extract').length).toBeGreaterThan(0);
    expect(screen.getByText('Prepare')).toBeInTheDocument();
  });

  it('clamps progress and has no accessibility violations', async () => {
    const { container } = render(
      <AIFeedbackSurface
        title="Complete"
        description="Ready for review."
        status="success"
        progress={120}
        steps={steps}
      />,
    );

    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');
    expect(await axe(container)).toHaveNoViolations();
  });

  it('advances stages and reaches 100 percent when configured for timed progress', () => {
    vi.useFakeTimers();
    render(
      <AIFeedbackSurface
        title="Processing"
        description="Working"
        status="processing"
        autoAdvance
        tickMs={20}
        steps={[
          { id: 'one', label: 'One', durationMs: 100 },
          { id: 'two', label: 'Two', durationMs: 100 },
        ]}
      />,
    );

    act(() => {
      vi.advanceTimersByTime(120);
    });
    expect(screen.getAllByText('Two').length).toBeGreaterThan(0);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '60');

    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');
    vi.useRealTimers();
  });

  it('notifies completion after holding the completed 100 percent state', () => {
    vi.useFakeTimers();
    const onComplete = vi.fn();
    render(
      <AIFeedbackSurface
        title="Processing"
        description="Working"
        status="processing"
        autoAdvance
        tickMs={20}
        completionHoldMs={100}
        onComplete={onComplete}
        steps={[{ id: 'one', label: 'One', durationMs: 100 }]}
      />,
    );

    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');
    expect(screen.getByText('Completado')).toBeInTheDocument();
    expect(onComplete).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(onComplete).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });

  it('keeps the phase title, description and terminal message aligned', () => {
    const { rerender } = render(
      <AIFeedbackSurface
        title="Processing"
        description="General processing"
        status="processing"
        steps={[
          {
            id: 'prepare',
            label: 'Prepare document',
            description: 'Validating the temporary file',
            typingMessage: 'Validating the temporary file',
            status: 'active',
          },
          {
            id: 'extract',
            label: 'Extract identity',
            description: 'Reading identity fields',
            typingMessage: 'Reading identity fields',
            status: 'pending',
          },
        ]}
      />,
    );

    expect(screen.getByRole('heading', { name: 'Prepare document' })).toBeInTheDocument();
    expect(screen.getByText('Validating the temporary file')).toBeInTheDocument();

    rerender(
      <AIFeedbackSurface
        title="Processing"
        description="General processing"
        status="processing"
        steps={[
          {
            id: 'prepare',
            label: 'Prepare document',
            description: 'Validating the temporary file',
            typingMessage: 'Validating the temporary file',
            status: 'complete',
          },
          {
            id: 'extract',
            label: 'Extract identity',
            description: 'Reading identity fields',
            typingMessage: 'Reading identity fields',
            status: 'active',
          },
        ]}
      />,
    );

    expect(screen.getByRole('heading', { name: 'Extract identity' })).toBeInTheDocument();
    expect(screen.getByText('Reading identity fields')).toBeInTheDocument();
  });

  afterEach(() => {
    vi.useRealTimers();
  });
});
