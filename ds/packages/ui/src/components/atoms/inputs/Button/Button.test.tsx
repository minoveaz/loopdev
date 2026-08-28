import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Button } from './index';
import { axe } from 'vitest-axe';

describe('Button Primitive', () => {
  it('renders correctly with default props', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('data-control', 'button');
    expect(button).toHaveAttribute('data-control-variant', 'primary');
    expect(button).toHaveAttribute('data-control-size', 'md');
  });

  it('applies the energy variant class correctly', () => {
    render(<Button variant="energy">AI Generate</Button>);
    const button = screen.getByRole('button');
    expect(button.className).toContain('bg-accent');
  });

  it('uses the accent interaction state for primary and outline actions', () => {
    const { rerender } = render(<Button>Filter</Button>);
    expect(screen.getByRole('button')).toHaveClass(
      'text-primary-foreground',
      'hover:bg-accent',
      'hover:text-text-main',
    );

    rerender(<Button variant="outline">Export</Button>);
    expect(screen.getByRole('button')).toHaveClass('hover:border-accent', 'hover:text-accent');
  });

  it('shows loading state and disables interaction', () => {
    render(<Button isLoading>Saving...</Button>);
    const button = screen.getByRole('button');

    // Ahora sí debería estar deshabilitado gracias a la corrección en useButton
    expect(button).toBeDisabled();

    // Buscamos el spinner por su clase de animación
    // Nota: El spinner usa Icon(progress_activity) -> span.material-symbols-outlined + animate-spin
    // Pero en useButton el spinner se renderiza condicionalmente en index.tsx
    // Si usamos Icon component, el test debe buscar el texto del icono o la clase
    const spinnerIcon = screen.getByText('progress_activity');
    expect(spinnerIcon).toBeInTheDocument();
  });

  it('renders start and end icons (Material Symbols)', () => {
    render(
      <Button startIcon="add" endIcon="arrow_forward">
        Icon Button
      </Button>,
    );

    // En Material Symbols, los iconos son texto dentro de un span
    expect(screen.getByText('add')).toBeInTheDocument();
    expect(screen.getByText('arrow_forward')).toBeInTheDocument();
  });

  it('handles extremely long text without crashing', () => {
    const longText = 'A'.repeat(1000);
    render(<Button>{longText}</Button>);
    expect(screen.getByText(longText)).toBeInTheDocument();
  });

  it('maintains structure when both icons and loading state are active', () => {
    render(
      <Button startIcon="add" endIcon="check" isLoading>
        Text
      </Button>,
    );
    // El startIcon debe desaparecer para dar lugar al spinner
    expect(screen.queryByText('add')).not.toBeInTheDocument();
    // El spinner debe estar presente
    expect(screen.getByText('progress_activity')).toBeInTheDocument();
    // El endIcon debe permanecer
    expect(screen.getByText('check')).toBeInTheDocument();
  });

  it('applies the danger variant class correctly', () => {
    render(<Button variant="danger">Delete</Button>);
    const button = screen.getByRole('button');
    expect(button.className).toContain('text-danger');
    expect(button.className).toContain('border-danger');
  });

  it('has no accessibility violations in the default action state', async () => {
    const { container } = render(<Button>Save changes</Button>);

    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });
});
