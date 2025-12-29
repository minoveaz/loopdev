import React from 'react';
import { cn } from '../../helpers/cn';
import { Box, Inline } from '../../components/layout';
import { X } from 'lucide-react';

export interface RightSidebarTab {
  id: string;
  icon: React.ElementType;
  label: string;
}

export interface RightSidebarProps {
  children: React.ReactNode;
  isOpen: boolean;
  width?: 'sm' | 'md' | 'lg';
  variant?: 'full' | 'floating';
  tabs?: RightSidebarTab[];
  activeTabId?: string;
  onTabChange?: (id: string) => void;
  className?: string;
}

const widthMap = {
  sm: 'w-[320px]',
  md: 'w-[380px]',
  lg: 'w-[440px]',
};

export const RightSidebarRoot: React.FC<RightSidebarProps> = ({
  children,
  isOpen,
  width = 'md',
  variant = 'full',
  tabs = [],
  activeTabId,
  onTabChange,
  className,
}) => {
  const hasTabs = tabs.length > 0;
  const isFloating = variant === 'floating';

  return (
    <aside
      className={cn(
        "transition-all duration-500 ease-in-out flex shrink-0 z-40",
        isFloating ? "py-4 pr-4" : "h-full",
        isOpen ? widthMap[width] : "w-0 opacity-0",
        className
      )}
    >
      <div className={cn(
        "flex h-full w-full overflow-hidden border-l bg-white shadow-[var(--lpd-shadow-2xl)] transition-all",
        isFloating ? "rounded-l-xl border-t border-b border-slate-200" : "h-full border-[var(--lpd-color-border-subtle)]"
      )}>
        {/* ZONE A: INTERNAL NAV RAIL (Fixed 48px) */}
        {hasTabs && (
          <nav className="w-[48px] flex-shrink-0 bg-slate-50 border-r border-slate-200 flex flex-col items-center py-4 gap-4">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTabId === tab.id;
              return (
                <div
                  key={tab.id}
                  onClick={() => onTabChange?.(tab.id)}
                  className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center transition-all relative cursor-pointer group",
                    isActive 
                      ? "bg-[var(--lpd-color-brand-primary)]/10 text-[var(--lpd-color-brand-primary)]" 
                      : "text-slate-400 hover:bg-white hover:text-[var(--lpd-color-brand-primary)] hover:shadow-sm"
                  )}
                  title={tab.label}
                >
                  {/* Active Indicator Pill (2px / 0.5) */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-[var(--lpd-color-brand-primary)] rounded-r-full" />
                  )}
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                </div>
              );
            })}
            
            {/* Bottom tab simulation like in HTML */}
            <div className="mt-auto">
               <div className="w-8 h-8 rounded-lg text-slate-400 hover:bg-white hover:text-red-500 transition-all flex items-center justify-center cursor-pointer relative">
                  <IconPlaceholder name="notifications" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 border-2 border-slate-50 rounded-full"></span>
               </div>
            </div>
          </nav>
        )}

        {/* ZONE B & C: CONTENT AREA */}
        <div className="flex-1 min-w-0 h-full flex flex-col bg-white">
          {children}
        </div>
      </div>
    </aside>
  );
};

/* --- Helpers for designer icons --- */
const IconPlaceholder = ({ name }: { name: string }) => {
  if (name === 'notifications') return <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>;
  return null;
}

/* --- Sub-components with exact Designer specs --- */

export const RightSidebarHeader = ({ title, status, onClose }: { title: string, status?: 'online' | 'offline', onClose?: () => void }) => (
  <div className="h-[64px] flex-shrink-0 flex items-center justify-between px-5 border-b border-slate-100 bg-white">
    <div className="flex items-center gap-3">
      <h3 className="font-bold text-[#0d121b] text-lg tracking-tight">{title}</h3>
      {status === 'online' && (
        <span className="w-2 h-2 rounded-full bg-[#FFD700] shadow-[0_0_10px_rgba(255,215,0,0.4)]" />
      )}
    </div>
    {onClose && (
      <button 
        onClick={onClose}
        className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-[#0d121b] transition-colors"
      >
        <X size={20} />
      </button>
    )}
  </div>
);

export const RightSidebarBody = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={cn("flex-1 overflow-y-auto custom-scrollbar p-5 space-y-4", className)}>
    {children}
  </div>
);

export const RightSidebarFooter = ({ children }: { children: React.ReactNode }) => (
  <div className="p-3 border-t border-slate-100 bg-slate-50">
    {children}
  </div>
);

export const RightSidebar = Object.assign(RightSidebarRoot, {
  Header: RightSidebarHeader,
  Body: RightSidebarBody,
  Footer: RightSidebarFooter,
});
