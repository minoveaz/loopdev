'use client';

import React, { useState } from 'react';
import { Button, Input, Icon } from '@loopdev/ui';
import { Mail, Lock, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Próximo paso: Lógica de Supabase Auth
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div className="bg-surface-dark font-sans h-screen w-full overflow-hidden relative text-white selection:bg-energy-yellow selection:text-black">
      {/* -----------------------------------------------------------------------
          BACKGROUND ELEMENTS (Blobs & Grid)
          ----------------------------------------------------------------------- */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-primary-blue/20 rounded-full blur-[120px] mix-blend-screen animate-blob"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[45vw] h-[45vw] bg-accent-purple/20 rounded-full blur-[100px] mix-blend-screen animate-blob [animation-delay:2s]"></div>
        <div className="absolute top-[40%] left-[60%] w-[25vw] h-[25vw] bg-energy-yellow/10 rounded-full blur-[80px] mix-blend-screen animate-blob [animation-delay:4s]"></div>
        
        {/* SVG Grid Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImEiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTTAgNDB2LTFoMXYxSDB6bTQwIDB2LTFoMXYxSDQwek0wIDB2MWgxVjBIMHptNDAgMHYxaDFWMEg0MHoiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiIGZpbGwtcnVsZT0iZXZlbm9kZCIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNhKSIvPjwvc3ZnPg==')] opacity-30"></div>
        
        {/* Giant Background Brackets */}
        <div className="absolute top-1/4 left-20 text-[20rem] font-thin text-white/5 select-none font-mono opacity-20">{'{'}</div>
        <div className="absolute bottom-1/4 right-20 text-[20rem] font-thin text-white/5 select-none font-mono opacity-20">{'}'}</div>
      </div>

      <main className="relative z-10 w-full h-full flex flex-col md:flex-row">
        {/* -----------------------------------------------------------------------
            LEFT COLUMN: BRANDING
            ----------------------------------------------------------------------- */}
        <div className="hidden md:flex flex-col justify-between w-1/2 p-12 lg:p-20 relative">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-sm">
                <Icon name="all_inclusive" className="text-energy-yellow" />
              </div>
              <span className="text-xl font-bold tracking-tight">loop.dev</span>
            </div>
          </div>
          
          <div className="relative max-w-lg">
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tighter leading-[1.1] mb-6">
              Design the <br/>
              <span className="isotipo-gradient">Infinite</span>
            </h1>
            <p className="text-lg text-slate-400 leading-relaxed font-light">
              Accelerate your workflow with generative intelligence. Where code meets creativity in a seamless loop.
            </p>
          </div>

          <div className="flex gap-8 text-sm font-medium text-slate-500">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary-blue"></span> Systems
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent-purple"></span> Innovation
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-energy-yellow"></span> Focus
            </span>
          </div>
        </div>

        {/* -----------------------------------------------------------------------
            RIGHT COLUMN: LOGIN CARD
            ----------------------------------------------------------------------- */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12 relative">
          <div className="w-full max-w-md dark-glass rounded-2xl p-8 md:p-10 shadow-2xl relative overflow-hidden group border border-white/10">
            {/* Top Border Gradient */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-blue via-accent-purple to-energy-yellow"></div>
            
            <div className="mb-10 text-center relative">
              {/* Animated Isotipo */}
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-surface-dark/50 border border-white/10 mb-6 relative group-hover:scale-110 transition-transform duration-500">
                <Icon name="all_inclusive" size="xl" className="isotipo-gradient animate-pulse-slow" />
                <div className="absolute inset-0 rounded-full border border-primary-blue/20 animate-spin-slow"></div>
                <div className="absolute inset-2 rounded-full border border-energy-yellow/10 animate-spin-slow-reverse"></div>
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
              <p className="text-slate-400 text-sm">Enter your credentials to access the <span className="text-accent-purple font-medium">loop</span>.</p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider ml-1" htmlFor="email">Email Address</label>
                <Input 
                  id="email"
                  type="email"
                  placeholder="name@loop.dev"
                  startIcon={<Mail size={18} />}
                  fullWidth
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between ml-1">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider" htmlFor="password">Password</label>
                  <a className="text-xs font-medium text-accent-purple hover:text-white transition-colors" href="#">Forgot password?</a>
                </div>
                <Input 
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  startIcon={<Lock size={18} />}
                  fullWidth
                  disabled={isLoading}
                />
              </div>

              <div className="pt-2">
                <Button 
                  variant="primary"
                  fullWidth
                  size="lg"
                  isLoading={isLoading}
                  endIcon={!isLoading && <ArrowRight size={18} />}
                  className="bg-primary-blue hover:bg-blue-600 text-energy-yellow font-bold py-3.5 shadow-[0_0_20px_-5px_rgba(19,91,236,0.5)] hover:shadow-[0_0_25px_-5px_rgba(255,215,0,0.3)] transition-all duration-300 transform active:scale-[0.98]"
                >
                  Secure Login
                </Button>
              </div>
            </form>

            <div className="mt-8 pt-6 border-t border-white/5 text-center">
              <p className="text-xs text-slate-500">
                Protected by <span className="text-primary-blue font-semibold">loop.dev</span> Identity. <br/>
                <a className="hover:text-white transition-colors mt-1 inline-block underline decoration-slate-700 underline-offset-4" href="#">Terms of Service</a> • 
                <a className="hover:text-white transition-colors mt-1 inline-block underline decoration-slate-700 underline-offset-4" href="#">Privacy Policy</a>
              </p>
            </div>

            {/* Decorative inner brackets */}
            <div className="absolute -right-6 bottom-10 text-8xl text-white/[0.02] font-mono pointer-events-none select-none font-thin">{'}'}</div>
            <div className="absolute -left-6 top-20 text-8xl text-white/[0.02] font-mono pointer-events-none select-none font-thin">{'{'}</div>
          </div>
        </div>
      </main>
    </div>
  );
}
