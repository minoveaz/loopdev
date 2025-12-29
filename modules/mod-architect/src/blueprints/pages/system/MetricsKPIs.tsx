
import React from 'react';

export const MetricsKPIs: React.FC = () => {
  return (
    <div className="max-w-[1200px] mx-auto p-6 md:p-12 pb-24">
      {/* Header */}
      <div className="mb-12">
        <div className="flex flex-col gap-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 w-fit">
            <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-sm">monitoring</span>
            <span className="text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wide">Components 1.2</span>
          </div>
          <h1 className="text-[#0d121b] dark:text-white text-4xl md:text-5xl font-black leading-tight tracking-[-0.033em]">Metrics &amp; KPIs</h1>
          <p className="text-[#4c669a] dark:text-slate-400 text-lg max-w-2xl leading-relaxed">
            Standardized data visualization components for presenting key performance indicators. These widgets combine technical precision with our minimalist aesthetic, using the Energy Yellow token to highlight growth and system vitality.
          </p>
        </div>
      </div>

      {/* Summary Widgets */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[#0d121b] dark:text-white text-2xl font-bold tracking-[-0.015em]">Summary Widgets</h2>
          <div className="inline-flex items-center gap-2 text-slate-500 text-sm">
            <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-xs font-mono">view: card-grid</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Active Users Widget */}
          <div className="group bg-white dark:bg-surface-dark p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Active Users</span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-lg">group</span>
              </div>
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-4xl font-mono font-bold text-[#0d121b] dark:text-white">24.8k</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="inline-flex items-center text-xs font-bold text-slate-500">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300 mr-1.5"></span>
                vs. last month
              </span>
            </div>
          </div>

          {/* System Efficiency Widget */}
          <div className="group bg-white dark:bg-surface-dark p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">System Efficiency</span>
              <div className="w-8 h-8 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 flex items-center justify-center">
                <span className="material-symbols-outlined text-lg">bolt</span>
              </div>
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-4xl font-mono font-bold text-[#0d121b] dark:text-white">98.2%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="inline-flex items-center gap-1 text-xs font-bold text-energy-vivid dark:text-energy bg-yellow-50 dark:bg-yellow-900/20 px-1.5 py-0.5 rounded">
                <span className="material-symbols-outlined text-[14px]">trending_up</span>
                +4.2%
              </span>
              <span className="text-[10px] text-slate-400">Optimization</span>
            </div>
          </div>

          {/* Storage Used Widget */}
          <div className="group bg-white dark:bg-surface-dark p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Storage Used</span>
              <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-500 flex items-center justify-center">
                <span className="material-symbols-outlined text-lg">database</span>
              </div>
            </div>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-4xl font-mono font-bold text-[#0d121b] dark:text-white">824<span className="text-lg text-slate-400 ml-1">GB</span></span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-primary h-full w-[65%] rounded-full"></div>
            </div>
            <div className="mt-2 flex justify-between text-[10px] font-mono text-slate-400">
              <span>65% Used</span>
              <span>1TB Total</span>
            </div>
          </div>
        </div>
      </section>

      {/* Anatomy & Composition */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[#0d121b] dark:text-white text-2xl font-bold tracking-[-0.015em]">Anatomy &amp; Composition</h2>
          <p className="text-sm text-slate-500">Structural breakdown of the KPI widget</p>
        </div>
        <div className="bg-slate-50 dark:bg-black/20 rounded-xl border border-slate-200 dark:border-slate-800 p-8">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="relative w-full max-w-sm">
              <div className="bg-white dark:bg-surface-dark rounded-xl border border-primary shadow-[0_0_0_4px_rgba(19,91,236,0.1)] p-6 relative z-10">
                <div className="flex justify-between items-start mb-3">
                  <div className="px-2 py-1 border border-dashed border-red-300 bg-red-50 text-red-500 text-[10px] font-bold rounded">1. Label</div>
                </div>
                <div className="mb-2">
                  <div className="inline-block px-2 py-1 border border-dashed border-blue-300 bg-blue-50 text-primary text-[10px] font-bold rounded">2. Primary Value</div>
                </div>
                <div>
                  <div className="inline-block px-2 py-1 border border-dashed border-yellow-300 bg-yellow-50 text-yellow-700 text-[10px] font-bold rounded">3. Trend Indicator</div>
                </div>
              </div>
            </div>
            <div className="flex-1 w-full grid grid-cols-1 gap-6">
              <div className="flex gap-4 items-start">
                <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300 flex-shrink-0">1</div>
                <div>
                  <h4 className="text-sm font-bold text-[#0d121b] dark:text-white">Label &amp; Context</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Upper-case, bold, slate-500. Describes the metric clearly. Optional icon on the right (slate or primary blue) adds visual context.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0">2</div>
                <div>
                  <h4 className="text-sm font-bold text-[#0d121b] dark:text-white">Primary Value</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    JetBrains Mono, slate-900 (light) or white (dark). The most prominent element. Large font size (text-3xl or text-4xl) to anchor the card.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center text-xs font-bold text-yellow-700 flex-shrink-0">3</div>
                <div>
                  <h4 className="text-sm font-bold text-[#0d121b] dark:text-white">Trend Indicator</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Displays change over time. Use Energy Yellow for positive growth or highlighting significant shifts. Use Neutrals for stable or negative trends to maintain brand hierarchy.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trend Logic & Colors */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[#0d121b] dark:text-white text-2xl font-bold tracking-[-0.015em]">Trend Logic &amp; Colors</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded-lg p-4">
            <span className="text-xs text-slate-400 font-bold block mb-3 uppercase">Growth / Positive</span>
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-energy-vivid text-2xl">trending_up</span>
              <span className="text-2xl font-mono font-bold text-[#0d121b] dark:text-white">+12%</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-normal">
              Energy Yellow indicates vitality, growth, and positive system output.
            </p>
          </div>
          <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded-lg p-4">
            <span className="text-xs text-slate-400 font-bold block mb-3 uppercase">Decline / Reduction</span>
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-slate-400 text-2xl">trending_down</span>
              <span className="text-2xl font-mono font-bold text-[#0d121b] dark:text-white">-3.4%</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-normal">
              Neutrals (Slate 400) are used for reductions to avoid alarmist red tones.
            </p>
          </div>
          <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded-lg p-4">
            <span className="text-xs text-slate-400 font-bold block mb-3 uppercase">Stable / Neutral</span>
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-primary text-2xl">trending_flat</span>
              <span className="text-2xl font-mono font-bold text-[#0d121b] dark:text-white">0.0%</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-normal">
              Primary Blue represents stability, continuity, and technical baseline.
            </p>
          </div>
          <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded-lg p-4">
            <span className="text-xs text-slate-400 font-bold block mb-3 uppercase">Contextual Highlight</span>
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2 py-0.5 rounded bg-yellow-100 dark:bg-energy/20 text-yellow-800 dark:text-energy text-xs font-bold border border-yellow-200 dark:border-energy/30">NEW HIGH</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-normal">
              Use Energy Yellow backgrounds for badges that need immediate attention.
            </p>
          </div>
        </div>
      </section>

      {/* Dark Mode Implementation */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[#0d121b] dark:text-white text-2xl font-bold tracking-[-0.015em]">Dark Mode Implementation</h2>
        </div>
        <div className="bg-[#0d121b] rounded-xl p-8 border border-slate-800 flex justify-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
            <div className="bg-[#1e293b] p-6 rounded-xl border border-slate-700 shadow-lg">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Generated Tokens</span>
                <div className="w-8 h-8 rounded-lg bg-blue-900/30 text-blue-400 flex items-center justify-center">
                  <span className="material-symbols-outlined text-lg">token</span>
                </div>
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-3xl font-mono font-bold text-white">1,024</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-slate-500">Since yesterday</span>
              </div>
            </div>
            <div className="bg-[#1e293b] p-6 rounded-xl border border-slate-700 shadow-lg">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Model Accuracy</span>
                <div className="w-8 h-8 rounded-lg bg-yellow-900/20 text-yellow-400 flex items-center justify-center">
                  <span className="material-symbols-outlined text-lg">check_circle</span>
                </div>
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-3xl font-mono font-bold text-white">99.9%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="inline-flex items-center gap-1 text-xs font-bold text-yellow-400">
                  <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
                  +0.4%
                </span>
                <span className="text-xs text-slate-500">improvement</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
