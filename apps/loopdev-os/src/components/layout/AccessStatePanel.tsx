import Link from 'next/link';
import { Heading } from '@loopdev/ui';
import type { AccessState } from '@/core/access/accessState';

const messages: Record<Exclude<AccessState, 'loading' | 'authorized'>, { title: string; description: string; action: string; href: string }> = {
  'session-expired': {
    title: 'Your session has expired',
    description: 'Sign in again to restore your secure workspace session.',
    action: 'Sign in',
    href: '/login',
  },
  'membership-pending': {
    title: 'Your organization access is pending',
    description: 'An organization administrator must activate your membership before you can enter its workspaces.',
    action: 'Return to launchpad',
    href: '/launchpad',
  },
  'no-organization-access': {
    title: 'No organization access',
    description: 'Your account does not have an active organization membership. Ask an administrator to grant access.',
    action: 'Return to launchpad',
    href: '/launchpad',
  },
};

export function AccessStatePanel({ state }: { state: Exclude<AccessState, 'loading' | 'authorized'> }) {
  const message = messages[state];

  return (
    <main className="bg-shell-canvas flex min-h-screen items-center justify-center p-6">
      <section className="w-full max-w-md rounded-2xl border border-black/10 bg-white p-6 text-center shadow-sm dark:border-white/10 dark:bg-slate-950">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">LoopDev access</p>
        <Heading as="h1" size="lg" weight="bold" className="text-slate-950 dark:text-white">{message.title}</Heading>
        <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{message.description}</p>
        <Link href={message.href} className="mt-6 inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white">
          {message.action}
        </Link>
      </section>
    </main>
  );
}
