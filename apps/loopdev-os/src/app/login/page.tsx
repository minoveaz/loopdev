'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, Icon, toast, ToastViewport } from '@loopdev/ui';
import { useAuth } from '../../hooks/useAuth';

export default function LoginPage() {
  const router = useRouter();
  const { 
    email, 
    setEmail, 
    password, 
    setPassword, 
    isLoading, 
    error, 
    handleLogin 
  } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await handleLogin();
    if (success) {
      router.push('/dashboard');
    }
  };

  useEffect(() => {
    if (error) {
      toast.show({
        variant: 'error',
        title: 'Authentication Failed',
        description: error,
      });
    }
  }, [error]);

  return (
    <>
      <ToastViewport position="bottom-center" />
      <div className="bg-surface-dark font-sans h-screen w-full overflow-hidden relative text-white selection:bg-energy-yellow selection:text-black">
        {/* ... (código del fondo y branding se mantiene igual) ... */}
        {/* ... */}
        
        <main className="relative z-10 w-full h-full flex flex-col md:flex-row">
          {/* ... (panel izquierdo de branding se mantiene igual) ... */}
          {/* ... */}
          
          {/* Panel derecho con el formulario CONECTADO */}
          <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12 relative">
            <div className="w-full max-w-md glass-panel rounded-2xl p-8 md:p-10 shadow-2xl relative overflow-hidden group border border-white/10">
              {/* ... (Header y logo del panel) ... */}

              <form className="space-y-6" onSubmit={handleSubmit}>
                <Input 
                  label="Email Address"
                  id="email" 
                  type="email"
                  placeholder="name@loop.dev" 
                  startIcon={<Icon name="mail" size="sm" />}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  fullWidth
                  disabled={isLoading}
                  error={error ? { message: ' ' } : undefined}
                />

                <div className="space-y-1 relative">
                  <div className="absolute right-1 top-0 z-10">
                    <a className="text-[10px] font-bold uppercase tracking-tighter text-accent-purple hover:text-white transition-colors" href="#">Forgot password?</a>
                  </div>
                  <Input 
                    label="Password"
                    id="password" 
                    type="password"
                    placeholder="••••••••" 
                    startIcon={<Icon name="lock" size="sm" />}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    fullWidth
                    disabled={isLoading}
                    error={error ? { message: ' ' } : undefined}
                  />
                </div>

                <div className="pt-4">
                  <Button 
                    variant="primary"
                    fullWidth
                    size="lg"
                    isLoading={isLoading}
                    className="shadow-[0_0_20px_-5px_rgba(19,91,236,0.5)] hover:shadow-[0_0_25px_-5px_rgba(255,215,0,0.3)]"
                  >
                    Secure Login
                  </Button>
                </div>
              </form>

              {/* ... (Footer del panel) ... */}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
