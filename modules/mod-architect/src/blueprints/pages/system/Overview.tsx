import React from 'react';

export const Overview: React.FC = () => {
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-grid-pattern-custom pointer-events-none z-0"></div>
      <div className="relative z-10 max-w-5xl mx-auto">
        <header className="flex flex-col gap-6 md:flex-row md:items-end justify-between border-b border-border-dark pb-10 mb-12">
          <div className="flex flex-col gap-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 w-fit">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse"></span>
              <span className="text-xs font-semibold text-primary tracking-wide">SYSTEM UPDATED: 2023.10.24</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-[1.1] text-text-main dark:text-white">
              Visual Identity System
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed max-w-xl">
              A scalable, generative design system for loop.dev. Built for continuous improvement, technical precision, and automated workflows.
            </p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 h-10 px-5 bg-primary text-white text-sm font-bold rounded-lg hover:bg-blue-600 transition-colors shadow-lg shadow-blue-900/20">
              <span className="material-symbols-outlined text-[20px]">folder_zip</span>
              Assets
            </button>
          </div>
        </header>

        <section className="mb-16 scroll-mt-24" id="isotype">
          <div className="flex items-center gap-3 mb-6">
            <span className="flex items-center justify-center w-8 h-8 rounded bg-primary/20 text-primary font-bold text-sm">01</span>
            <h2 className="text-2xl font-bold tracking-tight text-text-main dark:text-white">The Isotype</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 group relative overflow-hidden rounded-xl border border-border-dark bg-surface-dark aspect-video lg:aspect-auto min-h-[300px] flex items-center justify-center">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background-dark to-background-dark opacity-50"></div>
              <div className="relative z-10 flex items-center justify-center">
                <span 
                  className="material-symbols-outlined text-[160px] text-white leading-none tracking-tighter" 
                  style={{ fontVariationSettings: "'FILL' 0, 'wght' 200, 'GRAD' 0, 'opsz' 48" }}
                >
                  all_inclusive
                </span>
              </div>
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                <div className="px-3 py-1 rounded bg-black/50 backdrop-blur text-xs font-mono text-slate-400 border border-white/10">
                  FIG. 1.0 — SYMBOL CONSTRUCTION
                </div>
                <button className="p-2 rounded-lg bg-primary/10 hover:bg-primary text-primary hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-[20px]">download</span>
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="p-6 rounded-xl bg-surface-dark border border-border-dark flex-1 flex flex-col justify-center">
                <span className="material-symbols-outlined text-primary text-3xl mb-3">all_inclusive</span>
                <h3 className="text-lg font-bold text-white mb-2">The Infinite Loop</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Represents continuous learning and generative cycles. The infinite loop symbol is the core of our visual language, symbolizing scalability and perpetual motion.
                </p>
              </div>
              <div className="p-6 rounded-xl bg-surface-dark border border-border-dark flex-1 flex flex-col justify-center">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Specs</h3>
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs font-mono text-slate-400">
                  <div>
                    <span className="block text-slate-600 mb-1">ASPECT RATIO</span>
                    <span className="text-white">Variable</span>
                  </div>
                  <div>
                    <span className="block text-slate-600 mb-1">GRID</span>
                    <span className="text-white">Pixel Perfect</span>
                  </div>
                  <div>
                    <span className="block text-slate-600 mb-1">STROKE</span>
                    <span className="text-white">Fluid</span>
                  </div>
                  <div>
                    <span className="block text-slate-600 mb-1">TYPE</span>
                    <span className="text-white">Iconography</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <span className="flex items-center justify-center w-8 h-8 rounded bg-primary/20 text-primary font-bold text-sm">02</span>
            <h2 className="text-2xl font-bold tracking-tight text-text-main dark:text-white">Primary Lockups</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-1 rounded-xl bg-gradient-to-b from-border-dark to-transparent">
              <div className="rounded-[10px] bg-background-dark p-8 h-full flex flex-col">
                <div className="flex-1 flex items-center justify-center min-h-[160px] border border-dashed border-slate-700 rounded-lg bg-surface-dark/50 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
                  <div className="relative z-10 flex items-center gap-3">
                    <span className="material-symbols-outlined text-[40px] text-white">all_inclusive</span>
                    <span className="text-2xl font-bold text-white tracking-tight">loop.dev</span>
                  </div>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <div>
                    <h4 className="text-white font-medium">Horizontal Lockup</h4>
                    <p className="text-slate-500 text-xs mt-1">Primary usage for web headers & print.</p>
                  </div>
                  <button className="text-xs font-bold text-primary hover:text-white uppercase tracking-wide px-3 py-1.5 rounded border border-primary/30 hover:bg-primary transition-colors">SVG</button>
                </div>
              </div>
            </div>
            <div className="p-1 rounded-xl bg-gradient-to-b from-border-dark to-transparent">
              <div className="rounded-[10px] bg-background-dark p-8 h-full flex flex-col">
                <div className="flex-1 flex items-center justify-center min-h-[160px] border border-dashed border-slate-700 rounded-lg bg-surface-dark/50 relative overflow-hidden">
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
                  <div className="relative z-10 flex flex-col items-center gap-1">
                    <span className="material-symbols-outlined text-[56px] text-white mb-1">all_inclusive</span>
                    <span className="text-2xl font-bold text-white tracking-tight">loop.dev</span>
                  </div>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <div>
                    <h4 className="text-white font-medium">Vertical Lockup</h4>
                    <p className="text-slate-500 text-xs mt-1">For avatars, social media, & merch.</p>
                  </div>
                  <button className="text-xs font-bold text-primary hover:text-white uppercase tracking-wide px-3 py-1.5 rounded border border-primary/30 hover:bg-primary transition-colors">SVG</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-16 scroll-mt-24" id="variants">
          <div className="flex items-center gap-3 mb-6">
            <span className="flex items-center justify-center w-8 h-8 rounded bg-primary/20 text-primary font-bold text-sm">03</span>
            <h2 className="text-2xl font-bold tracking-tight text-text-main dark:text-white">Logo Variants</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="group relative rounded-xl border border-border-dark bg-surface-dark overflow-hidden transition-all hover:border-primary/40">
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] opacity-50"></div>
              <div className="h-48 flex items-center justify-center relative z-10">
                <span className="material-symbols-outlined text-5xl text-primary mr-3">all_inclusive</span>
                <span className="text-2xl font-bold text-white tracking-tight">loop.dev</span>
              </div>
              <div className="px-4 py-3 bg-black/20 border-t border-border-dark flex justify-between items-center relative z-10">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Full Color (Dark)</span>
                <span className="w-3 h-3 rounded-full bg-surface-dark border border-slate-600"></span>
              </div>
            </div>
            <div className="group relative rounded-xl border border-slate-200 bg-white overflow-hidden transition-all hover:border-primary/40">
              <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:20px_20px] opacity-50"></div>
              <div className="h-48 flex items-center justify-center relative z-10">
                <span className="material-symbols-outlined text-5xl text-primary mr-3">all_inclusive</span>
                <span className="text-2xl font-bold text-slate-900 tracking-tight">loop.dev</span>
              </div>
              <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex justify-between items-center relative z-10">
                <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">Full Color (Light)</span>
                <span className="w-3 h-3 rounded-full bg-white border border-slate-300"></span>
              </div>
            </div>
            <div className="group relative rounded-xl border border-blue-500 bg-primary overflow-hidden transition-all hover:brightness-110">
              <div className="h-48 flex items-center justify-center relative z-10">
                <span className="material-symbols-outlined text-5xl text-white mr-3">all_inclusive</span>
                <span className="text-2xl font-bold text-white tracking-tight">loop.dev</span>
              </div>
              <div className="px-4 py-3 bg-black/10 border-t border-white/10 flex justify-between items-center relative z-10">
                <span className="text-xs font-mono text-blue-100 uppercase tracking-wider">Monochrome (Brand)</span>
                <span className="w-3 h-3 rounded-full bg-primary border border-white/30"></span>
              </div>
            </div>
            <div className="group relative rounded-xl border border-slate-200 bg-slate-50 overflow-hidden transition-all hover:border-slate-300">
              <div className="h-48 flex items-center justify-center relative z-10">
                <span className="material-symbols-outlined text-5xl text-slate-900 mr-3">all_inclusive</span>
                <span className="text-2xl font-bold text-slate-900 tracking-tight">loop.dev</span>
              </div>
              <div className="px-4 py-3 bg-white border-t border-slate-200 flex justify-between items-center relative z-10">
                <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">Monochrome (Positive)</span>
                <span className="w-3 h-3 rounded-full bg-slate-50 border border-slate-300"></span>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-16 scroll-mt-24" id="colors">
          <div className="flex items-center gap-3 mb-6">
            <span className="flex items-center justify-center w-8 h-8 rounded bg-primary/20 text-primary font-bold text-sm">04</span>
            <h2 className="text-2xl font-bold tracking-tight text-text-main dark:text-white">Color System</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="group relative rounded-xl overflow-hidden aspect-square flex flex-col border border-border-dark bg-primary cursor-pointer transition-transform active:scale-95">
              <div className="flex-1 p-4 flex items-start justify-between">
                <span className="text-white/80 font-mono text-xs">Structure</span>
                <span className="material-symbols-outlined text-white opacity-0 group-hover:opacity-100 transition-opacity text-sm">content_copy</span>
              </div>
              <div className="p-4 bg-black/10 backdrop-blur-sm">
                <p className="text-white font-bold text-lg">Blue 600</p>
                <p className="text-white/80 font-mono text-xs uppercase">#135BEC</p>
              </div>
            </div>
            <div className="group relative rounded-xl overflow-hidden aspect-square flex flex-col border border-yellow-600/30 bg-accent cursor-pointer transition-transform active:scale-95">
              <div className="flex-1 p-4 flex items-start justify-between">
                <span className="text-slate-900/60 font-mono text-xs font-bold">Energy</span>
                <span className="material-symbols-outlined text-slate-900 opacity-0 group-hover:opacity-100 transition-opacity text-sm">content_copy</span>
              </div>
              <div className="p-4 bg-white/20 backdrop-blur-sm">
                <p className="text-slate-900 font-bold text-lg">Yellow 400</p>
                <p className="text-slate-800 font-mono text-xs uppercase">#FACC15</p>
              </div>
            </div>
            <div className="group relative rounded-xl overflow-hidden aspect-square flex flex-col border border-border-dark bg-[#101622] cursor-pointer transition-transform active:scale-95">
              <div className="flex-1 p-4 flex items-start justify-between">
                <span className="text-slate-400 font-mono text-xs">Space</span>
                <span className="material-symbols-outlined text-white opacity-0 group-hover:opacity-100 transition-opacity text-sm">content_copy</span>
              </div>
              <div className="p-4 bg-white/5 backdrop-blur-sm">
                <p className="text-white font-bold text-lg">Slate 900</p>
                <p className="text-slate-400 font-mono text-xs uppercase">#101622</p>
              </div>
            </div>
            <div className="group relative rounded-xl overflow-hidden aspect-square flex flex-col border border-slate-200 bg-[#f6f6f8] cursor-pointer transition-transform active:scale-95">
              <div className="flex-1 p-4 flex items-start justify-between">
                <span className="text-slate-500 font-mono text-xs">Clarity</span>
                <span className="material-symbols-outlined text-slate-800 opacity-0 group-hover:opacity-100 transition-opacity text-sm">content_copy</span>
              </div>
              <div className="p-4 bg-black/5 backdrop-blur-sm">
                <p className="text-slate-900 font-bold text-lg">Slate 50</p>
                <p className="text-slate-600 font-mono text-xs uppercase">#F6F6F8</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-16 scroll-mt-24" id="brackets">
          <div className="flex items-center gap-3 mb-6">
            <span className="flex items-center justify-center w-8 h-8 rounded bg-primary/20 text-primary font-bold text-sm">05</span>
            <h2 className="text-2xl font-bold tracking-tight text-text-main dark:text-white">Supporting Elements: Brackets</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="group relative overflow-hidden rounded-xl border border-border-dark bg-surface-dark aspect-video lg:aspect-auto min-h-[320px] flex flex-col items-center justify-center">
              <div className="absolute inset-0 bg-grid-pattern opacity-30"></div>
              <div className="relative z-10 flex items-center font-mono text-6xl md:text-8xl font-bold text-white tracking-tighter select-none">
                <span className="text-primary mr-4 transition-transform duration-700 group-hover:-translate-x-4">{`{`}</span>
                <span className="text-2xl md:text-4xl tracking-widest uppercase text-slate-500 font-sans font-semibold">System</span>
                <span className="text-primary ml-4 transition-transform duration-700 group-hover:translate-x-4">{`}`}</span>
              </div>
              <div className="absolute bottom-4 left-0 w-full text-center">
                <p className="text-xs font-mono text-slate-500 uppercase tracking-widest">Fig 2.1 — Modular Containment</p>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="p-6 rounded-xl bg-surface-dark border border-border-dark flex-1">
                <h3 className="text-lg font-bold text-white mb-3">Concept & Role</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">
                  The curly brackets <span className="text-white font-mono bg-white/10 px-1 rounded">{`{}`}</span> serve as a supporting brand element representing <strong>containment</strong> and <strong>modular systems</strong>. They visually frame content, signaling that the enclosed elements are part of a calculated, generative process.
                </p>
                <div className="p-3 rounded bg-background-dark border border-border-dark">
                  <p className="text-xs text-slate-500 uppercase font-bold mb-2">Relationship to Isotype</p>
                  <p className="text-xs text-slate-400">The brackets are a structural device, not a logo substitute. They do not compete with the <span className="font-mono text-primary">{`{∞}`}</span> isotype but support it by defining space.</p>
                </div>
              </div>
              <div className="p-6 rounded-xl bg-surface-dark border border-border-dark flex-1">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Usage Guidelines</h3>
                </div>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-3 text-slate-400">
                    <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span>
                    <span><strong>Editorial:</strong> Framing keywords like <span className="font-mono text-white">{`{ systems }`}</span>.</span>
                  </li>
                  <li className="flex items-start gap-3 text-slate-400">
                    <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span>
                    <span><strong>UI Structure:</strong> Grouping related interface elements.</span>
                  </li>
                  <li className="flex items-start gap-3 text-slate-400">
                    <span className="material-symbols-outlined text-red-500 text-[18px]">cancel</span>
                    <span><strong>Don't:</strong> Use as a standalone logo or purely for decoration.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-primary/30 bg-primary/5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white font-mono text-xl font-bold">{`{`}</div>
              <div>
                <h4 className="text-white font-bold text-sm">Structure</h4>
                <p className="text-xs text-slate-500">Primary Blue (#135BEC)</p>
              </div>
            </div>
            <div className="p-4 rounded-xl border border-accent/30 bg-accent/5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center text-slate-900 font-mono text-xl font-bold">{`{`}</div>
              <div>
                <h4 className="text-white font-bold text-sm">Emphasis</h4>
                <p className="text-xs text-slate-500">Brand Yellow (#FACC15)</p>
              </div>
            </div>
            <div className="p-4 rounded-xl border border-border-dark bg-surface-dark flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-slate-700 flex items-center justify-center text-slate-300 font-mono text-xl font-bold">{`{`}</div>
              <div>
                <h4 className="text-white font-bold text-sm">Containment</h4>
                <p className="text-xs text-slate-500">Neutral Tones</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-12 scroll-mt-24" id="applications">
          <div className="flex items-center gap-3 mb-6">
            <span className="flex items-center justify-center w-8 h-8 rounded bg-primary/20 text-primary font-bold text-sm">06</span>
            <h2 className="text-2xl font-bold tracking-tight text-text-main dark:text-white">Applications</h2>
          </div>
          <div className="rounded-xl border border-border-dark bg-surface-dark overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border-dark">
              <div className="p-8 flex flex-col items-center gap-6">
                <div className="w-full max-w-[200px] bg-background-dark rounded-t-lg border border-border-dark shadow-xl overflow-hidden">
                  <div className="h-8 bg-[#2d3442] flex items-center px-2 gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
                    </div>
                    <div className="ml-2 px-3 h-5 bg-background-dark rounded-t text-[10px] text-white flex items-center gap-1.5 min-w-[80px]">
                      <span className="material-symbols-outlined text-[14px] text-primary">all_inclusive</span>
                      <span className="truncate">loop.dev</span>
                    </div>
                  </div>
                  <div className="h-20 bg-background-dark p-4 flex items-center justify-center">
                    <p className="text-slate-600 text-[10px]">Browser Context</p>
                  </div>
                </div>
                <div className="text-center">
                  <h5 className="text-white font-medium text-sm">Favicon</h5>
                  <p className="text-slate-500 text-xs">16x16px / 32x32px</p>
                </div>
              </div>
              <div className="p-8 flex flex-col items-center gap-6">
                <div className="w-[120px] aspect-[9/16] bg-background-dark border-4 border-[#2d3442] rounded-[1rem] shadow-xl flex flex-col items-center justify-center gap-4 relative overflow-hidden" data-alt="mobile screen mockup showing app icon">
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent"></div>
                  <div className="w-12 h-12 bg-primary rounded-xl shadow-lg flex items-center justify-center">
                    <span className="material-symbols-outlined text-[32px] text-white">all_inclusive</span>
                  </div>
                  <div className="w-8 h-1 bg-white/20 rounded-full"></div>
                </div>
                <div className="text-center">
                  <h5 className="text-white font-medium text-sm">App Icon</h5>
                  <p className="text-slate-500 text-xs">iOS & Android</p>
                </div>
              </div>
              <div className="p-8 flex flex-col items-center justify-center gap-6">
                <div className="flex flex-col gap-6 items-center">
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center text-black">
                        <span className="material-symbols-outlined text-[40px] text-black">all_inclusive</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">64px</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-8 h-8 bg-white rounded flex items-center justify-center text-black">
                        <span className="material-symbols-outlined text-[20px] text-black">all_inclusive</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">32px</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-4 h-4 bg-white rounded-sm flex items-center justify-center text-black">
                        <span className="material-symbols-outlined text-[12px] text-black">all_inclusive</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">16px</span>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <h5 className="text-white font-medium text-sm">Scale Test</h5>
                  <p className="text-slate-500 text-xs">Minimum legibility check</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer className="border-t border-border-dark pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-sm">
          <p>© 2024 loop.dev Inc. All rights reserved.</p>
          <div className="flex gap-4">
            <a className="hover:text-primary transition-colors" href="#">Support</a>
            <a className="hover:text-primary transition-colors" href="#">Internal Wiki</a>
          </div>
        </footer>
      </div>
    </div>
  );
};