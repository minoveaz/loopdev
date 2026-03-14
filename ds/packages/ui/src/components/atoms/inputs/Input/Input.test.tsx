import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Input } from './index';

describe('Input Industrial Certification (Front_Certified 🔵)', () => {
  
  // US-01: Accesibilidad Industrial
  it('US-01: matches label with input via htmlFor and has correct ARIA attributes', () => {
    render(<Input label="Industrial ID" helperText="Enter sensor ID" />);
    const input = screen.getByLabelText('Industrial ID');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('aria-describedby');
    expect(screen.getByText('Enter sensor ID')).toHaveAttribute('id', input.getAttribute('aria-describedby'));
  });

  // US-02: Estados de Feedback
  it('US-02: handles loading, error and disabled states', () => {
    const { rerender } = render(<Input label="Status" isLoading />);
    // Loading state: Spinner should be present, toggle should be hidden
    expect(screen.getByRole('status', { hidden: true })).toBeInTheDocument(); 

    rerender(<Input label="Status" error="System Overload" />);
    expect(screen.getByText('System Overload')).toBeInTheDocument();
    expect(screen.getByLabelText('Status')).toHaveAttribute('aria-invalid', 'true');

    rerender(<Input label="Status" disabled />);
    expect(screen.getByLabelText('Status')).toBeDisabled();
  });

  // US-03: Composición Visual
  it('US-03: renders startIcon and handles password toggle', () => {
    render(
      <Input 
        label="Security" 
        type="password" 
        startIcon={<span data-testid="lock-icon">🔒</span>} 
      />
    );
    expect(screen.getByTestId('lock-icon')).toBeInTheDocument();
    
    const input = screen.getByLabelText('Security') as HTMLInputElement;
    expect(input.type).toBe('password');
    
    const toggle = screen.getByRole('button');
    fireEvent.click(toggle);
    expect(input.type).toBe('text');
  });

  // US-04: Variantes SaaS
  it('US-04: applies correct classes for each variant', () => {
    const { container, rerender } = render(<Input variant="filled" />);
    // Buscamos el wrapper del input (el que tiene la clase de fondo)
    expect(container.querySelector('.bg-slate-100')).toBeInTheDocument();

    rerender(<Input variant="outline" />);
    expect(container.querySelector('.bg-white')).toBeInTheDocument();
  });

  // US-05: Multi-tenant Branding (Focus)
  it('US-05: applies focus ring classes on interaction', () => {
    render(<Input label="Brand" />);
    const input = screen.getByLabelText('Brand');
    fireEvent.focus(input);
    
    // Verificamos que el contenedor del input (el wrapper) tiene la clase de anillo
    const wrapper = input.parentElement;
    expect(wrapper?.className).toContain('ring-blue-500');
  });

});