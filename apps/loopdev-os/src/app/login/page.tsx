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
    <div className="min-h-screen w-full bg-background-dark relative overflow-hidden flex items-center justify-center font-sans selection:bg-primary/30">
      
      <TechnicalCanvas variant="blueprint" intensity="medium" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <main className="relative z-10 w-full max-w-[420px] px-6">
        <div className="bg-surface-dark/40 backdrop-blur-xl border border-border-subtle rounded-lpd-lg p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          
          <div className="mb-10 text-center space-y-4">
            <div className="inline-flex items-center justify-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <LpdText size="nano" weight="black" className="text-primary tracking-widest uppercase">Node_Primary_Active</LpdText>
            </div>
            <div className="space-y-1">
              <Heading size="2xl" weight="bold" className="text-white tracking-tighter flex items-center justify-center gap-1">
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
                fullWidth
                disabled={isLoading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
                              <LpdText as="button" type="button" size="nano" weight="black" className="absolute top-0 right-0 text-primary/60 hover:text-primary uppercase tracking-widest h-6 flex items-center pr-1 z-20 cursor-pointer transition-colors">Recuperar</LpdText>            </div>

            {error && (
              <div className="bg-red-500/15 border border-red-500/30 text-red-200 p-3 rounded-lg flex items-center gap-3 text-xs animate-in fade-in slide-in-from-top-1">
                <AlertCircle size={16} className="text-red-400 shrink-0" />
                <span className="leading-relaxed font-medium">{error}</span>
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