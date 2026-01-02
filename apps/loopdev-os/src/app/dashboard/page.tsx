'use client'

import { Button, Icon } from '@loopdev/ui';
import { useAuth } from '../../hooks/useAuth';

export default function DashboardPage() {
  const { handleLogout } = useAuth();
  
  return (
    <div className="w-full h-screen bg-slate-900 flex flex-col items-center justify-center text-white font-mono gap-8">
      <Icon name="verified_user" size="xl" className="text-green-500" />
      <div className="text-center">
        <h1 className="text-2xl font-bold">Authentication Successful</h1>
        <p className="text-slate-400">Welcome to the LoopDev Industrial Dashboard.</p>
      </div>
      <Button onClick={handleLogout} variant="secondary">
        Logout
      </Button>
    </div>
  );
}
