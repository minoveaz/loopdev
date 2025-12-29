import React from 'react';

export const SettingsExamples: React.FC = () => {
  return (
    <div className="max-w-[1200px] mx-auto p-6 md:p-12 pb-24">
      <div className="mb-12">
        <div className="flex flex-col gap-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 w-fit">
            <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-sm">deployed_code</span>
            <span className="text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wide">System Version 2.4</span>
          </div>
          <h1 className="text-[#0d121b] dark:text-white text-4xl md:text-5xl font-black leading-tight tracking-[-0.033em]">Customization &amp; Settings</h1>
          <p className="text-[#4c669a] dark:text-slate-400 text-lg max-w-2xl">
            User-centric components designed for personalization and control. From dashboard layouts to granular property editors, these patterns ensure consistency while empowering users to adapt the interface to their workflow.
          </p>
        </div>
      </div>

      <section className="mb-20">
        <div className="flex items-center justify-between mb-6">
          <div className="flex flex-col">
            <h2 className="text-[#0d121b] dark:text-white text-2xl font-bold tracking-[-0.015em]">Layout Configurator</h2>
            <p className="text-sm text-slate-500 mt-1">Drag-and-drop zones and grid management</p>
          </div>
          <div className="inline-flex items-center gap-2 text-slate-500 text-sm">
            <button className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold hover:border-primary transition-colors">View Specs</button>
          </div>
        </div>
        <div className="w-full bg-slate-100 dark:bg-[#0d121b] border border-slate-200 dark:border-slate-800 rounded-xl p-8 overflow-hidden relative">
          <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#64748b 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
          <div className="relative z-10 max-w-5xl mx-auto bg-white dark:bg-slate-900 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="h-12 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between px-4 bg-white dark:bg-slate-900">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Analytics Dashboard</span>
              <div className="flex items-center gap-2">
                <button className="bg-primary text-white text-[10px] font-bold px-3 py-1.5 rounded flex items-center gap-1 shadow-lg shadow-blue-500/20">
                  <span className="material-symbols-outlined text-xs">save</span> Save Layout
                </button>
              </div>
            </div>
            <div className="p-6 bg-slate-50/50 dark:bg-slate-900/50 min-h-[400px]">
              <div className="grid grid-cols-12 gap-4 h-full">
                <div className="col-span-12 md:col-span-8 group relative bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 p-4 shadow-sm hover:shadow-md transition-shadow cursor-move">
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                    <div className="w-6 h-6 bg-slate-100 dark:bg-slate-700 rounded flex items-center justify-center cursor-pointer hover:text-primary"><span className="material-symbols-outlined text-[14px]">drag_indicator</span></div>
                    <div className="w-6 h-6 bg-slate-100 dark:bg-slate-700 rounded flex items-center justify-center cursor-pointer hover:text-red-500"><span className="material-symbols-outlined text-[14px]">close</span></div>
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-4 bg-primary rounded-sm"></div>
                    <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200">Traffic Overview</h4>
                  </div>
                  <div className="h-32 w-full bg-slate-50 dark:bg-slate-700/50 rounded flex items-end justify-between px-2 pb-2 gap-1">
                    <div className="w-full bg-blue-100 dark:bg-blue-900/40 rounded-t h-[40%]"></div>
                    <div className="w-full bg-blue-200 dark:bg-blue-800/40 rounded-t h-[70%]"></div>
                    <div className="w-full bg-primary/80 dark:bg-primary/60 rounded-t h-[50%]"></div>
                    <div className="w-full bg-blue-100 dark:bg-blue-900/40 rounded-t h-[60%]"></div>
                    <div className="w-full bg-blue-200 dark:bg-blue-800/40 rounded-t h-[85%]"></div>
                  </div>
                </div>
                <div className="col-span-12 md:col-span-4 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 p-4 shadow-sm cursor-move hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-4 bg-energy rounded-sm"></div>
                    <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200">Active Users</h4>
                  </div>
                  <div className="flex flex-col items-center justify-center h-32">
                    <span className="text-4xl font-black text-slate-800 dark:text-white tracking-tight">1,204</span>
                    <span className="text-xs font-mono text-green-500 flex items-center mt-1">
                      <span className="material-symbols-outlined text-sm">arrow_upward</span> 12.5%
                    </span>
                  </div>
                </div>
                <div className="col-span-12 md:col-span-4 h-48 border-2 border-dashed border-primary/40 bg-blue-50/50 dark:bg-blue-900/10 rounded-lg flex flex-col items-center justify-center text-primary cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                  <span className="material-symbols-outlined text-3xl mb-2">add_circle</span>
                  <span className="text-xs font-bold uppercase tracking-wide">Add Widget</span>
                </div>
                <div className="col-span-12 md:col-span-8 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 p-4 shadow-sm opacity-60">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-2 bg-slate-200 dark:bg-slate-700 rounded"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-700/50 rounded"></div>
                    <div className="w-3/4 h-2 bg-slate-100 dark:bg-slate-700/50 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-20">
        <div className="flex items-center justify-between mb-6">
          <div className="flex flex-col">
            <h2 className="text-[#0d121b] dark:text-white text-2xl font-bold tracking-[-0.015em]">Preference Panels</h2>
            <p className="text-sm text-slate-500 mt-1">Standardized controls for user settings</p>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="flex flex-col gap-6">
            <div className="p-6 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <h3 className="text-sm font-bold text-[#0d121b] dark:text-white mb-4 uppercase tracking-wider">Design Principles</h3>
              <ul className="space-y-4">
                <li className="flex gap-3 text-sm text-slate-600 dark:text-slate-300">
                  <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                  <span>Group related settings logically under clear section headers.</span>
                </li>
                <li className="flex gap-3 text-sm text-slate-600 dark:text-slate-300">
                  <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                  <span>Use toggle switches for instant-apply boolean states.</span>
                </li>
                <li className="flex gap-3 text-sm text-slate-600 dark:text-slate-300">
                  <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                  <span>Provide immediate visual feedback for state changes.</span>
                </li>
              </ul>
            </div>
            <div className="p-6 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/50">
              <h3 className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-2">Technical Note</h3>
              <p className="text-xs text-blue-800 dark:text-blue-200 leading-relaxed">
                Preference components are built to sync automatically with the backend via the <code>usePreferences</code> hook. Local storage fallback is enabled by default for offline persistence.
              </p>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="flex border-b border-slate-200 dark:border-slate-800">
              <button className="px-6 py-4 text-sm font-bold text-primary border-b-2 border-primary bg-blue-50/50 dark:bg-blue-900/20">General</button>
              <button className="px-6 py-4 text-sm font-medium text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">Notifications</button>
              <button className="px-6 py-4 text-sm font-medium text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">Privacy</button>
            </div>
            <div className="p-6 space-y-8">
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Appearance &amp; Locale</h4>
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">Interface Theme</span>
                      <span className="text-xs text-slate-500">Select your preferred color scheme</span>
                    </div>
                    <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                      <button className="p-1.5 rounded bg-white dark:bg-slate-700 shadow-sm text-slate-800 dark:text-white"><span className="material-symbols-outlined text-sm">light_mode</span></button>
                      <button className="p-1.5 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"><span className="material-symbols-outlined text-sm">dark_mode</span></button>
                      <button className="p-1.5 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"><span className="material-symbols-outlined text-sm">settings_system_daydream</span></button>
                    </div>
                  </div>
                  <div className="h-px bg-slate-100 dark:bg-slate-800 w-full"></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Language</label>
                      <div className="relative">
                        <select className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm rounded-lg focus:ring-primary focus:border-primary px-3 py-2 appearance-none">
                          <option>English (US)</option>
                          <option>Spanish</option>
                          <option>French</option>
                        </select>
                        <span className="absolute right-3 top-2.5 pointer-events-none text-slate-500 material-symbols-outlined text-sm">expand_more</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Timezone</label>
                      <div className="relative">
                        <select className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm rounded-lg focus:ring-primary focus:border-primary px-3 py-2 appearance-none">
                          <option>(UTC-05:00) Eastern Time</option>
                          <option>(UTC-08:00) Pacific Time</option>
                          <option>UTC</option>
                        </select>
                        <span className="absolute right-3 top-2.5 pointer-events-none text-slate-500 material-symbols-outlined text-sm">expand_more</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Workflow Automation</h4>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">Auto-Save Layouts</span>
                    <span className="text-xs text-slate-500">Automatically save dashboard changes</span>
                  </div>
                  <button className="w-11 h-6 bg-primary rounded-full relative transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                    <span className="absolute left-6 top-1 bg-white w-4 h-4 rounded-full transition-all shadow-sm"></span>
                  </button>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
              <button className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors">Reset</button>
              <button className="px-4 py-2 text-xs font-bold text-white bg-primary hover:bg-primary-dark rounded transition-colors shadow-lg shadow-blue-500/20">Save Changes</button>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex flex-col">
            <h2 className="text-[#0d121b] dark:text-white text-2xl font-bold tracking-[-0.015em]">Property Editors</h2>
            <p className="text-sm text-slate-500 mt-1">Compact inspector panels for metadata</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden flex flex-col h-full shadow-sm hover:shadow-md transition-shadow">
            <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-slate-500">File Metadata</span>
              <span className="material-symbols-outlined text-slate-400 text-sm">info</span>
            </div>
            <div className="p-5 flex-1 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-400">Filename</label>
                <input className="w-full text-sm font-mono text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1.5 focus:border-primary focus:ring-0" type="text" defaultValue="project_dashboard_v2" readOnly />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Size</label>
                  <div className="text-sm font-medium text-slate-700 dark:text-slate-300">2.4 MB</div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Type</label>
                  <div className="text-sm font-medium text-slate-700 dark:text-slate-300">JSON Config</div>
                </div>
              </div>
              <div className="space-y-1 pt-2">
                <label className="text-[10px] uppercase font-bold text-slate-400">Owner</label>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-energy text-[#0d121b] flex items-center justify-center text-[10px] font-bold">JD</div>
                  <span className="text-sm text-slate-700 dark:text-slate-300">Jane Doe</span>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden flex flex-col h-full shadow-sm hover:shadow-md transition-shadow">
            <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-slate-500">Component Props</span>
              <span className="material-symbols-outlined text-slate-400 text-sm">data_object</span>
            </div>
            <div className="p-5 flex-1 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Visible</label>
                  <div className="w-8 h-4 bg-primary rounded-full relative cursor-pointer">
                    <div className="absolute right-1 top-0.5 w-3 h-3 bg-white rounded-full"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Locked</label>
                  <div className="w-8 h-4 bg-slate-200 dark:bg-slate-700 rounded-full relative cursor-pointer">
                    <div className="absolute left-1 top-0.5 w-3 h-3 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>
              <div className="h-px bg-slate-100 dark:bg-slate-800"></div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-400">Opacity</label>
                <div className="flex items-center gap-3">
                  <input className="w-full h-1 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary" type="range" defaultValue="85" />
                  <span className="text-xs font-mono text-slate-500 w-8 text-right">85%</span>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-400">Tags</label>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-0.5 bg-blue-50 text-primary text-[10px] font-bold rounded border border-blue-100">UI</span>
                  <span className="px-2 py-0.5 bg-yellow-50 text-yellow-700 text-[10px] font-bold rounded border border-yellow-100">WIP</span>
                  <button className="w-5 h-5 flex items-center justify-center rounded border border-dashed border-slate-300 hover:border-slate-400 text-slate-400 hover:text-slate-600 transition-colors">
                    <span className="material-symbols-outlined text-[12px]">add</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-[#0d121b] border border-slate-800 rounded-xl overflow-hidden flex flex-col h-full shadow-lg">
            <div className="px-4 py-3 border-b border-slate-800 bg-[#0d121b] flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-slate-400">Raw Attributes (JSON)</span>
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
            </div>
            <div className="p-5 flex-1 font-mono text-xs overflow-auto">
              <div className="text-slate-500">// User config override</div>
              <div className="text-purple-400 mt-2">{'{'}</div>
              <div className="pl-4">
                <span className="text-blue-400">"id"</span>: <span className="text-energy">"usr_8829"</span>,
              </div>
              <div className="pl-4">
                <span className="text-blue-400">"role"</span>: <span className="text-green-400">"admin"</span>,
              </div>
              <div className="pl-4">
                <span className="text-blue-400">"beta_access"</span>: <span className="text-red-400">true</span>,
              </div>
              <div className="pl-4">
                <span className="text-blue-400">"modules"</span>: [
              </div>
              <div className="pl-8">
                <span className="text-green-400">"layout_engine"</span>,
              </div>
              <div className="pl-8">
                <span className="text-green-400">"ai_copilot"</span>
              </div>
              <div className="pl-4">
                ]
              </div>
              <div className="text-purple-400">{'}'}</div>
            </div>
            <div className="px-4 py-2 bg-slate-900 border-t border-slate-800 flex justify-between items-center text-[10px] text-slate-500">
              <span>Ln 12, Col 4</span>
              <span>JSON</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
