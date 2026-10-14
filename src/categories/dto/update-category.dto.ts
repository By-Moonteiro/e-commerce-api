import { z } from 'zod';
import { createCategorySchema } from './create-category.dto.js';

export const updateCategorySchema = createCategorySchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Informe ao menos um campo para atualização.',
  });

export type UpdateCategoryDto = z.infer<typeof updateCategorySchema>;
