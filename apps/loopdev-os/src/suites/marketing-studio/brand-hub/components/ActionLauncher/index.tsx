'use client';

import React from 'react';
import { LpdText, Skeleton } from '@loopdev/ui';
import { ActionCard } from '../ActionCard';
import { ActionLauncherProps } from './types';

/**
 * @component ActionLauncher
 * @description Smart container for contextual CTAs.
 */
export const ActionLauncher: React.FC<ActionLauncherProps> = ({
  brandStatus,
  mode,
  onAction,
  isLoading
}) => {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        {[1, 2, 3].map(i => <Skeleton key={i} className="h-20 w-full rounded-xl" />)}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <LpdText size="nano" weight="bold" className="text-text-muted uppercase tracking-widest opacity-60">
        Recommended Actions
      </LpdText>

      <div className="flex flex-col gap-3">
        {brandStatus === 'published' && (
          <>
            <ActionCard
              title="Create Draft"
              description="Start a new version to make changes"
              icon="edit_note"
              intent="primary"
              onClick={() => onAction?.('create_draft')}
            />
            <ActionCard
              title="View Impact"
              description="Analyze system dependencies"
              icon="hub"
              intent="secondary"
              onClick={() => onAction?.('dependencies')}
            />
          </>
        )}

        {brandStatus === 'draft' && (
          <>
            <ActionCard
              title="Continue Draft"
              description="Resume your active working session"
              icon="play_arrow"
              intent="primary"
              onClick={() => onAction?.('continue_draft')}
            />
            <ActionCard
              title="Publish Preflight"
              description="Run governance and policy checks"
              icon="publish"
              intent="secondary"
              onClick={() => onAction?.('preflight')}
            />
          </>
        )}

        <ActionCard
          title="Compare Versions"
          description="Review changes against baseline"
          icon="compare_arrows"
          intent="neutral"
          onClick={() => onAction?.('compare')}
        />
      </div>
    </div>
  );
};
