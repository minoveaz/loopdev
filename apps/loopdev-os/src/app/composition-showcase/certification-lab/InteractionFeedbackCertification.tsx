'use client';

import {
  Button,
  CommandDialog,
  PlatformContextPanel,
  TechnicalDialog,
  ToastItem,
  type NotificationItem,
} from '@loopdev/ui';
import { useState } from 'react';
import { PlatformHeaderControls } from '@/components/layout/PlatformHeaderControls';

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  { id: 'sync', title: 'Sync completed', description: 'Contact records are up to date.', timestamp: '2m ago', type: 'success', read: false },
  { id: 'review', title: 'Review required', description: 'Three records need attention.', timestamp: '18m ago', type: 'warning', read: false },
];

export function InteractionFeedbackCertification() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [toastVisible, setToastVisible] = useState(true);
  const [contextPanelOpen, setContextPanelOpen] = useState(false);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const markAsRead = (id: string) => setNotifications((items) => items.map((item) => item.id === id ? { ...item, read: true } : item));
  const unreadCount = notifications.filter((item) => !item.read).length;

  return (
    <section className="space-y-4" aria-labelledby="interaction-feedback-examples">
      <div>
        <h2 id="interaction-feedback-examples" className="text-lg font-semibold text-text-main">Interaction and feedback</h2>
        <p className="text-sm text-text-muted">Existing global components, mounted together for visual and keyboard review.</p>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-3 border border-border-subtle p-4">
          <div>
            <h3 className="font-mono text-sm uppercase tracking-[0.14em] text-text-main">Toast</h3>
            <p className="mt-1 text-xs text-text-muted">Variants are rendered by the existing ToastItem contract.</p>
          </div>
          {toastVisible ? (
            <ToastItem
              id="certification-toast"
              title="Contact saved"
              description="The contact was updated successfully."
              variant="success"
              metadata="CRM"
              onDismiss={() => setToastVisible(false)}
              action={{ label: 'View contact', onClick: () => undefined }}
            />
          ) : (
            <Button size="sm" variant="outline" onClick={() => setToastVisible(true)}>Show toast</Button>
          )}
        </div>

        <div className="space-y-3 border border-border-subtle p-4">
          <div>
            <h3 className="font-mono text-sm uppercase tracking-[0.14em] text-text-main">TechnicalDialog</h3>
            <p className="mt-1 text-xs text-text-muted">Controlled open/close, semantic variant and actions.</p>
          </div>
          <Button size="sm" variant="outline" onClick={() => setDialogOpen(true)}>Open dialog</Button>
          <TechnicalDialog
            isOpen={dialogOpen}
            onClose={() => setDialogOpen(false)}
            title="Archive contact"
            description="This action changes the contact lifecycle state."
            variant="warning"
            actions={<><Button size="sm" variant="ghost" onClick={() => setDialogOpen(false)}>Cancel</Button><Button size="sm" variant="primary" onClick={() => setDialogOpen(false)}>Archive</Button></>}
          >
            <p className="text-sm text-text-muted">The contact can be restored later from the archived records view.</p>
          </TechnicalDialog>
        </div>

        <div className="space-y-3 border border-border-subtle p-4">
          <div>
            <h3 className="font-mono text-sm uppercase tracking-[0.14em] text-text-main">CommandDialog</h3>
            <p className="mt-1 text-xs text-text-muted">Existing command palette with groups, disabled command and keyboard close.</p>
          </div>
          <Button size="sm" variant="outline" onClick={() => setCommandOpen(true)}>Open command palette</Button>
          <CommandDialog
            open={commandOpen}
            onOpenChange={setCommandOpen}
            title="Command palette"
            description="Search and run an available command."
            placeholder="Run a command or search..."
            emptyMessage="No commands found."
            closeLabel="Close command palette"
            closeOnSelect
            commands={[
              { id: 'create', label: 'Create contact', description: 'Add a new CRM contact', shortcut: 'Cmd+N' },
              { id: 'disabled', label: 'Restricted action', disabled: true },
            ]}
            groups={[{ id: 'navigation', label: 'Navigation', commands: [{ id: 'settings', label: 'Open settings' }] }]}
          />
        </div>

        <div className="space-y-3 border border-border-subtle p-4">
          <div>
            <h3 className="font-mono text-sm uppercase tracking-[0.14em] text-text-main">PlatformContextPanel</h3>
            <p className="mt-1 text-xs text-text-muted">Notifications live inside the platform context panel boundary.</p>
          </div>
          <div className="flex items-center gap-3">
            <PlatformHeaderControls
              notifications={notifications}
              unreadCount={unreadCount}
              activeContext={contextPanelOpen ? 'notifications' : null}
              onOpenNotifications={() => setContextPanelOpen((open) => !open)}
            />
            <span className="text-xs text-text-muted">{unreadCount} unread</span>
          </div>
          {contextPanelOpen && (
            <div className="h-80 overflow-hidden border border-border-technical">
              <PlatformContextPanel
                mode="notifications"
              notifications={notifications}
              unreadCount={unreadCount}
                onClose={() => setContextPanelOpen(false)}
              onMarkAsRead={markAsRead}
              onMarkAllRead={() => setNotifications((items) => items.map((item) => ({ ...item, read: true })))}
                onRemoveNotification={(id) => setNotifications((items) => items.filter((item) => item.id !== id))}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
