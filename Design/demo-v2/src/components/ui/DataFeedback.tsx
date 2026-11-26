import React from 'react';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';
import { ToastItem } from '../../types';

export interface ColumnDef<T> {
  key: string;
  header: string;
  className?: string;
  render: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  keyExtractor: (row: T) => string;
  emptyState?: React.ReactNode;
  onRowClick?: (row: T) => void;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  emptyState,
  onRowClick,
}: DataTableProps<T>) {
  if (data.length === 0 && emptyState) return <>{emptyState}</>;
  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-subtle)]">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`px-4 py-3 text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] ${col.className ?? ''}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border-subtle)]">
          {data.map((row) => (
            <tr
              key={keyExtractor(row)}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              className={`transition-colors ${onRowClick ? 'hover:bg-[var(--bg-subtle)]/70 cursor-pointer' : ''}`}
            >
              {columns.map((col) => (
                <td key={col.key} className={`px-4 py-3.5 text-sm text-[var(--text-primary)] align-middle ${col.className ?? ''}`}>
                  {col.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center text-center py-12 px-6 rounded-2xl border border-dashed border-[var(--border-strong)] bg-[var(--bg-subtle)]/40">
    <div className="p-3 rounded-xl bg-[var(--bg-subtle)] text-[var(--text-muted)] mb-3">{icon}</div>
    <h4 className="text-base font-bold text-[var(--text-primary)]">{title}</h4>
    <p className="text-sm text-[var(--text-secondary)] mt-1 max-w-md">{description}</p>
    {action && <div className="mt-4">{action}</div>}
  </div>
);

export const ToastContainer: React.FC<{ toasts: ToastItem[]; onDismiss: (id: string) => void }> = ({
  toasts,
  onDismiss,
}) => {
  if (toasts.length === 0) return null;
  const icons = {
    info: <Info className="w-4 h-4 text-[var(--accent-primary)] shrink-0 mt-0.5" />,
    success: <CheckCircle2 className="w-4 h-4 text-[var(--accent-success)] shrink-0 mt-0.5" />,
    warning: <AlertCircle className="w-4 h-4 text-[var(--accent-warning)] shrink-0 mt-0.5" />,
    error: <AlertCircle className="w-4 h-4 text-[var(--accent-danger)] shrink-0 mt-0.5" />,
  };

  return (
    <div className="fixed bottom-4 right-4 z-[60] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="pointer-events-auto rounded-xl border border-[var(--border-strong)] bg-[var(--bg-surface)] px-4 py-3 shadow-xl flex items-start gap-3"
        >
          {icons[t.type]}
          <div className="flex-1 min-w-0">
            <div className="text-sm font-bold text-[var(--text-primary)]">{t.title}</div>
            {t.message && <div className="text-xs text-[var(--text-secondary)] mt-0.5">{t.message}</div>}
          </div>
          <button
            type="button"
            onClick={() => onDismiss(t.id)}
            aria-label="Đóng thông báo"
            className="text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
