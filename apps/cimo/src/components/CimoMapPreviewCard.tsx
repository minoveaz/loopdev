import React from 'react';
import { ExternalLink, MapPin, Navigation, Share2 } from 'lucide-react';

export interface CimoMapPreviewCardProps {
  location: string;
  city: string;
  postalCode?: string;
  className?: string;
}

export const CimoMapPreviewCard: React.FC<CimoMapPreviewCardProps> = ({
  location,
  city,
  postalCode,
  className = '',
}) => {
  const fullQuery = `${location}, ${city}${postalCode ? ' ' + postalCode : ''}, España`;
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullQuery)}`;

  // OSM embed URL for visual map rendering without mandatory API Key
  const encodedQuery = encodeURIComponent(fullQuery);
  const mapEmbedUrl = `https://maps.google.com/maps?q=${encodedQuery}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className={`bg-[#F7F7F7] border border-[#1F4E5F]/15 rounded-2xl overflow-hidden flex flex-col gap-0 shadow-2xs ${className}`}>
      {/* Interactive Map Embed / Preview */}
      <div className="relative aspect-[21/9] sm:aspect-[24/9] w-full bg-slate-200 overflow-hidden">
        <iframe
          title={`Mapa de ${location}`}
          src={mapEmbedUrl}
          className="w-full h-full border-0 pointer-events-none opacity-90 contrast-[1.05]"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1F4E5F]/80 via-transparent to-transparent pointer-events-none" />

        {/* Floating Pin Badge */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white pointer-events-none">
          <div className="flex items-center gap-1.5 min-w-0">
            <div className="w-6 h-6 rounded-full bg-[#00B894] text-white flex items-center justify-center shrink-0 shadow-xs">
              <MapPin className="w-3.5 h-3.5 fill-white" />
            </div>
            <div className="truncate">
              <span className="text-xs font-black block truncate leading-tight drop-shadow-xs">{location}</span>
              <span className="text-[10px] font-bold text-white/80 block truncate">
                {city} {postalCode ? `• CP ${postalCode}` : ''}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Navigation Footer */}
      <div className="p-3 bg-white flex items-center justify-between gap-2 border-t border-[#1F4E5F]/10">
        <span className="text-[11px] font-extrabold text-[#1F4E5F]/70 flex items-center gap-1">
          <Navigation className="w-3.5 h-3.5 text-[#00B894]" />
          <span>Navegación GPS exacta</span>
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
