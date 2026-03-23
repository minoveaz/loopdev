'use client';

import React, { useState } from 'react';
import { Icon } from '../../surfaces/Icon';
import { LpdText } from '../../foundations/Typography';
import { cn } from '../../../../helpers/cn';
import { TrailingControl } from '../../surfaces/TrailingControl';

interface PositionQuickActionsProps {
  onMarketExit?: () => Promise<void>;
  onSetToBE?: () => Promise<void>;
  onExecuteTP?: () => Promise<void>;
  onUpdateTrail?: (distance: number) => Promise<void>;
  canMoveToBE?: boolean;
  trailingDistance?: number;
}

export const PositionQuickActions: React.FC<PositionQuickActionsProps> = ({ 
  onMarketExit, 
  onSetToBE, 
  onExecuteTP, 
  onUpdateTrail,
  canMoveToBE = true,
  trailingDistance = 0
}) => {
  
  interface QuickActionProps {
    label: string;
    icon: string;
    onClick?: () => Promise<void>;
    variant?: 'danger' | 'warning' | 'success';
    disabled?: boolean;
  }

  const ActionButton = ({ label, icon, onClick, variant, disabled }: QuickActionProps) => {
    const [loading, setLoading] = useState(false);

    const handleAction = async (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!onClick || disabled) return;
      setLoading(true);
      try {
        await onClick();
      } finally {
        setLoading(false);
      }
    };

    return (
      <button 
        onClick={handleAction}
        disabled={loading || disabled}
        className={cn(
          "flex-1 flex flex-col items-center gap-1.5 p-2.5 rounded-xl border transition-all active:scale-95 disabled:opacity-20 disabled:grayscale disabled:cursor-not-allowed",
          variant === 'danger' && "bg-rose-500/10 border-rose-500/20 text-rose-500 hover:bg-rose-500/20",
          variant === 'warning' && "bg-amber-500/10 border-amber-500/20 text-amber-500 hover:bg-amber-500/20",
          variant === 'success' && "bg-emerald-500/10 border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/20"
        )}
      >
        <div className={cn("relative", loading && "animate-spin")}>
          <Icon name={loading ? "sync" : icon} size="xs" />
        </div>
        <LpdText size="nano" weight="black" className="uppercase tracking-widest text-[7px]">
          {label}
        </LpdText>
      </button>
    );
  };

  return (
    <div className="flex gap-2 w-full">
      <ActionButton 
        label="Market Exit" 
        icon="bolt" 
        variant="danger" 
        onClick={onMarketExit} 
      />
      <ActionButton 
        label="Move to BE" 
        icon="shield" 
        variant="warning" 
        disabled={!canMoveToBE}
        onClick={onSetToBE} 
      />
      
      {/* 4º BOTÓN TÁCTICO: TRAILING CONTROL */}
      <TrailingControl 
        currentDistance={trailingDistance}
        onUpdateDistance={onUpdateTrail || (async () => {})}
      />

      <ActionButton 
        label="TP Now" 
        icon="target" 
        variant="success" 
        onClick={onExecuteTP} 
      />
    </div>
  );
};
