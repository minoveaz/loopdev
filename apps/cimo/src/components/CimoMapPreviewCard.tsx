import React, { useMemo, useState } from 'react';
import { ExternalLink, MapPin, Maximize2, Minimize2, Plus, Minus } from 'lucide-react';
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
  const [zoom, setZoom] = useState(16);
  const [isExpanded, setIsExpanded] = useState(false);

  const { mapEmbedUrl, googleMapsUrl, resolvedAddress } = useMemo(() => {
    // 1. Direct coordinates override
    if (coords && coords.lat && coords.lng) {
      const latLng = `${coords.lat},${coords.lng}`;
      return {
        mapEmbedUrl: `https://maps.google.com/maps?q=${latLng}&z=${zoom}&output=embed&t=m&iwloc=`,
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
        mapEmbedUrl: `https://maps.google.com/maps?q=${latLng}&z=${zoom}&output=embed&t=m&iwloc=`,
        googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(matchedVenue.address)}`,
        resolvedAddress: matchedVenue.address,
      };
    }

    // Fallback: clean location string from parentheses noise
    const cleanLocation = location.replace(/\s*\([^)]*\)/g, '').trim();
    const query = `${cleanLocation || location}, ${city}${postalCode ? ' ' + postalCode : ''}, España`;
    return {
      mapEmbedUrl: `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=${zoom}&output=embed&t=m&iwloc=`,
      googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`,
      resolvedAddress: `${cleanLocation || location}, ${city}`,
    };
  }, [location, city, postalCode, coords, zoom]);

  return (
    <div
      className={`shadow-2xs flex flex-col gap-0 overflow-hidden rounded-2xl border border-[#1F4E5F]/15 bg-[#F7F7F7] ${className}`}
    >
      {/* Interactive Map Embed */}
      <div
        className={`relative w-full overflow-hidden bg-slate-200 transition-all duration-300 ${isExpanded ? 'h-80 sm:h-96' : 'aspect-[21/9] sm:aspect-[24/9]'}`}
      >
        <iframe
          key={`${mapEmbedUrl}-${zoom}`}
          title={`Mapa de ${location}`}
          src={mapEmbedUrl}
          className="pointer-events-auto h-full w-full border-0 opacity-95 contrast-[1.03]"
          loading="lazy"
          allowFullScreen
        />

        {/* Floating Custom Map Controls Overlay (Zoom In, Zoom Out, Expand) */}
        <div className="absolute right-2.5 top-2.5 z-10 flex flex-col gap-1.5">
          <div className="backdrop-blur-xs flex flex-col overflow-hidden rounded-xl border border-[#1F4E5F]/15 bg-white/95 shadow-md">
            <button
              type="button"
              onClick={() => setZoom((prev) => Math.min(19, prev + 1))}
              className="flex cursor-pointer items-center justify-center border-b border-[#1F4E5F]/10 p-2 text-[#1F4E5F] transition-colors hover:bg-[#7FB77E]/15 hover:text-[#7FB77E]"
              title="Acercar mapa (Zoom In)"
              aria-label="Acercar mapa"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setZoom((prev) => Math.max(11, prev - 1))}
              className="flex cursor-pointer items-center justify-center p-2 text-[#1F4E5F] transition-colors hover:bg-[#7FB77E]/15 hover:text-[#7FB77E]"
              title="Alejar mapa (Zoom Out)"
              aria-label="Alejar mapa"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="backdrop-blur-xs flex cursor-pointer items-center justify-center rounded-xl border border-[#1F4E5F]/15 bg-white/95 p-2 text-[#1F4E5F] shadow-md transition-colors hover:bg-[#7FB77E]/15 hover:text-[#7FB77E]"
            title={isExpanded ? 'Reducir tamaño del mapa' : 'Agrandar mapa'}
            aria-label={isExpanded ? 'Reducir tamaño del mapa' : 'Agrandar mapa'}
          >
            {isExpanded ? (
              <Minimize2 className="h-3.5 w-3.5" />
            ) : (
              <Maximize2 className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Action Navigation Footer */}
      <div className="flex items-center justify-between gap-2 border-t border-[#1F4E5F]/10 bg-white p-3">
        <div className="flex min-w-0 items-center gap-2">
          <MapPin className="h-4 w-4 shrink-0 text-[#7FB77E]" />
          <span className="truncate text-xs font-bold text-[#1F4E5F]">{resolvedAddress}</span>
        </div>

        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="shadow-xs flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full bg-[#7FB77E] px-3.5 py-1.5 text-xs font-extrabold text-white transition-all hover:bg-[#6ea26d] active:scale-95"
        >
          <span>Abrir en Google Maps</span>
          <ExternalLink className="h-3 w-3 text-white" />
        </a>
      </div>
    </div>
  );
};
