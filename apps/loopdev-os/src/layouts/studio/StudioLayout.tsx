import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AppShell, RightSidebar, useLayout } from '@loopdev/ui';
import { MessageSquare, History, Settings, Sparkles } from 'lucide-react';
import { GlobalHeader } from '@/components/header/GlobalHeader';

export const StudioLayout = () => {
  const [activeTab, setActiveTab] = useState('ai');
  const { isRightSidebarOpen } = useLayout();

  const studioRightSidebar = (
    <RightSidebar 
      isOpen={isRightSidebarOpen} 
      width="md"
      variant="full"
      tabs={[
        { id: 'ai', icon: MessageSquare, label: 'AI Architect' },
        { id: 'history', icon: History, label: 'Changes' },
        { id: 'settings', icon: Settings, label: 'Settings' }
      ]}
      activeTabId={activeTab}
      onTabChange={setActiveTab}
    >
      <RightSidebar.Header title="Architect Intelligence" status="online" />
      <RightSidebar.Body className="bg-slate-50/50">
        <div className="p-4 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-500/20">
          <div className="flex gap-2 items-center mb-2">
            <Sparkles size={16} />
            <span className="text-xs font-bold uppercase tracking-widest">System Active</span>
          </div>
          <p className="text-[11px] leading-relaxed opacity-90">
            Ready to analyze and migrate your blueprints to the Design System.
          </p>
        </div>
      </RightSidebar.Body>
    </RightSidebar>
  );

  return (
    <AppShell
      topBar={<GlobalHeader />} // Lo pasamos como TopBar principal
      rightSidebar={studioRightSidebar}
      hideSidebar={true}
      isFullWidth={true}
    >
      {/* El contenido ahora ocupa el 100% sin padding externo */}
      <div className="h-full w-full">
        <Outlet />
      </div>
    </AppShell>
  );
};