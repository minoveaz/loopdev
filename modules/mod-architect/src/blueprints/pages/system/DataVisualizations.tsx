import React from 'react';

export const DataVisualizations: React.FC = () => {
  return (
    <div className="max-w-[1200px] mx-auto p-6 md:p-12 pb-24">
      <div className="mb-12">
        <div className="flex flex-col gap-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 w-fit">
            <span className="material-symbols-outlined text-primary text-sm">bar_chart</span>
            <span className="text-primary dark:text-blue-300 text-xs font-bold uppercase tracking-wide">Data Components</span>
          </div>
          <h1 className="text-[#0d121b] dark:text-white text-4xl md:text-5xl font-black leading-tight tracking-[-0.033em]">Data Visualizations</h1>
          <p className="text-[#4c669a] dark:text-slate-400 text-lg max-w-2xl">
            A comprehensive set of charts, widgets, and heatmaps designed to visualize complex data with clarity. Strictly aligned with our primary and energy palettes for optimal readability.
          </p>
        </div>
      </div>
      <section className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[#0d121b] dark:text-white text-2xl font-bold tracking-[-0.015em]">Chart Components</h2>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 text-xs font-medium bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Web</button>
            <button className="px-3 py-1.5 text-xs font-medium bg-transparent border border-transparent rounded-lg text-slate-500 hover:text-primary transition-colors">Mobile</button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="flex flex-col bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-sm font-bold text-[#0d121b] dark:text-white">Revenue Growth</h3>
                <p className="text-xs text-slate-500">Monthly breakdown</p>
              </div>
              <span className="material-symbols-outlined text-slate-300 text-lg">more_horiz</span>
            </div>
            <div className="flex items-end justify-between h-40 gap-2 mb-4">
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-t-sm h-[40%] hover:bg-primary/80 transition-colors group relative">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#0d121b] text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">$42k</div>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-t-sm h-[65%] hover:bg-primary/80 transition-colors group relative">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#0d121b] text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">$68k</div>
              </div>
              <div className="w-full bg-primary rounded-t-sm h-[85%] hover:bg-blue-600 transition-colors relative shadow-lg shadow-blue-500/20 group">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#0d121b] text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">$85k</div>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-t-sm h-[55%] hover:bg-primary/80 transition-colors group relative">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#0d121b] text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">$58k</div>
              </div>
              <div className="w-full bg-energy rounded-t-sm h-[30%] hover:bg-yellow-400 transition-colors relative group">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#0d121b] text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">$32k</div>
              </div>
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 font-mono uppercase">
              <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span>
            </div>
          </div>
          <div className="flex flex-col bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-sm font-bold text-[#0d121b] dark:text-white">Active Users</h3>
                <p className="text-xs text-slate-500">Real-time sessions</p>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-[10px] font-bold text-green-600 dark:text-green-400">LIVE</span>
              </div>
            </div>
            <div className="relative h-40 w-full mb-4 flex items-end">
              <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 50">
                <defs>
                  <linearGradient id="gradientArea" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#135bec" stopOpacity="0.2"></stop>
                    <stop offset="100%" stopColor="#135bec" stopOpacity="0"></stop>
                  </linearGradient>
                </defs>
                <path d="M0,50 L0,30 C20,25 30,40 50,20 C70,0 80,15 100,5" fill="url(#gradientArea)" stroke="none"></path>
                <path className="drop-shadow-md" d="M0,30 C20,25 30,40 50,20 C70,0 80,15 100,5" fill="none" stroke="#135bec" strokeWidth="2"></path>
                <circle className="fill-white stroke-primary" cx="50" cy="20" r="2" strokeWidth="1"></circle>
                <g transform="translate(40, -5)">
                  <rect className="fill-[#0d121b]" height="16" rx="2" width="24"></rect>
                  <text className="fill-white text-[6px] font-mono" dx="12" dy="10" textAnchor="middle">2.4k</text>
                </g>
              </svg>
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 font-mono border-t border-slate-100 dark:border-slate-800 pt-2">
              <span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span>
            </div>
          </div>
          <div className="flex flex-col bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-sm font-bold text-[#0d121b] dark:text-white">Device Traffic</h3>
                <p className="text-xs text-slate-500">Platform distribution</p>
              </div>
            </div>
            <div className="flex items-center justify-center h-44 relative">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle className="text-slate-100 dark:text-slate-800" cx="64" cy="64" fill="transparent" r="50" stroke="currentColor" strokeWidth="12"></circle>
                <circle className="text-primary" cx="64" cy="64" fill="transparent" r="50" stroke="currentColor" strokeDasharray="220" strokeDashoffset="70" strokeLinecap="round" strokeWidth="12"></circle>
                <circle className="text-energy" cx="64" cy="64" fill="transparent" r="50" stroke="currentColor" strokeDasharray="100" strokeDashoffset="280" strokeLinecap="round" strokeWidth="12"></circle>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-bold text-[#0d121b] dark:text-white">84%</span>
                <span className="text-[10px] text-slate-400 uppercase">Mobile</span>
              </div>
            </div>
            <div className="flex justify-center gap-4 mt-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-primary"></span>
                <span className="text-xs text-slate-600 dark:text-slate-400">Mobile</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-energy"></span>
                <span className="text-xs text-slate-600 dark:text-slate-400">Desktop</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                <span className="text-xs text-slate-600 dark:text-slate-400">Tablet</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="mb-16">
        <div className="mb-6">
          <h2 className="text-[#0d121b] dark:text-white text-2xl font-bold tracking-[-0.015em] mb-2">Dashboard Widgets</h2>
          <p className="text-[#4c669a] dark:text-slate-400">Reusable components for displaying key metrics with configurable layouts.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-primary">
                <span className="material-symbols-outlined">payments</span>
              </div>
              <span className="text-sm font-medium text-slate-500">Total Revenue</span>
            </div>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-black text-[#0d121b] dark:text-white">$124,500</h3>
              <span className="text-xs font-bold text-green-600 flex items-center">
                <span className="material-symbols-outlined text-sm">arrow_upward</span> 12%
              </span>
            </div>
          </div>
          <div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-slate-500">System Health</span>
                <span className="text-xs text-slate-400">Last updated 1m ago</span>
              </div>
              <span className="material-symbols-outlined text-slate-300">hub</span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <span className="text-lg font-bold text-[#0d121b] dark:text-white">99.98%</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full mt-3 overflow-hidden">
              <div className="bg-green-500 h-full rounded-full" style={{ width: '99%' }}></div>
            </div>
          </div>
          <div className="bg-primary p-6 rounded-xl border border-blue-600 shadow-lg shadow-blue-500/20 text-white relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-colors"></div>
            <div className="relative z-10">
              <span className="text-blue-100 text-sm font-medium mb-1 block">Conversion Rate</span>
              <div className="flex justify-between items-end">
                <h3 className="text-3xl font-black">4.2%</h3>
                <span className="bg-white/20 text-white px-1.5 py-0.5 rounded text-[10px] font-bold">+0.8%</span>
              </div>
              <div className="mt-4 flex gap-1 items-end h-8">
                <div className="w-full bg-white/20 h-[30%] rounded-sm"></div>
                <div className="w-full bg-white/20 h-[50%] rounded-sm"></div>
                <div className="w-full bg-white/40 h-[40%] rounded-sm"></div>
                <div className="w-full bg-white/30 h-[70%] rounded-sm"></div>
                <div className="w-full bg-energy h-[100%] rounded-sm"></div>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-l-4 border-l-energy border-y-slate-100 border-r-slate-100 dark:border-y-slate-700 dark:border-r-slate-700 shadow-sm">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-energy">warning</span>
              <div>
                <h4 className="text-sm font-bold text-[#0d121b] dark:text-white">Capacity Warning</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">Server load approaching 85% threshold. Auto-scaling initiated.</p>
              </div>
            </div>
            <button className="mt-4 w-full py-1.5 text-xs font-bold text-[#0d121b] bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors">
              View Details
            </button>
          </div>
        </div>
      </section>
      <section className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[#0d121b] dark:text-white text-2xl font-bold tracking-[-0.015em]">Heatmaps & Density</h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-surface-dark p-8 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-[#0d121b] dark:text-white">Activity Density</h3>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>Less</span>
                <div className="flex gap-0.5">
                  <div className="w-3 h-3 rounded-sm bg-slate-100 dark:bg-slate-800"></div>
                  <div className="w-3 h-3 rounded-sm bg-blue-200"></div>
                  <div className="w-3 h-3 rounded-sm bg-blue-400"></div>
                  <div className="w-3 h-3 rounded-sm bg-primary"></div>
                  <div className="w-3 h-3 rounded-sm bg-[#0a3aa0]"></div>
                </div>
                <span>More</span>
              </div>
            </div>
            <div className="flex gap-1 overflow-x-auto pb-2">
              <div className="flex flex-col gap-1">
                <div className="w-4 h-4 rounded-sm bg-slate-100 dark:bg-slate-800"></div>
                <div className="w-4 h-4 rounded-sm bg-blue-200"></div>
                <div className="w-4 h-4 rounded-sm bg-blue-400"></div>
                <div className="w-4 h-4 rounded-sm bg-primary"></div>
                <div className="w-4 h-4 rounded-sm bg-primary"></div>
                <div className="w-4 h-4 rounded-sm bg-slate-100 dark:bg-slate-800"></div>
                <div className="w-4 h-4 rounded-sm bg-blue-200"></div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="w-4 h-4 rounded-sm bg-blue-200"></div>
                <div className="w-4 h-4 rounded-sm bg-slate-100 dark:bg-slate-800"></div>
                <div className="w-4 h-4 rounded-sm bg-primary"></div>
                <div className="w-4 h-4 rounded-sm bg-[#0a3aa0]"></div>
                <div className="w-4 h-4 rounded-sm bg-primary"></div>
                <div className="w-4 h-4 rounded-sm bg-blue-400"></div>
                <div className="w-4 h-4 rounded-sm bg-slate-100 dark:bg-slate-800"></div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="w-4 h-4 rounded-sm bg-primary"></div>
                <div className="w-4 h-4 rounded-sm bg-[#0a3aa0]"></div>
                <div className="w-4 h-4 rounded-sm bg-blue-400"></div>
                <div className="w-4 h-4 rounded-sm bg-slate-100 dark:bg-slate-800"></div>
                <div className="w-4 h-4 rounded-sm bg-blue-200"></div>
                <div className="w-4 h-4 rounded-sm bg-primary"></div>
                <div className="w-4 h-4 rounded-sm bg-[#0a3aa0]"></div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="w-4 h-4 rounded-sm bg-slate-100 dark:bg-slate-800"></div>
                <div className="w-4 h-4 rounded-sm bg-blue-200"></div>
                <div className="w-4 h-4 rounded-sm bg-primary"></div>
                <div className="w-4 h-4 rounded-sm bg-primary"></div>
                <div className="w-4 h-4 rounded-sm bg-blue-400"></div>
                <div className="w-4 h-4 rounded-sm bg-[#0a3aa0]"></div>
                <div className="w-4 h-4 rounded-sm bg-blue-200"></div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="w-4 h-4 rounded-sm bg-blue-400"></div>
                <div className="w-4 h-4 rounded-sm bg-primary"></div>
                <div className="w-4 h-4 rounded-sm bg-slate-100 dark:bg-slate-800"></div>
                <div className="w-4 h-4 rounded-sm bg-blue-200"></div>
                <div className="w-4 h-4 rounded-sm bg-[#0a3aa0]"></div>
                <div className="w-4 h-4 rounded-sm bg-primary"></div>
                <div className="w-4 h-4 rounded-sm bg-blue-400"></div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="w-4 h-4 rounded-sm bg-slate-100 dark:bg-slate-800"></div>
                <div className="w-4 h-4 rounded-sm bg-slate-100 dark:bg-slate-800"></div>
                <div className="w-4 h-4 rounded-sm bg-blue-200"></div>
                <div className="w-4 h-4 rounded-sm bg-primary"></div>
                <div className="w-4 h-4 rounded-sm bg-blue-400"></div>
                <div className="w-4 h-4 rounded-sm bg-slate-100 dark:bg-slate-800"></div>
                <div className="w-4 h-4 rounded-sm bg-slate-100 dark:bg-slate-800"></div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="w-4 h-4 rounded-sm bg-primary"></div>
                <div className="w-4 h-4 rounded-sm bg-[#0a3aa0]"></div>
                <div className="w-4 h-4 rounded-sm bg-primary"></div>
                <div className="w-4 h-4 rounded-sm bg-blue-400"></div>
                <div className="w-4 h-4 rounded-sm bg-blue-200"></div>
                <div className="w-4 h-4 rounded-sm bg-slate-100 dark:bg-slate-800"></div>
                <div className="w-4 h-4 rounded-sm bg-blue-400"></div>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-surface-dark p-8 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-[#0d121b] dark:text-white">Regional Interaction</h3>
              <div className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-xs font-mono text-slate-500">Global</div>
            </div>
            <div className="flex-1 bg-slate-50 dark:bg-slate-900 rounded-lg relative overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px', opacity: 0.3 }}></div>
              <div className="absolute top-1/3 left-1/4 w-32 h-32 bg-primary/40 rounded-full blur-3xl"></div>
              <div className="absolute bottom-1/4 right-1/3 w-40 h-40 bg-[#135bec]/30 rounded-full blur-3xl"></div>
              <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-energy/40 rounded-full blur-2xl"></div>
              <div className="absolute bottom-1/3 left-1/3 w-20 h-20 bg-primary/20 rounded-full blur-2xl"></div>
              <div className="relative z-10 grid grid-cols-4 gap-8 opacity-60">
                <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                <div className="w-2 h-2 rounded-full bg-slate-300"></div>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-4">
              <span className="text-xs font-bold text-slate-500 uppercase">Intensity</span>
              <div className="h-2 flex-1 rounded-full bg-gradient-to-r from-slate-100 via-[#135bec] to-[#FFD700]"></div>
            </div>
          </div>
        </div>
      </section>
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
            <span className="text-xs font-mono text-slate-400">ChartComponent.jsx</span>
            <button className="text-slate-400 hover:text-white transition-colors">
              <span className="material-symbols-outlined text-sm">content_copy</span>
            </button>
          </div>
          <div className="p-6 overflow-x-auto">
            <pre className="font-mono text-sm leading-relaxed text-slate-300"><span className="text-purple-400">import</span> {'{ BarChart, LineChart }'} <span className="text-purple-400">from</span> <span className="text-green-400">'@loop-dev/charts'</span>;
<span className="text-slate-500">// Example configuration using design tokens</span>
<span className="text-purple-400">const</span> chartConfig = {'{'}
  <span className="text-blue-400">colors</span>: [<span className="text-green-400">'#135bec'</span>, <span className="text-green-400">'#FFD700'</span>, <span className="text-green-400">'#cbd5e1'</span>],
  <span className="text-blue-400">grid</span>: {'{'}
    <span className="text-blue-400">stroke</span>: <span className="text-green-400">'#f1f5f9'</span>,
    <span className="text-blue-400">strokeDasharray</span>: <span className="text-green-400">'3 3'</span>
  {'}'},
  <span className="text-blue-400">tooltip</span>: {'{'}
    <span className="text-blue-400">bg</span>: <span className="text-green-400">'#1e293b'</span>,
    <span className="text-blue-400">text</span>: <span className="text-green-400">'#ffffff'</span>
  {'}'}
{'}'};
<span className="text-purple-400">export default</span> <span className="text-purple-400">function</span> <span className="text-yellow-300">Dashboard</span>() {'{'}
  <span className="text-purple-400">return</span> (
    &lt;<span className="text-yellow-300">BarChart</span> 
      <span className="text-blue-400">data</span>={'{data}'} 
      <span className="text-blue-400">theme</span>={'{chartConfig}'} 
      <span className="text-blue-400">variant</span>=<span className="text-green-400">"primary"</span> 
    /&gt;
  );
{'}'}
</pre>
          </div>
        </div>
      </section>
    </div>
  );
};