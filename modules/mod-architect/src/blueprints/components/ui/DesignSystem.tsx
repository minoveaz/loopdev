import React from 'react';
import { ArrowRight, Check, AlertCircle } from 'lucide-react';

// --- Types ---
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'energy';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  loading?: boolean;
}

// --- Components ---

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon, 
  className = '', 
  loading,
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center font-bold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-primary hover:bg-primary-dark text-white shadow-lg shadow-primary/20 focus:ring-primary",
    secondary: "bg-surface-light dark:bg-surface-dark text-text-main dark:text-white border border-gray-200 dark:border-gray-700 hover:border-primary dark:hover:border-primary",
    outline: "border-2 border-primary text-primary hover:bg-primary/5",
    ghost: "text-text-muted hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800",
    energy: "bg-energy hover:bg-yellow-400 text-black shadow-lg shadow-energy/20",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-8 py-3 text-base",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading && <span className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />}
      {icon && !loading && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

export const Badge: React.FC<{ children: React.ReactNode; variant?: 'primary' | 'energy' | 'neutral' }> = ({ 
  children, 
  variant = 'primary' 
}) => {
  const styles = {
    primary: "bg-primary/10 text-primary border-primary/20",
    energy: "bg-energy/10 text-energy-vivid border-energy/20",
    neutral: "bg-gray-100 dark:bg-gray-800 text-text-muted border-gray-200 dark:border-gray-700",
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border ${styles[variant]}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${variant === 'energy' ? 'bg-energy animate-pulse' : 'bg-current'}`} />
      {children}
    </span>
  );
};

export const Card: React.FC<{ children: React.ReactNode; className?: string; hoverEffect?: boolean }> = ({ 
  children, 
  className = '',
  hoverEffect = false
}) => {
  return (
    <div className={`
      bg-white dark:bg-surface-dark 
      border border-gray-200 dark:border-gray-800 
      rounded-xl p-6 relative overflow-hidden
      ${hoverEffect ? 'hover:border-primary/50 hover:shadow-lg transition-all duration-300 group' : ''}
      ${className}
    `}>
      {children}
    </div>
  );
};

export const SectionHeader: React.FC<{ title: string; subtitle?: string; context?: string }> = ({ title, subtitle, context }) => (
  <div className="mb-10">
    {context && (
      <div className="flex items-center gap-2 mb-4">
        <Badge variant="energy">{context}</Badge>
      </div>
    )}
    <h1 className="text-4xl md:text-5xl font-black tracking-tight text-text-main dark:text-white mb-4">
      {title}
    </h1>
    {subtitle && (
      <p className="text-lg text-text-muted dark:text-gray-400 max-w-3xl leading-relaxed">
        {subtitle}
      </p>
    )}
  </div>
);

export const CodeBlock: React.FC<{ code: string; language?: string }> = ({ code, language = 'typescript' }) => (
  <div className="bg-gray-900 rounded-lg p-4 font-mono text-xs md:text-sm text-gray-300 border border-gray-800 overflow-x-auto">
    <pre><code>{code}</code></pre>
  </div>
);

export const GridPattern: React.FC = () => (
  <div className="absolute inset-0 bg-grid-pattern dark:bg-grid-pattern-dark bg-[size:40px_40px] pointer-events-none opacity-20" />
);