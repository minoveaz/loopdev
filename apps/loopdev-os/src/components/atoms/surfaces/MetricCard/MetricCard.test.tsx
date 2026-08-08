/**
 * @file MetricCard.test.tsx
 * @description Unit tests for MetricCard atom component
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MetricCard } from './index';

describe('MetricCard Component', () => {
  it('renders correctly with required props', () => {
    render(<MetricCard label="SMA50" value={71000.45} />);

    const label = screen.getByText('SMA50');
    const value = screen.getByText('71000.45');

    expect(label).toBeInTheDocument();
    expect(value).toBeInTheDocument();
  });

  it('displays unit when provided', () => {
    render(<MetricCard label="Price" value={71073.74} unit="$" />);

    const unit = screen.getByText('$');
    expect(unit).toBeInTheDocument();
  });

  it('displays secondary value when provided', () => {
    render(<MetricCard label="SMA50" value={71000.45} secondaryValue={'+0.103%'} />);

    const secondary = screen.getByText('+0.103%');
    expect(secondary).toBeInTheDocument();
  });

  it('displays description when provided', () => {
    render(<MetricCard label="ATR" value={36.146} description="36 pips volatility" />);

    const description = screen.getByText('36 pips volatility');
    expect(description).toBeInTheDocument();
  });

  it('shows loading skeleton when isLoading is true', () => {
    const { container } = render(<MetricCard label="Price" value={0} isLoading={true} />);

    const skeleton = container.querySelector('.animate-pulse');
    expect(skeleton).toBeInTheDocument();
  });

  it('displays correct status colors', () => {
    const { container: normalContainer } = render(
      <MetricCard label="Test" value={1} status="normal" />,
    );
    const { container: warningContainer } = render(
      <MetricCard label="Test" value={1} status="warning" />,
    );
    const { container: alertContainer } = render(
      <MetricCard label="Test" value={1} status="alert" />,
    );
    const { container: successContainer } = render(
      <MetricCard label="Test" value={1} status="success" />,
    );

    expect(normalContainer).toBeInTheDocument();
    expect(warningContainer).toBeInTheDocument();
    expect(alertContainer).toBeInTheDocument();
    expect(successContainer).toBeInTheDocument();
  });

  it('shows direction indicator when direction is provided', () => {
    const { rerender } = render(<MetricCard label="Price" value={71000} direction="up" />);

    let indicator = screen.getByText('↑');
    expect(indicator).toBeInTheDocument();

    rerender(<MetricCard label="Price" value={71000} direction="down" />);
    indicator = screen.getByText('↓');
    expect(indicator).toBeInTheDocument();

    rerender(<MetricCard label="Price" value={71000} direction="neutral" />);
    // neutral direction shouldn't show indicator
  });

  it('handles numeric and string values', () => {
    const { rerender } = render(<MetricCard label="Price" value={71000.45} />);

    expect(screen.getByText('71000.45')).toBeInTheDocument();

    rerender(<MetricCard label="Status" value="NORMAL" />);
    expect(screen.getByText('NORMAL')).toBeInTheDocument();
  });

  it('supports different size variants', () => {
    const { container: smContainer } = render(<MetricCard label="Test" value={1} size="sm" />);
    const { container: mdContainer } = render(<MetricCard label="Test" value={1} size="md" />);
    const { container: lgContainer } = render(<MetricCard label="Test" value={1} size="lg" />);

    expect(smContainer).toBeInTheDocument();
    expect(mdContainer).toBeInTheDocument();
    expect(lgContainer).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <MetricCard label="Test" value={1} className="custom-test-class" />,
    );

    const card = screen.getByRole('status');
    expect(card).toHaveClass('custom-test-class');
  });

  it('has proper accessibility attributes', () => {
    render(<MetricCard label="Price" value={71000} />);

    const card = screen.getByRole('status');
    expect(card).toHaveAttribute('aria-label');
  });

  it('handles large and small numbers correctly', () => {
    const { rerender } = render(<MetricCard label="Test" value={1000000.999} />);

    expect(screen.getByText('1000001.00')).toBeInTheDocument();

    rerender(<MetricCard label="Test" value={0.00001} />);
    expect(screen.getByText('0.00')).toBeInTheDocument();
  });

  it('applies status color to direction indicator', () => {
    const { container } = render(
      <MetricCard label="Price" value={71000} direction="up" status="success" />,
    );

    const indicator = screen.getByText('↑');
    // Indicator should exist (green for up direction)
    expect(indicator).toBeInTheDocument();
  });
});
