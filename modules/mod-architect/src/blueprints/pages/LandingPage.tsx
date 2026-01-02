import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Infinity, 
  Compass, 
  Zap, 
  Map, 
  PenTool, 
  BarChart3, 
  Repeat, 
  MoreHorizontal, 
  Mail,
  Check,
  Sun,
  Moon
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Check initial state from DOM
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  const toggleTheme = () => {
    const html = document.documentElement;
    if (html.classList.contains('dark')) {
      html.classList.remove('dark');
      setIsDark(false);
    } else {
      html.classList.add('dark');
      setIsDark(true);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark text-text-main dark:text-white transition-colors duration-200">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-border-light bg-white/90 backdrop-blur-md px-6 py-4 dark:border-border-dark dark:bg-background-dark/90 lg:px-12">
        <div className="flex items-center gap-3 text-text-main dark:text-white">
          <div className="flex size-8 items-center justify-center rounded bg-primary text-white">
            <Infinity size={20} />
          </div>
          <h2 className="text-xl font-bold leading-tight tracking-tight">loop.dev</h2>
        </div>
        <nav className="hidden md:flex items-center gap-8">
          <a className="text-sm font-medium hover:text-primary transition-colors" href="#work">Work</a>
          <a className="text-sm font-medium hover:text-primary transition-colors" href="#system">System</a>
          <a className="text-sm font-medium hover:text-primary transition-colors" href="#philosophy">Philosophy</a>
          <a className="text-sm font-medium hover:text-primary transition-colors" href="#about">About</a>
        </nav>
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full text-text-muted hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle Theme"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button 
            onClick={() => navigate('/system')}
            className="flex h-9 items-center justify-center rounded bg-primary px-4 text-sm font-semibold text-white transition hover:bg-primary-dark"
          >
            Start Project
          </button>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative flex flex-col items-center justify-center px-6 py-20 lg:px-12 lg:py-32 overflow-hidden">
          {/* Decorative Grid Background */}
          <div className="absolute inset-0 bg-grid-pattern bg-[size:40px_40px] pointer-events-none"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white pointer-events-none dark:to-background-dark h-full w-full"></div>
          <div className="relative z-10 w-full max-w-6xl">
            <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:gap-16">
              {/* Hero Content */}
              <div className="flex flex-1 flex-col gap-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 w-fit">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-wider text-primary">System v2.4 Live</span>
                </div>
                <h1 className="text-4xl font-black leading-tight tracking-tight text-text-main dark:text-white sm:text-5xl lg:text-6xl">
                  The Operating System <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">for Digital Growth</span>
                </h1>
                <p className="max-w-xl text-lg text-text-muted dark:text-gray-400 leading-relaxed">
                  Engineered for Evolution. Powered by Generative AI. We build scalable digital systems that continuously improve through a cycle of measurement and refinement.
                </p>
                <div className="flex flex-wrap gap-4 pt-2">
                  <button 
                    onClick={() => navigate('/system')}
                    className="flex h-12 items-center justify-center gap-2 rounded bg-primary px-6 text-base font-bold text-white shadow-lg shadow-primary/25 transition hover:bg-primary-dark hover:translate-y-[-1px]"
                  >
                    <Compass size={20} />
                    Explore System
                  </button>
                  <button className="flex h-12 items-center justify-center gap-2 rounded border border-border-light bg-white px-6 text-base font-bold text-text-main transition hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700">
                    View Work
                  </button>
                </div>
              </div>
              {/* Hero Visual */}
              <div className="flex-1 w-full lg:max-w-lg">
                <div className="relative aspect-square w-full rounded-xl border border-border-light bg-white p-2 shadow-2xl dark:border-border-dark dark:bg-gray-900 overflow-hidden group">
                  {/* Abstract UI representation */}
                  <div className="absolute inset-0 bg-slate-50 dark:bg-gray-900">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] opacity-30 bg-[conic-gradient(from_90deg_at_50%_50%,#E2E8F0_0deg,#135BEC_180deg,#E2E8F0_360deg)] animate-[spin_10s_linear_infinite]"></div>
                    <div className="absolute inset-1 rounded-lg bg-white dark:bg-gray-900 flex items-center justify-center">
                      <div className="grid grid-cols-2 gap-4 w-3/4 h-3/4 opacity-80">
                        <div className="rounded bg-slate-100 dark:bg-gray-800 animate-pulse"></div>
                        <div className="rounded bg-slate-100 dark:bg-gray-800"></div>
                        <div className="rounded bg-slate-100 dark:bg-gray-800 col-span-2"></div>
                        <div className="rounded bg-primary/10 border border-primary/20 col-span-2 flex items-center justify-center">
                          <span className="font-mono text-xs text-primary">Generating...</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Floating Card */}
                  <div className="absolute bottom-6 right-6 w-48 rounded-lg bg-white p-4 shadow-xl border border-border-light dark:bg-gray-800 dark:border-gray-700">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="size-8 rounded bg-energy flex items-center justify-center text-text-main">
                        <Zap size={18} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase font-bold text-text-muted">Efficiency</span>
                        <span className="text-sm font-bold text-text-main dark:text-white">+240%</span>
                      </div>
                    </div>
                    <div className="h-1 w-full rounded-full bg-gray-100 dark:bg-gray-700">
                      <div className="h-1 w-[70%] rounded-full bg-energy"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Philosophy Section */}
        <section className="bg-background-subtle py-20 dark:bg-gray-900 border-y border-border-light dark:border-border-dark" id="philosophy">
          <div className="mx-auto max-w-6xl px-6 lg:px-12">
            <div className="mb-12 text-center md:text-left">
              <span className="font-mono text-xs font-medium text-primary uppercase tracking-wider">Methodology</span>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-text-main dark:text-white sm:text-4xl">The Loop Philosophy</h2>
              <p className="mt-4 max-w-2xl text-text-muted">Our design methodology is built on a cycle of continuous refinement, ensuring your digital product never stagnates.</p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {/* Plan */}
              <div className="group relative flex flex-col gap-4 rounded-xl border border-border-light bg-white p-6 transition hover:shadow-lg dark:border-gray-700 dark:bg-gray-800">
                <div className="flex size-12 items-center justify-center rounded-lg bg-blue-50 text-primary dark:bg-blue-900/20">
                  <Map />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-text-main dark:text-white">Plan</h3>
                  <p className="mt-1 text-sm text-text-muted">Strategic mapping of digital architecture and user flows.</p>
                </div>
                <div className="absolute bottom-0 left-0 h-1 w-0 bg-primary transition-all duration-300 group-hover:w-full rounded-b-xl"></div>
              </div>
              {/* Build */}
              <div className="group relative flex flex-col gap-4 rounded-xl border border-border-light bg-white p-6 transition hover:shadow-lg dark:border-gray-700 dark:bg-gray-800">
                <div className="flex size-12 items-center justify-center rounded-lg bg-blue-50 text-primary dark:bg-blue-900/20">
                  <PenTool />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-text-main dark:text-white">Build</h3>
                  <p className="mt-1 text-sm text-text-muted">Generative development of scalable components and systems.</p>
                </div>
                <div className="absolute bottom-0 left-0 h-1 w-0 bg-primary transition-all duration-300 group-hover:w-full rounded-b-xl"></div>
              </div>
              {/* Measure */}
              <div className="group relative flex flex-col gap-4 rounded-xl border border-border-light bg-white p-6 transition hover:shadow-lg dark:border-gray-700 dark:bg-gray-800">
                <div className="flex size-12 items-center justify-center rounded-lg bg-blue-50 text-primary dark:bg-blue-900/20">
                  <BarChart3 />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-text-main dark:text-white">Measure</h3>
                  <p className="mt-1 text-sm text-text-muted">Data-driven analysis of system performance and user engagement.</p>
                </div>
                <div className="absolute bottom-0 left-0 h-1 w-0 bg-primary transition-all duration-300 group-hover:w-full rounded-b-xl"></div>
              </div>
              {/* Repeat */}
              <div className="group relative flex flex-col gap-4 rounded-xl border border-border-light bg-white p-6 transition hover:shadow-lg dark:border-gray-700 dark:bg-gray-800">
                <div className="flex size-12 items-center justify-center rounded-lg bg-blue-50 text-primary dark:bg-blue-900/20">
                  <Repeat />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-text-main dark:text-white">Repeat</h3>
                  <p className="mt-1 text-sm text-text-muted">Iterative refinement for continuous growth and adaptation.</p>
                </div>
                <div className="absolute bottom-0 left-0 h-1 w-0 bg-primary transition-all duration-300 group-hover:w-full rounded-b-xl"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Brand Identity System */}
        <section className="py-20" id="system">
          <div className="mx-auto max-w-6xl px-6 lg:px-12">
            <div className="mb-16 border-b border-border-light pb-6 dark:border-gray-700">
              <h2 className="text-3xl font-black tracking-tight text-text-main dark:text-white">System Identity</h2>
              <p className="text-text-muted mt-2">The atomic elements that construct the Loop universe.</p>
            </div>
            
            {/* Logo Grid */}
            <div className="mb-20">
              <h3 className="mb-6 font-mono text-sm font-semibold uppercase text-text-muted">01. Logomark Construction</h3>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                <div className="flex aspect-[4/3] flex-col items-center justify-center rounded-lg border border-border-light bg-background-subtle p-8 dark:border-gray-700 dark:bg-gray-800">
                  <div className="flex items-center gap-3 text-text-main dark:text-white">
                    <div className="flex size-10 items-center justify-center rounded bg-primary text-white shadow-lg shadow-blue-500/30">
                      <Infinity size={24} />
                    </div>
                    <span className="text-2xl font-bold">loop.dev</span>
                  </div>
                  <span className="mt-8 font-mono text-xs text-text-muted">Primary Lockup</span>
                </div>
                
                <div className="flex aspect-[4/3] flex-col items-center justify-center rounded-lg border border-border-light bg-background-subtle p-8 dark:border-gray-700 dark:bg-gray-800 relative overflow-hidden">
                  {/* Construction Lines */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
                    <div className="border border-primary w-24 h-24 rounded-full absolute"></div>
                    <div className="border border-primary w-12 h-12 rounded-full absolute"></div>
                    <div className="h-full w-px bg-primary absolute"></div>
                    <div className="w-full h-px bg-primary absolute"></div>
                  </div>
                  <div className="relative flex size-16 items-center justify-center rounded bg-primary text-white">
                    <Infinity size={40} />
                  </div>
                  <span className="mt-8 font-mono text-xs text-text-muted">Safe Space & Geometry</span>
                </div>
                
                <div className="flex aspect-[4/3] flex-col items-center justify-center rounded-lg border border-border-light bg-text-main p-8 dark:border-gray-700 dark:bg-black">
                  <div className="flex items-center gap-3 text-white">
                    <div className="flex size-10 items-center justify-center rounded bg-white text-black">
                      <Infinity size={24} />
                    </div>
                    <span className="text-2xl font-bold">loop.dev</span>
                  </div>
                  <span className="mt-8 font-mono text-xs text-gray-400">Dark Mode Reverse</span>
                </div>
              </div>
            </div>

            {/* Color DNA */}
            <div className="mb-20">
              <h3 className="mb-6 font-mono text-sm font-semibold uppercase text-text-muted">02. Color Tokens</h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {/* Primary Blue */}
                <div className="group flex flex-col overflow-hidden rounded-lg border border-border-light dark:border-gray-700">
                  <div className="h-32 bg-[#135bec] flex items-center justify-center text-white font-bold text-xl group-hover:opacity-90 transition">Aa</div>
                  <div className="flex flex-col gap-2 p-4 bg-white dark:bg-gray-800">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-text-main dark:text-white">Structure Blue</span>
                      <span className="font-mono text-xs text-text-muted">#135BEC</span>
                    </div>
                    <span className="font-mono text-[10px] text-text-muted bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded w-fit">--color-primary</span>
                    <p className="text-xs text-text-muted mt-2">Used for primary actions, navigation, and structural emphasis.</p>
                  </div>
                </div>
                {/* Energy Yellow */}
                <div className="group flex flex-col overflow-hidden rounded-lg border border-border-light dark:border-gray-700">
                  <div className="h-32 bg-[#fbbf24] flex items-center justify-center text-black font-bold text-xl group-hover:opacity-90 transition">Aa</div>
                  <div className="flex flex-col gap-2 p-4 bg-white dark:bg-gray-800">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-text-main dark:text-white">Energy Yellow</span>
                      <span className="font-mono text-xs text-text-muted">#FBBF24</span>
                    </div>
                    <span className="font-mono text-[10px] text-text-muted bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded w-fit">--color-energy</span>
                    <p className="text-xs text-text-muted mt-2">Highlights, generative actions, and dynamic states.</p>
                  </div>
                </div>
                {/* Dark Space */}
                <div className="group flex flex-col overflow-hidden rounded-lg border border-border-light dark:border-gray-700">
                  <div className="h-32 bg-[#0f172a] flex items-center justify-center text-white font-bold text-xl group-hover:opacity-90 transition">Aa</div>
                  <div className="flex flex-col gap-2 p-4 bg-white dark:bg-gray-800">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-text-main dark:text-white">Deep Space</span>
                      <span className="font-mono text-xs text-text-muted">#0F172A</span>
                    </div>
                    <span className="font-mono text-[10px] text-text-muted bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded w-fit">--color-text-main</span>
                    <p className="text-xs text-text-muted mt-2">Primary text and dark mode backgrounds.</p>
                  </div>
                </div>
                {/* Surface */}
                <div className="group flex flex-col overflow-hidden rounded-lg border border-border-light dark:border-gray-700">
                  <div className="h-32 bg-[#f8fafc] flex items-center justify-center text-black font-bold text-xl group-hover:opacity-90 transition border-b border-gray-100 dark:border-gray-600">Aa</div>
                  <div className="flex flex-col gap-2 p-4 bg-white dark:bg-gray-800">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-text-main dark:text-white">Surface</span>
                      <span className="font-mono text-xs text-text-muted">#F8FAFC</span>
                    </div>
                    <span className="font-mono text-[10px] text-text-muted bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded w-fit">--color-bg-subtle</span>
                    <p className="text-xs text-text-muted mt-2">Secondary backgrounds and section dividers.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Typography Scale */}
            <div className="mb-20">
              <h3 className="mb-6 font-mono text-sm font-semibold uppercase text-text-muted">03. Typography</h3>
              <div className="rounded-lg border border-border-light bg-white p-8 dark:border-gray-700 dark:bg-gray-800">
                <div className="flex flex-col gap-8">
                  <div className="grid md:grid-cols-[120px_1fr] items-baseline gap-4 border-b border-dashed border-gray-200 pb-4 dark:border-gray-700">
                    <span className="font-mono text-xs text-text-muted">Display XL</span>
                    <h1 className="text-5xl font-black tracking-tight text-text-main dark:text-white">The Quick Brown Fox</h1>
                  </div>
                  <div className="grid md:grid-cols-[120px_1fr] items-baseline gap-4 border-b border-dashed border-gray-200 pb-4 dark:border-gray-700">
                    <span className="font-mono text-xs text-text-muted">Heading L</span>
                    <h2 className="text-3xl font-bold tracking-tight text-text-main dark:text-white">Engineered for Evolution</h2>
                  </div>
                  <div className="grid md:grid-cols-[120px_1fr] items-baseline gap-4 border-b border-dashed border-gray-200 pb-4 dark:border-gray-700">
                    <span className="font-mono text-xs text-text-muted">Heading M</span>
                    <h3 className="text-xl font-bold text-text-main dark:text-white">Structural Principles</h3>
                  </div>
                  <div className="grid md:grid-cols-[120px_1fr] items-baseline gap-4 border-b border-dashed border-gray-200 pb-4 dark:border-gray-700">
                    <span className="font-mono text-xs text-text-muted">Body</span>
                    <p className="text-base text-text-main dark:text-gray-300">We build scalable digital systems that continuously improve through a cycle of measurement and refinement. The quick brown fox jumps over the lazy dog.</p>
                  </div>
                  <div className="grid md:grid-cols-[120px_1fr] items-baseline gap-4">
                    <span className="font-mono text-xs text-text-muted">Mono / Code</span>
                    <code className="rounded bg-gray-100 px-2 py-1 font-mono text-sm text-primary dark:bg-gray-900">npm install @loop/core</code>
                  </div>
                </div>
              </div>
            </div>

            {/* Component Playground */}
            <div>
              <h3 className="mb-6 font-mono text-sm font-semibold uppercase text-text-muted">04. Component Architecture</h3>
              <div className="grid gap-8 lg:grid-cols-2">
                {/* Interactive Elements */}
                <div className="rounded-lg border border-border-light bg-white p-8 dark:border-gray-700 dark:bg-gray-800">
                  <span className="mb-6 block font-mono text-xs text-text-muted uppercase">Interactive Primitives</span>
                  <div className="flex flex-col gap-6">
                    <div className="flex flex-wrap gap-4 items-center">
                      <button className="rounded bg-primary px-5 py-2.5 text-sm font-bold text-white shadow hover:bg-primary-dark">Primary Action</button>
                      <button className="rounded border border-border-light bg-white px-5 py-2.5 text-sm font-bold text-text-main hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:hover:bg-gray-700">Secondary</button>
                      <button className="rounded px-5 py-2.5 text-sm font-bold text-primary hover:bg-primary/5">Tertiary</button>
                    </div>
                    <div className="flex flex-col gap-3">
                      <label className="text-sm font-medium text-text-main dark:text-gray-300">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-2.5 text-text-muted" size={20} />
                        <input className="w-full rounded border border-border-light bg-background-subtle py-2.5 pl-10 pr-4 text-sm text-text-main placeholder:text-text-muted focus:border-primary focus:ring-1 focus:ring-primary dark:bg-gray-900 dark:border-gray-600 dark:text-white" placeholder="user@loop.dev" type="email" />
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <label className="relative inline-flex cursor-pointer items-center">
                        <input defaultChecked className="peer sr-only" type="checkbox" />
                        <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none dark:bg-gray-700 dark:border-gray-600"></div>
                      </label>
                      <span className="text-sm text-text-muted">Auto-scale resources</span>
                    </div>
                  </div>
                </div>
                {/* Card Component */}
                <div className="rounded-lg border border-border-light bg-background-subtle p-8 dark:border-gray-700 dark:bg-gray-900 flex items-center justify-center relative">
                  {/* Grid overlay on this specific preview */}
                  <div className="absolute inset-0 bg-grid-pattern bg-[size:20px_20px] opacity-50 pointer-events-none"></div>
                  <div className="relative w-full max-w-sm rounded-xl border border-border-light bg-white p-6 shadow-xl dark:border-gray-600 dark:bg-gray-800">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="rounded bg-energy/10 px-2 py-1 text-xs font-bold text-amber-600 dark:text-energy">AI Generated</div>
                      <MoreHorizontal className="text-text-muted cursor-pointer hover:text-primary" />
                    </div>
                    <div className="mb-4 h-32 w-full rounded bg-gray-100 dark:bg-gray-700 relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent"></div>
                      {/* Abstract lines */}
                      <svg className="absolute bottom-0 left-0 w-full h-full text-primary/20" preserveAspectRatio="none" viewBox="0 0 100 100">
                        <path d="M0 100 Q 50 50 100 80" fill="none" stroke="currentColor" strokeWidth="2"></path>
                        <path d="M0 100 Q 30 70 100 40" fill="none" stroke="currentColor" strokeWidth="2"></path>
                      </svg>
                    </div>
                    <h4 className="text-lg font-bold text-text-main dark:text-white">System Optimization</h4>
                    <p className="mt-2 text-sm text-text-muted">Automated analysis of current component structure detected 3 potential improvements.</p>
                    <button className="mt-4 w-full rounded border border-border-light py-2 text-sm font-semibold text-text-main transition hover:border-primary hover:text-primary dark:border-gray-600 dark:text-white dark:hover:border-primary">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border-light bg-white py-12 dark:border-gray-700 dark:bg-background-dark">
        <div className="mx-auto max-w-6xl px-6 lg:px-12">
          <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex size-6 items-center justify-center rounded bg-primary text-white">
                <Infinity size={14} />
              </div>
              <span className="font-bold text-text-main dark:text-white">loop.dev</span>
            </div>
            <div className="flex flex-wrap justify-center gap-8">
              <a className="text-sm font-medium text-text-muted hover:text-primary" href="#">Work</a>
              <a className="text-sm font-medium text-text-muted hover:text-primary" href="#">System</a>
              <a className="text-sm font-medium text-text-muted hover:text-primary" href="#">Careers</a>
              <a className="text-sm font-medium text-text-muted hover:text-primary" href="#">Contact</a>
            </div>
            <div className="text-sm text-text-muted">
              © 2024 Loop Systems Inc.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};