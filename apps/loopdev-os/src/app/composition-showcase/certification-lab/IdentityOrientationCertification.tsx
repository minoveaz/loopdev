'use client';

import {
  Badge,
  ContextPath,
  IndustrialBreadcrumbs,
  PageHeader,
  SectionHeader,
  StatusBadge,
  TechnicalCard,
  UserAvatar,
} from '@loopdev/ui';

const segments = [
  { id: 'crm', label: 'CRM', href: '/crm' },
  { id: 'contacts', label: 'Contacts', href: '/crm/contacts' },
  { id: 'active', label: 'Active records', isActive: true },
];

export function IdentityOrientationCertification() {
  return (
    <TechnicalCard className="space-y-5 p-4">
      <div>
        <h2 className="font-mono text-sm uppercase tracking-[0.14em] text-text-main">
          Identity and orientation
        </h2>
        <p className="mt-1 text-xs text-text-muted">
          A4 semantic identity and A5 internal navigation boundaries.
        </p>
      </div>
      <section
        className="space-y-4 rounded-lg border border-border-subtle bg-surface-elevated/40 p-4"
        aria-labelledby="identity-examples"
      >
        <h3
          id="identity-examples"
          className="text-xs font-semibold uppercase tracking-[0.12em] text-text-main"
        >
          Identity and semantic status
        </h3>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <UserAvatar name="Alex Morgan" size="md" status="online" withStatus />
            <span className="text-sm text-text-main">Alex Morgan</span>
          </div>
          <div className="flex items-center gap-2">
            <UserAvatar initials="CM" size="sm" status="busy" withStatus />
            <span className="text-sm text-text-main">Case manager</span>
          </div>
          <Badge status="success" variant="solid">
            Active
          </Badge>
          <Badge status="energy" variant="outline">
            Review
          </Badge>
          <StatusBadge label="READY" severity="success" variant="glass" withPulse />
          <StatusBadge label="READ ONLY" severity="neutral" variant="outline" />
        </div>
      </section>
      <section
        className="space-y-4 rounded-lg border border-border-subtle bg-surface-elevated/40 p-4"
        aria-labelledby="orientation-examples"
      >
        <h3
          id="orientation-examples"
          className="text-xs font-semibold uppercase tracking-[0.12em] text-text-main"
        >
          Orientation and local navigation
        </h3>
        <PageHeader
          title="Contacts"
          eyebrow="CRM workspace"
          description="Manage the records assigned to your team."
        />
        <SectionHeader title="Active records" />
        <div className="space-y-3 overflow-x-auto">
          <ContextPath segments={segments} maxVisible={3} onNavigate={() => undefined} />
          <IndustrialBreadcrumbs segments={segments} />
        </div>
      </section>
    </TechnicalCard>
  );
}
