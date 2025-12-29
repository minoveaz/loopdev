import React from 'react';
import { cn } from '../../helpers/cn';
import { Info, CheckCircle, AlertTriangle, XCircle, X } from 'lucide-react';

export type AlertVariant = 'info' | 'success' | 'warning' | 'error';

export interface AlertProps {
  title: string;
  description?: string;
  variant?: AlertVariant;
  onClose?: () => void;
  className?: string;
}

const variantStyles: Record<AlertVariant, string> = {
  info: "bg-blue-50 border-blue-500 text-blue-900 dark:bg-blue-900/20 dark:text-blue-100",
  success: "bg-green-50 border-green-500 text-green-900 dark:bg-green-900/20 dark:text-green-100",
  warning: "bg-amber-50 border-amber-500 text-amber-900 dark:bg-amber-900/20 dark:text-amber-100",
  error: "bg-red-50 border-red-500 text-red-900 dark:bg-red-900/20 dark:text-red-100",
};

const iconMap: Record<AlertVariant, React.ElementType> = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error: XCircle,
};

const iconColorMap: Record<AlertVariant, string> = {
  info: "text-blue-500",
  success: "text-green-500",
  warning: "text-red-500",
  error: "text-red-500",
};

export const Alert: React.FC<AlertProps> = ({
  title,
  description,
  variant = 'info',
  onClose,
  className,
}) => {
  const Icon = iconMap[variant];
  const iconColor = iconColorMap[variant];

  return (
    <div className={cn(
      "relative p-4 border-l-4 rounded-r-lg flex gap-3 shadow-sm",
      variantStyles[variant],
      className
    )}>
      <Icon size={20} className={cn("shrink-0", iconColor)} />
      <div className="flex-1">
        <h4 className="text-sm font-bold leading-none">{title}</h4>
        {description && <p className="text-sm mt-1.5 opacity-90 leading-relaxed">{description}</p>}
      </div>
      {onClose && (
        <button 
          onClick={onClose}
          className="shrink-0 h-5 w-5 rounded hover:bg-black/5 flex items-center justify-center transition-colors"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
};