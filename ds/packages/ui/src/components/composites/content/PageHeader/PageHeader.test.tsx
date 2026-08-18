import { render, screen } from '@testing-library/react';
import { PageHeader } from './index';
import { axe } from 'vitest-axe';

describe('PageHeader', () => {
  it('renders a semantic page heading and supporting content', () => {
    render(
      <PageHeader
        eyebrow="Marketing Studio"
        title="Brand Hub"
        description="Manage the active brand system."
      />,
    );

    expect(screen.getByRole('heading', { name: 'Brand Hub', level: 1 })).toBeInTheDocument();
    expect(screen.getByText('Marketing Studio')).toBeInTheDocument();
    expect(screen.getByText('Manage the active brand system.')).toBeInTheDocument();
  });

  it('keeps actions available as a caller-owned slot', () => {
    render(<PageHeader title="Brands" actions={<button type="button">Create brand</button>} />);

    expect(screen.getByRole('button', { name: 'Create brand' })).toBeInTheDocument();
  });

  it('keeps the action slot usable with long supporting content', () => {
    render(
      <PageHeader
        title="Contacts"
        description="Review relationship history, ownership and next actions for the selected account."
        actions={<button type="button">Create contact</button>}
      />,
    );

    expect(screen.getByRole('heading', { name: 'Contacts' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Create contact' })).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<PageHeader title="Brands" />);

    expect(await axe(container)).toHaveNoViolations();
  });
});
