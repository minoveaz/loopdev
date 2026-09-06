'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  AILoader,
  Icon,
  LpdText,
  TechnicalCanvas,
  TechnicalStatusBadge,
  TechnicalSurface,
} from '../../../atoms';
import { cn } from '../../../../helpers/cn';
import type { AIFeedbackSurfaceProps, AIFeedbackStep } from './types';

const STATUS_SEVERITY = {
  processing: 'innovation',
  success: 'success',
  error: 'danger',
  paused: 'warning',
} as const;

/**
 * Full-canvas AI feedback surface. Consumers own copy, stages and actions;
 * the composite owns the shared neural visual language and state semantics.
 */
export function AIFeedbackSurface({
  title,
  description,
  status,
  statusLabel,
  activeMessage,
  steps = [],
  progress,
  autoAdvance = false,
  stepDurationMs = 1800,
  tickMs = 100,
  onProgressChange,
  onStepChange,
  onComplete,
  completionHoldMs = 600,
  icon = 'auto_awesome',
  action,
  className,
  'aria-label': ariaLabel,
}: AIFeedbackSurfaceProps) {
  const [elapsedMs, setElapsedMs] = useState(0);
  const completionNotified = useRef(false);
  const totalDuration = useMemo(
    () => steps.reduce((total, step) => total + (step.durationMs ?? stepDurationMs), 0),
    [steps, stepDurationMs],
  );
  const hasProgress = typeof progress === 'number' || autoAdvance;
  const calculatedProgress =
    autoAdvance && totalDuration > 0 ? (elapsedMs / totalDuration) * 100 : progress;
  const boundedProgress = hasProgress
    ? Math.min(100, Math.max(0, calculatedProgress ?? 0))
    : undefined;
  const activeStepIndex = useMemo(() => {
    if (!steps.length) return -1;
    if (!autoAdvance) return steps.findIndex((step) => step.status === 'active');

    let accumulated = 0;
    const index = steps.findIndex((step) => {
      accumulated += step.durationMs ?? stepDurationMs;
      return elapsedMs < accumulated;
    });
    return index === -1 ? steps.length - 1 : index;
  }, [autoAdvance, elapsedMs, stepDurationMs, steps]);
  const activeStep = activeStepIndex >= 0 ? steps[activeStepIndex] : undefined;
  const renderedSteps = autoAdvance
    ? steps.map((step, index) => ({
        ...step,
        status:
          index < activeStepIndex
            ? ('complete' as const)
            : index === activeStepIndex && boundedProgress !== 100
              ? ('active' as const)
              : index === activeStepIndex
                ? ('complete' as const)
                : ('pending' as const),
      }))
    : steps.map((step) => ({ ...step, status: step.status ?? 'pending' }));

  useEffect(() => {
    if (!autoAdvance || totalDuration <= 0 || elapsedMs >= totalDuration) return undefined;
    const timer = window.setInterval(() => {
      setElapsedMs((current) => Math.min(totalDuration, current + tickMs));
    }, tickMs);
    return () => window.clearInterval(timer);
  }, [autoAdvance, elapsedMs, tickMs, totalDuration]);

  useEffect(() => {
    if (typeof boundedProgress === 'number') onProgressChange?.(boundedProgress);
  }, [boundedProgress, onProgressChange]);

  useEffect(() => {
    if (activeStep && activeStepIndex >= 0) onStepChange?.(activeStep, activeStepIndex);
  }, [activeStep, activeStepIndex, onStepChange]);

  useEffect(() => {
    if (!autoAdvance || totalDuration <= 0 || elapsedMs < totalDuration) {
      completionNotified.current = false;
      return undefined;
    }

    if (completionNotified.current || !onComplete) return undefined;
    const timer = window.setTimeout(
      () => {
        completionNotified.current = true;
        onComplete();
      },
      Math.max(0, completionHoldMs),
    );

    return () => window.clearTimeout(timer);
  }, [autoAdvance, completionHoldMs, elapsedMs, onComplete, totalDuration]);

  return (
    <TechnicalSurface
      variant="surface"
      className={cn(
        'ai-feedback-surface relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl',
        className,
      )}
      role="region"
      aria-live="polite"
      aria-label={ariaLabel}
    >
      <TechnicalCanvas variant="neural" intensity="low" size={24} />
      <div className="relative z-10 flex min-h-0 flex-1 flex-col">
        <div className="ai-feedback-surface-header flex items-center justify-between gap-4 border-b px-5 py-4">
          <div className="min-w-0">
            <LpdText
              size="xs"
              className="text-innovation-purple font-mono uppercase tracking-[0.16em]"
            >
              {statusLabel}
            </LpdText>
            <LpdText as="h2" size="lg" className="text-text-main mt-1 font-semibold">
              {title}
            </LpdText>
          </div>
          {statusLabel && (
            <TechnicalStatusBadge
              label={statusLabel}
              severity={STATUS_SEVERITY[status]}
              withPulse={status === 'processing'}
            />
          )}
        </div>

        <div className="relative z-10 flex min-h-0 flex-1 flex-col gap-5 p-5">
          <div className="ai-feedback-surface-plane flex min-h-0 flex-1 flex-col justify-center rounded-lg border border-dashed px-6 py-8">
            <div className="mx-auto w-full max-w-4xl">
              <div className="flex items-start gap-4">
                <div className="bg-innovation-purple/10 text-innovation-purple ring-innovation-purple/5 flex size-14 shrink-0 items-center justify-center rounded-2xl ring-8">
                  <Icon name={icon} size="lg" />
                </div>
                <div className="min-w-0 flex-1">
                  <LpdText as="h3" size="lg" className="text-text-main font-semibold">
                    {activeStep?.label || activeMessage || title}
                  </LpdText>
                  <LpdText as="p" size="sm" className="text-text-muted mt-1">
                    {activeStep?.description || description}
                  </LpdText>
                  {activeStep && (
                    <div className="mt-4">
                      <AILoader
                        key={activeStep.id}
                        messages={[
                          activeStep.typingMessage ||
                            (typeof activeStep.description === 'string'
                              ? activeStep.description
                              : activeStep.label),
                        ]}
                        speed="fast"
                      />
                    </div>
                  )}
                </div>
                {action && <div className="shrink-0">{action}</div>}
              </div>

              {hasProgress && (
                <div className="mt-8">
                  <div className="flex items-center justify-between gap-3">
                    <LpdText
                      size="xs"
                      className="text-text-muted font-mono uppercase tracking-[0.12em]"
                    >
                      Progreso del proceso
                    </LpdText>
                    <LpdText size="sm" className="text-innovation-purple font-mono font-semibold">
                      {Math.round(boundedProgress ?? 0)}%
                    </LpdText>
                  </div>
                  <progress
                    className="ai-feedback-surface-progress mt-3 h-2 w-full overflow-hidden rounded-full"
                    role="progressbar"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={Math.round(boundedProgress ?? 0)}
                    aria-label="Progreso del proceso"
                    value={boundedProgress}
                    max={100}
                  />
                </div>
              )}

              {renderedSteps.length > 0 && (
                <div
                  className="ai-feedback-timeline mt-8"
                  role="list"
                  aria-label="Fases del procesamiento"
                >
                  {renderedSteps.map((step, index) => (
                    <React.Fragment key={step.id}>
                      <div
                        className={cn(
                          'ai-feedback-timeline-step',
                          step.status === 'active' && 'ai-feedback-timeline-step-active',
                          step.status === 'complete' && 'ai-feedback-timeline-step-complete',
                        )}
                        role="listitem"
                        aria-current={step.status === 'active' ? 'step' : undefined}
                      >
                        <span className="ai-feedback-timeline-node" aria-hidden="true">
                          {step.status === 'complete' ? '✓' : step.status === 'active' ? '✦' : '·'}
                        </span>
                        <span className="min-w-0">
                          <LpdText as="p" size="xs" className="text-text-main font-semibold">
                            {step.label}
                          </LpdText>
                          <LpdText size="nano" className="text-text-muted">
                            {step.status === 'complete'
                              ? 'Completado'
                              : step.status === 'active'
                                ? 'En ejecución'
                                : 'Pendiente'}
                          </LpdText>
                        </span>
                      </div>
                      {index < renderedSteps.length - 1 && (
                        <span
                          className={cn(
                            'ai-feedback-timeline-connector',
                            step.status === 'complete' && 'ai-feedback-timeline-connector-complete',
                          )}
                          aria-hidden="true"
                        />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </TechnicalSurface>
  );
}

export type { AIFeedbackSurfaceProps, AIFeedbackStep };
