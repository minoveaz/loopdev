import React from 'react';

export type AIFeedbackStatus = 'processing' | 'success' | 'error' | 'paused';
export type AIFeedbackStepStatus = 'pending' | 'active' | 'complete' | 'error';

export interface AIFeedbackStep {
  id: string;
  label: string;
  description?: React.ReactNode;
  typingMessage?: string;
  status?: AIFeedbackStepStatus;
  durationMs?: number;
}

export interface AIFeedbackSurfaceProps {
  title: string;
  description: React.ReactNode;
  status: AIFeedbackStatus;
  statusLabel?: string;
  activeMessage?: React.ReactNode;
  steps?: AIFeedbackStep[];
  progress?: number;
  autoAdvance?: boolean;
  stepDurationMs?: number;
  tickMs?: number;
  onProgressChange?: (progress: number) => void;
  onStepChange?: (step: AIFeedbackStep, index: number) => void;
  onComplete?: () => void;
  completionHoldMs?: number;
  icon?: string;
  action?: React.ReactNode;
  className?: string;
  'aria-label'?: string;
}
