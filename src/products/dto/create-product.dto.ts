import { z } from 'zod';

export const productFields = {
  name: z
    .string()
    .trim()
    .min(2, 'Nome deve ter ao menos 2 caracteres')
    .max(120),
  price: z
    .number()
    .positive('Preço deve ser maior que zero')
    .max(99_999_999.99),
  stock: z
    .number()
    .int('Estoque deve ser um número inteiro')
    .min(0, 'Estoque não pode ser negativo'),
  categoryId: z.uuid('categoryId deve ser um UUID válido'),
};

export const createProductSchema = z.object({
  ...productFields,
  stock: productFields.stock.default(0),
});

export type CreateProductDto = z.infer<typeof createProductSchema>;
