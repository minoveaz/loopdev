import { CommandBarTriggerProps } from './types';

export const COMMAND_BAR_TRIGGER_FIXTURES: Record<string, CommandBarTriggerProps> = {
  default: {
    placeholder: 'Search modules or actions...',
    shortcut: '⌘K',
    mode: 'full',
    onOpen: () => console.log('Open Command Palette')
  },
  icon: {
    mode: 'icon',
    onOpen: () => console.log('Open Command Palette from Icon')
  }
};
