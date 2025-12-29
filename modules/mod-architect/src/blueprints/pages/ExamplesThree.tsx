import React from 'react';

export const ExamplesThree: React.FC = () => {
  return (
    <div className="mx-auto max-w-5xl px-6 py-12 lg:px-12">
      <div className="mb-16">
        <div className="flex items-center gap-2 mb-4 text-sm text-text-muted font-mono">
          <span>Applications</span>
          <span className="text-border-light dark:text-gray-700">/</span>
          <span className="text-primary">Overview</span>
        </div>
        <h1 className="text-4xl font-black tracking-tight text-text-main dark:text-white sm:text-5xl mb-6">
          Application Examples
        </h1>
        <p className="max-w-3xl text-lg text-text-muted leading-relaxed">
          A visual guide on how the <span className="text-primary font-medium">{'{ loop.dev }'}</span> identity system scales across different environments. From web interfaces to documentation, these examples demonstrate the application of our core principles: structure, minimalism, and technical precision.
        </p>
      </div>
      
      {/* 01. Web Environment */}
      <section className="mb-24">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-text-main dark:text-white">01. Web Environment</h3>
          <span className="font-mono text-xs text-text-muted bg-background-subtle px-2 py-1 rounded border border-border-light dark:border-gray-700 dark:bg-gray-800">Context: Landing Page</span>
        </div>
        <div className="rounded-xl border border-border-light bg-background-subtle shadow-2xl overflow-hidden dark:border-border-dark dark:bg-gray-900 group">
          <div className="flex items-center gap-2 border-b border-border-light bg-white px-4 py-3 dark:border-border-dark dark:bg-gray-800">
            <div className="flex gap-1.5">
              <div className="h-3 w-3 rounded-full bg-red-400/80"></div>
              <div className="h-3 w-3 rounded-full bg-amber-400/80"></div>
              <div className="h-3 w-3 rounded-full bg-green-400/80"></div>
            </div>
            <div className="ml-4 flex-1 rounded bg-gray-100 px-3 py-1 text-center text-xs text-text-muted font-mono dark:bg-gray-900">
              loop.dev/platform
            </div>
          </div>
          <div className="relative bg-white dark:bg-background-dark px-8 py-16 lg:px-16 lg:py-24">
            <div className="absolute inset-0 bg-grid-pattern opacity-[0.4] pointer-events-none"></div>
            <div className="relative z-10 grid gap-12 lg:grid-cols-2 lg:items-center">
              <div>
                <div className="mb-6 inline-flex items-center gap-2 rounded border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
                  <span className="font-mono">{'{ v3.0 }'}</span>
                  <span>Now Available</span>
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-text-main dark:text-white sm:text-4xl lg:text-5xl mb-6">
                  Automate your <br />
                  <span className="text-primary">Growth Loops</span>
                </h2>
                <p className="text-sm text-text-muted leading-relaxed mb-8 max-w-md">
                  Deploy generative systems that scale with your business. Structure your data, refine your metrics, and repeat the cycle of success.
                </p>
                <div className="flex gap-4">
                  <button className="rounded bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-500/25">Get Started</button>
                  <button className="rounded border border-border-light px-5 py-2.5 text-sm font-bold text-text-main dark:text-white dark:border-gray-700">Documentation</button>
                </div>
              </div>
              <div className="relative">
                <div className="absolute -inset-4 rounded-xl bg-gradient-to-r from-primary/10 to-blue-400/10 blur-xl"></div>
                <div className="relative rounded-lg border border-border-light bg-white p-6 shadow-lg dark:bg-gray-800 dark:border-gray-700">
                  <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-4 dark:border-gray-700">
                    <span className="text-xs font-bold uppercase text-text-muted">System Velocity</span>
                    <span className="font-mono text-xs text-primary">{'{active}'}</span>
                  </div>
                  <div className="space-y-3">
                    <div className="h-2 w-full rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                      <div className="h-full w-3/4 bg-primary rounded-full"></div>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-text-muted">Optimization</span>
                      <span className="font-mono font-bold text-text-main dark:text-white">78%</span>
                    </div>
                    <div className="mt-4 rounded bg-background-subtle p-3 font-mono text-[10px] text-text-muted dark:bg-gray-900 border border-border-light dark:border-gray-700">
                      <span className="text-primary">function</span> <span className="text-amber-600 dark:text-energy">loop</span>() {'{'}<br />
                      &nbsp;&nbsp;return scale * <span className="text-blue-500">infinity</span>;<br />
                      {'}'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 02. Component Architecture */}
      <section className="mb-24">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-text-main dark:text-white">02. Component Architecture</h3>
          <span className="font-mono text-xs text-text-muted bg-background-subtle px-2 py-1 rounded border border-border-light dark:border-gray-700 dark:bg-gray-800">Context: App Interface</span>
        </div>
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="flex flex-col gap-4">
            <span className="text-xs font-bold uppercase tracking-wider text-text-muted">Content Card</span>
            <div className="group relative overflow-hidden rounded-lg border border-border-light bg-white p-6 transition-all hover:border-primary/50 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800 h-full">
              <div className="absolute top-0 right-0 p-6 opacity-0 transition-opacity group-hover:opacity-100">
                <span className="material-symbols-outlined text-primary text-[20px]">arrow_outward</span>
              </div>
              <div className="mb-4 inline-flex size-10 items-center justify-center rounded bg-background-subtle text-text-main dark:bg-gray-900 dark:text-white">
                <span className="material-symbols-outlined text-[20px]">dataset</span>
              </div>
              <h4 className="mb-2 text-lg font-bold text-text-main dark:text-white">Data Structure</h4>
              <p className="mb-4 text-sm text-text-muted">Automated organization of incoming data streams using generative classification.</p>
              <div className="flex items-center gap-2 border-t border-border-light pt-4 dark:border-gray-700 mt-auto">
                <span className="size-2 rounded-full bg-energy"></span>
                <span className="font-mono text-xs text-text-muted">Processing...</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <span className="text-xs font-bold uppercase tracking-wider text-text-muted">App Header</span>
            <div className="rounded-lg border border-border-light bg-background-subtle p-8 dark:border-gray-700 dark:bg-gray-900 h-full flex items-center">
              <div className="w-full rounded border border-border-light bg-white px-4 py-3 shadow-sm dark:bg-gray-800 dark:border-gray-600">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-text-main dark:text-white">
                      <span className="material-symbols-outlined text-primary text-[20px]">all_inclusive</span>
                      <span className="font-bold text-sm">Dashboard</span>
                    </div>
                    <div className="h-4 w-px bg-border-light dark:bg-gray-600"></div>
                    <div className="flex gap-4">
                      <a className="text-xs font-medium text-text-main dark:text-white" href="#">Overview</a>
                      <a className="text-xs font-medium text-text-muted hover:text-primary" href="#">Analytics</a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-text-muted font-mono bg-gray-100 dark:bg-gray-900 px-1.5 py-0.5 rounded">⌘K</span>
                    <div className="size-6 rounded-full bg-gradient-to-br from-primary to-blue-400"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 03. Communication & Marketing */}
      <section className="mb-24">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-text-main dark:text-white">03. Communication &amp; Marketing</h3>
          <span className="font-mono text-xs text-text-muted bg-background-subtle px-2 py-1 rounded border border-border-light dark:border-gray-700 dark:bg-gray-800">Context: Email &amp; Social</span>
        </div>
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="flex flex-col gap-4">
            <span className="text-xs font-bold uppercase tracking-wider text-text-muted">Transactional Email</span>
            <div className="rounded-lg border border-border-light bg-background-subtle p-8 dark:border-gray-700 dark:bg-gray-900 flex justify-center">
              <div className="w-full max-w-sm bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-border-light dark:border-gray-600 overflow-hidden">
                <div className="bg-background-subtle dark:bg-gray-900 px-6 py-4 border-b border-border-light dark:border-gray-700 flex justify-between items-center">
                  <span className="font-bold text-sm tracking-tight flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[18px]">all_inclusive</span>
                    loop.dev
                  </span>
                  <span className="text-[10px] text-text-muted font-mono">ID: 9942</span>
                </div>
                <div className="p-6">
                  <h4 className="text-base font-bold mb-2">System Update Complete</h4>
                  <p className="text-xs text-text-muted mb-4 leading-relaxed">Your generative model has finished training. The new parameters have been deployed to your active cluster.</p>
                  <div className="bg-gray-50 dark:bg-gray-900/50 rounded p-3 mb-4 border border-border-light dark:border-gray-700 font-mono text-[10px] text-text-muted">
                    <div className="flex justify-between mb-1"><span>Model:</span> <span className="text-text-main dark:text-white">Gen-Alpha-V2</span></div>
                    <div className="flex justify-between"><span>Status:</span> <span className="text-green-500">Active</span></div>
                  </div>
                  <button className="w-full bg-primary text-white text-xs font-medium py-2 rounded hover:bg-primary-dark transition-colors">View Dashboard</button>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900 px-6 py-3 text-[10px] text-text-muted text-center border-t border-border-light dark:border-gray-700">
                  Manage notifications settings
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <span className="text-xs font-bold uppercase tracking-wider text-text-muted">Social Media Graphic (1:1)</span>
            <div className="rounded-lg border border-border-light bg-background-subtle p-8 dark:border-gray-700 dark:bg-gray-900 flex justify-center items-center">
              <div className="size-64 bg-background-dark relative overflow-hidden flex flex-col justify-between p-6 shadow-xl group cursor-pointer">
                <div className="absolute inset-0 bg-grid-pattern-dark opacity-20"></div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-bl-full blur-2xl group-hover:bg-primary/30 transition-all duration-500"></div>
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-white/10 backdrop-blur border border-white/10 mb-4">
                    <span className="size-1.5 rounded-full bg-energy animate-pulse"></span>
                    <span className="text-[8px] font-mono text-white uppercase tracking-wider">Webinar</span>
                  </div>
                  <h3 className="text-2xl font-display font-black text-white leading-none">
                    Scale<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-300">Infinite</span><br />
                    Systems.
                  </h3>
                </div>
                <div className="relative z-10 flex justify-between items-end border-t border-white/10 pt-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-400 font-mono">Guest Speaker</span>
                    <span className="text-xs text-white font-medium">Alex Chen</span>
                  </div>
                  <div className="size-8 rounded-full bg-white text-background-dark flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 04. Collateral & Documentation */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-text-main dark:text-white">04. Collateral &amp; Documentation</h3>
          <span className="font-mono text-xs text-text-muted bg-background-subtle px-2 py-1 rounded border border-border-light dark:border-gray-700 dark:bg-gray-800">Context: Print &amp; Slides</span>
        </div>
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="flex flex-col gap-4">
            <span className="text-xs font-bold uppercase tracking-wider text-text-muted">Technical Documentation (A4)</span>
            <div className="flex justify-center rounded-lg border border-border-light bg-background-subtle p-8 dark:border-gray-700 dark:bg-gray-900">
              <div className="aspect-[1/1.41] w-full max-w-[300px] bg-white shadow-xl dark:bg-black relative flex flex-col justify-between p-8 overflow-hidden group hover:translate-y-[-4px] transition-transform duration-300">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary opacity-10 rounded-bl-full group-hover:scale-110 transition-transform duration-500"></div>
                <div className="absolute bottom-0 left-0 w-32 h-1 bg-gradient-to-r from-primary to-energy"></div>
                <div className="flex justify-between items-start">
                  <span className="material-symbols-outlined text-primary text-[32px]">all_inclusive</span>
                  <span className="font-mono text-[10px] text-text-muted">CONFIDENTIAL</span>
                </div>
                <div className="my-auto">
                  <h2 className="text-3xl font-black text-text-main dark:text-white leading-none mb-4">
                    System<br />Architecture<br />
                    <span className="text-primary">{'{ 2.0 }'}</span>
                  </h2>
                  <div className="w-12 h-1 bg-text-main dark:bg-white mb-4"></div>
                  <p className="text-xs text-text-muted">Comprehensive guide to scalable generative systems and component lifecycles.</p>
                </div>
                <div className="flex justify-between items-end border-t border-gray-100 pt-4 dark:border-gray-800">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-text-main dark:text-white">LOOP.DEV</span>
                    <span className="text-[8px] text-text-muted font-mono">EST. 2024</span>
                  </div>
                  <span className="font-mono text-[10px] text-text-muted">DOC-8842</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <span className="text-xs font-bold uppercase tracking-wider text-text-muted">Presentation Slide (16:9)</span>
            <div className="flex items-center justify-center rounded-lg border border-border-light bg-background-subtle p-8 dark:border-gray-700 dark:bg-gray-900">
              <div className="aspect-video w-full bg-background-dark text-white shadow-xl relative p-8 flex flex-col group hover:shadow-2xl transition-shadow duration-300">
                <div className="flex justify-between items-center mb-8">
                  <span className="text-xs font-mono text-gray-400">Q3 Performance</span>
                  <div className="flex gap-1">
                    <div className="size-1 bg-white/20 rounded-full"></div>
                    <div className="size-1 bg-white/20 rounded-full"></div>
                    <div className="size-1 bg-primary rounded-full"></div>
                  </div>
                </div>
                <div className="flex-1 grid grid-cols-2 gap-8 items-center">
                  <div>
                    <h3 className="text-2xl font-bold mb-4">Velocity Metrics</h3>
                    <ul className="space-y-3 text-sm text-gray-300">
                      <li className="flex items-center gap-2">
                        <span className="text-energy text-lg">›</span>
                        Reduced cycle time by 40%
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-energy text-lg">›</span>
                        Component adoption up 15%
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-energy text-lg">›</span>
                        Zero critical failures
                      </li>
                    </ul>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4 h-full flex items-end gap-2 border border-white/10 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent"></div>
                    <div className="w-1/4 h-[40%] bg-primary/40 rounded-t transition-all duration-500 group-hover:h-[45%]"></div>
                    <div className="w-1/4 h-[60%] bg-primary/60 rounded-t transition-all duration-500 group-hover:h-[65%]"></div>
                    <div className="w-1/4 h-[50%] bg-primary/40 rounded-t transition-all duration-500 group-hover:h-[55%]"></div>
                    <div className="w-1/4 h-[85%] bg-primary rounded-t relative transition-all duration-500 group-hover:h-[90%]">
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] font-bold px-1.5 py-0.5 rounded shadow-lg">
                        +24%
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-auto pt-6 border-t border-white/10 flex justify-between text-[10px] font-mono text-gray-500">
                  <span>loop.dev confidential</span>
                  <span>03 / 12</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};