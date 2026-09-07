'use client'

import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Heading, Icon, IconButton } from '@loopdev/ui';

const Card = ({ title, icon }: { title: string, icon: string }) => (
  <div className="glass-panel group cursor-pointer rounded-xl border border-white/5 p-6 transition-all hover:border-white/20">
    <div className="mb-8 flex items-start justify-between">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 transition-transform group-hover:scale-110">
        <Icon name={icon} className="text-primary-blue" size="md" />
      </div>
      <IconButton icon="more_vert" size="sm" aria-label={`Más acciones para ${title}`} className="text-slate-500 transition-colors hover:text-white" />
    </div>
    <Heading as="h4" size="sm" weight="bold" className="mb-1">{title}</Heading>
    <p className="text-xs text-slate-400">Modified 4 hours ago</p>
  </div>
);


export default function DashboardPage() {
  return (
    <DashboardLayout>
      {/* Hero Widget (Placeholder por ahora) */}
      <div className="glass-panel group relative flex min-h-[200px] flex-col justify-center overflow-hidden rounded-2xl border border-white/10 p-8">
        <div className="from-primary-blue via-accent-purple to-energy-yellow absolute left-0 top-0 h-1 w-full bg-gradient-to-r"></div>
        <div className="relative z-10">
          <div className="mb-4 flex items-center gap-2">
            <Icon name="auto_awesome" className="text-energy-yellow animate-pulse" />
            <span className="text-energy-yellow text-xs font-bold uppercase tracking-widest">Generative Intelligence</span>
          </div>
          <p className="text-2xl font-bold leading-tight lg:text-3xl">
            &quot;Initializing Loop Intelligence...&quot;
          </p>
        </div>
        <div className="absolute -right-10 top-1/2 -translate-y-1/2 transform opacity-10 transition-opacity group-hover:opacity-20">
          <Icon name="all_inclusive" size="xl" className="text-accent-purple text-[10rem]" />
        </div>
      </div>

      {/* Grid de Proyectos */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card title="Workspace Alpha" icon="hub" />
        <Card title="Logic Flow V2" icon="account_tree" />
        <Card title="Neural Bridge" icon="psychology" />
        <Card title="Design Loop 4" icon="published_with_changes" />
      </div>
    </DashboardLayout>
  );
}
