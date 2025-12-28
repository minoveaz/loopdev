import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Drawer, DrawerTrigger, DrawerContent, DrawerFooter, DrawerClose } from './drawer';
import { Button } from '@/components/atoms/button';
import { Stack, Box, Grid, Inline } from '@/components/layout/foundations';
import { Settings, User, Bell, Shield, Info } from 'lucide-react';

const meta: Meta = {
  title: 'Overlays/Drawer',
  component: Drawer,
};

export default meta;

export const SideDrawer: StoryObj = {
  render: () => (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <Button variant="outline" leftIcon={<Settings size={16} />}>User Settings</Button>
      </DrawerTrigger>
      <DrawerContent 
        title="Settings" 
        description="Manage your account preferences and security."
      >
        <Stack gap={8}>
          <Stack gap={4}>
            <h4 className="text-xs font-black uppercase tracking-widest opacity-40">Profile Section</h4>
            <Grid cols={1} gap={2}>
              {[
                { icon: User, label: 'Personal Information' },
                { icon: Bell, label: 'Notifications' },
                { icon: Shield, label: 'Security & Privacy' },
              ].map((item) => (
                <button key={item.label} className="flex items-center gap-3 p-3 hover:bg-[var(--lpd-color-bg-subtle)] rounded-2xl transition-colors text-sm font-medium">
                  <item.icon size={18} className="text-[var(--lpd-color-brand-primary)]" />
                  {item.label}
                </button>
              ))}
            </Grid>
          </Stack>

          <Box padding={6} background="subtle" radius="2xl" border>
            <Stack gap={3}>
              <Inline gap={2} align="center">
                <Info size={16} className="text-[var(--lpd-color-brand-primary)]" />
                <span className="text-sm font-bold">Storage Limit</span>
              </Inline>
              <p className="text-xs text-[var(--lpd-color-text-muted)]">You are using 85% of your available brand asset storage.</p>
              <div className="h-2 bg-black/5 rounded-full overflow-hidden">
                <div className="h-full bg-orange-500 w-[85%]" />
              </div>
            </Stack>
          </Box>
        </Stack>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="primary">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
};

export const BottomDrawer: StoryObj = {
  render: () => (
    <Drawer direction="bottom">
      <DrawerTrigger asChild>
        <Button variant="primary">Open Mobile Menu</Button>
      </DrawerTrigger>
      <DrawerContent 
        direction="bottom"
        title="Quick Actions" 
        description="Common tasks for your current workspace."
      >
        <Grid cols={2} gap={4} className="pb-12">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Box key={i} padding={8} background="subtle" radius="3xl" border className="flex flex-col items-center gap-3 hover:border-[var(--lpd-color-brand-primary)] transition-colors cursor-pointer group">
              <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                <Settings size={24} className="text-[var(--lpd-color-brand-primary)]" />
              </div>
              <span className="text-xs font-bold">Action {i}</span>
            </Box>
          ))}
        </Grid>
      </DrawerContent>
    </Drawer>
  ),
};
