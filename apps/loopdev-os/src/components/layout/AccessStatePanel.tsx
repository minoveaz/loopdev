'use client';

import Link from 'next/link';
import { Heading } from '@loopdev/ui';
import type { AccessState } from '@/core/access/accessState';
import { useAuth } from '@/hooks/useAuth';

const messages: Record<
  Exclude<AccessState, 'loading' | 'authorized'>,
  { title: string; description: string; action: string; href: string }
> = {
  'session-expired': {
    title: 'Your session has expired',
    description: 'Sign in again to restore your secure workspace session.',
    action: 'Sign in',
    href: '/login',
  },
  'membership-pending': {
    title: 'Your organization access is pending',
    description:
      'An organization administrator must activate your membership before you can enter its workspaces.',
    action: 'Return to launchpad',
    href: '/launchpad',
  },
  'no-organization-access': {
    title: 'No organization access',
    description:
      'Your account does not have an active organization membership. Ask an administrator to grant access.',
    action: 'Return to launchpad',
    href: '/launchpad',
  },
};

export function AccessStatePanel({
  state,
}: {
  state: Exclude<AccessState, 'loading' | 'authorized'>;
}) {
  const message = messages[state];
  const { signOut } = useAuth();

  return (
    <main className="bg-shell-canvas flex min-h-screen items-center justify-center p-6">
      <section className="w-full max-w-md rounded-2xl border border-black/10 bg-white p-6 text-center shadow-sm dark:border-white/10 dark:bg-slate-950">
        <p className="text-primary mb-2 text-xs font-bold uppercase tracking-[0.18em]">
          LoopDev access
        </p>
        <Heading as="h1" size="lg" weight="bold" className="text-slate-950 dark:text-white">
          {message.title}
        </Heading>
        <p className="text-text-muted mt-3 text-sm leading-6">{message.description}</p>
        <Link
          href={message.href}
          className="bg-primary mt-6 inline-flex rounded-lg px-4 py-2 text-sm font-semibold text-white"
        >
          {message.action}
        </Link>
        {state !== 'session-expired' && (
          <button
            type="button"
            className="text-primary mt-3 block w-full text-sm font-semibold underline-offset-4 hover:underline"
            onClick={signOut}
          >
            Sign out and use another account
          </button>
        )}
      </section>
    </main>
  );
}
