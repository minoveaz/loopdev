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
      <div className="bg-background-surface rounded-lg border border-border-technical/30 p-8">
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className={`${loadingRowClassName} bg-background-elevated rounded animate-pulse`}
            />
          ))}
        </div>
      </div>
    );
  }

  if (kind === 'error') {
    return (
      <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
        <LpdText size="sm" className="text-red-500">
          Failed to load {message}
        </LpdText>
      </div>
    );
  }

  return (
    <div className="bg-background-surface rounded-lg border border-border-technical/30 p-12 text-center">
      <LpdText size="sm" className="text-text-muted">
        No {message} found
      </LpdText>
    </div>
  );
}
