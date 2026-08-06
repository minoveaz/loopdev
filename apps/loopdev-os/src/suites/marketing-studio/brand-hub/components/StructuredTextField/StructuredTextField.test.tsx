/** @vitest-environment jsdom */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { StructuredTextField } from './index';

describe('StructuredTextField Molecule', () => {
  it('renders label and value in read-only mode', () => {
    render(
      <StructuredTextField 
        label="Mission" 
        value="Our test mission" 
        isEditable={false} 
      />
    );
    // Be specific about the label (nano text)
    expect(screen.getByText(/^MISSION$/i)).toBeDefined();
    expect(screen.getByText('Our test mission')).toBeDefined();
  });

  it('renders placeholder syntax when value is empty', () => {
    render(
      <StructuredTextField 
        label="Vision" 
        value="" 
        isEditable={false} 
      />
    );
    expect(screen.getByText('// vision_not_defined')).toBeDefined();
  });

  it('transforms into a textarea when isEditable is true', () => {
    render(
      <StructuredTextField 
        label="Values" 
        value="Original value" 
        isEditable={true} 
      />
    );
    const textarea = screen.getByPlaceholderText(/enter values/i);
    expect(textarea).toBeDefined();
    expect((textarea as HTMLTextAreaElement).value).toBe('Original value');
  });

  it('calls onValueChange when typing in edit mode', () => {
    const onValueChange = vi.fn();
    render(
      <StructuredTextField 
        label="Mission" 
        value="" 
        isEditable={true} 
        onValueChange={onValueChange}
      />
    );
    const textarea = screen.getByPlaceholderText(/enter mission/i);
    fireEvent.change(textarea, { target: { value: 'New text' } });
    expect(onValueChange).toHaveBeenCalledWith('New text');
  });

  it('calls onClick when in read-only mode', () => {
    const onClick = vi.fn();
    render(
      <StructuredTextField 
        label="Mission" 
        value="Click me" 
        isEditable={false} 
        onClick={onClick}
      />
    );
    const container = screen.getByText('Click me').parentElement?.parentElement;
    fireEvent.click(container!);
    expect(onClick).toHaveBeenCalled();
  });
});
