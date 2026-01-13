/** @vitest-environment jsdom */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { NarrativeBlock } from './index';

describe('NarrativeBlock Composite', () => {
  const mockData: any = {
    mission: 'Test mission',
    vision: 'Test vision',
    promise: 'Test promise',
    values: [{ title: 'V1', description: 'D1' }]
  };

  it('renders all sections correctly in read-only mode', () => {
    render(<NarrativeBlock data={mockData} isEditable={false} />);
    expect(screen.getByText(/Brand Narrative Foundation/i)).toBeDefined();
    expect(screen.getByText('Test mission')).toBeDefined();
    expect(screen.getByText('Test vision')).toBeDefined();
    expect(screen.getByText('V1')).toBeDefined();
  });

  it('shows draft indicator when isEditable is true', () => {
    render(<NarrativeBlock data={mockData} isEditable={true} />);
    expect(screen.getByText(/\/\/ DRAFT_MODE_ACTIVE/i)).toBeDefined();
  });

  it('calls onUpdate when a field is changed in edit mode', () => {
    const onUpdate = vi.fn();
    render(<NarrativeBlock data={mockData} isEditable={true} onUpdate={onUpdate} />);
    const textarea = screen.getByPlaceholderText(/enter mission/i);
    fireEvent.change(textarea, { target: { value: 'Updated Mission' } });
    expect(onUpdate).toHaveBeenCalledWith('mission', 'Updated Mission');
  });
});
