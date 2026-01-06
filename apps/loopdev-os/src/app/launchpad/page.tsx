'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Heading, Text as LpdText, Icon, TechnicalCanvas, BrandLogo, UIKitIllustration, EngineeringSeal, SuiteCard, ThemeToggle, SystemStatus, BlueprintBackground, TechnicalSurface } from '@loopdev/ui';
import { Moon, Sun, Monitor, LogOut, ArrowRight } from 'lucide-react';

export default function LaunchpadPage() {
  const { user } = useAuth();

  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-background-dark transition-colors duration-300 flex flex-col font-sans selection:bg-primary/30 relative overflow-hidden">
      
      {/* 1. Technical Atmosphere */}
      <BlueprintBackground intensity="low" withScanline />

      {/* 2. Asymmetric Header */}
      <TechnicalSurface 
        variant="canvas" 
        depth="flat" 
        className="relative z-10 p-8 border-b border-black/5 dark:border-white/5 backdrop-blur-md"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-6">
            <BrandLogo variant="full" size="md" />
            <div className="h-8 w-px bg-black/10 dark:bg-white/10 hidden md:block"></div>
            <div>
              <LpdText size="sm" weight="bold" className="text-slate-900 dark:text-white">
                Welcome, <span className="text-primary font-black">{user?.email?.split('@')[0]}</span>
              </LpdText>
            </div>
          </div>

          {/* System Status & Theme Toggle */}
          <div className="flex items-center gap-4">
            <SystemStatus state="operational" id={user?.id} label="ID" />
            
            <ThemeToggle variant="technical" size="md" />
          </div>
        </div>
      </TechnicalSurface>

      {/* 3. Main Launchpad Grid */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-8 lg:p-24">
        <div className="w-full max-w-6xl">
          <div className="mb-16">
            <LpdText size="nano" weight="black" className="text-primary tracking-[0.5em] uppercase mb-4">Core_Suites_Available</LpdText>
            <Heading size="3xl" weight="bold" className="dark:text-white text-slate-900 tracking-tight max-w-2xl">
              Initialize your <span className="text-primary font-black">Work Context</span> to start building.
            </Heading>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <SuiteCard 
              title="Marketing Studio"
              description="High-performance identity governance and generative content engine for modern teams."
              illustration={<UIKitIllustration />}
              href="/marketing-studio"
              version="1.0.4"
            />
            <SuiteCard 
              title="Sales & CRM"
              description="Pipeline intelligence and relationship management powered by predictive neural models."
              illustration={<Icon name="groups" size="md" />}
              href="#"
              version="0.8.2"
              isLocked
            />
            <SuiteCard 
              title="Financial Ops"
              description="Automated billing, payroll, and industrial-grade fiscal compliance orchestration."
              illustration={<Icon name="payments" size="md" />}
              href="#"
              version="0.5.0"
              isLocked
            />
          </div>
        </div>
      </main>

      {/* Footer Branding */}
      <footer className="relative z-10 p-8 border-t border-white/5 dark:border-white/5 border-black/5 flex justify-between items-center dark:text-white/20 text-slate-400 font-mono text-[9px] uppercase tracking-widest">
        <div>© 2026 LoopDev Systems Architecture</div>
        <div className="flex gap-4">
          <span className="hover:text-primary cursor-pointer transition-colors">Documentation</span>
          <span>/</span>
          <span className="hover:text-primary cursor-pointer transition-colors">API Status</span>
        </div>
      </footer>
    </div>
  );
}
