import React from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { PositionProgressBar } from './index';

describe('PositionProgressBar', () => {
  it('renders long polarity labels by default', () => {
    render(
      <PositionProgressBar
        currentPrice={105}
        entryPrice={100}
        slPrice={90}
        tpPrice={120}
      />,
    );

    expect(screen.getByText('STOP_LOSS')).toBeInTheDocument();
    expect(screen.getByText('TAKE_PROFIT')).toBeInTheDocument();
  });

  it('inverts edge labels in short mode', () => {
    const { container } = render(
      <PositionProgressBar
        currentPrice={95}
        entryPrice={100}
        slPrice={110}
        tpPrice={80}
        isShort
      />,
    );

    const labels = container.querySelectorAll('span');
    expect(labels[0]).toHaveTextContent('TAKE_PROFIT');
    expect(labels[1]).toHaveTextContent('STOP_LOSS');
  });

  it('returns null when no valid range exists', () => {
    const { container } = render(
      <PositionProgressBar
        currentPrice={100}
        entryPrice={100}
        slPrice={0}
        tpPrice={0}
      />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <PositionProgressBar
        currentPrice={102}
        entryPrice={100}
        slPrice={90}
        tpPrice={120}
        bePrice={101}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
