import { NotificationItem } from './types';

export const NOTIFICATION_CENTER_FIXTURES: Record<string, NotificationItem[]> = {
  recent: [
    {
      id: '1',
      title: 'Fallo de Sincronización',
      description: 'No se pudo conectar con el bucket de assets en la región us-east-1.',
      timestamp: '2m ago',
      type: 'error',
      read: false
    },
    {
      id: '2',
      title: 'Aprobación Pendiente',
      description: 'Tu nueva regla de marca para "Logos" requiere revisión del Admin.',
      timestamp: '15m ago',
      type: 'warning',
      read: false
    },
    {
      id: '3',
      title: 'Sistema Actualizado',
      description: 'Se ha desplegado la versión v1.3 del SuiteHeader con éxito.',
      timestamp: '1h ago',
      type: 'info',
      read: true
    }
  ],
  empty: []
};
