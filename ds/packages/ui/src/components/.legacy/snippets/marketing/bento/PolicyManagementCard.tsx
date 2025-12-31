import React from 'react';
import { BentoItem } from '../../../../components/organisms/BentoGrid';
import { Box, Stack } from '../../../../components/layout';

export interface PolicyManagementCardProps {
  title?: string;
  description?: string;
  variant?: 'default' | 'primary' | 'image';
  colSpan?: 1 | 2 | 3;
  rowSpan?: 1 | 2;
  className?: string;
}

export const PolicyManagementCard: React.FC<PolicyManagementCardProps> = ({
  title = "Gestión Integral de Activos",
  description = "Centraliza todos tus recursos en una sola plataforma intuitiva. Accede a documentos y estados en tiempo real.",
  variant = "primary",
  colSpan = 2,
  rowSpan = 2,
  className = ""
}) => (
  <BentoItem 
    colSpan={colSpan} 
    rowSpan={rowSpan}
    title={title}
    description={description}
    variant={variant}
    className={className}
    visual={
      <div className="absolute right-0 bottom-0 w-3/4 h-3/4 bg-white/10 rounded-tl-[40px] border-t border-l border-white/20 p-6 transition-transform group-hover:scale-105 duration-700 backdrop-blur-sm">
        <Stack gap={3}>
          <div className="h-3 bg-white/20 rounded-full w-1/2" />
          <div className="h-3 bg-white/20 rounded-full w-3/4" />
          <div className="h-20 bg-white/10 w-full mt-4 rounded-xl border border-white/10" />
        </Stack>
      </div>
    }
  />
);
