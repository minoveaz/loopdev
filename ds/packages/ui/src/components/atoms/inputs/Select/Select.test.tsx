import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, it, expect } from 'vitest';
import { Select } from './index';

describe('Select Primitive', () => {
  it('has no accessibility violations with a labelled option set', async () => {
    const { container } = render(
      <Select label="Workspace" defaultValue="alpha">
        <option value="alpha">Alpha</option>
        <option value="beta">Beta</option>
      </Select>,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});