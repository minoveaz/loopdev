export interface ActionCardProps {
  title: string;
  description: string;
  icon: string;
  intent?: 'primary' | 'secondary' | 'neutral';
  onClick?: () => void;
}
