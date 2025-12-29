
import React from 'react';
import { NotificationCenter } from '../components/functional/NotificationCenter/index';
import { Stepper } from '../components/functional/Stepper/index';
import { VerticalStepper } from '../components/functional/VerticalStepper/index';

export const NotificationsAndWorkflows: React.FC = () => {
  return (
    <div className="max-w-[1200px] mx-auto p-6 md:p-12 pb-24">
      {/* Header */}
      <div className="mb-12">
        <div className="flex flex-col gap-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 w-fit">
            <span className="material-symbols-outlined text-purple-600 dark:text-purple-400 text-sm">auto_awesome</span>
            <span className="text-purple-700 dark:text-purple-300 text-xs font-bold uppercase tracking-wide">AI Generated Components</span>
          </div>
          <h1 className="text-[#0d121b] dark:text-white text-4xl md:text-5xl font-black leading-tight tracking-[-0.033em]">Notifications & Workflows</h1>
          <p className="text-[#4c669a] dark:text-slate-400 text-lg max-w-2xl">
            A systematic approach to user feedback and process guidance. Ensure users are informed and guided seamlessly through complex tasks with our standardized alert and stepper components.
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        
        {/* Notification Center */}
        <section className="flex flex-col gap-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-[#0d121b] dark:text-white text-2xl font-bold tracking-[-0.015em]">Notification Center</h2>
            <span className="px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-bold">Live Component</span>
          </div>
          <p className="text-[#4c669a] dark:text-slate-400 mb-4 text-sm">The central hub for all system alerts. Designed to be non-intrusive yet easily accessible.</p>
          <div className="bg-white dark:bg-surface-dark rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 overflow-hidden relative min-h-[400px]">
            <div className="absolute top-0 left-0 w-full h-12 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-end px-6">
              <div className="relative cursor-pointer group">
                <div className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                  <span className="material-symbols-outlined text-slate-500 dark:text-slate-400 group-hover:text-primary">notifications</span>
                </div>
                <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-[#FFD025] border-2 border-slate-50 dark:border-slate-800"></span>
              </div>
            </div>
            <div className="p-8 flex justify-center items-start pt-16 h-full bg-slate-50/50 dark:bg-slate-900/50">
              
              {/* Interactive Component */}
              <NotificationCenter className="w-80 shadow-2xl" onViewAll={() => console.log("Navigating to activity...")} />

            </div>
          </div>
        </section>

        {/* Workflow Steppers */}
        <section className="flex flex-col gap-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-[#0d121b] dark:text-white text-2xl font-bold tracking-[-0.015em]">Workflow Steppers</h2>
            <span className="px-2 py-1 rounded bg-purple-100 text-purple-700 text-xs font-bold">Interactive</span>
          </div>
          <p className="text-[#4c669a] dark:text-slate-400 mb-4 text-sm">Guides users through multi-step processes. Indicates progress and sets clear expectations.</p>
          <div className="bg-white dark:bg-surface-dark rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 overflow-hidden flex flex-col min-h-[400px]">
            <div className="p-8 border-b border-slate-100 dark:border-slate-700">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">Horizontal Stepper</h3>
              
              {/* Interactive Component */}
              <Stepper 
                initialStep={1}
                steps={[
                  { id: '1', label: 'Account', content: 'Account Details Form Placeholder' },
                  { id: '2', label: 'Details', content: 'Personal Information Inputs' },
                  { id: '3', label: 'Review', content: 'Final Review Summary' }
                ]}
              />

            </div>
            <div className="flex-1 bg-slate-50/50 dark:bg-slate-900/50 p-8 flex items-center justify-center">
              <div className="w-full max-w-sm bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                
                {/* Vertical Stepper Component */}
                <VerticalStepper />

              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Usage Guidelines */}
      <section className="mb-16">
        <div className="mb-6">
          <h2 className="text-[#0d121b] dark:text-white text-2xl font-bold tracking-[-0.015em] mb-2">Usage Guidelines</h2>
          <p className="text-[#4c669a] dark:text-slate-400">Best practices for implementing notification and workflow components.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col">
            <div className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 flex items-center justify-center mb-4">
              <span className="material-symbols-outlined">priority_high</span>
            </div>
            <h3 className="font-bold text-[#0d121b] dark:text-white mb-2">Alert Priority</h3>
            <p className="text-sm text-slate-500 mb-4 flex-1">Use <span className="text-red-500 font-mono text-xs">bg-red-50</span> for critical errors, <span className="text-yellow-600 dark:text-yellow-500 font-mono text-xs">bg-yellow-50</span> for warnings, and <span className="text-primary font-mono text-xs">bg-blue-50</span> for information. Do not overuse red.</p>
            <div className="p-3 bg-red-50 dark:bg-red-900/10 rounded border border-red-100 dark:border-red-800/30">
              <div className="flex items-center gap-2 text-red-700 dark:text-red-400 text-xs font-bold">
                <span className="material-symbols-outlined text-sm">error</span> Critical Error
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col">
            <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/20 text-primary flex items-center justify-center mb-4">
              <span className="material-symbols-outlined">linear_scale</span>
            </div>
            <h3 className="font-bold text-[#0d121b] dark:text-white mb-2">Stepper State</h3>
            <p className="text-sm text-slate-500 mb-4 flex-1">Clearly distinguish between <span className="font-bold text-primary">active</span>, <span className="font-bold text-green-600">completed</span>, and <span className="text-slate-400">pending</span> steps. Active steps should always draw focus.</p>
            <div className="flex gap-2 items-center justify-center pt-2">
              <div className="h-2 w-8 bg-green-500 rounded-full"></div>
              <div className="h-2 w-8 bg-primary rounded-full ring-2 ring-blue-200"></div>
              <div className="h-2 w-8 bg-slate-200 rounded-full"></div>
            </div>
          </div>
          <div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col">
            <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4">
              <span className="material-symbols-outlined">notifications_off</span>
            </div>
            <h3 className="font-bold text-[#0d121b] dark:text-white mb-2">Noise Reduction</h3>
            <p className="text-sm text-slate-500 mb-4 flex-1">Group similar notifications. Avoid flooding the user's notification center with repetitive system logs.</p>
            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono bg-slate-50 dark:bg-slate-800 p-2 rounded">
              <span className="text-primary">3</span> new updates in "System"
            </div>
          </div>
        </div>
      </section>

      {/* Component API */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[#0d121b] dark:text-white text-2xl font-bold tracking-[-0.015em]">Component API</h2>
        </div>
        <div className="bg-[#1e293b] rounded-xl overflow-hidden shadow-2xl">
          <div className="flex items-center justify-between px-4 py-3 bg-[#0f172a] border-b border-slate-700">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <span className="text-xs font-mono text-slate-400">Notification.tsx</span>
            <button className="text-slate-400 hover:text-white transition-colors">
              <span className="material-symbols-outlined text-sm">content_copy</span>
            </button>
          </div>
          <div className="p-6 overflow-x-auto">
            <pre className="font-mono text-sm leading-relaxed text-slate-300">
              <span className="text-purple-400">interface</span> <span className="text-yellow-300">NotificationProps</span> {'{'}{'\n'}
              {'  '}<span className="text-blue-400">variant</span>: <span className="text-green-400">'info'</span> | <span className="text-green-400">'success'</span> | <span className="text-green-400">'warning'</span> | <span className="text-green-400">'error'</span>;{'\n'}
              {'  '}<span className="text-blue-400">title</span>: <span className="text-yellow-300">string</span>;{'\n'}
              {'  '}<span className="text-blue-400">message</span>: <span className="text-yellow-300">string</span>;{'\n'}
              {'  '}<span className="text-blue-400">timestamp</span>: <span className="text-yellow-300">Date</span>;{'\n'}
              {'  '}<span className="text-blue-400">isRead</span>?: <span className="text-yellow-300">boolean</span>;{'\n'}
              {'  '}<span className="text-blue-400">onRead</span>?: () <span className="text-purple-400">=&gt;</span> <span className="text-yellow-300">void</span>;{'\n'}
              {'}'}{'\n'}
              <span className="text-slate-500">// Example Usage</span>{'\n'}
              <span className="text-purple-400">&lt;Notification</span>{'\n'}
              {'  '}<span className="text-blue-400">variant</span>=<span className="text-green-400">"info"</span>{'\n'}
              {'  '}<span className="text-blue-400">title</span>=<span className="text-green-400">"AI Analysis"</span>{'\n'}
              {'  '}<span className="text-blue-400">message</span>=<span className="text-green-400">"Optimization complete."</span>{'\n'}
              {'  '}<span className="text-blue-400">isRead</span>={'{'}<span className="text-purple-400">false</span>{'}'}{'\n'}
              <span className="text-purple-400">/&gt;</span>
            </pre>
          </div>
        </div>
      </section>
    </div>
  );
};
