
import React from 'react';

export const FoundationComponents: React.FC = () => {
  return (
    <div className="max-w-[1200px] mx-auto p-6 md:p-12 pb-24">
      <div className="mb-12">
        <div className="flex flex-col gap-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 w-fit">
            <span className="material-symbols-outlined text-purple-600 dark:text-purple-400 text-sm">auto_awesome</span>
            <span className="text-purple-700 dark:text-purple-300 text-xs font-bold uppercase tracking-wide">AI Component Library</span>
          </div>
          <h1 className="text-[#0d121b] dark:text-white text-4xl md:text-5xl font-black leading-tight tracking-[-0.033em]">Foundation Components</h1>
          <p className="text-[#4c669a] dark:text-slate-400 text-lg max-w-2xl">
            Core building blocks of the loop.dev Design System. These foundational elements ensure consistency, accessibility, and modularity across all digital products and AI-powered interfaces.
          </p>
        </div>
      </div>

      <section className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[#0d121b] dark:text-white text-2xl font-bold tracking-[-0.015em]">Buttons</h2>
          <div className="inline-flex items-center gap-2 text-slate-500 text-sm">
            <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-xs font-mono">.btn</span>
          </div>
        </div>
        <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3 space-y-8">
              <div>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Variations</h3>
                <div className="flex flex-wrap gap-4 items-center">
                  <button className="px-5 py-2.5 bg-primary hover:bg-[#0e4ac4] text-white rounded-lg font-medium transition-colors shadow-sm shadow-primary/30">Primary</button>
                  <button className="px-5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg font-medium transition-colors">Secondary</button>
                  <button className="px-5 py-2.5 text-primary hover:bg-primary/5 rounded-lg font-medium transition-colors">Tertiary</button>
                  <button className="w-10 h-10 flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors">
                    <span className="material-symbols-outlined text-[20px]">add</span>
                  </button>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">States</h3>
                <div className="flex flex-wrap gap-4 items-center">
                  <button className="px-5 py-2.5 bg-primary text-white rounded-lg font-medium shadow-sm ring-4 ring-primary/20">Focus</button>
                  <button className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 rounded-lg font-medium cursor-not-allowed" disabled>Disabled</button>
                  <button className="px-5 py-2.5 bg-primary text-white rounded-lg font-medium flex items-center gap-2 cursor-wait">
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" fill="currentColor"></path>
                    </svg>
                    Loading
                  </button>
                </div>
              </div>
            </div>
            <div className="lg:col-span-1 bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 border border-slate-100 dark:border-slate-700 h-fit">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Specifications</h4>
              <ul className="space-y-3 text-xs font-mono text-slate-600 dark:text-slate-400">
                <li className="flex justify-between">
                  <span>Height</span>
                  <span className="text-[#0d121b] dark:text-white">40px</span>
                </li>
                <li className="flex justify-between">
                  <span>Padding X</span>
                  <span className="text-[#0d121b] dark:text-white">20px</span>
                </li>
                <li className="flex justify-between">
                  <span>Radius</span>
                  <span className="text-[#0d121b] dark:text-white">8px</span>
                </li>
                <li className="flex justify-between">
                  <span>Text Size</span>
                  <span className="text-[#0d121b] dark:text-white">14px (Inter Medium)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[#0d121b] dark:text-white text-2xl font-bold tracking-[-0.015em]">Inputs (Text Fields)</h2>
          <div className="inline-flex items-center gap-2 text-slate-500 text-sm">
            <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-xs font-mono">.input-group</span>
          </div>
        </div>
        <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined text-[20px]">mail</span>
                  <input className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-slate-400 dark:text-white" placeholder="name@loop.dev" type="email" />
                </div>
                <p className="text-xs text-slate-500">We'll use this for account notifications.</p>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined text-[20px]">lock</span>
                  <input className="w-full pl-10 pr-10 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all dark:text-white" type="password" defaultValue="password123" />
                  <button className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                    <span className="material-symbols-outlined text-[20px]">visibility</span>
                  </button>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-red-500">Project Name</label>
                <input className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-red-500 rounded-lg text-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all text-red-500" type="text" defaultValue="Untitled Project" />
                <div className="flex items-center gap-1.5 text-xs text-red-500">
                  <span className="material-symbols-outlined text-[14px]">error</span>
                  <span>This project name is already taken.</span>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-primary">Token Limit</label>
                <div className="relative">
                  <input className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border-primary border rounded-lg text-sm ring-4 ring-primary/10 outline-none transition-all dark:text-white" type="number" defaultValue="2048" />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col">
                    <button className="text-slate-400 hover:text-primary"><span className="material-symbols-outlined text-[14px]">expand_less</span></button>
                    <button className="text-slate-400 hover:text-primary"><span className="material-symbols-outlined text-[14px]">expand_more</span></button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[#0d121b] dark:text-white text-2xl font-bold tracking-[-0.015em]">Selection Controls</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 flex flex-col gap-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Checkboxes</h3>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input defaultChecked className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary/20 dark:bg-slate-800 dark:border-slate-600 dark:checked:bg-primary" type="checkbox" />
              <span className="text-sm text-slate-700 dark:text-slate-200 group-hover:text-[#0d121b] dark:group-hover:text-white">Selected option</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary/20 dark:bg-slate-800 dark:border-slate-600" type="checkbox" />
              <span className="text-sm text-slate-700 dark:text-slate-200 group-hover:text-[#0d121b] dark:group-hover:text-white">Default option</span>
            </label>
            <label className="flex items-center gap-3 cursor-not-allowed opacity-60">
              <input defaultChecked className="w-5 h-5 rounded border-slate-300 text-slate-400 bg-slate-100" disabled type="checkbox" />
              <span className="text-sm text-slate-500">Disabled selected</span>
            </label>
          </div>
          <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 flex flex-col gap-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Radio Buttons</h3>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input defaultChecked className="w-5 h-5 border-slate-300 text-primary focus:ring-primary/20 dark:bg-slate-800 dark:border-slate-600" name="radio-group" type="radio" />
              <span className="text-sm text-slate-700 dark:text-slate-200 group-hover:text-[#0d121b] dark:group-hover:text-white">Active selection</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input className="w-5 h-5 border-slate-300 text-primary focus:ring-primary/20 dark:bg-slate-800 dark:border-slate-600" name="radio-group" type="radio" />
              <span className="text-sm text-slate-700 dark:text-slate-200 group-hover:text-[#0d121b] dark:group-hover:text-white">Inactive selection</span>
            </label>
          </div>
          <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 flex flex-col gap-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Switches</h3>
            <label className="flex items-center justify-between cursor-pointer group">
              <span className="text-sm text-slate-700 dark:text-slate-200">Notifications</span>
              <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary transition-colors">
                <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6"></span>
              </div>
            </label>
            <label className="flex items-center justify-between cursor-pointer group">
              <span className="text-sm text-slate-700 dark:text-slate-200">Auto-update</span>
              <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-slate-200 dark:bg-slate-700 transition-colors">
                <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-1"></span>
              </div>
            </label>
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[#0d121b] dark:text-white text-2xl font-bold tracking-[-0.015em]">Alerts & Toasts</h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded-r-lg flex gap-3">
              <span className="material-symbols-outlined text-blue-500">info</span>
              <div>
                <h4 className="text-sm font-bold text-blue-900 dark:text-blue-100">System Update</h4>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">A new version of the loop.dev CLI is available. Please update to continue.</p>
              </div>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 rounded-r-lg flex gap-3">
              <span className="material-symbols-outlined text-green-500">check_circle</span>
              <div>
                <h4 className="text-sm font-bold text-green-900 dark:text-green-100">Success</h4>
                <p className="text-sm text-green-700 dark:text-green-300 mt-1">Your deployment has been successfully completed.</p>
              </div>
            </div>
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-r-lg flex gap-3">
              <span className="material-symbols-outlined text-red-500">warning</span>
              <div>
                <h4 className="text-sm font-bold text-red-900 dark:text-red-100">Critical Error</h4>
                <p className="text-sm text-red-700 dark:text-red-300 mt-1">Failed to connect to the database. Check your connection string.</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-100 dark:bg-slate-900/50 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 p-8 flex flex-col justify-end items-end gap-4 relative min-h-[300px]">
            <span className="absolute top-4 left-4 text-xs font-mono text-slate-400 uppercase">Toast Area Preview</span>
            <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 shadow-lg rounded-lg p-4 flex items-start gap-3 w-80 animate-bounce transition-transform">
              <span className="material-symbols-outlined text-green-500 mt-0.5">check_circle</span>
              <div className="flex-1">
                <h5 className="text-sm font-bold text-[#0d121b] dark:text-white">Changes Saved</h5>
                <p className="text-xs text-slate-500 mt-1">Your profile has been updated.</p>
              </div>
              <button className="text-slate-400 hover:text-slate-600"><span className="material-symbols-outlined text-[18px]">close</span></button>
            </div>
            <div className="bg-[#0d121b] text-white border border-slate-800 shadow-lg rounded-lg p-4 flex items-center gap-3 w-80">
              <span className="material-symbols-outlined text-sm animate-spin">refresh</span>
              <span className="text-sm font-medium">Syncing data...</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
