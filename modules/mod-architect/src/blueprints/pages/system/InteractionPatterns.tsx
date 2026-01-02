import React from 'react';

export const InteractionPatterns: React.FC = () => {
  return (
    <div className="max-w-[1200px] mx-auto p-6 md:p-12 pb-24">
      <div className="mb-12">
        <div className="flex flex-col gap-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 w-fit">
            <span className="material-symbols-outlined text-purple-600 dark:text-purple-400 text-sm">auto_awesome</span>
            <span className="text-purple-700 dark:text-purple-300 text-xs font-bold uppercase tracking-wide">AI Optimized UX</span>
          </div>
          <h1 className="text-[#0d121b] dark:text-white text-4xl md:text-5xl font-black leading-tight tracking-[-0.033em]">Interaction Patterns</h1>
          <p className="text-[#4c669a] dark:text-slate-400 text-lg max-w-2xl">
            Standardized behaviors for complex interactions across the loop.dev ecosystem. These patterns ensure predictability, reduce cognitive load, and define how users manipulate data views.
          </p>
        </div>
      </div>

      <section className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[#0d121b] dark:text-white text-2xl font-bold tracking-[-0.015em]">Filters & Refinement</h2>
          <div className="inline-flex items-center gap-2 text-slate-500 text-sm">
            <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-xs font-mono">pattern: filter-bar</span>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-8 flex flex-col justify-center min-h-[300px] overflow-hidden relative group">
            <div className="absolute inset-0 bg-slate-50/50 dark:bg-slate-900/20 pointer-events-none"></div>
            <div className="relative z-10 w-full max-w-lg mx-auto bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-600 p-4">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-[#0d121b] dark:text-white">Transactions</span>
                  <button className="text-xs text-slate-400 hover:text-primary transition-colors">Reset all</button>
                </div>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <span className="material-symbols-outlined absolute left-2.5 top-2 text-slate-400 text-lg">search</span>
                    <input className="w-full h-9 pl-9 pr-3 rounded bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm text-[#0d121b] dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-slate-400" placeholder="Search ID..." type="text" />
                  </div>
                  <button className="h-9 px-3 flex items-center gap-2 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-300 hover:border-primary hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-lg">calendar_today</span>
                    <span className="hidden sm:inline">Date</span>
                  </button>
                  <button className="h-9 px-3 flex items-center gap-2 rounded bg-primary/10 border border-primary/20 text-sm font-medium text-primary transition-colors">
                    <span className="material-symbols-outlined text-lg">filter_list</span>
                    <span>Status: Active</span>
                  </button>
                </div>
                <div className="flex gap-2 mt-1">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-[10px] font-bold text-slate-600 dark:text-slate-300">
                    Active
                    <span className="material-symbols-outlined text-xs cursor-pointer hover:text-red-500">close</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-8 flex flex-col gap-6">
            <div>
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Core Principles</h3>
              <ul className="flex flex-col gap-4">
                <li className="flex gap-3">
                  <span className="material-symbols-outlined text-green-500 text-xl flex-shrink-0">check_circle</span>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-[#0d121b] dark:text-white">Real-time Feedback</span>
                    <p className="text-xs text-slate-500 mt-1">Apply filters immediately upon selection whenever performance allows.</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="material-symbols-outlined text-green-500 text-xl flex-shrink-0">check_circle</span>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-[#0d121b] dark:text-white">Visibility</span>
                    <p className="text-xs text-slate-500 mt-1">Active filters must be visible as "chips" or distinct states within dropdowns.</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="material-symbols-outlined text-green-500 text-xl flex-shrink-0">check_circle</span>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-[#0d121b] dark:text-white">Reset Mechanism</span>
                    <p className="text-xs text-slate-500 mt-1">Always provide a global "Reset" or "Clear all" action when filters are active.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[#0d121b] dark:text-white text-2xl font-bold tracking-[-0.015em]">Tab Navigation</h2>
          <div className="inline-flex items-center gap-2 text-slate-500 text-sm">
            <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-xs font-mono">pattern: tabs</span>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-8">
            <div className="mb-8 p-6 bg-slate-50 dark:bg-[#0d121b] rounded border border-slate-100 dark:border-slate-800">
              <div className="flex border-b border-slate-200 dark:border-slate-700">
                <button className="px-4 py-2 text-sm font-medium text-primary border-b-2 border-primary -mb-[1px]">Overview</button>
                <button className="px-4 py-2 text-sm font-medium text-slate-500 hover:text-[#0d121b] dark:text-slate-400 dark:hover:text-white transition-colors">Configuration</button>
                <button className="px-4 py-2 text-sm font-medium text-slate-500 hover:text-[#0d121b] dark:text-slate-400 dark:hover:text-white transition-colors">Logs</button>
                <button className="px-4 py-2 text-sm font-medium text-slate-300 dark:text-slate-700 cursor-not-allowed">Settings</button>
              </div>
              <div className="mt-4">
                <div className="h-2 w-3/4 bg-slate-200 dark:bg-slate-800 rounded mb-2"></div>
                <div className="h-2 w-1/2 bg-slate-200 dark:bg-slate-800 rounded"></div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-bold text-[#0d121b] dark:text-white">Usage Guidelines</h3>
              <p className="text-sm text-slate-500">Tabs organize content at the same hierarchy level. They should be used for switching between alternative views of the same context.</p>
            </div>
          </div>
          <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-8 flex flex-col justify-center">
            <table className="w-full text-left">
              <thead className="text-xs text-slate-400 uppercase font-mono border-b border-slate-100 dark:border-slate-700">
                <tr>
                  <th className="pb-2 font-medium">State</th>
                  <th className="pb-2 font-medium">Visual Attribute</th>
                  <th className="pb-2 font-medium text-right">Preview</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-slate-100 dark:divide-slate-700">
                <tr>
                  <td className="py-3 font-medium text-[#0d121b] dark:text-white">Active</td>
                  <td className="py-3 text-slate-500">Primary color text & bottom border</td>
                  <td className="py-3 text-right"><span className="text-primary font-medium border-b border-primary">Label</span></td>
                </tr>
                <tr>
                  <td className="py-3 font-medium text-[#0d121b] dark:text-white">Inactive</td>
                  <td className="py-3 text-slate-500">Slate-500 text, no border</td>
                  <td className="py-3 text-right"><span className="text-slate-500">Label</span></td>
                </tr>
                <tr>
                  <td className="py-3 font-medium text-[#0d121b] dark:text-white">Hover</td>
                  <td className="py-3 text-slate-500">Darker text (slate-800), bg-fade</td>
                  <td className="py-3 text-right"><span className="text-slate-800 dark:text-slate-300">Label</span></td>
                </tr>
                <tr>
                  <td className="py-3 font-medium text-[#0d121b] dark:text-white">Disabled</td>
                  <td className="py-3 text-slate-500">Low opacity (0.4), no events</td>
                  <td className="py-3 text-right"><span className="text-slate-300">Label</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[#0d121b] dark:text-white text-2xl font-bold tracking-[-0.015em]">Loaders & Feedback</h2>
            </div>
            <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-8 h-full">
              <div className="space-y-8">
                <div className="flex gap-4 items-start">
                  <div className="w-1/2 p-4 border border-slate-100 dark:border-slate-700 rounded bg-slate-50/50 dark:bg-slate-900/50">
                    <div className="flex gap-3 animate-pulse">
                      <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                      <div className="flex-1 space-y-2 py-1">
                        <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                        <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded"></div>
                      </div>
                    </div>
                  </div>
                  <div className="w-1/2">
                    <span className="text-sm font-bold text-[#0d121b] dark:text-white block mb-1">Skeleton Screens</span>
                    <p className="text-xs text-slate-500 leading-relaxed">Use for initial page loads or heavy content areas to reduce perceived latency and maintain layout stability.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-1/2 p-4 border border-slate-100 dark:border-slate-700 rounded bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-center h-[82px]">
                    <svg className="animate-spin h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" fill="currentColor"></path>
                    </svg>
                  </div>
                  <div className="w-1/2">
                    <span className="text-sm font-bold text-[#0d121b] dark:text-white block mb-1">Indeterminate Spinner</span>
                    <p className="text-xs text-slate-500 leading-relaxed">Use for actions &lt; 2 seconds or when specific progress cannot be calculated (e.g., button submission).</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[#0d121b] dark:text-white text-2xl font-bold tracking-[-0.015em]">Drag-and-Drop</h2>
            </div>
            <div className="bg-[#0d121b] rounded-xl shadow-sm border border-slate-800 p-8 h-full flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
                <span className="material-symbols-outlined text-8xl text-white">drag_indicator</span>
              </div>
              <div className="flex flex-col gap-3 mb-8 relative z-10 w-3/4">
                <div className="flex items-center gap-3 p-3 rounded bg-slate-800/50 border border-slate-700/50 text-slate-400">
                  <span className="material-symbols-outlined text-sm cursor-grab">drag_indicator</span>
                  <span className="text-sm font-mono">01_init_module.ts</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded bg-primary shadow-xl shadow-blue-500/20 text-white transform scale-105 -rotate-1 cursor-grabbing border border-blue-400">
                  <span className="material-symbols-outlined text-sm">drag_indicator</span>
                  <span className="text-sm font-bold font-mono">02_core_logic.ts</span>
                </div>
                <div className="h-12 border-2 border-dashed border-slate-700 bg-slate-800/20 rounded flex items-center justify-center">
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Drop Zone</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded bg-slate-800/50 border border-slate-700/50 text-slate-400">
                  <span className="material-symbols-outlined text-sm cursor-grab">drag_indicator</span>
                  <span className="text-sm font-mono">03_render_view.ts</span>
                </div>
              </div>
              <div className="mt-auto relative z-10">
                <h4 className="text-white font-bold mb-2">Interaction Principles</h4>
                <ul className="text-xs text-slate-400 space-y-1 font-mono">
                  <li>&gt; Elevation on grab (z-index, shadow)</li>
                  <li>&gt; Clear drop targets (dashed outline)</li>
                  <li>&gt; Cursor state changes (grab vs grabbing)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};