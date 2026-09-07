'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, LpdText, Heading, TechnicalCanvas } from '@loopdev/ui';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setIsLoading(false);
    } else {
      // Redirigir al Launchpad (Selector de Suites)
      router.push('/launchpad');
    }
  };

  return (
    <div className="bg-background-dark selection:bg-primary/30 relative flex min-h-screen w-full items-center justify-center overflow-hidden font-sans">
      
      <TechnicalCanvas variant="blueprint" intensity="medium" />
      <div className="bg-primary/10 pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px]" />

      <main className="relative z-10 w-full max-w-[420px] px-6">
        <div className="bg-surface-dark/40 border-border-subtle rounded-lpd-lg relative overflow-hidden border p-8 shadow-2xl backdrop-blur-xl">
          <div className="via-primary/50 absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent to-transparent" />
          
          <div className="mb-10 space-y-4 text-center">
            <div className="bg-primary/10 border-primary/20 inline-flex items-center justify-center gap-2 rounded-full border px-3 py-1.5">
              <span className="bg-primary h-1.5 w-1.5 animate-pulse rounded-full" />
              <LpdText size="nano" weight="black" className="text-primary uppercase tracking-widest">Node_Primary_Active</LpdText>
            </div>
            <div className="space-y-1">
              <Heading size="2xl" weight="bold" className="flex items-center justify-center gap-1 tracking-tighter text-white">
                <span className="text-primary font-light">{"{"}</span>
                <span>loop.dev</span>
                <span className="text-primary font-light">{"}"}</span>
              </Heading>
              <LpdText size="nano" weight="bold" className="text-text-muted uppercase tracking-widest">Infrastructure_Gateway</LpdText>
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <Input 
              id="email"
              type="email"
              label="Usuario"
              placeholder="nombre@loop.dev"
              variant="outline"
              startIcon={<Mail size={18} />}
              autoComplete="username"
              fullWidth
              disabled={isLoading}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="relative">
              <Input 
                id="password"
                type="password"
                label="Contraseña"
                placeholder="••••••••"
                variant="outline"
                startIcon={<Lock size={18} />}
                autoComplete="current-password"
                fullWidth
                disabled={isLoading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
                              <LpdText as="button" type="button" size="nano" weight="black" className="text-primary/60 hover:text-primary absolute right-0 top-0 z-20 flex h-6 cursor-pointer items-center pr-1 uppercase tracking-widest transition-colors">Recuperar</LpdText>            </div>

            {error && (
              <div className="bg-status-error/15 border-status-error/30 text-status-error animate-in fade-in slide-in-from-top-1 flex items-center gap-3 rounded-lg border p-3 text-xs">
                <AlertCircle size={16} className="shrink-0 text-red-400" />
                <span className="font-medium leading-relaxed">{error}</span>
              </div>
            )}

            <div className="pt-4">
              <Button variant="primary" fullWidth size="lg" isLoading={isLoading} endIcon="arrow_forward">Login</Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}