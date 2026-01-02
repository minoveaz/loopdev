import { TechnicalBackground } from '@loopdev/ui';

interface ArchitectShellProps {
  children: React.ReactNode;
  isLoading?: boolean;
}

/**
 * @component ArchitectShell
 * @description Provides the technical visual foundation (grid, background, loading state) 
 * for all views within the Architect module.
 */
export const ArchitectShell = ({ children, isLoading }: ArchitectShellProps) => {
  return (
    <div className="flex flex-col min-h-full bg-[#f8f9fc] relative">
      {/* Visual Foundation - Fixed so it doesn't scroll away */}
      <div className="fixed inset-0 z-0">
        <TechnicalBackground />
      </div>

      {/* Progress Bar (Global for the module) */}
      {isLoading && (
        <div className="absolute top-0 left-0 right-0 z-50 h-1 bg-indigo-600 animate-pulse w-full" />
      )}

      {/* Content Layer */}
      <div className="flex-1 flex flex-col relative z-10 overflow-hidden">
        {children}
      </div>
    </div>
  );
};
