import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { AppShell, RightSidebar, Box, useLayout } from '@loopdev/ui';
import { MessageSquare, History, Settings, Sparkles } from 'lucide-react';

export const StudioLayout = () => {
  const [activeTab, setActiveTab] = useState('ai');
  const layout = useLayout();

  useEffect(() => {
    if (layout?.setRightSidebarOpen) {
      layout.setRightSidebarOpen(true);
    }
  }, [layout]);

  const studioRightSidebar = (
    <RightSidebar 
      isOpen={true} 
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
      <RightSidebar.Header 
        title={activeTab === 'ai' ? 'Architect Intelligence' : 'Workbench Tools'} 
        status="online" 
      />
      <RightSidebar.Body>
        <div className="space-y-4">
          <Box padding={4} background="primary" radius="lg" className="shadow-lg shadow-blue-500/20">
            <div className="flex items-start gap-3">
              <Sparkles className="shrink-0 text-white" size={20} />
              <div>
                <p className="text-sm font-bold text-white">Análisis del Blueprint</p>
                <p className="text-xs text-blue-100 mt-1">He detectado 3 patrones legacy. ¿Quieres que genere la versión atómica?</p>
              </div>
            </div>
          </Box>
        </div>
      </RightSidebar.Body>
    </RightSidebar>
  );

  return (
    <div className="h-screen w-full overflow-hidden bg-[var(--lpd-color-bg-base)]">
      {/* 
        Si AppShell está causando la pantalla en blanco por un error interno, 
        esta estructura de fallback nos lo dirá.
      */}
      {AppShell ? (
        <AppShell rightSidebar={studioRightSidebar} hideSidebar={true}>
          <Outlet />
        </AppShell>
      ) : (
        <div className="p-10 text-red-500">Error: AppShell not found in @loopdev/ui</div>
      )}
    </div>
  );
};
