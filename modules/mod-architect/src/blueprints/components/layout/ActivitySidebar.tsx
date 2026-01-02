import React from 'react';

interface ActivitySidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ActivitySidebar: React.FC<ActivitySidebarProps> = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/10 backdrop-blur-[2px] z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-4 bottom-4 right-4 w-[440px] max-w-[calc(100vw-2rem)]
        bg-white dark:bg-[#1e293b] 
        rounded-l-xl rounded-r-lg shadow-2xl 
        border border-slate-200 dark:border-slate-700 
        z-50 flex overflow-hidden
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : 'translate-x-[120%]'}
      `}>
        {/* Zone A: Nav Rail */}
        <div className="w-[48px] flex-shrink-0 bg-slate-50 dark:bg-[#161e2e] border-r border-slate-200 dark:border-slate-700 flex flex-col items-center py-4 gap-4">
          <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center relative group cursor-pointer">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-primary rounded-r-full"></div>
            <span className="material-symbols-outlined text-[20px]">browse_activity</span>
          </div>
          <div className="w-8 h-8 rounded-lg text-slate-400 hover:bg-white dark:hover:bg-slate-700 hover:text-energy hover:shadow-sm transition-all flex items-center justify-center cursor-pointer">
            <span className="material-symbols-outlined text-[20px]">smart_toy</span>
          </div>
          <div className="w-8 h-8 rounded-lg text-slate-400 hover:bg-white dark:hover:bg-slate-700 hover:text-[#0d121b] dark:hover:text-white hover:shadow-sm transition-all flex items-center justify-center cursor-pointer">
            <span className="material-symbols-outlined text-[20px]">help</span>
          </div>
          <div className="mt-auto">
            <div className="w-8 h-8 rounded-lg text-slate-400 hover:bg-white dark:hover:bg-slate-700 hover:text-red-500 hover:shadow-sm transition-all flex items-center justify-center cursor-pointer">
              <span className="material-symbols-outlined text-[20px]">notifications</span>
              <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 border-2 border-slate-50 dark:border-[#161e2e] rounded-full"></span>
            </div>
          </div>
        </div>

        {/* Zone B & C: Header & Content */}
        <div className="flex-1 flex flex-col h-full bg-white dark:bg-[#1e293b]">
          {/* Header */}
          <div className="h-[64px] flex-shrink-0 flex items-center justify-between px-5 border-b border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <h3 className="font-sans font-bold text-[#0d121b] dark:text-white text-lg">Activity Feed</h3>
              <span className="w-2 h-2 rounded-full bg-energy"></span>
            </div>
            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-[#0d121b] dark:hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {/* Card 1 */}
            <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 hover:border-energy/50 transition-colors group/card">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-blue-100 text-primary flex items-center justify-center text-xs font-bold">JD</div>
                  <span className="text-xs font-bold text-[#0d121b] dark:text-white">John Doe</span>
                  <span className="text-[10px] text-slate-400">2m ago</span>
                </div>
                <span className="material-symbols-outlined text-slate-300 group-hover/card:text-energy text-base">star</span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300">Updated the main color tokens for the dashboard.</p>
            </div>

            {/* Card 2 */}
            <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 hover:border-energy/50 transition-colors group/card">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-purple-100 text-purple-600 flex items-center justify-center">
                    <span className="material-symbols-outlined text-sm">smart_toy</span>
                  </div>
                  <span className="text-xs font-bold text-[#0d121b] dark:text-white">Loop AI</span>
                  <span className="text-[10px] text-slate-400">15m ago</span>
                </div>
                <span className="material-symbols-outlined text-slate-300 group-hover/card:text-energy text-base">star</span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                I've analyzed your component usage. You might want to consolidate <span className="font-mono text-xs bg-slate-200 dark:bg-slate-700 px-1 rounded">{`{button-primary}`}</span>.
              </p>
              <div className="mt-3 flex gap-2">
                <button className="px-3 py-1.5 bg-[#0d121b] dark:bg-white text-white dark:text-[#0d121b] text-xs font-bold rounded shadow-sm hover:opacity-90">Review</button>
                <button className="px-3 py-1.5 bg-transparent border border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-300 text-xs font-bold rounded hover:bg-slate-100 dark:hover:bg-slate-700">Dismiss</button>
              </div>
            </div>

            {/* Card 3 (Skeleton) */}
            <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
              <div className="h-2 w-1/3 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
              <div className="h-2 w-3/4 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
              <div className="h-2 w-1/2 bg-slate-200 dark:bg-slate-700 rounded"></div>
            </div>
          </div>

          {/* Footer Search */}
          <div className="p-3 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-[#161e2e]">
            <div className="flex items-center gap-2 bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 shadow-sm">
              <span className="material-symbols-outlined text-slate-400 text-lg">search</span>
              <input 
                className="bg-transparent border-none p-0 text-sm w-full focus:ring-0 text-[#0d121b] dark:text-white placeholder-slate-400" 
                placeholder="Filter activity..."
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};