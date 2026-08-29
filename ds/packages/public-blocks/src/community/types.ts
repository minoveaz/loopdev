export interface CommunityMember {
  id: string;
  name: string;
  age?: number;
  avatarUrl?: string;
  isCaptain?: boolean;
  bio?: string;
}

export interface ActivityCardData {
  id: string;
  title: string;
  sport: 'running' | 'padel' | 'hiking' | 'cycling' | 'crossfit' | string;
  sportIcon?: string;
  image?: string;
  date: string;
  time: string;
  location: string;
  level: 'Principiante' | 'Intermedio' | 'Avanzado' | 'Todos los niveles';
  paceOrDetails?: string;
  currentMembers: CommunityMember[];
  maxMembers: number;
  captain: CommunityMember;
  isJoined?: boolean;
  price?: string;
  instructions?: string;
  postalCode?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  text: string;
  timestamp: string;
  isOwn?: boolean;
}

export interface ActivityCardProps {
  data: ActivityCardData;
  onJoin?: (activityId: string) => void;
  onSelect?: (activityId: string) => void;
  isSelected?: boolean;
  className?: string;
}

export interface CrewAvatarGroupProps {
  members: CommunityMember[];
  maxVisible?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export interface ChatStreamWidgetProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  currentUserId?: string;
  title?: string;
  placeholder?: string;
  className?: string;
}

export interface FeedbackRatingBlockProps {
  activityTitle: string;
  onSubmit: (feedback: { rating: number; comment?: string; tags: string[] }) => void;
  className?: string;
}
