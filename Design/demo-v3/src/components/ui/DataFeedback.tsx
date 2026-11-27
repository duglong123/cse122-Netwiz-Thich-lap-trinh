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
    <div className="w-full overflow-x-auto rounded-2xl border border-[#26334a] bg-[#0e1523]">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-[#26334a] bg-[#0a111e]">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`px-4 py-3 text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#98a7bd] ${col.className ?? ''}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#26334a]/70">
          {data.map((row) => (
            <tr
              key={keyExtractor(row)}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              className={`transition-colors ${onRowClick ? 'hover:bg-[#121c2d] cursor-pointer' : 'hover:bg-[#0a111e]/60'}`}
            >
              {columns.map((col) => (
                <td key={col.key} className={`px-4 py-3.5 text-sm text-[#f3f6fc] align-middle ${col.className ?? ''}`}>
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
  <div className="flex flex-col items-center justify-center text-center py-12 px-6 rounded-2xl border border-dashed border-[#34435b] bg-[#0a111e]">
    <div className="p-3 rounded-xl bg-[#121c2d] text-[#f4d35e] mb-3">{icon}</div>
    <h4 className="display-font text-xl font-bold text-[#f3f6fc]">{title}</h4>
    <p className="text-sm text-[#98a7bd] mt-1 max-w-md">{description}</p>
    {action && <div className="mt-4">{action}</div>}
  </div>
);

export const ToastContainer: React.FC<{ toasts: ToastItem[]; onDismiss: (id: string) => void }> = ({
  toasts,
  onDismiss,
}) => {
  if (toasts.length === 0) return null;
  const styles = {
    info: 'bg-[#0e1523] border-[#4da3ff]/50 text-[#f3f6fc]',
    success: 'bg-[#45d483] border-[#45d483] text-[#07110b]',
    warning: 'bg-[#f4d35e] border-[#f4d35e] text-[#080c16]',
    error: 'bg-[#ef4444] border-[#ef4444] text-white',
  };
  const icons = {
    info: <Info className="w-4 h-4 text-[#4da3ff] shrink-0 mt-0.5" />,
    success: <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />,
    warning: <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />,
    error: <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />,
  };

  return (
    <div className="fixed bottom-5 right-5 z-[300] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto rounded-lg border px-4 py-3 shadow-[0_12px_36px_rgba(0,0,0,0.4)] flex items-start gap-3 ${styles[t.type]}`}
        >
          {icons[t.type]}
          <div className="flex-1 min-w-0">
            <div className="text-xs font-extrabold uppercase tracking-wide">{t.title}</div>
            {t.message && <div className="text-xs opacity-90 mt-0.5">{t.message}</div>}
          </div>
          <button type="button" onClick={() => onDismiss(t.id)} aria-label="Đóng" className="opacity-70 hover:opacity-100 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
