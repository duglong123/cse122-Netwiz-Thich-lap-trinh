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
  <div className={`inline-flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-[#0a111e] border border-[#26334a] ${className}`}>
    {tabs.map((tab) => {
      const isActive = tab.id === activeTab;
      return (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-extrabold uppercase tracking-[0.06em] transition-all cursor-pointer ${
            isActive
              ? 'bg-[#f4d35e] text-[#080c16]'
              : 'text-[#98a7bd] hover:text-[#f3f6fc] hover:bg-[#121c2d]'
          }`}
        >
          {tab.icon}
          <span>{tab.label}</span>
          {tab.badge !== undefined && (
            <span
              className={`px-1.5 py-0.5 text-[10px] mono rounded-full ${
                isActive ? 'bg-[#080c16]/20 text-[#080c16]' : 'bg-[#1a2538] text-[#f3f6fc]'
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
