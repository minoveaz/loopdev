import React from 'react';

export const AdvancedUI: React.FC = () => {
  return (
    <div className="max-w-[1200px] mx-auto p-6 md:p-12 pb-24">
      {/* Header */}
      <div className="mb-16">
        <div className="flex flex-col gap-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></span>
            <span className="text-accent-hover dark:text-accent text-xs font-bold uppercase tracking-wide">System Update v2.4</span>
          </div>
          <h1 className="text-[#0d121b] dark:text-white text-4xl md:text-5xl font-black leading-tight tracking-[-0.033em]">
            Accent & <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-orange-400">Advanced UI</span>
          </h1>
          <p className="text-[#4c669a] dark:text-slate-400 text-lg max-w-2xl leading-relaxed">
            Leveraging our signature yellow accent to direct attention and convey energy within a controlled, systemic environment. Featuring glassmorphism, advanced gradients, and precision interaction.
          </p>
        </div>
      </div>

      {/* Hero Example */}
      <section className="mb-16">
        <div className="relative w-full rounded-2xl overflow-hidden bg-background-dark border border-slate-800 shadow-2xl group">
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
          <div className="absolute -right-20 -top-20 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl"></div>
          <div className="absolute left-1/3 bottom-0 w-[300px] h-[300px] bg-blue-600/10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-6">
              <h2 className="text-3xl font-bold text-white tracking-tight">Controlled Energy</h2>
              <p className="text-slate-400 leading-relaxed">
                The accent yellow is not just a color; it's a functional signal. It cuts through the noise of complex data layers, guiding the user to the primary action or critical system status.
              </p>
              <div className="flex gap-4 pt-4">
                <button className="relative px-6 py-3 bg-accent text-black font-bold text-sm rounded-lg shadow-[0_0_20px_rgba(255,208,37,0.4)] hover:shadow-[0_0_30px_rgba(255,208,37,0.6)] hover:scale-[1.02] transition-all flex items-center gap-2">
                  <span>Initiate Sequence</span>
                  <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </button>
                <button className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 font-medium text-sm rounded-lg backdrop-blur-sm transition-colors flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg text-slate-400">code</span>
                  View Documentation
                </button>
              </div>
            </div>
            
            <div className="flex-1 w-full flex justify-center">
              <div className="relative w-full max-w-sm aspect-video bg-glass-surface backdrop-blur-xl border border-glass-border rounded-xl p-6 shadow-2xl flex flex-col justify-between overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-50"></div>
                <div className="flex justify-between items-center mb-4">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                  </div>
                  <span className="text-[10px] font-mono text-accent uppercase tracking-wider">System Active</span>
                </div>
                <div className="space-y-3">
                  <div className="h-2 w-3/4 bg-slate-700/50 rounded-full overflow-hidden">
                    <div className="h-full bg-accent w-2/3 shadow-[0_0_10px_rgba(255,208,37,0.5)]"></div>
                  </div>
                  <div className="h-2 w-1/2 bg-slate-700/50 rounded-full"></div>
                  <div className="h-2 w-full bg-slate-700/50 rounded-full"></div>
                </div>
                <div className="mt-6 p-3 rounded bg-black/20 border border-white/5 flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-accent flex items-center justify-center text-black">
                    <span className="material-symbols-outlined text-lg">bolt</span>
                  </div>
                  <div>
                    <div className="text-xs text-slate-300 font-bold">Energy Output</div>
                    <div className="text-[10px] text-slate-500 font-mono">98.4% Efficiency</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Components Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
        
        {/* Interaction Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[#0d121b] dark:text-white text-xl font-bold">Primary Interaction</h3>
            <span className="text-xs font-mono text-slate-500">CTA & Buttons</span>
          </div>
          <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded-xl p-8 space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase">Primary</label>
                <button className="w-full py-2.5 px-4 bg-accent hover:bg-accent-hover text-black font-semibold rounded shadow-md flex items-center justify-center gap-2 transition-colors">
                  <span className="material-symbols-outlined text-[20px]">add</span>
                  Create New
                </button>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase">Secondary</label>
                <button className="w-full py-2.5 px-4 bg-transparent border-2 border-slate-200 dark:border-slate-700 hover:border-accent text-[#0d121b] dark:text-white hover:text-accent font-semibold rounded flex items-center justify-center gap-2 transition-colors">
                  <span className="material-symbols-outlined text-[20px]">tune</span>
                  Configure
                </button>
              </div>
            </div>
            
            <div className="border-t border-slate-100 dark:border-slate-800 pt-8">
              <label className="text-xs font-bold text-slate-400 uppercase mb-4 block">Interactive States</label>
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-slate-400">notifications</span>
                    <span className="text-sm font-medium text-[#0d121b] dark:text-white">Push Notifications</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                  </label>
                </div>
                
                <div className="space-y-3 px-3">
                  <div className="flex justify-between text-xs font-medium text-slate-500">
                    <span>Capacity</span>
                    <span className="text-accent">75%</span>
                  </div>
                  <div className="relative w-full h-1 bg-slate-200 dark:bg-slate-700 rounded-full">
                    <div className="absolute h-full bg-accent rounded-full" style={{ width: '75%' }}></div>
                    <input className="absolute w-full h-full opacity-0 cursor-pointer z-10" type="range" min="0" max="100" defaultValue="75" />
                    <div className="absolute top-1/2 -mt-2 -ml-2 left-[75%] w-4 h-4 bg-accent rounded-full border-2 border-white dark:border-[#0d121b] shadow-lg pointer-events-none"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Glassmorphism Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[#0d121b] dark:text-white text-xl font-bold">Glassmorphism & Depth</h3>
            <span className="text-xs font-mono text-slate-500">Backdrop Filters</span>
          </div>
          <div className="relative h-full min-h-[400px] rounded-xl overflow-hidden bg-[#0d121b] flex items-center justify-center p-8 group">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-slate-900 to-black"></div>
            <div className="absolute top-[-50%] left-[-20%] w-[80%] h-[80%] bg-purple-900/30 rounded-full blur-[80px]"></div>
            <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-blue-900/20 rounded-full blur-[60px]"></div>
            
            <div className="relative w-full max-w-sm bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-2xl transition-transform duration-500 hover:scale-[1.02] hover:bg-white/10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent to-orange-500 flex items-center justify-center text-black shadow-lg shadow-orange-500/20">
                    <span className="material-symbols-outlined">security</span>
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm">Security Layer</h4>
                    <p className="text-xs text-white/50">Encrypted Connection</p>
                  </div>
                </div>
                <span className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.6)] animate-pulse"></span>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="bg-black/20 rounded-lg p-3 border border-white/5">
                  <div className="flex justify-between text-xs text-white/70 mb-1">
                    <span>Encryption Key</span>
                    <span className="font-mono text-accent">valid</span>
                  </div>
                  <div className="font-mono text-[10px] text-white/40 break-all">
                    0x7A9...3F2B
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="h-1 flex-1 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full bg-white/40 w-full animate-[shimmer_2s_infinite]"></div>
                  </div>
                  <div className="h-1 w-2 rounded-full bg-white/10"></div>
                  <div className="h-1 w-2 rounded-full bg-white/10"></div>
                </div>
              </div>
              
              <button className="w-full py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-bold text-white transition-colors">
                View Details
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Surface Treatments */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-[#0d121b] dark:text-white text-xl font-bold">Graded Textures</h3>
          <span className="text-xs font-mono text-slate-500">Surface Treatments</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="group h-40 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-700 p-6 relative overflow-hidden transition-all hover:shadow-lg">
            <div className="absolute top-0 right-0 p-4 opacity-50 group-hover:opacity-100 transition-opacity">
              <span className="material-symbols-outlined text-slate-400">texture</span>
            </div>
            <h4 className="font-bold text-sm text-[#0d121b] dark:text-white mb-1">Subtle Mesh</h4>
            <p className="text-xs text-slate-500">Standard background for card elements.</p>
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-radial from-slate-200/50 to-transparent dark:from-slate-700/50 blur-xl"></div>
          </div>
          
          <div className="group h-40 rounded-xl bg-[#0f1115] border border-slate-800 p-6 relative overflow-hidden transition-all hover:shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute top-0 right-0 p-4 opacity-50 group-hover:opacity-100 transition-opacity">
              <span className="material-symbols-outlined text-accent">light_mode</span>
            </div>
            <h4 className="font-bold text-sm text-white mb-1">Accent Glow</h4>
            <p className="text-xs text-slate-400">Hover states and active highlights.</p>
            <div className="absolute -left-4 -bottom-4 w-24 h-24 bg-accent/20 rounded-full blur-2xl"></div>
          </div>
          
          <div className="group h-40 rounded-xl bg-gradient-to-br from-primary to-blue-700 p-6 relative overflow-hidden text-white shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02]">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
            <div className="absolute top-0 right-0 p-4 opacity-70">
              <span className="material-symbols-outlined text-white">blur_on</span>
            </div>
            <h4 className="font-bold text-sm text-white mb-1">Brand Gradient</h4>
            <p className="text-xs text-blue-100">Primary marketing surfaces.</p>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white/20 rounded-full blur-3xl"></div>
          </div>
        </div>
      </section>
    </div>
  );
};