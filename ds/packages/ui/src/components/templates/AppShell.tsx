import React, { useState } from 'react';
import { TopBar } from '../organisms/TopBar';
import { LeftSidebar } from '../organisms/LeftSidebar';
import { Stack, Container, SafeArea } from '@/components/layout';
import { cn } from '@/helpers/cn';

import { useLayout } from '@/providers/layout-provider';

export interface AppShellProps {
  children: React.ReactNode;
  header?: React.ReactNode; 
  footer?: React.ReactNode; 
  leftSidebar?: React.ReactNode;
  rightSidebar?: React.ReactNode;
  hideSidebar?: boolean; 
  isImmersive?: boolean; 
}

export const AppShell: React.FC<AppShellProps> = ({ 
  children, 
  header, 
  footer,
  leftSidebar, 
  rightSidebar,
  hideSidebar = false,
  isImmersive = false
}) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { isRightSidebarOpen } = useLayout();
  
  const showLeftSidebar = !hideSidebar && !isImmersive && leftSidebar;
  const showRightSidebar = !isImmersive && rightSidebar && isRightSidebarOpen;

  return (
    <Stack gap={0} className="h-screen overflow-hidden bg-[var(--lpd-color-bg-base)] text-[var(--lpd-color-text-base)]">
      {/* TopBar wraps its own SafeArea top */}
      <TopBar onMenuClick={() => setMobileSidebarOpen(!mobileSidebarOpen)} />

      <div className="flex flex-1 overflow-hidden relative">
        {/* LEFT COLUMN: LeftSidebar */}
        {showLeftSidebar && (
          <div className="hidden md:flex shrink-0 h-full relative z-30">
            {leftSidebar}
          </div>
        )}

        {/* Mobile Sidebar Overlay */}
        {showLeftSidebar && mobileSidebarOpen && (
          <div 
            className="fixed inset-0 z-50 bg-black/50 md:hidden transition-opacity"
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}

        {/* Mobile Left Sidebar */}
        {showLeftSidebar && (
          <div className={cn(
            "fixed inset-y-0 left-0 z-50 transform md:hidden transition-transform duration-300 ease-in-out",
            mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}>
            <SafeArea top className="h-full bg-white shadow-2xl">
              {leftSidebar}
            </SafeArea>
          </div>
        )}

        {/* CENTER COLUMN: Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden relative min-w-0">
          {/* Optional Level 2 Header */}
          {header && <div className="shrink-0">{header}</div>}

          <main className="flex-1 overflow-y-auto relative outline-none focus:outline-none custom-scrollbar bg-[var(--lpd-color-bg-subtle)]/30">
            <div className="min-h-full flex flex-col">
              <Container size="xl" className="py-8 flex-1">
                {children}
              </Container>
              
              {/* Optional Footer */}
              {footer && <div className="shrink-0">{footer}</div>}
              
              {/* Bottom SafeArea (Gestures bar) */}
              <SafeArea bottom />
            </div>
          </main>
        </div>

        {/* RIGHT COLUMN: RightSidebar */}
        {showRightSidebar && (
          <div className="hidden lg:flex shrink-0 h-full">
            {rightSidebar}
          </div>
        )}
      </div>
    </Stack>
  );
};
