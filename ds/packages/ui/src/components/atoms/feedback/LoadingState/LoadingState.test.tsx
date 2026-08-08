import { render, screen } from '@testing-library/react';
import { LoadingState } from './index';
import { axe } from 'vitest-axe';

describe('LoadingState', () => {
  it('exposes a live loading status without layout-specific markup', () => {
    render(<LoadingState label="Loading brands" lines={2} />);

    expect(screen.getByRole('status')).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByText('Loading brands')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<LoadingState label="Loading brands" />);

    expect(await axe(container)).toHaveNoViolations();
  });
});
