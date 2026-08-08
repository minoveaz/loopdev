import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { SectionHeader } from './index';

describe('SectionHeader', () => {
  it('has no accessibility violations with an action slot', async () => {
    const { container } = render(
      <SectionHeader title="Brand identity" action={<button type="button">Edit</button>} />,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
