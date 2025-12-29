import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Dialog, DialogTrigger, DialogContent, DialogFooter, DialogClose } from './dialog';
import { Button } from '../../../components/atoms/button';
import { Stack, Box } from '../../../components/layout/foundations';

const meta: Meta = {
  title: '🏗️ Organisms/Overlays/Dialog (Modal)',
  component: Dialog,
};

export default meta;

export const Default: StoryObj = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="primary">Open Modal</Button>
      </DialogTrigger>
      <DialogContent 
        title="Create New Campaign" 
        description="Fill out the details below to launch your next brand initiative."
      >
        <Stack gap={6}>
          <div className="space-y-2">
            <label className="text-sm font-bold uppercase tracking-widest opacity-50">Campaign Name</label>
            <Box padding={4} background="subtle" radius="xl" border>
              <span className="text-sm opacity-30">Enter name...</span>
            </Box>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold uppercase tracking-widest opacity-50">Objective</label>
            <Box padding={4} background="subtle" radius="xl" border>
              <span className="text-sm opacity-30">Select objective...</span>
            </Box>
          </div>
        </Stack>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button variant="primary">Create Campaign</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const LargeContent: StoryObj = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Terms & Conditions</Button>
      </DialogTrigger>
      <DialogContent title="Terms of Service" description="Please read carefully.">
        <Stack gap={4}>
          {[...Array(10)].map((_, i) => (
            <p key={i} className="text-sm text-[var(--lpd-color-text-muted)] leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
          ))}
        </Stack>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="primary">I Accept</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};
