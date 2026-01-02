import { Box, Stack, Inline, Button, StatusBadge } from '@loopdev/ui';
import { FolderZip } from 'lucide-react';

interface ModuleHeaderProps {
  status?: string;
  title: string;
  description: string;
  actionText?: string;
  actionIcon?: React.ReactNode;
}

/**
 * @component ModuleHeader
 * @description Extreme fidelity migration of the Designer's Overview Header.
 * Replicates font weights, tracking, and layout spacing exactly as mock-loopdev.
 */
export const ModuleHeader = ({ 
  status = "SYSTEM UPDATED: 2025.12.29", 
  title, 
  description,
  actionText = "Assets",
  actionIcon = <FolderZip size={18} />
}: ModuleHeaderProps) => {
  return (
    <Box 
      as="header" 
      paddingY={10} 
      className="border-b border-[var(--lpd-color-border-subtle)]/60 mb-12"
    >
      <div className="flex flex-col gap-6 md:flex-row md:items-end justify-between max-w-6xl mx-auto px-8">
        
        {/* LEFT: Page Identity */}
        <Stack gap={4} className="max-w-2xl">
          <StatusBadge>{status}</StatusBadge>
          
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-[1.1] text-slate-900">
            {title}
          </h1>
          
          <p className="text-slate-500 text-lg leading-relaxed max-w-xl font-medium">
            {description}
          </p>
        </Stack>

        {/* RIGHT: Primary Action */}
        <Box className="pb-2">
          <Button 
            variant="primary" 
            size="default"
            leftIcon={actionIcon}
            className="px-6 h-11 rounded-xl shadow-xl shadow-indigo-500/20 active:scale-95 transition-all"
          >
            {actionText}
          </Button>
        </Box>

      </div>
    </Box>
  );
};
