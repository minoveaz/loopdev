import type {
  PublicBrandTheme,
  PublicNavigation,
  PublicSeoMetadata,
  PublicViewComposition,
} from '@loopdev/contracts';

export const cimoBrandTheme: PublicBrandTheme = {
  id: 'cimo',
  name: 'CIMO',
  colors: {
    primary: '#7FB77E',
    primaryHover: '#6ea26d',
    secondary: '#1F4E5F',
    accent: '#7FB77E',
    background: '#EEF2F2',
    surface: '#FFFFFF',
    textMain: '#161D1A',
    textSecondary: '#6C757D',
  },
  logos: {
    markSvg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
      <circle cx="36" cy="30" r="8" fill="#1F4E5F" />
      <path d="M 36 44 C 22 44 14 56 14 68 C 14 80 28 84 42 74 C 54 65 62 52 70 52" stroke="#1F4E5F" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" />
      <circle cx="64" cy="30" r="8" fill="#7FB77E" />
      <path d="M 64 44 C 78 44 86 56 86 68 C 86 80 72 84 58 74 C 46 65 38 52 30 52" stroke="#7FB77E" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" />
    </svg>`,
    fullSvg: `<svg viewBox="0 18 215 50" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-10 w-auto">
      <g transform="translate(0, -2) scale(0.85)">
        <circle cx="36" cy="30" r="8" fill="#1F4E5F" />
        <path d="M 36 44 C 22 44 14 56 14 68 C 14 80 28 84 42 74 C 54 65 62 52 70 52" stroke="#1F4E5F" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" />
        <circle cx="64" cy="30" r="8" fill="#7FB77E" />
        <path d="M 64 44 C 78 44 86 56 86 68 C 86 80 72 84 58 74 C 46 65 38 52 30 52" stroke="#7FB77E" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" />
      </g>
      <text x="86" y="46" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="34" font-weight="900" fill="#1F4E5F" letter-spacing="-0.03em">Cimo</text>
      <text x="87" y="60" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="9.5" font-weight="700" fill="#7FB77E" letter-spacing="0.06em">SPORT &amp; SOCIAL</text>
    </svg>`,
  },
  typography: {
    fontFamily: "'Plus Jakarta Sans', Inter, system-ui, sans-serif",
  },
};

export const cimoNavigation: PublicNavigation = {
  brandId: 'cimo',
  defaultRouteId: 'feed',
  mobilePrimaryRouteIds: ['feed', 'explore', 'chats', 'profile'],
  routes: [
    { id: 'feed', path: '/', label: 'Feed', icon: 'Home', requiresAuth: false, visibility: ['mobile', 'tablet', 'desktop'], presentation: 'tab' },
    { id: 'explore', path: '/explorar', label: 'Explorar', icon: 'Compass', requiresAuth: false, visibility: ['mobile', 'tablet', 'desktop'], presentation: 'tab' },
    { id: 'chats', path: '/chats', label: 'Chats', icon: 'MessageCircle', badgeCount: 3, requiresAuth: false, visibility: ['mobile', 'tablet', 'desktop'], presentation: 'tab' },
    { id: 'profile', path: '/perfil', label: 'Perfil', icon: 'User', requiresAuth: true, visibility: ['mobile', 'tablet', 'desktop'], presentation: 'tab' },
  ],
};

export const CIMO_FEED_COMPOSITION: PublicViewComposition = {
  recipe: 'PublicSocialFeed',
  grid: {
    columns: 12,
    gap: 'lg',
    maxWidth: 'full',
  },
  regions: [
    {
      id: 'cimo-filters-col',
      slot: 'sidebar-filters',
      component: 'CimoSportFilters',
      colSpan: 3,
      sizing: 'fill',
      overflow: 'auto-y',
      responsive: {
        tablet: 'drawer',
        mobile: 'sheet',
      },
    },
    {
      id: 'cimo-feed-col',
      slot: 'main-feed',
      component: 'CimoActivitiesFeed',
      colSpan: 6,
      sizing: 'fill',
      overflow: 'auto-y',
      responsive: {
        tablet: 'preserve',
        mobile: 'stack',
      },
    },
    {
      id: 'cimo-inspector-col',
      slot: 'context-inspector',
      component: 'CimoCrewDetailInspector',
      colSpan: 3,
      sizing: 'fill',
      overflow: 'auto-y',
      responsive: {
        tablet: 'stack',
        mobile: 'modal',
      },
    },
  ],
};

export const cimoSeoConfig: PublicSeoMetadata = {
  title: 'CIMO | Conoce personas entrenando y crea tu Crew deportivo',
  description: 'Únete a planes deportivos grupales en Madrid y otras ciudades: running, pádel, crossfit, ciclismo y más.',
  canonicalUrl: 'https://minoveaz.github.io/CIMO/',
  openGraph: {
    title: 'CIMO | Conoce personas entrenando',
    description: 'Encuentra compañeros para entrenar, únete a microgrupos (Crews) y comparte tus deportes favoritos.',
    image: 'https://minoveaz.github.io/CIMO/cimo-mark.svg',
    type: 'website',
    locale: 'es_ES',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@cimo_app',
    title: 'CIMO | Social Sports Network',
    description: 'Conoce personas entrenando en tu ciudad.',
  },
  indexable: true,
  keywords: ['deporte', 'running', 'pádel', 'madrid', 'crews', 'social sports', 'entrenamiento'],
};
