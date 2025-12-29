
import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { RightFlyout } from '../components/layout/RightFlyout';
import { ActivitySidebar } from '../components/layout/ActivitySidebar';
import { Menu, Search, Bell, Sun, Moon } from 'lucide-react';
import { Button } from '../components/ui/DesignSystem';
import { EmptyState } from '../components/functional/EmptyState/index';

// Search Data Definition
const SEARCH_ITEMS = [
  // Core Pages
  { title: 'Overview', path: '/system', category: 'Core Platform' },
  { title: 'Metrics & KPIs', path: '/system/metrics', category: 'Core Platform' },
  { title: 'Analytics Dashboard', path: '/examples-1', category: 'Core Platform' },
  { title: 'App Instances', path: '/examples-3', category: 'Core Platform' },
  { title: 'Tablero Kanban', path: '/system/kanban', category: 'Core Platform' },
  { title: 'Tarjeta Kanban', path: '/system/kanban-elements', category: 'Core Platform' },
  
  // Identity & Foundations
  { title: 'The Isotype', path: '/system', category: 'Identity' },
  { title: 'Design Principles', path: '/system/principles', category: 'Design System' },
  { title: 'Colors & Tokens', path: '/system/colors', category: 'Design System' },
  { title: 'Typography', path: '/system/typography', category: 'Design System' },
  { title: 'Illustrations', path: '/system/illustrations', category: 'Design System' },
  
  // Components & Patterns
  { title: 'Navigation', path: '/system/navigation', category: 'Design System' },
  { title: 'Breadcrumbs', path: '/system/navigation', category: 'Components' },
  { title: 'Sidebar', path: '/system/navigation', category: 'Components' },
  
  { title: 'Overlays & Feedback', path: '/system/overlays', category: 'Design System' },
  { title: 'Drawers', path: '/system/overlays', category: 'Components' },
  { title: 'Empty States', path: '/system/overlays', category: 'Components' },
  
  { title: 'Notifications & Workflows', path: '/system/notifications', category: 'Design System' },
  { title: 'Steppers', path: '/system/notifications', category: 'Components' },
  
  { title: 'Foundation Components', path: '/system/foundation', category: 'Design System' },
  { title: 'Buttons', path: '/system/foundation', category: 'Components' },
  { title: 'Inputs', path: '/system/foundation', category: 'Components' },
  { title: 'Checkboxes & Radios', path: '/system/foundation', category: 'Components' },
  
  { title: 'Complex Forms', path: '/system/complex-forms', category: 'Design System' },
  { title: 'Date Range Picker', path: '/system/complex-forms', category: 'Components' },
  { title: 'File Uploader', path: '/system/complex-forms', category: 'Components' },
  { title: 'Autocomplete', path: '/system/complex-forms', category: 'Components' },
  
  { title: 'Management & Editing', path: '/system/management', category: 'Design System' },
  { title: 'Rich Text Editor', path: '/system/management', category: 'Components' },
  { title: 'Transfer List', path: '/system/management', category: 'Components' },
  
  { title: 'Interaction Patterns', path: '/system/interaction', category: 'Design System' },
  { title: 'Filters', path: '/system/interaction', category: 'Patterns' },
  { title: 'Tabs', path: '/system/interaction', category: 'Patterns' },
  
  { title: 'Data Tables', path: '/system/data-tables', category: 'Design System' },
  { title: 'User Management', path: '/system/users', category: 'Patterns' },
  
  { title: 'Data Visualizations', path: '/system/data-visualizations', category: 'Design System' },
  { title: 'Charts', path: '/system/data-visualizations', category: 'Components' },
  { title: 'Heatmaps', path: '/system/data-visualizations', category: 'Components' },
  
  { title: 'Customization & Settings', path: '/system/settings', category: 'Patterns' },

  { title: 'Advanced UI', path: '/system/advanced-ui', category: 'Advanced' },
  { title: 'Labs & Experiments', path: '/system/advanced-ui-2', category: 'Advanced' },
  { title: 'Application Examples', path: '/system/examples', category: 'Design System' },
];

export const SystemLayout: React.FC = () => {
  const [isFlyoutOpen, setIsFlyoutOpen] = useState(false);
  const [isActivityOpen, setIsActivityOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  
  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check initial state
    setIsDark(document.documentElement.classList.contains('dark'));

    // Click outside handler for search
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleTheme = () => {
    const html = document.documentElement;
    if (html.classList.contains('dark')) {
      html.classList.remove('dark');
      setIsDark(false);
    } else {
      html.classList.add('dark');
      setIsDark(true);
    }
  };

  // Filter search results
  const filteredItems = SEARCH_ITEMS.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleResultClick = (path: string) => {
    navigate(path);
    setSearchQuery('');
    setShowResults(false);
  };

  return (
    <div className="flex h-screen w-full bg-background-light dark:bg-background-dark text-text-main dark:text-white overflow-hidden selection:bg-primary/30">
      {/* Floating Sidebar - Now detached with margins */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full transition-all duration-300">
        
        {/* Mobile Header */}
        <header className="md:hidden flex-shrink-0 sticky top-0 z-30 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-4 py-3 flex items-center justify-between">
           <div className="font-bold text-lg">loop.dev</div>
           <div className="flex items-center gap-2">
             <button 
                onClick={toggleTheme}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-text-muted"
                aria-label="Toggle theme"
             >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
             </button>
             <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
               <Menu />
             </button>
           </div>
        </header>
        
        {/* Top Navigation Bar (Desktop) */}
        <header className="hidden md:flex flex-shrink-0 z-20 bg-transparent px-8 py-4 items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-text-muted">
             {/* Removed breadcrumbs for cleaner look with floating sidebar */}
          </div>
          
          <div className="flex items-center gap-4">
             {/* Search Bar */}
             <div className="relative group" ref={searchRef}>
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted group-hover:text-primary transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search documentation..." 
                  className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-full pl-10 pr-4 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary w-64 transition-all shadow-sm"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowResults(true);
                  }}
                  onFocus={() => setShowResults(true)}
                />
                {/* Search Results Dropdown */}
                {showResults && searchQuery && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl overflow-hidden z-50 max-h-96 overflow-y-auto">
                    {filteredItems.length > 0 ? (
                      <ul>
                        {filteredItems.map((item, index) => (
                          <li key={index}>
                            <button 
                              onClick={() => handleResultClick(item.path)}
                              className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-between border-b border-gray-100 dark:border-gray-800 last:border-0 group"
                            >
                              <div className="flex flex-col gap-0.5">
                                <span className="text-sm font-bold text-text-main dark:text-white group-hover:text-primary transition-colors">{item.title}</span>
                                <span className="text-[10px] uppercase tracking-wider text-text-muted">{item.category}</span>
                              </div>
                              <span className="material-symbols-outlined text-slate-300 dark:text-slate-600 text-sm group-hover:text-primary transition-colors">arrow_forward</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <EmptyState 
                        size="sm"
                        icon="search" 
                        title="No results found"
                        description={`We couldn't find anything matching "${searchQuery}"`}
                        className="border-none shadow-none bg-transparent"
                      />
                    )}
                  </div>
                )}
             </div>
             
             <button 
                onClick={toggleTheme}
                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition-colors text-text-muted"
             >
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
             </button>

             <button 
               onClick={() => setIsActivityOpen(!isActivityOpen)}
               className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition-colors relative"
             >
               <Bell size={18} />
               <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-energy animate-pulse" />
             </button>
             <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-2" />
             <Button size="sm" variant="secondary" onClick={() => setIsFlyoutOpen(true)}>
               Tools
             </Button>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 w-full h-full overflow-y-auto overflow-x-hidden relative scroll-smooth rounded-tl-2xl">
           <Outlet />
        </main>
      </div>

      {/* Right Flyouts */}
      <RightFlyout 
        isOpen={isFlyoutOpen} 
        onClose={() => setIsFlyoutOpen(false)} 
        isDark={isDark}
        toggleTheme={toggleTheme}
      />

      <ActivitySidebar 
        isOpen={isActivityOpen}
        onClose={() => setIsActivityOpen(false)}
      />

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-auto min-w-[280px] max-w-[85vw] bg-background-dark border-l border-gray-800 p-0 flex animate-in slide-in-from-right duration-300">
             <button onClick={() => setIsMobileMenuOpen(false)} className="absolute top-4 right-4 z-50 p-2 bg-black/20 rounded text-white">
                <Menu />
             </button>
             <div className="flex h-full w-full">
                <Sidebar isMobile={true} /> 
             </div>
          </div>
        </div>
      )}
    </div>
  );
};
