import { LpdText } from '@loopdev/ui';

interface HistoryTableStateProps {
  kind: 'loading' | 'error' | 'empty';
  loadingRowClassName?: string;
  message?: string;
}

export function HistoryTableState({
  kind,
  loadingRowClassName = 'h-12',
  message,
}: HistoryTableStateProps) {
  if (kind === 'loading') {
    return (
      <div className="bg-background-surface border-border-technical/30 rounded-lg border p-8">
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className={`${loadingRowClassName} bg-background-elevated animate-pulse rounded`}
            />
          ))}
        </div>
      </div>
    );
  }

  if (kind === 'error') {
    return (
      <div className="bg-status-error/10 border-status-error/30 rounded-lg border p-4">
        <LpdText size="sm" className="text-red-500">
          Failed to load {message}
        </LpdText>
      </div>
    );
  }

  return (
    <div className="bg-background-surface border-border-technical/30 rounded-lg border p-12 text-center">
      <LpdText size="sm" className="text-text-muted">
        No {message} found
      </LpdText>
    </div>
  );
}
