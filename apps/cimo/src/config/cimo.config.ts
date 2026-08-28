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
    primary: '#00B894',
    primaryHover: '#009678',
    secondary: '#1F4E5F',
    accent: '#7FB77E',
    background: '#F8F9FA',
    surface: '#FFFFFF',
    textMain: '#161D1A',
    textSecondary: '#6C757D',
  },
  logos: {
    markSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none" class="w-full h-full">
      <circle cx="50" cy="50" r="48" fill="#00B894" />
      <path d="M30 50C30 38.9543 38.9543 30 50 30C61.0457 30 70 38.9543 70 50C70 61.0457 61.0457 70 50 70C38.9543 70 30 61.0457 30 50Z" stroke="white" stroke-width="8" stroke-linecap="round"/>
      <circle cx="38" cy="42" r="5" fill="white" />
      <circle cx="62" cy="58" r="5" fill="#1F4E5F" />
    </svg>`,
    fullSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 60" fill="none" class="h-8">
      <circle cx="30" cy="30" r="24" fill="#00B894" />
      <path d="M20 30C20 24.4772 24.4772 20 30 20C35.5228 20 40 24.4772 40 30C40 35.5228 35.5228 40 30 40C24.4772 40 20 35.5228 20 30Z" stroke="white" stroke-width="4"/>
      <circle cx="25" cy="27" r="3" fill="white" />
      <circle cx="35" cy="33" r="3" fill="#1F4E5F" />
      <text x="65" y="38" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-weight="900" font-size="28" fill="#161D1A" letter-spacing="-0.5">CIMO</text>
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
    gap: 'md',
    maxWidth: '7xl',
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
