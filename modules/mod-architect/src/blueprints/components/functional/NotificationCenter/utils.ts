
export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string; // Using string for display simplicity in this demo, usually Date
  isRead: boolean;
}

export const getIconForType = (type: NotificationType): string => {
  switch (type) {
    case 'info': return 'smart_toy';
    case 'success': return 'check_circle';
    case 'warning': return 'warning';
    case 'error': return 'error';
    default: return 'notifications';
  }
};

export const getStylesForType = (type: NotificationType) => {
  switch (type) {
    case 'info':
      return {
        iconBg: 'bg-primary/10 text-primary',
        border: 'border-primary'
      };
    case 'success':
      return {
        iconBg: 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400',
        border: 'border-green-500'
      };
    case 'warning':
      return {
        iconBg: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400',
        border: 'border-yellow-500'
      };
    case 'error':
      return {
        iconBg: 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400',
        border: 'border-red-500'
      };
    default:
      return {
        iconBg: 'bg-slate-100 dark:bg-slate-800 text-slate-500',
        border: 'border-slate-300'
      };
  }
};

// Mock Initial Data to match the design source
export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'info',
    title: 'AI Analysis Complete',
    message: 'Your project optimization report is ready for review.',
    timestamp: '2 min ago',
    isRead: false
  },
  {
    id: '2',
    type: 'warning',
    title: 'Storage Warning',
    message: 'You have reached 90% of your allocated storage space.',
    timestamp: '1 hr ago',
    isRead: false // Kept unread to show visual difference, source had it unread-looking or read-looking
  },
  {
    id: '3',
    type: 'success',
    title: 'Deployment Successful',
    message: 'v2.4.0 is now live on production servers.',
    timestamp: 'Yesterday',
    isRead: true
  }
];
