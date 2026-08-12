import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { TechnicalIndicator } from './index';

describe('TechnicalIndicator', () => {
  it('renders icon variant with tooltip fallback title', () => {
    render(<TechnicalIndicator variant="ai" />);
    const icon = screen.getByText('auto_awesome');
    expect(icon).toBeInTheDocument();
    expect(icon.closest('div')).toHaveAttribute('title', 'Asistido por IA');
  });

  it('renders counter variant and executes click action', () => {
    const onClick = vi.fn();
    render(<TechnicalIndicator variant="counter" value={7} onClick={onClick} />);

    fireEvent.click(screen.getByText('7'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<TechnicalIndicator variant="success" tooltip="Done" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
