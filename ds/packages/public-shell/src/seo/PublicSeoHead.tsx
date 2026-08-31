'use client';

import React, { useEffect } from 'react';
import type { PublicSeoHeadProps } from './types';

export const PublicSeoHead: React.FC<PublicSeoHeadProps> = ({ seo, brand }) => {
  const fullTitle = brand ? `${seo.title} | ${brand.name}` : seo.title;

  useEffect(() => {
    if (typeof document === 'undefined') return;

    document.title = fullTitle;

    const setMeta = (name: string, content?: string, isProperty = false) => {
      if (!content) return;
      const attr = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attr}="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    const setLink = (rel: string, href?: string, hreflang?: string) => {
      if (!href) return;
      const selector = hreflang ? `link[rel="${rel}"][hreflang="${hreflang}"]` : `link[rel="${rel}"]`;
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', rel);
        if (hreflang) element.setAttribute('hreflang', hreflang);
        document.head.appendChild(element);
      }
      element.setAttribute('href', href);
    };

    // Basic SEO
    setMeta('description', seo.description);
    if (!seo.indexable) {
      setMeta('robots', 'noindex, nofollow');
    } else {
      setMeta('robots', 'index, follow');
    }
    if (seo.keywords?.length) {
      setMeta('keywords', seo.keywords.join(', '));
    }

    // Canonical
    if (seo.canonicalUrl) {
      setLink('canonical', seo.canonicalUrl);
    }

    // Hreflang
    if (seo.hreflang) {
      Object.entries(seo.hreflang).forEach(([lang, url]) => {
        setLink('alternate', url, lang);
      });
    }

    // Open Graph
    setMeta('og:title', seo.openGraph.title ?? seo.title, true);
    setMeta('og:description', seo.openGraph.description ?? seo.description, true);
    setMeta('og:image', seo.openGraph.image, true);
    setMeta('og:type', seo.openGraph.type, true);
    setMeta('og:locale', seo.openGraph.locale ?? 'es_ES', true);
    if (seo.openGraph.url ?? seo.canonicalUrl) {
      setMeta('og:url', seo.openGraph.url ?? seo.canonicalUrl, true);
    }

    // Twitter Card
    if (seo.twitter) {
      setMeta('twitter:card', seo.twitter.card ?? 'summary_large_image');
      if (seo.twitter.site) setMeta('twitter:site', seo.twitter.site);
      setMeta('twitter:title', seo.twitter.title ?? seo.title);
      setMeta('twitter:description', seo.twitter.description ?? seo.description);
      if (seo.twitter.image ?? seo.openGraph.image) {
        setMeta('twitter:image', seo.twitter.image ?? seo.openGraph.image);
      }
    }
  }, [fullTitle, seo, brand]);

  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={seo.description} />
      {seo.canonicalUrl && <link rel="canonical" href={seo.canonicalUrl} />}
      {seo.openGraph && (
        <>
          <meta property="og:title" content={seo.openGraph.title ?? seo.title} />
          <meta property="og:description" content={seo.openGraph.description ?? seo.description} />
          <meta property="og:image" content={seo.openGraph.image} />
          <meta property="og:type" content={seo.openGraph.type} />
        </>
      )}
      {seo.jsonLd && seo.jsonLd.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(seo.jsonLd) }}
        />
      )}
    </>
  );
};
