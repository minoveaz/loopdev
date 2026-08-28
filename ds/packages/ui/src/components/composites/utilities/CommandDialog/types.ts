import type { ReactNode } from 'react';

export interface CommandDialogItem {
  id: string;
  label: string;
  description?: string;
  keywords?: string[];
  shortcut?: string;
  icon?: ReactNode;
  disabled?: boolean;
  onSelect?: () => void;
}

export interface CommandDialogGroup {
  id: string;
  label?: string;
  commands: CommandDialogItem[];
}

export interface CommandDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  commands: CommandDialogItem[];
  groups?: CommandDialogGroup[];
  placeholder: string;
  emptyMessage: string;
  title: string;
  description?: string;
  closeLabel: string;
  closeOnSelect: boolean;
}
