import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Alert, ProgressBar, Skeleton, Tag, Badge, Avatar } from './index';
import { Stack, Grid, Box, Container } from '../../components/layout';
import { Hash, Server, ShieldCheck, User, CheckCircle, X } from 'lucide-react';

const meta: Meta = {
  title: '⚛️ Atoms/Feedback/Visualization',
};

export default meta;

export const Showcase: StoryObj = {
  render: () => (
    <Container className="py-12">
      <Stack gap={12}>
        <div className="space-y-2">
          <h2 className="text-3xl font-black tracking-tight leading-none">Visualization Atoms</h2>
          <p className="text-[var(--lpd-color-text-muted)] font-medium">Core atoms for status feedback, progress, and metadata.</p>
        </div>

        {/* Alerts Section */}
        <section className="space-y-6">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] opacity-40 border-b pb-2">Alert Messages</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Stack gap={4}>
              <Alert 
                variant="info" 
                title="System Update" 
                description="A new version of the loop.dev CLI is available. Please update to continue." 
              />
              <Alert 
                variant="success" 
                title="Success" 
                description="Your deployment has been successfully completed." 
              />
              <Alert 
                variant="error" 
                title="Critical Error" 
                description="Failed to connect to the database. Check your connection string." 
              />
            </Stack>
            
            <div className="bg-slate-100 dark:bg-slate-900/50 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 p-8 flex flex-col items-center justify-end gap-4 relative min-h-[300px]">
              <span className="absolute top-4 left-4 text-[10px] font-mono text-slate-400 uppercase">Toast Area Preview</span>
              
              {/* Manual Toast Simulation based on Designer Mockup */}
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl rounded-lg p-4 flex items-start gap-3 w-full max-w-[320px] transition-transform">
                <CheckCircle size={18} className="text-green-500 mt-0.5 shrink-0" />
                <div className="flex-1">
                  <h5 className="text-sm font-bold text-[#0d121b] dark:text-white">Changes Saved</h5>
                  <p className="text-xs text-slate-500 mt-1 font-medium">Your profile has been updated.</p>
                </div>
                <button className="text-slate-400 hover:text-slate-600 shrink-0">
                  <X size={16} />
                </button>
              </div>

              {/* Status Pill simulation */}
              <div className="bg-[#0d121b] text-white border border-slate-800 shadow-lg rounded-lg px-4 py-3 flex items-center gap-3 w-full max-w-[320px]">
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin shrink-0" />
                <span className="text-sm font-medium">Syncing data...</span>
              </div>
            </div>
          </div>
        </section>

        {/* Progress & Status */}
        <Grid responsive="form" gap={8}>
          <section className="space-y-6">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] opacity-40 border-b pb-2">Progress Bars</h3>
            <Stack gap={6}>
              <ProgressBar label="Resource Usage" value={65} showValue />
              <ProgressBar label="Brand Consistency" value={92} size="sm" showValue />
              <ProgressBar label="AI Training" value={40} size="lg" className="text-indigo-600" />
            </Stack>
          </section>

          <section className="space-y-6">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] opacity-40 border-b pb-2">Technical Tags</h3>
            <div className="flex flex-wrap gap-3">
              <Tag icon={<Hash size={10} />}>v2.4.0</Tag>
              <Tag icon={<Server size={10} />}>eu-west-1</Tag>
              <Tag icon={<ShieldCheck size={10} />}>verified</Tag>
              <Tag>Production</Tag>
            </div>
          </section>
        </Grid>

        {/* Loading States */}
        <section className="space-y-6">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] opacity-40 border-b pb-2">Loading Skeletons</h3>
          <Box padding={8} background="subtle" radius="3xl" border>
            <Stack gap={6}>
              <div className="flex items-center gap-4">
                <Skeleton variant="circle" className="w-12 h-12" />
                <Stack gap={2} className="flex-1">
                  <Skeleton variant="text" className="w-1/4 h-4" />
                  <Skeleton variant="text" className="w-1/2" />
                </Stack>
              </div>
              <Skeleton variant="rect" className="h-32 w-full" />
            </Stack>
          </Box>
        </section>
      </Stack>
    </Container>
  )
};
