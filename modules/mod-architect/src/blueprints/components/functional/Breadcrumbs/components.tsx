import React from 'react';
import { Link } from 'react-router-dom';

export const BreadcrumbContainer: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <nav aria-label="Breadcrumb">
    <div className={`flex items-center gap-2 text-sm ${className}`}>
      {children}
    </div>
  </nav>
);

export const BreadcrumbSeparator: React.FC = () => (
  <span className="material-symbols-outlined text-[10px] text-slate-300 select-none">
    chevron_right
  </span>
);

interface ItemProps {
  label: string;
  href?: string;
}

export const BreadcrumbItem: React.FC<ItemProps> = ({ label, href }) => {
  const baseClasses = "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors";
  
  if (href) {
    return (
      <Link to={href} className={baseClasses}>
        {label}
      </Link>
    );
  }
  
  return <span className={baseClasses}>{label}</span>;
};

export const BreadcrumbActiveItem: React.FC<{ label: string }> = ({ label }) => (
  <span 
    className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-900/30 text-primary dark:text-blue-400 font-medium text-xs"
    aria-current="page"
  >
    {label}
  </span>
);