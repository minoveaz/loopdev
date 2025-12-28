import React from 'react';
import { useTenant } from '@/providers/tenant-provider';
import { TENANT_STRATEGIES } from '@/data/tenants';

export const BrandIdentityView: React.FC = () => {
  const { tenant, subbrand } = useTenant();
  const strategy = TENANT_STRATEGIES[tenant];

  return (
    <div className="p-8 space-y-8 max-w-5xl w-full mx-auto">
      <header className="space-y-4 border-b pb-8">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold tracking-tight text-[var(--lpd-color-text-base)]">
            Brand Identity DNA
          </h1>
          <p className="text-[var(--lpd-color-text-muted)] text-lg">
            Visualizing identity for <span className="font-semibold text-[var(--lpd-color-primary)] capitalize">{tenant.replace('-', ' ')}</span>
            {subbrand !== 'none' && (
              <>
                <span className="mx-2 opacity-50">/</span>
                <span className="font-semibold text-[var(--lpd-color-secondary)] capitalize">{subbrand.replace('-', ' ')}</span>
              </>
            )}
          </p>
        </div>

        {strategy && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            <div className="space-y-1">
              <p className="text-[10px] uppercase tracking-widest text-[var(--lpd-color-text-muted)] font-mono">Purpose</p>
              <p className="text-lg font-medium leading-snug">{strategy.purpose}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] uppercase tracking-widest text-[var(--lpd-color-text-muted)] font-mono">Brand Promise</p>
              <p className="text-lg font-medium leading-snug italic">"{strategy.promise}"</p>
            </div>
          </div>
        )}
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Strategy Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-[var(--lpd-color-text-base)]">Brand Strategy</h2>
          
          <div className="space-y-4">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-[var(--lpd-color-text-muted)] mb-2 font-mono">Personality Traits</p>
              <div className="flex flex-wrap gap-2">
                {strategy?.personality.map(trait => (
                  <span key={trait} className="px-3 py-1 rounded-full bg-[var(--lpd-color-primary)] text-white text-xs font-bold">
                    {trait}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-widest text-[var(--lpd-color-text-muted)] mb-2 font-mono">Voice & Tone</p>
              <div className="p-4 rounded-xl bg-[var(--lpd-color-bg-subtle)] border border-[var(--lpd-color-border-subtle)]">
                <p className="text-sm font-medium mb-2">{strategy?.voice.base}</p>
                <div className="flex flex-wrap gap-2">
                  {strategy?.voice.traits.map(trait => (
                    <span key={trait} className="text-xs text-[var(--lpd-color-text-muted)] flex items-center">
                      <span className="w-1 h-1 rounded-full bg-[var(--lpd-color-secondary)] mr-1.5" />
                      {trait}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Colors Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-[var(--lpd-color-text-base)]">Foundational Colors</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="group space-y-2">
              <div className="h-24 w-full rounded-xl bg-[var(--lpd-color-primary)] shadow-sm border border-black/5" />
              <div>
                <p className="text-sm font-bold">Primary</p>
                <p className="text-xs text-[var(--lpd-color-text-muted)] font-mono">--lpd-color-primary</p>
              </div>
            </div>
            <div className="group space-y-2">
              <div className="h-24 w-full rounded-xl bg-[var(--lpd-color-secondary)] shadow-sm border border-black/5" />
              <div>
                <p className="text-sm font-bold">Secondary</p>
                <p className="text-xs text-[var(--lpd-color-text-muted)] font-mono">--lpd-color-secondary</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Typography Section */}
      <section className="space-y-6 pt-4">
        <h2 className="text-2xl font-semibold text-[var(--lpd-color-text-base)]">Typography</h2>
        <div className="space-y-8 p-8 rounded-2xl bg-[var(--lpd-color-bg-subtle)] border border-[var(--lpd-color-border-subtle)] shadow-inner">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-[var(--lpd-color-text-muted)] mb-4 font-mono">Type Specimen</p>
            <p className="text-5xl font-sans leading-tight tracking-tight">Design Engineering for the Modern Web</p>
            <p className="mt-4 text-xl font-sans text-[var(--lpd-color-text-muted)]">ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 1234567890</p>
          </div>
        </div>
      </section>

      {/* Context Data */}
      <footer className="mt-12 pt-8 border-t">
        <details className="cursor-pointer group">
          <summary className="text-sm font-mono text-[var(--lpd-color-text-muted)] hover:text-[var(--lpd-color-primary)] transition-colors">
            View Raw Context Data
          </summary>
          <div className="mt-4 p-4 rounded-lg bg-black text-green-400 font-mono text-xs overflow-auto">
            <pre>{JSON.stringify({ tenant, subbrand, strategy, timestamp: new Date().toISOString() }, null, 2)}</pre>
          </div>
        </details>
      </footer>
    </div>
  );
};
