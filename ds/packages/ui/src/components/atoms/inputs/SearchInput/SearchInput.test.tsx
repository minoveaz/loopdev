import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { SearchInput } from './index';

describe('SearchInput', () => {
  it('keeps value controlled and clears through the public contract', () => {
    const onValueChange = vi.fn();
    render(
      <SearchInput value="Acme" onValueChange={onValueChange} aria-label="Search records" />,
    );

    fireEvent.change(screen.getByRole('textbox', { name: 'Search records' }), {
      target: { value: 'Acme Labs' },
    });
    expect(onValueChange).toHaveBeenCalledWith('Acme Labs');

    fireEvent.click(screen.getByRole('button', { name: 'Clear search' }));
    expect(onValueChange).toHaveBeenCalledWith('');
  });

  it('submits with Enter and exposes loading semantics', () => {
    const onSubmit = vi.fn();
    render(
      <SearchInput
        value="Acme"
        onValueChange={() => undefined}
        onSubmit={onSubmit}
        loading
        aria-label="Search records"
      />,
    );

    fireEvent.keyDown(screen.getByRole('textbox', { name: 'Search records' }), { key: 'Enter' });
    expect(onSubmit).toHaveBeenCalledOnce();
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByText('Loading search results')).toBeInTheDocument();
  });

  it('maps tenant color props to semantic CSS variables', () => {
    const { container } = render(
      <SearchInput
        value=""
        onValueChange={() => undefined}
        colors={{ surface: 'red', border: 'blue', text: 'green', accent: 'orange' }}
      />,
    );
    const root = container.querySelector('[data-search-input="true"]');
    expect(root).toHaveStyle({ '--search-surface': 'red', '--search-border': 'blue' });
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <SearchInput value="" onValueChange={() => undefined} aria-label="Search records" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
