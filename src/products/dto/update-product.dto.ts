import { z } from 'zod';
import { productFields } from './create-product.dto.js';

export const updateProductSchema = z
  .object(productFields)
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Informe ao menos um campo para atualização.',
  });

export type UpdateProductDto = z.infer<typeof updateProductSchema>;
