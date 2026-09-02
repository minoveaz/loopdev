import React, { useEffect } from 'react';
import type { ActivityCardData } from '@loopdev/public-blocks';

export interface CimoActivitySeoHeadProps {
  activity: ActivityCardData;
}

export const CimoActivitySeoHead: React.FC<CimoActivitySeoHeadProps> = ({ activity }) => {
  useEffect(() => {
    // 1. Update Document Title
    const originalTitle = document.title;
    document.title = `${activity.title} • ${activity.sport} en ${activity.location} | CIMO`;

    // 2. Structured Data: SportsEvent (Schema.org)
    const sportsEventLd = {
      '@context': 'https://schema.org',
      '@type': 'SportsEvent',
      name: activity.title,
      description:
        activity.instructions ||
        `Únete a este entreno grupal de ${activity.sport} (${activity.level}) con ${activity.captain.name} en ${activity.location}.`,
      startDate: '2026-09-01T07:30:00+02:00',
      eventStatus: 'https://schema.org/EventScheduled',
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      location: {
        '@type': 'Place',
        name: activity.location,
        address: {
          '@type': 'PostalAddress',
          addressLocality: activity.location.split(',')[1]?.trim() || 'Madrid',
          addressCountry: 'ES',
        },
      },
      image: [activity.image],
      organizer: {
        '@type': 'Person',
        name: activity.captain.name,
        image: activity.captain.avatarUrl,
        url: `https://minoveaz.github.io/CIMO/#/app/profile/${activity.captain.id}`,
      },
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'EUR',
        availability:
          activity.currentMembers.length >= activity.maxMembers
            ? 'https://schema.org/SoldOut'
            : 'https://schema.org/InStock',
        validFrom: '2026-08-31',
        url: window.location.href,
      },
      maximumAttendeeCapacity: activity.maxMembers,
      remainingAttendeeCapacity: Math.max(0, activity.maxMembers - activity.currentMembers.length),
    };

    // 3. Structured Data: BreadcrumbList (Schema.org)
    const breadcrumbLd = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'CIMO',
          item: 'https://minoveaz.github.io/CIMO/#/app/home',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: activity.location.split(',')[1]?.trim() || 'Madrid',
          item: `https://minoveaz.github.io/CIMO/#/app/home?zone=${encodeURIComponent(activity.location.split(',')[1]?.trim() || 'Madrid')}`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: activity.sport,
          item: `https://minoveaz.github.io/CIMO/#/app/home?sport=${encodeURIComponent(activity.sport)}`,
        },
        {
          '@type': 'ListItem',
          position: 4,
          name: activity.title,
          item: window.location.href,
        },
      ],
    };

    // Inject Scripts into DOM Head
    const scriptSportsEvent = document.createElement('script');
    scriptSportsEvent.id = 'cimo-schema-sports-event';
    scriptSportsEvent.type = 'application/ld+json';
    scriptSportsEvent.text = JSON.stringify(sportsEventLd);
    document.head.appendChild(scriptSportsEvent);

    const scriptBreadcrumb = document.createElement('script');
    scriptBreadcrumb.id = 'cimo-schema-breadcrumbs';
    scriptBreadcrumb.type = 'application/ld+json';
    scriptBreadcrumb.text = JSON.stringify(breadcrumbLd);
    document.head.appendChild(scriptBreadcrumb);

    return () => {
      document.title = originalTitle;
      const existingSports = document.getElementById('cimo-schema-sports-event');
      if (existingSports) existingSports.remove();
      const existingBreadcrumbs = document.getElementById('cimo-schema-breadcrumbs');
      if (existingBreadcrumbs) existingBreadcrumbs.remove();
    };
  }, [activity]);

  return null;
};
