export type ActivityTone = 'primary' | 'warning' | 'neutral' | 'success';

export interface ActivityItemProps {
  id: string;
  icon: string;
  action: string;
  module: string;
  timestamp: string;
  description?: string;
  href?: string;
  tone?: ActivityTone;
  isLast?: boolean;
}

export interface ActivityFeedProps {
  items: ActivityItemProps[];
  title?: string;
  onViewAll?: () => void;
  className?: string;
}