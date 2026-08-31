export type CimoSportId = 'running' | 'padel' | 'hiking';

export interface CimoSportDefinition {
  id: CimoSportId;
  label: string;
  emoji: string;
  image: string;
  description: string;
}

export interface SportPaceOption {
  title: string;
  metric: string;
  label: string;
  desc: string;
  level: 'Principiante' | 'Intermedio' | 'Avanzado' | 'Todos los niveles';
}

export const CIMO_SPORTS_CATALOG: CimoSportDefinition[] = [
  {
    id: 'running',
    label: 'Running',
    emoji: '🏃',
    image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&q=80&w=1200',
    description: 'Rodajes en parques, series en pista y tiradas largas',
  },
  {
    id: 'padel',
    label: 'Pádel',
    emoji: '🎾',
    image: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&q=80&w=1200',
    description: 'Partidas 2vs2 mixtas y masculinas en club',
  },
  {
    id: 'hiking',
    label: 'Hiking / Trekking',
    emoji: '🥾',
    image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&q=80&w=1200',
    description: 'Rutas de montaña, sierra y senderismo',
  },
];

export const SPORT_PACES_CATALOG: Record<CimoSportId, SportPaceOption[]> = {
  running: [
    { title: 'Suave', metric: '+5:45 min/km', label: 'Suave (+5:45 min/km)', desc: 'Ritmo conversacional, ideal para rodar y charlar', level: 'Principiante' },
    { title: 'Medio', metric: '5:00 - 5:30 min/km', label: 'Medio (5:00 - 5:30 min/km)', desc: 'Ritmo constante para corredores habituales', level: 'Intermedio' },
    { title: 'Alegre', metric: 'Sub 4:45 min/km', label: 'Alegre (Sub 4:45 min/km)', desc: 'Ritmo vivo para series o tempo run', level: 'Avanzado' },
  ],
  padel: [
    { title: 'Iniciación', metric: 'Nivel 2.0 - 2.5', label: 'Iniciación (Nivel 2.0 - 2.5)', desc: 'Partidos amistosos para aprender y coger confianza', level: 'Principiante' },
    { title: 'Intermedio', metric: 'Nivel 3.0 - 3.5', label: 'Intermedio (Nivel 3.0 - 3.5)', desc: 'Peloteo fluido, voleas y globos controlados', level: 'Intermedio' },
    { title: 'Avanzado', metric: 'Nivel 4.0+', label: 'Avanzado (Nivel 4.0+)', desc: 'Partida competitiva con buena pegada y táctica', level: 'Avanzado' },
  ],
  hiking: [
    { title: 'Paseo Fácil', metric: '6 - 8 km', label: 'Paseo Fácil (6 - 8 km)', desc: 'Senderismo suave por senderos llanos', level: 'Principiante' },
    { title: 'Media Montaña', metric: '10 - 14 km (+400m)', label: 'Media Montaña (10 - 14 km)', desc: 'Desnivel medio (+400m), ritmo activo', level: 'Intermedio' },
    { title: 'Alta Exigencia', metric: '+16 km (Técnico)', label: 'Alta Exigencia (+16 km)', desc: 'Cumbres y terreno técnico con buen desnivel', level: 'Avanzado' },
  ],
};

export interface SportGearItem {
  id: string;
  label: string;
  sub: string;
  icon: string;
}

export const SPORT_GEAR_CATALOG: Record<string, SportGearItem[]> = {
  hiking: [
    { id: 'footwear', label: 'Calzado Trail', sub: 'Suela con agarre', icon: 'Footprints' },
    { id: 'water', label: 'Agua (1.5L)', sub: 'Mínimo sugerido', icon: 'Droplets' },
    { id: 'windbreaker', label: 'Cortavientos / Capa', sub: 'Protección para la cumbre', icon: 'ShieldCheck' },
    { id: 'snack', label: 'Snack / Fruta', sub: 'Frutos secos o barrita', icon: 'Apple' },
    { id: 'sun', label: 'Protección Solar', sub: 'Gorra y crema', icon: 'Sun' },
  ],
  padel: [
    { id: 'racket', label: 'Pala de Pádel', sub: 'Propia o alquilada', icon: 'Activity' },
    { id: 'shoes', label: 'Calzado Pádel', sub: 'Suela espiga / clay', icon: 'Footprints' },
    { id: 'water', label: 'Botella de Agua', sub: 'Para cambios de lado', icon: 'Droplets' },
    { id: 'balls', label: 'Bolas Incluidas', sub: 'Las pone el capitán', icon: 'CheckCircle2' },
  ],
  cycling: [
    { id: 'bike', label: 'Bici a Punto', sub: 'Presión y frenos', icon: 'Bike' },
    { id: 'helmet', label: 'Casco Obligatorio', sub: 'Homologado', icon: 'ShieldCheck' },
    { id: 'water', label: 'Bidón de Agua', sub: 'Con sales o agua', icon: 'Droplets' },
    { id: 'tools', label: 'Cámara / Bomba', sub: 'Kit de repuesto', icon: 'Wrench' },
  ],
  running: [
    { id: 'shoes', label: 'Calzado Técnico', sub: 'Zapatillas de running', icon: 'Footprints' },
    { id: 'apparel', label: 'Ropa Cómoda', sub: 'Tejido transpirable', icon: 'Flame' },
    { id: 'water', label: 'Hidratación', sub: 'Botella de agua', icon: 'Droplets' },
    { id: 'energy', label: 'Buena Energía', sub: 'Ganas de entrenar', icon: 'Zap' },
  ],
};

export const CIMO_LEVELS_CATALOG = [
  { id: 'Cualquier nivel', label: 'Cualquier nivel', desc: 'Ver todos los ritmos y categorías' },
  { id: 'Principiante', label: 'Principiante', desc: 'Iniciación y ritmos muy suaves' },
  { id: 'Intermedio', label: 'Intermedio', desc: 'Ritmo constante y regular' },
  { id: 'Avanzado', label: 'Avanzado', desc: 'Intensidad alta y series exigentes' },
  { id: 'Todos los niveles', label: 'Todos los niveles', desc: 'Grupos abiertos y escalables' },
];

export const CIMO_DATE_PRESETS = [
  { label: 'Cualquier día', sub: 'Sin límite', value: 'Cualquier día' },
  { label: 'Hoy', sub: 'Entrenos hoy', value: 'Hoy' },
  { label: 'Mañana', sub: 'Próximas 24h', value: 'Mañana' },
  { label: 'Este finde', sub: 'Sáb & Dom', value: 'Este fin de semana' },
  { label: 'Esta semana', sub: 'Lunes a Viernes', value: 'Esta semana' },
];

export function getSportById(id: string): CimoSportDefinition | undefined {
  const norm = id.toLowerCase();
  return CIMO_SPORTS_CATALOG.find((s) => s.id === norm || s.label.toLowerCase() === norm);
}

export function getSportLabel(id: string): string {
  if (id.toLowerCase() === 'todos') return 'Todos los deportes';
  return getSportById(id)?.label ?? id;
}

export function getSportPaces(sportId: string): SportPaceOption[] {
  const key = sportId.toLowerCase() as CimoSportId;
  return SPORT_PACES_CATALOG[key] ?? SPORT_PACES_CATALOG.running;
}

export function getSportGear(sportId: string): SportGearItem[] {
  const key = sportId.toLowerCase();
  return SPORT_GEAR_CATALOG[key] ?? SPORT_GEAR_CATALOG.running;
}
