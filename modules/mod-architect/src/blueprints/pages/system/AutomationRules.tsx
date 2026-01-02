
import React from 'react';

export const AutomationRules: React.FC = () => {
  return (
    <div className="max-w-[1200px] mx-auto p-6 md:p-12 pb-24">
      <div className="mb-12">
        <div className="flex flex-col gap-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 w-fit">
            <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-sm">account_tree</span>
            <span className="text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wide">System Components</span>
          </div>
          <h1 className="text-[#0d121b] dark:text-white text-4xl md:text-5xl font-black leading-tight tracking-[-0.033em]">Automation &amp; Rules</h1>
          <p className="text-[#4c669a] dark:text-slate-400 text-lg max-w-2xl">
            Building blocks for logic-driven workflows and temporal sequences. These components enable users to construct complex automation rules and visualize schedules with technical precision and clarity.
          </p>
        </div>
      </div>

      {/* Logic Construction Section */}
      <section className="mb-20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[#0d121b] dark:text-white text-2xl font-bold tracking-[-0.015em]">Logic Construction</h2>
          <div className="inline-flex items-center gap-2 text-slate-500 text-sm">
            <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-xs font-mono">builder-ui</span>
          </div>
        </div>
        <div className="bg-slate-50 dark:bg-[#13151b] border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm h-[600px] flex">
          <div className="flex-1 relative overflow-hidden">
            <div 
              className="absolute inset-0" 
              style={{ 
                backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', 
                backgroundSize: '24px 24px', 
                opacity: 0.4 
              }} 
            />
            <div className="absolute inset-0 flex flex-col items-center pt-16">
              {/* Trigger Block */}
              <div className="w-72 bg-white dark:bg-slate-800 rounded-lg border-l-4 border-l-primary shadow-lg border-y border-r border-slate-200 dark:border-slate-700 p-4 relative z-10 group transition-all hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded bg-blue-50 dark:bg-blue-900/30 text-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-lg">bolt</span>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Trigger</div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white">New Lead Created</div>
                  </div>
                </div>
                <div className="text-xs text-slate-500 pl-11">Source: Any web form</div>
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary cursor-pointer transition-colors z-20 shadow-sm opacity-0 group-hover:opacity-100">
                  <span className="material-symbols-outlined text-sm">add</span>
                </div>
              </div>
              
              {/* Connector */}
              <div className="h-12 w-0.5 bg-slate-300 dark:bg-slate-700"></div>
              
              {/* Condition Block */}
              <div className="w-72 bg-white dark:bg-slate-800 rounded-lg border-l-4 border-l-yellow-400 shadow-lg border-y border-r border-slate-200 dark:border-slate-700 p-4 relative z-10 group transition-all hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 flex items-center justify-center">
                    <span className="material-symbols-outlined text-lg">alt_route</span>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Condition</div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white">Email Domain</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 rounded text-[10px] font-mono text-slate-600 dark:text-slate-300">contains</span>
                  <span className="text-xs text-slate-900 dark:text-white font-medium">@loop.dev</span>
                </div>
              </div>
              
              {/* Branching Lines */}
              <div className="relative h-12 w-full max-w-[18rem]">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-0.5 bg-slate-300 dark:bg-slate-700"></div>
                <div className="absolute top-6 left-0 right-0 h-0.5 bg-slate-300 dark:bg-slate-700"></div>
                <div className="absolute top-6 left-0 h-6 w-0.5 bg-slate-300 dark:bg-slate-700"></div>
                <div className="absolute top-6 right-0 h-6 w-0.5 bg-slate-300 dark:bg-slate-700"></div>
                <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[10px] font-bold rounded">TRUE</div>
                <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] font-bold rounded">FALSE</div>
              </div>
              
              {/* Action Blocks */}
              <div className="flex gap-4 w-full justify-between max-w-[22rem]">
                <div className="w-40 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-3 shadow-sm opacity-100 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-base">send</span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">Send Invite</span>
                  </div>
                </div>
                <div className="w-40 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-3 shadow-sm opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-slate-500 text-base">stop_circle</span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">End Flow</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* AI Assistant Toast */}
            <div className="absolute bottom-6 right-6 max-w-xs bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-primary/20 p-4 animate-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shrink-0 shadow-lg shadow-purple-500/20">
                  <span className="material-symbols-outlined text-white text-sm">auto_awesome</span>
                </div>
                <div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    <span className="font-bold text-primary">Loop AI:</span> Based on your trigger, I recommend adding a delay before sending the invite to increase open rates.
                  </p>
                  <div className="mt-3 flex gap-2">
                    <button className="text-[10px] font-bold text-white bg-primary px-3 py-1.5 rounded hover:bg-primary-dark transition-colors shadow-md shadow-blue-500/20">Apply Suggestion</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Configuration Sidebar */}
          <div className="w-80 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 p-6 flex flex-col hidden lg:flex">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-6 uppercase tracking-wider">Block Configuration</h3>
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2">Action Type</label>
                <div className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-sm text-slate-900 dark:text-white flex justify-between items-center hover:border-primary/50 transition-colors cursor-pointer">
                  Send Email
                  <span className="material-symbols-outlined text-slate-400 text-sm">expand_more</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2">Recipient</label>
                <div className="flex gap-2 mb-2">
                  <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs rounded border border-blue-100 dark:border-blue-900/50 flex items-center gap-1">
                    {'{Lead.Email}'} <span className="material-symbols-outlined text-[10px] cursor-pointer hover:text-blue-900">close</span>
                  </span>
                </div>
                <div className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-sm text-slate-400 hover:border-slate-300 cursor-text">
                  Add variable...
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2">Template</label>
                <div className="w-full h-24 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded p-2 text-xs text-slate-400 font-mono resize-none">
                  Hi {'{First_Name}'}, welcome to loop.dev...
                </div>
              </div>
            </div>
            <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-800">
              <button className="w-full py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded font-bold text-xs hover:opacity-90 transition-opacity">Save Configuration</button>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline & Scheduling Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[#0d121b] dark:text-white text-2xl font-bold tracking-[-0.015em]">Timeline &amp; Scheduling</h2>
          <div className="inline-flex items-center gap-2 text-slate-500 text-sm">
            <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-xs font-mono">scheduler-v2</span>
          </div>
        </div>
        <div className="bg-white dark:bg-[#13151b] border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
          
          {/* Calendar Toolbar */}
          <div className="border-b border-slate-200 dark:border-slate-800 p-4 flex justify-between items-center bg-white dark:bg-slate-900">
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors">
                <span className="material-symbols-outlined text-sm">today</span>
                Today
              </button>
              <div className="flex rounded border border-slate-200 dark:border-slate-700 overflow-hidden">
                <button className="px-2 py-1 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  <span className="material-symbols-outlined text-sm text-slate-500">chevron_left</span>
                </button>
                <button className="px-2 py-1 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border-l border-slate-200 dark:border-slate-700">
                  <span className="material-symbols-outlined text-sm text-slate-500">chevron_right</span>
                </button>
              </div>
              <span className="text-sm font-bold text-slate-900 dark:text-white ml-2">October 24, 2023</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span><span className="text-[10px] text-slate-500 mr-3 font-medium uppercase tracking-wide">Running</span>
              <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span><span className="text-[10px] text-slate-500 mr-3 font-medium uppercase tracking-wide">Pending</span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#FACC15]"></span><span className="text-[10px] text-slate-500 font-medium uppercase tracking-wide">Warning</span>
            </div>
          </div>

          {/* Timeline Header */}
          <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
            <div className="w-48 shrink-0 p-3 border-r border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-500 uppercase tracking-wider pl-6">Resource</div>
            <div className="flex-1 flex text-xs text-slate-400 font-mono">
              <div className="flex-1 border-r border-slate-200/50 dark:border-slate-700/50 p-3 text-center">08:00</div>
              <div className="flex-1 border-r border-slate-200/50 dark:border-slate-700/50 p-3 text-center">09:00</div>
              <div className="flex-1 border-r border-slate-200/50 dark:border-slate-700/50 p-3 text-center">10:00</div>
              <div className="flex-1 border-r border-slate-200/50 dark:border-slate-700/50 p-3 text-center">11:00</div>
              <div className="flex-1 border-r border-slate-200/50 dark:border-slate-700/50 p-3 text-center">12:00</div>
              <div className="flex-1 border-r border-slate-200/50 dark:border-slate-700/50 p-3 text-center">13:00</div>
            </div>
          </div>

          {/* Timeline Body */}
          <div className="relative min-h-[320px]">
            {/* Current Time Indicator */}
            <div className="absolute top-0 bottom-0 left-[35%] w-px bg-red-500/80 z-20 flex flex-col items-center pointer-events-none">
              <div className="w-2 h-2 rounded-full bg-red-500 -mt-1 shadow-sm"></div>
              <div className="mt-1 px-1.5 py-0.5 bg-red-500 rounded text-[9px] font-bold text-white leading-none">NOW</div>
            </div>

            {/* Row 1 */}
            <div className="flex border-b border-slate-100 dark:border-slate-800/50 h-24 group hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
              <div className="w-48 shrink-0 p-4 border-r border-slate-200 dark:border-slate-800 flex items-center gap-3 pl-6">
                <div className="w-8 h-8 rounded bg-purple-100 dark:bg-purple-900/30 text-purple-600 flex items-center justify-center font-bold text-xs">M</div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Marketing Auto</div>
                  <div className="text-[10px] text-slate-400">Campaign #442</div>
                </div>
              </div>
              <div className="flex-1 relative p-2">
                {/* Grid Lines */}
                <div className="absolute inset-0 flex pointer-events-none">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="flex-1 border-r border-dashed border-slate-200 dark:border-slate-800"></div>
                  ))}
                </div>
                {/* Task Block */}
                <div className="absolute top-6 left-[10%] right-[60%] h-12 bg-primary/10 border border-primary rounded-md flex items-center px-3 cursor-move hover:shadow-md hover:ring-2 hover:ring-primary/20 transition-all">
                  <div className="w-1 h-8 rounded-full bg-primary mr-3"></div>
                  <div>
                    <div className="text-[11px] font-bold text-primary">Email Blast</div>
                    <div className="text-[9px] text-primary/70 font-mono">Processing...</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Row 2 */}
            <div className="flex border-b border-slate-100 dark:border-slate-800/50 h-24 group hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
              <div className="w-48 shrink-0 p-4 border-r border-slate-200 dark:border-slate-800 flex items-center gap-3 pl-6">
                <div className="w-8 h-8 rounded bg-teal-100 dark:bg-teal-900/30 text-teal-600 flex items-center justify-center font-bold text-xs">D</div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Data Sync</div>
                  <div className="text-[10px] text-slate-400">Warehouse A</div>
                </div>
              </div>
              <div className="flex-1 relative p-2">
                <div className="absolute inset-0 flex pointer-events-none">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="flex-1 border-r border-dashed border-slate-200 dark:border-slate-800"></div>
                  ))}
                </div>
                <div className="absolute top-6 left-[40%] right-[30%] h-12 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-500 rounded-md flex items-center px-3 cursor-move hover:shadow-md hover:ring-2 hover:ring-slate-300 dark:hover:ring-slate-500 transition-all">
                  <div className="w-1 h-8 rounded-full bg-slate-400 mr-3"></div>
                  <div>
                    <div className="text-[11px] font-bold text-slate-600 dark:text-slate-300">Daily Backup</div>
                    <div className="text-[9px] text-slate-500 font-mono">Scheduled</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Row 3 */}
            <div className="flex border-b border-slate-100 dark:border-slate-800/50 h-24 group hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
              <div className="w-48 shrink-0 p-4 border-r border-slate-200 dark:border-slate-800 flex items-center gap-3 pl-6">
                <div className="w-8 h-8 rounded bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 flex items-center justify-center font-bold text-xs">S</div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">System Checks</div>
                  <div className="text-[10px] text-slate-400">Global</div>
                </div>
              </div>
              <div className="flex-1 relative p-2">
                <div className="absolute inset-0 flex pointer-events-none">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="flex-1 border-r border-dashed border-slate-200 dark:border-slate-800"></div>
                  ))}
                </div>
                <div className="absolute top-6 left-[20%] right-[65%] h-12 bg-[#FACC15]/10 border border-[#FACC15]/50 rounded-md flex items-center px-3 cursor-pointer hover:shadow-md hover:ring-2 hover:ring-[#FACC15]/20 transition-all">
                  <span className="material-symbols-outlined text-[#FACC15] text-sm mr-2">warning</span>
                  <div>
                    <div className="text-[11px] font-bold text-yellow-700 dark:text-yellow-400">Resource Conflict</div>
                    <div className="text-[9px] text-yellow-700/70 dark:text-yellow-400/70 font-mono">Requires Attention</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
