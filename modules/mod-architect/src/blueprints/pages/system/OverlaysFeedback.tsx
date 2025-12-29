import React from 'react';
import { EmptyState } from '../components/functional/EmptyState/index';

export const OverlaysFeedback: React.FC = () => {
  return (
    <div className="max-w-[1200px] mx-auto p-6 md:p-12 pb-24">
      <div className="mb-12">
        <div className="flex flex-col gap-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 w-fit">
            <span className="material-symbols-outlined text-purple-600 dark:text-purple-400 text-sm">auto_awesome</span>
            <span className="text-purple-700 dark:text-purple-300 text-xs font-bold uppercase tracking-wide">AI Component Generation</span>
          </div>
          <h1 className="text-[#0d121b] dark:text-white text-4xl md:text-5xl font-black leading-tight tracking-[-0.033em]">Overlays & Feedback</h1>
          <p className="text-[#4c669a] dark:text-slate-400 text-lg max-w-2xl">
            Key interaction patterns for non-intrusive contextual information and empty states. Designed to maintain flow and clarity across the loop.dev ecosystem.
          </p>
        </div>
      </div>

      <section className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-[#0d121b] dark:text-white text-2xl font-bold tracking-[-0.015em]">Drawers / Off-canvas</h2>
            <p className="text-slate-500 text-sm mt-1">Use for secondary actions, details, or forms without leaving the current context.</p>
          </div>
          <div className="flex gap-2">
            <span className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs font-mono border border-slate-200 dark:border-slate-700">Right-aligned</span>
            <span className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs font-mono border border-slate-200 dark:border-slate-700">Overlay</span>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-slate-100 dark:bg-[#0b0f17] rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden relative h-[420px] shadow-inner flex items-center justify-center">
            <div className="absolute inset-0 opacity-50 pointer-events-none p-8 flex flex-col gap-4 blur-[2px]">
              <div className="w-full h-8 bg-slate-200 dark:bg-slate-800 rounded"></div>
              <div className="w-2/3 h-8 bg-slate-200 dark:bg-slate-800 rounded"></div>
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded"></div>
                <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded"></div>
                <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded"></div>
              </div>
            </div>
            <div className="absolute top-4 bottom-4 right-4 w-[340px] bg-white dark:bg-surface-dark rounded-lg shadow-2xl border border-slate-200 dark:border-slate-700 flex flex-col z-10 animate-fade-in-right">
              <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
                <h3 className="font-bold text-[#0d121b] dark:text-white text-sm">Edit Configuration</h3>
                <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                  <span className="material-symbols-outlined text-lg">close</span>
                </button>
              </div>
              <div className="p-5 flex-1 overflow-y-auto flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Project Name</label>
                  <input className="w-full text-sm rounded bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:ring-primary focus:border-primary text-[#0d121b] dark:text-white" type="text" defaultValue="Alpha Stream Protocol"/>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Environment</label>
                  <select className="w-full text-sm rounded bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:ring-primary focus:border-primary text-[#0d121b] dark:text-white">
                    <option>Production (US-East)</option>
                    <option>Staging</option>
                  </select>
                </div>
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 rounded flex gap-3">
                  <span className="material-symbols-outlined text-primary text-sm mt-0.5">info</span>
                  <p className="text-xs text-blue-800 dark:text-blue-300 leading-relaxed">Changes to production environments require 2FA verification.</p>
                </div>
              </div>
              <div className="p-4 border-t border-slate-100 dark:border-slate-700 flex justify-end gap-3 bg-slate-50/50 dark:bg-slate-800/30">
                <button className="px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition">Cancel</button>
                <button className="px-3 py-2 text-xs font-bold text-white bg-primary hover:bg-blue-600 rounded shadow-md shadow-blue-500/20 transition">Save Changes</button>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="bg-white dark:bg-surface-dark border border-slate-100 dark:border-slate-700 rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-[#0d121b] dark:text-white mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">straighten</span>
                Anatomy & Spacing
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-sm">
                  <div className="w-6 h-6 rounded bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center font-mono text-xs font-bold mt-0.5">1</div>
                  <div className="flex-1">
                    <strong className="block text-[#0d121b] dark:text-white">Backdrop Overlay</strong>
                    <span className="text-slate-500">Color: <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded">slate-900</code>, Opacity: 40%. Blurs content slightly to focus attention.</span>
                  </div>
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <div className="w-6 h-6 rounded bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center font-mono text-xs font-bold mt-0.5">2</div>
                  <div className="flex-1">
                    <strong className="block text-[#0d121b] dark:text-white">Panel Container</strong>
                    <span className="text-slate-500">Fixed width (e.g., 400px, 600px). Full height minus margins on mobile. Background: <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded">surface-base</code>.</span>
                  </div>
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <div className="w-6 h-6 rounded bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center font-mono text-xs font-bold mt-0.5">3</div>
                  <div className="flex-1">
                    <strong className="block text-[#0d121b] dark:text-white">Action Areas</strong>
                    <span className="text-slate-500">Sticky header and footer areas ensure actions are always accessible regardless of scroll position.</span>
                  </div>
                </li>
              </ul>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30 rounded-xl p-5 flex gap-4">
              <span className="material-symbols-outlined text-primary">lightbulb</span>
              <div className="text-sm">
                <strong className="block text-[#0d121b] dark:text-white mb-1">AI Recommendation</strong>
                <p className="text-blue-800 dark:text-blue-300">
                  When a drawer contains a complex form, the AI assistant suggests autosave capabilities to prevent data loss if the user accidentally dismisses the overlay.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-[#0d121b] dark:text-white text-2xl font-bold tracking-[-0.015em]">Empty States</h2>
            <p className="text-slate-500 text-sm mt-1">Provide guidance and clear next steps when no content is available.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Example 1: No Data */}
          <EmptyState 
            icon="folder_off"
            title="No Projects Found"
            description="You haven't created any projects yet. Start by creating your first one."
            action={
              <button className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition">
                Create Project
              </button>
            }
            className="h-80"
          />

          {/* Example 2: Search No Results */}
          <EmptyState 
            icon="search"
            title='No Results for "Quantum"'
            description="We couldn't find any tokens matching your search. Try different keywords."
            iconBadge="?"
            action={
              <button className="text-primary text-sm font-bold hover:underline">Clear Filters</button>
            }
            className="h-80"
          />

          {/* Example 3: Generating (Custom - kept as unique variation) */}
          <div className="bg-white dark:bg-surface-dark border border-slate-100 dark:border-slate-700 rounded-xl p-8 flex flex-col items-center justify-center text-center h-80 group hover:border-primary/30 transition-colors overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/5 to-blue-500/5"></div>
            <div className="w-16 h-16 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-full flex items-center justify-center mb-4 relative z-10">
              <span className="material-symbols-outlined text-3xl text-purple-500 animate-pulse">auto_awesome</span>
            </div>
            <h3 className="text-[#0d121b] dark:text-white font-bold mb-2 relative z-10">Generating Layout</h3>
            <p className="text-slate-500 text-sm max-w-[220px] mb-6 relative z-10">AI is analyzing your components to build the optimal structure...</p>
            <div className="w-32 h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden relative z-10">
              <div className="h-full bg-gradient-to-r from-primary to-purple-500 w-1/2 animate-[shimmer_1.5s_infinite_linear] rounded-full"></div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row gap-4 md:items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500">
              <span className="material-symbols-outlined text-lg">code</span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#0d121b] dark:text-white">Implementation Note</h4>
              <p className="text-xs text-slate-500">Empty states should always be vertically centered within their container.</p>
            </div>
          </div>
          <div className="flex gap-2">
            <span className="text-xs font-mono bg-white dark:bg-slate-800 px-2 py-1 rounded border border-slate-200 dark:border-slate-700 text-slate-500">component: EmptyState</span>
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[#0d121b] dark:text-white text-2xl font-bold tracking-[-0.015em]">React Usage</h2>
        </div>
        <div className="bg-[#1e293b] rounded-xl overflow-hidden shadow-2xl">
          <div className="flex items-center justify-between px-4 py-3 bg-[#0f172a] border-b border-slate-700">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <span className="text-xs font-mono text-slate-400">Drawer.tsx</span>
            <button className="text-slate-400 hover:text-white transition-colors">
              <span className="material-symbols-outlined text-sm">content_copy</span>
            </button>
          </div>
          <div className="p-6 overflow-x-auto">
            <pre className="font-mono text-sm leading-relaxed text-slate-300">
              <span className="text-purple-400">import</span> {'{ Drawer, DrawerHeader, DrawerBody, DrawerFooter }'} <span className="text-purple-400">from</span> <span className="text-green-400">'@loop/ui'</span>;{'\n'}
              <span className="text-purple-400">export const</span> SettingsPanel = ({'{ isOpen, onClose }'}) =&gt; {'{'}{'\n'}
              {'  '}<span className="text-purple-400">return</span> ({'\n'}
              {'    '}&lt;<span className="text-yellow-300">Drawer</span> <span className="text-blue-400">isOpen</span>={'{isOpen}'} <span className="text-blue-400">onClose</span>={'{onClose}'} <span className="text-blue-400">position</span>=<span className="text-green-400">"right"</span>&gt;{'\n'}
              {'      '}&lt;<span className="text-yellow-300">DrawerHeader</span>&gt;{'\n'}
              {'         '}&lt;<span className="text-yellow-300">h3</span>&gt;Configuration&lt;/<span className="text-yellow-300">h3</span>&gt;{'\n'}
              {'      '}&lt;/<span className="text-yellow-300">DrawerHeader</span>&gt;{'\n'}
              {'      '}&lt;<span className="text-yellow-300">DrawerBody</span>&gt;{'\n'}
              {'         '}{'/* Form content goes here */'}{'\n'}
              {'      '}&lt;/<span className="text-yellow-300">DrawerBody</span>&gt;{'\n'}
              {'      '}&lt;<span className="text-yellow-300">DrawerFooter</span>&gt;{'\n'}
              {'         '}&lt;<span className="text-yellow-300">Button</span> <span className="text-blue-400">variant</span>=<span className="text-green-400">"primary"</span>&gt;Save&lt;/<span className="text-yellow-300">Button</span>&gt;{'\n'}
              {'      '}&lt;/<span className="text-yellow-300">DrawerFooter</span>&gt;{'\n'}
              {'    '}&lt;/<span className="text-yellow-300">Drawer</span>&gt;{'\n'}
              {'  '});{'\n'}
              {'}'};
            </pre>
          </div>
        </div>
      </section>
    </div>
  );
};