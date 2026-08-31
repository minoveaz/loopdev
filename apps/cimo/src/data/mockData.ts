import type { ActivityCardData, ChatMessage } from '@loopdev/public-blocks';
import retiroRunningImg from '../assets/images/retiro_running_8k_1785941041754.jpg';
import padelMatchImg from '../assets/images/padel_mixto_match_1785941057074.jpg';
import crossfitImg from '../assets/images/cimo_community_hero_1785924771208.jpg';
import hikingImg from '../assets/images/running_group_hug_1785923312353.jpg';

export const INITIAL_ACTIVITIES: ActivityCardData[] = [
  {
    id: 'act_1',
    title: 'Running 8K por Parque del Retiro',
    sport: 'running',
    image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&q=80&w=1000',
    date: 'Hoy',
    time: '19:30',
    location: 'Puerta de Alcalá - Parque del Retiro (Madrid)',
    postalCode: '28009',
    level: 'Intermedio',
    paceOrDetails: '8 km • Ritmo 5:15 min/km',
    instructions: 'Quedamos en la estatua de la Puerta de Alcalá. Rodaje continuo por sombra y 5 min de estiramientos post-entreno.',
    maxMembers: 5,
    captain: {
      id: 'capt_1',
      name: 'Sofía',
      age: 27,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
      isCaptain: true,
    },
    currentMembers: [
      { id: 'capt_1', name: 'Sofía', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400', age: 27, isCaptain: true },
      { id: 'usr_2', name: 'Marco', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400', age: 29 },
      { id: 'usr_3', name: 'Elena', avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400', age: 26 },
      { id: 'user_me', name: 'Alex Rivera', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400', age: 28 },
    ],
    isJoined: true,
    thirdHalf: {
      enabled: true,
      type: 'cafe',
      venue: 'Café Murillo (Retiro)',
      notes: 'Nos sentaremos en la terraza 30-40 min a tomar un café, rehidratarnos y charlar tras los 8K.',
    },
  },
  {
    id: 'act_2',
    title: 'Partida Pádel Mixto Nivel Intermedio',
    sport: 'padel',
    image: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&q=80&w=1000',
    date: 'Mañana',
    time: '18:00',
    location: 'Club de Tenis Chamartín (Madrid)',
    level: 'Intermedio',
    paceOrDetails: 'Pista reservada 1h 30m • Nivel 3.5 Playtomic',
    instructions: 'Pista 4 cubierta. Traed vuestra pala y agua. Pelotas nuevas incluidas.',
    maxMembers: 4,
    captain: {
      id: 'capt_2',
      name: 'Javier',
      age: 31,
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
      isCaptain: true,
    },
    currentMembers: [
      { id: 'capt_2', name: 'Javier', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400', age: 31, isCaptain: true },
      { id: 'usr_4', name: 'Lucía', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400', age: 28 },
      { id: 'usr_5', name: 'Carlos', avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400', age: 30 },
    ],
    isJoined: false,
    thirdHalf: {
      enabled: true,
      type: 'beer',
      venue: 'Terraza Club Chamartín',
      notes: 'Tercer tiempo con cañas, refrescos y picoteo para comentar los mejores puntos del partido.',
    },
  },
  {
    id: 'act_3',
    title: 'Ruta Hiking La Pedriza & Canto Cochino',
    sport: 'hiking',
    image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&q=80&w=1000',
    date: 'Sábado',
    time: '09:00',
    location: 'Aparcamiento Canto Cochino, Manzanares el Real',
    level: 'Intermedio',
    paceOrDetails: '12 km • Desnivel +450m • 4 horas aprox',
    instructions: 'Calzado de montaña obligatorio, 1.5L de agua y algo de picar para el camino.',
    maxMembers: 8,
    captain: {
      id: 'capt_3',
      name: 'Marta',
      age: 29,
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400',
      isCaptain: true,
    },
    currentMembers: [
      { id: 'capt_3', name: 'Marta', avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400', age: 29, isCaptain: true },
      { id: 'usr_6', name: 'Diego', avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400', age: 32 },
      { id: 'usr_7', name: 'Sara', avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=400', age: 27 },
      { id: 'usr_8', name: 'Javier Gil', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400', age: 30 },
    ],
    isJoined: false,
    thirdHalf: {
      enabled: false,
    },
  },
  {
    id: 'act_4',
    title: 'Pozo Americano de Pádel Mixto',
    sport: 'padel',
    image: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&q=80&w=1000',
    date: 'Domingo',
    time: '11:00',
    location: 'Pádel Indoor Moraleja (Alcobendas)',
    level: 'Todos los niveles',
    paceOrDetails: 'Rotación de parejas cada 20 min • 4 pistas',
    instructions: 'Llegar 10 min antes para el sorteo de pistas inicial. Bolas incluidas.',
    maxMembers: 8,
    captain: {
      id: 'capt_4',
      name: 'Adrián',
      age: 30,
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400',
      isCaptain: true,
    },
    currentMembers: [
      { id: 'capt_4', name: 'Adrián', avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400', age: 30, isCaptain: true },
      { id: 'usr_9', name: 'Laura', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400', age: 26 },
    ],
    isJoined: false,
    thirdHalf: {
      enabled: true,
      type: 'smoothie',
      venue: 'Cafetería del Club de Pádel',
      notes: 'Aperitivo y bebidas frías en la terraza para entrega simbólica de trofeos del pozo.',
    },
  },
];

export const INITIAL_CREW_CHATS: Record<string, ChatMessage[]> = {
  act_1: [
    { id: 'm1', senderId: 'capt_1', senderName: 'Sofía', text: '¡Hola Crew! Llevad agua que hace calor hoy.', timestamp: '17:15' },
    { id: 'm2', senderId: 'usr_2', senderName: 'Marco', text: '¡Perfecto Sofía! Yo llego 10 min antes para calentar.', timestamp: '17:40' },
    { id: 'm3', senderId: 'usr_3', senderName: 'Elena', text: '¡Nos vemos en la Puerta de Alcalá!', timestamp: '18:02' },
  ],
  act_2: [
    { id: 'm4', senderId: 'capt_2', senderName: 'Javier', text: '¡Nos falta solo 1 jugador para cerrar la pista de 4!', timestamp: '15:20' },
    { id: 'm5', senderId: 'usr_4', senderName: 'Lucía', text: 'Tengo pelotas nuevas de Bullpadel.', timestamp: '16:05' },
  ],
  act_3: [
    { id: 'm6', senderId: 'capt_3', senderName: 'Marta', text: 'Punto de encuentro a las 09:00 en Canto Cochino. Llevad botas de montaña.', timestamp: '08:10' },
  ],
};
