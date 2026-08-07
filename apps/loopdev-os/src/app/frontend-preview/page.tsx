'use client';

import {
  BlueprintBackground,
  Heading,
  Icon,
  LpdText,
  SuiteCard,
  UIKitIllustration,
} from '@loopdev/ui';

const suites = [
  {
    id: 'marketing-studio',
    name: 'Marketing Studio',
    description: 'High-performance identity governance and generative content engine for modern teams.',
    route: '/frontend-preview/marketing-studio',
    version: '1.0.4',
    illustration: <UIKitIllustration />,
  },
  {
    id: 'sales-crm',
    name: 'Sales & CRM',
    description: 'Pipeline intelligence and relationship management powered by predictive neural models.',
    route: '/frontend-preview/sales-crm',
    version: '0.8.2',
    illustration: <Icon name="groups" size="md" />,
  },
  {
    id: 'quant-ops',
    name: 'Quant Ops',
    description: 'Algorithmic trading engine and high-frequency execution command center.',
    route: '/frontend-preview/quant-ops',
    version: '0.0.1',
    illustration: <Icon name="trending_up" size="md" />,
  },
  {
    id: 'health-os',
    name: 'Health OS',
    description: 'Industrial-grade clinical care, electronic health records (HCE), and medical agenda for IPS providers.',
    route: '/frontend-preview/health-os',
    version: '0.1.0',
    illustration: <Icon name="medical_services" size="md" />,
  },
  {
    id: 'financial-ops',
    name: 'Financial Ops',
    description: 'Automated billing, payroll, and industrial-grade fiscal compliance orchestration.',
    route: '#',
    version: '0.5.0',
    illustration: <Icon name="payments" size="md" />,
    locked: true,
  },
];

export default function FrontendPreviewPage() {
  return (
    <main className="relative h-full overflow-y-auto bg-shell-canvas text-text-main">
      <BlueprintBackground variant="monochrome" intensity="high" className="fixed inset-0 pointer-events-none" />
      <div className="relative z-10 mx-auto flex min-h-full max-w-6xl flex-col justify-center px-6 py-10 lg:px-16 lg:py-20">
        <header className="mb-12">
          <div className="mb-4 flex items-center gap-3">
            <LpdText size="nano" weight="black" className="text-primary tracking-[0.5em] uppercase">
              Frontend_Preview
            </LpdText>
            <span className="font-mono text-[10px] uppercase tracking-widest text-text-muted">Local visual workspace</span>
          </div>
          <Heading size="3xl" weight="bold" className="max-w-2xl tracking-tight dark:text-white">
            Initialize your <span className="font-black text-primary">Work Context</span> in preview mode.
          </Heading>
          <LpdText size="sm" className="mt-4 max-w-2xl text-text-muted">
            Misma composición visual que el Launchpad, con datos y navegación de revisión sin persistencia real.
          </LpdText>
        </header>

        <section className="grid grid-cols-1 gap-8 md:grid-cols-3" aria-label="LoopDev suites">
          {suites.map((suite) => (
            <SuiteCard
              key={suite.id}
              title={suite.name}
              description={suite.description}
              illustration={suite.illustration}
              href={suite.route}
              version={suite.version}
              isLocked={suite.locked}
            />
          ))}
        </section>

        <footer className="mt-12 border-t border-white/5 pt-6 font-mono text-[10px] uppercase tracking-widest text-text-muted">
          Preview mode only · Real organization, permissions and persistence remain protected
        </footer>
      </div>
    </main>
  );
}