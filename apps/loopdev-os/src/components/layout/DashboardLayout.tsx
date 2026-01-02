'use client'

import React from 'react';
import { Icon, Button } from '@loopdev/ui';
import { useAuth } from '../../hooks/useAuth';

const StatItem = ({ label, value, color }: { label: string, value: string, color: string }) => (
  <div className="space-y-1">
    <div className="flex justify-between text-xs font-medium">
      <span className="text-slate-400">{label}</span>
      <span className="text-white">{value}</span>
    </div>
    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
      <div className={`h-full ${color}`} style={{ width: value.includes('%') ? value : '85%' }}></div>
    </div>
  </div>
);

export const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { handleLogout } = useAuth();

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-surface-dark text-white">
      {/* Top Navbar */}
      <header className="px-8 py-4 flex items-center justify-between glass-panel border-b border-white/5 relative z-20 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
            <Icon name="all_inclusive" className="text-energy-yellow" size="sm" />
          </div>
          <span className="text-lg font-bold tracking-tight">loop.dev</span>
        </div>
        
        <div className="flex items-center gap-6">
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
            <a href="#" className="hover:text-white transition-colors">Workspace</a>
            <a href="#" className="hover:text-white transition-colors">Resources</a>
            <a href="#" className="hover:text-white transition-colors">Analytics</a>
          </nav>
          
          <div className="h-6 w-px bg-white/10 mx-2"></div>
          
          <Button 
            onClick={handleLogout}
            variant="secondary"
            size="sm"
            startIcon={<Icon name="logout" size="sm" />}
          >
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:flex-row p-6 gap-6 overflow-hidden">
        {/* Sidebar / Status */}
        <aside className="w-full md:w-64 flex flex-col gap-6">
          <div className="glass-panel rounded-xl p-6 border border-white/5">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Core Stats</h3>
            <div className="space-y-4">
              <StatItem label="System Health" value="99.9%" color="bg-primary-blue" />
              <StatItem label="Innovation" value="84/100" color="bg-accent-purple" />
              <StatItem label="Focus Score" value="92" color="bg-energy-yellow" />
            </div>
          </div>
          
          <div className="glass-panel rounded-xl p-6 border border-white/5 flex-1">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Live Activity</h3>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-3 text-xs">
                  <div className="w-2 h-2 rounded-full bg-slate-700 mt-1"></div>
                  <div>
                    <p className="text-slate-300 font-medium">Infinite loop module {i} deployed.</p>
                    <p className="text-slate-500">2m ago</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Dashboard Grid (El contenido principal irá aquí) */}
        <section className="flex-1 flex flex-col gap-6 overflow-y-auto pr-2">
          {children}
        </section>
      </div>
    </div>
  );
};
