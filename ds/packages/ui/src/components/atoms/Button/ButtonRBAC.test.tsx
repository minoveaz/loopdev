import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Button } from './index';
import { AuthProvider } from '../../../modules/auth';

describe('Button RBAC Security', () => {
  it('should be enabled if user has required permission', () => {
    render(
      <AuthProvider initialRole="admin">
        <Button permission="create:user">Create User</Button>
      </AuthProvider>
    );

    const button = screen.getByRole('button', { name: /create user/i });
    expect(button).not.toBeDisabled();
    expect(button).not.toHaveAttribute('aria-disabled', 'true');
  });

  it('should be disabled if user LACKS required permission', () => {
    // Member no tiene permiso 'delete:user'
    render(
      <AuthProvider initialRole="member">
        <Button permission="delete:user">Delete User</Button>
      </AuthProvider>
    );

    const button = screen.getByRole('button', { name: /delete user/i });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-disabled', 'true');
    expect(button).toHaveAttribute('title', 'No tienes permisos para realizar esta acción.');
  });

  it('should always be enabled for OWNER (Superuser)', () => {
    render(
      <AuthProvider initialRole="owner">
        <Button permission="super:dangerous:action">Nuke It</Button>
      </AuthProvider>
    );

    const button = screen.getByRole('button', { name: /nuke it/i });
    expect(button).not.toBeDisabled();
  });

  it('should support explicit disabled prop even if user has permission', () => {
    // Admin tiene permiso, pero el botón está disabled explícitamente
    render(
      <AuthProvider initialRole="admin">
        <Button permission="create:user" disabled>Create User</Button>
      </AuthProvider>
    );

    const button = screen.getByRole('button', { name: /create user/i });
    expect(button).toBeDisabled();
  });
});
