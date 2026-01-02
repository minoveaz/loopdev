import React, { useState } from 'react';

export const AdvancedUI2: React.FC = () => {
  const [sliderValue, setSliderValue] = useState(75);

  return (
    <div className="max-w-[1200px] mx-auto p-6 md:p-12 pb-24">
      <div className="mb-16">
        <div className="flex flex-col gap-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 border border-blue-500/10 w-fit">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="text-primary dark:text-blue-300 text-xs font-bold uppercase tracking-wide">System Update v3.0</span>
          </div>
          <h1 className="text-[#0d121b] dark:text-white text-4xl md:text-5xl font-black leading-tight tracking-[-0.033em]">
            Harmonious <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-accent">Color Fusion</span>
          </h1>
          <p className="text-[#4c669a] dark:text-slate-400 text-lg max-w-2xl leading-relaxed">
            Exploring the intersection of our technical blue and energetic yellow. Using dual-tone gradients and intelligent layering to create a cohesive, modern visual language.
          </p>
        </div>
      </div>

      <section className="mb-16">
        <div className="relative w-full rounded-2xl overflow-hidden bg-background-dark border border-slate-800 shadow-2xl group">
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
          <div className="absolute -right-20 -top-20 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] mix-blend-screen"></div>
          <div className="absolute left-[-10%] bottom-[-10%] w-[500px] h-[500px] bg-accent/10 rounded-full blur-[100px] mix-blend-screen"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-gradient-to-br from-primary to-accent opacity-10 rounded-full blur-[80px]"></div>
          
          <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-6">
              <h2 className="text-3xl font-bold text-white tracking-tight">The <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Loop Blend</span></h2>
              <p className="text-slate-400 leading-relaxed">
                By bridging our primary blue (stability) with accent yellow (innovation), we create UI elements that feel both grounded and electric. This "loop blend" is used for high-priority actions and featured content.
              </p>
              <div className="flex gap-4 pt-4">
                <button className="relative group px-6 py-3 font-bold text-sm rounded-lg bg-background-dark overflow-hidden transition-all hover:scale-[1.02] shadow-lg shadow-blue-500/20">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary opacity-20 group-hover:opacity-30 transition-opacity"></div>
                  <div className="absolute bottom-0 left-0 h-[2px] w-full bg-gradient-to-r from-primary to-accent"></div>
                  <span className="relative z-10 flex items-center gap-2 text-white">
                    <span>Explore Integration</span>
                    <span className="material-symbols-outlined text-lg text-accent">arrow_forward</span>
                  </span>
                </button>
                <button className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 font-medium text-sm rounded-lg backdrop-blur-sm transition-colors flex items-center gap-2 group">
                  <span className="material-symbols-outlined text-lg text-slate-400 group-hover:text-primary transition-colors">palette</span>
                  View Tokens
                </button>
              </div>
            </div>
            
            <div className="flex-1 w-full flex justify-center">
              <div className="relative w-full max-w-sm aspect-video bg-glass-surface backdrop-blur-xl border border-glass-border rounded-xl p-6 shadow-2xl flex flex-col justify-between overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-primary via-accent to-primary"></div>
                <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-accent/20 blur-2xl rounded-full"></div>
                <div className="absolute -left-10 -top-10 w-32 h-32 bg-primary/20 blur-2xl rounded-full"></div>
                
                <div className="flex justify-between items-center mb-4 relative z-10">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                  </div>
                  <span className="text-[10px] font-mono text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent uppercase tracking-wider font-bold">System Harmony</span>
                </div>
                
                <div className="space-y-4 relative z-10">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                      <span>Processing</span>
                      <span className="text-accent">78%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-700/50 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-primary to-accent w-[78%] shadow-[0_0_15px_rgba(255,208,37,0.3)]"></div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="h-2 flex-1 bg-slate-700/50 rounded-full overflow-hidden">
                      <div className="h-full w-1/2 bg-primary"></div>
                    </div>
                    <div className="h-2 flex-1 bg-slate-700/50 rounded-full overflow-hidden">
                      <div className="h-full w-3/4 bg-blue-500/50"></div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-auto pt-4 relative z-10">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-primary/10 to-accent/5 border border-white/5 flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                      <span className="material-symbols-outlined text-lg">bolt</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <div className="text-xs text-white font-bold">Energy Sync</div>
                        <div className="text-[10px] text-accent font-mono font-bold">Optimized</div>
                      </div>
                      <div className="text-[10px] text-slate-400">Blue-Yellow Matrix Active</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
        <section>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[#0d121b] dark:text-white text-xl font-bold">Dual-Tone Interaction</h3>
            <span className="text-xs font-mono text-slate-500">CTA & Controls</span>
          </div>
          <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded-xl p-8 space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-accent/5 to-transparent"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-10">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase">Primary Blend</label>
                <button className="group w-full py-2.5 px-4 bg-[#0d121b] text-white font-semibold rounded shadow-md flex items-center justify-center gap-2 transition-all hover:shadow-lg relative overflow-hidden border border-slate-800">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary via-[#0d121b] to-accent opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
                  <span className="material-symbols-outlined text-[20px] text-primary group-hover:text-accent transition-colors">add_circle</span>
                  <span className="group-hover:text-white transition-colors">Create New</span>
                </button>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase">Accent Outline</label>
                <button className="group w-full py-2.5 px-4 bg-transparent border-2 border-slate-200 dark:border-slate-700 hover:border-primary text-[#0d121b] dark:text-white font-semibold rounded flex items-center justify-center gap-2 transition-all relative overflow-hidden">
                  <span className="absolute right-0 top-0 h-2 w-2 rounded-bl bg-accent opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  <span className="material-symbols-outlined text-[20px] group-hover:text-primary transition-colors">tune</span>
                  Configure
                </button>
              </div>
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800 pt-8 relative z-10">
              <label className="text-xs font-bold text-slate-400 uppercase mb-4 block">Blended States</label>
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border border-transparent hover:border-blue-500/10">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined text-sm">notifications</span>
                    </div>
                    <span className="text-sm font-medium text-[#0d121b] dark:text-white">Smart Notifications</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-primary peer-checked:to-accent"></div>
                  </label>
                </div>

                <div className="space-y-3 px-3">
                  <div className="flex justify-between text-xs font-medium text-slate-500">
                    <span>Color Balance</span>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent font-bold">{sliderValue}%</span>
                  </div>
                  <div className="relative w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full">
                    <div className="absolute h-full bg-gradient-to-r from-primary to-accent rounded-full" style={{ width: `${sliderValue}%` }}></div>
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={sliderValue} 
                      onChange={(e) => setSliderValue(Number(e.target.value))}
                      className="absolute w-full h-full opacity-0 cursor-pointer z-10 top-[-6px]"
                    />
                    <div className="absolute top-1/2 -mt-2 -ml-2 w-4 h-4 bg-accent rounded-full border-2 border-white dark:border-[#0d121b] shadow-lg pointer-events-none ring-2 ring-primary/20" style={{ left: `${sliderValue}%` }}></div>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono pt-1">
                    <span>Blue (0%)</span>
                    <span>Blend (50%)</span>
                    <span>Yellow (100%)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[#0d121b] dark:text-white text-xl font-bold">Glass & Gradients</h3>
            <span className="text-xs font-mono text-slate-500">Layered Depth</span>
          </div>
          <div className="relative h-full min-h-[400px] rounded-xl overflow-hidden bg-[#0d121b] flex items-center justify-center p-8 group">
            <div className="absolute inset-0 bg-blend-mesh opacity-60"></div>
            <div className="absolute top-[-50%] left-[-20%] w-[80%] h-[80%] bg-primary/20 rounded-full blur-[100px] animate-pulse"></div>
            <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-accent/10 rounded-full blur-[80px]"></div>
            
            <div className="relative w-full max-w-sm bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-2xl transition-transform duration-500 hover:scale-[1.02] hover:bg-white/10 z-10">
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent to-transparent opacity-50"></div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-blue-700 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 ring-1 ring-white/10">
                    <span className="material-symbols-outlined text-accent">security</span>
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm">Secure Core</h4>
                    <p className="text-xs text-blue-200/50">Encrypted Connection</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-accent/10 border border-accent/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></span>
                  <span className="text-[10px] font-bold text-accent uppercase">Live</span>
                </div>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="bg-black/40 rounded-lg p-3 border border-white/5 relative overflow-hidden group/code">
                  <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-primary to-accent"></div>
                  <div className="flex justify-between text-xs text-white/70 mb-1 pl-2">
                    <span>Verification Token</span>
                    <span className="font-mono text-accent">valid</span>
                  </div>
                  <div className="font-mono text-[10px] text-white/40 break-all pl-2 group-hover/code:text-white/60 transition-colors">
                    0x7A9...3F2B
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                  <div className="h-1.5 flex-1 rounded-full bg-white/10 overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary animate-shimmer-slow w-[200%]"></div>
                  </div>
                </div>
              </div>
              
              <button className="w-full py-2.5 rounded-lg bg-gradient-to-r from-white/5 to-white/10 hover:from-primary/20 hover:to-accent/10 border border-white/10 hover:border-accent/30 text-xs font-bold text-white transition-all shadow-lg">
                View Security Details
              </button>
            </div>
          </div>
        </section>
      </div>

      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-[#0d121b] dark:text-white text-xl font-bold">Graded Textures</h3>
          <span className="text-xs font-mono text-slate-500">Surface Treatments</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="group h-44 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-700 p-6 relative overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
            <div className="absolute top-0 right-0 p-4 opacity-50 group-hover:opacity-100 transition-opacity">
              <span className="material-symbols-outlined text-primary">texture</span>
            </div>
            <h4 className="font-bold text-sm text-[#0d121b] dark:text-white mb-1">Subtle Mesh</h4>
            <p className="text-xs text-slate-500">Standard background for card elements.</p>
            <div className="absolute bottom-[-20%] right-[-20%] w-32 h-32 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-colors"></div>
          </div>
          
          <div className="group h-44 rounded-xl bg-[#0f1115] border border-slate-800 p-6 relative overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute top-0 right-0 p-4 opacity-50 group-hover:opacity-100 transition-opacity">
              <span className="material-symbols-outlined text-accent">light_mode</span>
            </div>
            <h4 className="font-bold text-sm text-white mb-1">Dual Glow</h4>
            <p className="text-xs text-slate-400">Hover states blending both brand colors.</p>
            <div className="absolute -left-4 -bottom-4 w-24 h-24 bg-primary/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-accent/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700 delay-75"></div>
          </div>
          
          <div className="group h-44 rounded-xl bg-gradient-to-br from-primary to-blue-800 p-6 relative overflow-hidden text-white shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02] hover:shadow-accent/20">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-accent/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute top-0 right-0 p-4 opacity-70">
              <span className="material-symbols-outlined text-white">blur_on</span>
            </div>
            <h4 className="font-bold text-sm text-white mb-1 relative z-10">Active Brand Gradient</h4>
            <p className="text-xs text-blue-100 relative z-10">Primary marketing surfaces.</p>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:bg-accent/20 transition-colors"></div>
          </div>
        </div>
      </section>
    </div>
  );
};
