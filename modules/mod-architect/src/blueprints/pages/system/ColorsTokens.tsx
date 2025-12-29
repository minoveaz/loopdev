import React from 'react';

export const ColorsTokens: React.FC = () => {
  return (
    <div className="max-w-[1200px] mx-auto p-6 md:p-12 pb-24">
      {/* Header */}
      <div className="mb-12">
        <div className="flex flex-col gap-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 w-fit">
            <span className="material-symbols-outlined text-purple-600 dark:text-purple-400 text-sm">auto_awesome</span>
            <span className="text-purple-700 dark:text-purple-300 text-xs font-bold uppercase tracking-wide">AI Generated Palette</span>
          </div>
          <h1 className="text-[#0d121b] dark:text-white text-4xl md:text-5xl font-black leading-tight tracking-[-0.033em]">Colors & Tokens</h1>
          <p className="text-[#4c669a] dark:text-slate-400 text-lg max-w-2xl">
            Our accessible color system is powered by generative AI, designed for scalability and clarity.
            Use these tokens to maintain consistency across the entire loop.dev ecosystem.
          </p>
        </div>
      </div>

      {/* Primitive Palette */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[#0d121b] dark:text-white text-2xl font-bold tracking-[-0.015em]">Primitive Palette</h2>
          <button className="text-primary text-sm font-medium hover:underline">View in Figma</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Blue */}
          <div className="flex flex-col bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden group">
            <div className="h-48 w-full bg-[#135bec] relative group-hover:scale-105 transition-transform duration-500">
              <div className="absolute bottom-3 right-3 bg-white/20 backdrop-blur-md text-white px-2 py-1 rounded text-xs font-mono">Brand Core</div>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-[#0d121b] dark:text-white text-lg font-bold">Primary Blue</h3>
                <span className="px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-bold">AA Large</span>
              </div>
              <div className="flex flex-col gap-3 font-mono text-sm text-[#4c669a] dark:text-slate-400">
                <div className="flex justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
                  <span>HEX</span>
                  <span className="text-[#0d121b] dark:text-slate-200 select-all">#135bec</span>
                </div>
                <div className="flex justify-between">
                  <span>RGB</span>
                  <span className="text-[#0d121b] dark:text-slate-200 select-all">19, 91, 236</span>
                </div>
              </div>
            </div>
          </div>
          {/* Yellow */}
          <div className="flex flex-col bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden group">
            <div className="h-48 w-full bg-[#FFD700] relative group-hover:scale-105 transition-transform duration-500">
              <div className="absolute bottom-3 right-3 bg-black/10 backdrop-blur-md text-black px-2 py-1 rounded text-xs font-mono">Accent & AI</div>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-[#0d121b] dark:text-white text-lg font-bold">Energy Yellow</h3>
                <span className="px-2 py-1 rounded bg-red-100 text-red-700 text-xs font-bold">Text Caution</span>
              </div>
              <div className="flex flex-col gap-3 font-mono text-sm text-[#4c669a] dark:text-slate-400">
                <div className="flex justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
                  <span>HEX</span>
                  <span className="text-[#0d121b] dark:text-slate-200 select-all">#FFD700</span>
                </div>
                <div className="flex justify-between">
                  <span>RGB</span>
                  <span className="text-[#0d121b] dark:text-slate-200 select-all">255, 215, 0</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Neutral Scale */}
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Neutral Scale</h3>
          <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
            {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map(step => (
              <div key={step} className="flex flex-col gap-1">
                <div className={`h-12 w-full rounded bg-slate-${step} ${step === 50 ? 'border border-slate-200' : ''}`} style={{ backgroundColor: step === 50 ? '#f8fafc' : undefined }}></div>
                <span className="text-[10px] text-center font-mono text-slate-400">{step}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Semantic Tokens */}
      <section className="mb-16">
        <div className="mb-6">
          <h2 className="text-[#0d121b] dark:text-white text-2xl font-bold tracking-[-0.015em] mb-2">Semantic Tokens</h2>
          <p className="text-[#4c669a] dark:text-slate-400">Tokens bridge the gap between primitive color values and their context of use. Always use tokens in production.</p>
        </div>
        <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-700 text-xs uppercase text-slate-500 font-semibold">
                <tr>
                  <th className="px-6 py-4">Token Name</th>
                  <th className="px-6 py-4">Role & Description</th>
                  <th className="px-6 py-4">Value (Primitive)</th>
                  <th className="px-6 py-4">Preview</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 font-mono text-primary font-medium">color-bg-primary</td>
                  <td className="px-6 py-4 text-[#0d121b] dark:text-slate-200">
                    <div className="font-medium">Primary Background</div>
                    <div className="text-slate-400 text-xs mt-1">Main actions, active states.</div>
                  </td>
                  <td className="px-6 py-4 font-mono text-slate-500">#135bec</td>
                  <td className="px-6 py-4">
                    <div className="w-12 h-8 rounded bg-[#135bec] shadow-sm"></div>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 font-mono text-purple-600 dark:text-purple-400 font-medium">color-accent-energy</td>
                  <td className="px-6 py-4 text-[#0d121b] dark:text-slate-200">
                    <div className="font-medium">Energy Accent</div>
                    <div className="text-slate-400 text-xs mt-1">AI features, highlights, warnings.</div>
                  </td>
                  <td className="px-6 py-4 font-mono text-slate-500">#FFD700</td>
                  <td className="px-6 py-4">
                    <div className="w-12 h-8 rounded bg-[#FFD700] shadow-sm"></div>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 font-mono text-slate-600 dark:text-slate-400 font-medium">color-surface-base</td>
                  <td className="px-6 py-4 text-[#0d121b] dark:text-slate-200">
                    <div className="font-medium">Surface Base</div>
                    <div className="text-slate-400 text-xs mt-1">Default background for cards/sections.</div>
                  </td>
                  <td className="px-6 py-4 font-mono text-slate-500">#FFFFFF / #1E293B</td>
                  <td className="px-6 py-4">
                    <div className="w-12 h-8 rounded border border-slate-200 bg-white dark:bg-surface-dark shadow-sm"></div>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 font-mono text-slate-600 dark:text-slate-400 font-medium">color-text-primary</td>
                  <td className="px-6 py-4 text-[#0d121b] dark:text-slate-200">
                    <div className="font-medium">Primary Text</div>
                    <div className="text-slate-400 text-xs mt-1">Headings, body text.</div>
                  </td>
                  <td className="px-6 py-4 font-mono text-slate-500">#0D121B / #F8FAFC</td>
                  <td className="px-6 py-4">
                    <div className="w-12 h-8 rounded bg-[#0d121b] dark:bg-slate-50 shadow-sm"></div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Live Application & Accessibility */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        <div className="flex flex-col gap-6">
          <h2 className="text-[#0d121b] dark:text-white text-2xl font-bold tracking-[-0.015em]">Live Application</h2>
          <div className="bg-white dark:bg-surface-dark border border-slate-100 dark:border-slate-700 rounded-xl p-8 shadow-lg">
             <div className="flex flex-col gap-6">
                <div className="flex justify-between items-center">
                    <div className="flex flex-col">
                        <h4 className="text-lg font-bold text-[#0d121b] dark:text-white">System Status</h4>
                        <p className="text-sm text-[#4c669a]">Real-time metrics</p>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#135bec]/10 px-2 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-primary/20">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse"></span>
                        Operational
                    </span>
                </div>
                <div className="flex gap-4">
                    <div className="flex-1 rounded-lg bg-slate-50 dark:bg-slate-800 p-4 border border-slate-100 dark:border-slate-700">
                        <div className="text-xs text-slate-500 uppercase font-semibold mb-1">Uptime</div>
                        <div className="text-2xl font-black text-[#0d121b] dark:text-white">99.9%</div>
                    </div>
                    <div className="flex-1 rounded-lg bg-slate-50 dark:bg-slate-800 p-4 border border-slate-100 dark:border-slate-700">
                        <div className="text-xs text-slate-500 uppercase font-semibold mb-1">Response</div>
                        <div className="text-2xl font-black text-[#0d121b] dark:text-white">24ms</div>
                    </div>
                </div>
                <div className="p-4 rounded-lg bg-[#FFD700]/10 border border-[#FFD700]/30 flex gap-3 items-start">
                    <span className="material-symbols-outlined text-[#b39700] dark:text-[#ffd700] text-xl">smart_toy</span>
                    <div className="flex flex-col gap-1">
                        <span className="text-sm font-bold text-[#4a3f00] dark:text-[#ffd700]">AI Optimization Active</span>
                        <p className="text-xs text-[#665c00] dark:text-[#e6c200]">System resources are being dynamically allocated.</p>
                    </div>
                </div>
                <button className="w-full bg-primary hover:bg-blue-700 text-white font-medium py-3 rounded-lg shadow-md shadow-blue-500/20 transition-all active:scale-[0.98]">
                    Run Diagnostics
                </button>
             </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
            <h2 className="text-[#0d121b] dark:text-white text-2xl font-bold tracking-[-0.015em]">Accessibility Usage</h2>
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4 p-4 rounded-lg bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800/30">
                    <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-800 flex items-center justify-center flex-shrink-0">
                        <span className="material-symbols-outlined text-green-600 dark:text-green-300">check</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-green-800 dark:text-green-300 text-sm">Do: High Contrast</span>
                        <p className="text-green-700 dark:text-green-400 text-xs">Use slate-600 or darker for text on white backgrounds. Minimum 4.5:1 ratio.</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-lg bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/30">
                    <div className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-800 flex items-center justify-center flex-shrink-0">
                        <span className="material-symbols-outlined text-red-600 dark:text-red-300">close</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-red-800 dark:text-red-300 text-sm">Don't: Yellow Text on White</span>
                        <p className="text-red-700 dark:text-red-400 text-xs">Never use Energy Yellow for body text on light backgrounds. It fails WCAG standards.</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-lg bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/30">
                    <div className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-800 flex items-center justify-center flex-shrink-0">
                        <span className="material-symbols-outlined text-red-600 dark:text-red-300">close</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-red-800 dark:text-red-300 text-sm">Don't: Primary on Dark</span>
                        <p className="text-red-700 dark:text-red-400 text-xs">Avoid using pure Primary Blue on dark gray backgrounds without checking contrast (usually too low).</p>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Implementation */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[#0d121b] dark:text-white text-2xl font-bold tracking-[-0.015em]">Implementation</h2>
        </div>
        <div className="bg-[#1e293b] rounded-xl overflow-hidden shadow-2xl">
          <div className="flex items-center justify-between px-4 py-3 bg-[#0f172a] border-b border-slate-700">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <span className="text-xs font-mono text-slate-400">tailwind.config.js</span>
            <button className="text-slate-400 hover:text-white transition-colors">
              <span className="material-symbols-outlined text-sm">content_copy</span>
            </button>
          </div>
          <div className="p-6 overflow-x-auto">
            <pre className="font-mono text-sm leading-relaxed text-slate-300">
              <span className="text-purple-400">module</span>.<span className="text-blue-400">exports</span> = {'{'}{'\n'}
              {'  '}<span className="text-blue-400">theme</span>: {'{'}{'\n'}
              {'    '}<span className="text-blue-400">extend</span>: {'{'}{'\n'}
              {'      '}<span className="text-blue-400">colors</span>: {'{'}{'\n'}
              {'        '}<span className="text-green-400">'primary'</span>: <span className="text-yellow-300">'#135bec'</span>,{'\n'}
              {'        '}<span className="text-green-400">'energy'</span>: <span className="text-yellow-300">'#FFD700'</span>,{'\n'}
              {'        '}<span className="text-green-400">'surface'</span>: {'{'}{'\n'}
              {'           '}<span className="text-green-400">'base'</span>: <span className="text-yellow-300">'#ffffff'</span>,{'\n'}
              {'           '}<span className="text-green-400">'dark'</span>: <span className="text-yellow-300">'#1e293b'</span>,{'\n'}
              {'        '}{'}'}{'\n'}
              {'      '}{'}'}{'\n'}
              {'    '}{'}'}{'\n'}
              {'  '}{'}'}{'\n'}
              {'}'}
            </pre>
          </div>
        </div>
      </section>
    </div>
  );
};