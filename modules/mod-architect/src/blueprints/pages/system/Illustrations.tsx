import React from 'react';

export const Illustrations: React.FC = () => {
  return (
    <div className="max-w-[1200px] mx-auto p-6 md:p-12 pb-24">
      <div className="mb-12">
        <div className="flex flex-col gap-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 w-fit">
            <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-sm">architecture</span>
            <span className="text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wide">Geometric System</span>
          </div>
          <h1 className="text-[#0d121b] dark:text-white text-4xl md:text-5xl font-black leading-tight tracking-[-0.033em]">Illustrations &amp; Graphics</h1>
          <p className="text-[#4c669a] dark:text-slate-400 text-lg max-w-2xl">
            The loop.dev illustration system defines a coherent geometric and technical style. We emphasize clean lines, modular shapes, and functional color usage to communicate complex concepts with clarity.
          </p>
        </div>
      </div>
      <section className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[#0d121b] dark:text-white text-2xl font-bold tracking-[-0.015em]">Style Principles</h2>
          <div className="inline-flex items-center gap-2 text-slate-500 text-sm">
            <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-xs font-mono">.svg</span>
            <span>Vector Based</span>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-8 flex flex-col justify-between min-h-[300px] overflow-hidden relative group">
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none">
              <svg height="100%" preserveAspectRatio="none" viewBox="0 0 100 100" width="100%">
                <pattern height="10" id="grid" patternUnits="userSpaceOnUse" width="10">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"></path>
                </pattern>
                <rect fill="url(#grid)" height="100%" width="100%"></rect>
              </svg>
            </div>
            <div className="relative z-10 flex items-center justify-center flex-grow p-4">
              <svg className="w-full max-w-sm h-auto drop-shadow-xl" fill="none" viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 140L100 100L180 140" stroke="#cbd5e1" strokeLinecap="round" strokeWidth="2"></path>
                <path d="M100 100V20" stroke="#135bec" strokeLinecap="round" strokeWidth="2"></path>
                <circle className="dark:fill-primary" cx="100" cy="20" fill="#135bec" r="12"></circle>
                <circle className="dark:fill-slate-600" cx="20" cy="140" fill="#e2e8f0" r="8"></circle>
                <circle className="dark:fill-slate-600" cx="180" cy="140" fill="#e2e8f0" r="8"></circle>
                <path d="M100 32V80" stroke="#135bec" strokeDasharray="4 4" strokeWidth="2"></path>
                <rect className="dark:fill-slate-800" fill="white" height="40" rx="4" stroke="#135bec" strokeWidth="2" width="80" x="60" y="60"></rect>
                <circle cx="100" cy="80" fill="#eab308" r="4"></circle>
                <path d="M160 40L170 50M170 40L160 50" stroke="#eab308" strokeLinecap="round" strokeWidth="2"></path>
              </svg>
            </div>
            <div className="relative z-10 pt-4 border-t border-slate-100 dark:border-slate-700 mt-4 flex justify-between items-center">
              <span className="text-xs font-bold text-primary uppercase tracking-wider">Geometric Construction</span>
              <span className="text-xs text-slate-400 font-mono">figma-library/core-shapes</span>
            </div>
          </div>
          <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-8 flex flex-col gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="w-8 h-8 rounded bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-lg">category</span>
                </span>
                <h3 className="text-base font-bold text-[#0d121b] dark:text-white">Modular Shapes</h3>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed">Illustrations are built using primitive shapes (circles, squares, pills) to ensure consistency and scalability across the system.</p>
            </div>
            <div className="h-px bg-slate-100 dark:bg-slate-700"></div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="w-8 h-8 rounded bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-lg">line_weight</span>
                </span>
                <h3 className="text-base font-bold text-[#0d121b] dark:text-white">Clean Lines</h3>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed">We use a consistent 1.5px or 2px stroke weight. Lines are used to define structure and connect related data points.</p>
            </div>
            <div className="h-px bg-slate-100 dark:bg-slate-700"></div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="w-8 h-8 rounded bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-lg">crop_free</span>
                </span>
                <h3 className="text-base font-bold text-[#0d121b] dark:text-white">Minimal Detail</h3>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed">Avoid unnecessary decoration. Every element should serve a purpose in communicating the technical concept.</p>
            </div>
          </div>
        </div>
      </section>
      <section className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[#0d121b] dark:text-white text-2xl font-bold tracking-[-0.015em]">Functional Color Usage</h2>
          <p className="text-slate-500 text-sm hidden md:block">Color is used to denote hierarchy and function, not just decoration.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm group hover:border-primary/50 transition-colors">
            <div className="h-24 bg-blue-50 dark:bg-blue-900/20 rounded-lg mb-4 flex items-center justify-center">
              <svg fill="none" height="64" viewBox="0 0 64 64" width="64" xmlns="http://www.w3.org/2000/svg">
                <rect height="32" rx="4" stroke="#135bec" strokeWidth="2" width="32" x="16" y="16"></rect>
                <path d="M32 16V48" stroke="#135bec" strokeOpacity="0.3" strokeWidth="2"></path>
                <path d="M16 32H48" stroke="#135bec" strokeOpacity="0.3" strokeWidth="2"></path>
              </svg>
            </div>
            <h3 className="text-primary font-bold mb-1">Primary Blue</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Structure &amp; Foundation</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Used for the main subject matter, structural lines, and defining the core shape of the illustration.</p>
          </div>
          <div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm group hover:border-yellow-400/50 transition-colors">
            <div className="h-24 bg-yellow-50 dark:bg-yellow-900/10 rounded-lg mb-4 flex items-center justify-center">
              <svg fill="none" height="64" viewBox="0 0 64 64" width="64" xmlns="http://www.w3.org/2000/svg">
                <path d="M32 12L32 20" stroke="#EAB308" strokeLinecap="round" strokeWidth="2"></path>
                <circle cx="32" cy="32" fill="#EAB308" r="6"></circle>
                <path d="M22 42L42 42" stroke="#cbd5e1" strokeLinecap="round" strokeWidth="2"></path>
              </svg>
            </div>
            <h3 className="text-yellow-600 dark:text-yellow-400 font-bold mb-1">Accent Yellow</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Action &amp; Emphasis</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Reserved for highlights, active states, notifications, or critical data points that require attention.</p>
          </div>
          <div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm group hover:border-slate-300 transition-colors">
            <div className="h-24 bg-slate-50 dark:bg-slate-800 rounded-lg mb-4 flex items-center justify-center">
              <svg fill="none" height="64" viewBox="0 0 64 64" width="64" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 52H52" stroke="#94a3b8" strokeLinecap="round" strokeWidth="2"></path>
                <rect className="dark:fill-slate-700" fill="#e2e8f0" height="24" rx="2" width="24" x="20" y="24"></rect>
              </svg>
            </div>
            <h3 className="text-slate-700 dark:text-slate-200 font-bold mb-1">Neutrals</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Context &amp; Depth</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Grays and subtle opacities provide context, background elements, and secondary information hierarchy.</p>
          </div>
        </div>
      </section>
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[#0d121b] dark:text-white text-2xl font-bold tracking-[-0.015em]">Application Contexts</h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-100 dark:border-slate-700 overflow-hidden">
            <div className="h-40 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center p-6">
              <svg fill="none" height="80" viewBox="0 0 100 80" width="100" xmlns="http://www.w3.org/2000/svg">
                <circle cx="40" cy="40" r="20" stroke="#135bec" strokeWidth="2"></circle>
                <path d="M55 55L70 70" stroke="#135bec" strokeLinecap="round" strokeWidth="2"></path>
                <rect fill="#EAB308" fillOpacity="0.1" height="15" rx="2" stroke="#EAB308" strokeWidth="1.5" width="25" x="55" y="15"></rect>
              </svg>
            </div>
            <div className="p-6">
              <h4 className="font-bold text-[#0d121b] dark:text-white mb-2">Empty States</h4>
              <p className="text-xs text-slate-500 mb-4 font-mono">Usage: Search results, Dashboards</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">Uses simplified geometric metaphors to communicate system status without overwhelming the user.</p>
            </div>
          </div>
          <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-100 dark:border-slate-700 overflow-hidden">
            <div className="h-40 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center p-6">
              <svg fill="none" height="80" viewBox="0 0 120 80" width="120" xmlns="http://www.w3.org/2000/svg">
                <rect className="dark:fill-slate-700" fill="#e2e8f0" height="30" rx="2" width="15" x="10" y="50"></rect>
                <rect className="dark:fill-slate-700" fill="#e2e8f0" height="50" rx="2" width="15" x="35" y="30"></rect>
                <rect fill="#135bec" height="40" rx="2" width="15" x="60" y="40"></rect>
                <rect className="dark:fill-slate-700" fill="#e2e8f0" height="60" rx="2" width="15" x="85" y="20"></rect>
                <circle cx="67.5" cy="30" fill="#EAB308" r="4"></circle>
              </svg>
            </div>
            <div className="p-6">
              <h4 className="font-bold text-[#0d121b] dark:text-white mb-2">Data Visualization</h4>
              <p className="text-xs text-slate-500 mb-4 font-mono">Usage: Analytics, Reports</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">Abstract representations of data. Yellow is used strictly to highlight the primary metric or outlier.</p>
            </div>
          </div>
          <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-100 dark:border-slate-700 overflow-hidden">
            <div className="h-40 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center p-6">
              <svg fill="none" height="80" viewBox="0 0 100 80" width="100" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 10L80 25V55L50 70L20 55V25L50 10Z" fill="none" stroke="#135bec" strokeWidth="2"></path>
                <path d="M50 30V50" stroke="#135bec" strokeWidth="2"></path>
                <path d="M50 10L50 30L80 25" stroke="#135bec" strokeDasharray="2 2" strokeOpacity="0.5" strokeWidth="1"></path>
                <path d="M20 25L50 30" stroke="#135bec" strokeDasharray="2 2" strokeOpacity="0.5" strokeWidth="1"></path>
                <circle cx="50" cy="50" fill="#EAB308" r="3"></circle>
              </svg>
            </div>
            <div className="p-6">
              <h4 className="font-bold text-[#0d121b] dark:text-white mb-2">Complex Icons</h4>
              <p className="text-xs text-slate-500 mb-4 font-mono">Usage: Features, Infrastructure</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">Isometric or 3D-inspired wireframes to represent complex technical infrastructure concepts.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};