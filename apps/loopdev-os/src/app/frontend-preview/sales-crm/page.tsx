'use client';

import Link from 'next/link';
import { Heading, Icon, LpdText, TechnicalSurface } from '@loopdev/ui';

const modules = [
  {
    name: 'CRM Dashboard',
    description: 'Pipeline overview, activity and commercial metrics.',
    route: '/sales-crm',
    status: 'Existing UI',
    icon: 'dashboard',
  },
  {
    name: 'Pipeline',
    description: 'Kanban workflow for opportunities and deal stages.',
    route: '/sales-crm/pipeline',
    status: 'Existing UI',
    icon: 'view_kanban',
  },
  {
    name: 'Customers',
    description: 'Customer directory and relationship details.',
    route: '/sales-crm/customers',
    status: 'Existing UI',
    icon: 'groups',
  },
  {
    name: 'Communications',
    description: 'Inbox, conversations, contacts and documents inside CRM.',
    route: '/frontend-preview/sales-crm/communications',
    status: 'Frontend work',
    icon: 'forum',
  },
];

export default function SalesCrmPreviewPage() {
  return (
    <main className="min-h-screen bg-shell-canvas px-6 py-10 text-text-main md:px-10 lg:px-16">
      <div className="mx-auto flex max-w-7xl flex-col gap-10">
        <header className="flex flex-col gap-3 border-b border-border-technical pb-8">
          <Link href="/frontend-preview" className="font-mono text-[10px] uppercase tracking-widest text-primary">
            ← Back to suites
          </Link>
          <Heading size="3xl" weight="bold" className="tracking-tight">
            Sales &amp; CRM
          </Heading>
          <LpdText size="sm" className="max-w-2xl text-text-muted">
            Preview del ecosistema comercial. Communications vive dentro de esta suite y comparte su contexto de trabajo.
          </LpdText>
        </header>

        <section className="grid grid-cols-1 gap-5 md:grid-cols-2" aria-label="Sales CRM modules">
          {modules.map((module) => {
            const isCommunications = module.name === 'Communications';
            const content = (
              <TechnicalSurface
                variant="surface"
                className="group flex min-h-48 flex-col justify-between gap-6 border border-border-technical p-6 transition-colors hover:border-primary/50 hover:bg-primary/5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-background-subtle text-blue-500">
                    <Icon name={module.icon} size="md" />
                  </div>
                  <span className="rounded border border-border-technical px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-text-muted">
                    {module.status}
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  <Heading size="sm" weight="bold">
                    {module.name}
                  </Heading>
                  <LpdText size="sm" className="text-text-muted">
                    {module.description}
                  </LpdText>
                </div>
                <div className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-widest text-primary">
                  {isCommunications ? 'Open preview' : 'Inspect existing route'}
                  <Icon name="arrow_forward" size="xs" />
                </div>
              </TechnicalSurface>
            );

            return (
              <Link
                key={module.name}
                href={module.route}
                className="rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                {content}
              </Link>
            );
          })}
        </section>
      </div>
    </main>
  );
}