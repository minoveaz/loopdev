
import React from 'react';

export const Collaboration: React.FC = () => {
  return (
    <div className="max-w-[1200px] mx-auto p-6 md:p-12 pb-24">
      <div className="mb-12">
        <div className="flex flex-col gap-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 w-fit">
            <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-sm">forum</span>
            <span className="text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wide">System Version 2.4</span>
          </div>
          <h1 className="text-[#0d121b] dark:text-white text-4xl md:text-5xl font-black leading-tight tracking-[-0.033em]">Collaboration &amp; Communication</h1>
          <p className="text-[#4c669a] dark:text-slate-400 text-lg max-w-2xl">
            A unified system for asynchronous communication, designed to facilitate clear dialogue within complex workflows. Our components prioritize readability, context, and traceability using strict brand alignment.
          </p>
        </div>
      </div>

      <section className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[#0d121b] dark:text-white text-2xl font-bold tracking-[-0.015em]">Discussion Threads</h2>
          <div className="inline-flex items-center gap-2 text-slate-500 text-sm">
            <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-xs font-mono">comp-thread</span>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-slate-50 dark:bg-black/20 rounded-xl border border-slate-200 dark:border-slate-800 p-8 flex flex-col justify-center">
            <div className="bg-white dark:bg-surface-dark w-full rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wide">Resolved</span>
                </div>
                <div className="flex gap-2">
                  <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                    <span className="material-symbols-outlined text-lg">more_horiz</span>
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm font-bold border-2 border-white dark:border-slate-700 shadow-sm">
                      JD
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-baseline justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white text-sm">John Doe</span>
                        <span className="text-xs text-slate-500">2 hours ago</span>
                      </div>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-3">
                      Can we update the padding on this container to align with the new grid system? I think <span className="text-primary font-medium cursor-pointer hover:underline">@Sarah</span> mentioned we are moving to 8px base units.
                    </p>
                    <div className="flex items-center gap-4">
                      <button className="text-xs font-bold text-slate-500 hover:text-primary transition-colors flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">reply</span> Reply
                      </button>
                      <button className="text-xs font-bold text-slate-500 hover:text-primary transition-colors flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">thumb_up</span> 2
                      </button>
                    </div>
                  </div>
                </div>
                <div className="relative pl-5 ml-5 my-4 border-l-2 border-slate-100 dark:border-slate-700">
                  <div className="flex gap-4 pt-2">
                    <div className="flex-shrink-0 relative">
                      <div className="absolute -left-[22px] top-4 w-4 h-4 border-b-2 border-l-2 border-slate-100 dark:border-slate-700 rounded-bl-lg"></div>
                      <div className="w-8 h-8 rounded-full bg-energy text-slate-900 flex items-center justify-center text-xs font-bold border-2 border-white dark:border-slate-700 shadow-sm">
                        SM
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-baseline justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-white text-sm">Sarah Miller</span>
                          <span className="text-xs text-slate-500">1 hour ago</span>
                        </div>
                        <div className="flex items-center gap-1 px-2 py-0.5 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded text-[10px] font-bold border border-green-100 dark:border-green-900/30">
                          <span className="material-symbols-outlined text-[12px]">check</span> Solution
                        </div>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-3">
                        Correct! The new token is <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-xs font-mono text-slate-700 dark:text-slate-200">p-2</code> (0.5rem / 8px). I've updated the Figma components to reflect this change.
                      </p>
                      <div className="flex items-center gap-4">
                        <button className="text-xs font-bold text-slate-500 hover:text-primary transition-colors flex items-center gap-1">
                          <span className="material-symbols-outlined text-[16px]">reply</span> Reply
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pl-14">
                  <div className="relative">
                    <textarea className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent min-h-[80px] text-slate-900 dark:text-white placeholder-slate-400" placeholder="Write a reply..."></textarea>
                    <div className="absolute bottom-2 right-2 flex gap-2">
                      <button className="p-1.5 text-slate-400 hover:text-primary rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                        <span className="material-symbols-outlined text-[18px]">attach_file</span>
                      </button>
                      <button className="bg-primary hover:bg-primary-dark text-white rounded p-1.5 transition-colors shadow-sm">
                        <span className="material-symbols-outlined text-[18px]">send</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">Structure</h3>
              <ul className="space-y-4">
                <li className="flex gap-3 text-sm text-slate-600 dark:text-slate-300">
                  <span className="material-symbols-outlined text-primary text-lg">account_circle</span>
                  <span className="flex-1"><strong>Author Identity:</strong> Clear avatar and name lockups establish ownership of comments.</span>
                </li>
                <li className="flex gap-3 text-sm text-slate-600 dark:text-slate-300">
                  <span className="material-symbols-outlined text-primary text-lg">format_quote</span>
                  <span className="flex-1"><strong>Content Area:</strong> Supports markdown, code blocks, and inline semantic mentions.</span>
                </li>
                <li className="flex gap-3 text-sm text-slate-600 dark:text-slate-300">
                  <span className="material-symbols-outlined text-primary text-lg">account_tree</span>
                  <span className="flex-1"><strong>Hierarchy:</strong> Visual threading with indentations and connecting lines for nested contexts.</span>
                </li>
              </ul>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/30 p-6">
              <h3 className="text-sm font-bold text-blue-900 dark:text-blue-100 uppercase tracking-wider mb-2">Usage Note</h3>
              <p className="text-xs text-blue-800 dark:text-blue-200 leading-relaxed">
                Discussion threads should always be anchored to a specific context (e.g., a file, a design node, or a task) rather than floating independently.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[#0d121b] dark:text-white text-2xl font-bold tracking-[-0.015em]">Activity Feeds</h2>
          <p className="text-sm text-slate-500">Chronological System Events</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-slate-900 dark:text-white">Project History</h3>
              <button className="text-xs text-primary font-bold hover:underline">View All</button>
            </div>
            <div className="relative">
              <div className="absolute left-4 top-2 bottom-2 w-px bg-slate-200 dark:bg-slate-700"></div>
              <div className="relative pl-12 pb-8 group">
                <div className="absolute left-0 p-1 bg-white dark:bg-surface-dark z-10">
                  <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/20 text-primary flex items-center justify-center border border-blue-100 dark:border-blue-900/30 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-[18px]">cloud_upload</span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="flex justify-between items-start">
                    <span className="text-sm font-medium text-slate-900 dark:text-white">New assets uploaded</span>
                    <span className="text-xs text-slate-400">10m ago</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">John Doe added 4 new files to <span className="text-slate-700 dark:text-slate-300 font-medium">Marketing Assets</span>.</p>
                  <div className="flex gap-2 mt-2">
                    <div className="w-8 h-8 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 flex items-center justify-center">
                      <span className="material-symbols-outlined text-xs text-slate-500">image</span>
                    </div>
                    <div className="w-8 h-8 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 flex items-center justify-center">
                      <span className="material-symbols-outlined text-xs text-slate-500">image</span>
                    </div>
                    <div className="w-8 h-8 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 flex items-center justify-center text-[10px] text-slate-500 font-bold">
                      +2
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative pl-12 pb-8 group">
                <div className="absolute left-0 p-1 bg-white dark:bg-surface-dark z-10">
                  <div className="w-8 h-8 rounded-full bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-500 flex items-center justify-center border border-yellow-100 dark:border-yellow-900/30 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-[18px]">bolt</span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="flex justify-between items-start">
                    <span className="text-sm font-medium text-slate-900 dark:text-white">System Alert</span>
                    <span className="text-xs text-slate-400">2h ago</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Automated build process completed with warnings in <span className="font-mono text-[10px] bg-slate-100 dark:bg-slate-800 px-1 rounded">module-core</span>.</p>
                </div>
              </div>
              <div className="relative pl-12 group">
                <div className="absolute left-0 p-1 bg-white dark:bg-surface-dark z-10">
                  <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-500 flex items-center justify-center border border-slate-200 dark:border-slate-600 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-[18px]">edit_document</span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="flex justify-between items-start">
                    <span className="text-sm font-medium text-slate-900 dark:text-white">Specification Updated</span>
                    <span className="text-xs text-slate-400">Yesterday</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Sarah Miller edited the description for <span className="text-primary hover:underline cursor-pointer">Project Alpha</span>.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-center">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-700">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3">
                  <span className="material-symbols-outlined">history</span>
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">Chronological</h4>
                <p className="text-xs text-slate-500 mt-1">Linear progression of time, with most recent events at the top.</p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-700">
                <div className="w-10 h-10 rounded-full bg-energy/10 text-yellow-600 dark:text-yellow-500 flex items-center justify-center mb-3">
                  <span className="material-symbols-outlined">filter_alt</span>
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">Filterable</h4>
                <p className="text-xs text-slate-500 mt-1">Events can be filtered by type, user, or date range.</p>
              </div>
              <div className="col-span-2 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-3 mb-2">
                  <span className="material-symbols-outlined text-slate-400">palette</span>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">Color Semantics</h4>
                </div>
                <div className="space-y-2 mt-3">
                  <div className="flex items-center text-xs">
                    <div className="w-2 h-2 rounded-full bg-primary mr-2"></div>
                    <span className="text-slate-600 dark:text-slate-300"><strong>Primary Blue:</strong> Creation, Uploads, Key Interactions</span>
                  </div>
                  <div className="flex items-center text-xs">
                    <div className="w-2 h-2 rounded-full bg-energy mr-2"></div>
                    <span className="text-slate-600 dark:text-slate-300"><strong>Energy Yellow:</strong> System Alerts, Highlights, Warnings</span>
                  </div>
                  <div className="flex items-center text-xs">
                    <div className="w-2 h-2 rounded-full bg-slate-400 mr-2"></div>
                    <span className="text-slate-600 dark:text-slate-300"><strong>Neutrals:</strong> Edits, Archives, General Logging</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
