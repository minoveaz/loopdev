export type ActivityEventType = 'BUY' | 'SELL' | 'REBUY' | 'RISK' | 'SYNC' | 'SYSTEM' | 'ERROR';
export type ActivityEventStatus = 'filled' | 'rejected' | 'pending' | 'canceled' | 'warning' | 'success';

export interface ActivityEvent {
  id: string;
  time: string;
  type: ActivityEventType;
  pair?: string;
  strategy?: string;
  qty?: string | number;
  price?: string | number;
  status: ActivityEventStatus;
  message?: string;
}

/**
 * @interface ActivityStreamProps
 * @description Contract for the industrial execution log stream.
 */
export interface ActivityStreamProps {
  /** Array of activity events to display */
  events: ActivityEvent[];
  /** Whether the stream is actively receiving live data */
  isLive?: boolean;
  /** Optional title for the stream container */
  title?: string;
  /** Whether the component is in a loading state */
  isLoading?: boolean;
  /** Additional CSS classes */
  className?: string;
}
