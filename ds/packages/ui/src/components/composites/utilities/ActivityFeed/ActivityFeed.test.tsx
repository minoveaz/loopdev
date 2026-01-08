import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ActivityFeed } from './index';

const MOCK_ITEMS = [
  {
    id: '1',
    icon: 'cloud_upload',
    action: 'New assets uploaded',
    module: 'Marketing Assets',
    timestamp: '10m ago',
    tone: 'primary' as const
  }
];

describe('ActivityFeed Composite', () => {
  it('renders the feed title correctly', () => {
    render(<ActivityFeed items={MOCK_ITEMS} title="System Activity" />);
    expect(screen.getByText('System Activity')).toBeInTheDocument();
  });

  it('renders activity items with correct actions', () => {
    render(<ActivityFeed items={MOCK_ITEMS} />);
    expect(screen.getByText('New assets uploaded')).toBeInTheDocument();
    expect(screen.getByText(/Marketing Assets/i)).toBeInTheDocument();
  });

  it('renders the "View All" button when onViewAll is provided', () => {
    const onViewAll = () => {};
    render(<ActivityFeed items={MOCK_ITEMS} onViewAll={onViewAll} />);
    expect(screen.getByText('View All')).toBeInTheDocument();
  });
});
