import { describe, expect, it } from 'vitest';
import {
  PublicRouteRegistrySchema,
  PublicSeoMetadataSchema,
  PublicSportsEventSchema,
  PublicProductSchema,
} from '../seo';

describe('Public SEO Contracts', () => {
  it('validates a complete SEO metadata block with Open Graph and Twitter Cards', () => {
    const validSeo = {
      title: 'Running 8K por Parque del Retiro | CIMO Crew Madrid',
      description: 'Únete al Crew de running en Madrid. Rodaje de 8 km a ritmo 5:25 min/km saliendo desde Puerta de Alcalá.',
      canonicalUrl: 'https://cimo.app/actividades/retiro-8k',
      hreflang: {
        es: 'https://cimo.app/actividades/retiro-8k',
      },
      openGraph: {
        title: 'Running 8K por Parque del Retiro - CIMO',
        description: 'Únete a Sofía y 4 deportistas más hoy a las 19:30 en el Retiro.',
        url: 'https://cimo.app/actividades/retiro-8k',
        image: 'https://cimo.app/assets/retiro_running_8k.jpg',
        type: 'website',
        locale: 'es_ES',
      },
      twitter: {
        card: 'summary_large_image',
        site: '@cimo_app',
        title: 'Running 8K por Parque del Retiro',
        description: 'Únete a Sofía y 4 deportistas más hoy a las 19:30.',
        image: 'https://cimo.app/assets/retiro_running_8k.jpg',
      },
      indexable: true,
      keywords: ['running', 'madrid', 'retiro', 'deporte', 'crew'],
    };

    expect(PublicSeoMetadataSchema.safeParse(validSeo).success).toBe(true);
  });

  it('rejects titles that are too short (< 10 chars) or descriptions too short (< 50 chars)', () => {
    const invalidShortSeo = {
      title: 'Short',
      description: 'Too short description',
      openGraph: {
        title: 'Short',
        description: 'Short',
        image: 'https://cimo.app/img.jpg',
      },
    };

    const result = PublicSeoMetadataSchema.safeParse(invalidShortSeo);
    expect(result.success).toBe(false);
  });

  it('validates SportsEvent JSON-LD schema for CIMO activities', () => {
    const sportsEvent = {
      '@type': 'SportsEvent',
      name: 'Pádel Mixto Nivel Intermedio',
      description: 'Partido amistoso de pádel 4 personas en Club Ciudad de la Raqueta',
      startDate: '2026-08-28T19:00:00+02:00',
      location: {
        '@type': 'Place',
        name: 'Ciudad de la Raqueta',
        address: 'Calle Monasterio de El Paular, 2, Madrid',
      },
      organizer: {
        '@type': 'Person',
        name: 'Carlos Mendoza',
      },
      eventStatus: 'https://schema.org/EventScheduled',
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    };

    expect(PublicSportsEventSchema.safeParse(sportsEvent).success).toBe(true);
  });

  it('validates Product JSON-LD schema for VitaBlue insurance products', () => {
    const product = {
      '@type': 'Product',
      name: 'Seguro Médico para Visado de Estudiantes',
      description: 'Póliza médica completa sin copagos ni carencias apta para consulados españoles.',
      image: 'https://vitablue.es/images/sanitas-estudiantes.jpg',
      brand: {
        '@type': 'Brand',
        name: 'Sanitas',
      },
      offers: {
        '@type': 'Offer',
        price: '45.00',
        priceCurrency: 'EUR',
      },
    };

    expect(PublicProductSchema.safeParse(product).success).toBe(true);
  });

  it('validates Route Registry for sitemap generation', () => {
    const routeRegistry = [
      { path: '/', locale: 'es', indexable: true, sitemap: true, priority: 1.0 },
      { path: '/explorar', locale: 'es', indexable: true, sitemap: true, priority: 0.9 },
      { path: '/aviso-legal', locale: 'es', indexable: false, sitemap: false, priority: 0.1 },
    ];

    expect(PublicRouteRegistrySchema.safeParse(routeRegistry).success).toBe(true);
  });
});
