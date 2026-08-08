import { LpdText, Button } from '@loopdev/ui';

interface TablePaginationProps {
  pages: number;
  total: number;
  limit?: number;
  currentOffset: number;
  onPageChange?: (offset: number) => void;
}

export function TablePagination({
  pages,
  total,
  limit = 50,
  currentOffset,
  onPageChange,
}: TablePaginationProps) {
  if (pages <= 1) return null;

  return (
    <div className="flex items-center justify-between">
      <LpdText size="xs" className="text-text-muted">
        Page {Math.floor(currentOffset / limit) + 1} of {pages} ({total} total)
      </LpdText>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange?.(Math.max(0, currentOffset - limit))}
          disabled={currentOffset === 0}
          className="px-3 py-1 text-sm border border-border-technical/30 rounded hover:bg-background-elevated disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          ← Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange?.(currentOffset + limit)}
          disabled={currentOffset + limit >= total}
          className="px-3 py-1 text-sm border border-border-technical/30 rounded hover:bg-background-elevated disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next →
        </Button>
      </div>
    </div>
  );
}
