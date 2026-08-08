import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SuiteLaunchpad } from './index';

describe('SuiteLaunchpad Composite', () => {
  it('renders title, description and child content', () => {
    render(
      <SuiteLaunchpad
        title="Marketing Studio"
        description="Operational launchpad"
        quickActions={[
          { id: 'qa-1', label: 'Open analytics', description: 'Open analytics', icon: 'BarChart3', onClick: vi.fn() },
        ]}
      >
        <div>Launchpad Content</div>
      </SuiteLaunchpad>,
    );

    expect(screen.getByRole('heading', { name: 'Marketing Studio' })).toBeInTheDocument();
    expect(screen.getByText('Operational launchpad')).toBeInTheDocument();
    expect(screen.getByText('Launchpad Content')).toBeInTheDocument();
  });

  it('calls onSearch and action callbacks', async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();
    const onPrimary = vi.fn();
    const onQuick = vi.fn();

    render(
      <SuiteLaunchpad
        title="Suite"
        description="Desc"
        onSearch={onSearch}
        primaryAction={{ id: 'create', label: 'Create', description: 'create', icon: 'Plus', onClick: onPrimary }}
        quickActions={[
          { id: 'qa-1', label: 'Quick one', description: 'quick', icon: 'Sparkles', onClick: onQuick },
        ]}
      />,
    );

    await user.type(screen.getByPlaceholderText(/Search in this suite/i), 'alpha');
    expect(onSearch).toHaveBeenLastCalledWith('alpha');

    await user.click(screen.getByRole('button', { name: /Create/i }));
    expect(onPrimary).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole('button', { name: /Quick one/i }));
    expect(onQuick).toHaveBeenCalledTimes(1);
  });
});