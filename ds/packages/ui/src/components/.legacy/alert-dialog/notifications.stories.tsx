import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { 
  AlertDialog, 
  AlertDialogTrigger, 
  AlertDialogContent, 
  AlertDialogFooter, 
  AlertDialogAction, 
  AlertDialogCancel 
} from './alert-dialog';
import { Button } from '../../../components/atoms/button';
import { toast } from '../../../components/organisms/toast';
import { Stack, Inline } from '../../../components/layout/foundations';
import { Trash2 } from 'lucide-react';

const meta: Meta = {
  title: '🏗️ Organisms/Feedback/Alerts & Toasts',
};

export default meta;

export const AlertDialogShowcase: StoryObj = {
  render: () => (
    <Stack gap={8} align="center">
      <div className="text-center space-y-2">
        <h3 className="font-bold">Alert Dialog</h3>
        <p className="text-xs text-[var(--lpd-color-text-muted)]">Used for destructive or critical actions.</p>
      </div>
      
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" leftIcon={<Trash2 size={16} />}>Delete Workspace</Button>
        </AlertDialogTrigger>
        <AlertDialogContent 
          title="Are you absolutely sure?" 
          description="This action cannot be undone. This will permanently delete your workspace and remove all associated brand assets from our servers."
        >
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button variant="outline">Cancel</Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button variant="destructive" onClick={() => toast.error("Workspace deleted successfully")}>
                Yes, delete everything
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Stack>
  ),
};

export const ToastShowcase: StoryObj = {
  render: () => (
    <Stack gap={8} align="center">
      <div className="text-center space-y-2">
        <h3 className="font-bold">Toast Notifications</h3>
        <p className="text-xs text-[var(--lpd-color-text-muted)]">Ephemeral feedback for system processes.</p>
      </div>
      
      <Inline gap={3}>
        <Button 
          variant="outline" 
          onClick={() => toast.success("Campaign published!", {
            description: "Your 'Summer 2025' campaign is now live."
          })}
        >
          Success Toast
        </Button>
        
        <Button 
          variant="outline" 
          onClick={() => toast.error("Upload failed", {
            description: "Please check your internet connection and try again."
          })}
        >
          Error Toast
        </Button>

        <Button 
          variant="outline" 
          onClick={() => toast("System Update", {
            description: "Maintenance scheduled for 2:00 AM UTC.",
          })}
        >
          Info Toast
        </Button>

        <Button 
          variant="primary" 
          onClick={() => {
            const promise = () => new Promise((resolve) => setTimeout(resolve, 2000));
            toast.promise(promise, {
              loading: 'Syncing brand assets...',
              success: 'Assets synchronized!',
              error: 'Sync failed',
            });
          }}
        >
          Promise Toast
        </Button>
      </Inline>
    </Stack>
  ),
};
