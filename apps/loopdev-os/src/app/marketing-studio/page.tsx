'use client';

import { Heading, LpdText, Icon } from '@loopdev/ui';
import Link from 'next/link';

const ModuleCard = ({ title, description, icon, href, status }: { title: string, description: string, icon: string, href: string, status: string }) => (
  <Link href={href}>
    <div className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-primary/30 transition-all duration-300 group cursor-pointer bg-surface-dark/40 backdrop-blur-sm">
      <div className="flex justify-between items-start mb-6">
        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/10 transition-all duration-300">
          <Icon name={icon} className="text-text-muted group-hover:text-primary transition-colors" size="md" />
        </div>
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/5 border border-white/5">
          <div className={`w-1.5 h-1.5 rounded-full ${status === 'Active' ? 'bg-energy-yellow' : 'bg-text-muted'}`}></div>
          <LpdText size="nano" weight="black" className="uppercase tracking-widest text-[8px]">{status}</LpdText>
        </div>
      </div>
      <Heading size="md" weight="bold" className="text-white mb-2 group-hover:text-primary transition-colors">{title}</Heading>
      <LpdText size="sm" className="text-text-muted leading-relaxed">
        {description}
      </LpdText>
    </div>
  </Link>
);

export default function MarketingStudioDashboard() {
  return (
    <div className="p-8 lg:p-12 max-w-7xl mx-auto space-y-12">
      
      <header className="space-y-2">
        <div className="flex items-center gap-2 mb-4">
          <span className="px-2 py-0.5 rounded text-[10px] font-black bg-primary/20 text-primary uppercase tracking-[0.2em] border border-primary/20">Suite_Active</span>
        </div>
        <Heading size="3xl" weight="bold" className="text-white tracking-tight">
          Marketing Studio
        </Heading>
        <LpdText className="text-text-muted text-lg max-w-2xl">
          El centro de control para la identidad de tu marca y la generación de contenido inteligente.
        </LpdText>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ModuleCard 
          title="Brand Hub"
          description="Define y gobierna tus logos, colores y reglas de diseño."
          icon="auto_awesome_motion"
          href="/marketing-studio/brands"
          status="Active"
        />
        <ModuleCard 
          title="Content Engine"
          description="IA Generativa para copys, posts y campañas multicanal."
          icon="edit_note"
          href="/marketing-studio/content"
          status="Coming Soon"
        />
        <ModuleCard 
          title="Digital Assets"
          description="Gestión centralizada de archivos multimedia y plantillas."
          icon="inventory_2"
          href="/marketing-studio/dam"
          status="Coming Soon"
        />
      </div>

      {/* Analytics Placeholder */}
      <div className="pt-8 border-t border-white/5">
        <div className="glass-panel p-8 rounded-2xl border border-white/5 bg-gradient-to-br from-white/5 to-transparent">
          <div className="flex items-center gap-4 mb-6">
            <Icon name="insights" className="text-primary" />
            <Heading size="sm" className="text-white uppercase tracking-widest">Suite Insights</Heading>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <LpdText size="nano" weight="black" className="text-text-muted uppercase mb-1">Brands Managed</LpdText>
              <LpdText size="xl" weight="bold" className="text-white">12</LpdText>
            </div>
            <div>
              <LpdText size="nano" weight="black" className="text-text-muted uppercase mb-1">Assets Stored</LpdText>
              <LpdText size="xl" weight="bold" className="text-white">1.2k</LpdText>
            </div>
            <div>
              <LpdText size="nano" weight="black" className="text-text-muted uppercase mb-1">Campaigns Active</LpdText>
              <LpdText size="xl" weight="bold" className="text-white">8</LpdText>
            </div>
            <div>
              <LpdText size="nano" weight="black" className="text-text-muted uppercase mb-1">AI Credits</LpdText>
              <LpdText size="xl" weight="bold" className="text-white">84%</LpdText>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
