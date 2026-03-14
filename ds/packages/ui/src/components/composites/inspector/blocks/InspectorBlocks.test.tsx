import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { ContextBlock, ImpactBlock, DiffBlock, GovernanceBlock } from './index';

describe('Inspector Blocks', () => {
  describe('ContextBlock', () => {
    it('renders title and items', () => {
      const items = [
        { label: 'Label 1', value: 'Value 1' },
        { label: 'Label 2', value: 'Value 2' }
      ];
      render(<ContextBlock title="Test Title" items={items} />);
      
      // Use regex for case-insensitive matching as CSS might capitalize/uppercase
      expect(screen.getByText(/Test Title/i)).toBeDefined();
      expect(screen.getByText('Label 1')).toBeDefined();
      expect(screen.getByText('Value 1')).toBeDefined();
    });
  });

  describe('ImpactBlock', () => {
    it('renders with correct severity and description', () => {
      render(
        <ImpactBlock 
          severity="high" 
          description="High impact test description" 
          affectedModules={['CRM', 'DAM']} 
        />
      );

      // The title defaults to 'Impact Analysis' if not provided
      expect(screen.getByText(/Impact Analysis/i)).toBeDefined();
      expect(screen.getByText('High impact test description')).toBeDefined();
      expect(screen.getByText('HIGH')).toBeDefined();
      expect(screen.getByText('CRM')).toBeDefined();
      expect(screen.getByText('DAM')).toBeDefined();
    });
  });

  describe('DiffBlock', () => {
    it('renders changes with symbols', () => {
      const changes: any = [
        { type: 'added', label: 'Added Item' },
        { type: 'removed', label: 'Removed Item' }
      ];
      render(<DiffBlock changes={changes} />);

      expect(screen.getByText('+')).toBeDefined();
      expect(screen.getByText('Added Item')).toBeDefined();
      expect(screen.getByText('-')).toBeDefined();
      expect(screen.getByText('Removed Item')).toBeDefined();
    });
  });

  describe('GovernanceBlock', () => {
    it('renders steps correctly', () => {
      const steps: any = [
        { role: 'Step 1', status: 'approved', actor: 'Actor 1' },
        { role: 'Step 2', status: 'pending' }
      ];
      render(<GovernanceBlock steps={steps} />);

      expect(screen.getByText(/Step 1/i)).toBeDefined();
      expect(screen.getByText(/APPROVED/i)).toBeDefined();
      expect(screen.getByText(/Actor 1/i)).toBeDefined();
      expect(screen.getByText(/Step 2/i)).toBeDefined();
      expect(screen.getByText(/PENDING/i)).toBeDefined();
    });
  });
});