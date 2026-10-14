import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z.string().trim().min(2, 'Nome deve ter ao menos 2 caracteres').max(80),
});

export type CreateCategoryDto = z.infer<typeof createCategorySchema>;
