import { z } from 'zod';

export const BrandStatusSchema = z.enum(['draft', 'published', 'archived']);

export const BrandSchema = z.object({
  id: z.string().uuid({ message: "Invalid Brand ID format" }),
  tenantId: z.string().uuid({ message: "Invalid Tenant ID format" }),
  name: z.string().min(2, "Brand name must be at least 2 characters").max(50),
  description: z.string().max(500).optional(),
  status: BrandStatusSchema.default('draft'),
  logoUrl: z.string().url().optional().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// Tipos inferidos para el Frontend y Backend
export type Brand = z.infer<typeof BrandSchema>;
export type BrandStatus = z.infer<typeof BrandStatusSchema>;

// Esquema para la creación (sin ID ni fechas, las genera el server)
export const CreateBrandSchema = BrandSchema.omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

export type CreateBrandInput = z.infer<typeof CreateBrandSchema>;
