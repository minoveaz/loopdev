'use client';

import Link from 'next/link';
import { Heading, Icon, LpdText, TechnicalSurface } from '@loopdev/ui';

const views = [
  ['Inbox', 'Conversation queue with filters and unread states.', 'inbox'],
  ['Conversations', 'Message detail, assignments and local actions.', 'forum'],
  ['Contacts', 'Contact context connected to CRM records.', 'person'],
  ['Documents', 'Attachments, previews and download states.', 'description'],
] as const;

export default function CommunicationsPreviewPage() {
  return (
    <main className="min-h-screen bg-shell-canvas px-6 py-10 text-text-main md:px-10 lg:px-16">
      <div className="mx-auto flex max-w-7xl flex-col gap-10">
        <header className="flex flex-col gap-3 border-b border-border-technical pb-8">
          <Link href="/frontend-preview/sales-crm" className="font-mono text-[10px] uppercase tracking-widest text-primary">
            ← Sales &amp; CRM
          </Link>
          <div className="flex items-center gap-3">
            <Heading size="3xl" weight="bold" className="tracking-tight">
              Communications
            </Heading>
            <span className="rounded border border-primary/30 bg-primary/10 px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-primary">
              Preview
            </span>
          </div>
          <LpdText size="sm" className="max-w-2xl text-text-muted">
            Módulo visual de comunicaciones dentro de CRM. En esta fase las acciones y los datos son locales.
          </LpdText>
        </header>

        <section className="grid grid-cols-1 gap-5 md:grid-cols-2" aria-label="Communications views">
          {views.map(([name, description, icon]) => (
            <TechnicalSurface key={name} variant="surface" className="flex min-h-48 flex-col justify-between gap-6 border border-border-technical p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-background-subtle text-primary">
                <Icon name={icon} size="md" />
              </div>
              <div className="flex flex-col gap-2">
                <Heading size="sm" weight="bold">{name}</Heading>
                <LpdText size="sm" className="text-text-muted">{description}</LpdText>
              </div>
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-text-muted">
                Next visual slice
              </span>
            </TechnicalSurface>
          ))}
        </section>
      </div>
    </main>
  );
}