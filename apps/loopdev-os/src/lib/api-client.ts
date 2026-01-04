import { createClient } from './supabase/client';
import { Brand, CreateBrandInput } from '@loopdev/contracts';

/**
 * Brand Hub API Service
 * Encapsula todas las llamadas a Supabase para el módulo de marcas.
 */
export const brandsApi = {
  /**
   * Obtiene todas las marcas del tenant actual
   */
  async getAll(): Promise<Brand[]> {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('brands')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching brands:', error);
      throw new Error(error.message);
    }

    // Adaptamos los nombres de las columnas de Postgres (snake_case) a los tipos de TS (camelCase)
    // Supabase devuelve snake_case por defecto si no se mapea.
    return (data || []).map(this.mapBrand);
  },

  /**
   * Crea una nueva marca
   */
  async create(input: CreateBrandInput): Promise<Brand> {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('brands')
      .insert({
        name: input.name,
        description: input.description,
        tenant_id: input.tenantId,
        status: input.status,
        logo_url: input.logoUrl,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating brand:', error);
      throw new Error(error.message);
    }

    return this.mapBrand(data);
  },

  /**
   * Mapper interno para asegurar que el Frontend recibe camelCase
   */
  mapBrand(raw: any): Brand {
    return {
      id: raw.id,
      tenantId: raw.tenant_id,
      name: raw.name,
      description: raw.description,
      status: raw.status,
      logoUrl: raw.logo_url,
      createdAt: raw.created_at,
      updatedAt: raw.updated_at,
    };
  }
};
