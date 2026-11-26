import React from 'react';
import { AlertCircle, CheckCircle2, Info, Loader2, X } from 'lucide-react';
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
  if (data.length === 0 && emptyState) {
    return <>{emptyState}</>;
  }
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-slate-800 bg-[#111827]">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-800 bg-slate-900/70">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400 ${col.className ?? ''}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/70">
          {data.map((row) => (
            <tr
              key={keyExtractor(row)}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              className={`transition-colors ${
                onRowClick ? 'hover:bg-slate-800/60 cursor-pointer' : 'hover:bg-slate-900/50'
              }`}
            >
              {columns.map((col) => (
                <td key={col.key} className={`px-4 py-3.5 text-sm text-slate-200 align-middle ${col.className ?? ''}`}>
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
  <div className="flex flex-col items-center justify-center text-center py-12 px-6 rounded-xl border border-dashed border-slate-700/80 bg-slate-900/30">
    <div className="p-3 rounded-xl bg-slate-800/80 text-slate-400 mb-3">{icon}</div>
    <h4 className="text-base font-semibold text-slate-200">{title}</h4>
    <p className="text-sm text-slate-400 mt-1 max-w-md">{description}</p>
    {action && <div className="mt-4">{action}</div>}
  </div>
);

export const LoadingState: React.FC<{ label?: string }> = ({ label = 'Đang tải dữ liệu...' }) => (
  <div className="flex items-center justify-center gap-2.5 py-12 text-slate-400 text-sm">
    <Loader2 className="w-5 h-5 animate-spin text-blue-400" />
    <span>{label}</span>
  </div>
);

export const ToastContainer: React.FC<{ toasts: ToastItem[]; onDismiss: (id: string) => void }> = ({
  toasts,
  onDismiss,
}) => {
  if (toasts.length === 0) return null;
  const styles = {
    info: 'border-blue-500/40 bg-[#162032] text-blue-200',
    success: 'border-emerald-500/40 bg-[#11241E] text-emerald-200',
    warning: 'border-amber-500/40 bg-[#231B0E] text-amber-200',
    error: 'border-rose-500/40 bg-[#251218] text-rose-200',
  };
  const icons = {
    info: <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />,
    success: <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />,
    warning: <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />,
    error: <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />,
  };

  return (
    <div className="fixed bottom-4 right-4 z-[60] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto rounded-xl border px-4 py-3 shadow-xl flex items-start gap-3 ${styles[t.type]}`}
        >
          {icons[t.type]}
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-slate-100">{t.title}</div>
            {t.message && <div className="text-xs text-slate-300 mt-0.5">{t.message}</div>}
          </div>
          <button
            type="button"
            onClick={() => onDismiss(t.id)}
            aria-label="Đóng thông báo"
            className="text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
