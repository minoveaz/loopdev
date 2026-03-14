import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ToastViewport } from './components';
import { toast, toastStore } from './toastStore';

describe('Toast System: Full Hardening (v2.1 Compliance)', () => {
  
  beforeEach(() => {
    vi.useFakeTimers();
    toastStore.dismissAll();
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // --- FRONTEND & UI STORIES ---

  it('Story 1: renders toast and auto-dismisses after duration', async () => {
    render(<ToastViewport activeTenantId="loopdev" />);
    await act(async () => {
      toast.show({ tenantId: 'loopdev', title: 'Success' });
    });
    expect(screen.getByText('Success')).toBeInTheDocument();
    await act(async () => {
      vi.advanceTimersByTime(5100);
    });
    expect(screen.queryByText('Success')).not.toBeInTheDocument();
  });

  it('Story 2: renders correct boxed semantic icons', async () => {
    render(<ToastViewport activeTenantId="loopdev" />);
    await act(async () => {
      toast.show({ tenantId: 'loopdev', variant: 'success', title: 'S' });
      toast.show({ tenantId: 'loopdev', variant: 'error', title: 'E' });
    });
    expect(screen.getByText('check_circle')).toBeInTheDocument();
    expect(screen.getByText('error')).toBeInTheDocument();
  });

  it('Story 5: respects maxVisible limit in the viewport', async () => {
    render(<ToastViewport activeTenantId="loopdev" maxVisible={2} />);
    await act(async () => {
      toast.show({ tenantId: 'loopdev', title: 'Toast 1' });
      toast.show({ tenantId: 'loopdev', title: 'Toast 2' });
      toast.show({ tenantId: 'loopdev', title: 'Toast 3' });
    });
    expect(screen.queryByText('Toast 1')).not.toBeInTheDocument();
    expect(screen.getByText('Toast 2')).toBeInTheDocument();
    expect(screen.getByText('Toast 3')).toBeInTheDocument();
  });

  it('Story 5.1: pauses auto-dismiss on mouse enter', async () => {
    render(<ToastViewport activeTenantId="loopdev" />);
    await act(async () => {
      toast.show({ tenantId: 'loopdev', title: 'Pause Test', duration: 5000 });
    });
    const item = screen.getByText('Pause Test').closest('div');
    await act(async () => {
      fireEvent.mouseEnter(item!);
    });
    await act(async () => {
      vi.advanceTimersByTime(10000);
    });
    expect(screen.getByText('Pause Test')).toBeInTheDocument();
  });

  it('Story 6: applies correct A11y roles (alert for errors, status for info)', async () => {
    render(<ToastViewport activeTenantId="loopdev" />);
    await act(async () => {
      toast.show({ tenantId: 'loopdev', variant: 'error', title: 'Critical Error' });
      toast.show({ tenantId: 'loopdev', variant: 'success', title: 'Stable State' });
    });
    
    // Buscamos directamente por el rol ARIA
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  // --- INFRASTRUCTURE & SECURITY STORIES ---

  it('Story 3: deduplicates identical notifications', async () => {
    render(<ToastViewport activeTenantId="loopdev" />);
    await act(async () => {
      toast.show({ tenantId: 'loopdev', dedupeKey: 'up', title: 'Update 1' });
    });
    await act(async () => {
      toast.show({ tenantId: 'loopdev', dedupeKey: 'up', title: 'Update 2' });
    });
    expect(screen.queryByText('Update 1')).not.toBeInTheDocument();
    expect(screen.getByText('Update 2')).toBeInTheDocument();
  });

  it('Story 8: prevents data leakage between tenants (Isolation)', async () => {
    render(<ToastViewport activeTenantId="tenant-a" />);
    await act(async () => {
      toast.show({ tenantId: 'tenant-b', title: 'Foreign Data' });
    });
    expect(screen.queryByText('Foreign Data')).not.toBeInTheDocument();
  });

  it('Story 9: triggers automatic telemetry on error variants', async () => {
    await act(async () => {
      toast.show({ tenantId: 'loopdev', variant: 'error', title: 'Telemetry Test' });
    });
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('[TELEMETRY]'));
  });

});