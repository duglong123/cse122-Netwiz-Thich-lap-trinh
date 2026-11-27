import React from 'react';

export interface TabOption {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
}

interface TabsProps {
  tabs: TabOption[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onChange, className = '' }) => (
  <div className={`inline-flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-[var(--panel-deep)] border border-[var(--line)] ${className}`}>
    {tabs.map((tab) => {
      const isActive = tab.id === activeTab;
      return (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-extrabold uppercase tracking-[0.06em] transition-all cursor-pointer ${
            isActive
              ? 'bg-[var(--yellow)] text-[var(--yellow-on)]'
              : 'text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--panel-2)]'
          }`}
        >
          {tab.icon}
          <span>{tab.label}</span>
          {tab.badge !== undefined && (
            <span
              className={`px-1.5 py-0.5 text-[10px] mono rounded-full ${
                isActive ? 'bg-black/15 text-[var(--yellow-on)]' : 'bg-[var(--panel-2)] text-[var(--text)]'
              }`}
            >
              {tab.badge}
            </span>
          )}
        </button>
      );
    })}
  </div>
);
