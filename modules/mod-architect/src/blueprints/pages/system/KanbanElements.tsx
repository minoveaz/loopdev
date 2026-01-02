
import React from 'react';

export const KanbanElements: React.FC = () => {
  return (
    <div className="relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern-custom pointer-events-none z-0 opacity-10"></div>
      
      <div className="relative z-10 max-w-[1200px] mx-auto p-6 md:p-12 pb-24">
        {/* Header Section */}
        <div className="mb-12">
          <div className="flex flex-col gap-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 w-fit">
              <span className="material-symbols-outlined text-primary text-sm">view_kanban</span>
              <span className="text-primary text-xs font-bold uppercase tracking-wide">Kanban System</span>
            </div>
            <h1 className="text-[#0d121b] dark:text-white text-4xl md:text-5xl font-black leading-tight tracking-[-0.033em]">Interaction Elements</h1>
            <p className="text-[#4c669a] dark:text-slate-400 text-lg max-w-2xl">
              A definitive guide to the interactive states, card anatomy, and validation logic within the loop.dev Kanban ecosystem. Designed for density, clarity, and speed.
            </p>
          </div>
        </div>

        {/* 1. Kanban Card Anatomy */}
        <section className="mb-20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[#0d121b] dark:text-white text-2xl font-bold tracking-[-0.015em]">1. Kanban Card Anatomy</h2>
            <span className="text-xs font-mono text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">Component: KanbanCard</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Normal Density</h3>
              <div className="bg-slate-50 dark:bg-slate-900/50 p-8 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-center">
                <div className="w-full max-w-sm bg-white dark:bg-surface-dark rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all cursor-pointer group relative">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-l-lg"></div>
                  <div className="p-3 pl-4 flex flex-col gap-2">
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">DS-294</span>
                        <h4 className="text-sm font-semibold text-[#0d121b] dark:text-white leading-tight">Integrate new color tokens into dashboard</h4>
                      </div>
                      <button className="text-slate-400 hover:text-primary transition-colors p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800">
                        <span className="material-symbols-outlined text-lg">more_horiz</span>
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-900/30 text-primary text-[10px] font-semibold">Frontend</span>
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-medium">Priority: High</span>
                    </div>
                    <div className="flex items-center justify-between pt-2 mt-1 border-t border-slate-50 dark:border-slate-800">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-energy text-[#0d121b] flex items-center justify-center text-[8px] font-bold border border-white dark:border-slate-700 shadow-sm">AI</div>
                        <span className="text-[10px] text-slate-400">Oct 24</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[14px] text-amber-500" title="SLA Warning">warning</span>
                        <div className="flex -space-x-1">
                          <div className="w-5 h-5 rounded-full bg-slate-200 border border-white dark:border-slate-700"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Compact & Quick Actions</h3>
              <div className="bg-slate-50 dark:bg-slate-900/50 p-8 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col gap-4 items-center justify-center">
                <div className="w-full max-w-sm bg-white dark:bg-surface-dark rounded-md border border-slate-200 dark:border-slate-700 shadow-sm hover:border-primary/50 transition-colors cursor-pointer flex items-center p-2 gap-3">
                  <span className="material-symbols-outlined text-slate-400 text-lg">check_circle</span>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-medium text-[#0d121b] dark:text-white truncate">Update API documentation links</h4>
                  </div>
                  <div className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 text-[9px] flex items-center justify-center text-slate-500">JD</div>
                </div>
                <div className="w-full max-w-sm bg-white dark:bg-surface-dark rounded-lg border border-primary/40 shadow-md p-3 pl-4 flex flex-col gap-2 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-white/90 dark:bg-surface-dark/90 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <button className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-primary hover:text-white hover:scale-110 transition-all shadow-sm" title="Edit">
                      <span className="material-symbols-outlined text-lg">edit</span>
                    </button>
                    <button className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-primary hover:text-white hover:scale-110 transition-all shadow-sm" title="Move">
                      <span className="material-symbols-outlined text-lg">arrow_forward</span>
                    </button>
                  </div>
                  <div className="flex justify-between items-start gap-2 opacity-40 group-hover:blur-[1px] transition-all">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] font-bold text-slate-400">DS-295</span>
                      <h4 className="text-sm font-semibold text-[#0d121b] dark:text-white">Review button interactions</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. DragOverlay & Drop Indicators */}
        <section className="mb-20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[#0d121b] dark:text-white text-2xl font-bold tracking-[-0.015em]">2. DragOverlay & Drop Indicators</h2>
          </div>
          <div className="relative bg-slate-100 dark:bg-[#0b0f17] rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden h-96">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#64748b 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
            <div className="relative z-10 flex h-full p-6 gap-6">
              <div className="w-1/3 flex flex-col gap-3">
                <div className="flex items-center justify-between px-1">
                  <h3 className="text-xs font-bold uppercase text-slate-500">To Do</h3>
                  <span className="bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-bold px-1.5 rounded">4</span>
                </div>
                <div className="bg-slate-50/50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-800/50 h-full p-2 flex flex-col gap-2">
                  <div className="bg-white dark:bg-surface-dark p-3 rounded border border-slate-200 dark:border-slate-700 shadow-sm opacity-50">
                    <div className="h-2 w-12 bg-slate-100 dark:bg-slate-700 rounded mb-2"></div>
                    <div className="h-3 w-3/4 bg-slate-100 dark:bg-slate-700 rounded"></div>
                  </div>
                </div>
              </div>
              <div className="w-1/3 flex flex-col gap-3">
                <div className="flex items-center justify-between px-1">
                  <h3 className="text-xs font-bold uppercase text-primary">In Progress</h3>
                  <span className="bg-primary/10 text-primary text-[10px] font-bold px-1.5 rounded">Active</span>
                </div>
                <div className="bg-blue-50/50 dark:bg-blue-900/10 rounded-lg border-2 border-dashed border-primary/50 h-full p-2 flex flex-col gap-2 relative">
                  <div className="w-full h-1 bg-primary rounded-full shadow-[0_0_10px_rgba(19,91,236,0.5)] my-1 animate-pulse"></div>
                  <div className="bg-white dark:bg-surface-dark p-3 rounded border border-slate-200 dark:border-slate-700 shadow-sm">
                    <div className="h-2 w-10 bg-slate-100 dark:bg-slate-700 rounded mb-2"></div>
                    <div className="h-3 w-2/3 bg-slate-100 dark:bg-slate-700 rounded"></div>
                  </div>
                </div>
              </div>
              <div className="w-1/3 flex flex-col gap-3 opacity-60">
                <div className="flex items-center justify-between px-1">
                  <h3 className="text-xs font-bold uppercase text-slate-400">Done</h3>
                  <span className="material-symbols-outlined text-slate-400 text-sm">lock</span>
                </div>
                <div className="bg-slate-100 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 h-full p-2 flex flex-col gap-2">
                  <div className="bg-white dark:bg-surface-dark p-3 rounded border border-slate-200 dark:border-slate-700 shadow-sm">
                    <div className="h-2 w-16 bg-slate-100 dark:bg-slate-700 rounded mb-2"></div>
                    <div className="h-3 w-full bg-slate-100 dark:bg-slate-700 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
            {/* Dragging Item Overlay */}
            <div className="absolute top-1/3 left-[40%] w-64 bg-white dark:bg-surface-dark p-4 rounded-lg border-2 border-primary shadow-2xl z-50 transform rotate-3 cursor-grabbing ring-4 ring-primary/10">
              <div className="flex justify-between items-start gap-2 mb-2">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-primary">DS-302</span>
                  <h4 className="text-sm font-bold text-[#0d121b] dark:text-white">Implement drag preview</h4>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100 dark:border-slate-700">
                <div className="w-4 h-4 rounded-full bg-energy text-[8px] font-bold flex items-center justify-center text-black">AI</div>
                <span className="text-[10px] text-slate-400">Moving 1 item...</span>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Move Validation Modal */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[#0d121b] dark:text-white text-2xl font-bold tracking-[-0.015em]">3. Move Validation Modal</h2>
            <p className="text-sm text-slate-500">Triggered for state transitions requiring user input.</p>
          </div>
          <div className="relative bg-slate-200 dark:bg-slate-900 rounded-xl overflow-hidden min-h-[400px] flex items-center justify-center border border-slate-300 dark:border-slate-800">
            <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm z-0"></div>
            <div className="relative z-10 bg-white dark:bg-surface-dark w-full max-w-md rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded bg-blue-100 dark:bg-blue-900/30 text-primary">
                    <span className="material-symbols-outlined text-lg">rule</span>
                  </div>
                  <h3 className="font-bold text-[#0d121b] dark:text-white">Status Change Validation</h3>
                </div>
                <button className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <div className="p-6 flex flex-col gap-4">
                <div className="text-sm text-slate-600 dark:text-slate-300">
                  You are moving <span className="font-mono text-xs bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-800 dark:text-slate-200">DS-302</span> to <strong>Completed</strong>. Please provide a resolution summary.
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase text-slate-500">Resolution Note <span className="text-red-500">*</span></label>
                  <textarea className="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800/50 text-sm text-[#0d121b] dark:text-white focus:ring-2 focus:ring-primary focus:border-primary transition-shadow placeholder:text-slate-400" placeholder="Describe the fix or outcome..." rows={3}></textarea>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-[10px] text-slate-400">Minimum 10 characters required.</span>
                    <button className="text-[10px] text-primary font-medium hover:underline flex items-center gap-1">
                      <span className="material-symbols-outlined text-[10px] fill-1">auto_awesome</span> Generate with AI
                    </button>
                  </div>
                </div>
                <div className="flex items-start gap-2 p-3 bg-energy/10 rounded-lg border border-energy/30">
                  <span className="material-symbols-outlined text-amber-600 dark:text-yellow-400 text-lg mt-0.5">info</span>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-amber-800 dark:text-yellow-500">Effect on SLA</span>
                    <p className="text-[10px] text-amber-700 dark:text-yellow-600/80 leading-snug">Closing this ticket now will meet the SLA target of 48h.</p>
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-700 flex justify-end gap-3">
                <button className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">Cancel</button>
                <button className="px-4 py-2 rounded-lg text-sm font-bold text-white bg-primary hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2">
                  Confirm Move
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
