import type { ActivityCardData, ChatMessage } from '@loopdev/public-blocks';

export const INITIAL_ACTIVITIES: ActivityCardData[] = [
  {
    id: 'act-1',
    title: 'Running 8K Rodaje Suave',
    sport: 'Running',
    date: 'Hoy',
    time: '19:30',
    location: 'Puerta de Alcalá, Parque del Retiro, Madrid',
    level: 'Intermedio',
    maxMembers: 6,
    captain: { id: 'u1', name: 'Sofía Díaz', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80', isCaptain: true },
    currentMembers: [
      { id: 'u1', name: 'Sofía Díaz', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80', isCaptain: true },
      { id: 'u2', name: 'Carlos Ruiz', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80' },
      { id: 'u3', name: 'Elena Gómez', avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80' },
      { id: 'u4', name: 'Mateo Sanz' },
    ],
    isJoined: true,
  },
  {
    id: 'act-2',
    title: 'Partido Pádel Mixto Nivel 3.5',
    sport: 'Pádel',
    date: 'Mañana',
    time: '18:00',
    location: 'Club Ciudad de la Raqueta, Montecarmelo',
    level: 'Intermedio',
    maxMembers: 4,
    captain: { id: 'u5', name: 'Marcos Vega', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80', isCaptain: true },
    currentMembers: [
      { id: 'u5', name: 'Marcos Vega', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80', isCaptain: true },
      { id: 'u6', name: 'Lucía Blanco', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80' },
      { id: 'u7', name: 'Pablo Marín' },
    ],
    isJoined: false,
  },
  {
    id: 'act-3',
    title: 'WOD en Parejas & Mobility',
    sport: 'Crossfit',
    date: 'Sábado',
    time: '10:30',
    location: 'Box Singular CrossFit, Chamberí',
    level: 'Avanzado',
    maxMembers: 8,
    captain: { id: 'u8', name: 'Adrián Torres', avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80', isCaptain: true },
    currentMembers: [
      { id: 'u8', name: 'Adrián Torres', avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80', isCaptain: true },
      { id: 'u9', name: 'Marta Soler', avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80' },
      { id: 'u10', name: 'Diego Ramos' },
      { id: 'u11', name: 'Sara Núñez' },
      { id: 'u12', name: 'Javier Gil' },
      { id: 'u13', name: 'Natalia Rey' },
    ],
    isJoined: false,
  },
  {
    id: 'act-4',
    title: 'Ruta en Carretera Puerto de Navacerrada',
    sport: 'Ciclismo',
    date: 'Domingo',
    time: '08:30',
    location: 'Estación de Cercanías Cercedilla',
    level: 'Avanzado',
    maxMembers: 10,
    captain: { id: 'u14', name: 'Víctor León', isCaptain: true },
    currentMembers: [
      { id: 'u14', name: 'Víctor León', isCaptain: true },
      { id: 'u15', name: 'Raúl Méndez' },
    ],
    isJoined: false,
  },
];

export const INITIAL_CREW_CHATS: Record<string, ChatMessage[]> = {
  'act-1': [
    { id: 'm1', senderId: 'u1', senderName: 'Sofía Díaz', text: '¡Hola Crew! Llevad agua que hace calor hoy.', timestamp: '17:15' },
    { id: 'm2', senderId: 'u2', senderName: 'Carlos Ruiz', text: '¡Perfecto Sofía! Yo llego 10 min antes para calentar.', timestamp: '17:40' },
    { id: 'm3', senderId: 'u3', senderName: 'Elena Gómez', text: '¡Nos vemos en la Puerta de Alcalá!', timestamp: '18:02' },
  ],
  'act-2': [
    { id: 'm4', senderId: 'u5', senderName: 'Marcos Vega', text: '¡Nos falta solo 1 jugador para cerrar la pista de 4!', timestamp: '15:20' },
    { id: 'm5', senderId: 'u6', senderName: 'Lucía Blanco', text: 'Tengo pelotas nuevas de Bullpadel.', timestamp: '16:05' },
  ],
};
