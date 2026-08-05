'use client';

import React, { useState, useEffect } from 'react';
import { LpdText } from '../../foundations/Typography';
import { cn } from '../../../../helpers/cn';

interface NextEvalTimerProps {
  lastUpdatedAt?: string;
  intervalSeconds?: number;
  className?: string;
}

/**
 * @component NextEvalTimer
 * @description Real-time countdown until the next strategy evaluation cycle.
 * Professional trading UI element to manage user expectations.
 */
export const NextEvalTimer: React.FC<NextEvalTimerProps> = ({ 
  lastUpdatedAt, 
  intervalSeconds = 30,
  className 
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(intervalSeconds);

  useEffect(() => {
    if (!lastUpdatedAt) return;

    const calculateTimeLeft = () => {
      const lastUpdate = new Date(lastUpdatedAt).getTime();
      const now = Date.now();
      const diff = Math.floor((now - lastUpdate) / 1000);
      const remaining = Math.max(0, intervalSeconds - (diff % intervalSeconds));
      return remaining;
    };

    // Initial sync
    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      const remaining = calculateTimeLeft();
      setTimeLeft(remaining);
    }, 1000);

    return () => clearInterval(timer);
  }, [lastUpdatedAt, intervalSeconds]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isNearEval = timeLeft <= 5;

  return (
    <div className={cn("flex items-center gap-2 px-2 py-1 rounded bg-background-stronger/30 border border-border-technical/10 w-fit", className)}>
      <LpdText size="nano" weight="black" className="text-text-muted opacity-40 uppercase font-mono tracking-widest">
        Next_Eval:
      </LpdText>
      <LpdText 
        size="xs" 
        weight="black" 
        className={cn(
          "font-mono tabular-nums tracking-tighter",
          isNearEval ? "text-amber-500 animate-pulse" : "text-primary opacity-80"
        )}
      >
        {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
      </LpdText>
    </div>
  );
};
