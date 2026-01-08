import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SuiteHomeLayout } from './index';

const MOCK_PROPS: any = {
  title: 'Marketing Studio',
  subtitle: 'The control center for your brand identity.',
  contextLine: 'Working on brand: Loop Health',
  userState: 'active',
  quickActions: [],
  metrics: [],
  modules: [],
  activity: []
};

describe('SuiteHomeLayout Chassis', () => {
  it('renders Hero correctly with title and context', () => {
    render(<SuiteHomeLayout {...MOCK_PROPS} />);
    expect(screen.getByText('Marketing Studio')).toBeInTheDocument();
    expect(screen.getByText(/Loop Health/i)).toBeInTheDocument();
  });

  it('renders Notices when provided', () => {
    const propsWithNotice = {
      ...MOCK_PROPS,
      notices: [{ id: '1', message: 'Alert: low credits', tone: 'warning' }]
    };
    render(<SuiteHomeLayout {...propsWithNotice} />);
    expect(screen.getByText(/Alert: low credits/i)).toBeInTheDocument();
  });
});
