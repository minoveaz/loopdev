import React from 'react';

export const ManagementEditing: React.FC = () => {
  return (
    <div className="max-w-[1200px] mx-auto p-6 md:p-12 pb-24">
      <div className="mb-12">
        <div className="flex flex-col gap-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 w-fit border border-blue-100 dark:border-blue-800/30">
            <span className="material-symbols-outlined text-primary text-sm">construction</span>
            <span className="text-primary text-xs font-bold uppercase tracking-wide">Core Components</span>
          </div>
          <h1 className="text-[#0d121b] dark:text-white text-4xl md:text-5xl font-black leading-tight tracking-[-0.033em]">Management & Editing</h1>
          <p className="text-[#4c669a] dark:text-slate-400 text-lg max-w-3xl">
            Standardized interfaces for content creation and data management. 
            These components ensure consistent user experience when handling rich text entry and complex item selection workflows across the loop.dev ecosystem.
          </p>
        </div>
      </div>

      <section className="mb-20">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-[#0d121b] dark:text-white text-2xl font-bold tracking-[-0.015em]">Rich Text Editor</h2>
            <p className="text-sm text-slate-500 mt-1">Full-featured WYSIWYG editor with brand-compliant typography styles.</p>
          </div>
          <div className="flex gap-2">
            <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs font-mono rounded">v2.4.0</span>
          </div>
        </div>
        <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col h-[500px]">
          <div className="flex items-center flex-wrap gap-1 p-2 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#161e2c]">
            <div className="flex items-center gap-0.5 border-r border-slate-200 dark:border-slate-700 pr-2 mr-1">
              <button className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors">
                <span className="material-symbols-outlined text-[20px]">undo</span>
              </button>
              <button className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors" disabled>
                <span className="material-symbols-outlined text-[20px] opacity-50">redo</span>
              </button>
            </div>
            <div className="flex items-center mr-1">
              <button className="flex items-center gap-2 px-2 py-1.5 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-sm font-medium transition-colors">
                <span>Heading 2</span>
                <span className="material-symbols-outlined text-[16px]">arrow_drop_down</span>
              </button>
            </div>
            <div className="w-px h-5 bg-slate-300 dark:bg-slate-700 mx-1"></div>
            <button className="p-1.5 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors">
              <span className="material-symbols-outlined text-[20px]">format_bold</span>
            </button>
            <button className="p-1.5 bg-primary/10 text-primary rounded transition-colors">
              <span className="material-symbols-outlined text-[20px]">format_italic</span>
            </button>
            <button className="p-1.5 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors">
              <span className="material-symbols-outlined text-[20px]">format_underlined</span>
            </button>
            <button className="p-1.5 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors">
              <span className="material-symbols-outlined text-[20px]">strikethrough_s</span>
            </button>
            <div className="w-px h-5 bg-slate-300 dark:bg-slate-700 mx-1"></div>
            <button className="p-1.5 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors">
              <span className="material-symbols-outlined text-[20px]">format_list_bulleted</span>
            </button>
            <button className="p-1.5 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors">
              <span className="material-symbols-outlined text-[20px]">format_list_numbered</span>
            </button>
            <div className="w-px h-5 bg-slate-300 dark:bg-slate-700 mx-1"></div>
            <button className="p-1.5 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors">
              <span className="material-symbols-outlined text-[20px]">link</span>
            </button>
            <button className="p-1.5 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors">
              <span className="material-symbols-outlined text-[20px]">image</span>
            </button>
            <button className="ml-auto flex items-center gap-1.5 px-3 py-1.5 bg-energy/10 hover:bg-energy/20 text-[#856404] dark:text-[#ffd700] rounded text-xs font-bold transition-colors border border-energy/30">
              <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
              AI Improve
            </button>
          </div>
          <div className="p-8 flex-1 overflow-y-auto">
            <div className="max-w-3xl mx-auto prose prose-slate dark:prose-invert">
              <h2 className="text-3xl font-bold text-[#0d121b] dark:text-white mb-4">Scalable Systems Architecture</h2>
              <p className="text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
                At loop.dev, we prioritize modularity. A <span className="italic text-primary font-medium">well-designed system</span> acts as a multiplier for productivity, allowing teams to ship faster with higher confidence.
              </p>
              <ul className="list-disc pl-5 space-y-2 mb-6 text-slate-600 dark:text-slate-300">
                <li>Atomic design principles applied to code</li>
                <li>Consistent token usage across platforms</li>
                <li>Automated accessibility checks</li>
              </ul>
              <p className="text-slate-600 dark:text-slate-300 mb-4">
                For more information on our visual language, refer to the <a className="text-primary hover:underline font-medium" href="#">Core Tokens documentation</a>.
              </p>
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border-l-4 border-energy my-6">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200 m-0">
                  <span className="font-bold text-[#b39700] dark:text-[#ffd700]">Note:</span> All components must pass WCAG 2.1 AA standards before deployment.
                </p>
              </div>
            </div>
          </div>
          <div className="px-4 py-2 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-dark text-xs text-slate-400 flex justify-between items-center">
            <div className="flex gap-4">
              <span>p</span>
              <span>words: 84</span>
              <span>chars: 512</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              <span>Saved</span>
            </div>
          </div>
        </div>
      </section>
      
      <section className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-[#0d121b] dark:text-white text-2xl font-bold tracking-[-0.015em]">Transfer List</h2>
            <p className="text-sm text-slate-500 mt-1">Dual-list interface for moving items between 'Available' and 'Selected' states.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex flex-col md:flex-row items-center gap-4 h-[400px]">
              <div className="flex-1 w-full h-full flex flex-col border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-slate-50 dark:bg-[#161e2c]">
                <div className="p-3 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-dark flex justify-between items-center">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Available</span>
                  <span className="text-xs bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded text-slate-500">4</span>
                </div>
                <div className="p-2 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-dark">
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-2 top-1.5 text-slate-400 text-sm">search</span>
                    <input className="w-full pl-8 pr-2 py-1 text-sm bg-slate-50 dark:bg-slate-800 border-none rounded focus:ring-1 focus:ring-primary text-slate-700 dark:text-slate-300 placeholder-slate-400" placeholder="Search items..." type="text" />
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                  <div className="flex items-center gap-3 p-2 rounded hover:bg-white dark:hover:bg-slate-800 cursor-pointer transition-colors group">
                    <div className="w-4 h-4 border border-slate-300 dark:border-slate-600 rounded flex items-center justify-center group-hover:border-primary"></div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Analytics Dashboard</span>
                      <span className="text-[10px] text-slate-400">View</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-2 rounded bg-primary/5 cursor-pointer transition-colors border border-primary/20">
                    <div className="w-4 h-4 bg-primary border border-primary rounded flex items-center justify-center text-white">
                      <span className="material-symbols-outlined text-[10px]">check</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-slate-900 dark:text-white">User Management</span>
                      <span className="text-[10px] text-slate-500">Admin</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-2 rounded hover:bg-white dark:hover:bg-slate-800 cursor-pointer transition-colors group">
                    <div className="w-4 h-4 border border-slate-300 dark:border-slate-600 rounded flex items-center justify-center group-hover:border-primary"></div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Payment Gateway</span>
                      <span className="text-[10px] text-slate-400">Integration</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-2 rounded hover:bg-white dark:hover:bg-slate-800 cursor-pointer transition-colors group">
                    <div className="w-4 h-4 border border-slate-300 dark:border-slate-600 rounded flex items-center justify-center group-hover:border-primary"></div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Email Service</span>
                      <span className="text-[10px] text-slate-400">Communication</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex md:flex-col gap-2 justify-center">
                <button className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-primary hover:border-primary transition-all shadow-sm">
                  <span className="material-symbols-outlined text-xl">chevron_right</span>
                </button>
                <button className="p-2 rounded-lg bg-primary text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-all transform active:scale-95">
                  <span className="material-symbols-outlined text-xl">chevron_left</span>
                </button>
                <button className="hidden md:flex p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-primary hover:border-primary transition-all shadow-sm mt-4">
                  <span className="material-symbols-outlined text-xl">keyboard_double_arrow_right</span>
                </button>
                <button className="hidden md:flex p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-primary hover:border-primary transition-all shadow-sm">
                  <span className="material-symbols-outlined text-xl">keyboard_double_arrow_left</span>
                </button>
              </div>
              <div className="flex-1 w-full h-full flex flex-col border border-primary/30 rounded-lg overflow-hidden bg-primary/[0.02]">
                <div className="p-3 border-b border-primary/20 bg-primary/5 flex justify-between items-center">
                  <span className="text-xs font-bold uppercase tracking-wider text-primary">Selected</span>
                  <span className="text-xs bg-white dark:bg-slate-800 text-primary font-bold px-2 py-0.5 rounded shadow-sm border border-primary/10">2</span>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                  <div className="flex items-center gap-3 p-2 rounded bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 cursor-pointer group hover:border-primary/50 transition-colors">
                    <div className="w-8 h-8 rounded bg-blue-100 dark:bg-blue-900/30 text-primary flex items-center justify-center">
                      <span className="material-symbols-outlined text-sm">database</span>
                    </div>
                    <div className="flex flex-col flex-1">
                      <span className="text-sm font-bold text-slate-800 dark:text-white">Database Core</span>
                      <span className="text-[10px] text-slate-500">Storage</span>
                    </div>
                    <button className="text-slate-300 hover:text-red-500 transition-colors">
                      <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                  </div>
                  <div className="flex items-center gap-3 p-2 rounded bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 cursor-pointer group hover:border-primary/50 transition-colors">
                    <div className="w-8 h-8 rounded bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                      <span className="material-symbols-outlined text-sm">api</span>
                    </div>
                    <div className="flex flex-col flex-1">
                      <span className="text-sm font-bold text-slate-800 dark:text-white">API Gateway</span>
                      <span className="text-[10px] text-slate-500">Connectivity</span>
                    </div>
                    <button className="text-slate-300 hover:text-red-500 transition-colors">
                      <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                  </div>
                </div>
                <div className="p-2 border-t border-primary/20 bg-primary/5 flex justify-end">
                  <button className="text-xs font-bold text-primary hover:text-blue-700 transition-colors uppercase tracking-wide">Clear All</button>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-bold text-[#0d121b] dark:text-white">Usage Guidelines</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Best practices for implementing management components.</p>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                <span className="material-symbols-outlined text-primary mt-0.5">ads_click</span>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-white">Interactive States</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">Ensure all clickable items (list rows, buttons) have distinct hover and active states using <code className="bg-slate-200 dark:bg-slate-700 px-1 rounded text-slate-700 dark:text-slate-200">bg-primary/5</code> for backgrounds.</p>
                </div>
              </div>
              <div className="flex gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                <span className="material-symbols-outlined text-energy mt-0.5">warning</span>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-white">Empty States</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">Always provide a clear empty state message when a list has no items. Do not leave the container completely blank.</p>
                </div>
              </div>
              <div className="flex gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                <span className="material-symbols-outlined text-slate-500 mt-0.5">keyboard</span>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-white">Keyboard Navigation</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">Transfer lists must support arrow key navigation to move selection and Enter/Space to transfer items.</p>
                </div>
              </div>
            </div>
            <div className="mt-auto bg-[#1e293b] rounded-xl overflow-hidden shadow-lg border border-slate-700">
              <div className="flex items-center justify-between px-4 py-2 bg-[#0f172a] border-b border-slate-700">
                <span className="text-xs font-mono text-slate-400">TransferList.tsx</span>
                <span className="material-symbols-outlined text-xs text-slate-500">code</span>
              </div>
              <div className="p-4 overflow-x-auto">
                <pre className="font-mono text-[10px] leading-relaxed text-slate-300">
&lt;<span className="text-blue-400">TransferList</span>
  <span className="text-purple-400">leftTitle</span>=<span className="text-green-400">"Available"</span>
  <span className="text-purple-400">rightTitle</span>=<span className="text-green-400">"Selected"</span>
  <span className="text-purple-400">items</span>={'{items}'}
  <span className="text-purple-400">onChange</span>={'{setItems}'}
  <span className="text-purple-400">color</span>=<span className="text-green-400">"primary"</span>
/&gt;
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
