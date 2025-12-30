import React from 'react';
import { SectionHeader, Card, Button, Badge, GridPattern } from '@blueprints/components/ui/DesignSystem';
import { Infinity, LayoutDashboard, Mail, FileText, ArrowRight } from 'lucide-react';

export const ApplicationExamples: React.FC = () => {
  return (
    <div>
      <SectionHeader 
        title="Application Examples" 
        subtitle="How the { loop.dev } identity system scales across different environments. From web interfaces to documentation."
        context="Context: All"
      />

      {/* Web Environment */}
      <section className="mb-20">
         <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">01. Web Environment</h3>
            <Badge variant="neutral">Landing Page</Badge>
         </div>
         
         <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-2xl">
            <div className="bg-gray-100 dark:bg-gray-800 px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center gap-4">
               <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
               </div>
               <div className="flex-1 text-center">
                  <span className="text-xs font-mono text-text-muted bg-white dark:bg-gray-900 px-3 py-1 rounded">loop.dev/platform</span>
               </div>
            </div>
            
            <div className="bg-white dark:bg-background-dark p-12 lg:p-20 relative overflow-hidden">
               <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
                  <div>
                     <div className="inline-flex items-center gap-2 mb-6 px-3 py-1 bg-primary/10 border border-primary/20 rounded text-xs font-bold text-primary">
                        <span className="font-mono">{`{ v3.0 }`}</span>
                        <span>Now Available</span>
                     </div>
                     <h2 className="text-4xl lg:text-5xl font-black leading-tight mb-6">
                        Automate your <br/>
                        <span className="text-primary">Growth Loops</span>
                     </h2>
                     <p className="text-text-muted mb-8 max-w-md">Deploy generative systems that scale with your business. Structure your data, refine your metrics.</p>
                     <div className="flex gap-4">
                        <Button>Get Started</Button>
                        <Button variant="secondary">Documentation</Button>
                     </div>
                  </div>
                  
                  <div className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-xl relative">
                     <div className="flex justify-between items-center mb-4 border-b border-gray-100 dark:border-gray-700 pb-4">
                        <span className="text-xs font-bold uppercase text-text-muted">System Velocity</span>
                        <span className="font-mono text-xs text-primary">{`{active}`}</span>
                     </div>
                     <div className="h-32 bg-gray-50 dark:bg-gray-900 rounded border border-dashed border-gray-200 dark:border-gray-700 flex items-center justify-center mb-4">
                        <div className="text-center">
                           <div className="text-2xl font-bold mb-1">78%</div>
                           <div className="text-xs text-text-muted">Optimization</div>
                        </div>
                     </div>
                     <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded font-mono text-[10px] text-text-muted border border-gray-200 dark:border-gray-700">
                        <span className="text-primary">function</span> <span className="text-energy-vivid">loop</span>() {`{`} <br/>
                        &nbsp;&nbsp;return scale * <span className="text-blue-400">infinity</span>;<br/>
                        {`}`}
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Component Architecture */}
      <section className="mb-20">
         <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">02. Component Architecture</h3>
            <Badge variant="neutral">App Interface</Badge>
         </div>
         
         <div className="grid lg:grid-cols-2 gap-8">
            <div>
               <span className="text-xs font-bold uppercase text-text-muted mb-4 block">Content Card</span>
               <div className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-lg transition-all group cursor-pointer relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-bl-full group-hover:bg-primary/10 transition-colors" />
                  <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center mb-4">
                     <LayoutDashboard className="text-text-main dark:text-white" size={20} />
                  </div>
                  <h4 className="text-lg font-bold mb-2">Data Structure</h4>
                  <p className="text-sm text-text-muted mb-4">Automated organization of incoming data streams using generative classification.</p>
                  <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center gap-2">
                     <span className="h-2 w-2 rounded-full bg-energy" />
                     <span className="text-xs font-mono text-text-muted">Processing...</span>
                  </div>
               </div>
            </div>
            
            <div>
               <span className="text-xs font-bold uppercase text-text-muted mb-4 block">App Header</span>
               <div className="bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg p-8">
                  <div className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded px-4 py-3 shadow-sm flex items-center justify-between">
                     <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 font-bold text-sm">
                           <Infinity size={18} className="text-primary" />
                           Dashboard
                        </div>
                        <div className="h-4 w-px bg-gray-200 dark:bg-gray-700" />
                        <nav className="flex gap-4 text-xs font-medium">
                           <span className="text-text-main dark:text-white">Overview</span>
                           <span className="text-text-muted">Analytics</span>
                        </nav>
                     </div>
                     <div className="flex items-center gap-3">
                        <span className="text-xs font-mono bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-text-muted">⌘K</span>
                        <div className="h-6 w-6 rounded-full bg-gradient-to-br from-primary to-blue-400" />
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Marketing & Social */}
      <section className="mb-20">
         <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">03. Communication</h3>
            <Badge variant="neutral">Email & Social</Badge>
         </div>
         
         <div className="grid lg:grid-cols-2 gap-8">
            {/* Email */}
            <div>
               <span className="text-xs font-bold uppercase text-text-muted mb-4 block">Transactional</span>
               <div className="bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg p-8 flex justify-center">
                  <div className="w-full max-w-sm bg-white dark:bg-surface-dark rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                     <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900">
                        <div className="flex items-center gap-2 font-bold text-sm">
                           <Infinity size={16} className="text-primary" /> loop.dev
                        </div>
                        <span className="text-[10px] font-mono text-text-muted">ID: 9942</span>
                     </div>
                     <div className="p-6">
                        <h4 className="font-bold text-base mb-2">System Update Complete</h4>
                        <p className="text-xs text-text-muted mb-4 leading-relaxed">Your generative model has finished training. The new parameters have been deployed.</p>
                        <div className="bg-gray-50 dark:bg-gray-900 rounded p-3 mb-4 text-[10px] font-mono border border-gray-100 dark:border-gray-700">
                           <div className="flex justify-between mb-1"><span>Model:</span> <span>Gen-Alpha-V2</span></div>
                           <div className="flex justify-between"><span>Status:</span> <span className="text-green-500">Active</span></div>
                        </div>
                        <Button size="sm" className="w-full text-xs">View Dashboard</Button>
                     </div>
                  </div>
               </div>
            </div>
            
            {/* Social */}
            <div>
               <span className="text-xs font-bold uppercase text-text-muted mb-4 block">Social Graphic (1:1)</span>
               <div className="bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg p-8 flex items-center justify-center">
                  <div className="h-64 w-64 bg-[#0d121b] relative overflow-hidden flex flex-col justify-between p-6 shadow-xl group cursor-pointer">
                     <GridPattern />
                     <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-bl-full blur-xl group-hover:bg-primary/30 transition-colors" />
                     
                     <div className="relative z-10">
                        <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-white/10 backdrop-blur border border-white/10 mb-4">
                           <span className="h-1.5 w-1.5 rounded-full bg-energy animate-pulse" />
                           <span className="text-[8px] font-mono text-white uppercase">Webinar</span>
                        </div>
                        <h3 className="text-2xl font-black text-white leading-none">
                           Scale <br/>
                           <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-300">Infinite</span> <br/>
                           Systems.
                        </h3>
                     </div>
                     
                     <div className="relative z-10 flex justify-between items-end pt-4 border-t border-white/10">
                        <div className="flex flex-col">
                           <span className="text-[10px] text-gray-400 font-mono">Guest Speaker</span>
                           <span className="text-xs text-white font-bold">Alex Chen</span>
                        </div>
                        <div className="h-8 w-8 bg-white rounded-full flex items-center justify-center text-black">
                           <ArrowRight size={16} />
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