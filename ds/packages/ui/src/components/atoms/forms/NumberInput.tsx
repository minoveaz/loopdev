import React, { useRef } from 'react';
import { cn } from '../../../helpers/cn';
import { ChevronUp, ChevronDown } from 'lucide-react';

export interface NumberInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  onIncrement?: () => void;
  onDecrement?: () => void;
}

export const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  ({ className, error, onIncrement, onDecrement, ...props }, ref) => {
    const internalRef = useRef<HTMLInputElement>(null);
    const inputRef = (ref as React.MutableRefObject<HTMLInputElement>) || internalRef;

    const handleIncrement = () => {
      if (inputRef.current) {
        inputRef.current.stepUp();
        // Trigger onChange manually if needed
        const event = new Event('change', { bubbles: true });
        inputRef.current.dispatchEvent(event);
      }
      onIncrement?.();
    };

    const handleDecrement = () => {
      if (inputRef.current) {
        inputRef.current.stepDown();
        const event = new Event('change', { bubbles: true });
        inputRef.current.dispatchEvent(event);
      }
      onDecrement?.();
    };

    return (
      <div className="relative w-full group font-sans">
        <input
          ref={inputRef}
          type="number"
          className={cn(
            "w-full border rounded-lg outline-none transition-all duration-200",
            "pl-4 pr-10 py-2.5", // Extra right padding for buttons
            "text-sm bg-white dark:bg-slate-900 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
            error 
              ? "border-[var(--lpd-color-error)] text-[var(--lpd-color-error)] focus:ring-4 focus:ring-[var(--lpd-color-error)]/10" 
              : "border-slate-300 dark:border-slate-600 text-[#0d121b] dark:text-white focus:border-[var(--lpd-color-brand-primary)] focus:ring-4 focus:ring-[var(--lpd-color-brand-primary)]/10",
            className
          )}
          {...props}
        />
        
        {/* Step Buttons (Designer Style) */}
        <div className="absolute right-1 top-1/2 -translate-y-1/2 flex flex-col h-[calc(100%-8px)]">
          <button
            type="button"
            onClick={handleIncrement}
            className="flex-1 px-1.5 flex items-center justify-center text-slate-400 hover:text-[var(--lpd-color-brand-primary)] hover:bg-slate-50 dark:hover:bg-slate-800 rounded-t-md transition-colors"
          >
            <ChevronUp size={14} strokeWidth={3} />
          </button>
          <button
            type="button"
            onClick={handleDecrement}
            className="flex-1 px-1.5 flex items-center justify-center text-slate-400 hover:text-[var(--lpd-color-brand-primary)] hover:bg-slate-50 dark:hover:bg-slate-800 rounded-b-md transition-colors border-t border-slate-100 dark:border-slate-700"
          >
            <ChevronDown size={14} strokeWidth={3} />
          </button>
        </div>
      </div>
    );
  }
);

NumberInput.displayName = "NumberInput";
