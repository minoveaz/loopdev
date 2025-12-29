
import React, { useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Flag, 
  Palette, 
  Type, 
  PenTool, 
  GitBranch, 
  Box, 
  Layers, 
  Bell, 
  Table, 
  Users, 
  BarChart3, 
  Edit3, 
  MousePointer2, 
  Sparkles, 
  FlaskConical, 
  Beaker,
  ChevronLeft,
  ChevronRight,
  Settings,
  Search,
  MessageSquare,
  Workflow,
  TrendingUp,
  Columns
} from 'lucide-react';

interface SidebarProps {
  isMobile?: boolean;
}

// Map icons to Lucide components for better control
const ICON_MAP: Record<string, React.ElementType> = {
  dashboard: LayoutDashboard,
  analytics: BarChart3,
  layers: Layers,
  flag: Flag,
  palette: Palette,
  text_fields: Type,
  draw: PenTool,
  alt_route: GitBranch,
  check_box_outline_blank: Box,
  dynamic_form: Edit3,
  web_asset: Box,
  notifications_active: Bell,
  table_chart: Table,
  admin_panel_settings: Users,
  monitoring: BarChart3,
  edit_note: Edit3,
  touch_app: MousePointer2,
  auto_awesome: Sparkles,
  science: FlaskConical,
  tune: Settings,
  forum: MessageSquare,
  account_tree: Workflow,
  trending_up: TrendingUp,
  kanban: Columns
};

const NAV_SECTIONS = [
  {
    title: 'Platform',
    items: [
      { to: '/system', icon: 'dashboard', label: 'Overview', end: true },
      { to: '/system/metrics', icon: 'trending_up', label: 'Metrics & KPIs' },
      { to: '/examples-1', icon: 'analytics', label: 'Analytics' },
      { to: '/examples-3', icon: 'layers', label: 'Instances' },
    ]
  },
  {
    title: 'Foundations',
    items: [
      { to: '/system/principles', icon: 'flag', label: 'Principles' },
      { to: '/system/colors', icon: 'palette', label: 'Colors & Tokens' },
      { to: '/system/typography', icon: 'text_fields', label: 'Typography' },
      { to: '/system/illustrations', icon: 'draw', label: 'Illustrations' },
    ]
  },
  {
    title: 'Interface',
    items: [
      { to: '/system/navigation', icon: 'alt_route', label: 'Navigation' },
      { to: '/system/foundation', icon: 'check_box_outline_blank', label: 'Base Components' },
      { to: '/system/complex-forms', icon: 'dynamic_form', label: 'Forms & Input' },
      { to: '/system/overlays', icon: 'web_asset', label: 'Overlays' },
      { to: '/system/notifications', icon: 'notifications_active', label: 'Notifications' },
      { to: '/system/kanban', icon: 'kanban', label: 'Tablero Kanban' },
      { to: '/system/kanban-elements', icon: 'kanban', label: 'Tarjeta Kanban' },
    ]
  },
  {
    title: 'Patterns',
    items: [
      { to: '/system/automation', icon: 'account_tree', label: 'Automation & Rules' },
      { to: '/system/data-tables', icon: 'table_chart', label: 'Data Tables' },
      { to: '/system/users', icon: 'admin_panel_settings', label: 'User & Roles' },
      { to: '/system/settings', icon: 'tune', label: 'Settings' },
      { to: '/system/data-visualizations', icon: 'monitoring', label: 'Visualization' },
      { to: '/system/management', icon: 'edit_note', label: 'Management' },
      { to: '/system/interaction', icon: 'touch_app', label: 'Interaction' },
      { to: '/system/collaboration', icon: 'forum', label: 'Collaboration' },
    ]
  },
  {
    title: 'Labs',
    items: [
      { to: '/system/advanced-ui', icon: 'auto_awesome', label: 'Advanced UI' },
      { to: '/system/advanced-ui-2', icon: 'science', label: 'Experiments' },
      { to: '/functional', icon: 'science', label: 'Live Components' },
    ]
  }
];

export const Sidebar: React.FC<SidebarProps> = ({ isMobile }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  const sidebarWidth = isCollapsed ? 'w-[80px]' : 'w-[280px]';
  
  // Floating Sidebar Styles
  const floatingStyles = "h-[calc(100vh-2rem)] my-4 ml-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl shadow-blue-900/5";
  const mobileStyles = "h-full w-full border-r border-slate-200 dark:border-slate-800";
  
  const baseClasses = `flex flex-col bg-white dark:bg-[#0d121b] transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1.0)] z-20 overflow-hidden ${isMobile ? mobileStyles : floatingStyles}`;
  const layoutClasses = isMobile ? '' : `hidden md:flex ${sidebarWidth} flex-shrink-0 relative`;

  return (
    <aside className={`${baseClasses} ${layoutClasses}`}>
      
      {/* Brand Header */}
      <div className="h-[80px] flex items-center flex-shrink-0 px-6 bg-white dark:bg-[#0d121b] overflow-hidden whitespace-nowrap relative z-10">
        <Link to="/" className="flex items-center gap-4 hover:opacity-80 transition-opacity">
           <div className="w-10 h-10 min-w-[40px] rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 ring-1 ring-white/20">
             <span className="material-symbols-outlined text-[24px]">all_inclusive</span>
           </div>
           <div className={`flex flex-col transition-all duration-300 ${isCollapsed ? 'opacity-0 translate-x-[-10px] w-0' : 'opacity-100 translate-x-0'}`}>
             <span className="font-black text-lg tracking-tight text-[#0d121b] dark:text-white leading-none">loop.dev</span>
             <span className="text-[10px] font-bold text-primary uppercase tracking-widest mt-1">System v2.4</span>
           </div>
        </Link>
      </div>

      {/* Navigation Scroll Area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden py-4 space-y-8 custom-scrollbar px-3">
        {NAV_SECTIONS.map((section, idx) => (
          <div key={idx} className="space-y-1 relative">
            <h4 className={`
              px-4 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 transition-all duration-300
              ${isCollapsed ? 'opacity-0 translate-x-[-10px] hidden' : 'opacity-100'}
            `}>
              {section.title}
            </h4>
            
            {/* Separator for collapsed state */}
            {isCollapsed && idx > 0 && <div className="mx-auto w-8 h-px bg-slate-100 dark:bg-slate-800 my-4" />}

            <div className="space-y-1">
              {section.items.map((item) => (
                <NavItem 
                  key={item.to} 
                  to={item.to} 
                  icon={item.icon} 
                  label={item.label} 
                  end={item.end} 
                  isCollapsed={isCollapsed}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* User Footer */}
      <div className="p-4 bg-white dark:bg-[#0d121b] relative z-10">
        <div className={`
          flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 hover:border-primary/30 dark:hover:border-primary/30 transition-all cursor-pointer group
          ${isCollapsed ? 'justify-center p-2 bg-transparent border-transparent' : ''}
        `}>
           <div className="w-9 h-9 min-w-[36px] rounded-full bg-gradient-to-tr from-primary to-purple-500 flex items-center justify-center text-white font-bold text-xs ring-2 ring-white dark:ring-[#0d121b] shadow-md">
              JD
           </div>
           
           {!isCollapsed && (
             <div className="flex-1 min-w-0 overflow-hidden">
                <div className="text-xs font-bold text-[#0d121b] dark:text-white truncate group-hover:text-primary transition-colors">Jordan Designer</div>
                <div className="text-[10px] text-slate-500 truncate">Pro Workspace</div>
             </div>
           )}
           
           {!isCollapsed && (
             <Settings size={16} className="text-slate-400 group-hover:text-primary transition-colors" />
           )}
        </div>
      </div>

      {/* Collapse Toggle (Desktop Only) */}
      {!isMobile && (
        <button 
          onClick={toggleCollapse}
          className="absolute -right-3 top-24 w-6 h-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full flex items-center justify-center text-slate-500 hover:text-primary hover:border-primary hover:scale-110 transition-all shadow-md z-30"
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      )}
    </aside>
  );
};

const NavItem: React.FC<{ 
  to: string; 
  icon: string; 
  label: string; 
  end?: boolean;
  isCollapsed: boolean;
}> = ({ to, icon, label, end, isCollapsed }) => {
  // Resolve Lucide icon if it exists in map, else render symbol string
  const IconComponent = ICON_MAP[icon];

  return (
    <NavLink 
      to={to} 
      end={end}
      className={({ isActive }) => `
        relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group
        ${isActive 
          ? 'bg-primary text-white shadow-lg shadow-primary/25 font-semibold' 
          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
        }
        ${isCollapsed ? 'justify-center px-0' : ''}
      `}
    >
      {({ isActive }) => (
        <>
          {/* Icon */}
          <div className={`relative flex items-center justify-center transition-colors ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'}`}>
            {IconComponent ? (
              <IconComponent size={20} strokeWidth={isActive ? 2.5 : 2} />
            ) : (
              <span className="material-symbols-outlined text-[20px]">{icon}</span>
            )}
            
            {/* Active Indicator Dot (Collapsed) */}
            {isCollapsed && isActive && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-white border-2 border-primary rounded-full" />
            )}
          </div>

          {/* Label (Expanded) */}
          {!isCollapsed && (
            <span className="truncate">{label}</span>
          )}

          {/* Flyout Label (Collapsed) */}
          {isCollapsed && (
            <div className="
              fixed left-[90px] 
              bg-[#0d121b] text-white
              text-xs font-bold px-3 py-2 rounded-lg
              shadow-xl opacity-0 pointer-events-none scale-95
              group-hover:opacity-100 group-hover:scale-100
              transition-all duration-200 z-50 whitespace-nowrap
              flex items-center gap-2
            ">
              {label}
              {/* Arrow */}
              <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-[#0d121b] rotate-45" />
            </div>
          )}
        </>
      )}
    </NavLink>
  );
};
