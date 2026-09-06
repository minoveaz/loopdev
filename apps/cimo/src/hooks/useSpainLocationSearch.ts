import { useEffect, useState } from 'react';
import { POPULAR_SPORTS_VENUES } from '../data/spanishCitiesCatalog';

export interface GeocodedPlace {
  name: string;
  address: string;
  city: string;
  postalCode?: string;
  lat: number;
  lng: number;
  isLiveApiResult?: boolean;
}

// Clean accent & lowercase helper
function clean(str: string) {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

export function useSpainLocationSearch(query: string, city: string) {
  const [results, setResults] = useState<GeocodedPlace[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const q = clean(query);
    if (!q || q.length < 3) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    setIsLoading(true);

    const timer = setTimeout(async () => {
      // 1. Local catalog matching
      const localMatches: GeocodedPlace[] = POPULAR_SPORTS_VENUES.filter((v) => {
        const vName = clean(v.name);
        const vAddr = clean(v.address);
        const vCity = clean(v.city);
        return (
          vName.includes(q) ||
          vAddr.includes(q) ||
          (city && vCity.includes(clean(city)) && vName.includes(q))
        );
      }).map((v) => ({
        name: v.name,
        address: v.address,
        city: v.city,
        postalCode: v.postalCode,
        lat: v.lat,
        lng: v.lng,
        isLiveApiResult: false,
      }));

      // 2. Live OpenStreetMap / Photon Geocoding API for Spain (Instant, free, comprehensive)
      try {
        const searchQuery = `${query}, ${city || 'España'}`;
        const res = await fetch(
          `https://photon.komoot.io/api/?q=${encodeURIComponent(searchQuery)}&limit=6&lat=40.4168&lon=-3.7038`,
        );

        if (res.ok && isMounted) {
          const data = await res.json();
          const livePlaces: GeocodedPlace[] = (data.features || [])
            .map((f: any) => {
              const props = f.properties || {};
              const coords = f.geometry?.coordinates || [];
              const placeName = props.name || props.street || query;
              const placeCity = props.city || props.county || props.state || city || 'España';
              const street = props.street
                ? `${props.street}${props.housenumber ? ' ' + props.housenumber : ''}`
                : '';
              const postcode = props.postcode || '';
              const fullAddr = [street, placeCity, postcode].filter(Boolean).join(', ');

              return {
                name: placeName,
                address: fullAddr || `${placeName}, ${placeCity}`,
                city: placeCity,
                postalCode: postcode,
                lat: coords[1] ?? 40.4168,
                lng: coords[0] ?? -3.7038,
                isLiveApiResult: true,
              };
            })
            .filter((p: GeocodedPlace) => {
              // Deduplicate against local matches
              return !localMatches.some((lm) => clean(lm.name) === clean(p.name));
            });

          if (isMounted) {
            setResults([...localMatches, ...livePlaces]);
            setIsLoading(false);
          }
          return;
        }
      } catch (err) {
        // Fallback gracefully to local matches
      }

      if (isMounted) {
        setResults(localMatches);
        setIsLoading(false);
      }
    }, 280);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [query, city]);

  return { results, isLoading };
}
