import { z } from 'zod';

export const findProductsQuerySchema = z.object({
  categoryId: z.uuid('categoryId deve ser um UUID válido').optional(),
  search: z.string().trim().min(1).max(100).optional(),
});

export type FindProductsQueryDto = z.infer<typeof findProductsQuerySchema>;
