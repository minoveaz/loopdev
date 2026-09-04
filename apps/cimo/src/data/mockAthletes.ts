import type { ExtendedUserProfileData } from '../components/CimoEditProfileView';

export const MOCK_COMMUNITY_ATHLETES: Record<string, ExtendedUserProfileData> = {
  alexrivera: {
    name: 'Alex Rivera',
    email: 'alex.rivera@example.com',
    handle: '@alexrivera',
    city: 'Madrid, España',
    neighborhood: 'Retiro / Chamberí',
    avatarUrl:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
    coverUrl:
      'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&q=80&w=1400',
    bio: 'Apasionado del running matutino y las partidas de pádel. ¡Siempre dispuesto a sumar nuevos kilómetros y conectar con gente activa!',
    sports: [
      { sport: 'Running', level: 'Intermedio (5-10K)', pace: '5:15 min/km' },
      { sport: 'Pádel', level: 'Nivel 3.5 (Intermedio)', pace: 'Drive / Revés' },
      { sport: 'Hiking', level: 'Rutas 10-15 km', pace: '10-15 km • +600m desnivel' },
    ],
    weeklySchedule: {
      Lunes: ['afternoon'],
      Martes: ['morning'],
      Miércoles: ['afternoon'],
      Jueves: ['afternoon'],
      Viernes: [],
      Sábado: ['morning'],
      Domingo: ['morning'],
    },
    groupSizePreference: 'micro',
    goals: [
      '🤝 Conocer deportistas activos',
      '☕ Café / Caña post-entreno (Tercer Tiempo)',
      '🔥 Mantener constancia semanal',
    ],
    isCaptainAvailable: true,
    defaultCaptainNotes: '💧 Traer agua • ⏰ Llegar 5 min antes • 🧘 Estiramientos al terminar',
    phoneWhatsapp: '+34 612 345 678',
    phonePrivacy: true,
    linkedinUrl: 'https://linkedin.com/in/alexrivera-sport',
    stravaUrl: 'https://strava.com/athletes/alexrivera',
    instagramHandle: '@alex_rivera_cimo',
  },
  'sofia-diaz': {
    name: 'Sofía Díaz',
    email: 'sofia.diaz@example.com',
    handle: '@sofiadiaz_runs',
    city: 'Madrid, España',
    neighborhood: 'Retiro / Salamanca',
    avatarUrl:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    coverUrl:
      'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&q=80&w=1400',
    bio: 'Capitana de Running en El Retiro. Corro medias maratones y lidero grupos matutinos los martes y jueves a ritmo constante.',
    sports: [
      { sport: 'Running', level: 'Avanzado (10-21K)', pace: '4:45 - 5:00 min/km' },
      { sport: 'Hiking', level: 'Rutas Sierra', pace: '15-20 km • +800m' },
    ],
    weeklySchedule: {
      Lunes: [],
      Martes: ['morning'],
      Miércoles: [],
      Jueves: ['morning'],
      Viernes: [],
      Sábado: ['morning'],
      Domingo: ['morning'],
    },
    groupSizePreference: 'micro',
    goals: [
      '⚡ Preparación Media Maratón',
      '☕ Café post-entreno en Murillo',
      '🤝 Guiar a nuevos corredores',
    ],
    isCaptainAvailable: true,
    defaultCaptainNotes: '💧 Traer bidón de hidratación • Calentamiento articular de 5 min.',
    phoneWhatsapp: '+34 622 890 123',
    phonePrivacy: true,
    stravaUrl: 'https://strava.com/athletes/sofiadiaz',
    instagramHandle: '@sofi_runs_madrid',
  },
  'javier-chamartin': {
    name: 'Javier Chamartín',
    email: 'javier.padel@example.com',
    handle: '@javi_padel35',
    city: 'Madrid, España',
    neighborhood: 'Chamartín / Bernabéu',
    avatarUrl:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
    coverUrl:
      'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&q=80&w=1400',
    bio: 'Jugador habitual de pádel nivel 3.5 Playtomic. Organizo partidos entre semana por la tarde y pozos americanos los fines de semana.',
    sports: [
      { sport: 'Pádel', level: 'Intermedio Playtomic 3.5', pace: 'Revés agresivo / volea' },
      { sport: 'Running', level: 'Rodajes suaves', pace: '5:30 min/km' },
    ],
    weeklySchedule: {
      Lunes: ['afternoon'],
      Martes: [],
      Miércoles: ['afternoon'],
      Jueves: [],
      Viernes: ['afternoon'],
      Sábado: ['morning'],
      Domingo: [],
    },
    groupSizePreference: 'micro',
    goals: [
      '🎾 Subir nivel a 4.0',
      '🍻 Caña y tertulia post-partido',
      '🔥 Competitividad sana y buen rollo',
    ],
    isCaptainAvailable: true,
    defaultCaptainNotes: '🎾 Traed pala propia. Bolas Head Pro puestas por el capitán.',
    phoneWhatsapp: '+34 633 456 789',
    phonePrivacy: true,
    instagramHandle: '@javi_padel_madrid',
  },
  'marta-soler': {
    name: 'Marta Soler',
    email: 'marta.soler@example.com',
    handle: '@marta_hikingsierra',
    city: 'Madrid, España',
    neighborhood: 'Sierra de Guadarrama / Collado Villalba',
    avatarUrl:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400',
    coverUrl:
      'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&q=80&w=1400',
    bio: 'Guía de media montaña y apasionada del trekking por la Sierra de Guadarrama. Cero prisas, paisajes brutales y respeto a la naturaleza.',
    sports: [
      { sport: 'Hiking', level: 'Avanzado / Guía', pace: '12-25 km • +1000m' },
      { sport: 'Trail Running', level: 'Intermedio', pace: '6:00 min/km en monte' },
    ],
    weeklySchedule: {
      Lunes: [],
      Martes: [],
      Miércoles: [],
      Jueves: [],
      Viernes: [],
      Sábado: ['morning'],
      Domingo: ['morning'],
    },
    groupSizePreference: 'medium',
    goals: ['🌿 Rutas de montaña seguras', '🥪 Picnic en cumbres', '📸 Fotografía de naturaleza'],
    isCaptainAvailable: true,
    defaultCaptainNotes: '🥾 Botas de trekking obligatorias • 1.5L agua mínima • Cortavientos.',
    phoneWhatsapp: '+34 644 112 233',
    phonePrivacy: true,
    instagramHandle: '@marta_mountain_madrid',
  },
};

export function getAthleteProfileById(idOrHandle?: string | null): ExtendedUserProfileData {
  if (!idOrHandle) return MOCK_COMMUNITY_ATHLETES['alexrivera'];
  const clean = idOrHandle.toLowerCase().replace('@', '');
  if (MOCK_COMMUNITY_ATHLETES[clean]) return MOCK_COMMUNITY_ATHLETES[clean];
  if (clean === 'capt_1' || clean === 'sofia' || clean.includes('sofia'))
    return MOCK_COMMUNITY_ATHLETES['sofia-diaz'];
  if (clean === 'capt_2' || clean === 'javier' || clean.includes('javi'))
    return MOCK_COMMUNITY_ATHLETES['javier-chamartin'];
  if (clean === 'capt_3' || clean === 'marta' || clean.includes('marta'))
    return MOCK_COMMUNITY_ATHLETES['marta-soler'];
  return MOCK_COMMUNITY_ATHLETES['alexrivera'];
}
