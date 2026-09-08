'use client';

import React from 'react';
import { Heading, Icon, Button } from '@loopdev/ui';
import { useAuth } from '@/hooks/useAuth';

const StatItem = ({ label, value, color }: { label: string; value: string; color: string }) => (
  <div className="space-y-1">
    <div className="flex justify-between text-xs font-medium">
      <span className="text-slate-400">{label}</span>
      <span className="text-white">{value}</span>
    </div>
    <div className="h-1 w-full overflow-hidden rounded-full bg-white/5">
      <div
        className={`h-full ${color}`}
        style={{ width: value.includes('%') ? value : '85%' }}
      ></div>
    </div>
  </div>
);

export const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { signOut } = useAuth();

  return (
    <div className="bg-surface-dark flex h-screen flex-col overflow-hidden text-white">
      {/* Top Navbar */}
      <header className="glass-panel relative z-20 flex shrink-0 items-center justify-between border-b border-white/5 px-8 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
            <Icon name="all_inclusive" className="text-energy-yellow" size="sm" />
          </div>
          <span className="text-lg font-bold tracking-tight">loop.dev</span>
        </div>

        <div className="flex items-center gap-6">
          <nav className="text-text-muted hidden items-center gap-6 text-sm font-medium md:flex">
            <a href="#" className="transition-colors hover:text-white">
              Workspace
            </a>
            <a href="#" className="transition-colors hover:text-white">
              Resources
            </a>
            <a href="#" className="transition-colors hover:text-white">
              Analytics
            </a>
          </nav>

          <div className="mx-2 h-6 w-px bg-white/10"></div>

          <Button onClick={signOut} variant="secondary" size="sm" startIcon="logout">
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col gap-6 overflow-hidden p-6 md:flex-row">
        {/* Sidebar / Status */}
        <aside className="flex w-full flex-col gap-6 md:w-64">
          <div className="glass-panel rounded-xl border border-white/5 p-6">
            <Heading
              as="h3"
              size="xs"
              weight="bold"
              className="mb-4 uppercase tracking-widest text-slate-500"
            >
              Core Stats
            </Heading>
            <div className="space-y-4">
              <StatItem label="System Health" value="99.9%" color="bg-primary-blue" />
              <StatItem label="Innovation" value="84/100" color="bg-accent-purple" />
              <StatItem label="Focus Score" value="92" color="bg-energy-yellow" />
            </div>
          </div>

          <div className="glass-panel flex-1 rounded-xl border border-white/5 p-6">
            <Heading
              as="h3"
              size="xs"
              weight="bold"
              className="mb-4 uppercase tracking-widest text-slate-500"
            >
              Live Activity
            </Heading>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-3 text-xs">
                  <div className="bg-text-muted mt-1 h-2 w-2 rounded-full"></div>
                  <div>
                    <p className="font-medium text-slate-300">Infinite loop module {i} deployed.</p>
                    <p className="text-slate-500">2m ago</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Dashboard Grid (El contenido principal irá aquí) */}
        <section className="flex flex-1 flex-col gap-6 overflow-y-auto pr-2">{children}</section>
      </div>
    </div>
  );
};
