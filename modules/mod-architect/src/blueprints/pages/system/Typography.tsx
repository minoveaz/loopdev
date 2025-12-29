import React from 'react';

export const Typography: React.FC = () => {
  return (
    <div className="max-w-[1200px] mx-auto p-6 md:p-12 pb-24">
      {/* Header */}
      <div className="mb-12">
        <div className="flex flex-col gap-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 w-fit">
            <span className="material-symbols-outlined text-purple-600 dark:text-purple-400 text-sm">auto_awesome</span>
            <span className="text-purple-700 dark:text-purple-300 text-xs font-bold uppercase tracking-wide">AI Optimized Readability</span>
          </div>
          <h1 className="text-[#0d121b] dark:text-white text-4xl md:text-5xl font-black leading-tight tracking-[-0.033em]">Typography</h1>
          <p className="text-[#4c669a] dark:text-slate-400 text-lg max-w-2xl">
            The loop.dev typographic system is built for clarity and scalability. We use Inter for UI and marketing to ensure versatility, and JetBrains Mono for technical precision in our developer tools.
          </p>
        </div>
      </div>

      {/* Primary Typeface */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[#0d121b] dark:text-white text-2xl font-bold tracking-[-0.015em]">Primary Typeface</h2>
          <div className="inline-flex items-center gap-2 text-slate-500 text-sm">
            <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-xs font-mono">font-sans</span>
            <span>Inter</span>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-8 flex flex-col justify-between min-h-[300px] overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity select-none pointer-events-none">
              <span className="text-[200px] font-black leading-none">Aa</span>
            </div>
            <div>
              <span className="text-sm font-bold text-primary uppercase tracking-wider mb-2 block">Brand & UI</span>
              <h3 className="text-6xl md:text-8xl font-black text-[#0d121b] dark:text-white tracking-tight mb-4">Inter</h3>
              <p className="text-slate-500 max-w-md">Designed for computer screens, Inter features a tall x-height to aid in readability of mixed-case and lower-case text.</p>
            </div>
            <div className="mt-8 flex gap-2 overflow-hidden text-[#0d121b] dark:text-slate-200 text-2xl font-medium tracking-tight whitespace-nowrap opacity-60">
              <span>ABCDEFGHIJKLMNOPQRSTUVWXYZ</span>
              <span>abcdefghijklmnopqrstuvwxyz</span>
              <span>0123456789</span>
            </div>
          </div>
          <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-8 flex flex-col gap-6">
            <div>
              <div className="flex justify-between items-baseline mb-1">
                <span className="text-3xl text-[#0d121b] dark:text-white font-normal">Aa</span>
                <span className="text-xs text-slate-400 font-mono">Regular 400</span>
              </div>
              <p className="text-sm text-slate-500">Default for body text and long-form content.</p>
            </div>
            <div className="h-px bg-slate-100 dark:bg-slate-700"></div>
            <div>
              <div className="flex justify-between items-baseline mb-1">
                <span className="text-3xl text-[#0d121b] dark:text-white font-semibold">Aa</span>
                <span className="text-xs text-slate-400 font-mono">SemiBold 600</span>
              </div>
              <p className="text-sm text-slate-500">Used for emphasis, buttons, and subheadings.</p>
            </div>
            <div className="h-px bg-slate-100 dark:bg-slate-700"></div>
            <div>
              <div className="flex justify-between items-baseline mb-1">
                <span className="text-3xl text-[#0d121b] dark:text-white font-bold">Aa</span>
                <span className="text-xs text-slate-400 font-mono">Bold 700</span>
              </div>
              <p className="text-sm text-slate-500">Reserved for major headings and primary actions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Secondary Typeface */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[#0d121b] dark:text-white text-2xl font-bold tracking-[-0.015em]">Secondary Typeface</h2>
          <div className="inline-flex items-center gap-2 text-slate-500 text-sm">
            <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-xs font-mono">font-mono</span>
            <span>JetBrains Mono</span>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[#0d121b] rounded-xl shadow-sm border border-slate-800 p-8 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 text-white/5 font-mono text-9xl font-bold select-none pointer-events-none">
              &lt;/&gt;
            </div>
            <div>
              <span className="text-sm font-bold text-yellow-500 uppercase tracking-wider mb-2 block font-mono">Technical & Code</span>
              <h3 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4 font-mono">JetBrains Mono</h3>
              <p className="text-slate-400 font-mono text-sm max-w-sm mb-6">A typeface for developers. Its characters have increased height for better readability in code.</p>
            </div>
            <div className="grid grid-cols-4 gap-4 mt-auto">
              {['{ }', '< >', '( )', '==='].map(sym => (
                 <div key={sym} className="bg-white/10 rounded p-3 text-center">
                    <span className="block text-2xl text-white font-mono mb-1">{sym}</span>
                    <span className="text-[10px] text-slate-400 uppercase">
                        {sym === '{ }' ? 'Braces' : sym === '< >' ? 'Tags' : sym === '( )' ? 'Parens' : 'Logic'}
                    </span>
                 </div>
              ))}
            </div>
          </div>
          <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-8">
            <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-6">Usage Examples</h4>
            <div className="flex flex-col gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase">Code Snippets</label>
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 font-mono text-sm text-[#0d121b] dark:text-slate-300">
                  <span className="text-primary">const</span> loop <span className="text-purple-500">=</span> <span className="text-primary">new</span> <span className="text-yellow-600 dark:text-yellow-400">System</span>();
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase">Technical Data</label>
                <div className="flex items-center justify-between p-3 rounded border border-slate-100 dark:border-slate-700">
                  <span className="text-sm font-medium">API Latency</span>
                  <span className="font-mono text-sm font-bold text-primary">24ms</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded border border-slate-100 dark:border-slate-700">
                  <span className="text-sm font-medium">Build ID</span>
                  <span className="font-mono text-sm text-slate-500">#8f3a2c1</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Typographic Hierarchy */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[#0d121b] dark:text-white text-2xl font-bold tracking-[-0.015em]">Typographic Hierarchy</h2>
        </div>
        <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-700 text-xs uppercase text-slate-500 font-semibold">
                <tr>
                  <th className="px-8 py-4 w-1/3">Scale & Preview</th>
                  <th className="px-8 py-4">Specs</th>
                  <th className="px-8 py-4">Usage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-8 py-6">
                    <span className="text-4xl md:text-5xl font-black text-[#0d121b] dark:text-white tracking-tight">Display H1</span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-1 text-xs font-mono text-slate-500">
                      <span>Size: 3rem (48px)</span>
                      <span>Weight: Black (900)</span>
                      <span>Line-height: 1.1</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-sm text-slate-600 dark:text-slate-300">Page titles, Hero sections.</td>
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-8 py-6">
                    <span className="text-3xl font-bold text-[#0d121b] dark:text-white tracking-tight">Heading H2</span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-1 text-xs font-mono text-slate-500">
                      <span>Size: 2.25rem (36px)</span>
                      <span>Weight: Bold (700)</span>
                      <span>Line-height: 1.2</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-sm text-slate-600 dark:text-slate-300">Section titles, Major divisions.</td>
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-8 py-6">
                    <span className="text-xl font-bold text-[#0d121b] dark:text-white">Heading H3</span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-1 text-xs font-mono text-slate-500">
                      <span>Size: 1.5rem (24px)</span>
                      <span>Weight: Bold (700)</span>
                      <span>Line-height: 1.4</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-sm text-slate-600 dark:text-slate-300">Card titles, Subsection headers.</td>
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-8 py-6">
                    <p className="text-base text-[#0d121b] dark:text-white leading-relaxed max-w-sm">
                      Body text should be legible and comfortable to read. This is the default style for paragraphs and general content.
                    </p>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-1 text-xs font-mono text-slate-500">
                      <span>Size: 1rem (16px)</span>
                      <span>Weight: Regular (400)</span>
                      <span>Line-height: 1.6</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-sm text-slate-600 dark:text-slate-300">Standard content, Articles.</td>
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-8 py-6">
                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Caption / Label</span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-1 text-xs font-mono text-slate-500">
                      <span>Size: 0.75rem (12px)</span>
                      <span>Weight: Medium (500)</span>
                      <span>Letter-spacing: 0.05em</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-sm text-slate-600 dark:text-slate-300">Form labels, Metadata, Tooltips.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};