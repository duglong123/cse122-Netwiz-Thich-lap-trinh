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
  <div
    className={`inline-flex flex-wrap items-center gap-1 p-1 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)] ${className}`}
  >
    {tabs.map((tab) => {
      const isActive = tab.id === activeTab;
      return (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] ${
            isActive
              ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-sm border border-[var(--border-subtle)]'
              : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] border border-transparent'
          }`}
        >
          {tab.icon}
          <span>{tab.label}</span>
          {tab.badge !== undefined && (
            <span className="px-1.5 py-0.5 text-[11px] font-mono rounded-full bg-[var(--bg-muted)] text-[var(--text-primary)]">
              {tab.badge}
            </span>
          )}
        </button>
      );
    })}
  </div>
);
