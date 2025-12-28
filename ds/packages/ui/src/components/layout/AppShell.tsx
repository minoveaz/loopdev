import React, { useState } from 'react';
import { TopBar } from './TopBar';
import { Sidebar } from './Sidebar';
import { Stack, Container, SafeArea } from './foundations';
import { cn } from '@/helpers/cn';

export interface AppShellProps {
  children: React.ReactNode;
  header?: React.ReactNode; // Slot for PageHeader (Level 2)
  hideSidebar?: boolean;
}

export const AppShell: React.FC<AppShellProps> = ({ children, header, hideSidebar = false }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Stack gap={0} className="h-screen overflow-hidden bg-[var(--lpd-color-bg-base)] text-[var(--lpd-color-text-base)]">
      {/* TopBar wraps its own SafeArea top */}
      <TopBar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex flex-1 overflow-hidden relative">
        {/* Desktop Sidebar */}
        {!hideSidebar && <Sidebar className="hidden md:flex" />}

        {/* Mobile Sidebar Overlay */}
        {!hideSidebar && sidebarOpen && (
          <div 
            className="fixed inset-0 z-50 bg-black/50 md:hidden transition-opacity"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Mobile Sidebar with SafeArea Top */}
        <div className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white transform md:hidden transition-transform duration-300 ease-in-out",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <SafeArea top className="h-full">
            <Sidebar className="w-full h-full border-r-0" />
          </SafeArea>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {/* Optional Level 2 Header */}
          {header && <div className="shrink-0">{header}</div>}

          <main className="flex-1 overflow-y-auto relative outline-none focus:outline-none custom-scrollbar">
            <Container size="xl" className="py-8">
              {children}
            </Container>
            
            {/* Bottom SafeArea (Gestures bar) */}
            <SafeArea bottom />
          </main>
        </div>
      </div>
    </Stack>
  );
};
