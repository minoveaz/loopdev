
export interface Tag {
  id: string;
  label: string;
  variant?: 'primary' | 'warning';
}

export const generateId = () => Math.random().toString(36).substring(2, 9);

export const DEFAULT_TAGS: Tag[] = [
  { id: '1', label: 'Alex D.', variant: 'primary' },
  { id: '2', label: 'Engineering', variant: 'primary' },
  { id: '3', label: 'External', variant: 'warning' }
];
