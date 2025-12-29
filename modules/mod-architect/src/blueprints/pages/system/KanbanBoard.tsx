
import React from 'react';

export const KanbanBoard: React.FC = () => {
  return (
    <div className="relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern-custom pointer-events-none z-0 opacity-10"></div>
      
      <div className="relative z-10 max-w-[1200px] mx-auto p-6 md:p-12 pb-24">
        {/* Header Section */}
        <div className="mb-12">
          <div className="flex flex-col gap-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 w-fit">
              <span className="material-symbols-outlined text-primary dark:text-blue-400 text-sm">auto_awesome</span>
              <span className="text-primary dark:text-blue-300 text-xs font-bold uppercase tracking-wide">AI Optimized Workflows</span>
            </div>
            <h1 className="text-[#0d121b] dark:text-white text-4xl md:text-5xl font-black leading-tight tracking-[-0.033em]">PipelineBoard Core Anatomy</h1>
            <p className="text-[#4c669a] dark:text-slate-400 text-lg max-w-2xl">
              The PipelineBoard is the central visualization engine for workflow management. It provides a structured, drag-and-drop interface for entity progression through defined stages.
            </p>
          </div>
        </div>

        {/* Main Kanban Section */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[#0d121b] dark:text-white text-2xl font-bold tracking-[-0.015em]">Core Component Structure</h2>
            <div className="flex gap-2">
              <button className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-300">
                <span className="material-symbols-outlined text-sm">settings_suggest</span>
                Config
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col overflow-hidden h-[640px]">
            {/* Board Toolbar */}
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between bg-white dark:bg-surface-dark z-20">
              <div className="flex items-center gap-4">
                <h3 className="text-lg font-bold text-[#0d121b] dark:text-white">Product Development</h3>
                <div className="h-5 w-px bg-slate-200 dark:bg-slate-700"></div>
                <button className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary transition-colors">
                  <span>Main Pipeline</span>
                  <span className="material-symbols-outlined text-[18px]">expand_more</span>
                </button>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                  <button className="p-1.5 rounded bg-white dark:bg-slate-700 shadow-sm text-primary">
                    <span className="material-symbols-outlined text-[18px]">view_kanban</span>
                  </button>
                  <button className="p-1.5 rounded hover:bg-white/50 dark:hover:bg-slate-700/50 text-slate-500 dark:text-slate-400 transition-colors">
                    <span className="material-symbols-outlined text-[18px]">format_list_bulleted</span>
                  </button>
                  <button className="p-1.5 rounded hover:bg-white/50 dark:hover:bg-slate-700/50 text-slate-500 dark:text-slate-400 transition-colors">
                    <span className="material-symbols-outlined text-[18px]">table_chart</span>
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    <span className="material-symbols-outlined text-[20px]">settings</span>
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-energy text-slate-900 font-bold text-sm hover:brightness-105 transition-all shadow-sm shadow-yellow-500/20">
                    <span className="material-symbols-outlined text-[18px]">add</span>
                    <span>Create Entity</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Board Filters */}
            <div className="px-6 py-3 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/20 z-10">
              <div className="flex items-center gap-3">
                <div className="relative group">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary material-symbols-outlined text-sm transition-colors">search</span>
                  <input className="pl-8 pr-3 py-1.5 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary w-56 placeholder-slate-400 transition-all" placeholder="Search items..." type="text"/>
                </div>
                <div className="h-5 w-px bg-slate-200 dark:bg-slate-700 mx-1"></div>
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-dashed border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400 text-xs font-medium hover:border-primary hover:text-primary transition-colors bg-transparent">
                  <span className="material-symbols-outlined text-[16px]">person</span>
                  Assignee
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-dashed border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400 text-xs font-medium hover:border-primary hover:text-primary transition-colors bg-transparent">
                  <span className="material-symbols-outlined text-[16px]">label</span>
                  Label
                </button>
                <button className="text-slate-400 hover:text-energy text-xs font-medium ml-2 transition-colors">
                  Clear filters
                </button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Saved Views:</span>
                <button className="px-3 py-1 rounded bg-blue-50 dark:bg-blue-900/20 text-primary dark:text-blue-300 text-xs font-bold border border-blue-100 dark:border-blue-800">
                  My Tasks
                </button>
              </div>
            </div>

            {/* Columns Area */}
            <div className="flex-1 bg-slate-50 dark:bg-[#0b0f17] p-6 overflow-x-auto">
              <div className="flex h-full gap-4 min-w-[1000px]">
                {/* Backlog Column */}
                <div className="w-80 flex-shrink-0 flex flex-col h-full">
                  <div className="flex items-center justify-between mb-3 px-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-[#0d121b] dark:text-slate-200">Backlog</h4>
                      <span className="px-1.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-mono font-bold">4</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 transition-colors">
                        <span className="material-symbols-outlined text-[18px]">add</span>
                      </button>
                      <button className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 transition-colors">
                        <span className="material-symbols-outlined text-[18px]">more_horiz</span>
                      </button>
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                    <div className="p-3 bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm hover:border-primary/50 cursor-pointer group transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-mono text-slate-400">DEV-204</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-400" title="Medium Priority"></span>
                      </div>
                      <p className="text-sm font-medium text-[#0d121b] dark:text-slate-200 mb-3 leading-snug group-hover:text-primary transition-colors">Implement OAuth 2.0 authentication flow</p>
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px]">Backend</span>
                        <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold">JD</div>
                      </div>
                    </div>
                    <div className="p-3 bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm hover:border-primary/50 cursor-pointer group transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-mono text-slate-400">DEV-210</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500" title="High Priority"></span>
                      </div>
                      <p className="text-sm font-medium text-[#0d121b] dark:text-slate-200 mb-3 leading-snug group-hover:text-primary transition-colors">Fix memory leak in data grid component</p>
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px]">Bug</span>
                        <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center text-[10px] font-bold">?</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* In Progress Column */}
                <div className="w-80 flex-shrink-0 flex flex-col h-full">
                  <div className="flex items-center justify-between mb-3 px-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-[#0d121b] dark:text-slate-200">In Progress</h4>
                      <span className="px-1.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-[10px] font-mono font-bold">2</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] font-bold text-energy border border-energy/30 px-1.5 rounded bg-energy/10">WIP 2/3</span>
                      <button className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 transition-colors">
                        <span className="material-symbols-outlined text-[18px]">more_horiz</span>
                      </button>
                    </div>
                  </div>
                  <div className="flex-1 rounded-xl border-2 border-dashed border-primary bg-blue-50/50 dark:bg-blue-900/10 p-2 relative transition-all">
                    <div className="p-3 bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm mb-3 opacity-50">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-mono text-slate-400">DES-102</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                      </div>
                      <p className="text-sm font-medium text-[#0d121b] dark:text-slate-200 mb-3">Update color tokens in Figma library</p>
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px]">Design</span>
                        <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-[10px] font-bold">AS</div>
                      </div>
                    </div>
                    <div className="absolute inset-x-2 top-28 bottom-2 rounded-lg flex flex-col items-center justify-center pointer-events-none">
                      <span className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center mb-2 shadow-lg shadow-blue-500/30">
                        <span className="material-symbols-outlined">arrow_downward</span>
                      </span>
                      <span className="text-xs font-bold text-primary">Drop to move</span>
                    </div>
                  </div>
                </div>

                {/* QA Review Column */}
                <div className="w-80 flex-shrink-0 flex flex-col h-full">
                  <div className="flex items-center justify-between mb-3 px-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-[#0d121b] dark:text-slate-200">QA Review</h4>
                      <span className="px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 text-[10px] font-mono font-bold">0</span>
                    </div>
                    <button className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 transition-colors">
                      <span className="material-symbols-outlined text-[18px]">more_horiz</span>
                    </button>
                  </div>
                  <div className="flex-1 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-800/20 flex flex-col items-center justify-center text-center p-6">
                    <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-400 flex items-center justify-center mb-3">
                      <span className="material-symbols-outlined">inbox</span>
                    </div>
                    <h5 className="text-sm font-bold text-slate-600 dark:text-slate-300 mb-1">No items yet</h5>
                    <p className="text-xs text-slate-400 mb-4">This stage is currently empty.</p>
                    <button className="text-xs font-bold text-energy hover:underline flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">add</span>
                      Add Item
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Board States Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <div className="flex flex-col gap-4">
            <h3 className="text-[#0d121b] dark:text-white text-lg font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-slate-300"></span> Loading State
            </h3>
            <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded-xl p-4 overflow-hidden h-48 relative">
              <div className="flex items-center justify-between mb-4">
                <div className="h-4 w-32 bg-slate-100 dark:bg-slate-800 rounded animate-pulse"></div>
                <div className="flex gap-2">
                  <div className="h-8 w-20 bg-slate-100 dark:bg-slate-800 rounded animate-pulse"></div>
                  <div className="h-8 w-8 bg-slate-100 dark:bg-slate-800 rounded animate-pulse"></div>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-1 flex flex-col gap-3">
                  <div className="h-4 w-20 bg-slate-100 dark:bg-slate-800 rounded animate-pulse"></div>
                  <div className="h-24 w-full bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse"></div>
                </div>
                <div className="flex-1 flex flex-col gap-3">
                  <div className="h-4 w-20 bg-slate-100 dark:bg-slate-800 rounded animate-pulse"></div>
                  <div className="h-24 w-full bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse"></div>
                </div>
              </div>
            </div>
            <p className="text-xs text-slate-500">Utilizes subtle neutral skeletons to indicate structure without distracting brand colors.</p>
          </div>
          <div className="flex flex-col gap-4">
            <h3 className="text-[#0d121b] dark:text-white text-lg font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-energy"></span> Empty Board
            </h3>
            <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded-xl p-4 flex flex-col items-center justify-center text-center h-48">
              <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-300 flex items-center justify-center mb-2">
                <span className="material-symbols-outlined">dashboard_customize</span>
              </div>
              <h4 className="text-sm font-bold text-[#0d121b] dark:text-white mb-1">Start your pipeline</h4>
              <button className="mt-2 px-4 py-1.5 bg-energy text-slate-900 text-xs font-bold rounded hover:brightness-105">
                Create First Stage
              </button>
            </div>
            <p className="text-xs text-slate-500">Clear central messaging with a high-contrast Energy Yellow CTA to drive initial action.</p>
          </div>
          <div className="flex flex-col gap-4">
            <h3 className="text-[#0d121b] dark:text-white text-lg font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500"></span> Error State
            </h3>
            <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded-xl p-4 h-48 relative flex flex-col">
              <div className="h-full w-full bg-slate-50 dark:bg-slate-900 rounded-lg flex items-center justify-center relative overflow-hidden">
                <div className="absolute top-4 left-4 right-4 bg-white dark:bg-surface-dark border-l-2 border-red-500 p-3 shadow-sm rounded-r flex gap-3">
                  <span className="material-symbols-outlined text-red-500 text-sm">error_outline</span>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-[#0d121b] dark:text-white">Failed to load pipeline</span>
                    <span className="text-[10px] text-slate-400">Please check your connection and retry.</span>
                  </div>
                  <button className="ml-auto text-xs font-bold text-primary">Retry</button>
                </div>
                <div className="opacity-10 text-slate-400">
                  <span className="material-symbols-outlined text-6xl">cloud_off</span>
                </div>
              </div>
            </div>
            <p className="text-xs text-slate-500">Minimalist non-intrusive alert banners that maintain layout integrity.</p>
          </div>
        </section>

        {/* Visual Anatomy Section */}
        <section className="mb-12">
          <h3 className="text-[#0d121b] dark:text-white text-xl font-bold mb-6">Visual Anatomy & Specs</h3>
          <div className="bg-[#0d121b] rounded-xl border border-slate-800 p-8 grid md:grid-cols-2 gap-12 relative overflow-hidden">
            <div className="relative z-10 space-y-6">
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded bg-primary text-white flex-shrink-0 flex items-center justify-center font-mono text-sm font-bold">1</div>
                <div>
                  <h4 className="text-white font-bold mb-1">Board Header</h4>
                  <p className="text-slate-400 text-sm leading-relaxed">Contains the board context. Primary actions use <span className="text-energy font-bold">Energy Yellow</span> (#EAB308). Secondary actions use neutral icons.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded bg-primary text-white flex-shrink-0 flex items-center justify-center font-mono text-sm font-bold">2</div>
                <div>
                  <h4 className="text-white font-bold mb-1">Smart Filter Bar</h4>
                  <p className="text-slate-400 text-sm leading-relaxed">Interactive filters highlight in <span className="text-primary font-bold">Primary Blue</span> (#135BEC) when active. Search inputs have a focus ring in primary opacity.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded bg-primary text-white flex-shrink-0 flex items-center justify-center font-mono text-sm font-bold">3</div>
                <div>
                  <h4 className="text-white font-bold mb-1">Column & Card States</h4>
                  <p className="text-slate-400 text-sm leading-relaxed">Drag-over valid targets use a Primary Blue border/background tint. Invalid targets (not shown) use Dark Neutral overlay.</p>
                </div>
              </div>
            </div>
            <div className="relative z-10 p-6 bg-white/5 rounded-xl border border-white/10 font-mono text-xs">
              <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-2">
                <span className="text-slate-400">pipeline_config.json</span>
                <span className="text-energy">JSON</span>
              </div>
              <div className="space-y-2 text-slate-300">
                <pre>{JSON.stringify({
                  "board": {
                    "layout": "kanban",
                    "theme": "system_default",
                    "columns": [
                      {
                        "id": "backlog",
                        "title": "Backlog",
                        "wip_limit": null,
                        "style": { "header_badge": "neutral" }
                      },
                      {
                        "id": "in_progress",
                        "title": "In Progress",
                        "wip_limit": 3,
                        "style": { "header_badge": "primary" }
                      }
                    ]
                  }
                }, null, 2)}
                </pre>
              </div>
            </div>
            <div className="absolute right-0 bottom-0 opacity-5 pointer-events-none">
              <span className="material-symbols-outlined text-[300px] text-white">view_kanban</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
