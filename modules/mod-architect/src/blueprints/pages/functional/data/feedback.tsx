
import React from 'react';
import { ComponentEntry } from '../types';
import { EmptyState } from '../components/functional/EmptyState/index';
import { NotificationCenter } from '../components/functional/NotificationCenter/index';

export const feedbackData: ComponentEntry[] = [
  {
    id: 'empty-state',
    title: 'Empty State',
    category: 'Feedback',
    description: 'Placeholder for missing data.',
    size: 'small',
    component: (
      <div className="w-full transform scale-90">
        <EmptyState 
          size="sm"
          title="No Data"
          description="Try adjusting your search."
          action={<button className="text-primary text-xs font-bold hover:underline">Reset</button>}
        />
      </div>
    )
  },
  {
    id: 'notification-center',
    title: 'Notification Center',
    category: 'Feedback',
    description: 'Interactive alert list with read states.',
    size: 'medium',
    component: (
      <div className="flex items-center justify-center py-4">
        <NotificationCenter 
          onViewAll={() => alert("Navigate to: /system/activity")} 
        />
      </div>
    )
  }
];
