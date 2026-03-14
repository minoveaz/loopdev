'use client';

import { Heading, LpdText, Button, Icon } from '@loopdev/ui';

// Datos de ejemplo (placeholder)
const mockBrands = [
  { id: '1', name: 'Acme Corp', description: 'Corporate brand', status: 'published' as const, logoUrl: null, updatedAt: new Date() },
  { id: '2', name: 'Loop Labs', description: 'Innovation hub', status: 'draft' as const, logoUrl: null, updatedAt: new Date() },
  { id: '3', name: 'Neon Future', description: 'Tech brand', status: 'published' as const, logoUrl: null, updatedAt: new Date() },
];

// Componente para visualizar una tarjeta de marca
const BrandCard = ({ brand }: { brand: any }) => (
  <div className="glass-panel p-6 rounded-xl border border-white/5 hover:border-primary/50 transition-all duration-300 group cursor-pointer bg-surface-dark/40">
    <div className="flex justify-between items-start mb-6">
      <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-white/5 to-white/0 border border-white/10 flex items-center justify-center overflow-hidden">
        {brand.logoUrl ? (
          <img src={brand.logoUrl} alt={brand.name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-xl font-bold text-white/20 group-hover:text-white transition-colors">
            {brand.name.substring(0, 2).toUpperCase()}
          </span>
        )}
      </div>
      <div className={`px-2 py-1 rounded text-[10px] uppercase font-bold tracking-wider border ${
        brand.status === 'published' 
          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
          : brand.status === 'draft'
          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
          : 'bg-slate-500/10 text-slate-400 border-slate-500/20'
      }`}>
        {brand.status}
      </div>
    </div>
    
    <Heading size="md" className="text-white mb-1 group-hover:text-primary transition-colors">{brand.name}</Heading>
    <LpdText size="sm" className="text-text-muted mb-4 truncate">
      {brand.description}
    </LpdText>
    
    <div className="flex items-center gap-4 text-xs text-text-muted border-t border-white/5 pt-4">
      <div className="flex items-center gap-1">
        <Icon name="palette" size="sm" /> <span>Tokens ready</span>
      </div>
      <div className="flex items-center gap-1">
        <Icon name="history" size="sm" /> 
        <span>{new Date(brand.updatedAt).toLocaleDateString()}</span>
      </div>
    </div>
  </div>
);

const SkeletonCard = () => (
  <div className="glass-panel p-6 rounded-xl border border-white/5 bg-surface-dark/40 animate-pulse">
    <div className="flex justify-between mb-6">
      <div className="w-16 h-16 rounded-lg bg-white/5"></div>
      <div className="w-16 h-6 rounded bg-white/5"></div>
    </div>
    <div className="h-6 w-3/4 bg-white/5 rounded mb-2"></div>
    <div className="h-4 w-full bg-white/5 rounded mb-4"></div>
    <div className="h-8 w-full bg-white/5 rounded-t border-t border-white/5 mt-4"></div>
  </div>
);

export default function BrandHubPage() {
  // Usar datos mock en lugar de hacer queries a la API
  const brands = mockBrands;
  const isLoading = false;
  const error = null;

  return (
    <div className="p-8 lg:p-10 max-w-7xl mx-auto h-full flex flex-col">
      
      {/* Header del Módulo */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <div className="flex items-center gap-2 mb-2">
             <span className="text-primary/60 text-xs font-mono uppercase tracking-widest">Module 01</span>
             <span className="h-px w-8 bg-primary/20"></span>
          </div>
          <Heading size="2xl" weight="bold" className="text-white">Brand Hub</Heading>
          <LpdText className="text-text-muted">Centraliza y gobierna la identidad visual de tus productos.</LpdText>
        </div>
        
        {/* Acciones */}
        <div className="flex gap-3">
          <Button variant="ghost" startIcon="filter_list">Filter</Button>
          <Button variant="primary" startIcon="add">New Brand</Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6 flex items-center gap-3">
          <Icon name="error" />
          <LpdText size="sm">Error loading brands. Please try again later.</LpdText>
        </div>
      )}

      {/* Grid de Contenido */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading ? (
          // Mostrar Skeletons mientras carga
          Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
        ) : brands && brands.length > 0 ? (
          // Mostrar Marcas Reales
          brands.map((brand) => (
            <BrandCard key={brand.id} brand={brand} />
          ))
        ) : (
          // Empty State
          <div className="col-span-full border border-dashed border-white/10 rounded-2xl p-12 flex flex-col items-center justify-center text-center bg-white/2">
             <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                <Icon name="auto_awesome_motion" className="text-text-muted" size="md" />
             </div>
             <Heading size="sm" className="text-white mb-2">No brands found</Heading>
             <LpdText size="sm" className="text-text-muted mb-6 max-w-xs">
               You haven't created any brands yet. Start by creating your first brand identity.
             </LpdText>
             <Button variant="primary" startIcon="add">Create First Brand</Button>
          </div>
        )}
        
        {/* Tarjeta de "Crear Nuevo" (Solo si hay marcas) */}
        {!isLoading && brands && brands.length > 0 && (
          <button className="border border-dashed border-white/10 rounded-xl p-6 flex flex-col items-center justify-center gap-4 text-text-muted hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 min-h-[240px]">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
              <Icon name="add" />
            </div>
            <span className="font-medium">Create another brand</span>
          </button>
        )}
      </div>

    </div>
  );
}
