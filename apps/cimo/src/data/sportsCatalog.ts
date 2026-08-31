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

export interface SportRealPhoto {
  id: string;
  url: string;
  title: string;
  locationTag: string;
}

export const SPORT_REAL_PHOTOS_CATALOG: Record<string, SportRealPhoto[]> = {
  hiking: [
    {
      id: 'hk_1',
      url: 'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&q=80&w=1200',
      title: 'Senderismo Sierra & Granito',
      locationTag: 'La Pedriza / Guadarrama',
    },
    {
      id: 'hk_2',
      url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1200',
      title: 'Cumbres y Valle Panorámico',
      locationTag: 'Pirineos / Gredos',
    },
    {
      id: 'hk_3',
      url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=1200',
      title: 'Sendero Boscoso de Montaña',
      locationTag: 'Bosques y Riberas',
    },
    {
      id: 'hk_4',
      url: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=1200',
      title: 'Grupo de Trekking Activo',
      locationTag: 'Ruta Comunitaria',
    },
  ],
  running: [
    {
      id: 'rn_1',
      url: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&q=80&w=1200',
      title: 'Parque Arbolado & Sombra',
      locationTag: 'Parque del Retiro (Madrid)',
    },
    {
      id: 'rn_2',
      url: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&q=80&w=1200',
      title: 'Grupo Running al Atardecer',
      locationTag: 'Madrid Río / Paseo Marítimo',
    },
    {
      id: 'rn_3',
      url: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?auto=format&fit=crop&q=80&w=1200',
      title: 'Asfalto y Ritmo Vivo',
      locationTag: 'Circuito Urbano',
    },
    {
      id: 'rn_4',
      url: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&q=80&w=1200',
      title: 'Trail Running Matutino',
      locationTag: 'Casa de Campo / Collserola',
    },
  ],
  padel: [
    {
      id: 'pd_1',
      url: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&q=80&w=1200',
      title: 'Pistas Panorámicas de Pádel',
      locationTag: 'Club Deportivo',
    },
    {
      id: 'pd_2',
      url: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&q=80&w=1200',
      title: 'Césped Azul & Pelotas Nuevas',
      locationTag: 'Pista de Competición',
    },
    {
      id: 'pd_3',
      url: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?auto=format&fit=crop&q=80&w=1200',
      title: 'Pista Cubierta Climatizada',
      locationTag: 'Indoor Club',
    },
  ],
  cycling: [
    {
      id: 'cy_1',
      url: 'https://images.unsplash.com/photo-1541625602330-2277a4c46182?auto=format&fit=crop&q=80&w=1200',
      title: 'Pelotón Carretera Secundaria',
      locationTag: 'Sierra & Asfalto',
    },
    {
      id: 'cy_2',
      url: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&q=80&w=1200',
      title: 'Ruta Gravel & Pistas de Tierra',
      locationTag: 'Pistas Rurales',
    },
  ],
  crossfit: [
    {
      id: 'cf_1',
      url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=1200',
      title: 'Box Equipado para WOD',
      locationTag: 'Box Oficial',
    },
    {
      id: 'cf_2',
      url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=1200',
      title: 'Entreno Funcional Outdoor',
      locationTag: 'Calistenia Park',
    },
  ],
};

export const THIRD_HALF_CITY_SPOTS: Record<string, Record<string, string[]>> = {
  Madrid: {
    cafe: ['Café Murillo (Retiro)', 'Honest Greens (Castellana)', 'Toma Café (Malasaña)', 'Café del Art (La Latina)', 'Federal Café (Conde Duque)'],
    beer: ['Terraza Florida Park (Retiro)', 'Cervecería La Fábrica (Chamartín)', 'El Tigre del Norte (Chueca)', 'Terraza Atenas (La Latina)', 'Cervecería Santa Bárbara'],
    smoothie: ['Frutas Prohibidas (Chueca)', 'Oakberry Açaí (Salamanca)', 'Roots Lamarca (Fernando VI)', 'Honest Greens Juice Bar'],
    picnic: ['Césped Palacio de Cristal (Retiro)', 'Templo de Debod (Moncloa)', 'Lago de la Casa de Campo', 'Parque del Oeste'],
  },
  Barcelona: {
    cafe: ['Nomad Coffee Lab (El Born)', 'Federal Café (Sant Antoni)', "Satan's Coffee Corner (Gótico)", 'Syra Coffee (Gràcia)'],
    beer: ['Cervecería Moritz (Sant Antoni)', 'La Terrassa del Duquesa (Port Vell)', 'Bar Lobo (Raval)', 'Cervecería El Vaso de Oro (Barceloneta)'],
    smoothie: ['The Green Spot (Barceloneta)', 'Teresa Carles (Raval)', 'FitBar Açaí (Gràcia)'],
    picnic: ['Parc de la Ciutadella', 'Bunkers del Carmel (Vistas)', 'Parc del Laberint'],
  },
  Valencia: {
    cafe: ['Bluebell Coffee (Ruzafa)', 'Dulce de Leche (Ruzafa)', 'Federal Café (Ciutat Vella)'],
    beer: ['Mercado de Colón (Eixample)', 'Fàbrica de Hielo (Cabanyal)', 'Tyris On Tap (Ciutat Vella)'],
    smoothie: ['Almalibre Açaí Bar (El Carmen)', 'Be Green Salad Company'],
    picnic: ['Jardines del Turia (Tramo Alameda)', 'Parque de Cabecera'],
  },
  Sevilla: {
    cafe: ['Virgin Coffee (Las Setas)', 'Torch Coffee Roasters (Paseo de las Delicias)'],
    beer: ['La Terraza del EME (Giralda)', 'El Rinconcillo (Centro)', 'Mercado de Triana'],
    smoothie: ['Milk Away (Centro)', 'Berry Açaí Bar'],
    picnic: ['Parque de María Luisa (Plaza de España)', 'Jardines de Murillo'],
  },
  Málaga: {
    cafe: ['Mia Coffee Shop (Centro)', 'Santa Canela Café (Soho)'],
    beer: ['La Terraza del Chinitas (Centro)', 'Cervecería Los Gatos', 'El Pimpi (Alcazaba)'],
    smoothie: ['Recyclo Bike Café', 'Raw Coco Green Bar'],
    picnic: ['Parque de Málaga', 'Gibralfaro'],
  },
  Bilbao: {
    cafe: ['Cinnamon Café (Centro)', 'Wiché Café Bakery'],
    beer: ['Plaza Nueva (Casco Viejo)', 'Terraza Dique (Ría de Bilbao)'],
    smoothie: ['Copper Deli', 'Green Bistro'],
    picnic: ['Parque Doña Casilda', 'Artxanda'],
  },
  Zaragoza: {
    cafe: ['Doña Hipólita (Plaza San Felipe)', 'Café Nolasco'],
    beer: ['El Tubo (Centro)', 'Terraza El Molino de San Lázaro'],
    smoothie: ['Mi Habitación Favorita', 'La Clandestina'],
    picnic: ['Parque Grande José Antonio Labordeta', 'Riberas del Ebro'],
  },
  Otra: {
    cafe: ['Cafetería con terraza soleada cercana', 'Café de Especialidad local', 'Pastelería / Bakery artesanal'],
    beer: ['Bar o terraza del club deportivo', 'Cervecería de la plaza mayor', 'Chiringuito / Terraza'],
    smoothie: ['Juice & Recovery Bar', 'Bar de batidos naturales y fruta'],
    picnic: ['Parque principal de la zona', 'Mirador panorámico', 'Área recreativa arbolada'],
  },
};

export function getSportRealPhotos(sportId: string): SportRealPhoto[] {
  const key = sportId.toLowerCase();
  return SPORT_REAL_PHOTOS_CATALOG[key] ?? SPORT_REAL_PHOTOS_CATALOG.running;
}

export function getThirdHalfSpots(city: string, type: 'cafe' | 'beer' | 'smoothie' | 'picnic'): string[] {
  const cityData = THIRD_HALF_CITY_SPOTS[city] ?? THIRD_HALF_CITY_SPOTS.Madrid ?? THIRD_HALF_CITY_SPOTS.Otra;
  return cityData[type] ?? THIRD_HALF_CITY_SPOTS.Otra[type] ?? ['Cafetería con terraza'];
}

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
