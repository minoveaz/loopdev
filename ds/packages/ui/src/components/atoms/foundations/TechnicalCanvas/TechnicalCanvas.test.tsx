import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { TechnicalCanvas } from './index';

describe('TechnicalCanvas', () => {
  it('renders a token-backed blueprint grid as decorative content', () => {
    const { container } = render(<TechnicalCanvas />);
    const canvas = container.firstElementChild;

    expect(canvas).toHaveAttribute('aria-hidden', 'true');
    expect(canvas).toHaveClass('opacity-[0.04]');
    expect(canvas).toHaveClass('motion-reduce:transition-none');
    expect(canvas).toHaveStyle({
      backgroundImage: expect.stringContaining('currentColor'),
      backgroundSize: '40px 40px',
    });
  });

  it('supports intensity, size and subgrid configuration', () => {
    const { container } = render(
      <TechnicalCanvas intensity="high" size={20} showSubgrid={false} />,
    );
    const canvas = container.firstElementChild;

    expect(canvas).toHaveClass('opacity-20');
    expect(canvas).toHaveStyle({ backgroundSize: '20px 20px' });
    expect(canvas?.getAttribute('style')?.match(/linear-gradient/g)).toHaveLength(2);
  });

  it('renders clean variant without a background image', () => {
    const { container } = render(<TechnicalCanvas variant="clean" />);

    expect(container.firstElementChild).not.toHaveAttribute('style');
  });

  it('uses a readable semantic tone for neural dots in light mode', () => {
    const { container } = render(<TechnicalCanvas variant="neural" intensity="high" />);

    expect(container.firstElementChild).toHaveClass('text-text-main');
    expect(container.firstElementChild).toHaveClass('opacity-20');
  });
});
