
import React from 'react';
import { ComponentEntry } from '../types';
import { IconButton } from '../components/ui/IconButton';
import { EditAction, DeleteAction, ViewAction, CopyAction } from '../components/ui/Actions/index';
import { ActionMenu } from '../components/functional/ActionMenu/index';

export const actionsData: ComponentEntry[] = [
  {
    id: 'icon-buttons',
    title: 'Semantic Actions',
    category: 'Actions',
    description: 'Atomic action buttons for direct row manipulation.',
    size: 'small', 
    component: (
      <div className="flex items-center gap-4">
        <EditAction onClick={() => alert('Edit')} />
        <ViewAction onClick={() => alert('View')} />
        <CopyAction onClick={() => alert('Copy')} />
        <DeleteAction onClick={() => alert('Delete')} />
      </div>
    )
  },
  {
    id: 'action-menu',
    title: 'Action Menu',
    category: 'Actions',
    description: 'Contextual dropdown for dense interfaces.',
    size: 'small',
    component: (
      <div className="flex items-center justify-center w-full h-40">
        <ActionMenu>
          <ActionMenu.Item icon="edit" label="Edit Record" onClick={() => {}} />
          <ActionMenu.Item icon="content_copy" label="Duplicate" onClick={() => {}} />
          <ActionMenu.Divider />
          <ActionMenu.Item icon="archive" label="Archive" onClick={() => {}} />
          <ActionMenu.Item icon="delete" label="Delete" variant="danger" onClick={() => {}} />
        </ActionMenu>
      </div>
    )
  }
];
