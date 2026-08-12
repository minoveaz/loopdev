/**
 * @file MetricGauge.test.tsx
 * @description Unit tests for MetricGauge atom component
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MetricGauge } from './index';

describe('MetricGauge Component', () => {
  it('renders correctly with default props', () => {
    render(<MetricGauge value={50} label="RSI" />);

    const gauge = screen.getByRole('status');
    expect(gauge).toBeInTheDocument();
    expect(gauge).toHaveAttribute('aria-label', 'RSI: 50');
  });

  it('displays the current value in the center', () => {
    render(<MetricGauge value={45.5} label="RSI" />);

    const text = screen.getByText('45.5');
    expect(text).toBeInTheDocument();
  });

  it('displays the label below the gauge', () => {
    render(<MetricGauge value={50} label="RSI" />);

    const label = screen.getByText('RSI');
    expect(label).toBeInTheDocument();
  });

  it('shows percentage of range', () => {
    render(<MetricGauge value={50} min={0} max={100} label="RSI" />);

    const percentage = screen.getByText('50% of range');
    expect(percentage).toBeInTheDocument();
  });

  it('handles oversold status (RSI < 30)', () => {
    render(
      <MetricGauge value={25} lowThreshold={30} highThreshold={70} status="oversold" label="RSI" />,
    );

    const statusText = screen.getByText('oversold');
    expect(statusText).toBeInTheDocument();
  });

  it('handles neutral status (RSI 30-70)', () => {
    render(
      <MetricGauge value={50} lowThreshold={30} highThreshold={70} status="neutral" label="RSI" />,
    );

    const statusText = screen.getByText('neutral');
    expect(statusText).toBeInTheDocument();
  });

  it('handles overbought status (RSI > 70)', () => {
    render(
      <MetricGauge
        value={85}
        lowThreshold={30}
        highThreshold={70}
        status="overbought"
        label="RSI"
      />,
    );

    const statusText = screen.getByText('overbought');
    expect(statusText).toBeInTheDocument();
  });

  it('clamps values within min/max', () => {
    const { rerender } = render(<MetricGauge value={150} min={0} max={100} label="RSI" />);

    // Value > max should show as max
    let text = screen.getByText('100.0');
    expect(text).toBeInTheDocument();

    rerender(<MetricGauge value={-50} min={0} max={100} label="RSI" />);

    // Value < min should show as min
    text = screen.getByText('0.0');
    expect(text).toBeInTheDocument();
  });

  it('handles NaN values gracefully', () => {
    render(<MetricGauge value={NaN} label="RSI" />);

    const text = screen.getByText('0.0');
    expect(text).toBeInTheDocument();
  });

  it('supports different size variants', () => {
    const { container: containerSm } = render(<MetricGauge value={50} size="sm" label="RSI" />);
    const { container: containerLg } = render(<MetricGauge value={50} size="lg" label="RSI" />);

    expect(containerSm).toBeInTheDocument();
    expect(containerLg).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<MetricGauge value={50} className="custom-class" label="RSI" />);

    const gauge = container.querySelector('div');
    expect(gauge?.className).toContain('custom-class');
  });

  it('displays unit when provided', () => {
    render(<MetricGauge value={50} unit="%" label="RSI" />);

    const unit = screen.getByText('%');
    expect(unit).toBeInTheDocument();
  });

  it('renders SVG gauge correctly', () => {
    const { container } = render(<MetricGauge value={50} label="RSI" />);

    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<MetricGauge value={50} label="RSI" />);

    const gauge = screen.getByRole('status');
    expect(gauge).toHaveAttribute('aria-label');
  });
});
