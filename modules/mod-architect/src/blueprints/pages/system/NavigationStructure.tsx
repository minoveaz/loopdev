import React from 'react';
import { Breadcrumbs } from '../components/functional/Breadcrumbs/index';

export const NavigationStructure: React.FC = () => {
  return (
    <div className="max-w-[1200px] mx-auto p-6 md:p-12 pb-24">
      {/* Header */}
      <div className="mb-12">
        <div className="flex flex-col gap-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 w-fit">
            <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-sm">architecture</span>
            <span className="text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wide">Core Architecture</span>
          </div>
          <h1 className="text-[#0d121b] dark:text-white text-4xl md:text-5xl font-black leading-tight tracking-[-0.033em]">Navigation &amp; Content Structure</h1>
          <p className="text-[#4c669a] dark:text-slate-400 text-lg max-w-2xl">
            Consistent patterns for orientation and information hierarchy. 
            Designed to help users build mental models of the loop.dev ecosystem efficiently.
          </p>
        </div>
      </div>

      <section className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[#0d121b] dark:text-white text-2xl font-bold tracking-[-0.015em]">Primary Patterns</h2>
          <button className="text-primary text-sm font-medium hover:underline">View in Figma</button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Multi-level Sidebar Card */}
            <div className="flex flex-col bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden group">
                <div className="h-64 w-full bg-slate-50 dark:bg-slate-800/50 relative group-hover:bg-slate-100 dark:group-hover:bg-slate-800 transition-colors duration-500 flex items-center justify-center p-8">
                    <div className="w-48 h-full bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm flex flex-col overflow-hidden transform group-hover:scale-105 transition-transform duration-300">
                        <div className="h-10 border-b border-slate-100 dark:border-slate-700 px-3 flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-slate-200 dark:bg-slate-600"></div>
                            <div className="h-2 w-20 bg-slate-100 dark:bg-slate-700 rounded"></div>
                        </div>
                        <div className="p-2 flex flex-col gap-1">
                            <div className="h-6 w-full rounded flex items-center px-2 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                <div className="h-2 w-16 bg-slate-200 dark:bg-slate-600 rounded"></div>
                            </div>
                            <div className="h-auto w-full rounded bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 flex flex-col gap-1 p-1">
                                <div className="flex items-center px-1 h-5 justify-between">
                                    <div className="h-2 w-12 bg-blue-200 dark:bg-blue-700 rounded"></div>
                                    <span className="material-symbols-outlined text-[10px] text-blue-500">expand_less</span>
                                </div>
                                <div className="pl-3 pr-1 py-1">
                                    <div className="h-1.5 w-10 bg-blue-200/50 dark:bg-blue-700/50 rounded mb-1"></div>
                                    <div className="h-1.5 w-14 bg-blue-200/50 dark:bg-blue-700/50 rounded"></div>
                                </div>
                            </div>
                            <div className="h-6 w-full rounded flex items-center px-2 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                <div className="h-2 w-20 bg-slate-200 dark:bg-slate-600 rounded"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-[#0d121b] dark:text-white text-lg font-bold">Multi-level Sidebar</h3>
                        <span className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold">Parent</span>
                    </div>
                    <p className="text-sm text-[#4c669a] dark:text-slate-400 mb-4">
                        Supports deep information hierarchies up to 3 levels. Accordion-style expansion keeps the interface clean while maintaining context.
                    </p>
                    <div className="flex gap-2 text-xs font-mono text-slate-500">
                        <span className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-1.5 py-0.5 rounded">.sidebar-nav-item</span>
                        <span className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-1.5 py-0.5 rounded">.is-active</span>
                    </div>
                </div>
            </div>

            {/* Breadcrumbs Card */}
            <div className="flex flex-col bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden group">
                <div className="h-64 w-full bg-slate-50 dark:bg-slate-800/50 relative group-hover:bg-slate-100 dark:group-hover:bg-slate-800 transition-colors duration-500 flex items-center justify-center p-8">
                    <div className="w-full max-w-sm p-4 bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm transform group-hover:scale-105 transition-transform duration-300">
                        <Breadcrumbs 
                          items={[
                            { label: 'Home', href: '#' },
                            { label: 'Design System', href: '#' },
                            { label: 'Navigation', active: true }
                          ]}
                        />
                    </div>
                </div>
                <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-[#0d121b] dark:text-white text-lg font-bold">Breadcrumbs</h3>
                        <span className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold">Secondary</span>
                    </div>
                    <p className="text-sm text-[#4c669a] dark:text-slate-400 mb-4">
                        Essential for orientation in deep structures (&gt;2 levels). Always placed above the page title. Truncate items from the left if space is limited.
                    </p>
                    <div className="flex gap-2 text-xs font-mono text-slate-500">
                        <span className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-1.5 py-0.5 rounded">.breadcrumb-list</span>
                    </div>
                </div>
            </div>

            {/* Nested Tabs Card */}
            <div className="flex flex-col bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden group">
                <div className="h-64 w-full bg-slate-50 dark:bg-slate-800/50 relative group-hover:bg-slate-100 dark:group-hover:bg-slate-800 transition-colors duration-500 flex items-center justify-center p-8">
                    <div className="w-full max-w-sm bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm overflow-hidden transform group-hover:scale-105 transition-transform duration-300">
                        <div className="flex border-b border-slate-100 dark:border-slate-700">
                            <div className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer">Overview</div>
                            <div className="px-4 py-3 text-sm text-primary font-bold border-b-2 border-primary bg-blue-50/50 dark:bg-blue-900/10 cursor-pointer">Structure</div>
                            <div className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer">Settings</div>
                        </div>
                        <div className="p-4 bg-slate-50/50 dark:bg-slate-800/20 h-16">
                            <div className="w-2/3 h-2 bg-slate-100 dark:bg-slate-700 rounded mb-2"></div>
                            <div className="w-1/2 h-2 bg-slate-100 dark:bg-slate-700 rounded"></div>
                        </div>
                    </div>
                </div>
                <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-[#0d121b] dark:text-white text-lg font-bold">Nested Tabs</h3>
                        <span className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold">Local</span>
                    </div>
                    <p className="text-sm text-[#4c669a] dark:text-slate-400 mb-4">
                        Use for organizing related content views within a single context. Avoid using tabs for primary navigation steps.
                    </p>
                    <div className="flex gap-2 text-xs font-mono text-slate-500">
                        <span className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-1.5 py-0.5 rounded">.tabs-nav</span>
                    </div>
                </div>
            </div>

            {/* Accordions Card */}
            <div className="flex flex-col bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden group">
                <div className="h-64 w-full bg-slate-50 dark:bg-slate-800/50 relative group-hover:bg-slate-100 dark:group-hover:bg-slate-800 transition-colors duration-500 flex items-center justify-center p-8">
                    <div className="w-full max-w-sm flex flex-col gap-2 transform group-hover:scale-105 transition-transform duration-300">
                        <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded-lg p-3 flex items-center justify-between shadow-sm">
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">View Guidelines</span>
                            <span className="material-symbols-outlined text-sm text-slate-400">add</span>
                        </div>
                        <div className="bg-white dark:bg-surface-dark border border-primary/30 dark:border-primary/30 rounded-lg shadow-sm overflow-hidden">
                            <div className="p-3 flex items-center justify-between bg-blue-50/50 dark:bg-blue-900/20 cursor-pointer">
                                <span className="text-xs font-bold text-primary">Content Visibility</span>
                                <span className="material-symbols-outlined text-sm text-primary">remove</span>
                            </div>
                            <div className="p-3 text-[10px] text-slate-500 leading-relaxed border-t border-slate-100 dark:border-slate-700">
                                Use accordions to manage screen real estate and reduce cognitive load by hiding secondary details.
                            </div>
                        </div>
                    </div>
                </div>
                <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-[#0d121b] dark:text-white text-lg font-bold">Accordions</h3>
                        <span className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold">Utility</span>
                    </div>
                    <p className="text-sm text-[#4c669a] dark:text-slate-400 mb-4">
                        Best for "progressive disclosure". Allows users to toggle content visibility, optimizing vertical space on dense pages.
                    </p>
                    <div className="flex gap-2 text-xs font-mono text-slate-500">
                        <span className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-1.5 py-0.5 rounded">.accordion-item</span>
                    </div>
                </div>
            </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        <div className="flex flex-col gap-6">
            <h2 className="text-[#0d121b] dark:text-white text-2xl font-bold tracking-[-0.015em]">Structure Best Practices</h2>
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4 p-4 rounded-lg bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800/30">
                    <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-800 flex items-center justify-center flex-shrink-0">
                        <span className="material-symbols-outlined text-green-600 dark:text-green-300">check</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-green-800 dark:text-green-300 text-sm">Do: Shallow Navigation</span>
                        <p className="text-green-700 dark:text-green-400 text-xs">Aim for a maximum of 3 levels of depth in sidebar navigation to prevent user disorientation.</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-lg bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800/30">
                    <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-800 flex items-center justify-center flex-shrink-0">
                        <span className="material-symbols-outlined text-green-600 dark:text-green-300">check</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-green-800 dark:text-green-300 text-sm">Do: Explicit Current State</span>
                        <p className="text-green-700 dark:text-green-400 text-xs">Always highlight the active section in sidebars and tabs using the `primary` color tokens.</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-lg bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/30">
                    <div className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-800 flex items-center justify-center flex-shrink-0">
                        <span className="material-symbols-outlined text-red-600 dark:text-red-300">close</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-red-800 dark:text-red-300 text-sm">Don't: Mixing Patterns</span>
                        <p className="text-red-700 dark:text-red-400 text-xs">Avoid using Tabs inside Accordions inside Modals. This creates "nested scrolling" issues.</p>
                    </div>
                </div>
            </div>
        </div>

        <div className="flex flex-col gap-6">
            <h2 className="text-[#0d121b] dark:text-white text-2xl font-bold tracking-[-0.015em]">Implementation</h2>
            <div className="bg-[#1e293b] rounded-xl overflow-hidden shadow-2xl h-full flex flex-col">
                <div className="flex items-center justify-between px-4 py-3 bg-[#0f172a] border-b border-slate-700">
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <span className="text-xs font-mono text-slate-400">Breadcrumb.tsx</span>
                    <button className="text-slate-400 hover:text-white transition-colors">
                        <span className="material-symbols-outlined text-sm">content_copy</span>
                    </button>
                </div>
                <div className="p-6 overflow-x-auto flex-1 flex flex-col justify-center">
<pre className="font-mono text-sm leading-relaxed text-slate-300"><span className="text-purple-400">import</span> {'{ Link }'} <span className="text-purple-400">from</span> <span className="text-green-400">'@loop/ui'</span>;
<span className="text-purple-400">export const</span> Breadcrumb = ({'{ items }'}) =&gt; {'{'}
  <span className="text-purple-400">return</span> (
    &lt;<span className="text-yellow-300">nav</span> <span className="text-blue-400">aria-label</span>=<span className="text-green-400">"Breadcrumb"</span>&gt;
      &lt;<span className="text-yellow-300">ol</span> <span className="text-blue-400">className</span>=<span className="text-green-400">"flex items-center gap-2"</span>&gt;
        {'{items.map(('}<span className="text-blue-400">item</span>, <span className="text-blue-400">idx</span>{') => ('}
          &lt;<span className="text-yellow-300">li</span> <span className="text-blue-400">key</span>={'{idx}'} <span className="text-blue-400">className</span>=<span className="text-green-400">"flex items-center"</span>&gt;
            {'{idx >'} <span className="text-blue-400">0</span> {'&& ('}
               &lt;<span className="text-yellow-300">span</span> <span className="text-blue-400">className</span>=<span className="text-green-400">"mx-1 text-slate-400"</span>&gt;/&lt;/<span className="text-yellow-300">span</span>&gt;
            {')}'}
            &lt;<span className="text-yellow-300">Link</span>
              <span className="text-blue-400">href</span>={'{item.href}'}
              <span className="text-blue-400">aria-current</span>={'{item.current ?'} <span className="text-green-400">'page'</span> : <span className="text-purple-400">undefined</span>{'}'}
              <span className="text-blue-400">className</span>={'{'}
                item.current 
                  ? <span className="text-green-400">"text-primary font-bold"</span> 
                  : <span className="text-green-400">"text-slate-500 hover:text-slate-900"</span>
              {'}'}
            &gt;
              {'{item.label}'}
            &lt;/<span className="text-yellow-300">Link</span>&gt;
          &lt;/<span className="text-yellow-300">li</span>&gt;
        {'))}'}
      &lt;/<span className="text-yellow-300">ol</span>&gt;
    &lt;/<span className="text-yellow-300">nav</span>&gt;
  );
{'}'};
</pre>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};