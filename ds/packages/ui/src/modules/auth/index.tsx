import React, { createContext, useContext, useState, ReactNode } from 'react';

// Tipos basados en SECURITY_AND_TENANT_MODEL.md
export type Role = 'owner' | 'admin' | 'member' | 'viewer';
export type Permission = string;

interface AuthState {
  user: {
    id: string;
    role: Role;
    permissions: Permission[];
  } | null;
  isAuthenticated: boolean;
}

const PERMISSIONS_BY_ROLE: Record<Role, Permission[]> = {
  owner: ['*'],
  admin: ['create:user', 'delete:user', 'update:user', 'read:user', 'manage:settings'],
  member: ['read:user', 'create:task', 'update:task'],
  viewer: ['read:only', 'read:user', 'read:task'],
};

const AuthContext = createContext<{
  state: AuthState;
  setRole: (role: Role) => void; // Solo para Storybook/Dev
} | null>(null);

export const AuthProvider = ({ children, initialRole = 'admin' }: { children: ReactNode, initialRole?: Role }) => {
  const [role, setRole] = useState<Role>(initialRole);

  const state: AuthState = {
    user: {
      id: 'mock-user-123',
      role: role,
      permissions: PERMISSIONS_BY_ROLE[role],
    },
    isAuthenticated: true,
  };

  return (
    <AuthContext.Provider value={{ state, setRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    // Si se usa fuera del proveedor, asumimos "público" (sin permisos)
    return { 
      hasPermission: () => false,
      role: null
    };
  }
  
  const { state } = context;

  const hasPermission = (requiredPermission: Permission): boolean => {
    if (!state.user) return false;
    if (state.user.permissions.includes('*')) return true; // Superuser
    return state.user.permissions.includes(requiredPermission);
  };

  return {
    user: state.user,
    role: state.user?.role,
    hasPermission,
    // Exponemos setRole solo para tests/stories si es necesario, 
    // pero idealmente debería estar oculto en prod.
    _setRole: context.setRole 
  };
};
