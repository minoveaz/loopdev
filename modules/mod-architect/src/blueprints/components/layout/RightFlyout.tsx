import React from 'react';
import { X, Settings, ExternalLink, Download, Share2 } from 'lucide-react';
import { Button } from '@blueprints/components/ui/DesignSystem';

interface RightFlyoutProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
  toggleTheme: () => void;
}

export const RightFlyout: React.FC<RightFlyoutProps> = ({ isOpen, onClose, isDark, toggleTheme }) => {
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity"
          onClick={onClose}
        />
      )}
      
      {/* Flyout Panel */}
      <div className={`
        fixed top-0 right-0 h-full w-80 bg-white dark:bg-background-dark 
        border-l border-gray-200 dark:border-gray-800 shadow-2xl z-50
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <div className="h-full flex flex-col">
          <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
            <h3 className="font-bold text-lg">System Tools</h3>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
              <X size={20} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {/* Quick Actions */}
            <section>
              <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-4">Quick Actions</h4>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start" icon={<Download size={16} />}>
                  Download Assets
                </Button>
                <Button variant="secondary" className="w-full justify-start" icon={<Share2 size={16} />}>
                  Share Documentation
                </Button>
                <Button variant="secondary" className="w-full justify-start" icon={<ExternalLink size={16} />}>
                  Open in Figma
                </Button>
              </div>
            </section>

            {/* Theme Settings */}
            <section>
              <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-4">Theme Preferences</h4>
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-800 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Dark Mode</span>
                  <div className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={isDark} 
                      onChange={toggleTheme}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Reduce Motion</span>
                  <div className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </div>
                </div>
              </div>
            </section>

            {/* System Status */}
            <section>
               <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-4">System Status</h4>
               <div className="p-4 rounded-lg bg-energy/10 border border-energy/20">
                 <div className="flex items-center gap-2 mb-2">
                   <span className="h-2 w-2 rounded-full bg-energy animate-pulse"></span>
                   <span className="text-xs font-bold text-energy-vivid">Operational</span>
                 </div>
                 <p className="text-[10px] text-text-muted">v3.4.2 stable build</p>
               </div>
            </section>
          </div>
          
          <div className="p-6 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
            <p className="text-xs text-center text-text-muted">© 2024 Loop Systems Inc.</p>
          </div>
        </div>
      </div>
    </>
  );
};