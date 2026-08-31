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
    <div className={`bg-[#F7F7F7] border border-[#1F4E5F]/15 rounded-2xl overflow-hidden flex flex-col gap-0 shadow-2xs ${className}`}>
      {/* Interactive Map Embed */}
      <div className={`relative w-full bg-slate-200 overflow-hidden transition-all duration-300 ${isExpanded ? 'h-80 sm:h-96' : 'aspect-[21/9] sm:aspect-[24/9]'}`}>
        <iframe
          key={`${mapEmbedUrl}-${zoom}`}
          title={`Mapa de ${location}`}
          src={mapEmbedUrl}
          className="w-full h-full border-0 pointer-events-auto opacity-95 contrast-[1.03]"
          loading="lazy"
          allowFullScreen
        />

        {/* Floating Custom Map Controls Overlay (Zoom In, Zoom Out, Expand) */}
        <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 z-10">
          <div className="bg-white/95 backdrop-blur-xs rounded-xl shadow-md border border-[#1F4E5F]/15 overflow-hidden flex flex-col">
            <button
              type="button"
              onClick={() => setZoom((prev) => Math.min(19, prev + 1))}
              className="p-2 hover:bg-[#7FB77E]/15 text-[#1F4E5F] hover:text-[#7FB77E] transition-colors cursor-pointer border-b border-[#1F4E5F]/10 flex items-center justify-center"
              title="Acercar mapa (Zoom In)"
              aria-label="Acercar mapa"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setZoom((prev) => Math.max(11, prev - 1))}
              className="p-2 hover:bg-[#7FB77E]/15 text-[#1F4E5F] hover:text-[#7FB77E] transition-colors cursor-pointer flex items-center justify-center"
              title="Alejar mapa (Zoom Out)"
              aria-label="Alejar mapa"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 bg-white/95 backdrop-blur-xs hover:bg-[#7FB77E]/15 text-[#1F4E5F] hover:text-[#7FB77E] rounded-xl shadow-md border border-[#1F4E5F]/15 transition-colors cursor-pointer flex items-center justify-center"
            title={isExpanded ? 'Reducir tamaño del mapa' : 'Agrandar mapa'}
            aria-label={isExpanded ? 'Reducir tamaño del mapa' : 'Agrandar mapa'}
          >
            {isExpanded ? (
              <Minimize2 className="w-3.5 h-3.5" />
            ) : (
              <Maximize2 className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Action Navigation Footer */}
      <div className="p-3 bg-white flex items-center justify-between gap-2 border-t border-[#1F4E5F]/10">
        <div className="flex items-center gap-2 min-w-0">
          <MapPin className="w-4 h-4 text-[#7FB77E] shrink-0" />
          <span className="text-xs font-bold text-[#1F4E5F] truncate">
            {resolvedAddress}
          </span>
        </div>

        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3.5 py-1.5 rounded-full bg-[#7FB77E] hover:bg-[#6ea26d] text-white text-xs font-extrabold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95 shrink-0"
        >
          <span>Abrir en Google Maps</span>
          <ExternalLink className="w-3 h-3 text-white" />
        </a>
      </div>
    </div>
  );
};
