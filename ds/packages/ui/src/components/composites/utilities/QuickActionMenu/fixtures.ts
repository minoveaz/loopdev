import { QuickActionGroup } from './types';

export const QUICK_ACTION_FIXTURES: Record<string, QuickActionGroup[]> = {
  marketing: [
    {
      label: 'Crear',
      actions: [
        { id: '1', label: 'Nueva Marca', icon: 'LibraryBig', shortcut: 'B', onAction: () => console.log('New Brand') },
        { id: '2', label: 'Nueva Campaña', icon: 'Megaphone', shortcut: 'C' },
        { id: '3', label: 'Subir Asset', icon: 'Upload', shortcut: 'A' },
      ]
    },
    {
      label: 'Acciones de Equipo',
      actions: [
        { id: '4', label: 'Invitar Miembro', icon: 'UserPlus' },
      ]
    }
  ]
};
