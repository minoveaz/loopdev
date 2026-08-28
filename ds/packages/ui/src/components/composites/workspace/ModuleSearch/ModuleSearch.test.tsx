import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ModuleSearch } from './index';

describe('ModuleSearch', () => {
  it('renders the certified search input with an accessible name', () => {
    render(<ModuleSearch placeholder="Search contacts" />);

    expect(screen.getByRole('textbox', { name: 'Search contacts' })).toHaveAttribute(
      'placeholder',
      'Search contacts',
    );
  });
});
