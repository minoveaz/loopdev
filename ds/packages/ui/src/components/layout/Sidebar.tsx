import React from 'react';
import { LayoutDashboard, Target, Briefcase, Settings, BarChart3, ShieldCheck, HelpCircle } from 'lucide-react';
import { Stack } from './foundations';
import { cn } from '@/helpers/cn';

export interface SidebarProps {
  className?: string;
}

const navItems = [
  { name: 'Dashboard', icon: LayoutDashboard, active: true },
  { name: 'Marketing Studio', icon: Target },
  { name: 'Brand Center', icon: Briefcase },
  { name: 'Insights', icon: BarChart3 },
  { name: 'Compliance', icon: ShieldCheck },
];

export const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  return (
    <aside className={cn(
      "w-64 bg-[var(--lpd-color-bg-base)] border-r border-[var(--lpd-color-border-subtle)] flex flex-col h-full",
      className
    )}>
      <Stack gap={1} className="flex-1 py-6 px-4">
        <p className="px-2 text-[10px] uppercase tracking-widest text-[var(--lpd-color-text-muted)] font-mono mb-4">
          Main Navigation
        </p>
        {navItems.map((item) => (
          <button
            key={item.name}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group",
              item.active 
                ? "bg-[var(--lpd-color-primary)] text-white shadow-md shadow-[var(--lpd-color-primary)]/10" 
                : "text-[var(--lpd-color-text-muted)] hover:bg-[var(--lpd-color-bg-subtle)] hover:text-[var(--lpd-color-text-base)]"
            )}
          >
            <item.icon className={cn(
              "w-5 h-5",
              item.active ? "text-white" : "text-[var(--lpd-color-text-muted)] group-hover:text-[var(--lpd-color-primary)]"
            )} />
            {item.name}
          </button>
        ))}
      </Stack>

      <Stack gap={1} className="p-4 border-t border-[var(--lpd-color-border-subtle)]">
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-[var(--lpd-color-text-muted)] hover:bg-[var(--lpd-color-bg-subtle)] transition-colors">
          <Settings className="w-5 h-5" />
          Settings
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-[var(--lpd-color-text-muted)] hover:bg-[var(--lpd-color-bg-subtle)] transition-colors">
          <HelpCircle className="w-5 h-5" />
          Support
        </button>
      </Stack>
    </aside>
  );
};
