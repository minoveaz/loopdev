import React from 'react';

export const DesignPrinciples: React.FC = () => {
  return (
    <div className="max-w-[1200px] mx-auto p-6 md:p-12 pb-24">
      <div className="mb-16">
        <div className="flex flex-col gap-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 w-fit">
            <span className="material-symbols-outlined text-purple-600 dark:text-purple-400 text-sm">auto_awesome</span>
            <span className="text-purple-700 dark:text-purple-300 text-xs font-bold uppercase tracking-wide">AI Generative System</span>
          </div>
          <h1 className="text-[#0d121b] dark:text-white text-4xl md:text-5xl font-black leading-tight tracking-[-0.033em]">Design Principles</h1>
          <p className="text-[#4c669a] dark:text-slate-400 text-lg max-w-2xl leading-relaxed">
            The loop.dev foundation rests on geometry, space, and motion. Our principles guide the creation of scalable, intelligent interfaces where form follows the continuous 'loop' of user interaction.
          </p>
        </div>
      </div>

      <section className="mb-20">
        <div className="flex items-center justify-between mb-8">
          <div className="flex flex-col">
            <h2 className="text-[#0d121b] dark:text-white text-2xl font-bold tracking-[-0.015em]">Shape & Geometry</h2>
            <p className="text-slate-500 text-sm mt-1">Core form language (13.5)</p>
          </div>
          <div className="inline-flex items-center gap-2 text-slate-500 text-sm">
            <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-xs font-mono">rounded-lg</span>
            <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-xs font-mono">border-1</span>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-8 flex flex-col relative overflow-hidden group">
            <div className="h-40 flex items-center justify-center mb-6 relative">
              <div className="absolute inset-0 bg-slate-50 dark:bg-slate-800/50 rounded-lg"></div>
              <div className="w-32 h-16 rounded-full border-4 border-primary flex items-center justify-center relative">
                <div className="w-2 h-2 bg-primary rounded-full absolute -top-1 left-1/2 -ml-1 shadow-[0_0_10px_rgba(19,91,236,0.5)]"></div>
              </div>
            </div>
            <h3 className="text-lg font-bold text-[#0d121b] dark:text-white mb-2">The Continuous Loop</h3>
            <p className="text-slate-500 text-sm leading-relaxed">Forms should evoke continuity. Avoid sharp angles in primary containers. Use fully rounded caps (pills) for status indicators and high-level tags.</p>
          </div>
          <div className="lg:col-span-1 bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-8 flex flex-col relative overflow-hidden">
            <div className="h-40 flex items-center justify-center gap-4 mb-6 relative">
              <div className="absolute inset-0 bg-slate-50 dark:bg-slate-800/50 rounded-lg"></div>
              <div className="w-16 h-16 bg-white dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded flex items-center justify-center shadow-sm">
                <span className="text-[10px] font-mono text-slate-400">sm</span>
              </div>
              <div className="w-16 h-16 bg-white dark:bg-slate-700 border-2 border-primary rounded-xl flex items-center justify-center shadow-md z-10">
                <span className="text-[10px] font-mono text-primary font-bold">xl</span>
              </div>
              <div className="w-16 h-16 bg-white dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-[2rem] flex items-center justify-center shadow-sm">
                <span className="text-[10px] font-mono text-slate-400">2xl</span>
              </div>
            </div>
            <h3 className="text-lg font-bold text-[#0d121b] dark:text-white mb-2">Adaptive Radii</h3>
            <p className="text-slate-500 text-sm leading-relaxed">Border radius scales with size. Small elements use tighter curves (4px), while modal surfaces and cards embrace softer corners (12px-24px).</p>
          </div>
          <div className="lg:col-span-1 bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-8 flex flex-col relative overflow-hidden">
            <div className="h-40 flex flex-col items-center justify-center gap-4 mb-6 relative">
              <div className="absolute inset-0 bg-slate-50 dark:bg-slate-800/50 rounded-lg"></div>
              <div className="w-full max-w-[180px] h-px bg-slate-300 dark:bg-slate-600"></div>
              <div className="w-full max-w-[180px] h-[2px] bg-primary"></div>
              <div className="w-full max-w-[180px] border-t border-dashed border-slate-300 dark:border-slate-600"></div>
            </div>
            <h3 className="text-lg font-bold text-[#0d121b] dark:text-white mb-2">Technical Precision</h3>
            <p className="text-slate-500 text-sm leading-relaxed">Strokes are refined and deliberate. 1px borders for structure, 2px for active states. Dashed lines indicate potential or system boundaries.</p>
          </div>
        </div>
      </section>

      <section className="mb-20">
        <div className="flex items-center justify-between mb-8">
          <div className="flex flex-col">
            <h2 className="text-[#0d121b] dark:text-white text-2xl font-bold tracking-[-0.015em]">Space & Composition</h2>
            <p className="text-slate-500 text-sm mt-1">Hierarchy and Density (13.6)</p>
          </div>
          <div className="inline-flex items-center gap-2 text-slate-500 text-sm">
            <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-xs font-mono">grid-8pt</span>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-8">
            <div className="flex justify-between items-end mb-6">
              <h3 className="text-lg font-bold text-[#0d121b] dark:text-white">Breathing Room</h3>
              <span className="text-xs font-mono text-slate-400">rem-based scale</span>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-24 text-right text-xs font-mono text-slate-400">p-2 (0.5rem)</div>
                <div className="bg-slate-100 dark:bg-slate-800 flex-1 rounded overflow-hidden">
                  <div className="w-8 h-8 bg-blue-400/20 border border-blue-400/50 m-2 rounded-sm"></div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-24 text-right text-xs font-mono text-slate-400">p-4 (1.0rem)</div>
                <div className="bg-slate-100 dark:bg-slate-800 flex-1 rounded overflow-hidden">
                  <div className="w-8 h-8 bg-blue-400/20 border border-blue-400/50 m-4 rounded-sm"></div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-24 text-right text-xs font-mono text-slate-400">p-8 (2.0rem)</div>
                <div className="bg-slate-100 dark:bg-slate-800 flex-1 rounded overflow-hidden">
                  <div className="w-8 h-8 bg-blue-400/20 border border-blue-400/50 m-8 rounded-sm"></div>
                </div>
              </div>
            </div>
            <p className="mt-6 text-sm text-slate-500">
              Use multiples of 4px. White space is active content. Increase padding to group related elements and denote hierarchy.
            </p>
          </div>
          <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-8 flex flex-col">
            <div className="flex justify-between items-end mb-6">
              <h3 className="text-lg font-bold text-[#0d121b] dark:text-white">System Density</h3>
              <span className="text-xs font-mono text-slate-400">Visual Hierarchy</span>
            </div>
            <div className="bg-grid-pattern dark:bg-grid-pattern-dark flex-1 rounded-lg border border-slate-200 dark:border-slate-700 p-6 flex items-center justify-center relative overflow-hidden">
              <div className="bg-white dark:bg-slate-900 shadow-xl rounded-lg p-4 w-64 border border-slate-200 dark:border-slate-600">
                <div className="h-3 w-1/3 bg-slate-200 dark:bg-slate-700 rounded mb-4"></div>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full"></div>
                    <div className="flex-1 space-y-1 py-1">
                      <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded w-full"></div>
                      <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded w-2/3"></div>
                    </div>
                  </div>
                  <div className="flex gap-2 opacity-50">
                    <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-full"></div>
                    <div className="flex-1 space-y-1 py-1">
                      <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded w-full"></div>
                      <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded w-2/3"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <p className="mt-6 text-sm text-slate-500">
              Balance density for legibility. Documentation allows for more breathing room, while technical dashboards may require higher information density.
            </p>
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-8">
          <div className="flex flex-col">
            <h2 className="text-[#0d121b] dark:text-white text-2xl font-bold tracking-[-0.015em]">Motion & Behavior</h2>
            <p className="text-slate-500 text-sm mt-1">Rhythm and Continuity (13.7)</p>
          </div>
          <div className="inline-flex items-center gap-2 text-slate-500 text-sm">
            <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-xs font-mono">bezier-curve</span>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 bg-[#0d121b] rounded-xl shadow-lg border border-slate-800 p-8 relative overflow-hidden text-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 h-full">
              <div className="flex flex-col justify-center">
                <h3 className="text-xl font-bold mb-3">Natural Rhythms</h3>
                <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                  Motion is never linear. We use custom easing curves that mimic physical momentum. Elements enter quickly and settle smoothly (ease-out), creating a sense of snap and responsiveness.
                </p>
                <div className="flex gap-3 text-xs font-mono">
                  <div className="px-3 py-1.5 rounded bg-white/10 border border-white/5">0.2s Quick</div>
                  <div className="px-3 py-1.5 rounded bg-white/10 border border-white/5">0.4s Standard</div>
                  <div className="px-3 py-1.5 rounded bg-white/10 border border-white/5">0.6s Emphasized</div>
                </div>
              </div>
              <div className="relative h-48 md:h-auto border-l border-white/10 pl-8 flex items-center">
                <svg className="w-full h-32 overflow-visible" viewBox="0 0 200 100">
                  <line stroke="#334155" strokeWidth="1" x1="0" x2="200" y1="100" y2="100"></line>
                  <line stroke="#334155" strokeWidth="1" x1="0" x2="0" y1="0" y2="100"></line>
                  <line className="opacity-50" stroke="#135bec" strokeDasharray="2,2" strokeWidth="1" x1="0" x2="80" y1="100" y2="100"></line>
                  <line className="opacity-50" stroke="#135bec" strokeDasharray="2,2" strokeWidth="1" x1="120" x2="200" y1="0" y2="0"></line>
                  <circle cx="80" cy="100" fill="#135bec" r="3"></circle>
                  <circle cx="120" cy="0" fill="#135bec" r="3"></circle>
                  <path d="M0,100 C80,100 120,0 200,0" fill="none" stroke="#135bec" strokeLinecap="round" strokeWidth="3"></path>
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-8 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Brand Motion</span>
              <h3 className="text-lg font-bold text-[#0d121b] dark:text-white mt-1 mb-4">The Isotipo</h3>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 border-4 border-slate-100 dark:border-slate-700 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-t-primary border-r-primary border-b-transparent border-l-transparent rounded-full rotate-45 transform"></div>
              </div>
            </div>
            <p className="mt-4 text-xs text-slate-500">
              Continuous rotation for loading states, signaling the system is 'thinking' and generating.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
