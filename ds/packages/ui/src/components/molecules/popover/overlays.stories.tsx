import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/molecules/tooltip';
import { Popover, PopoverTrigger, PopoverContent } from './popover';
import { Button } from '@/components/atoms/button';
import { Stack, Inline, Box } from '@/components/layout/foundations';
import { Info, Settings, Trash2, Share2, HelpCircle } from 'lucide-react';

const meta: Meta = {
  title: '🧩 Molecules/Floating/Overlays',
  decorators: [
    (Story) => (
      <TooltipProvider>
        <div className="p-20 flex items-center justify-center min-h-[300px]">
          <Story />
        </div>
      </TooltipProvider>
    ),
  ],
};

export default meta;

export const TooltipShowcase: StoryObj = {
  render: () => (
    <Stack gap={8} align="center">
      <div className="text-center space-y-2">
        <h3 className="font-bold">Tooltips</h3>
        <p className="text-xs text-[var(--lpd-color-text-muted)]">Hover the icons to see labels.</p>
      </div>
      <Inline gap={4}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon">
              <Settings size={18} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Settings</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="destructive" size="icon">
              <Trash2 size={18} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Delete Item</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="primary" size="icon">
              <Share2 size={18} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Share Access</TooltipContent>
        </Tooltip>
      </Inline>
    </Stack>
  ),
};

export const PopoverShowcase: StoryObj = {
  render: () => (
    <Stack gap={8} align="center">
      <div className="text-center space-y-2">
        <h3 className="font-bold">Popovers</h3>
        <p className="text-xs text-[var(--lpd-color-text-muted)]">Click the button to open the menu.</p>
      </div>
      
      <Popover>
        <PopoverTrigger asChild>
          <Button leftIcon={<HelpCircle size={16} />}>Open Help Menu</Button>
        </PopoverTrigger>
        <PopoverContent className="p-4">
          <Stack gap={4}>
            <h4 className="font-bold text-sm">Quick Resources</h4>
            <Stack gap={1}>
              {[
                { label: 'Documentation', icon: Info },
                { label: 'Video Tutorials', icon: Settings },
                { label: 'Community Forum', icon: MessageSquare },
              ].map((item) => (
                <button 
                  key={item.label}
                  className="flex items-center gap-2 p-2 hover:bg-[var(--lpd-color-bg-subtle)] rounded-lg text-xs transition-colors"
                >
                  <item.icon size={14} className="text-[var(--lpd-color-brand-primary)]" />
                  {item.label}
                </button>
              ))}
            </Stack>
            <Box padding={3} background="subtle" radius="lg" className="mt-2">
              <p className="text-[10px] opacity-60">Need more help? Contact our support team 24/7.</p>
            </Box>
          </Stack>
        </PopoverContent>
      </Popover>
    </Stack>
  ),
};

// Mock icon for the showcase
const MessageSquare = ({ size, className }: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
);
