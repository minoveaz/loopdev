
import React from 'react';

export type IconButtonVariant = 'neutral' | 'primary' | 'danger' | 'success';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: string;
  variant?: IconButtonVariant;
  tooltip?: string;
  isLoading?: boolean;
}

export const IconButton: React.FC<IconButtonProps> = ({ 
  icon = 'settings', 
  variant = 'neutral', 
  tooltip, 
  className = '', 
  isLoading = false,
  disabled,
  ...props 
}) => {
  // Variant Definitions using Design System Tokens
  const variants = {
    neutral: 'text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800',
    primary: 'text-primary hover:text-primary-dark hover:bg-primary/10',
    danger: 'text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20',
    success: 'text-slate-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20'
  };

  return (
    <button
      type="button"
      title={tooltip}
      disabled={disabled || isLoading}
      className={`
        w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        focus:outline-none focus:ring-2 focus:ring-primary/20
        ${variants[variant]}
        ${className}
      `}
      {...props}
    >
      {isLoading ? (
        <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
      ) : (
        <span className="material-symbols-outlined text-[20px]">{icon}</span>
      )}
    </button>
  );
};
