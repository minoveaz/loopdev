import React from 'react';

export default {
  title: 'Design System/Foundations',
};

export const Colors = () => (
  <div className="space-y-8">
    <section>
      <h2 className="text-lpd-2xl font-bold mb-4 font-sans text-lpd-text-base">Brand Colors</h2>
      <div className="flex gap-4">
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-lpd-lg bg-lpd-brand-primary shadow-lpd-md"></div>
          <span className="text-lpd-xs mt-2 font-mono">Primary</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-lpd-lg bg-lpd-brand-secondary shadow-lpd-md"></div>
          <span className="text-lpd-xs mt-2 font-mono">Energy</span>
        </div>
      </div>
    </section>

    <section>
      <h2 className="text-lpd-2xl font-bold mb-4 font-sans text-lpd-text-base">Typography (Inter)</h2>
      <div className="space-y-2">
        <p className="text-lpd-7xl font-black">Headline 7XL</p>
        <p className="text-lpd-2xl font-semibold">Subheadline 2XL</p>
        <p className="text-lpd-base">Body text base - The quick brown fox jumps over the lazy dog.</p>
        <p className="text-lpd-xs text-lpd-text-muted">Caption text muted - Inter is loading correctly.</p>
      </div>
    </section>

    <section>
      <h2 className="text-lpd-2xl font-bold mb-4 font-sans text-lpd-text-base">Mono (JetBrains Mono)</h2>
      <div className="bg-lpd-bg-surface-dark p-lpd-space-4 rounded-lpd-md">
        <code className="text-lpd-yellow-400 font-mono">const loopdev = &#123; mission: "SaaS Excellence" &#125;;</code>
      </div>
    </section>

    <section>
      <h2 className="text-lpd-2xl font-bold mb-4 font-sans text-lpd-text-base">Elevation & Radius</h2>
      <div className="flex gap-8">
        <div className="p-lpd-space-8 bg-white rounded-lpd-sm shadow-lpd-sm">Small Shadow</div>
        <div className="p-lpd-space-8 bg-white rounded-lpd-md shadow-lpd-md">Medium Shadow</div>
        <div className="p-lpd-space-8 bg-white rounded-lpd-xl shadow-lpd-lg">Large Shadow</div>
      </div>
    </section>
  </div>
);
