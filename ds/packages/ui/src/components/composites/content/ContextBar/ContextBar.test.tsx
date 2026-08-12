import { render, screen } from '@testing-library/react';
import { ContextBar } from './index';
import { axe } from 'vitest-axe';

describe('ContextBar', () => {
  it('renders operational context and caller-owned slots', () => {
    render(
      <ContextBar
        label="Active brand"
        value="VitaBlue"
        leading={<span aria-hidden="true">●</span>}
        trailing={<button type="button">Change</button>}
      />,
    );

    expect(screen.getByText('Active brand')).toBeInTheDocument();
    expect(screen.getByText('VitaBlue')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Change' })).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<ContextBar label="Active brand" value="VitaBlue" />);

    expect(await axe(container)).toHaveNoViolations();
  });
});
