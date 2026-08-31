export interface AdvisorInfo {
  name: string;
  role: string;
  avatarUrl: string;
  phone?: string;
  whatsappNumber?: string;
  email?: string;
  statusBadge?: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface TestimonialItem {
  id: string;
  authorName: string;
  authorRole?: string;
  avatarUrl?: string;
  rating: number;
  content: string;
  productName?: string;
}

export interface TrustBadgeItem {
  id: string;
  label: string;
  iconName?: string;
}

export interface AdvisorCardProps {
  advisor: AdvisorInfo;
  onContact?: (channel: 'whatsapp' | 'call' | 'email') => void;
  className?: string;
}

export interface FaqSectionProps {
  title?: string;
  subtitle?: string;
  faqs: FaqItem[];
  className?: string;
}

export interface TestimonialsGridProps {
  title?: string;
  subtitle?: string;
  testimonials: TestimonialItem[];
  className?: string;
}

export interface TrustBadgeBarProps {
  badges: TrustBadgeItem[];
  className?: string;
}

export interface FloatingWhatsAppProps {
  phoneNumber: string;
  defaultMessage?: string;
  tooltipText?: string;
}
