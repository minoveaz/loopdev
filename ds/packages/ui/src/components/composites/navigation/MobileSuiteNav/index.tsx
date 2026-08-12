'use client';

import React from 'react';

export type MobileSuiteNavItem = {
  label: string;
  icon: string;
  active?: boolean;
  path?: string;
};

export type MobileSuiteNavProps = {
  items: MobileSuiteNavItem[];
  onNavigate: (item: MobileSuiteNavItem) => void;
};

export const MobileSuiteNav: React.FC<MobileSuiteNavProps> = ({ items, onNavigate }) => (
  <div className="grid grid-cols-4 gap-1 py-2">
    {items.map((item) => (
      <button
        key={item.label}
        type="button"
        aria-current={item.active ? 'page' : undefined}
        aria-label={item.path ? undefined : `Abrir ${item.label.toLowerCase()}`}
        onClick={() => onNavigate(item)}
        className={`flex min-w-0 touch-manipulation flex-col items-center gap-0.5 rounded-lg px-1 py-1 text-[10px] font-medium ${item.active ? 'text-primary' : 'text-slate-500 dark:text-slate-400'}`}
      >
        <span
          className="pointer-events-none material-symbols-outlined text-[20px]"
          aria-hidden="true"
        >
          {item.icon}
        </span>
        <span className="truncate">{item.label}</span>
      </button>
    ))}
  </div>
);
