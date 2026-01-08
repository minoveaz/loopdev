'use client';

import React from 'react';
import { LpdText, Icon } from '../../../../atoms';
import { ActivityFeedProps } from './types';

export const ActivityFeed: React.FC<ActivityFeedProps> = (props) => {
  return (
    <div className="industrial-ingest-container">
              <div className="flex items-center justify-between mb-6">
          <h2 className="text-text-main dark:text-white text-2xl font-bold tracking-[-0.015em]">Activity Feeds</h2>
          <p className="text-sm text-text-muted">Chronological System Events</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-surface-dark rounded-2xl border border-border-technical dark:border-slate-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-text-main dark:text-white">Project History</h3>
              <button className="text-xs text-primary font-bold hover:underline">View All</button>
            </div>
            <div className="relative">
              <div className="absolute left-4 top-2 bottom-2 w-px bg-slate-200 dark:bg-slate-700"></div>
              <div className="relative pl-12 pb-8 group">
                <div className="absolute left-0 p-1 bg-white dark:bg-surface-dark z-10">
                  <div className="w-8 h-8 rounded-full bg-primary/5 dark:bg-blue-900/20 text-primary flex items-center justify-center border border-blue-100 dark:border-blue-900/30 group-hover:scale-110 transition-transform">
                    <Icon name="cloud_upload" size="sm" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="flex justify-between items-start">
                    <span className="text-sm font-medium text-text-main dark:text-white">New assets uploaded</span>
                    <span className="text-xs text-text-muted opacity-60">10m ago</span>
                  </div>
                  <p className="text-xs text-text-muted mt-1">John Doe added 4 new files to <span className="text-slate-700 dark:text-slate-300 font-medium">Marketing Assets</span>.</p>
                  <div className="flex gap-2 mt-2">
                    <div className="w-8 h-8 rounded bg-background-subtle dark:bg-slate-800 border border-border-technical dark:border-slate-600 flex items-center justify-center">
                      <Icon name="image" size="sm" />
                    </div>
                    <div className="w-8 h-8 rounded bg-background-subtle dark:bg-slate-800 border border-border-technical dark:border-slate-600 flex items-center justify-center">
                      <Icon name="image" size="sm" />
                    </div>
                    <div className="w-8 h-8 rounded bg-background-subtle dark:bg-slate-800 border border-border-technical dark:border-slate-600 flex items-center justify-center text-[10px] text-text-muted font-bold">
                      +2
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative pl-12 pb-8 group">
                <div className="absolute left-0 p-1 bg-white dark:bg-surface-dark z-10">
                  <div className="w-8 h-8 rounded-full bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-500 flex items-center justify-center border border-yellow-100 dark:border-yellow-900/30 group-hover:scale-110 transition-transform">
                    <Icon name="bolt" size="sm" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="flex justify-between items-start">
                    <span className="text-sm font-medium text-text-main dark:text-white">System Alert</span>
                    <span className="text-xs text-text-muted opacity-60">2h ago</span>
                  </div>
                  <p className="text-xs text-text-muted mt-1">Automated build process completed with warnings in <span className="font-mono text-[10px] bg-background-subtle dark:bg-slate-800 px-1 rounded">module-core</span>.</p>
                </div>
              </div>
              <div className="relative pl-12 group">
                <div className="absolute left-0 p-1 bg-white dark:bg-surface-dark z-10">
                  <div className="w-8 h-8 rounded-full bg-background-subtle dark:bg-slate-800 text-text-muted flex items-center justify-center border border-border-technical dark:border-slate-600 group-hover:scale-110 transition-transform">
                    <Icon name="edit_document" size="sm" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="flex justify-between items-start">
                    <span className="text-sm font-medium text-text-main dark:text-white">Specification Updated</span>
                    <span className="text-xs text-text-muted opacity-60">Yesterday</span>
                  </div>
                  <p className="text-xs text-text-muted mt-1">Sarah Miller edited the description for <span className="text-primary hover:underline cursor-pointer">Project Alpha</span>.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-center">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-background-subtle dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-700">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3">
                  <Icon name="history" size="sm" />
                </div>
                <h4 className="font-bold text-text-main dark:text-white text-sm">Chronological</h4>
                <p className="text-xs text-text-muted mt-1">Linear progression of time, with most recent events at the top.</p>
              </div>
              <div className="p-4 bg-background-subtle dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-700">
                <div className="w-10 h-10 rounded-full bg-energy/10 text-yellow-600 dark:text-yellow-500 flex items-center justify-center mb-3">
                  <Icon name="filter_alt" size="sm" />
                </div>
                <h4 className="font-bold text-text-main dark:text-white text-sm">Filterable</h4>
                <p className="text-xs text-text-muted mt-1">Events can be filtered by type, user, or date range.</p>
              </div>
              <div className="col-span-2 p-4 bg-background-subtle dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-3 mb-2">
                  <Icon name="palette" size="sm" />
                  <h4 className="font-bold text-text-main dark:text-white text-sm">Color Semantics</h4>
                </div>
                <div className="space-y-2 mt-3">
                  <div className="flex items-center text-xs">
                    <div className="w-2 h-2 rounded-full bg-primary mr-2"></div>
                    <span className="text-slate-600 dark:text-slate-300"><strong>Primary Blue:</strong> Creation, Uploads, Key Interactions</span>
                  </div>
                  <div className="flex items-center text-xs">
                    <div className="w-2 h-2 rounded-full bg-energy mr-2"></div>
                    <span className="text-slate-600 dark:text-slate-300"><strong>Energy Yellow:</strong> System Alerts, Highlights, Warnings</span>
                  </div>
                  <div className="flex items-center text-xs">
                    <div className="w-2 h-2 rounded-full bg-slate-400 mr-2"></div>
                    <span className="text-slate-600 dark:text-slate-300"><strong>Neutrals:</strong> Edits, Archives, General Logging</span>
    </div>
  );
};
