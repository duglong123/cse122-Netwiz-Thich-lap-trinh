import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';

export interface DropdownItem {
  id: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  danger?: boolean;
  onClick: () => void;
}

interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  align?: 'left' | 'right';
}

export const Dropdown: React.FC<DropdownProps> = ({ trigger, items, align = 'right' }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  return (
    <div ref={ref} className="relative inline-block">
      <button type="button" onClick={() => setOpen((o) => !o)} className="inline-flex items-center gap-1.5 cursor-pointer rounded-lg">
        {trigger}
        <ChevronDown className={`w-3.5 h-3.5 text-[var(--muted)] transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div
          className={`absolute z-40 mt-2 w-72 rounded-xl bg-[var(--panel)] border border-[var(--line-strong)] shadow-2xl py-1.5 ${
            align === 'right' ? 'right-0' : 'left-0'
          }`}
        >
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                item.onClick();
                setOpen(false);
              }}
              className={`w-full px-3.5 py-2.5 text-left flex items-start gap-2.5 transition-colors cursor-pointer ${
                item.danger ? 'text-[var(--red-fg)] hover:bg-[var(--red-soft)]' : 'text-[var(--text)] hover:bg-[var(--panel-2)]'
              }`}
            >
              {item.icon && <span className="mt-0.5 shrink-0">{item.icon}</span>}
              <div className="min-w-0">
                <div className="text-xs font-bold uppercase tracking-wide truncate">{item.label}</div>
                {item.description && <div className="text-[11px] text-[var(--muted)] truncate mt-0.5">{item.description}</div>}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
