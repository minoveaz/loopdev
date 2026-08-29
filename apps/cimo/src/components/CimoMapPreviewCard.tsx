import React, { useMemo } from 'react';
import { ExternalLink, MapPin, Navigation, Sparkles } from 'lucide-react';
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
  const { mapEmbedUrl, googleMapsUrl, resolvedAddress, isExactVenue } = useMemo(() => {
    // 1. Direct coordinates override
    if (coords && coords.lat && coords.lng) {
      const latLng = `${coords.lat},${coords.lng}`;
      return {
        mapEmbedUrl: `https://maps.google.com/maps?q=${latLng}&z=16&output=embed`,
        googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${latLng}`,
        resolvedAddress: `${location}, ${city}`,
        isExactVenue: true,
      };
    }

    const locClean = cleanText(location);
    const cityClean = cleanText(city);

    // Look for exact/partial match in our curated GPS coordinates database
    const matchedVenue = POPULAR_SPORTS_VENUES.find((v) => {
      const vName = cleanText(v.name);
      const vAddr = cleanText(v.address);
      const vCity = cleanText(v.city);

      // Match city if specified
      if (cityClean && vCity && !vCity.includes(cityClean) && !cityClean.includes(vCity)) {
        return false;
      }

      // Match name or address
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
        isExactVenue: true,
      };
    }

    // Fallback: clean location string from parentheses noise
    const cleanLocation = location.replace(/\s*\([^)]*\)/g, '').trim();
    const query = `${cleanLocation || location}, ${city}${postalCode ? ' ' + postalCode : ''}, España`;
    return {
      mapEmbedUrl: `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=15&output=embed`,
      googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`,
      resolvedAddress: `${cleanLocation || location}, ${city}`,
      isExactVenue: false,
    };
  }, [location, city, postalCode]);

  return (
    <div className={`bg-[#F7F7F7] border border-[#1F4E5F]/15 rounded-2xl overflow-hidden flex flex-col gap-0 shadow-2xs ${className}`}>
      {/* Interactive Map Embed / Preview */}
      <div className="relative aspect-[21/9] sm:aspect-[24/9] w-full bg-slate-200 overflow-hidden">
        <iframe
          key={mapEmbedUrl}
          title={`Mapa de ${location}`}
          src={mapEmbedUrl}
          className="w-full h-full border-0 pointer-events-none opacity-90 contrast-[1.05]"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1F4E5F]/85 via-transparent to-transparent pointer-events-none" />

        {/* Floating Pin Badge */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white pointer-events-none">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-full bg-[#00B894] text-white flex items-center justify-center shrink-0 shadow-md">
              <MapPin className="w-4 h-4 fill-white" />
            </div>
            <div className="truncate">
              <span className="text-xs font-black block truncate leading-tight drop-shadow-xs">{location}</span>
              <span className="text-[10px] font-bold text-white/85 block truncate">
                {resolvedAddress}
              </span>
            </div>
          </div>
          {isExactVenue && (
            <span className="px-2 py-0.5 rounded-full bg-[#00B894] text-white text-[9px] font-black uppercase tracking-wider shadow-xs shrink-0 hidden sm:inline-block">
              GPS Exacto
            </span>
          )}
        </div>
      </div>

      {/* Action Navigation Footer */}
      <div className="p-3 bg-white flex items-center justify-between gap-2 border-t border-[#1F4E5F]/10">
        <span className="text-[11px] font-extrabold text-[#1F4E5F]/70 flex items-center gap-1.5 truncate">
          <Navigation className="w-3.5 h-3.5 text-[#00B894] shrink-0" />
          <span className="truncate">{resolvedAddress}</span>
        </span>

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
