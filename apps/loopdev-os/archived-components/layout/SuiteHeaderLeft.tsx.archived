import { CommandBarTrigger, ContextPath, Divider, SuiteSwitcher } from '@loopdev/ui';
import type { SuiteIdentity } from '@loopdev/contracts';

interface SuiteHeaderLeftProps {
  currentSuite: SuiteIdentity;
  availableSuites: SuiteIdentity[];
  label: string;
  href: string;
  onOpenChange: (open: boolean) => void;
  onSuiteChange: (id: string) => void;
}

export function SuiteHeaderLeft({
  currentSuite,
  availableSuites,
  label,
  href,
  onOpenChange,
  onSuiteChange,
}: SuiteHeaderLeftProps) {
  return (
    <div className="flex items-center gap-4">
      <SuiteSwitcher
        currentSuite={currentSuite}
        availableSuites={availableSuites}
        onOpenChange={onOpenChange}
        onSuiteChange={onSuiteChange}
      />
      <Divider orientation="vertical" thickness="technical" className="h-4" />
      <ContextPath segments={[{ id: 'suite', label, href, isActive: true }]} />
    </div>
  );
}

export { CommandBarTrigger };
