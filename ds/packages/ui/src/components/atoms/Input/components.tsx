import React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Icon } from '../Icon';

interface IconWrapperProps {
  children: React.ReactNode;
  position: 'start' | 'end';
}

export const IconWrapper: React.FC<IconWrapperProps> = ({ children, position }) => (
  <div className={`flex items-center justify-center text-slate-400 dark:text-slate-500 shrink-0 ${
    position === 'start' ? 'ml-3' : 'mr-3'
  }`}>
    {children}
  </div>
);

export const LoadingSpinner = () => (
  <div 
    role="status"
    aria-label="Cargando"
    className="mr-3 flex items-center gap-0.5 text-[var(--lpd-color-brand-primary)] font-mono text-xs"
  >
    <span className="opacity-40">{'{'}</span>
    <div className="animate-spin flex items-center justify-center">
      <Icon name="progress_activity" size="sm" />
    </div>
    <span className="opacity-40">{'}'}</span>
  </div>
);

export const PasswordToggle: React.FC<{ show: boolean; onToggle: () => void }> = ({ show, onToggle }) => (
  <button
    type="button"
    onClick={onToggle}
    className="mr-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors outline-none focus:text-blue-500"
    tabIndex={-1}
  >
    {show ? <EyeOff size={18} /> : <Eye size={18} />}
  </button>
);
