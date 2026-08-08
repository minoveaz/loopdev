import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { SimpleLineChart } from './index';

describe('SimpleLineChart Composite', () => {
  it('renders svg paths for line and area', () => {
    const { container } = render(<SimpleLineChart data={[10, 20, 15, 30]} />);
    const paths = container.querySelectorAll('path');

    expect(paths.length).toBeGreaterThanOrEqual(2);
    expect(paths[1]).toHaveAttribute('stroke');
  });

  it('renders live point when isLive is true', () => {
    const { container } = render(<SimpleLineChart data={[1, 2, 3]} isLive />);
    expect(container.querySelector('circle')).toBeInTheDocument();
  });

  it('has no accessibility violations for static chart', async () => {
    const { container } = render(<SimpleLineChart data={[5, 10, 7, 12]} withGrid={false} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
