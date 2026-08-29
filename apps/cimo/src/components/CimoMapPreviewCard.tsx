import React, { useMemo } from 'react';
import { ExternalLink, MapPin } from 'lucide-react';
import { POPULAR_SPORTS_VENUES } from '../data/spanishCitiesCatalog';

export interface CimoMapPreviewCardProps {
  location: string;
  city: string;
  postalCode?: string;
  coords?: { lat: number; lng: number } | null;
  className?: string;
}

// Clean accent & lowercase helper
function cleanText(str: string) {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

export const CimoMapPreviewCard: React.FC<CimoMapPreviewCardProps> = ({
  location,
  city,
  postalCode,
  coords,
  className = '',
}) => {
  const { mapEmbedUrl, googleMapsUrl, resolvedAddress } = useMemo(() => {
    // 1. Direct coordinates override
    if (coords && coords.lat && coords.lng) {
      const latLng = `${coords.lat},${coords.lng}`;
      return {
        mapEmbedUrl: `https://maps.google.com/maps?q=${latLng}&z=16&output=embed`,
        googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${latLng}`,
        resolvedAddress: `${location}, ${city}`,
      };
    }

    const locClean = cleanText(location);
    const cityClean = cleanText(city);

    // Look for exact/partial match in our curated GPS coordinates database
    const matchedVenue = POPULAR_SPORTS_VENUES.find((v) => {
      const vName = cleanText(v.name);
      const vAddr = cleanText(v.address);
      const vCity = cleanText(v.city);

      if (cityClean && vCity && !vCity.includes(cityClean) && !cityClean.includes(vCity)) {
        return false;
      }

      const locBase = cleanText(location.replace(/\s*\([^)]*\)/g, ''));
      return (
        locClean === vName ||
        locClean === vAddr ||
        vName.includes(locClean) ||
        (locBase.length >= 4 && vName.includes(locBase)) ||
        (locBase.length >= 4 && vAddr.includes(locBase))
      );
    });

    if (matchedVenue) {
      const latLng = `${matchedVenue.lat},${matchedVenue.lng}`;
      return {
        mapEmbedUrl: `https://maps.google.com/maps?q=${latLng}&z=16&output=embed`,
        googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(matchedVenue.address)}`,
        resolvedAddress: matchedVenue.address,
      };
    }

    // Fallback: clean location string from parentheses noise
    const cleanLocation = location.replace(/\s*\([^)]*\)/g, '').trim();
    const query = `${cleanLocation || location}, ${city}${postalCode ? ' ' + postalCode : ''}, España`;
    return {
      mapEmbedUrl: `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=15&output=embed`,
      googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`,
      resolvedAddress: `${cleanLocation || location}, ${city}`,
    };
  }, [location, city, postalCode, coords]);

  return (
    <div className={`bg-[#F7F7F7] border border-[#1F4E5F]/15 rounded-2xl overflow-hidden flex flex-col gap-0 shadow-2xs ${className}`}>
      {/* Interactive Map Embed */}
      <div className="relative aspect-[21/9] sm:aspect-[24/9] w-full bg-slate-200 overflow-hidden">
        <iframe
          key={mapEmbedUrl}
          title={`Mapa de ${location}`}
          src={mapEmbedUrl}
          className="w-full h-full border-0 pointer-events-none opacity-90 contrast-[1.05]"
          loading="lazy"
        />
      </div>

      {/* Action Navigation Footer */}
      <div className="p-3 bg-white flex items-center justify-between gap-2 border-t border-[#1F4E5F]/10">
        <div className="flex items-center gap-2 min-w-0">
          <MapPin className="w-4 h-4 text-[#00B894] shrink-0" />
          <span className="text-xs font-bold text-[#1F4E5F] truncate">
            {resolvedAddress}
          </span>
        </div>

        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3.5 py-1.5 rounded-full bg-[#1F4E5F] hover:bg-[#163946] text-white text-xs font-extrabold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95 shrink-0"
        >
          <span>Abrir en Google Maps</span>
          <ExternalLink className="w-3 h-3 text-[#00B894]" />
        </a>
      </div>
    </div>
  );
};
