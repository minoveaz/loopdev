export interface SportsSquadMember {
  id: string;
  name: string;
  avatarUrl: string;
  isCaptain?: boolean;
}

export interface SquadCallout {
  id: string;
  title: string;
  date: string;
  time: string;
  meetingPoint: string;
  myRsvp: 'going' | 'declined' | 'maybe' | 'none';
  attendingMembers: SportsSquadMember[];
  maxCapacity: number;
  hasThirdHalf: boolean;
  thirdHalfType?: 'cafe' | 'beer' | 'smoothie' | 'picnic';
  thirdHalfVenue?: string;
}

export interface SportsSquad {
  id: string;
  slug: string;
  name: string;
  sport: 'running' | 'padel' | 'hiking';
  badgeEmoji: string;
  location: string;
  typicalPaceOrLevel: string;
  recurringSchedule: string;
  members: SportsSquadMember[];
  activeCallout?: SquadCallout;
}

export interface CrewConnection {
  id: string;
  athlete: {
    id: string;
    name: string;
    age: number;
    avatarUrl: string;
    city: string;
    zone: string;
    bio: string;
    isCaptain: boolean;
  };
  sports: {
    sport: 'running' | 'padel' | 'hiking';
    level: string;
    paceOrMetric: string;
  }[];
  stats: {
    sharedWorkoutsCount: number;
    sharedThirdHalfsCount: number;
    lastWorkoutDate: string;
    lastWorkoutTitle: string;
    firstMetDate: string;
  };
  preferredThirdHalf?: 'cafe' | 'beer' | 'smoothie' | 'picnic';
  contactChannels?: {
    whatsappUnlocked: boolean;
    whatsappNumber?: string;
    stravaHandle?: string;
    instagramHandle?: string;
  };
  connectionStatus: 'habitual' | 'occasional' | 'favorite';
}

export const INITIAL_SPORTS_SQUADS: SportsSquad[] = [
  {
    id: 'sq_1',
    slug: 'retiro-morning-runners',
    name: 'Retiro Morning Runners',
    sport: 'running',
    badgeEmoji: '🏃',
    location: 'Parque del Retiro, Madrid',
    typicalPaceOrLevel: '5:15 min/km',
    recurringSchedule: 'Martes & Jueves • 07:30h',
    members: [
      {
        id: 'usr_me',
        name: 'Tú (Alex)',
        avatarUrl:
          'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
        isCaptain: true,
      },
      {
        id: 'capt_1',
        name: 'Sofía Díaz',
        avatarUrl:
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      },
      {
        id: 'usr_2',
        name: 'Marco Rossi',
        avatarUrl:
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
      },
      {
        id: 'usr_3',
        name: 'Elena Ramos',
        avatarUrl:
          'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200',
      },
    ],
    activeCallout: {
      id: 'call_1',
      title: 'Rodaje 8.5K amanecer + Café de especialidad',
      date: 'Mañana (Martes)',
      time: '07:30h',
      meetingPoint: 'Puerta de Alcalá',
      myRsvp: 'going',
      attendingMembers: [
        {
          id: 'usr_me',
          name: 'Tú',
          avatarUrl:
            'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
        },
        {
          id: 'capt_1',
          name: 'Sofía',
          avatarUrl:
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
        },
        {
          id: 'usr_2',
          name: 'Marco',
          avatarUrl:
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
        },
      ],
      maxCapacity: 5,
      hasThirdHalf: true,
      thirdHalfType: 'cafe',
      thirdHalfVenue: 'Café Murillo (Retiro)',
    },
  },
  {
    id: 'sq_2',
    slug: 'cuarteto-padel-chamartin',
    name: 'Cuarteto Pádel Chamartín',
    sport: 'padel',
    badgeEmoji: '🎾',
    location: 'Club Pádel Chamartín',
    typicalPaceOrLevel: 'Nivel 3.5 Playtomic',
    recurringSchedule: 'Viernes • 19:00h',
    members: [
      {
        id: 'usr_me',
        name: 'Tú (Alex)',
        avatarUrl:
          'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
      },
      {
        id: 'capt_2',
        name: 'Javier Chamartín',
        avatarUrl:
          'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
        isCaptain: true,
      },
      {
        id: 'usr_4',
        name: 'Lucía Méndez',
        avatarUrl:
          'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
      },
      {
        id: 'usr_5',
        name: 'Carlos Villa',
        avatarUrl:
          'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200',
      },
    ],
    activeCallout: {
      id: 'call_2',
      title: 'Partida 2vs2 + Caña & Aperitivo',
      date: 'Este Viernes',
      time: '19:00h',
      meetingPoint: 'Pista 4 Cubierta, Club Chamartín',
      myRsvp: 'none',
      attendingMembers: [
        {
          id: 'capt_2',
          name: 'Javier',
          avatarUrl:
            'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
        },
        {
          id: 'usr_4',
          name: 'Lucía',
          avatarUrl:
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
        },
        {
          id: 'usr_5',
          name: 'Carlos',
          avatarUrl:
            'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200',
        },
      ],
      maxCapacity: 4,
      hasThirdHalf: true,
      thirdHalfType: 'beer',
      thirdHalfVenue: 'Terraza Club Chamartín',
    },
  },
  {
    id: 'sq_3',
    slug: 'sierra-guadarrama-hikers',
    name: 'Sierra Guadarrama Hikers',
    sport: 'hiking',
    badgeEmoji: '🥾',
    location: 'Navacerrada & Pedriza',
    typicalPaceOrLevel: 'Media Montaña (12-16 km)',
    recurringSchedule: 'Fines de semana',
    members: [
      {
        id: 'usr_me',
        name: 'Tú (Alex)',
        avatarUrl:
          'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
      },
      {
        id: 'capt_3',
        name: 'Marta Navacerrada',
        avatarUrl:
          'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
        isCaptain: true,
      },
      {
        id: 'capt_1',
        name: 'Sofía Díaz',
        avatarUrl:
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      },
    ],
    activeCallout: {
      id: 'call_3',
      title: 'Ruta Canto Cochino & Mirador de las Buitreras',
      date: 'Este Sábado',
      time: '09:00h',
      meetingPoint: 'Parking Cantocochino, Manzanares el Real',
      myRsvp: 'maybe',
      attendingMembers: [
        {
          id: 'capt_3',
          name: 'Marta',
          avatarUrl:
            'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
        },
        {
          id: 'capt_1',
          name: 'Sofía',
          avatarUrl:
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
        },
      ],
      maxCapacity: 6,
      hasThirdHalf: true,
      thirdHalfType: 'picnic',
      thirdHalfVenue: 'Picnic en Pradera de la Pedriza',
    },
  },
];

export function getSquadBySlugOrId(slugOrId: string): SportsSquad {
  const clean = slugOrId.toLowerCase();
  const match = INITIAL_SPORTS_SQUADS.find((s) => s.slug === clean || s.id === clean);
  return match ?? INITIAL_SPORTS_SQUADS[0];
}

export const INITIAL_CREW_CONNECTIONS: CrewConnection[] = [
  {
    id: 'conn_1',
    athlete: {
      id: 'capt_1',
      name: 'Sofía Díaz',
      age: 27,
      avatarUrl:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
      city: 'Madrid',
      zone: 'Retiro / Salamanca',
      bio: 'Maratoniana en progreso. Me encanta rodar a primera hora y rematar con un buen café de especialidad.',
      isCaptain: true,
    },
    sports: [
      { sport: 'running', level: 'Intermedio', paceOrMetric: '5:15 min/km' },
      { sport: 'hiking', level: 'Media Montaña', paceOrMetric: '12-15 km' },
    ],
    stats: {
      sharedWorkoutsCount: 4,
      sharedThirdHalfsCount: 4,
      lastWorkoutDate: 'Ayer',
      lastWorkoutTitle: 'Running 8K por Parque del Retiro',
      firstMetDate: 'Hace 2 meses',
    },
    preferredThirdHalf: 'cafe',
    contactChannels: {
      whatsappUnlocked: true,
      whatsappNumber: '+34 612 345 678',
      stravaHandle: 'sofia_runs_madrid',
      instagramHandle: '@sofia.diaz.run',
    },
    connectionStatus: 'favorite',
  },
  {
    id: 'conn_2',
    athlete: {
      id: 'capt_2',
      name: 'Javier Chamartín',
      age: 31,
      avatarUrl:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
      city: 'Madrid',
      zone: 'Chamartín',
      bio: 'Fanático del pádel y de organizar partidas dinámicas con buen tercer tiempo en terraza.',
      isCaptain: true,
    },
    sports: [
      { sport: 'padel', level: 'Intermedio', paceOrMetric: 'Nivel 3.5 Playtomic' },
      { sport: 'running', level: 'Principiante', paceOrMetric: '5:45 min/km' },
    ],
    stats: {
      sharedWorkoutsCount: 3,
      sharedThirdHalfsCount: 3,
      lastWorkoutDate: 'Hace 4 días',
      lastWorkoutTitle: 'Partida Pádel Mixto Nivel Intermedio',
      firstMetDate: 'Hace 1 mes',
    },
    preferredThirdHalf: 'beer',
    contactChannels: {
      whatsappUnlocked: true,
      whatsappNumber: '+34 622 987 654',
      instagramHandle: '@javi_padel_mad',
    },
    connectionStatus: 'habitual',
  },
  {
    id: 'conn_3',
    athlete: {
      id: 'capt_3',
      name: 'Marta Navacerrada',
      age: 29,
      avatarUrl:
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400',
      city: 'Madrid',
      zone: 'Sierra de Guadarrama',
      bio: 'Guía de senderismo y apasionada de las cumbres. Desconectar en la montaña es mi religión.',
      isCaptain: true,
    },
    sports: [
      { sport: 'hiking', level: 'Avanzado', paceOrMetric: '+16 km • +800m' },
      { sport: 'running', level: 'Intermedio', paceOrMetric: '5:30 min/km' },
    ],
    stats: {
      sharedWorkoutsCount: 2,
      sharedThirdHalfsCount: 1,
      lastWorkoutDate: 'Sábado pasado',
      lastWorkoutTitle: 'Ruta Hiking La Pedriza & Canto Cochino',
      firstMetDate: 'Hace 3 semanas',
    },
    preferredThirdHalf: 'picnic',
    contactChannels: {
      whatsappUnlocked: true,
      whatsappNumber: '+34 633 112 233',
      stravaHandle: 'marta_mountains',
    },
    connectionStatus: 'habitual',
  },
  {
    id: 'conn_4',
    athlete: {
      id: 'usr_2',
      name: 'Marco Rossi',
      age: 29,
      avatarUrl:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
      city: 'Madrid',
      zone: 'Chamberí / Moncloa',
      bio: 'Corredor constante. Buscando compañeros para series en pista de atletismo y tiradas de domingo.',
      isCaptain: false,
    },
    sports: [
      { sport: 'running', level: 'Avanzado', paceOrMetric: '4:45 min/km' },
      { sport: 'padel', level: 'Intermedio', paceOrMetric: 'Nivel 3.0' },
    ],
    stats: {
      sharedWorkoutsCount: 3,
      sharedThirdHalfsCount: 2,
      lastWorkoutDate: 'Ayer',
      lastWorkoutTitle: 'Running 8K por Parque del Retiro',
      firstMetDate: 'Hace 2 meses',
    },
    preferredThirdHalf: 'cafe',
    contactChannels: {
      whatsappUnlocked: true,
      whatsappNumber: '+34 644 556 677',
      stravaHandle: 'marco_rossi_run',
    },
    connectionStatus: 'favorite',
  },
  {
    id: 'conn_5',
    athlete: {
      id: 'usr_3',
      name: 'Elena Ramos',
      age: 26,
      avatarUrl:
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400',
      city: 'Madrid',
      zone: 'Retiro',
      bio: 'Arquitecta y deportista casual. Me apunté a CIMO para tener constancia y no fallar los martes.',
      isCaptain: false,
    },
    sports: [
      { sport: 'running', level: 'Intermedio', paceOrMetric: '5:20 min/km' },
      { sport: 'hiking', level: 'Principiante', paceOrMetric: '8-10 km' },
    ],
    stats: {
      sharedWorkoutsCount: 2,
      sharedThirdHalfsCount: 2,
      lastWorkoutDate: 'Ayer',
      lastWorkoutTitle: 'Running 8K por Parque del Retiro',
      firstMetDate: 'Hace 1 mes',
    },
    preferredThirdHalf: 'cafe',
    contactChannels: {
      whatsappUnlocked: true,
      instagramHandle: '@elena_ramos_fit',
    },
    connectionStatus: 'occasional',
  },
  {
    id: 'conn_6',
    athlete: {
      id: 'usr_4',
      name: 'Lucía Méndez',
      age: 28,
      avatarUrl:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400',
      city: 'Madrid',
      zone: 'Pozuelo de Alarcón',
      bio: 'Jugadora de revés en pádel. Buscando partidas competitivas y bien coordinadas.',
      isCaptain: false,
    },
    sports: [{ sport: 'padel', level: 'Intermedio', paceOrMetric: 'Nivel 3.5' }],
    stats: {
      sharedWorkoutsCount: 1,
      sharedThirdHalfsCount: 1,
      lastWorkoutDate: 'Hace 4 días',
      lastWorkoutTitle: 'Partida Pádel Mixto Nivel Intermedio',
      firstMetDate: 'Hace 1 semana',
    },
    preferredThirdHalf: 'beer',
    contactChannels: {
      whatsappUnlocked: true,
      whatsappNumber: '+34 655 443 322',
    },
    connectionStatus: 'occasional',
  },
  {
    id: 'conn_7',
    athlete: {
      id: 'usr_5',
      name: 'Carlos Villa',
      age: 30,
      avatarUrl:
        'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400',
      city: 'Madrid',
      zone: 'Las Rozas',
      bio: 'Pádel los fines de semana y senderismo cuando el tiempo acompaña.',
      isCaptain: false,
    },
    sports: [
      { sport: 'padel', level: 'Intermedio', paceOrMetric: 'Nivel 3.0' },
      { sport: 'hiking', level: 'Media Montaña', paceOrMetric: '10-14 km' },
    ],
    stats: {
      sharedWorkoutsCount: 1,
      sharedThirdHalfsCount: 1,
      lastWorkoutDate: 'Hace 4 días',
      lastWorkoutTitle: 'Partida Pádel Mixto Nivel Intermedio',
      firstMetDate: 'Hace 1 semana',
    },
    preferredThirdHalf: 'beer',
    contactChannels: {
      whatsappUnlocked: true,
    },
    connectionStatus: 'occasional',
  },
];
