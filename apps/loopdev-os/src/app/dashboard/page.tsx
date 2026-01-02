'use client'

import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Icon } from '@loopdev/ui';

const Card = ({ title, icon }: { title: string, icon: string }) => (
  <div className="glass-panel rounded-xl p-6 hover:border-white/20 transition-all cursor-pointer group border border-white/5">
    <div className="flex items-start justify-between mb-8">
      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
        <Icon name={icon} className="text-primary-blue" size="md" />
      </div>
      <button className="text-slate-500 hover:text-white transition-colors">
        <span className="material-symbols-outlined">more_vert</span>
      </button>
    </div>
    <h4 className="font-bold text-lg mb-1">{title}</h4>
    <p className="text-xs text-slate-400">Modified 4 hours ago</p>
  </div>
);


export default function DashboardPage() {
  return (
    <DashboardLayout>
      {/* Hero Widget (Placeholder por ahora) */}
      <div className="glass-panel rounded-2xl p-8 relative overflow-hidden group min-h-[200px] flex flex-col justify-center border border-white/10">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-blue via-accent-purple to-energy-yellow"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <Icon name="auto_awesome" className="text-energy-yellow animate-pulse" />
            <span className="text-xs font-bold text-energy-yellow uppercase tracking-widest">Generative Intelligence</span>
          </div>
          <p className="text-2xl lg:text-3xl font-bold leading-tight">
            "Initializing Loop Intelligence..."
          </p>
        </div>
        <div className="absolute top-1/2 -right-10 transform -translate-y-1/2 opacity-10 group-hover:opacity-20 transition-opacity">
          <Icon name="all_inclusive" size="xl" className="text-[10rem] text-accent-purple" />
        </div>
      </div>

      {/* Grid de Proyectos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Workspace Alpha" icon="hub" />
        <Card title="Logic Flow V2" icon="account_tree" />
        <Card title="Neural Bridge" icon="psychology" />
        <Card title="Design Loop 4" icon="published_with_changes" />
      </div>
    </DashboardLayout>
  );
}
