import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './index';
import { AuthProvider, useAuth } from '../../../modules/auth';

const meta: Meta<typeof Button> = {
  title: 'Atoms/Primitives/Button/RBAC Security',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <AuthProvider initialRole="member">
        <div className="flex flex-col gap-6 items-center p-8 border border-dashed border-gray-300 rounded-lg">
          <Story />
          <RoleSwitcher />
        </div>
      </AuthProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Button>;

// Helper para cambiar roles en tiempo real en Storybook
const RoleSwitcher = () => {
  const { role, _setRole } = useAuth();
  if (!_setRole) return null;

  return (
    <div className="flex gap-2 text-sm bg-gray-50 p-2 rounded-lg border border-gray-200">
      <span className="font-bold text-gray-500 self-center mr-2">Current Role: {role?.toUpperCase()}</span>
      {(['owner', 'admin', 'member', 'viewer'] as const).map(r => (
        <button
          key={r}
          onClick={() => _setRole(r)}
          className={`px-3 py-1 rounded ${role === r ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border hover:bg-gray-100'}`}
        >
          {r}
        </button>
      ))}
    </div>
  );
};

export const SecureActions: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-96">
      <div className="flex justify-between items-center pb-4 border-b">
        <h3 className="font-bold text-gray-700">User Management</h3>
      </div>
      
      <div className="flex items-center justify-between">
        <span>Create New User</span>
        <Button variant="primary" size="sm" permission="create:user">
          Create User
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <span>Edit Settings</span>
        <Button variant="secondary" size="sm" permission="manage:settings">
          Edit Config
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <span>Delete Database</span>
        <Button variant="danger" size="sm" permission="delete:user">
          Delete DB
        </Button>
      </div>

      <div className="mt-4 p-3 bg-blue-50 text-blue-800 text-xs rounded">
        <p><strong>Try changing the role above!</strong></p>
        <ul className="list-disc pl-4 mt-1">
          <li><strong>Owner:</strong> Can do everything.</li>
          <li><strong>Admin:</strong> Can Create/Edit/Delete.</li>
          <li><strong>Member:</strong> Can only read (Buttons disabled).</li>
          <li><strong>Viewer:</strong> Strictly read-only.</li>
        </ul>
      </div>
    </div>
  )
};
